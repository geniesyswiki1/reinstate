/**
 * Phase 1 check (section 11). Runs classify, draft and review against the fixture
 * notice and prints the three things the spec asks us to verify:
 *   - the fixture Amazon inauthentic notice classifies at 0.9 or better
 *   - the draft contains three headed sections with dated bullets
 *   - the review returns at least one blocking item, because one fixture invoice
 *     is dated after the first listing date
 *
 * Needs ANTHROPIC_API_KEY. Run: npm run fixture
 */
import { readFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  callAnthropic,
  parseJson,
  getCaseType,
  caseTerms,
  scoreDraft,
  findBannedPhrases,
  CLASSIFY_SYSTEM,
  classifyUserMessage,
  draftSystem,
  draftUserMessage,
  reviewSystem,
  reviewUserMessage,
  MODELS,
  EFFORT,
  MAX_TOKENS,
  type Classification,
  type ExtractedFact,
  type ParagraphScore,
  type PreCheckItem,
} from '../packages/shared/src/index.ts';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const notice = readFileSync(resolve(root, 'fixtures/amazon-inauthentic-notice.txt'), 'utf8');
const fixture = JSON.parse(readFileSync(resolve(root, 'fixtures/case.json'), 'utf8')) as {
  case_type: string;
  answers: Record<string, string>;
  facts: { filename: string; fact: ExtractedFact }[];
};

let failures = 0;
function expect(condition: boolean, message: string): void {
  console.log(`${condition ? 'pass' : 'FAIL'}  ${message}`);
  if (!condition) failures += 1;
}

if (!process.env.ANTHROPIC_API_KEY) {
  console.error('ANTHROPIC_API_KEY is not set. Put it in .env and export it, then run npm run fixture.');
  process.exit(1);
}

console.log('1. Classify\n');
const classifyCall = await callAnthropic({
  model: MODELS.classify,
  system: CLASSIFY_SYSTEM,
  content: [{ type: 'text', text: classifyUserMessage(notice) }],
  effort: EFFORT.classify,
  max_tokens: MAX_TOKENS.classify,
});
const classification = parseJson<Classification>(classifyCall.text);
console.log(`   ${classification.case_type} at ${classification.confidence}`);
console.log(`   deadline: ${classification.deadline ?? 'none stated'}`);
console.log(`   evidence expected: ${classification.evidence_expected.join('; ')}\n`);

expect(classification.case_type === 'amazon-inauthentic', 'classified as amazon-inauthentic');
expect(classification.confidence >= 0.9, `confidence ${classification.confidence} is 0.9 or better`);
expect(
  classification.key_sentences.every((s) => notice.includes(s)),
  'key sentences are verbatim, so they can be highlighted in the original',
);
expect(Boolean(classification.deadline), 'the stated deadline was read from the notice');

const caseType = getCaseType(fixture.case_type);
if (!caseType) throw new Error('fixture case type is unknown');

console.log('\n2. Draft\n');
const draftCall = await callAnthropic({
  model: MODELS.draft,
  system: draftSystem(caseType),
  content: [
    {
      type: 'text',
      text: draftUserMessage({ caseType, noticeText: notice, answers: fixture.answers, facts: fixture.facts }),
    },
  ],
  effort: EFFORT.draft,
  max_tokens: MAX_TOKENS.draft,
});
const draft = draftCall.text.trim();
console.log(draft);

const headings = caseType.output.sections.map((s) => s.heading);
const bullets = draft.split('\n').filter((l) => /^\s*[-*]\s+/.test(l));
const datedBullets = bullets.filter((l) =>
  /\b\d{1,2}\s+\w+\s+\d{4}\b|\b\d{4}-\d{2}-\d{2}\b|\b\w+\s+\d{1,2},?\s+\d{4}\b/.test(l),
);
const words = draft.split(/\s+/).filter(Boolean).length;

console.log('');
for (const heading of headings) {
  expect(draft.toLowerCase().includes(heading.toLowerCase()), `contains the heading "${heading}"`);
}
expect(bullets.length >= 4, `${bullets.length} bullets in corrective and preventive sections`);
expect(
  datedBullets.length >= Math.ceil(bullets.length * 0.8),
  `${datedBullets.length} of ${bullets.length} bullets carry a date`,
);
expect(findBannedPhrases(draft).length === 0, 'no banned phrases');
expect(!/[\u2010-\u2015\u2212]/.test(draft), 'hyphens only, no em or en dashes');
expect(
  words >= caseType.limits.target_words_min && words <= caseType.limits.target_words_max,
  `${words} words, target ${caseType.limits.target_words_min} to ${caseType.limits.target_words_max}`,
);

console.log('\n3. Review\n');
const reviewCall = await callAnthropic({
  model: MODELS.review,
  system: reviewSystem(caseType),
  content: [{ type: 'text', text: reviewUserMessage({ draft, answers: fixture.answers, facts: fixture.facts }) }],
  effort: EFFORT.review,
  max_tokens: MAX_TOKENS.review,
});
const report = parseJson<{ items: PreCheckItem[]; paragraphs: ParagraphScore[] }>(reviewCall.text);
const failed = report.items.filter((i) => !i.passed);
for (const item of failed) {
  console.log(`   ${item.severity === 'blocking' ? 'x' : '-'} ${item.id}: ${item.reason}`);
  if (item.at_fault) console.log(`       ${item.at_fault}`);
}

const localScores = scoreDraft(draft, caseTerms(fixture.answers, fixture.facts.map((f) => f.filename)));
const genericMax = localScores.reduce((m, p) => Math.max(m, p.genericity), 0);
console.log(`\n   worst paragraph genericity (local scorer): ${genericMax.toFixed(2)}`);

console.log('');
expect(
  failed.some((i) => i.severity === 'blocking'),
  'at least one blocking item, because a fixture invoice is dated after the listing date',
);
expect(
  failed.some((i) => i.id === 'invoice_after_listing') ||
    failed.some((i) => (i.at_fault ?? '').includes('10 March 2026')),
  'the late invoice is the thing it blocked on',
);
expect(genericMax <= 0.6, `worst paragraph scores ${genericMax.toFixed(2)}, within the 0.6 limit`);

const inputTokens = classifyCall.input_tokens + draftCall.input_tokens + reviewCall.input_tokens;
const outputTokens = classifyCall.output_tokens + draftCall.output_tokens + reviewCall.output_tokens;
console.log(`\nTokens: ${inputTokens} in, ${outputTokens} out across three calls.`);

if (failures > 0) {
  console.error(`\n${failures} ${failures === 1 ? 'check' : 'checks'} failed.`);
  process.exit(1);
}
console.log('\nPhase 1 checks pass.');
