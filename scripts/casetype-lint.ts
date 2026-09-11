/**
 * Offline check on every case type. Runs without an API key so it can sit in CI.
 * Enforces the rules section 3 states: every question has a "why we ask", every
 * case type carries the blocking patterns the spec names, every output structure
 * has headings, and the local genericity scorer behaves.
 */
import { CASE_TYPES, scoreParagraph, findBannedPhrases } from '../packages/shared/src/index.ts';

let failures = 0;

function check(condition: boolean, message: string): void {
  if (!condition) {
    console.error(`FAIL ${message}`);
    failures += 1;
  }
}

const REQUIRED_BLOCKING = ['generic_paragraph', 'banned_phrases', 'missing_markers'];

check(CASE_TYPES.length === 18, `expected 18 case types at launch, found ${CASE_TYPES.length}`);

const ids = new Set<string>();
for (const ct of CASE_TYPES) {
  const at = `${ct.id}:`;
  check(!ids.has(ct.id), `${at} duplicate id`);
  ids.add(ct.id);

  check(ct.intake.length >= 8, `${at} only ${ct.intake.length} intake questions, spec says 10 to 20`);
  check(ct.intake.length <= 20, `${at} ${ct.intake.length} intake questions, over the 20 in the spec`);

  for (const q of ct.intake) {
    check(Boolean(q.why?.trim()), `${at} question ${q.id} has no "why we ask" line`);
    check(Boolean(q.label?.trim()), `${at} question ${q.id} has no label`);
    if (q.type === 'choice') {
      check((q.options ?? []).length >= 2, `${at} question ${q.id} is a choice with under two options`);
    }
    if (q.showIf) {
      check(
        ct.intake.some((other) => other.id === q.showIf!.question_id),
        `${at} question ${q.id} depends on ${q.showIf.question_id}, which does not exist`,
      );
    }
  }

  check(ct.evidence.length > 0, `${at} no evidence list`);
  check(
    ct.evidence.some((e) => e.required),
    `${at} no required evidence, so the checklist would be empty`,
  );
  for (const e of ct.evidence) {
    check(Boolean(e.why?.trim()), `${at} evidence ${e.id} has no reason`);
    check(e.accepts.length > 0, `${at} evidence ${e.id} accepts nothing`);
  }

  check(ct.output.sections.length >= 3, `${at} output structure has under three sections`);
  for (const s of ct.output.sections) {
    check(Boolean(s.heading?.trim()), `${at} an output section has no heading`);
    check(Boolean(s.guidance?.trim()), `${at} section "${s.heading}" has no guidance`);
  }

  const patternIds = ct.rejection_patterns.map((p) => p.id);
  for (const required of REQUIRED_BLOCKING) {
    check(patternIds.includes(required), `${at} missing the ${required} check`);
  }
  check(
    ct.rejection_patterns.some((p) => p.severity === 'advisory'),
    `${at} has no advisory checks`,
  );
  for (const p of ct.rejection_patterns) {
    check(Boolean(p.fail_message?.trim()), `${at} pattern ${p.id} has no failure message`);
    check(
      p.fail_message.length < 200,
      `${at} pattern ${p.id} failure message is too long to sit in the pre-check`,
    );
  }

  check(ct.submission.steps.length > 0, `${at} no submission steps`);
  check(Boolean(ct.submission.turnaround), `${at} no stated turnaround`);
  check(
    ct.limits.target_words_max > ct.limits.target_words_min,
    `${at} word target range is inverted`,
  );

  // Section 2.3: hyphens only, everywhere, including the case type content.
  const blob = JSON.stringify(ct);
  const dashes = blob.match(/[‐-―−]/g);
  check(!dashes, `${at} contains an em or en dash, which the brand never uses`);

  // No banned phrase should appear in copy we ship.
  const banned = findBannedPhrases(
    ct.intake.map((q) => `${q.label} ${q.why}`).join(' ') + ct.evidence.map((e) => e.why).join(' '),
  );
  check(banned.length === 0, `${at} intake copy uses a banned phrase: ${banned.join(', ')}`);
}

// The genericity scorer, which the pre-check relies on when the model omits a paragraph.
const generic =
  'We take policy compliance very seriously. We have always tried to do the right thing for our customers. We will make sure this does not happen again.';
const specific =
  'I bought 240 units of B0ABC12345 from Bright Wholesale Ltd on 3 March 2026. The invoice is attached as invoice-bright-0303.pdf.';
check(scoreParagraph(generic) > 0.6, `generic paragraph scored ${scoreParagraph(generic)}, expected over 0.6`);
check(scoreParagraph(specific) < 0.4, `specific paragraph scored ${scoreParagraph(specific)}, expected under 0.4`);
check(
  findBannedPhrases('Unfortunately I assure you I am a loyal seller').length === 3,
  'banned phrase detection missed a phrase',
);

if (failures > 0) {
  console.error(`\n${failures} ${failures === 1 ? 'check' : 'checks'} failed.`);
  process.exit(1);
}
console.log(`All 18 case types pass. ${CASE_TYPES.reduce((n, c) => n + c.intake.length, 0)} intake questions, ${CASE_TYPES.reduce((n, c) => n + c.rejection_patterns.length, 0)} rejection patterns.`);
