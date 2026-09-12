import type { FaqItem } from './faq';

export interface LandingPage {
  /** URL segment: /appeal/[platform]/[slug] */
  platform: string;
  slug: string;
  /** The case type in /packages/shared/casetypes this page sells. */
  caseTypeId: string;
  title: string;
  description: string;
  h1: string;
  intro: string;
  /** 300 to 500 words for a panicked reader: what the notice means, what the platform expects. */
  explainer: string[];
  rejections: string[];
  evidence: string[];
  faq: FaqItem[];
  price: string;
}

export const LANDING_PAGES: LandingPage[] = [
  {
    platform: 'amazon',
    slug: 'section-3-inauthentic',
    caseTypeId: 'amazon-inauthentic',
    title: 'Amazon Section 3 inauthentic appeal: Plan of Action that gets read | Reinstate',
    description:
      'Your Amazon account was deactivated for inauthentic items. What Seller Performance expects, the three commonest reasons this appeal is rejected, and how to build one on your own invoices.',
    h1: 'Amazon deactivated your account for inauthentic items. Here is what to send back.',
    intro:
      'The notice names ASINs and asks for invoices. What it does not tell you is that invoices dated after your first sale, from a supplier with no phone number, or for fewer units than you sold, are the three commonest reasons this appeal is rejected. Paste your notice below to see what Amazon will expect from you.',
    explainer: [
      'A Section 3 deactivation for inauthentic items means Amazon has received complaints, or run a check, that puts the origin of your stock in doubt. The word inauthentic does not mean Amazon has decided you sold fakes. It means the supply chain behind the ASINs in the notice has not been evidenced to their satisfaction, and until it is, the account stays down.',
      'What Seller Performance wants is a Plan of Action in three parts, in this order and with these headings: root cause, corrective actions already taken, preventive measures. That structure is not a formality. A reviewer reads the root cause first and stops there if it only repeats the notice back at them. The root cause has to say what you did or failed to do: bought from a supplier you had not verified, kept no record tying stock to ASINs, used a wholesaler who turned out to be a reseller.',
      'Alongside the Plan of Action, Amazon expects invoices. They have a specific idea of what an invoice is. It comes from a business, not a shop. It shows that business’s full address and a phone number they can call, because they will call. It names your business as the buyer. It covers the ASINs in the notice, in quantities that make sense against what you sold, and it is dated before you started selling those units. A till receipt from a wholesale warehouse, an order confirmation from another marketplace, or a PDF with a logo and no contact details will not pass.',
      'The corrective actions section is where most appeals go wrong in a way that is easy to fix. Each item has to be something you have already done, with the date you did it. Removed the affected ASINs on 4 April 2026. Changed supplier to a named distributor on 11 April 2026. Introduced a check on every inbound delivery on 15 April 2026. An item without a date reads as a promise, and promises belong in the preventive section, where they still need an owner and a cadence.',
      'Length matters less than specificity, but there is a practical range. Between 350 and 600 words is enough to carry the facts without burying them. No apology paragraph. No history of the business. Nothing about how much the account means to you.',
    ],
    rejections: [
      'Invoices dated after the first sale of the ASIN, so they cannot evidence the units that were sold.',
      'A supplier with no full address and no phone number on the invoice, which Amazon treats as unverifiable.',
      'Quantities on the invoices that do not cover the units sold, with no explanation of the difference.',
    ],
    evidence: [
      'The deactivation notice',
      'Supplier invoices covering the ASINs named, with full address and phone',
      'Authorisation or distributor letter, if you have one',
      'Proof of payment for the invoices',
    ],
    faq: [
      {
        q: 'Can I use receipts from a wholesale club or another marketplace?',
        a: 'No. Amazon treats those as retail purchases, not supply chain evidence. If that is what you have, the appeal has to be built around what you have changed in sourcing, not around documents that will be rejected.',
      },
      {
        q: 'How long does Amazon take?',
        a: 'Amazon’s stated turnaround is 3 to 5 business days. Submitting a second appeal while the first is open slows it down.',
      },
      {
        q: 'What if my supplier will not give me an invoice with their phone number on it?',
        a: 'Ask them for a reissued invoice on headed paper. Most wholesalers will do it. If they will not, that itself is part of the root cause and the appeal has to reflect the sourcing change you have made since.',
      },
    ],
    price: '£49',
  },
  {
    platform: 'amazon',
    slug: 'related-account',
    caseTypeId: 'amazon-related-account',
    title: 'Amazon related account deactivation appeal: what actually works | Reinstate',
    description:
      'Amazon deactivated your account because it is linked to another. What Amazon means by related, what the appeal has to say, and why a flat denial fails.',
    h1: 'Amazon says your account is related to another one. Here is what to send back.',
    intro:
      'Amazon rarely tells you which account it means, and almost never tells you what linked them. The appeal that works names the link anyway. A flat denial is the commonest version of this appeal and the one that gets the standard rejection. Paste your notice below to see what Amazon will expect.',
    explainer: [
      'A related account deactivation means Amazon has matched your selling account to another one that is closed, deactivated or operating without permission. The match can come from an address, a device, a network, a bank account, a card, a phone number, a tax ID or an email that has touched both accounts. You do not have to have done anything deliberate for the match to fire.',
      'The first decision is whether the notice names the other account. If it does, address that account directly. If it does not, ask, in the same submission, which account Amazon means, and at the same time set out what could have caused a link. Asking on its own is not enough; an appeal that only asks a question gets the template reply.',
      'The second decision is what the relationship actually is. There are six common situations and they need different appeals. No relationship at all. Your own second account, closed in good standing. Your own second account, deactivated. A family member or housemate selling from the same address. A business partner or an employee. An account you bought or sold, which Amazon does not permit.',
      'Where the other account is yours and in good standing, you are usually allowed to operate both, but only with a legitimate business need and Amazon’s knowledge. If you ever raised a case asking permission, that case reference is the single most useful fact you have. If you never did, the corrective action is to request it now and say so.',
      'Where the other account is deactivated, this appeal usually cannot succeed on its own. Amazon will not reinstate an account it considers linked to an unresolved deactivation. The realistic order is to fix the other account’s issue first, then appeal this one citing the resolution.',
      'Where there is genuinely no relationship, you still have to name the plausible link and offer to evidence separation: a different registered entity, separate premises, a separate bank account, a separate broadband connection. Write the root cause around the shared signal, not around your innocence.',
    ],
    rejections: [
      'A flat denial with no explanation of what could have caused the link.',
      'An appeal that only asks which account Amazon means, with nothing else in it.',
      'Appealing while the related account’s own deactivation is still unresolved.',
    ],
    evidence: [
      'The deactivation notice',
      'Proof of separate operations: registration, bank account, premises, broadband',
      'The case reference where you asked permission for a second account',
      'Identity documents showing two different entities at the same address',
    ],
    faq: [
      {
        q: 'Amazon will not tell me which account it is. What do I do?',
        a: 'Ask in the appeal and answer it at the same time. Set out every shared signal you can think of and offer the evidence of separation. An appeal that only asks the question gets the template reply.',
      },
      {
        q: 'My partner sells on Amazon from the same house. Is that allowed?',
        a: 'It can be, but the accounts will be linked and Amazon expects to know. The appeal should declare it plainly and show the two businesses are separate entities with separate finances.',
      },
      {
        q: 'I bought the account from someone else. Can I appeal?',
        a: 'Account transfers are not permitted, and an appeal that hides one usually fails when the verification documents do not match. Be honest about the position and expect the realistic outcome to be a new, correctly registered account.',
      },
    ],
    price: '£49',
  },
  {
    platform: 'amazon',
    slug: 'restricted-products',
    caseTypeId: 'amazon-restricted-products',
    title: 'Amazon restricted products appeal: what Seller Performance expects | Reinstate',
    description:
      'Amazon removed your listings or deactivated your account under the restricted products policy. What the notice means, what to attach, and what gets this appeal rejected.',
    h1: 'Amazon says you listed a restricted product. Here is what to send back.',
    intro:
      'This notice names a policy and usually one or two ASINs. The appeal that works quotes that policy back, names the check that did not happen before listing, and says what happened to the stock. Paste your notice below to see what Amazon will expect from you.',
    explainer: [
      'The restricted products policy covers a long list: items needing certification, hazardous materials, expired or short-dated goods, medical devices, pesticides, recalled products, and categories that need approval before you can list in them. The notice will name the policy it believes you breached. That name is the spine of your appeal.',
      'There are two situations and they produce different appeals. Either the product genuinely is permitted and you can evidence it with certificates, test reports or a licence, in which case the appeal attaches them and explains the check that should have caught the listing earlier. Or the product should never have been listed, in which case arguing is the fastest route to a rejection and the appeal is about removal, disposal and the process that stops it happening again.',
      'Amazon will ask what happened to the inventory. Answer it before they ask. Removed from sale on a date, returned to the supplier on a date, disposed of through a removal order on a date. If the stock is still in a fulfilment centre and still listed, the appeal contradicts itself.',
      'The preventive section for this case type is where a document helps most. A written pre-listing compliance checklist, with a named owner and a stated cadence, turns a promise into something a reviewer can picture. Attach it. It does not need to be long; it needs to exist and to be dated.',
    ],
    rejections: [
      'Arguing that the product is permitted without attaching a single compliance document.',
      'Corrective actions with no dates, so nothing can be verified.',
      'Never saying what happened to the remaining stock.',
    ],
    evidence: [
      'The deactivation or listing removal notice',
      'Compliance documents: certificates, safety data sheets, test reports, licences',
      'Proof the listings were closed',
      'Removal or disposal record for the stock',
      'Your written pre-listing compliance checklist',
    ],
    faq: [
      {
        q: 'The product is legal to sell in my country. Is that enough?',
        a: 'No. Amazon applies its own policy, which is often stricter than the law. The appeal has to address Amazon’s policy, with the documents Amazon asks for.',
      },
      {
        q: 'Can I relist the product after reinstatement?',
        a: 'Only if the appeal established that it is permitted and you hold the documents. If the appeal was built on removal, relisting the same item will deactivate the account again.',
      },
      {
        q: 'How long does it take?',
        a: 'Amazon’s stated turnaround is 3 to 5 business days.',
      },
    ],
    price: '£49',
  },
  {
    platform: 'amazon',
    slug: 'review-manipulation',
    caseTypeId: 'amazon-review-manipulation',
    title: 'Amazon review manipulation appeal: code of conduct Plan of Action | Reinstate',
    description:
      'Amazon deactivated your account for review manipulation or a seller code of conduct breach. What the allegation usually means, and how to answer it without a flat denial.',
    h1: 'Amazon says you manipulated reviews. Here is what to send back.',
    intro:
      'These notices are deliberately vague and the appeal has to be specific anyway. A denial with nothing behind it is the commonest response and the one that gets rejected. Paste your notice below to see what Amazon will expect from you.',
    explainer: [
      'Review manipulation covers more than paying for reviews. Insert cards that ask for a positive review, or offer anything in return for one. Rebate groups. Review exchange communities. Asking a buyer to change or remove a negative review. Marketing agencies doing any of these on your behalf without you knowing. Amazon treats the last case as yours, because the account is yours.',
      'The first job is to find out what actually happened. Who has had access to your account, your listings, your advertising and your buyer messaging? What does your insert card say, word for word? Have you ever used a service that promised reviews? Most sellers who believe they did nothing find something here when they look properly.',
      'The root cause has to name it. Where an agency or a freelancer did it, name them and own the failure to supervise. Blaming a third party without taking responsibility for having engaged them reads as deflection and fails. Where you did it yourself, say so plainly and show the change. Amazon reinstates sellers who admit and correct far more often than sellers who argue.',
      'Where you genuinely believe the allegation is wrong, the appeal still cannot be a denial. Set out what your buyer communications actually say, attach the templates and the insert card, and let the documents do the work.',
    ],
    rejections: [
      'A denial with no evidence of what your communications and insert cards actually say.',
      'Blaming an agency without naming them or owning the decision to hire them.',
      'Corrective actions with no dates, and preventive measures with no approval step.',
    ],
    evidence: [
      'The deactivation notice',
      'A photograph or file of your current insert card',
      'Evidence that an agency or freelancer’s access was removed',
      'Your current buyer message templates',
    ],
    faq: [
      {
        q: 'My agency did this without telling me. Does that help?',
        a: 'It helps only if you name them, show their access has been removed with a date, and accept that supervising them was your responsibility.',
      },
      {
        q: 'My insert card just says “we would love your feedback”. Is that a problem?',
        a: 'Asking for a review neutrally is allowed. Asking for a positive review, or offering anything in return, is not. The exact wording is what matters, so put the card in front of the reviewer.',
      },
      {
        q: 'Should I admit something I am not sure about?',
        a: 'No. Never write anything untrue in either direction. Find out what actually happened first, then write the appeal around the facts.',
      },
    ],
    price: '£49',
  },
  {
    platform: 'amazon',
    slug: 'drop-shipping',
    caseTypeId: 'amazon-drop-shipping',
    title: 'Amazon drop shipping policy appeal: seller of record | Reinstate',
    description:
      'Amazon deactivated your account under the drop shipping policy. The policy is not a ban on drop shipping. Here is what it actually requires and what to send back.',
    h1: 'Amazon says you breached the drop shipping policy. Here is what to send back.',
    intro:
      'Amazon does not ban drop shipping. It bans your customer receiving a parcel from another retailer. The appeal turns entirely on which of those you were doing. Paste your notice below to see what Amazon will expect from you.',
    explainer: [
      'The policy has one core requirement: you must be the seller of record. Your business name goes on the packing slip, the invoice, the external packaging and anything else the buyer sees. Buying from a wholesaler who ships under your name is allowed. Ordering from another retailer and having them ship a branded box to your Amazon customer is not, and that is what triggers this deactivation.',
      'Amazon usually names order IDs. Those orders are the case. For each one, you need to know who actually shipped it and what the customer received. If another retailer’s packing slip went in the box, the appeal admits it. Arguing about the definition of drop shipping when Amazon has a photograph of a competitor’s invoice does not work.',
      'The corrective actions name the new supply arrangement, with the supplier named and the date the change took effect. A statement that you have “changed your fulfilment process” with no supplier and no date is the version that gets rejected. Where you can, attach a current packing slip showing your business as the seller of record. It is the single document that answers the policy directly.',
      'Do not forget the customers. Amazon reads the customer impact as part of the root cause. Say how many orders were affected and what you did for those buyers.',
    ],
    rejections: [
      'Never addressing the seller of record requirement, which is the whole policy.',
      'Describing a new supply arrangement without naming the supplier or the date.',
      'Arguing that drop shipping is permitted, without answering what the customer actually received.',
    ],
    evidence: [
      'The deactivation notice',
      'Agreement or invoice from your current supplier',
      'A current packing slip showing your business as the seller of record',
      'Shipping records for recent orders',
    ],
    faq: [
      {
        q: 'Is drop shipping allowed on Amazon at all?',
        a: 'Yes, provided you are the seller of record on every document and package the customer sees, and you are responsible for returns.',
      },
      {
        q: 'What if only one or two orders went out this way?',
        a: 'Address those orders specifically by ID, say what the buyers received, and show the fulfilment change with a date. A small number handled honestly is a straightforward appeal.',
      },
      {
        q: 'How long does it take?',
        a: 'Amazon’s stated turnaround is 3 to 5 business days.',
      },
    ],
    price: '£49',
  },
  {
    platform: 'amazon',
    slug: 'ip-complaint',
    caseTypeId: 'amazon-ip-complaint',
    title: 'Amazon IP complaint appeal: retraction, authorisation or POA | Reinstate',
    description:
      'A rights owner filed an infringement complaint against your ASINs or your account. There are only three routes back. Here is how to tell which one is yours.',
    h1: 'A rights owner complained about your listings. Here is what to send back.',
    intro:
      'Amazon does not decide who owns a trademark. That is why legal argument in this appeal goes nowhere and a retraction from the rights owner resolves it in a day. Paste your notice below to see which route your case supports.',
    explainer: [
      'An intellectual property complaint reaches you as a notice with a complaint ID and the name of the rights owner. It can hit a single ASIN or the whole account, usually depending on how many complaints have accumulated. The complaint ID is the reference everything else hangs off; without it Amazon cannot match your appeal to the notice.',
      'There are three routes back and only three. The rights owner retracts the complaint. You show authorisation to sell the brand. Or the listing was in error and you have removed or corrected it. A fourth situation, genuine goods bought through a verifiable chain, is really a variant of the third: you keep the listing and evidence the supply chain.',
      'The retraction route is the fastest and the most underused. It means writing to the rights owner, not to Amazon, naming the item numbers and the complaint ID, explaining where the goods came from, and asking them to notify Amazon. Rights owners retract more often than sellers expect, particularly where the complaint was about images or a title rather than the product itself.',
      'The authorisation route only works with a document that names your business, is dated, and covers the brand and the marketplace. A general reseller agreement that does not name you is not authorisation. Do not claim it if you cannot attach it.',
      'Where the listing was genuinely wrong, say what element infringed: an image lifted from the brand’s site, the brand name in a title for a compatible product, copied description text. Name it, say when you fixed it, and put a pre-listing rights check in the preventive measures with an owner.',
    ],
    rejections: [
      'An appeal that does not quote the complaint ID, so it cannot be matched to the notice.',
      'Claiming authorisation without attaching a letter that names your business.',
      'Arguing trademark law at a reviewer who has no authority to decide it.',
    ],
    evidence: [
      'The infringement notice with the complaint ID',
      'Retraction email from the rights owner, if you have one',
      'Authorisation or distributor letter naming your business',
      'Supplier invoices for the affected ASINs',
    ],
    faq: [
      {
        q: 'Will Amazon overturn the complaint if I prove the goods are genuine?',
        a: 'Sometimes, with strong supply chain evidence. But a retraction from the rights owner works faster and more reliably, so pursue both.',
      },
      {
        q: 'How do I contact the rights owner?',
        a: 'The notice usually carries their name and a contact address. Write to them with the complaint ID and item numbers and ask them to notify Amazon directly. We draft that email as part of this case type.',
      },
      {
        q: 'Should I use a lawyer?',
        a: 'For a single complaint, rarely. Amazon is not adjudicating ownership. A clear factual request to the rights owner does more than a legal letter.',
      },
    ],
    price: '£49',
  },
  {
    platform: 'amazon',
    slug: 'account-health',
    caseTypeId: 'amazon-account-health',
    title: 'Amazon ODR and account health appeal: performance Plan of Action | Reinstate',
    description:
      'Your account was deactivated or restricted for Order Defect Rate, late shipment or cancellation rate. What an accepted performance appeal actually contains.',
    h1: 'Amazon deactivated your account over a performance metric. Here is what to send back.',
    intro:
      'A performance appeal is about one number. The version that gets accepted goes through the defective orders one by one. The version that gets rejected talks about growth and commitment. Paste your notice below to see what Amazon will expect.',
    explainer: [
      'Amazon publishes targets: Order Defect Rate under 1 per cent, Late Shipment Rate under 4 per cent, Pre-fulfilment Cancel Rate under 2.5 per cent, Valid Tracking Rate above 95 per cent. The notice names the metric you missed, the figure and the period. Everything in your appeal has to sit inside that period.',
      'The strongest thing you can do is go order by order. Pull the defective transactions for the window and work out what happened in each. A carrier that failed in one region. A supplier who ran out during a promotion. A week when one person was ill and nobody watched the dispatch queue. Those are causes a reviewer can accept. “We grew quickly” is not.',
      'Name the carrier, the supplier or the gap. A named carrier and a dated switch reads as a fixed problem. An unnamed one reads as an excuse. Then give the current figures. Recent improvement is the single most persuasive fact in this case type, and it is the one most appeals leave out.',
      'Preventive measures for performance cases need a threshold. Who looks at the dashboard, how often, at what number do they act, and what is the action. Monitoring with no trigger is not a preventive measure, it is a hope.',
    ],
    rejections: [
      'A root cause written in general terms rather than at order level.',
      'No statement of where the metric stands now.',
      'Preventive measures that describe monitoring with no threshold and no action.',
    ],
    evidence: [
      'The performance notice',
      'Your Account Health page showing current figures',
      'Evidence of the carrier or process change',
      'Your own analysis of the defective orders',
    ],
    faq: [
      {
        q: 'Can I get defects removed rather than appealing?',
        a: 'On Amazon, some defects can be reviewed where the cause was a buyer or carrier issue with proof. Do that first; it may fix the metric without an appeal.',
      },
      {
        q: 'My metric is already back under target. Do I still need a Plan of Action?',
        a: 'Yes, but it is a much easier appeal. Lead with the current figure and evidence it with a screenshot.',
      },
      {
        q: 'Can I call Amazon about this?',
        a: 'Account Health Support can often be reached the same day and is worth using alongside the written appeal.',
      },
    ],
    price: '£49',
  },
  {
    platform: 'amazon',
    slug: 'asin-removed',
    caseTypeId: 'amazon-asin-removed',
    title: 'Amazon ASIN removed appeal: used sold as new and condition complaints | Reinstate',
    description:
      'Amazon removed your listing for product condition or authenticity. What the notice means, what evidence works, and why invoices alone are often not enough.',
    h1: 'Amazon removed your listing. Here is what to send back.',
    intro:
      'A listing removal is not an account deactivation, and the appeal is narrower: one ASIN, one complaint type, one set of documents. Used sold as new needs packaging and handling evidence, not just invoices. Paste your notice below to see what Amazon will expect.',
    explainer: [
      'Listing removals come from complaints clustered on one ASIN: used sold as new, item not as described, authenticity, condition, or expiry and date labelling. The notice names the ASIN and the complaint type, and those two facts decide what you attach.',
      'For authenticity, the evidence is the same as an account-level inauthentic case: invoices from a verifiable business, dated before your first sale, covering the units you sold, with a full address and a phone number.',
      'For used sold as new and condition complaints, invoices are necessary but not sufficient. What the reviewer wants is handling detail: how stock is stored, how it is inspected before it ships, what packaging it goes out in, whether returns are re-inspected before being put back into sellable stock. Photographs of the product and its packaging as you actually send it are worth more than a paragraph of assurance.',
      'If the stock is FBA, commingling and warehouse handling are legitimate parts of a root cause, and a removal order for the affected inventory is a strong dated corrective action. If the stock is merchant fulfilled, those explanations are not available to you and the appeal has to be about your own process.',
    ],
    rejections: [
      'An appeal that never names the ASIN from the notice.',
      'Invoices dated after the first sale, or from a supplier with no contact details.',
      'Condition complaints answered with assurances instead of handling and packaging detail.',
    ],
    evidence: [
      'The listing removal notice',
      'Supplier invoices for the ASIN',
      'Photographs of the product and packaging as you ship it',
      'Removal order or disposal record for affected FBA stock',
    ],
    faq: [
      {
        q: 'Does a listing removal put my account at risk?',
        a: 'Repeated removals do. Treat the first one as the cheapest warning you will get and fix the underlying handling or sourcing issue.',
      },
      {
        q: 'My stock is commingled in FBA. Is that a defence?',
        a: 'It is a legitimate part of a root cause, but it has to be paired with your own corrective action, usually stickerless commingling turned off and a removal order for the affected units.',
      },
      {
        q: 'Where do I submit this?',
        a: 'Seller Central, Account Health, Product Policy Compliance, then the appeal link on the removed ASIN.',
      },
    ],
    price: '£49',
  },
  {
    platform: 'amazon',
    slug: 'verification-failed',
    caseTypeId: 'amazon-verification-failed',
    title: 'Amazon verification failed: which documents actually pass | Reinstate',
    description:
      'Amazon could not verify your identity or business. This is a documents case, not an argument. Here is the checklist and the mismatches that fail it.',
    h1: 'Amazon could not verify your business. Here is what to send back.',
    intro:
      'Nearly every failed verification comes down to one mismatch: a name, an address or a document that is too old. Find the mismatch and the case closes. Paste your notice below to see what Amazon is asking for.',
    explainer: [
      'Identity and business verification is not a policy judgement. It is a matching exercise. Amazon compares the legal name and registered address on your account against every document you send. One character of difference, one document older than the window, one missing beneficial owner, and the submission fails without anyone reading a covering message.',
      'So the first step is not to write anything. It is to lay the documents side by side and read the name and address on each one exactly as printed. Trading name against registered name. Flat number present on one and missing on another. A utility bill in a partner’s name. An ID that expired last year. Those are the failures.',
      'Where a difference is genuine and unavoidable, for example a trading name that differs from the registered name, reconcile it in one short paragraph rather than hoping the reviewer works it out.',
      'Documents must be full colour images or scans of the whole page. Cropped screenshots, photographs with fields blacked out, or PDFs exported from a banking app with the address omitted all fail. If your business details have genuinely changed, update the account first; no document will ever match an out of date account.',
    ],
    rejections: [
      'A name or address on one document that does not match the account, with no reconciliation.',
      'An address proof older than 90 days.',
      'Cropped, redacted or low quality scans that cannot be read in full.',
    ],
    evidence: [
      'The verification notice',
      'Business registration document',
      'Utility bill or bank statement dated in the last 90 days',
      'Photo ID for the primary contact and each beneficial owner',
      'Bank statement showing the deposit account name',
    ],
    faq: [
      {
        q: 'Amazon rejected the same documents twice. What now?',
        a: 'Stop resending. Find the mismatch first, character by character, then either update the account or obtain a document that matches it.',
      },
      {
        q: 'Can I black out my account number on a bank statement?',
        a: 'No. Redacted documents are rejected. Send the whole page.',
      },
      {
        q: 'How long does verification take?',
        a: 'Usually 2 to 3 business days per submission, which is why getting it right the first time matters.',
      },
    ],
    price: '£49',
  },
  {
    platform: 'amazon',
    slug: 'plan-of-action',
    caseTypeId: 'amazon-inauthentic',
    title: 'How to write an Amazon Plan of Action that gets accepted | Reinstate',
    description:
      'The structure Amazon expects, what belongs in root cause, corrective actions and preventive measures, and the sentences that get a Plan of Action rejected.',
    h1: 'How to write an Amazon Plan of Action',
    intro:
      'A Plan of Action has three headings, in one order, and each has a job. Most rejected appeals fail in the first paragraph. Paste your notice below and we will tell you which kind of Plan of Action yours needs.',
    explainer: [
      'A Plan of Action is the document Amazon asks for when it deactivates an account or a listing. It has three sections and the headings are not optional: root cause, corrective actions already taken, preventive measures. Reviewers read hundreds a week and they read them in that order.',
      'Root cause is where appeals die. It has to explain what you did or failed to do. Not what the customer complained about, not what Amazon detected, not what the market is like. If the first paragraph restates the notice, the reviewer has learned nothing and the rest is unlikely to be read carefully.',
      'Corrective actions are things already done, each with a date, each starting with a verb, each referencing a document where one exists. Removed the four affected ASINs on 4 April 2026. Obtained a reissued invoice from the supplier on 9 April 2026, attached as invoice-brightwholesale-0403.pdf. An undated corrective action is a promise wearing the wrong hat.',
      'Preventive measures are the future, and they need three things to be credible: an owner, a cadence and a trigger. Who does it, how often, and at what point do they act. “We will be more careful” is not a preventive measure. “Our warehouse manager checks every inbound delivery against the purchase order and rejects any unit without a matching invoice line, from 15 April 2026” is.',
      'A few habits reliably hurt. Apologising at length. Explaining how much the business means to you. Listing years of good performance. Saying you are a loyal seller, that the decision is unfair, or asking for one more chance. None of it changes the decision and all of it dilutes the facts that might.',
      'Aim for 350 to 600 words. Attach the documents you cite, named exactly as you name them in the text. Submit once and wait.',
    ],
    rejections: [
      'A root cause that restates the notice instead of explaining the seller’s own act or omission.',
      'Corrective actions with no dates and no document names.',
      'Preventive measures with no owner, no cadence and no trigger.',
    ],
    evidence: [
      'The deactivation notice',
      'The documents the notice asks for, usually supplier invoices',
      'Proof of any corrective action you claim',
    ],
    faq: [
      {
        q: 'How long should a Plan of Action be?',
        a: 'Between 350 and 600 words for most case types. Long enough for the facts, short enough to be read.',
      },
      {
        q: 'Should I apologise?',
        a: 'No. An apology paragraph takes space that a dated fact could use. Accepting responsibility in the root cause is different, and is worth doing.',
      },
      {
        q: 'Can I reuse a template I found online?',
        a: 'Amazon sees the same templates constantly and generic wording is itself a reason for rejection. Use the structure, never the sentences.',
      },
    ],
    price: '£49',
  },
  {
    platform: 'etsy',
    slug: 'shop-suspended',
    caseTypeId: 'etsy-shop-suspended',
    title: 'Etsy shop suspended for no reason: how to appeal | Reinstate',
    description:
      'Etsy suspended your shop without naming a policy. How to work out what actually triggered it and write an appeal that fits in 2,000 characters.',
    h1: 'Etsy suspended your shop and will not say why. Here is what to send back.',
    intro:
      'Etsy’s standard suspension email names no policy and offers no detail. An appeal that only asks what happened gets the same email back. Paste your notice below and we will work out what is most likely behind it.',
    explainer: [
      'Etsy suspends shops through a mix of automated checks and manual review, and the email you receive rarely distinguishes the two. The most common true causes are an undeclared production partner, a listing that trips the reseller check, a payment or identity mismatch, a linked account in the same household, or a sudden change in shop behaviour such as a bulk edit or an order spike.',
      'That gives you something to work with. Look at the two weeks before the suspension. New listings, a new supplier, bulk edits, a spike in orders, a change of bank details or address, a login from a new device or country. Most unspecified suspensions trace to one of those, and an appeal that names the likely trigger and addresses it gets a human response far more often than one that asks a question.',
      'Etsy’s appeal box takes about 2,000 characters. That is roughly 300 words, which changes how you write. Open by naming the shop and the date. Say in two sentences what the shop sells and how long it has traded. Address the policy you believe is at issue, concretely. Then list what you have already corrected, with dates.',
      'If you have a second shop in the household, declare it. If you use production partners, say whether they are declared on every listing and when you fixed it if they were not. Etsy finds these things anyway, and finding them after your appeal is worse than reading them in it.',
    ],
    rejections: [
      'An appeal that only asks Etsy what the violation was.',
      'Copy that could belong to any shop, which is what Trust and Safety reads all day.',
      'Going over 2,000 characters so the appeal is cut off mid sentence.',
    ],
    evidence: [
      'The suspension email',
      'Screenshots of your main listings',
      'Supplier or materials invoices',
      'Identity or bank verification documents, if Etsy asked for them',
    ],
    faq: [
      {
        q: 'Etsy will not tell me the policy. How can I appeal?',
        a: 'Name the policy you believe applies, address it with specifics from your shop, and ask Etsy to correct you if it is something else. That gets a human reply far more often than a question alone.',
      },
      {
        q: 'How long does Etsy take?',
        a: 'Typically 3 to 7 days. Sending repeated appeals moves you back down the queue.',
      },
      {
        q: 'Can I open a new shop while I wait?',
        a: 'No. A new shop from the same household will be linked and suspended, and it makes the original appeal harder.',
      },
    ],
    price: '£29',
  },
  {
    platform: 'etsy',
    slug: 'handmade-policy',
    caseTypeId: 'etsy-handmade-policy',
    title: 'Etsy handmade policy suspension appeal: reselling and production partners | Reinstate',
    description:
      'Etsy suspended your shop for reselling or breaching the handmade policy. What the policy actually requires and what evidence turns this appeal.',
    h1: 'Etsy says your items are not handmade. Here is what to send back.',
    intro:
      'Etsy’s handmade policy is about your role in making and designing, not about whether you used a machine. Undeclared production partners are the commonest real cause. Paste your notice below to see what Etsy will expect.',
    explainer: [
      'The handmade policy asks three things: did you design it, did you make it or work with a declared production partner who does, and is that partner declared on every listing that uses them. Buying blanks, components and materials is allowed. Buying finished goods and reselling them is not.',
      'Most suspensions under this policy come from one of three situations. A production partner who is not declared. Listings that use words like wholesale, stock, dropship or resale, which trip automated checks regardless of what you actually do. Or photographs that look like stock images from a supplier catalogue rather than your own work.',
      'The evidence that turns this appeal is photographic. Unstaged photographs of your workspace and of the item at each stage of making, in sequence, with the item recognisable as the one in your listing. Alongside them, invoices for materials and blanks, which show you buy inputs rather than finished goods. A written description of your process, step by step, naming your tools and materials, does more than any amount of craft language.',
      'If you do use a production partner, declare it, say when you declared it, and attach the agreement. Etsy permits production partners. It does not permit hiding them.',
    ],
    rejections: [
      'Describing the craft in general terms instead of the making process step by step.',
      'An undeclared production partner, which Etsy will find.',
      'No process photographs, leaving the appeal resting on your description alone.',
    ],
    evidence: [
      'The suspension email',
      'Photographs of your workspace and the item at each stage of making',
      'Invoices for materials, blanks or components',
      'Your production partner agreement, if you use one',
      'Design files, sketches or patterns',
    ],
    faq: [
      {
        q: 'I use a print on demand supplier. Is that allowed?',
        a: 'Yes, if you designed the artwork and the supplier is declared as a production partner on every listing that uses them.',
      },
      {
        q: 'I buy blank mugs and print them myself. Is that handmade?',
        a: 'Yes. Buying blanks and adding your own design is within the policy. The appeal needs to show the printing step clearly.',
      },
      {
        q: 'How long does Etsy take?',
        a: 'Typically 3 to 7 days.',
      },
    ],
    price: '£29',
  },
  {
    platform: 'etsy',
    slug: 'ip',
    caseTypeId: 'etsy-ip',
    title: 'Etsy intellectual property takedown: how to respond | Reinstate',
    description:
      'A rights owner reported your Etsy listings. What a licence actually has to cover, when a counter notice is the wrong move, and what to send back.',
    h1: 'A rights owner reported your Etsy listings. Here is what to send back.',
    intro:
      'The fastest route back on Etsy is a retraction from the reporter, not an argument with Etsy. And most commercial use licences do not cover what sellers think they cover. Paste your notice below to see which route fits your case.',
    explainer: [
      'Etsy removes listings when a rights owner files an infringement report. The notice names the reporter and the listings. Etsy does not adjudicate ownership, so an appeal arguing the merits usually goes nowhere; a retraction from the reporter resolves it quickly.',
      'The first question is where the design, artwork or wording came from. Your own original work, with dated files, is a strong position. A commissioned design with a written assignment is strong. A licence bought from a design marketplace is where most sellers get caught out: many licences permit personal use, or digital use, but not resale on physical products. Read the licence before you rely on it, because Etsy will.',
      'Where you have no defensible right, the fastest path is removal and a clean statement that the listings are down and will not return, with the date. That will usually restore the shop even where it does not restore the listings.',
      'Where the complaint is about images rather than the product, replacing them with your own photographs resolves it outright, and saying so in the response is often enough.',
      'Be careful with counter notices. A formal counter notice puts a legal process in motion and invites the rights owner to escalate. It is the right move when you genuinely hold the right and can evidence it, and the wrong move otherwise.',
    ],
    rejections: [
      'Claiming a licence without attaching it, or attaching one that does not cover resale on physical goods.',
      'Arguing infringement law at Etsy, which does not decide ownership.',
      'Never saying when the affected listings came down.',
    ],
    evidence: [
      'The infringement notice from Etsy',
      'Your licence or commercial use document',
      'Your original, dated design files',
      'A retraction from the rights owner, if you have one',
    ],
    faq: [
      {
        q: 'I bought a commercial use licence. Is that enough?',
        a: 'Only if it covers resale on physical products in the quantities you sold. Many do not. Read the exact terms before relying on them in an appeal.',
      },
      {
        q: 'Should I file a counter notice?',
        a: 'Only when you genuinely hold the right and can evidence it. A counter notice invites escalation, so it is not a default move.',
      },
      {
        q: 'Can I just remove the listings?',
        a: 'Often yes, and it is the fastest route back where you have no defensible right. Say that they are removed and give the date.',
      },
    ],
    price: '£29',
  },
  {
    platform: 'ebay',
    slug: 'mc011',
    caseTypeId: 'ebay-mc011',
    title: 'eBay MC011 restriction: the documents that actually pass | Reinstate',
    description:
      'eBay restricted your account under MC011 business verification. The document checklist, the mismatches that fail it, and how long it takes.',
    h1: 'eBay has restricted your account under MC011. Here is what to send back.',
    intro:
      'MC011 is a documents case, not an argument case. It fails on name and address mismatches far more often than on anything else. Paste your notice below to see exactly what eBay is asking for.',
    explainer: [
      'MC011 is eBay’s business verification restriction. It stems from regulatory requirements that oblige eBay to confirm who is trading and where the money goes. Selling is blocked and payouts are usually held until verification passes.',
      'Everything turns on matching. The legal name on the account, character for character, against the name on every document. The registered address against the address on every document. The account type, individual or business, against the kind of documents you send. A limited company account with a personal utility bill is a mismatch. A sole trader account with company registration documents is a mismatch.',
      'Address proof has a window, usually 90 days. A bank statement from four months ago will be rejected without anyone reading your message. Identity documents must be unexpired, in full colour, with the whole document in frame including the edges.',
      'Beneficial owners catch people out. If your company has two shareholders above the threshold, both need identity documents, and both need to be listed on the account. Sending one and hoping fails.',
      'Finally, check the payout bank account. Verification can pass and payouts still stay held if the bank account is not in the exact registered name.',
      'Where a difference is genuine, such as a trading name against a registered name, reconcile it in one short paragraph attached with the documents rather than leaving the reviewer to guess.',
    ],
    rejections: [
      'A name or address that does not match the account, with no reconciliation.',
      'Address proof older than 90 days.',
      'Documents for the wrong account type, or a missing beneficial owner.',
    ],
    evidence: [
      'The MC011 notice',
      'Business registration or Companies House document',
      'Photo ID for each beneficial owner',
      'Utility bill or bank statement dated in the last 90 days',
      'Bank statement header showing the payout account name',
    ],
    faq: [
      {
        q: 'How long does MC011 take?',
        a: 'eBay usually reviews documents within 2 to 5 business days. Payout release can take a few days more after the restriction lifts.',
      },
      {
        q: 'eBay keeps rejecting my documents. Why?',
        a: 'Almost always a mismatch in name or address, or a document outside the date window. Compare each document against the account details character by character before resending.',
      },
      {
        q: 'Can I get my held funds released first?',
        a: 'Not usually. The payout hold lifts after verification passes, so completing the document pack correctly is the fastest route to the money.',
      },
    ],
    price: '£29',
  },
  {
    platform: 'ebay',
    slug: 'below-standard',
    caseTypeId: 'ebay-below-standard',
    title: 'eBay Below Standard seller appeal: defect removal first | Reinstate',
    description:
      'eBay dropped you to Below Standard and lowered your selling limits. Which defects can be removed, and what an appeal has to contain.',
    h1: 'eBay has rated you Below Standard. Here is what to send back.',
    intro:
      'Before you write anything, work out which defects eBay will remove outright. That is often worth more than the appeal itself. Paste your notice below to see what applies to your case.',
    explainer: [
      'Below Standard means your transaction defect rate, late shipment rate or cases closed without seller resolution went past eBay’s threshold in an evaluation period. The consequences are lowered selling limits, reduced search visibility and higher fees, and they persist until the next monthly evaluation.',
      'The first move is defect removal, not appeal. eBay removes defects in defined situations: a buyer demanded something that breaks eBay policy, a carrier delay is evidenced by tracking scans showing you dispatched on time, an eBay site issue caused the problem, or the buyer did not pay. Go through the defective transactions on your dashboard one at a time and request removal for every one that qualifies, with the proof attached.',
      'Whatever is left is the appeal. Work transaction by transaction with the numbers in front of you. eBay support works from transaction numbers, so an appeal that discusses the situation in general terms gives them nothing to act on.',
      'Then the operational answer: what changed in dispatch, in stock control, in how you handle messages, and on what dates. Finish with current figures and a monitoring commitment that has an owner, a cadence and a threshold.',
      'Timing matters. Seller level is re-evaluated on the 20th of each month, so removals processed before that date can lift you out of Below Standard without any further argument.',
    ],
    rejections: [
      'Discussing defects in general rather than by transaction number.',
      'Requesting defect removal without naming the eBay ground or attaching proof.',
      'No current figures, so there is nothing to show the problem is fixed.',
    ],
    evidence: [
      'The Below Standard notice',
      'Your Seller Dashboard showing the defects and current figures',
      'Tracking records for late or disputed shipments',
      'Buyer messages for any defect caused by a policy-breaking demand',
    ],
    faq: [
      {
        q: 'When does my seller level get re-evaluated?',
        a: 'On the 20th of each month. Defect removals processed before that date can lift the restriction without a further appeal.',
      },
      {
        q: 'Which defects can be removed?',
        a: 'Ones caused by a buyer demand that breaks eBay policy, a carrier delay you can evidence with tracking, an eBay site issue, or non-payment. Each needs proof attached.',
      },
      {
        q: 'Do lowered selling limits lift immediately?',
        a: 'Not always at once. Limits usually restore at the next evaluation after the metric recovers.',
      },
    ],
    price: '£29',
  },
  {
    platform: 'ebay',
    slug: 'vero',
    caseTypeId: 'ebay-vero',
    title: 'eBay VeRO takedown: how to get a retraction | Reinstate',
    description:
      'eBay removed your listings at a rights owner’s request. eBay will not overturn it. Here is how to write the retraction request that can.',
    h1: 'eBay removed your listings under VeRO. Here is what to send back.',
    intro:
      'The one thing to understand about VeRO is that eBay will not reverse the removal. Only the rights owner can. So the main document is an email to them, not an appeal to eBay. Paste your notice below to see what your case supports.',
    explainer: [
      'VeRO is eBay’s Verified Rights Owner programme. A participating rights owner reports a listing and eBay removes it, usually within hours and without assessing the merits. Your seller account takes a policy strike, and repeated strikes lead to restriction or suspension.',
      'Because eBay does not adjudicate, appealing to eBay rarely achieves anything. The route back is a retraction: the rights owner writes to eBay withdrawing the report. eBay acts on a retraction within about a day.',
      'So the document that matters is a short, courteous email to the rights owner. It names the item numbers and the notice date, says where the goods came from, attaches invoices where the complaint was about authenticity, and asks them to notify eBay. Rights owners retract more often than sellers expect, particularly when the complaint was about listing images or a brand name in a title rather than the product itself.',
      'Where the complaint is about images or description text, fix it at source. Replace the images with your own photographs, rewrite the description in your own words, and say so in the email. That removes the reason for the complaint entirely.',
      'Do not relist the items until the rights owner retracts. Relisting into an open VeRO report is what turns one removal into an account restriction.',
    ],
    rejections: [
      'Addressing the appeal to eBay, which cannot overturn a VeRO removal.',
      'A form letter to the rights owner, which they will not act on.',
      'Omitting the item numbers, so the retraction cannot be processed.',
    ],
    evidence: [
      'The VeRO removal notice',
      'Invoices for the removed items',
      'Your own photographs of the items',
      'Any authorisation or distributor letter',
    ],
    faq: [
      {
        q: 'Can eBay put my listings back?',
        a: 'Only if the rights owner retracts the report. eBay does not assess the merits of a VeRO removal.',
      },
      {
        q: 'What if the rights owner ignores me?',
        a: 'Send once, follow up once, and in the meantime replace the images and wording that triggered the report so the listing can return in a compliant form.',
      },
      {
        q: 'Will this suspend my account?',
        a: 'One removal usually will not. Repeated removals lead to restriction, so treat the first as the moment to change the process.',
      },
    ],
    price: '£29',
  },
  {
    platform: 'tiktok-shop',
    slug: 'deactivated',
    caseTypeId: 'tiktok-shop-deactivated',
    title: 'TikTok Shop deactivated for violation points: how to appeal | Reinstate',
    description:
      'Your TikTok Shop was deactivated after accumulating violation points. How the point system works, the appeal window, and what a point-by-point response looks like.',
    h1: 'TikTok Shop deactivated your shop. Here is what to send back.',
    intro:
      'TikTok reviews this appeal violation by violation, and the appeal window is short. A response that answers the violations collectively is rejected. Paste your notice below to see what applies.',
    explainer: [
      'TikTok Shop runs a points system. Each violation adds points to your account health, and past a threshold the shop is deactivated. The notice lists the violations that took you over. Those violations are your appeal, one entry each.',
      'Start by pulling the full violation list from account health with dates and points, then sort each into accepted or disputed. Accept what is true. Sellers who dispute everything make their genuine disputes harder to believe, and reviewers notice.',
      'For each disputed violation, attach the evidence that contradicts it: tracking records for a late dispatch claim, a compliance certificate for a product claim, order records for a cancellation claim. A dispute with nothing behind it is not read as a dispute.',
      'For each accepted violation, give the dated corrective action. Listing amended on a date. Product withdrawn on a date. Dispatch process changed on a date.',
      'Then the root cause, which is operational: what allowed the points to accumulate without anyone acting. And preventive measures with a named owner who checks listings before they publish and watches account health on a stated cadence.',
      'Watch the clock. The appeal window is commonly 7 to 14 days from deactivation, and missing it can make the closure permanent.',
    ],
    rejections: [
      'Answering the violations collectively instead of one by one.',
      'Disputing violations with no evidence attached.',
      'Missing the appeal window stated in the notice.',
    ],
    evidence: [
      'The deactivation notice',
      'Screenshots of your account health violation list',
      'Evidence for each disputed violation',
      'Product compliance certificates where a listing was flagged',
    ],
    faq: [
      {
        q: 'How long do I have to appeal?',
        a: 'Usually 7 to 14 days from deactivation, stated in the notice. Check it first, because the window is the one thing you cannot recover.',
      },
      {
        q: 'Do violation points expire?',
        a: 'Points typically age out over a defined period, but the deactivation does not lift on its own. You still need the appeal.',
      },
      {
        q: 'Can I open a new shop instead?',
        a: 'A new shop under the same entity or documents will normally be linked and closed. Appeal the existing one.',
      },
    ],
    price: '£29',
  },
  {
    platform: 'paypal',
    slug: 'limitation',
    caseTypeId: 'paypal-limitation',
    title: 'PayPal account limitation and 180 day hold: what to send | Reinstate',
    description:
      'PayPal limited your account or put a 180 day hold on your balance. What the risk team is actually reading for and the document pack that shortens the review.',
    h1: 'PayPal has limited your account. Here is what to send back.',
    intro:
      'PayPal’s risk team is asking one question: can this seller deliver what the money was taken for. Delivery evidence answers it. Arguing about entitlement does not. Paste your notice below to see what PayPal is asking for.',
    explainer: [
      'A limitation arrives in two forms. A document request through the Resolution Center, which is a checklist you can complete. Or a permanent limitation with the balance held for 180 days, where the goal shifts from lifting the limitation to getting the funds released cleanly on the stated date.',
      'What triggers a limitation is usually a change in pattern: a jump in volume, a rise in average order value, a run of disputes, a new product line, or a long gap between payment and delivery. Preorders and made to order goods are particularly prone to it, because the money sits with an undelivered obligation behind it.',
      'The pack that resolves a review has four parts. Identity and address documents. Proof of stock or supplier relationships, showing you can fulfil. Tracking or delivery confirmations for recent orders, which is the single most effective document. And your published refund, shipping and terms pages, which the risk team will check against your live site.',
      'The covering message should be short and answer the obvious questions first: what you sell, who buys it, how it ships, the typical order value, and how long between payment and delivery. Give real dispute numbers and say how they were handled. Vague answers about disputes invite a longer review.',
      'Where the limitation is permanent, deal with the practical side now: confirm the withdrawal bank account is verified and correct so the balance releases on day 180 without a further exchange. Sellers lose weeks at the end of a hold because the destination account was never confirmed.',
    ],
    rejections: [
      'No delivery evidence, so there is no reason to shorten the hold.',
      'A covering message that argues PayPal has no right to hold the funds.',
      'Missing one of the items PayPal listed in the Resolution Center.',
    ],
    evidence: [
      'The limitation notice or Resolution Center screenshot',
      'Photo ID and proof of address',
      'Supplier invoices or proof of stock',
      'Tracking numbers or delivery confirmations for recent orders',
      'Your published refund, shipping and terms pages',
    ],
    faq: [
      {
        q: 'Can I get the 180 day hold shortened?',
        a: 'Sometimes, where you can evidence that the orders behind the balance were delivered. It is not guaranteed, but delivery evidence is the only thing that moves it.',
      },
      {
        q: 'PayPal asked for information about my business model. What do they want?',
        a: 'What you sell, to whom, how it is delivered, the typical order value and the time between payment and delivery. Answer those plainly and in that order.',
      },
      {
        q: 'Should I chargeback or dispute the hold?',
        a: 'No. Escalating against PayPal while a risk review is open extends it. Complete the pack and confirm your withdrawal account.',
      },
    ],
    price: '£19',
  },
  {
    platform: 'stripe',
    slug: 'account-review',
    caseTypeId: 'stripe-account-review',
    title: 'Stripe account review or termination: what to send back | Reinstate',
    description:
      'Stripe paused your payouts or terminated your account. What the risk team reads, which causes are fixable, and which are not.',
    h1: 'Stripe has paused your payouts. Here is what to send back.',
    intro:
      'Stripe reviews are won with delivery evidence and published policies, not with argument. And where the cause is the restricted businesses list, no letter will help, so we say so. Paste your notice below to see which it is.',
    explainer: [
      'Stripe pauses payouts, applies a reserve or terminates an account when a risk signal fires. The common triggers are a dispute rate above threshold, a sudden change in volume or average order value, a product that falls on the restricted businesses list, or a mismatch between what your site sells and what your payments look like.',
      'The first thing to establish is which of those it is, because one of them is not fixable. If what you sell is on Stripe’s restricted list, the realistic goal is releasing the balance and moving to a processor that supports your category. Writing an appeal that cannot succeed wastes the days you need for the migration.',
      'For everything else, the pack is consistent. Tracking or delivery confirmations for recent orders. Supplier invoices or proof of stock. Screenshots of your published refund, shipping and terms pages, with their URLs. Dispute records and your responses to them. Business registration and ID where verification is part of the review.',
      'The covering message is short: what you sell, to whom, how it is delivered, the typical order value and the fulfilment time. Then real dispute numbers with how they were handled, and an explanation for any recent volume change, with a cause such as a campaign or a seasonal peak. An unexplained spike is usually the trigger.',
      'Missing policy pages are the easiest cause to fix and one of the commonest. Before you reply, check that your live site has refund, shipping and terms pages that a reviewer can find in two clicks.',
    ],
    rejections: [
      'A product on the restricted businesses list, which no letter can change.',
      'No delivery evidence and no published policy pages on the live site.',
      'An unexplained jump in volume or average order value.',
    ],
    evidence: [
      'The review or termination notice',
      'Tracking or delivery confirmations for recent orders',
      'Supplier invoices or proof of stock',
      'Screenshots of your published refund, shipping and terms pages',
      'Dispute records and your responses',
    ],
    faq: [
      {
        q: 'How long does a Stripe review take?',
        a: 'Usually 2 to 5 business days for a reply. A reserve or a termination holding period is stated in the notice.',
      },
      {
        q: 'Stripe terminated my account. Can I get the balance?',
        a: 'Normally yes, after the holding period in the notice. Confirm the destination bank account now so the release is not delayed further.',
      },
      {
        q: 'Can I just open another Stripe account?',
        a: 'No. A new account under the same business or documents is linked and closed, and it complicates the balance release.',
      },
    ],
    price: '£19',
  },
  {
    platform: 'shopify-payments',
    slug: 'hold',
    caseTypeId: 'stripe-account-review',
    title: 'Shopify Payments hold or payout pause: what to send back | Reinstate',
    description:
      'Shopify Payments paused your payouts or put your funds on hold. What the underlying risk review is looking for and how to answer it.',
    h1: 'Shopify Payments has held your payouts. Here is what to send back.',
    intro:
      'Shopify Payments runs on the same risk logic as a card processor review, and it is answered the same way: delivery evidence, published policies and real dispute numbers. Paste your notice below to see what applies.',
    explainer: [
      'A Shopify Payments hold usually arrives as a payout pause with a request for information, and it comes from the same place as any processor risk review: an unexplained change in volume, a dispute rate over threshold, a product category that needs closer scrutiny, or a long gap between payment and delivery.',
      'The distinguishing feature of a Shopify hold is that the reviewer can see your storefront. That cuts both ways. If your refund, shipping and terms pages are missing, thin or contradictory, that alone can be the cause. If your product pages promise a two day dispatch that your fulfilment does not deliver, the reviewer will notice.',
      'So the first action is on the store, not in the reply. Publish or fix the policy pages, make the dispatch and delivery times on the product pages match what actually happens, and make sure contact details are visible.',
      'Then the pack: tracking or delivery confirmations for recent orders, supplier invoices or proof of stock, screenshots of the corrected policy pages with their URLs, and dispute records with your responses. The covering message is short and answers what you sell, to whom, how it ships, the typical order value and the fulfilment time.',
      'Where preorders or made to order goods are involved, say so explicitly and give the delivery window. A hold on a preorder business that never explains the delivery window tends to stay in place.',
    ],
    rejections: [
      'Missing or contradictory policy pages on a storefront the reviewer can read.',
      'Delivery promises on product pages that fulfilment does not meet.',
      'No tracking evidence for the orders behind the held balance.',
    ],
    evidence: [
      'The hold notice from Shopify',
      'Tracking or delivery confirmations for recent orders',
      'Supplier invoices or proof of stock',
      'Screenshots of your published refund, shipping and terms pages',
      'Dispute records and your responses',
    ],
    faq: [
      {
        q: 'How long do Shopify Payments holds last?',
        a: 'Until the review completes, or for a reserve period stated in the notice. Delivery evidence is what shortens it.',
      },
      {
        q: 'Can I switch to another payment provider while on hold?',
        a: 'You can usually add another gateway for new orders, but the held balance stays with Shopify Payments until the review resolves.',
      },
      {
        q: 'Do I need to change my store pages?',
        a: 'Often yes. The reviewer reads your storefront, so missing or contradictory policy pages are a common and easily fixed cause.',
      },
    ],
    price: '£19',
  },
];
