import { NextResponse } from 'next/server';
import type Stripe from 'stripe';
import { getCaseType, type Platform } from '@reinstate/shared';
import { orderFromSession, stripe, tierForPrice, verifyWebhook, type StripeOrder } from '@/lib/stripe';
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

/**
 * Fulfilment events, per the Managed Payments checkout guide. `completed` covers cards, which are
 * paid by the time the session closes. `async_payment_succeeded` covers delayed methods, which
 * close the session unpaid and settle minutes or days later; without it those customers pay and
 * never receive a case. `async_payment_failed` is logged rather than fulfilled.
 */
const FULFIL = new Set(['checkout.session.completed', 'checkout.session.async_payment_succeeded']);

export async function POST(request: Request) {
  const raw = await request.text();
  const event = verifyWebhook(raw, request.headers.get('stripe-signature'));
  if (!event) {
    return NextResponse.json({ error: 'bad signature' }, { status: 401 });
  }

  if (event.type === 'checkout.session.async_payment_failed') {
    const failed = event.data.object as Stripe.Checkout.Session;
    captureError(new Error('async payment failed'), { route: 'webhooks/stripe', session: failed.id });
    return NextResponse.json({ ok: true, ignored: true });
  }

  if (!FULFIL.has(event.type)) return NextResponse.json({ ok: true, ignored: true });

  const session = event.data.object as Stripe.Checkout.Session;

  let order: StripeOrder | null;
  try {
    /**
     * Line items are not on the session that arrives in the event, and the price id is how we know
     * which tier was bought, so re-read the session with them expanded. This also means we act on
     * Stripe's current view of the payment rather than a snapshot taken when the event was queued.
     */
    const s = stripe();
    const full = s
      ? await s.checkout.sessions.retrieve(session.id, { expand: ['line_items'] })
      : session;
    order = orderFromSession(full);
  } catch (err) {
    captureError(err, { route: 'webhooks/stripe', session: session.id, step: 'retrieve' });
    return NextResponse.json({ error: 'failed' }, { status: 500 });
  }

  if (!order) return NextResponse.json({ ok: true, unpaid: true });

  try {
    // Idempotent on provider_order_id (section 4.6). completed and async_payment_succeeded can
    // both fire for one session, and Stripe redelivers on any non-2xx, so this runs often.
    const existing = await db()
      .from('purchases')
      .select('id, case_id')
      .eq('provider', 'stripe')
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

    const tier = tierForPrice(order.priceId);

    const { data: purchase } = await db()
      .from('purchases')
      .insert({
        provider: 'stripe',
        provider_order_id: order.orderId,
        email: order.email,
        tier,
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
      provider: 'stripe',
      tier,
      amount: order.total,
      currency: order.currency,
      case_type: record.case_type,
    });

    return NextResponse.json({ ok: true, case_token: record.token });
  } catch (err) {
    captureError(err, { route: 'webhooks/stripe', order: order.orderId });
    return NextResponse.json({ error: 'failed' }, { status: 500 });
  }
}
