import type { CaseType, Platform, Tier } from './types';

import amazonInauthentic from '../casetypes/amazon-inauthentic.json';
import amazonRelatedAccount from '../casetypes/amazon-related-account.json';
import amazonRestrictedProducts from '../casetypes/amazon-restricted-products.json';
import amazonReviewManipulation from '../casetypes/amazon-review-manipulation.json';
import amazonDropShipping from '../casetypes/amazon-drop-shipping.json';
import amazonIpComplaint from '../casetypes/amazon-ip-complaint.json';
import amazonAccountHealth from '../casetypes/amazon-account-health.json';
import amazonAsinRemoved from '../casetypes/amazon-asin-removed.json';
import amazonVerificationFailed from '../casetypes/amazon-verification-failed.json';
import etsyShopSuspended from '../casetypes/etsy-shop-suspended.json';
import etsyHandmadePolicy from '../casetypes/etsy-handmade-policy.json';
import etsyIp from '../casetypes/etsy-ip.json';
import ebayMc011 from '../casetypes/ebay-mc011.json';
import ebayBelowStandard from '../casetypes/ebay-below-standard.json';
import ebayVero from '../casetypes/ebay-vero.json';
import tiktokShopDeactivated from '../casetypes/tiktok-shop-deactivated.json';
import paypalLimitation from '../casetypes/paypal-limitation.json';
import stripeAccountReview from '../casetypes/stripe-account-review.json';

export const CASE_TYPES: CaseType[] = [
  amazonInauthentic,
  amazonRelatedAccount,
  amazonRestrictedProducts,
  amazonReviewManipulation,
  amazonDropShipping,
  amazonIpComplaint,
  amazonAccountHealth,
  amazonAsinRemoved,
  amazonVerificationFailed,
  etsyShopSuspended,
  etsyHandmadePolicy,
  etsyIp,
  ebayMc011,
  ebayBelowStandard,
  ebayVero,
  tiktokShopDeactivated,
  paypalLimitation,
  stripeAccountReview,
] as unknown as CaseType[];

export const CASE_TYPES_BY_ID: Record<string, CaseType> = Object.fromEntries(
  CASE_TYPES.map((c) => [c.id, c]),
);

export function getCaseType(id: string | null | undefined): CaseType | null {
  if (!id) return null;
  return CASE_TYPES_BY_ID[id] ?? null;
}

export function caseTypesForPlatform(platform: Platform): CaseType[] {
  return CASE_TYPES.filter((c) => c.platform === platform);
}

export const PLATFORM_LABELS: Record<Platform, string> = {
  amazon: 'Amazon',
  etsy: 'Etsy',
  ebay: 'eBay',
  'tiktok-shop': 'TikTok Shop',
  paypal: 'PayPal',
  stripe: 'Stripe',
  'shopify-payments': 'Shopify Payments',
};

export const TIER_PRICES: Record<Tier, { amount: number; display: string }> = {
  amazon: { amount: 4900, display: '£49' },
  marketplace: { amount: 2900, display: '£29' },
  payments: { amount: 1900, display: '£19' },
  addon: { amount: 1900, display: '£19' },
};

export function tierForPlatform(platform: Platform): Tier {
  if (platform === 'amazon') return 'amazon';
  if (platform === 'paypal' || platform === 'stripe' || platform === 'shopify-payments') return 'payments';
  return 'marketplace';
}

export function priceForCaseType(id: string | null): { amount: number; display: string } {
  const ct = getCaseType(id);
  return TIER_PRICES[ct ? ct.tier : 'marketplace'];
}
