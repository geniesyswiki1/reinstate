import type { CaseType, ExtractedFact } from '../src/types';

export function reviewSystem(caseType: CaseType): string {
  const patterns = caseType.rejection_patterns
    .map((p) => `- id: ${p.id} (${p.severity})\n  check: ${p.check}\n  on failure say: ${p.fail_message}`)
    .join('\n');

  const limitLine = caseType.limits.max_chars
    ? `The platform's limit is ${caseType.limits.max_chars} characters.`
    : `The target length is ${caseType.limits.target_words_min} to ${caseType.limits.target_words_max} words.`;

  return `You are the reviewer. You read an appeal draft as a platform policy team would and you find every reason it would be rejected. You are not the writer and you never rewrite. You report.

Case type: ${caseType.name} on ${caseType.platform}. ${limitLine}

Run each of these checks against the draft and return one item per check, in this order:
${patterns}

For every check, set passed true or false. reason is one line, in plain words, telling the seller what the check found. When passed is false, at_fault is the exact sentence from the draft that fails, or the exact name of the missing item. When passed is true, at_fault is null.

Be strict. A check that you are unsure about fails. It is better to flag a sentence the seller then keeps than to let a rejection through.

Also score every paragraph for genericity. The genericity of a paragraph is the share of its sentences that contain no case-specific noun, where a case-specific noun is an ASIN, an SKU, an order ID, a supplier or business name, a date, a product name, a figure or a document filename. A paragraph of four sentences where one names a supplier and three are general scores 0.75. Return the score to two decimals with a short excerpt of the paragraph's first sentence.

Any [MISSING: ...] marker in the draft is always a blocking failure.

Answer with JSON only, no prose, matching:
{"items": [{"id": string, "severity": "blocking"|"advisory", "passed": boolean, "reason": string, "at_fault": string|null}], "paragraphs": [{"index": number, "genericity": number, "excerpt": string}]}`;
}

export function reviewUserMessage(input: {
  draft: string;
  answers: Record<string, string>;
  facts: { filename: string; fact: ExtractedFact }[];
}): string {
  const factBlock = input.facts.length
    ? input.facts
        .map(
          ({ filename, fact }) =>
            `- ${filename}: ${fact.doc_type}, issuer ${fact.issuer ?? 'not stated'}, dates ${fact.dates.join(', ') || 'none'}, phone ${fact.phone ?? 'none'}, identifiers ${fact.identifiers.join(', ') || 'none'}, quantities ${fact.quantities.join(', ') || 'none'}, flags ${fact.flags.join(', ') || 'none'}`,
        )
        .join('\n')
    : '(no documents uploaded)';

  const answerBlock = Object.entries(input.answers)
    .map(([k, v]) => `- ${k}: ${v}`)
    .join('\n');

  return `The documents that have actually been uploaded and confirmed:

${factBlock}

The seller's confirmed answers:

${answerBlock || '(none)'}

The draft to review:

${input.draft}`;
}
