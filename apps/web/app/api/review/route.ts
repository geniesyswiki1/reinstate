import { NextResponse } from 'next/server';
import {
  callAnthropic,
  parseJson,
  getCaseType,
  reviewSystem,
  reviewUserMessage,
  scoreDraft,
  caseTerms,
  findBannedPhrases,
  MODELS,
  EFFORT,
  MAX_TOKENS,
  type ParagraphScore,
  type PreCheckItem,
  type PreCheckReport,
} from '@reinstate/shared';
import { answersFor, caseByToken, confirmedFacts, latestDraft, setCaseStatus } from '@/lib/cases';
import { db } from '@/lib/supabase';
import { captureError } from '@/lib/ops';
import { missingMarkers, countWords } from '@/lib/draft-text';

export const runtime = 'nodejs';
export const maxDuration = 120;

const GENERIC_LIMIT = 0.6;

export async function POST(request: Request) {
  const { case_token } = (await request.json()) as { case_token?: string };
  if (!case_token) return NextResponse.json({ error: 'Missing case.' }, { status: 400 });

  try {
    const record = await caseByToken(case_token);
    if (!record) return NextResponse.json({ error: 'Case not found.' }, { status: 404 });

    const caseType = getCaseType(record.case_type);
    const draft = await latestDraft(record.id);
    if (!caseType || !draft) {
      return NextResponse.json({ error: 'There is no draft to check yet.' }, { status: 400 });
    }

    const answers = await answersFor(record.id);
    const facts = await confirmedFacts(record.id);

    const call = await callAnthropic({
      model: MODELS.review,
      system: reviewSystem(caseType),
      content: [{ type: 'text', text: reviewUserMessage({ draft: draft.body_md, answers, facts }) }],
      effort: EFFORT.review,
      max_tokens: MAX_TOKENS.review,
    });

    const modelReport = parseJson<{ items: PreCheckItem[]; paragraphs: ParagraphScore[] }>(call.text);

    // Every check the case type defines gets an entry, whether or not the model returned one.
    const byId = new Map(modelReport.items.map((i) => [i.id, i]));
    const items: PreCheckItem[] = caseType.rejection_patterns.map((p) => {
      const found = byId.get(p.id);
      return {
        id: p.id,
        severity: p.severity,
        passed: found ? Boolean(found.passed) : true,
        reason: found?.reason?.trim() || (found?.passed === false ? p.fail_message : p.check),
        at_fault: found?.at_fault ?? null,
      };
    });

    // Deterministic checks that do not depend on the model agreeing.
    const terms = caseTerms(answers, facts.map((f) => f.filename));
    const paragraphs = scoreDraft(draft.body_md, terms);
    const genericMax = paragraphs.reduce((m, p) => Math.max(m, p.genericity), 0);

    const forceFail = (id: string, reason: string, atFault: string | null) => {
      const item = items.find((i) => i.id === id);
      if (item) {
        item.passed = false;
        item.reason = reason;
        item.at_fault = atFault;
      } else {
        items.push({ id, severity: 'blocking', passed: false, reason, at_fault: atFault });
      }
    };

    const markers = missingMarkers(draft.body_md);
    if (markers.length > 0) {
      forceFail(
        'missing_markers',
        `${markers.length} required ${markers.length === 1 ? 'fact is' : 'facts are'} missing. Answer the question or upload the document rather than letting the draft generalise.`,
        markers.join('; '),
      );
    }

    if (genericMax > GENERIC_LIMIT) {
      const worst = paragraphs.reduce((a, b) => (b.genericity > a.genericity ? b : a));
      forceFail(
        'generic_paragraph',
        `A paragraph scores ${worst.genericity.toFixed(2)} for genericity, over the ${GENERIC_LIMIT} limit. It could belong to any seller.`,
        worst.excerpt,
      );
    }

    const banned = findBannedPhrases(draft.body_txt);
    if (banned.length > 0) {
      forceFail('banned_phrases', `Remove: ${banned.join(', ')}.`, banned.join(', '));
    }

    if (caseType.limits.max_chars && draft.body_txt.length > caseType.limits.max_chars) {
      forceFail(
        'over_limit',
        `${draft.body_txt.length} characters against the platform's ${caseType.limits.max_chars} limit. It will be cut off mid sentence.`,
        null,
      );
    }

    const words = countWords(draft.body_txt);
    if (words > caseType.limits.target_words_max) {
      const item = items.find((i) => i.id === 'too_long');
      if (item) {
        item.passed = false;
        item.reason = `${words} words against a ${caseType.limits.target_words_max} word target. Reviewers skim.`;
      }
    }

    const blocking = items.filter((i) => i.severity === 'blocking' && !i.passed).length;
    const advisory = items.filter((i) => i.severity === 'advisory' && !i.passed).length;

    const report: PreCheckReport = {
      items,
      paragraphs,
      blocking_count: blocking,
      advisory_count: advisory,
      generic_max: genericMax,
      ready: blocking === 0,
    };

    const { error } = await db().from('reviews').insert({
      draft_id: draft.id,
      report_json: report,
      blocking_count: blocking,
      advisory_count: advisory,
      generic_max: genericMax,
    });
    if (error) throw new Error(error.message);

    await setCaseStatus(record.id, report.ready ? 'ready' : 'drafted');

    return NextResponse.json({ ok: true, report });
  } catch (err) {
    captureError(err, { route: 'review' });
    return NextResponse.json({ error: 'The pre-check did not complete. Try again in a moment.' }, { status: 502 });
  }
}
