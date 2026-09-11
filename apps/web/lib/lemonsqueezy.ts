import { createHmac, timingSafeEqual } from 'node:crypto';
import type { Tier } from '@reinstate/shared';

/** Section 4.6. One variant per tier. */
export function variantForTier(tier: Tier): string | null {
  const map: Record<Tier, string | undefined> = {
    amazon: process.env.LEMONSQUEEZY_VARIANT_AMAZON,
    marketplace: process.env.LEMONSQUEEZY_VARIANT_MARKETPLACE,
    payments: process.env.LEMONSQUEEZY_VARIANT_PAYMENTS,
    addon: process.env.LEMONSQUEEZY_VARIANT_ADDON,
  };
  return map[tier] ?? null;
}

/**
 * Checkout overlay URL carrying the classification id, so the webhook can create the
 * case from the free classification and email the link.
 */
export function checkoutUrl(tier: Tier, classificationId: string, email?: string): string | null {
  const store = process.env.LEMONSQUEEZY_STORE_ID;
  const variant = variantForTier(tier);
  if (!store || !variant) return null;

  const url = new URL(`https://${store}.lemonsqueezy.com/buy/${variant}`);
  url.searchParams.set('embed', '1');
  url.searchParams.set('media', '0');
  url.searchParams.set('logo', '0');
  url.searchParams.set('checkout[custom][classification_id]', classificationId);
  if (email) url.searchParams.set('checkout[email]', email);
  return url.toString();
}

export function verifySignature(rawBody: string, signature: string | null): boolean {
  const secret = process.env.LEMONSQUEEZY_WEBHOOK_SECRET;
  if (!secret || !signature) return false;
  const digest = createHmac('sha256', secret).update(rawBody).digest('hex');
  const a = Buffer.from(digest, 'utf8');
  const b = Buffer.from(signature, 'utf8');
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

export interface LemonOrder {
  orderId: string;
  email: string;
  total: number;
  currency: string;
  variantId: string;
  classificationId: string | null;
}

export function parseOrder(payload: unknown): LemonOrder | null {
  const p = payload as {
    meta?: { event_name?: string; custom_data?: Record<string, string> };
    data?: {
      id?: string;
      attributes?: {
        user_email?: string;
        total?: number;
        currency?: string;
        first_order_item?: { variant_id?: number | string };
      };
    };
  };
  if (p?.meta?.event_name !== 'order_created') return null;
  const attrs = p.data?.attributes;
  if (!p.data?.id || !attrs?.user_email) return null;

  return {
    orderId: String(p.data.id),
    email: attrs.user_email,
    total: Number(attrs.total ?? 0),
    currency: String(attrs.currency ?? 'GBP'),
    variantId: String(attrs.first_order_item?.variant_id ?? ''),
    classificationId: p.meta?.custom_data?.classification_id ?? null,
  };
}

export function tierForVariant(variantId: string): Tier {
  if (variantId === process.env.LEMONSQUEEZY_VARIANT_AMAZON) return 'amazon';
  if (variantId === process.env.LEMONSQUEEZY_VARIANT_PAYMENTS) return 'payments';
  if (variantId === process.env.LEMONSQUEEZY_VARIANT_ADDON) return 'addon';
  return 'marketplace';
}
