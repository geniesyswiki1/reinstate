import Purchases, { type PurchasesOffering } from 'react-native-purchases';
import { Platform } from 'react-native';
import type { Tier } from '@reinstate/shared';

/**
 * Section 12.4. Cases are digital goods consumed in the app, so they are in-app
 * purchases. Consumables, one per tier, at the store price points in section 6.
 */
export const PRODUCT_IDS: Record<Tier, string> = {
  amazon: 'case_amazon',
  marketplace: 'case_marketplace',
  payments: 'case_payments',
  addon: 'case_addon',
};

let configured = false;

export function configurePurchases(): void {
  if (configured) return;
  const apiKey =
    Platform.OS === 'ios'
      ? process.env.EXPO_PUBLIC_REVENUECAT_IOS_KEY
      : process.env.EXPO_PUBLIC_REVENUECAT_ANDROID_KEY;
  if (!apiKey) return;
  Purchases.configure({ apiKey });
  configured = true;
}

/** The email is the account, so RevenueCat carries it for the webhook. */
export async function identify(email: string, classificationId: string | null): Promise<void> {
  configurePurchases();
  if (!configured) return;
  await Purchases.setEmail(email);
  if (classificationId) {
    await Purchases.setAttributes({ classification_id: classificationId });
  }
}

export async function offeringFor(tier: Tier): Promise<PurchasesOffering | null> {
  configurePurchases();
  if (!configured) return null;
  const offerings = await Purchases.getOfferings();
  return offerings.all[PRODUCT_IDS[tier]] ?? offerings.current ?? null;
}

export async function buy(tier: Tier): Promise<boolean> {
  const offering = await offeringFor(tier);
  const pkg = offering?.availablePackages[0];
  if (!pkg) throw new Error('That case type is not available for purchase yet.');
  const { customerInfo } = await Purchases.purchasePackage(pkg);
  return Boolean(customerInfo.originalAppUserId);
}

/** Required on the case list screen (section 12.4). */
export async function restore(): Promise<void> {
  configurePurchases();
  if (!configured) return;
  await Purchases.restorePurchases();
}
