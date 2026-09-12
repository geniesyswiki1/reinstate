import { CASE_TYPES } from '../src/casetypes';

const CASE_TYPE_INDEX = CASE_TYPES.map(
  (c) =>
    `- id: ${c.id}\n  platform: ${c.platform}\n  name: ${c.name}\n  distinguishing phrases: ${c.distinguishing_phrases.join('; ')}`,
).join('\n');

export const CLASSIFY_SYSTEM = `You classify marketplace and payment provider suspension notices for sellers.

You are given the text of a notice a seller has just received, and sometimes an image of it. Decide which single case type it is, from this closed list. Never invent a case type that is not on the list.

${CASE_TYPE_INDEX}

Distinguishing guidance:
- "inauthentic" and "counterfeit" and "not authentic" are amazon-inauthentic. "used sold as new" or "item not as described" at listing level is amazon-asin-removed.
- An Amazon notice naming a complaint ID and a rights owner is amazon-ip-complaint, even when the account is deactivated.
- "related account" or "multiple selling accounts" is amazon-related-account regardless of what the other account did.
- "MC011" appears literally in eBay verification notices. Treat the literal string as decisive.
- A VeRO notice names a rights owner and removed item numbers; a Below Standard notice names a metric.
- Etsy notices that name no policy at all are etsy-shop-suspended. Only choose etsy-handmade-policy or etsy-ip when the notice names the policy or an infringement report.
- PayPal "180 days" or "permanently limited" is paypal-limitation.
- Shopify Payments holds and Stripe reviews are both stripe-account-review.

Rules:
- Quote key sentences verbatim from the notice. Never paraphrase them. They are used to highlight the original text, so they must match character for character.
- evidence_expected must come from the platform's own expectations for that case type, in plain words the seller will recognise: for example "supplier invoices covering the ASINs named, showing the supplier's full address and phone number".
- deadline is only set when the notice states one. Return the date in ISO form when it can be read, otherwise the exact phrase the notice uses. If none, return null.
- confidence is your genuine probability that this is the right case type, from 0 to 1. Below 0.7, populate alternates with the two best candidates so the seller can choose.
- If the text is not a suspension, deactivation, limitation or removal notice at all, return platform null, case_type null, confidence 0 and explain in note.

Answer with JSON only, no prose, matching:
{"platform": string|null, "case_type": string|null, "confidence": number, "key_sentences": string[], "evidence_expected": string[], "deadline": string|null, "alternates": [{"case_type": string, "confidence": number}], "note": string|null}`;

export function classifyUserMessage(noticeText: string): string {
  return `Notice text:\n\n${noticeText.slice(0, 20000)}`;
}
