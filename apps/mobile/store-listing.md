# Store listing, Reinstate

Section 12.8 of SPEC.md. Copy is final; nothing here promises reinstatement.

## Names

- App name: **Reinstate: Seller Appeals**
- Subtitle (Apple, 30 chars): **Amazon, Etsy, eBay appeals**
- Short description (Play, 80 chars): **Paste your deactivation notice. Get an appeal built on your evidence.**
- Bundle ID / package: `app.reinstate.mobile`
- Category: Business, both stores

## Keywords (Apple, 100 chars)

```
amazon,suspended,deactivated,appeal,plan of action,etsy,ebay,mc011,paypal,limitation,seller
```

## Description

Your marketplace account was deactivated and your income stopped with it. Reinstate turns the notice
you just received into a submission-ready appeal, built on your own evidence rather than a template.

Paste or photograph the notice. Reinstate tells you what kind of case it is and exactly what evidence
the platform will expect, free, before you pay anything.

If you decide to build the appeal, you answer only the questions that matter for your case type. Every
question is there because appeals get rejected without it. You scan your invoices and documents;
Reinstate reads them and cites only what you confirm.

You get a Plan of Action in the structure the platform expects, a pre-check that flags every sentence
a policy team would reject and every piece of evidence that is missing, and the exact place to submit
it. Redraft as often as you need for 30 days. If the appeal is rejected, paste the reply and Reinstate
reworks the case around what the platform actually said.

Covers Amazon, Etsy, eBay, TikTok Shop, PayPal, Stripe and Shopify Payments.

One payment per case. No subscription.

Reinstate helps you write your own appeal. It is not legal advice and nobody can guarantee
reinstatement. What it does is remove the reasons appeals fail.

## Screenshots (6, in this order)

1. Paste the notice. See the case type.
2. Know what evidence they will want.
3. Answer only the questions that matter.
4. Scan your invoices. We read them.
5. A Plan of Action built on your facts.
6. Every weak point flagged before you submit.

## Privacy labels (Apple) and Data safety (Play)

| Data | Linked to you | Used for | Notes |
| --- | --- | --- | --- |
| Email address | Yes | App functionality | Carries the case link. Never used for tracking. |
| Photos and documents | No | App functionality | The notice and the evidence. Deleted at 90 days. |
| User content (text) | No | App functionality | Intake answers and the notice text. |

- Tracking: none. No advertising identifiers, no third-party ad SDKs.
- Data deletion: in-app on request, and automatically 90 days after purchase.

## Review notes for Apple

Reinstate produces a document that the user writes and submits themselves. It provides no legal
services and gives no legal advice, and every screen that renders a draft says so. Guideline 5.1.1
does not apply: we do not represent users, do not contact any platform on their behalf, and make no
claim about outcomes.

To test without a real suspension:
1. On the first screen, paste the sample notice below and tap "Classify my notice". This works with no
   account and no purchase.
2. The classification and the evidence checklist appear immediately.
3. Use the sandbox account provided in App Store Connect to buy a case and continue through the
   intake, the scanner and the draft.

Sample notice to paste:

```
We are writing to inform you that your Amazon selling account has been deactivated in accordance with
Section 3 of the Amazon Business Solutions Agreement. We took this measure because we have received
complaints from buyers about the authenticity of the items you have listed. The following ASINs are
affected: B0ABC12345, B0DEF67890. You may send invoices from your supplier issued in the last 365 days.
```

A test invoice PDF is attached to the review submission.

## In-app purchases (consumables)

| Product ID | Name | Price point |
| --- | --- | --- |
| `case_amazon` | Amazon case | £48.99 |
| `case_marketplace` | Marketplace case | £28.99 |
| `case_payments` | Payments case | £18.99 |
| `case_addon` | Additional case | £18.99 |

Enrol in the Apple Small Business Program and the Google 15% tier before launch.
