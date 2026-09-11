import { NextResponse } from 'next/server';
import { getCaseType, tierForPlatform, TIER_PRICES, type Tier } from '@reinstate/shared';
import { checkoutUrl } from '@/lib/lemonsqueezy';

export const runtime = 'nodejs';

/** Turns a free classification into a Lemon Squeezy checkout for the right tier. */
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
  const url = checkoutUrl(tier, classification_id, email);
  if (!url) {
    return NextResponse.json(
      { error: 'Checkout is not configured yet. Email desk@reinstate.app and we will open the case manually.' },
      { status: 503 },
    );
  }

  return NextResponse.json({ url, tier, price: TIER_PRICES[tier].display });
}
