import type { CaseType, ExtractedFact } from '../src/types';
import { BANNED_PHRASES } from '../src/banned';

export function draftSystem(caseType: CaseType): string {
  const sections = caseType.output.sections
    .map((s, i) => `${i + 1}. ${s.heading}\n   ${s.guidance}`)
    .join('\n');

  const limit = caseType.limits.max_chars
    ? `The whole document must be under ${caseType.limits.max_chars} characters, because that is the platform's input limit.`
    : `Target ${caseType.limits.target_words_min} to ${caseType.limits.target_words_max} words.`;

  return `You write appeal documents for sellers whose accounts have been suspended. You are writing as the seller, in their first person, in plain business English.

Case type: ${caseType.name} on ${caseType.platform}.

Structure. Use exactly these headings, in this order, with this wording:
${sections}

Opening line: ${caseType.output.opening}
Closing line: ${caseType.output.closing}

${limit}

Hard rules:
- Cite only the confirmed answers and confirmed document facts given to you. Nothing else exists.
- If a fact the structure requires is missing, write [MISSING: what is missing] in its place. Never invent a date, a supplier, a quantity or a document. Never paper over a gap with a general statement. The missing markers are surfaced to the seller as blocking items, which is how this product refuses to be generic.
- Every corrective and preventive item is a bullet that starts with a verb and carries a specific date, and names the attached document where one exists.
- Reference documents by their filename exactly as given.
- Every paragraph must contain at least one fact that could only be true of this seller: an ASIN, an order ID, a supplier name, a date, a product name, a document name or a figure.
- Never use any of these phrases: ${BANNED_PHRASES.join(', ')}.
- No apology paragraph. No history of the business. No mention of tools, software or AI. No legal argument. No promise of future performance without a named owner and a cadence behind it.
- Hyphens only. Never em dashes or en dashes.
- Sentence case. No all caps. No exclamation marks.
- Do not claim anything the seller's own answers contradict.

Return the document as markdown, using "## " for each heading. Nothing before the opening line and nothing after the closing line. No preamble, no commentary, no notes to the seller.`;
}

export function draftUserMessage(input: {
  caseType: CaseType;
  noticeText: string | null;
  answers: Record<string, string>;
  facts: { filename: string; fact: ExtractedFact }[];
}): string {
  const { caseType, noticeText, answers, facts } = input;

  const answerBlock = caseType.intake
    .map((q) => {
      const v = answers[q.id];
      return `- ${q.label}\n  ${v && String(v).trim() ? String(v).trim() : '(not answered)'}`;
    })
    .join('\n');

  const factBlock = facts.length
    ? facts
        .map(
          ({ filename, fact }) =>
            `- ${filename}: ${fact.summary}\n  type: ${fact.doc_type}; issuer: ${fact.issuer ?? 'not stated'}; dates: ${fact.dates.join(', ') || 'none'}; phone: ${fact.phone ?? 'none'}; addresses: ${fact.addresses.join(' | ') || 'none'}; identifiers: ${fact.identifiers.join(', ') || 'none'}; quantities: ${fact.quantities.join(', ') || 'none'}; amounts: ${fact.amounts.join(', ') || 'none'}; flags: ${fact.flags.join(', ') || 'none'}`,
        )
        .join('\n')
    : '(no documents confirmed yet)';

  return `The notice the seller received:

${noticeText ? noticeText.slice(0, 8000) : '(not provided)'}

Confirmed intake answers:

${answerBlock}

Confirmed document facts. These are the only documents that exist and the only facts you may cite from them:

${factBlock}

Write the appeal now.`;
}
