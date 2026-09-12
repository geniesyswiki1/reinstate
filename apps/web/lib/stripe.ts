import Stripe from 'stripe';
import type { Tier } from '@reinstate/shared';

/**
 * Stripe Managed Payments, section 4.6. Managed Payments is Stripe acting as merchant of record,
 * so it carries the indirect tax compliance, fraud, disputes and transaction-level support that
 * the original spec bought from Lemon Squeezy. See CLAUDE.md: this is the standing choice for
 * every app, and the `managed_payments` flag below is what makes it true. Drop the flag and we
 * quietly become the merchant of record ourselves, which is the one outcome to avoid.
 *
 * Managed Payments needs 2025-03-31.basil or later. Pinning it here rather than taking the
 * account default means a dashboard change cannot silently move us off a supported version.
 */
const API_VERSION = '2025-03-31.basil';

let client: Stripe | null = null;

export function stripe(): Stripe | null {
  const key = process.env.STRIPE_SECRET_KEY?.trim();
  if (!key) return null;
  if (!client) {
    client = new Stripe(key, { apiVersion: API_VERSION as Stripe.LatestApiVersion });
  }
  return client;
}

/**
 * One Stripe price per tier, section 4.6. Prices live in the dashboard so changing what we charge
 * does not need a deploy, and so Managed Payments can read the product's tax code.
 */
export function priceForTier(tier: Tier): string | null {
  const map: Record<Tier, string | undefined> = {
    amazon: process.env.STRIPE_PRICE_AMAZON,
    marketplace: process.env.STRIPE_PRICE_MARKETPLACE,
    payments: process.env.STRIPE_PRICE_PAYMENTS,
    addon: process.env.STRIPE_PRICE_ADDON,
  };
  return map[tier]?.trim() || null;
}

export function tierForPrice(priceId: string): Tier {
  if (priceId === process.env.STRIPE_PRICE_AMAZON?.trim()) return 'amazon';
  if (priceId === process.env.STRIPE_PRICE_PAYMENTS?.trim()) return 'payments';
  if (priceId === process.env.STRIPE_PRICE_ADDON?.trim()) return 'addon';
  return 'marketplace';
}

/**
 * The classification id rides on the session so the webhook can build the case from the free
 * classification the seller already did, rather than asking them to paste the notice again after
 * paying. It goes in both places on purpose: `client_reference_id` is the field Stripe surfaces in
 * the dashboard, `metadata` is the one that survives into the PaymentIntent for support queries.
 */
export interface CheckoutRequest {
  tier: Tier;
  classificationId: string;
  email?: string;
  siteUrl: string;
}

export async function createCheckoutSession(req: CheckoutRequest): Promise<string | null> {
  const s = stripe();
  const price = priceForTier(req.tier);
  if (!s || !price) return null;

  const session = await s.checkout.sessions.create({
    mode: 'payment',
    line_items: [{ price, quantity: 1 }],
    managed_payments: { enabled: true },
    client_reference_id: req.classificationId,
    metadata: { classification_id: req.classificationId, tier: req.tier },
    customer_email: req.email || undefined,
    success_url: `${req.siteUrl}/case?paid=1&session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${req.siteUrl}/pricing?cancelled=1`,
  });

  return session.url;
}

/**
 * Throws if the signature does not verify, which is the point: an unverified body must never reach
 * the fulfilment path. The SDK checks the timestamp as well as the digest, so a replayed request
 * outside the tolerance is rejected too.
 */
export function verifyWebhook(raw: string, signature: string | null): Stripe.Event | null {
  const s = stripe();
  const secret = process.env.STRIPE_WEBHOOK_SECRET?.trim();
  if (!s || !secret || !signature) return null;
  try {
    return s.webhooks.constructEvent(raw, signature, secret);
  } catch {
    return null;
  }
}

export interface StripeOrder {
  orderId: string;
  email: string;
  /** Minor units, as Stripe reports them. */
  total: number;
  currency: string;
  priceId: string;
  classificationId: string | null;
}

/**
 * A completed session is only fulfillable once the money is actually there. Card payments arrive
 * `paid` on `checkout.session.completed`; delayed methods arrive `unpaid` and settle later on
 * `checkout.session.async_payment_succeeded`. Fulfilling the unpaid case would hand over an appeal
 * for a payment that can still fail.
 */
export function orderFromSession(session: Stripe.Checkout.Session): StripeOrder | null {
  if (session.payment_status !== 'paid' && session.payment_status !== 'no_payment_required') {
    return null;
  }
  const email = session.customer_details?.email ?? session.customer_email;
  if (!email) return null;

  return {
    orderId: session.id,
    email,
    total: session.amount_total ?? 0,
    currency: (session.currency ?? 'gbp').toUpperCase(),
    priceId: session.line_items?.data[0]?.price?.id ?? '',
    classificationId: session.metadata?.classification_id ?? session.client_reference_id ?? null,
  };
}
