import { NextResponse } from 'next/server';
import { getCaseType } from '@reinstate/shared';
import { caseByToken, saveAnswer, setCaseStatus } from '@/lib/cases';
import { captureError } from '@/lib/ops';

export const runtime = 'nodejs';

/** Progress is saved per answer (section 3.2 step 3). */
export async function POST(request: Request, { params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  try {
    const record = await caseByToken(token);
    if (!record) return NextResponse.json({ error: 'Case not found.' }, { status: 404 });

    const { question_id, value } = (await request.json()) as { question_id?: string; value?: string };
    const ct = getCaseType(record.case_type);
    if (!question_id || !ct || !ct.intake.some((q) => q.id === question_id)) {
      return NextResponse.json({ error: 'Unknown question.' }, { status: 400 });
    }

    await saveAnswer(record.id, question_id, (value ?? '').slice(0, 5000));
    if (record.status === 'paid') await setCaseStatus(record.id, 'intake');

    return NextResponse.json({ ok: true });
  } catch (err) {
    captureError(err, { route: 'case/answer' });
    return NextResponse.json({ error: 'We could not save that answer. Try again.' }, { status: 500 });
  }
}
