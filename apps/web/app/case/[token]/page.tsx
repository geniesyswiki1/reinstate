import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getCaseType, PLATFORM_LABELS, type OutcomeResult, type PreCheckReport } from '@reinstate/shared';
import CaseWorkspace from '@/components/CaseWorkspace';
import { answersFor, caseByToken, evidenceFor, latestDraft } from '@/lib/cases';
import { db } from '@/lib/supabase';
import { hasSupabase } from '@/lib/env';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Your case',
  robots: { index: false, follow: false },
};

export default async function CasePage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;

  if (!hasSupabase()) {
    return (
      <p className="prose-serif mt-10">
        Cases are not available on this deployment yet. Email desk@reinstate.app with your order
        number and we will open yours.
      </p>
    );
  }

  const record = await caseByToken(token);
  if (!record) notFound();

  const caseType = getCaseType(record.case_type);
  if (!caseType) {
    return (
      <div className="mt-10">
        <h1>We could not classify your notice</h1>
        <p className="prose-serif mt-4">
          Your case is open but has no case type yet. Email the deactivation notice to
          desk@reinstate.app and we will classify it by hand, or ask for a refund under the terms.
        </p>
      </div>
    );
  }

  const [answers, evidence, draft] = await Promise.all([
    answersFor(record.id),
    evidenceFor(record.id),
    latestDraft(record.id),
  ]);

  let report: PreCheckReport | null = null;
  if (draft) {
    const { data } = await db()
      .from('reviews')
      .select('report_json')
      .eq('draft_id', draft.id)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();
    report = (data?.report_json as PreCheckReport) ?? null;
  }

  const { data: outcomeRow } = await db()
    .from('outcomes')
    .select('result')
    .eq('case_id', record.id)
    .maybeSingle();

  const expiresIn = Math.max(
    0,
    Math.ceil((new Date(record.expires_at).getTime() - Date.now()) / (24 * 60 * 60 * 1000)),
  );

  return (
    <>
      <header className="mb-8 pt-6">
        <p className="text-small text-muted">{PLATFORM_LABELS[caseType.platform]}</p>
        <h1 className="mt-2 max-w-measure">{caseType.name}</h1>
      </header>

      <CaseWorkspace
        token={token}
        caseType={caseType}
        answers={answers}
        evidence={evidence.map((e) => ({
          id: e.id,
          filename: e.filename,
          doc_type: e.doc_type,
          extracted_json: e.extracted_json,
          confirmed: e.confirmed,
        }))}
        draft={draft ? { body_md: draft.body_md, body_txt: draft.body_txt, version: draft.version } : null}
        report={report}
        outcome={(outcomeRow?.result as OutcomeResult) ?? null}
        deadline={record.deadline}
      />

      <p className="rule-top mt-12 pt-6 text-small text-muted">
        Reinstate helps you write your own appeal. It is not legal advice and does not guarantee
        reinstatement. This case and its uploads are deleted in {expiresIn} days.{' '}
        <Link href="/privacy" className="text-muted">
          Privacy
        </Link>
        .
      </p>
    </>
  );
}
