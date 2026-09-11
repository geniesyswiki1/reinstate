'use client';

import { useState } from 'react';
import type { CaseType, OutcomeResult, PreCheckReport } from '@reinstate/shared';
import Intake from './Intake';
import EvidenceList, { type EvidenceView } from './EvidenceList';
import Draft from './Draft';
import PreCheck from './PreCheck';
import ExportPanel from './ExportPanel';
import OutcomeControl from './OutcomeControl';

interface Props {
  token: string;
  caseType: CaseType;
  answers: Record<string, string>;
  evidence: EvidenceView[];
  draft: { body_md: string; body_txt: string; version: number } | null;
  report: PreCheckReport | null;
  outcome: OutcomeResult | null;
  deadline: string | null;
}

/** Two columns on desktop: the document on the left, the live pre-check on the right. */
export default function CaseWorkspace(props: Props) {
  const [draft, setDraft] = useState(props.draft);
  const [report, setReport] = useState<PreCheckReport | null>(props.report);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [refusal, setRefusal] = useState<string | null>(null);
  const [answers, setAnswers] = useState(props.answers);

  const required = props.caseType.intake.filter((q) => q.required);
  const unanswered = required.filter((q) => !(answers[q.id] ?? '').trim()).length;

  async function redraft() {
    setBusy(true);
    setError(null);
    setRefusal(null);
    try {
      const res = await fetch('/api/draft', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ case_token: props.token }),
      });
      const json = await res.json();

      if (res.status === 422 && json.refused) {
        setRefusal(json.message as string);
        return;
      }
      if (!res.ok) {
        setError(json.error ?? 'The draft did not complete. Try again.');
        return;
      }

      setDraft({ body_md: json.draft.body_md, body_txt: json.draft.body_txt, version: json.draft.version });
      setReport(null);

      const reviewed = await fetch('/api/review', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ case_token: props.token }),
      });
      const reviewJson = await reviewed.json();
      if (reviewed.ok) setReport(reviewJson.report as PreCheckReport);
      else setError(reviewJson.error ?? 'The pre-check did not complete. Press Redraft to try again.');
    } catch {
      setError('The connection dropped. Try again.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="lg:grid lg:grid-cols-12 lg:gap-10">
      <div className="lg:col-span-7">
        {props.deadline ? (
          <p className="mb-6 text-ui text-notice">Deadline in the notice: {props.deadline}.</p>
        ) : null}

        {draft ? (
          <section>
            <div className="flex items-baseline justify-between">
              <h2>Your appeal</h2>
              <p className="m-0 text-small text-muted">Version {draft.version}</p>
            </div>
            <div className="mt-5">
              <Draft markdown={draft.body_md} caseType={props.caseType} />
            </div>
          </section>
        ) : null}

        <div className={draft ? 'rule-top mt-10 pt-8' : ''}>
          <Intake
            token={props.token}
            caseType={props.caseType}
            initial={props.answers}
            onChange={setAnswers}
          />
        </div>

        <EvidenceList token={props.token} caseType={props.caseType} initial={props.evidence} />

        <div className="rule-top mt-10 pt-8">
          <button type="button" className="btn btn-primary" onClick={redraft} disabled={busy}>
            {busy ? 'Writing...' : draft ? 'Redraft' : 'Write my Plan of Action'}
          </button>
          {unanswered > 0 ? (
            <p className="mt-3 text-small text-muted">
              {unanswered} required {unanswered === 1 ? 'question is' : 'questions are'} still blank.
              Anything missing shows up in the draft as a gap, and the pre-check blocks on it.
            </p>
          ) : null}
          {error ? (
            <p className="mt-3 text-ui text-notice" role="alert">
              {error}
            </p>
          ) : null}
          {refusal ? (
            <div className="mt-4 border-l-2 border-notice pl-4">
              <p className="prose-serif m-0">{refusal}</p>
            </div>
          ) : null}
        </div>

        {draft ? (
          <ExportPanel
            token={props.token}
            caseType={props.caseType}
            bodyTxt={draft.body_txt}
            ready={Boolean(report?.ready)}
          />
        ) : null}

        {draft ? <OutcomeControl token={props.token} initial={props.outcome} /> : null}
      </div>

      <aside className="mt-12 lg:col-span-5 lg:mt-0">
        <div className="lg:sticky lg:top-8">
          <PreCheck report={report} busy={busy} />
        </div>
      </aside>
    </div>
  );
}
