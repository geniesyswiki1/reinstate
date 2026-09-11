import { NextResponse } from 'next/server';
import {
  callAnthropic,
  parseJson,
  getCaseType,
  CLASSIFY_SYSTEM,
  classifyUserMessage,
  MODELS,
  TEMPERATURES,
  MAX_TOKENS,
  type Classification,
  type OutcomeResult,
} from '@reinstate/shared';
import { caseByToken, setCaseStatus } from '@/lib/cases';
import { db } from '@/lib/supabase';
import { notifyOps, captureError } from '@/lib/ops';

export const runtime = 'nodejs';
export const maxDuration = 60;

/**
 * Section 3.2 step 9. A rejection paste re-runs classification against the rejection
 * text and unlocks a redraft with whatever the platform has now told us.
 */
export async function POST(request: Request) {
  const { case_token, result, rejection_text } = (await request.json()) as {
    case_token?: string;
    result?: OutcomeResult;
    rejection_text?: string;
  };

  if (!case_token || !result) return NextResponse.json({ error: 'Missing case or result.' }, { status: 400 });
  if (!['reinstated', 'rejected', 'pending'].includes(result)) {
    return NextResponse.json({ error: 'Unknown result.' }, { status: 400 });
  }

  try {
    const record = await caseByToken(case_token);
    if (!record) return NextResponse.json({ error: 'Case not found.' }, { status: 404 });

    const { error } = await db().from('outcomes').upsert(
      {
        case_id: record.id,
        result,
        rejection_text: rejection_text?.slice(0, 20000) ?? null,
        recorded_at: new Date().toISOString(),
      },
      { onConflict: 'case_id' },
    );
    if (error) throw new Error(error.message);

    await notifyOps('outcome', { result, case_type: record.case_type, platform: record.platform });

    if (result === 'reinstated') {
      await setCaseStatus(record.id, 'closed');
      return NextResponse.json({ ok: true });
    }

    if (result !== 'rejected' || !rejection_text?.trim()) {
      await setCaseStatus(record.id, 'submitted');
      return NextResponse.json({ ok: true });
    }

    // Reclassify against the rejection so the intake picks up the new questions.
    let reclassified: Classification | null = null;
    try {
      const call = await callAnthropic({
        model: MODELS.classify,
        system: CLASSIFY_SYSTEM,
        content: [
          {
            type: 'text',
            text: classifyUserMessage(
              `This is the platform's reply rejecting an appeal for case type ${record.case_type}. Classify what they are now asking for.\n\n${rejection_text}`,
            ),
          },
        ],
        temperature: TEMPERATURES.classify,
        max_tokens: MAX_TOKENS.classify,
      });
      reclassified = parseJson<Classification>(call.text);
    } catch (err) {
      captureError(err, { route: 'outcome', step: 'reclassify' });
    }

    if (reclassified?.case_type && getCaseType(reclassified.case_type) && reclassified.confidence >= 0.7) {
      await db()
        .from('cases')
        .update({
          case_type: reclassified.case_type,
          confidence: reclassified.confidence,
          deadline: reclassified.deadline ?? record.deadline,
        })
        .eq('id', record.id);
    }

    await setCaseStatus(record.id, 'intake');

    return NextResponse.json({
      ok: true,
      reclassified: reclassified?.case_type ?? null,
      evidence_expected: reclassified?.evidence_expected ?? [],
      key_sentences: reclassified?.key_sentences ?? [],
    });
  } catch (err) {
    captureError(err, { route: 'outcome' });
    return NextResponse.json({ error: 'We could not record that. Try again.' }, { status: 500 });
  }
}
