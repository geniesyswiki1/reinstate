# Reinstate: Full Build and Launch Spec

A guided appeal builder for sellers whose marketplace or payment account was just suspended. Upload the notice, answer a structured intake, attach evidence, get back a specific Plan of Action plus a pre-check and a submission checklist. One price per case. Resubmission included.

  

Version 1.0, 11 September 2026. Owner: Taiwo Ojo. Companion to the Plainshot spec (same format, different product).

  

## 0\. How to use this document with Claude Code

Paste this into the repo root as SPEC.md and open Claude Code with:

  

Read SPEC.md end to end. Build Reinstate exactly as specified, in the build order in section 11, then the mobile order in section 12. Do not invent features. Where the spec is silent, choose the simplest option that keeps a case retrievable by email link, deployable to Netlify, and submittable to TestFlight. After each phase, run the checks listed and stop to report before starting the next phase. Never commit secrets; read them from .env and list every one you need in .env.example. Use the connector runbook in section 13 for anything that touches Netlify, Higgsfield, Google Drive, Gmail, Slack, Jira, Figma or n8n.

  

Definition of done for today, web: a stranger pastes an Amazon deactivation notice, sees it classified with the evidence they will need, pays £49 through Lemon Squeezy, completes the intake, uploads two invoices, and receives a specific Plan of Action as plain text and DOCX plus a pre-check report, all at a case link that also arrives by email. Live on Netlify at the production domain with the 20 landing pages in the sitemap.

  

Definition of done for today, mobile: the same flow in an Expo app, with the notice captured by camera, uploaded to TestFlight internal testing and Google Play internal testing. Store listing submitted for review in parallel. Alpha testers get the TestFlight invite the same day; store approval is not on the critical path.

  

## 1\. Product summary

**What it is:** a web and mobile tool that turns a seller's suspension notice and their own evidence into a submission-ready appeal. It classifies the case type, asks only the questions that matter for that type, extracts facts from uploaded documents, drafts the Plan of Action in the structure the platform expects, then runs a reviewer pass that flags every sentence a policy team would reject and every piece of missing evidence.

  

**Who it is for:** a seller on Amazon, Etsy, eBay, TikTok Shop, PayPal, Stripe, Shopify Payments or Google Merchant Center whose account or listing was deactivated in the last 72 hours. Their income stopped the moment the email arrived. They are searching at odd hours, on their phone, and will pay for anything credible that moves faster than a consultant.

  

**Why we win:** the incumbents are humans (Fiverr writers at £20 to £80 delivering templates, consultants and lawyers at £300 to £3,000 with a two-day turnaround) and free template documents that platforms increasingly reject as generic. Nobody has productised the guided, evidence-forcing version at a per-case price with 15-minute turnaround and free resubmission. We are the tool that refuses to write a generic appeal.

  

**What we are not:** not legal advice, not a reinstatement guarantee, not a consultancy. We sell a document and a process. Every page says so.

  

**Business model:** one-time payment per case through Lemon Squeezy on web (merchant of record, VAT handled) and in-app purchase on mobile. A case includes unlimited redrafts and resubmission support for 30 days. No subscription. Add-on cases within the same account at a lower price.

  

## 2\. Brand

### 2.1 Name and domain

Name: **Reinstate**. It is the outcome the buyer is searching for, it is a verb, and it works in every platform's vocabulary ("reinstate my Amazon account", "get my Etsy shop reinstated").

  

Domain preference order: reinstate.app, getreinstate.com, reinstate.co, reinstateme.com. Fallback name if none is available: **Appeal Desk** at appealdesk.co.

  

Handles to reserve: @reinstateapp on X, TikTok, YouTube, Instagram.

### 2.2 Positioning

One line, used everywhere: **"Your account was deactivated. Here is exactly what to send back."**

  

Supporting line: "Paste the notice. Answer the questions that matter. Get a Plan of Action built on your evidence, not a template, in 15 minutes. Resubmissions included."

  

We are the calm, competent person at the desk when the seller is panicking. Not a lawyer, not a guru, not a robot.

### 2.3 Voice

  - Calm, specific, direct. Short sentences. The reader is stressed; every word must reduce load.
  - Sentence case everywhere. No all-caps. No exclamation marks.
  - Never promise reinstatement. Say "improves your chances", "addresses the reasons appeals get rejected", never "get reinstated today".
  - Use the platform's own vocabulary exactly: "Plan of Action", "Section 3", "root cause", "corrective actions", "preventive measures", "MC011", "VeRO", "account limitation", "misrepresentation".
  - Numbers over adjectives: "Amazon's stated turnaround is 3 to 5 business days" beats "fast".
  - Errors and empty states say what to do next. "We need the suspension notice to classify your case. Paste the email text or upload a screenshot."
  - Hyphens only. Never em dashes or en dashes anywhere, including generated documents and commit messages.
  - The generated Plan of Action itself is written in the seller's first person, plain business English, no legal tone, no adjectives, every claim tied to a dated fact or an attached document.

### 2.4 Visual identity

The subject is a serious document produced under pressure. The visual world is the deactivation email (which every buyer has just read) and the structured response that answers it. The brand mark and the hero both come from that pairing.

  

**Palette (exactly these six):**

  

|  |  |  |
| :-: | :-: | :-: |
| \*\*Token\*\* | \*\*Hex\*\* | \*\*Use\*\* |
| \\--sheet | \\\#F7F8FA | page background, cool off-white like a printed sheet under office light |
| \\--ink | \\\#161A22 | all text |
| \\--rule | \\\#D5D9E0 | borders, dividers, table rules |
| \\--muted | \\\#5F6672 | secondary text, timestamps, helper copy |
| \\--reinstated | \\\#0E7A4F | the one accent: primary buttons, links, passed checks, the word "reinstated" |
| \\--notice | \\\#B3261E | used only for the platform's own status ("Deactivated") and failed checks. Never on buttons |

  

No gradients, no shadows, no illustration, no icons except the check and cross glyphs in the pre-check. No dark mode in v1.

  

**Type:** two families, clearly distinct.

  

  - **Source Serif 4** (Google Fonts), weights 400 and 600, for headlines, long-form copy, and the rendered Plan of Action. A serif because the product is a document and the reader must trust it.
  - **Public Sans** (Google Fonts), weight 500, for interface controls, form labels, buttons, tables and the pre-check report.

  

Scale: display 600, 48 px desktop / 32 px mobile, line-height 1.1, letter-spacing -0.01em. H2 600, 30 / 24 px. Body serif 400, 18 px, line-height 1.6, max 66 characters per line. UI sans 500, 15 px. Small 14 px in --muted.

  

**Logo:** the word "reinstate" in Source Serif 4 600, lowercase, --ink, with a single 2 px underline in --reinstated running under the last four letters ("tate") only, ending flush with the final letter. The partial underline is the mark: a correction being applied. SVG at /public/logo.svg. Favicon: a --reinstated square with the lowercase "r" in Source Serif 600 in --sheet.

  

**Layout:**

  

  - Left-aligned throughout. Two-column desktop: the intake or document on the left (7 columns), the live pre-check on the right (5 columns), sticky. Single column on mobile with the pre-check as a collapsible bar at the bottom.
  - Content max width 1080 px, 24 px gutters.
  - Border radius 6 px on inputs and buttons, 0 on everything else. Cards do not exist; sections are separated by 1 px --rule lines and whitespace.
  - The one memorable moment: on the home page, the hero is a working textarea captioned "Paste your deactivation notice". As the user pastes, the notice's key sentences highlight in --notice and a classification appears beneath it in serif: "This is a Section 3 deactivation for suspected inauthentic items. Amazon will expect supplier invoices for the ASINs named, dated before the listing date." This runs on the free classify endpoint before any payment. No other motion anywhere on the site.

  

**Imagery:** none. Where a store listing or social post needs an image, it is a typographic composition: the classification sentence set in Source Serif on --sheet, or a redacted notice with its key line highlighted. No people, no illustrations, no screenshots of Seller Central (trademark risk).

### 2.5 Things the brand never does

  - Never says "guaranteed", "100%", "reinstated in 24 hours", or shows fake success counts.
  - Never uses platform logos. Platform names in text only.
  - Never shows a face or a testimonial with a full name in v1.
  - Never emits a paragraph that could apply to another seller. If the reviewer pass flags a sentence as generic, it is rewritten or removed before the user sees it.
  - Never uses the word "AI" in a headline. Once in the FAQ.

  

## 3\. Product specification

### 3.1 Platforms and case types (v1)

Each case type has its own intake schema, evidence list, output structure and rejection-pattern list in /content/casetypes/. Ship these 18 at launch:

  

**Amazon (£49)**

  

1.  Section 3 account deactivation, inauthentic or counterfeit complaint
2.  Section 3, related account
3.  Section 3, restricted or prohibited products
4.  Section 3, review manipulation or seller code of conduct
5.  Section 3, drop shipping policy violation
6.  Intellectual property complaint (trademark, copyright, patent), account or ASIN level
7.  Account health performance (ODR, late shipment, cancellation rate)
8.  Listing (ASIN) removal, product condition or authenticity
9.  Identity or business verification failure

  

**Etsy (£29)** 10. Shop suspension, handmade or reselling policy 11. Shop suspension, intellectual property 12. Shop suspension, unspecified "violation of policies" (the common one)

  

**eBay (£29)** 13. MC011 business verification restriction 14. Seller performance below standard restriction 15. VeRO takedown response

  

**TikTok Shop (£29)** 16. Shop deactivation for accumulated violation points

  

**Payments (£19)** 17. PayPal account limitation (document request or 180-day hold) 18. Stripe or Shopify Payments account review, hold or termination

  

Google Merchant Center misrepresentation suspension is case type 19 in Phase 2.

### 3.2 The flow

1.  **Classify (free, no payment, no email).** Paste the notice text or upload a screenshot or PDF. /api/classify returns: platform, case type, confidence, the key sentences highlighted, the evidence list Amazon (or the platform) will expect, and the deadline if the notice states one. If confidence is below 0.7, show the top two candidates and ask the user to pick. This step is the hero on the home page and on every landing page.
2.  **Start a case (payment).** "Build my appeal, £49" opens Lemon Squeezy. On success we create the case, email the case link, and store the case token in localStorage. The email is the account: a magic link, no password.
3.  **Intake (10 to 20 questions, case-type specific).** Each question exists because a rejection pattern depends on it. Examples for Amazon inauthentic: supplier name and relationship, whether invoices show the supplier's full address and phone, purchase dates versus first listing date, quantity on invoices versus units sold, whether the items were retail arbitrage, what has already been changed in sourcing. Every question shows a one-line "why we ask" in --muted. Progress is saved per answer.
4.  **Evidence upload.** The evidence list from classification becomes a checklist. Upload PDFs, images, screenshots (25 MB each, 20 per case). /api/extract runs each file through Claude vision and pulls: document type, dates, names, addresses, amounts, ASINs or SKUs. Extracted facts are shown to the user for confirmation ("Invoice from Bright Wholesale Ltd, dated 3 March 2026, 240 units, ASINs B0..."). Confirmed facts are what the drafter is allowed to cite.
5.  **Draft.** /api/draft produces the appeal in the platform's expected structure (section 3.3) citing only confirmed facts. Rendered in serif on the left.
6.  **Pre-check.** /api/review runs a second, independent pass with the rejection-pattern list for the case type and returns a report on the right: each check passes or fails with a one-line reason and, on fail, the sentence or missing item at fault. A genericity score per paragraph (section 4.5). "Ready to submit" appears only when all blocking checks pass.
7.  **Edit and redraft.** The user can edit any answer or add evidence; "Redraft" regenerates and re-reviews. Unlimited within the case.
8.  **Export.** Plain text (the platforms' appeal forms are text boxes), DOCX, and a "how to submit" panel with the exact path in that platform's UI and the character or attachment limits.
9.  **After submission.** The case page has a "What happened?" control: Reinstated, Rejected (paste the rejection), No reply yet. A rejection paste re-runs classification against the rejection text, updates the intake with the new questions, and unlocks a redraft. 30 days from purchase.

### 3.3 Output structure per platform

  - **Amazon Plan of Action:** three headed sections in this order and wording: Root cause; Corrective actions already taken; Preventive measures. Each corrective and preventive item is a dated bullet starting with a verb, referencing an attached document by name where one exists. Opening line states the account or ASIN and the notice date. Closing line lists the attachments. Target 350 to 600 words. No apology paragraph, no history of the business, no mention of AI or tools.
  - **Amazon IP complaint:** offers the three paths (retraction from the rights owner, proof of authorisation, or POA if the listing was in error) and drafts the one the intake supports, including the rights-owner retraction email template when that path is chosen.
  - **Etsy:** an appeal message under 2,000 characters, structured as what the shop sells, how it complies with the specific policy named, what changed, and the evidence attached.
  - **eBay MC011:** a document checklist and a cover message; the appeal is mostly documents, so the pre-check focuses on document completeness and consistency of names and addresses across them.
  - **TikTok Shop:** point-by-point response to each violation listed, with the corrective action per violation.
  - **PayPal / Stripe:** a document pack index plus a cover message that explains the business model, fulfilment, refund policy and chargeback handling in the order the risk team reads them.

  

All outputs end with a short, plain "What to expect next" note for the user (not for submission): stated turnaround, where the reply will arrive, and what to do on each outcome.

### 3.4 The pre-check rules (examples; full lists live in /content/casetypes/\*.json)

Blocking:

  

  - A corrective action with no date.
  - Any paragraph with genericity score above 0.6.
  - Root cause that restates the notice instead of explaining what the seller did or failed to do.
  - Invoices referenced but not uploaded, or uploaded but dated after the first listing date.
  - Supplier on an invoice lacking a full address and phone number.
  - Appeal longer than the platform's limit.
  - Any of: "unfortunately", "I assure you", "please give me one more chance", "loyal seller", "unfair".

  

Advisory:

  

  - No mention of the specific ASIN or order IDs named in the notice.
  - Preventive measures that are not verifiable (no owner, no cadence, no system).
  - Over 600 words.

### 3.5 Accounts, cases and access

  - No password. A case has a 32-character token in its URL and is also reachable via magic link sent to the purchase email.
  - A user with a prior case can add a second case at the add-on price (section 6) from the case page.
  - Cases and uploads are deleted 90 days after purchase unless the user extends. Say so.

### 3.6 Legal surface

  - Every generated document carries a footer line for the user only (not exported): "Reinstate helps you write your own appeal. It is not legal advice and does not guarantee reinstatement."
  - Terms: sale of a document and 30 days of redrafts; refund in full if no draft is delivered within 24 hours or if classification was wrong and the user tells us before drafting.
  - Privacy: uploads used only to draft this case, never for training, deleted at 90 days, processed by Anthropic's API under its commercial terms with no training on inputs.

  

## 4\. Technical architecture

### 4.1 Stack

|  |  |
| :-: | :-: |
| \*\*Layer\*\* | \*\*Choice\*\* |
| Framework | Next.js 15, App Router, TypeScript, Tailwind CSS |
| Hosting | Netlify (Next.js runtime, functions, Blobs, scheduled functions) |
| Model | Anthropic API. claude-sonnet-4-6 for classify, extract and review; claude-opus-4-1 (or the latest Opus available) for the draft pass only. Temperature 0.2 for draft, 0 for review |
| Document extraction | Anthropic vision on images; PDFs sent as documents to the API; OCR fallback via tesseract.js only if the API rejects the file |
| Storage | Supabase Postgres for cases, answers, facts, drafts, reviews, purchases; Supabase Storage (private bucket, signed URLs, 90-day lifecycle) for uploads |
| Payments (web) | Lemon Squeezy: products per platform tier plus add-on, checkout overlay, order\\\_created webhook |
| Payments (mobile) | RevenueCat over StoreKit 2 and Play Billing, consumables per tier, webhook into the same purchases table |
| Email | Resend: magic links, case link, "draft ready", 30-day reminder. Sender desk@reinstate.app |
| DOCX | docx npm package in a function |
| Rate limiting | Upstash Redis on /api/classify (10 per IP per day) and /api/extract |
| Analytics | Plausible on web, PostHog in the app, same event names |
| Errors | Sentry |
| Ops | n8n (existing instance) for webhooks to Slack and the alpha feedback sheet (section 13) |

### 4.2 Repo structure

/apps/web

  

  /app

  

    /page.tsx                     hero classify + how it works + pricing + FAQ

  

    /appeal/\[platform\]/\[slug\]/page.tsx   20 landing pages from /content/landing.ts

  

    /case/\[token\]/page.tsx        intake, evidence, draft, pre-check, export, outcome

  

    /pricing/page.tsx

  

    /privacy/page.tsx, /terms/page.tsx

  

    /api/classify, /api/case/create, /api/case/\[token\]/answer, /api/extract,

  

    /api/draft, /api/review, /api/export/docx, /api/outcome,

  

    /api/webhooks/lemonsqueezy, /api/webhooks/revenuecat, /api/magic-link

  

    /sitemap.ts, /robots.ts

  

  /components  NoticeBox, Classification, Intake, EvidenceList, FactConfirm,

  

               Draft, PreCheck, ExportPanel, OutcomeControl, Paywall

  

/apps/mobile   Expo app (section 12)

  

/packages/shared

  

  /casetypes   one JSON per case type: intake schema, evidence list, output

  

               structure, rejection patterns, submission path, limits

  

  /prompts     system prompts for classify, extract, draft, review

  

  /types, /api-client

  

/content       landing.ts (20 pages), faq.ts, pricing.ts

  

/public        logo.svg, favicon.svg, og/\*.png

  

.env.example

  

SPEC.md

### 4.3 Environment variables (.env.example)

ANTHROPIC\_API\_KEY=

  

LEMONSQUEEZY\_API\_KEY=

  

LEMONSQUEEZY\_STORE\_ID=

  

LEMONSQUEEZY\_WEBHOOK\_SECRET=

  

LEMONSQUEEZY\_VARIANT\_AMAZON=

  

LEMONSQUEEZY\_VARIANT\_MARKETPLACE=

  

LEMONSQUEEZY\_VARIANT\_PAYMENTS=

  

LEMONSQUEEZY\_VARIANT\_ADDON=

  

REVENUECAT\_WEBHOOK\_SECRET=

  

SUPABASE\_URL=

  

SUPABASE\_SERVICE\_ROLE\_KEY=

  

RESEND\_API\_KEY=

  

UPSTASH\_REDIS\_REST\_URL=

  

UPSTASH\_REDIS\_REST\_TOKEN=

  

SENTRY\_DSN=

  

NEXT\_PUBLIC\_PLAUSIBLE\_DOMAIN=

  

NEXT\_PUBLIC\_SITE\_URL=

  

N8N\_WEBHOOK\_URL=

### 4.4 Data model (Supabase)

  - cases(id, token, email, platform, case\_type, confidence, notice\_text, deadline, status, purchase\_id, source web|ios|android, created\_at, expires\_at)
  - answers(case\_id, question\_id, value, updated\_at)
  - evidence(id, case\_id, filename, storage\_path, doc\_type, extracted\_json, confirmed bool)
  - drafts(id, case\_id, version, body\_md, body\_txt, created\_at)
  - reviews(id, draft\_id, report\_json, blocking\_count, advisory\_count, generic\_max)
  - purchases(id, provider, provider\_order\_id, email, tier, amount, currency, case\_id, created\_at) idempotent on provider\_order\_id
  - outcomes(case\_id, result reinstated|rejected|pending, rejection\_text, recorded\_at)

### 4.5 Prompt architecture (/packages/shared/prompts)

Four prompts, four calls, never one big call.

  

1.  **Classify.** Input: notice text (plus image if uploaded). Output JSON: {platform, case\_type, confidence, key\_sentences\[\], evidence\_expected\[\], deadline, alternates\[\]}. The system prompt lists all 18 case types with their distinguishing phrases (e.g. "inauthentic" versus "counterfeit" versus "used sold as new"; "MC011" literal; "180 days" for PayPal holds).
2.  **Extract.** One call per uploaded file. Output JSON: {doc\_type, issuer, dates\[\], addresses\[\], phone, amounts\[\], identifiers\[\] (ASIN/SKU/order ids), quantities, flags\[\]} where flags include "no address", "date after listing", "handwritten", "unreadable". Nothing is cited unless the user confirms it.
3.  **Draft.** Input: case type JSON, confirmed answers, confirmed facts. The system prompt contains the output structure, the banned phrase list, the rule that every corrective and preventive item carries a date and, where possible, a document name, and a hard instruction: "If a required fact is missing, write \[MISSING: what is missing\] in place rather than inventing or generalising." Missing markers are surfaced as blocking pre-check items, which is how the product refuses to be generic.
4.  **Review.** Input: the draft plus the case type's rejection patterns. Output JSON: the pre-check report. Includes a genericity score per paragraph computed as the share of sentences with no case-specific noun (ASIN, supplier, date, order id, product name, document name). Runs at temperature 0 on Sonnet so it is fast and consistent.

  

Cost per case: roughly £0.15 to £0.60 depending on evidence volume. Log tokens per call to Plausible.

### 4.6 Payments

  - Lemon Squeezy products: Reinstate Amazon (£49), Reinstate Marketplace (£29, Etsy/eBay/TikTok Shop), Reinstate Payments (£19, PayPal/Stripe/Shopify Payments), Reinstate Add-on case (£19, only purchasable from an existing case page). Local currency display on.
  - Checkout overlay with checkout\[custom\]\[classification\_id\] so the webhook can create the case from the free classification and email the link.
  - Webhook verifies HMAC, is idempotent on order\_id, creates the case, sends the magic link via Resend, posts to n8n.
  - RevenueCat webhook does the same for mobile purchases.

### 4.7 Privacy, retention and safety

  - Private Supabase bucket, signed URLs valid 15 minutes, lifecycle deletes at 90 days; scheduled Netlify function purges rows and objects nightly.
  - Strip EXIF from uploaded images. Redact card numbers if the extractor sees them (regex on the extracted text before storage).
  - No file leaves our infrastructure except to the Anthropic API.
  - Refuse to draft if the classify step detects that the user is asking us to help evade a ban for counterfeit goods, fraud or IP theft where the intake answers confirm the violation was intentional. The refusal copy is honest: "This appeal would need to say the items were authentic. Your answers say they were not. We can't draft that."

### 4.8 SEO and performance

  - 20 landing pages (section 8.1), each server-rendered with the classify hero, unique title, meta, H1, an explanation of that case type in 300 to 500 words written for a panicked reader (what the notice means, what the platform expects, what gets appeals rejected), a three-item FAQ with FAQPage schema, and the price.
  - HowTo schema on the home page. Sitemap of 24 URLs.
  - Lighthouse: Performance 90+, Accessibility 100, on mobile. Fonts self-hosted, font-display: swap.

  

## 5\. Copy

### 5.1 Home page

**Hero headline:** Your account was deactivated. Here is exactly what to send back.

  

**Hero sub:** Paste the notice. We'll tell you what kind of case it is and what evidence the platform expects, free. Then build a Plan of Action on your facts, not a template, in about 15 minutes.

  

**Notice box caption:** Paste your deactivation notice / or upload a screenshot or PDF / Nothing is stored until you start a case.

  

**After classification (dynamic):** "This is a \[case type\]. \[Platform\] will expect \[evidence list\]. Deadline in the notice: \[date or none stated\]." Then the button: "Build my appeal, £49".

  

**Section: How it works** (four short steps, numbered because it is a sequence)

  

1.  Paste the notice. We classify it and list the evidence you'll need.
2.  Answer the questions that matter for your case. Each one is there because appeals get rejected without it.
3.  Upload your documents. We read them and only cite what you confirm.
4.  Get your Plan of Action, a pre-check of every weak point, and the exact place to submit it. Redraft as often as you need for 30 days.

  

**Section: Why appeals get rejected.** Three lines in serif: They restate the notice instead of explaining the cause. They promise to "do better" with no dated, verifiable action. They cite invoices that don't match the ASINs, the dates or the quantities. Reinstate checks all three before you submit.

  

**Section: What this is and isn't.** One paragraph: Reinstate helps you write your own appeal. It is not legal advice and nobody can guarantee reinstatement. What we can do is remove the reasons appeals fail, in minutes instead of days, for the price of a takeaway.

  

**FAQ:**

  

  - Is the classification really free? Yes. Paste the notice and read the result. You pay only to build the appeal.
  - What if it's rejected? Paste the rejection into your case. We reclassify, ask the new questions, and redraft. Included for 30 days.
  - Do you submit it for me? No. You paste it into the platform's appeal form; we show you exactly where.
  - Will the platform know this was drafted with a tool? The document contains only your facts in your first person. Generic wording is exactly what we remove.
  - What happens to my documents? Used only for this case, deleted after 90 days, never used for anything else.
  - How does it work? A language model classifies the notice, reads your documents, drafts the appeal from confirmed facts, and a second pass checks it against the known reasons appeals fail.

### 5.2 Landing page template (/appeal/\[platform\]/\[slug\])

H1 formula: "\[Platform\] \[case type\] appeal: what to send and what gets rejected". Then the classify hero, then the explainer (what the notice means, the structure the platform expects, the three commonest rejection reasons for this type, the evidence list), then price and FAQ.

  

Example, Amazon inauthentic:

  

  - title: "Amazon Section 3 inauthentic appeal: Plan of Action that gets read | Reinstate"
  - H1: "Amazon deactivated your account for inauthentic items. Here is what to send back."
  - intro: "The notice names ASINs and asks for invoices. What it does not tell you is that invoices dated after your first sale, from a supplier with no phone number, or for fewer units than you sold, are the three commonest reasons this appeal is rejected. Paste your notice below to see what Amazon will expect from you."

### 5.3 Microcopy

  - Classify button: "Classify my notice"
  - Pay: "Build my appeal, £49"
  - Intake progress: "Question 6 of 14"
  - Why we ask (under each question): one line in --muted
  - Evidence: "Upload invoices (PDF or photo)" / "We found: Bright Wholesale Ltd, 3 March 2026, 240 units. Is this right?" / "Yes, use it" / "No, skip this"
  - Draft actions: "Redraft" / "Copy as text" / "Download DOCX"
  - Pre-check heading: "Before you submit" / "3 things will get this rejected" / "Ready to submit"
  - Outcome: "What happened?" / "Reinstated" / "Rejected, paste the reply" / "No reply yet"

  

## 6\. Pricing

|  |  |  |
| :-: | :-: | :-: |
| \*\*Product\*\* | \*\*Price\*\* | \*\*Includes\*\* |
| Amazon case | £49 | classification, intake, evidence extraction, draft, pre-check, DOCX, unlimited redrafts and rejection handling for 30 days |
| Marketplace case (Etsy, eBay, TikTok Shop) | £29 | same |
| Payments case (PayPal, Stripe, Shopify Payments) | £19 | same |
| Add-on case (from an existing case page) | £19 | same, any platform |

  

Rules:

  

  - One-time. No subscription anywhere.
  - Refund in full if no draft within 24 hours or classification was wrong before drafting. Otherwise no refunds (the value is delivered on draft), stated on the pricing page.
  - Mobile tiers map to the nearest store price points (£48.99 / £28.99 / £18.99). Apple Small Business Program and Google 15% tier enrolled before launch.
  - No coupons. One exception: ALPHA code giving 100% off, limited to 40 uses, for alpha testers (section 12.6). Disabled at public launch.

  

Unit economics: model cost £0.15 to £0.60 per case, Lemon Squeezy 5% plus 50p, Resend negligible. The £49 case nets roughly £45. Break-even on the build is about 25 Amazon cases.

  

## 7\. Brand assets and how to produce them with the connectors

All assets are typographic; no generative imagery is needed for the web. Higgsfield is used for the store preview video and the Short, Figma for assembling frames, Google Drive as the asset store.

  

1.  **Logo and favicon.** Claude Code writes logo.svg and favicon.svg directly from the section 2.4 spec. Upload both to Figma (Reinstate / Brand) via Figma:upload\_assets so the team has the source.
2.  **OG images (home plus 20 landing pages).** Generated at build time with @vercel/og: the classification sentence for that case type set in Source Serif on --sheet, logo bottom-left. No external tool.
3.  **App icon.** --reinstated square, serif "r" in --sheet. Rendered by a script from the SVG at all required sizes.
4.  **Store screenshots (6 per store).** Rendered from the running app with a screenshot script, then framed in Figma using a shared frame component on --sheet with a serif caption above. Export at the required sizes via Figma:download\_assets.
5.  **Store preview video (20 s) and the launch Short (45 s).** Higgsfield generate\_video from a screen recording of the classify moment, or, if a screen recording is not ready, a typographic animation: the deactivation notice appears, key lines highlight in --notice, the classification sentence types out, the three POA headings appear, the pre-check turns green. Vertical 9:16 for the Short, 16:9 for the store. Gemini (Nano Banana) is the fallback for any static typographic still.
6.  **Asset store.** Everything lands in Google Drive Reinstate / Assets / {brand, store, video} via Google Drive:create\_file. The spec itself is saved to Reinstate / Spec.

  

## 8\. Distribution and marketing

### 8.1 The 20 landing pages (built in)

|  |  |
| :-: | :-: |
| \*\*Slug\*\* | \*\*Case type\*\* |
| /appeal/amazon/section-3-inauthentic | Amazon inauthentic / counterfeit |
| /appeal/amazon/related-account | Amazon related account |
| /appeal/amazon/restricted-products | Amazon restricted products |
| /appeal/amazon/review-manipulation | Amazon review manipulation |
| /appeal/amazon/drop-shipping | Amazon drop shipping policy |
| /appeal/amazon/ip-complaint | Amazon IP complaint |
| /appeal/amazon/account-health | Amazon ODR / performance |
| /appeal/amazon/asin-removed | Amazon listing removal |
| /appeal/amazon/verification-failed | Amazon identity verification |
| /appeal/amazon/plan-of-action | generic "how to write an Amazon Plan of Action" page, highest-volume term |
| /appeal/etsy/shop-suspended | Etsy unspecified suspension |
| /appeal/etsy/handmade-policy | Etsy handmade / reseller |
| /appeal/etsy/ip | Etsy IP |
| /appeal/ebay/mc011 | eBay MC011 |
| /appeal/ebay/below-standard | eBay performance |
| /appeal/ebay/vero | eBay VeRO |
| /appeal/tiktok-shop/deactivated | TikTok Shop |
| /appeal/paypal/limitation | PayPal limitation |
| /appeal/stripe/account-review | Stripe |
| /appeal/shopify-payments/hold | Shopify Payments |

  

Each targets the phrasing a panicked seller types: "amazon account deactivated section 3 what to do", "etsy shop suspended for no reason appeal", "ebay mc011 how long", "paypal 180 day hold appeal letter".

### 8.2 Launch day

1.  Submit sitemap to Google Search Console and Bing.

  

1.  Post in r/AmazonSeller, r/FulfillmentByAmazon, r/Etsy, r/EtsySellers, r/eBaySellers, r/Flipping, r/TikTokShop, r/paypal. One post each, written for that community, in the voice of someone who has been through it. Template for r/AmazonSeller:

  

Got a Section 3 in March, paid a "reinstatement expert" £400 for what turned out to be a template, got rejected twice. Ended up learning what Seller Performance actually rejects and built a tool that forces you to fix those things before you submit. Paste your notice, it tells you the case type and what evidence they'll want, free. Building the actual POA costs £49 and includes redrafts if you get rejected. Not a lawyer, no guarantees, but it would have saved me three weeks. \[link\]

  

Reply to every comment for 72 hours. Cases that come from Reddit are tagged in Plausible.

  

1.  Post the same in three Facebook groups per platform (search "Amazon sellers UK", "Etsy sellers UK", "eBay sellers UK", and the US equivalents).

  

1.  Post in the Amazon Seller Forums and Etsy community forums as a reply to existing "I've been suspended" threads from the last 14 days, with a plain answer and one link. Never start a promotional thread there.

### 8.3 Week 1

  - The 45-second Short (section 7) on TikTok, Reels and Shorts: the paste, the highlight, the classification, the three POA headings, the pre-check going green, the price. Captions, no voice.
  - One long-form YouTube video (8 to 12 minutes, screen recording, HeyGen avatar optional): "What Amazon Seller Performance actually rejects in a Plan of Action." Educational, tool appears in the last two minutes.
  - Answer every suspension question on Reddit and the seller forums from the last 30 days.

### 8.4 Weeks 2 to 4

  - Publish "Reinstate vs a reinstatement consultant vs Fiverr": honest table on price, turnaround, specificity, what each can't do.
  - Outreach to five reselling and FBA YouTubers (10k to 200k subscribers) with a free case and a 30% Lemon Squeezy affiliate code. Suspension content is evergreen for them.
  - Outreach to three Amazon agencies and two seller accountants in the UK offering a white-label or referral rate; they see suspensions weekly and do not want to write POAs.
  - Weekly Search Console review; rewrite titles on pages with impressions and low clicks.

### 8.5 Ongoing (delegable to a VA)

  - Reply to receipt-email replies and forum comments.
  - Review every rejection pasted into the product (anonymised) once a week and update the rejection-pattern JSON for that case type. This is the moat: the pre-check gets sharper with every rejection.
  - Add a landing page when Search Console shows a case type we do not cover.

### 8.6 What we do not do

  - No paid ads for 90 days (the CPC on "amazon suspension" is high and dominated by lawyers).
  - No guarantees, no success rate claims until we have 100 recorded outcomes and can state the number.
  - No outreach to suspended sellers by scraping forums.

  

## 9\. Analytics and success criteria

Plausible / PostHog events: notice\_pasted, classified (with platform, case\_type, confidence), checkout\_opened, purchase (tier, source), intake\_completed, evidence\_uploaded, draft\_generated, precheck\_blocking (count), precheck\_ready, export (txt|docx), outcome (result).

  

90-day targets:

  

  - 20 pages indexed, at least 5 on page one in the UK and US for their primary term.
  - 150 paid cases (average £38, roughly £5,700 gross).
  - Free classification to paid conversion above 8%.
  - 60% of purchased cases reach "Ready to submit".
  - Recorded outcomes on at least 50% of cases; reinstatement rate published only when n is 100 or more.
  - Support contacts under 10 per month, all handled by the VA.

  

## 10\. Launch checklist (web)

  - Domain on Netlify with HTTPS; www redirects to apex
  - .env populated in Netlify; none committed
  - Lemon Squeezy live, 4 products, webhook verified with a real £19 purchase (refunded)
  - Free classify works in incognito, rate-limited by IP
  - Full Amazon inauthentic case run end to end with two real-looking invoices; DOCX opens in Word; plain text pastes cleanly
  - Rejection paste path re-classifies and redrafts
  - Refusal path fires on an intentionally admitted counterfeit case
  - Magic link email arrives within 30 seconds; case link works on a second device
  - 20 landing pages render with unique titles; sitemap has 24 URLs
  - Privacy, terms, the not-legal-advice line on every case page
  - Nightly purge scheduled and tested against a case with expires\_at in the past
  - Lighthouse mobile: Performance 90+, Accessibility 100
  - Plausible and Sentry receiving events; n8n posting purchases to Slack
  - Sitemap submitted; Reddit and forum posts drafted

  

## 11\. Build order for Claude Code, web (stop and report after each phase)

**Phase 1: case types and prompts (2 hours).** Workspace scaffold, /packages/shared/casetypes with all 18 JSON files (intake schemas, evidence lists, output structures, rejection patterns, submission paths, limits), the four prompts, and a CLI script that runs classify, draft and review on a fixture notice. Check: the fixture Amazon inauthentic notice classifies at 0.9+, the draft contains three headed sections with dated bullets, the review returns at least one blocking item when a fixture invoice is dated after the listing date.

  

**Phase 2: classify hero and landing pages (2 hours).** Home page with the working NoticeBox and Classification, the 20 landing pages from landing.ts, pricing, privacy, terms, sitemap, OG images, logo, favicon. Check: paste a notice on /appeal/etsy/shop-suspended, see the classification; npm run build passes; Lighthouse targets met.

  

**Phase 3: cases, payments, email (3 hours).** Supabase schema, Lemon Squeezy products and webhook, case creation, magic link via Resend, case page shell with token access. Check: test-mode purchase creates a case, email arrives, case opens on another browser via the link.

  

**Phase 4: intake, evidence, draft, pre-check, export (4 hours).** Intake renderer from the schema with autosave, evidence upload to Supabase Storage, extract with fact confirmation, draft, review with the two-column layout and the sticky pre-check, redraft, DOCX and text export, submission panel, outcome control with rejection reclassification, refusal path. Check: the section 10 end-to-end case run.

  

**Phase 5: deploy (1 hour).** Netlify site via the connector, env vars, domain, scheduled purge, Plausible, Sentry, n8n webhook, Lemon Squeezy to live, run the checklist. Check: definition of done, web.

  

Roughly 12 hours. Mobile starts as soon as Phase 5 passes.

  

## 12\. Mobile apps, TestFlight first

### 12.1 Why mobile matters here

The deactivation email is read on a phone, usually the moment it arrives. The seller's evidence is physical (invoices in a drawer, a supplier's business card, a packing slip) and needs a camera. Mobile v1 is the intake and evidence capture done well; the draft is read on any screen via the case link.

### 12.2 Scope (mobile v1)

  - Capture the notice: camera, photo library, or share from Mail via the share extension. Classify immediately.
  - Pay in-app (consumable per tier), or "I already have a case" magic link entry.
  - Intake with autosave, identical schema to web.
  - Evidence capture: multi-page document scanning with edge detection (expo-document-scanner or react-native-document-scanner-plugin), photo library, Files app. Each page extracted and confirmed as on web.
  - Draft view and pre-check, read-only edit of answers, redraft, copy as text, share DOCX via the system share sheet.
  - Push notification when a draft is ready (drafting can take a minute) and a 3-day reminder if the case has no outcome recorded. Two notification types, both opt-in at the moment they are relevant, no upfront prompt.
  - Outcome control.

  

No headshot of features beyond this. No dark mode.

### 12.3 Stack

Expo (React Native, TypeScript, Expo Router), EAS Build and EAS Submit, expo-share-intent, expo-camera, expo-image-picker, expo-document-picker, document scanner plugin, RevenueCat, expo-notifications, PostHog, Sentry. Lives in /apps/mobile, shares /packages/shared with the web. All processing stays server-side.

### 12.4 Store rules

  - Cases are digital goods consumed in the app: in-app purchase only. No Lemon Squeezy inside the app; the "I already have a case" link path is a redemption, not a sale, and is allowed.
  - Consumables: case\_amazon, case\_marketplace, case\_payments, case\_addon at the store price points in section 6.
  - The free classification runs before any paywall (Apple reviewers try the core action first).
  - Restore purchases on the case list screen.
  - Privacy labels and Data safety: data linked to you = email address (for the case link); user content = photos and documents, used for app functionality, not tracking, deleted at 90 days.
  - Review notes for Apple: provide a test notice text, a test invoice PDF, and a sandbox account; state plainly that the app produces a user-authored document and provides no legal services. Apple's guideline 5.1.1 (legal services) is the one to pre-empt.

### 12.5 Screens

1.  **Start.** Logo, "Paste or photograph your deactivation notice", the notice box, "or open a case link". Classification appears inline as on web.
2.  **Paywall sheet.** The tier for the classified platform, the price, what is included, restore purchases, terms line.
3.  **Intake.** One question per screen, "why we ask" under each, progress, back and next, autosave.
4.  **Evidence.** Checklist from classification; each item opens the scanner or picker; extracted facts shown for confirmation.
5.  **Draft.** Serif rendering, pre-check as a bottom sheet with the blocking count as a pill, "Redraft", "Copy", "Share DOCX".
6.  **Cases.** List of the user's cases with status; outcome control per case.

### 12.6 Alpha via TestFlight and Play internal testing (same day)

  - EAS production build, upload to App Store Connect, add to the **internal** TestFlight group (up to 100 testers, available within minutes, no Beta App Review). Add an **external** group in parallel; its Beta App Review takes about a day and does not block internal testers.
  - Google Play: upload to the internal testing track (available within minutes), share the opt-in link.
  - Alpha cohort: 20 to 40 sellers recruited from the launch posts, the Alluvium network, and any seller who used the free classify on the web and left an email in the "want early access on iPhone?" line. Each gets the ALPHA code for one free case. Zoho CRM holds the alpha list (name, email, platform, TestFlight status, feedback received) via the connector so the VA can chase.
  - Feedback: a single form (Google Form or a page in the app) with three questions: what case type, did the pre-check catch something real, what was wrong. Responses go to a Google Sheet in Reinstate / Alpha and to \#reinstate-alpha in Slack through n8n.
  - Alpha exit criteria: 20 completed cases, at least 10 recorded outcomes, no blocking pre-check false positives reported twice.
  - Submit the store listing for review the same day as the TestFlight upload; alpha runs while review happens. Public store launch only after alpha exit criteria are met, even if approval lands first.

### 12.7 Mobile build order

**Phase 6: workspace and API client (1 hour).** /apps/mobile scaffold, shared package wired, notice classify from the app against production. Check: paste a notice in the simulator, see the classification.

  

**Phase 7: intake and evidence (4 hours).** Screens 1, 3, 4 with the scanner and fact confirmation, share extension from Mail. Check: on a physical iPhone, share a suspension email to Reinstate, classify, answer six questions, scan a two-page invoice, see extracted facts.

  

**Phase 8: purchases, draft, notifications (3 hours).** RevenueCat products and webhook into purchases, paywall sheet, draft screen with pre-check sheet, share DOCX, push on draft ready. Check: sandbox purchase creates a case that also opens on the web via the emailed link.

  

**Phase 9: TestFlight and Play internal (2 hours).** Icon, screenshots framed in Figma, listing copy, privacy answers, EAS builds, TestFlight internal group populated with the alpha list, Play internal track, store submissions. Check: an alpha tester on the list receives the TestFlight invite and completes a free case with the ALPHA code.

  

Roughly 10 hours. Accounts needed before Phase 8: Apple Developer (company, Small Business Program), Play Console, RevenueCat.

### 12.8 Store presence

  - App name: "Reinstate: Seller Appeals". Subtitle: "Amazon, Etsy, eBay, PayPal appeals".
  - Screenshots (6): "Paste the notice. See the case type." / "Know what evidence they'll want." / "Answer only the questions that matter." / "Scan your invoices. We read them." / "A Plan of Action built on your facts." / "Every weak point flagged before you submit."
  - Keywords (Apple): amazon,suspended,deactivated,appeal,plan of action,etsy,ebay,mc011,paypal,limitation,seller,reinstate
  - Category: Business (both stores).
  - Ratings prompt: once, after the user records an outcome of "Reinstated". Never otherwise.

  

## 13\. Connector runbook

What each existing connector does in this build, and who runs it (Claude Code in the terminal, or Claude in chat with the connector).

  

|  |  |  |
| :-: | :-: | :-: |
| \*\*Connector\*\* | \*\*Use\*\* | \*\*Runner\*\* |
| \*\*Netlify\*\* | create-new-project for the site; manage-env-vars to set every variable in section 4.3; deploy-site; update-visitor-access-controls to password-protect the site until launch day; get-deploy to verify | Claude in chat, Phase 5 |
| \*\*Higgsfield\*\* | generate\\\_video for the 20 s store preview and the 45 s Short from the typographic storyboard in section 7; sandbox\\\_exec (ffmpeg) to burn captions and cut 9:16 and 16:9 versions; media\\\_upload for any screen recording | Claude in chat, after Phase 4 |
| \*\*Figma\*\* | create\\\_new\\\_file "Reinstate / Brand"; upload\\\_assets for logo, favicon and raw screenshots; use\\\_figma to build the screenshot frame component; download\\\_assets to export store sizes | Claude in chat, Phase 9 |
| \*\*Google Drive\*\* | create\\\_file the folder tree Reinstate / {Spec, Assets, Alpha, Legal}; save this spec, the assets, the alpha feedback sheet, and the terms and privacy source | Claude in chat, day one |
| \*\*Gmail\*\* | create label Reinstate and a filter for desk@reinstate.app replies and Lemon Squeezy notifications; create\\\_draft for the alpha invite email to the cohort | Claude in chat, Phase 5 |
| \*\*Slack\*\* | slack\\\_create\\\_conversation for \\\#reinstate-alpha and \\\#reinstate-sales; n8n posts purchases, outcomes and feedback there; daily digest at 07:00 folded into the existing Chief of Staff brief | Claude in chat, day one |
| \*\*n8n\*\* | three workflows: Lemon Squeezy and RevenueCat webhooks to Slack and the ledger check; feedback form to Sheet and Slack; nightly outcome digest | Claude in chat, Phase 5 |
| \*\*Atlassian Jira\*\* | project RST; every checklist item in sections 10, 12.6 and 12.7 becomes an issue; rejection-pattern updates logged as issues so the moat is auditable | Claude in chat, day one |
| \*\*Zoho CRM\*\* | alpha tester list and, post-launch, agency and affiliate partners | Claude in chat, Phase 9 |
| \*\*Zoom, Wix, EULER\*\* | not used |   |

  

Order of operations on day one: Drive folders and Jira project first (five minutes), then Claude Code Phases 1 to 4, then Netlify and n8n (Phase 5), then Higgsfield and Figma assets while Claude Code runs Phases 6 to 8, then Phase 9 and the alpha invites.

  

## 14\. Phase 2 (after the 90-day review)

  - Case type 19, Google Merchant Center misrepresentation; then Walmart Marketplace and Shopify store closure.
  - Published reinstatement rate per case type once n reaches 100.
  - Agency white-label: a branded case page and a per-seat rate for firms that handle suspensions weekly.
  - Rights-owner retraction workflow for IP cases: draft, send and track the retraction request.
  - Account Health monitoring as a small monthly product only if alpha testers ask for it unprompted; otherwise never.

  