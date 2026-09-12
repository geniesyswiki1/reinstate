import { NextResponse } from 'next/server';
import { getCaseType, tierForPlatform, TIER_PRICES, type Tier } from '@reinstate/shared';
import { createCheckoutSession } from '@/lib/stripe';
import { SITE_URL } from '@/lib/env';
import { captureError } from '@/lib/ops';

export const runtime = 'nodejs';

/** Turns a free classification into a Stripe Managed Payments checkout for the right tier. */
export async function POST(request: Request) {
  const { classification_id, case_type, email } = (await request.json()) as {
    classification_id?: string;
    case_type?: string;
    email?: string;
  };

  const ct = getCaseType(case_type);
  if (!ct) {
    return NextResponse.json({ error: 'We need a classified notice before you can start a case.' }, { status: 400 });
  }
  if (!classification_id) {
    return NextResponse.json({ error: 'Classify your notice first.' }, { status: 400 });
  }

  const tier: Tier = tierForPlatform(ct.platform);

  let url: string | null = null;
  try {
    url = await createCheckoutSession({ tier, classificationId: classification_id, email, siteUrl: SITE_URL });
  } catch (err) {
    // A Stripe outage is ours, not the seller's. Say so and give them a way through.
    captureError(err, { route: 'checkout', tier });
    return NextResponse.json(
      { error: 'We could not open checkout. Email desk@reinstate.app and we will open the case manually.' },
      { status: 502 },
    );
  }

  if (!url) {
    return NextResponse.json(
      { error: 'Checkout is not configured yet. Email desk@reinstate.app and we will open the case manually.' },
      { status: 503 },
    );
  }

  return NextResponse.json({ url, tier, price: TIER_PRICES[tier].display });
}
