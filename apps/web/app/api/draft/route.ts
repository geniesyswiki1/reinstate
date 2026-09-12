import { NextResponse } from 'next/server';
import {
  callAnthropic,
  getCaseType,
  draftSystem,
  draftUserMessage,
  checkRefusal,
  factIsCitable,
  normaliseDashes,
  MODELS,
  EFFORT,
  isConfigError,
  configErrorCode,
  MAX_TOKENS,
} from '@reinstate/shared';
import { answersFor, caseByToken, confirmedFacts, setCaseStatus } from '@/lib/cases';
import { db } from '@/lib/supabase';
import { captureError } from '@/lib/ops';
import { toPlainText, countWords, missingMarkers } from '@/lib/draft-text';

export const runtime = 'nodejs';
export const maxDuration = 180;

export async function POST(request: Request) {
  const { case_token } = (await request.json()) as { case_token?: string };
  if (!case_token) return NextResponse.json({ error: 'Missing case.' }, { status: 400 });

  try {
    const record = await caseByToken(case_token);
    if (!record) return NextResponse.json({ error: 'Case not found.' }, { status: 404 });

    const caseType = getCaseType(record.case_type);
    if (!caseType) {
      return NextResponse.json(
        { error: 'This case has no case type yet. Paste the notice again so we can classify it.' },
        { status: 400 },
      );
    }

    const answers = await answersFor(record.id);

    // Section 4.7. We do not draft an appeal the seller's own answers contradict.
    const refusal = checkRefusal(caseType, answers);
    if (refusal) {
      return NextResponse.json({ refused: true, message: refusal.message }, { status: 422 });
    }

    const missingRequired = caseType.intake
      .filter((q) => q.required && !(answers[q.id] ?? '').trim())
      .map((q) => q.label);
    if (missingRequired.length > 3) {
      return NextResponse.json(
        {
          error: `Answer the remaining questions first. ${missingRequired.length} are still blank, and the draft would be mostly gaps.`,
          missing: missingRequired,
        },
        { status: 400 },
      );
    }

    const facts = (await confirmedFacts(record.id)).filter((f) => factIsCitable(f.fact.flags));

    const call = await callAnthropic({
      model: MODELS.draft,
      system: draftSystem(caseType),
      content: [
        {
          type: 'text',
          text: draftUserMessage({
            caseType,
            noticeText: record.notice_text,
            answers,
            facts,
          }),
        },
      ],
      effort: EFFORT.draft,
      max_tokens: MAX_TOKENS.draft,
    });

    const bodyMd = normaliseDashes(call.text.trim());
    const bodyTxt = toPlainText(bodyMd);

    const { data: last } = await db()
      .from('drafts')
      .select('version')
      .eq('case_id', record.id)
      .order('version', { ascending: false })
      .limit(1)
      .maybeSingle();
    const version = ((last?.version as number) ?? 0) + 1;

    const { data: draft, error } = await db()
      .from('drafts')
      .insert({ case_id: record.id, version, body_md: bodyMd, body_txt: bodyTxt })
      .select('id, version, body_md, body_txt')
      .single();
    if (error) throw new Error(error.message);

    await setCaseStatus(record.id, 'drafted');

    return NextResponse.json({
      ok: true,
      draft,
      missing: missingMarkers(bodyMd),
      word_count: countWords(bodyTxt),
      tokens: { input: call.input_tokens, output: call.output_tokens },
    });
  } catch (err) {
    captureError(err, { route: 'draft' });
    if (isConfigError(err)) {
      return NextResponse.json(
        {
          error: 'The appeal service is not set up correctly. That is on us, not your notice. Try again shortly.',
          reason: configErrorCode(err),
        },
        { status: 503 },
      );
    }
    return NextResponse.json({ error: 'The draft did not complete. Try again in a moment.' }, { status: 502 });
  }
}
