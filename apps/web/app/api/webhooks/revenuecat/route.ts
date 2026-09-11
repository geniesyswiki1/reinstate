import { NextResponse } from 'next/server';
import { getCaseType, type Platform, type Source, type Tier } from '@reinstate/shared';
import { db } from '@/lib/supabase';
import { createCase } from '@/lib/cases';
import { sendCaseLink } from '@/lib/email';
import { notifyOps, captureError } from '@/lib/ops';

export const runtime = 'nodejs';

const PRODUCT_TIERS: Record<string, Tier> = {
  case_amazon: 'amazon',
  case_marketplace: 'marketplace',
  case_payments: 'payments',
  case_addon: 'addon',
};

interface ClassificationRow {
  platform: string | null;
  case_type: string | null;
  confidence: number | null;
  notice_text: string | null;
  deadline: string | null;
}

/** RevenueCat posts mobile purchases into the same purchases table (section 4.6). */
export async function POST(request: Request) {
  const secret = process.env.REVENUECAT_WEBHOOK_SECRET;
  const auth = request.headers.get('authorization');
  if (!secret || auth !== `Bearer ${secret}`) {
    return NextResponse.json({ error: 'bad signature' }, { status: 401 });
  }

  const body = (await request.json()) as {
    event?: {
      type?: string;
      id?: string;
      product_id?: string;
      price_in_purchased_currency?: number;
      currency?: string;
      subscriber_attributes?: Record<string, { value?: string }>;
      store?: string;
    };
  };

  const event = body.event;
  if (!event || !['NON_RENEWING_PURCHASE', 'INITIAL_PURCHASE'].includes(event.type ?? '')) {
    return NextResponse.json({ ok: true, ignored: true });
  }

  const email = event.subscriber_attributes?.['$email']?.value;
  const classificationId = event.subscriber_attributes?.['classification_id']?.value;
  if (!email) return NextResponse.json({ error: 'no email on subscriber' }, { status: 400 });

  try {
    const existing = await db()
      .from('purchases')
      .select('id')
      .eq('provider', 'revenuecat')
      .eq('provider_order_id', event.id ?? '')
      .maybeSingle();
    if (existing.data) return NextResponse.json({ ok: true, duplicate: true });

    let classification: ClassificationRow | null = null;
    if (classificationId) {
      const { data } = await db()
        .from('classifications')
        .select('platform, case_type, confidence, notice_text, deadline')
        .eq('id', classificationId)
        .maybeSingle();
      classification = (data as ClassificationRow) ?? null;
    }

    const source: Source = event.store === 'PLAY_STORE' ? 'android' : 'ios';
    const record = await createCase({
      email,
      platform: (classification?.platform ?? null) as Platform | null,
      caseType: classification?.case_type ?? null,
      confidence: classification?.confidence ?? null,
      noticeText: classification?.notice_text ?? null,
      deadline: classification?.deadline ?? null,
      purchaseId: null,
      source,
    });

    const { data: purchase } = await db()
      .from('purchases')
      .insert({
        provider: 'revenuecat',
        provider_order_id: event.id ?? crypto.randomUUID(),
        email,
        tier: PRODUCT_TIERS[event.product_id ?? ''] ?? 'marketplace',
        amount: Math.round((event.price_in_purchased_currency ?? 0) * 100),
        currency: event.currency ?? 'GBP',
        case_id: record.id,
      })
      .select('id')
      .single();

    if (purchase?.id) {
      await db().from('cases').update({ purchase_id: purchase.id }).eq('id', record.id);
    }

    const ct = getCaseType(record.case_type);
    await sendCaseLink(email, record.token, ct?.name ?? 'your appeal');
    await notifyOps('purchase', { provider: 'revenuecat', source, case_type: record.case_type });

    return NextResponse.json({ ok: true, case_token: record.token });
  } catch (err) {
    captureError(err, { route: 'webhooks/revenuecat' });
    return NextResponse.json({ error: 'failed' }, { status: 500 });
  }
}
