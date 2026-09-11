import { NextResponse } from 'next/server';
import { getCaseType, type Platform } from '@reinstate/shared';
import { parseOrder, tierForVariant, verifySignature } from '@/lib/lemonsqueezy';
import { db } from '@/lib/supabase';
import { createCase } from '@/lib/cases';
import { sendCaseLink } from '@/lib/email';
import { notifyOps, captureError } from '@/lib/ops';

export const runtime = 'nodejs';

interface ClassificationRow {
  platform: string | null;
  case_type: string | null;
  confidence: number | null;
  notice_text: string | null;
  deadline: string | null;
}

export async function POST(request: Request) {
  const raw = await request.text();
  if (!verifySignature(raw, request.headers.get('x-signature'))) {
    return NextResponse.json({ error: 'bad signature' }, { status: 401 });
  }

  const order = parseOrder(JSON.parse(raw));
  if (!order) return NextResponse.json({ ok: true, ignored: true });

  try {
    // Idempotent on provider_order_id (section 4.6).
    const existing = await db()
      .from('purchases')
      .select('id, case_id')
      .eq('provider', 'lemonsqueezy')
      .eq('provider_order_id', order.orderId)
      .maybeSingle();
    if (existing.data) return NextResponse.json({ ok: true, duplicate: true });

    let classification: ClassificationRow | null = null;

    if (order.classificationId) {
      const { data } = await db()
        .from('classifications')
        .select('platform, case_type, confidence, notice_text, deadline')
        .eq('id', order.classificationId)
        .maybeSingle();
      classification = (data as ClassificationRow) ?? null;
    }

    const record = await createCase({
      email: order.email,
      platform: (classification?.platform ?? null) as Platform | null,
      caseType: classification?.case_type ?? null,
      confidence: classification?.confidence ?? null,
      noticeText: classification?.notice_text ?? null,
      deadline: classification?.deadline ?? null,
      purchaseId: null,
      source: 'web',
    });

    const { data: purchase } = await db()
      .from('purchases')
      .insert({
        provider: 'lemonsqueezy',
        provider_order_id: order.orderId,
        email: order.email,
        tier: tierForVariant(order.variantId),
        amount: order.total,
        currency: order.currency,
        case_id: record.id,
      })
      .select('id')
      .single();

    if (purchase?.id) {
      await db().from('cases').update({ purchase_id: purchase.id }).eq('id', record.id);
    }

    const ct = getCaseType(record.case_type);
    await sendCaseLink(order.email, record.token, ct?.name ?? 'your appeal');
    await notifyOps('purchase', {
      provider: 'lemonsqueezy',
      tier: tierForVariant(order.variantId),
      amount: order.total,
      currency: order.currency,
      case_type: record.case_type,
    });

    return NextResponse.json({ ok: true, case_token: record.token });
  } catch (err) {
    captureError(err, { route: 'webhooks/lemonsqueezy', order: order.orderId });
    return NextResponse.json({ error: 'failed' }, { status: 500 });
  }
}
