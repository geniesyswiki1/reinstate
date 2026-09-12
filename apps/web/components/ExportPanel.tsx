'use client';

import { useState } from 'react';
import type { CaseType } from '@reinstate/shared';

interface Props {
  token: string;
  caseType: CaseType;
  bodyTxt: string;
  ready: boolean;
}

export default function ExportPanel({ token, caseType, bodyTxt, ready }: Props) {
  const [copied, setCopied] = useState(false);

  return (
    <section className="rule-top mt-10 pt-8">
      <h2>How to submit it</h2>
      <p className="mt-2 text-ui">{caseType.submission.where}</p>
      <ol className="prose-serif mt-4 list-decimal pl-6">
        {caseType.submission.steps.map((step) => (
          <li key={step} className="mb-2">
            {step}
          </li>
        ))}
      </ol>
      <p className="mt-3 text-small text-muted">
        {caseType.submission.turnaround}
        {caseType.limits.max_chars
          ? ` The appeal box takes ${caseType.limits.max_chars} characters; yours is ${bodyTxt.length}.`
          : ''}
        {caseType.limits.max_attachments ? ` Up to ${caseType.limits.max_attachments} attachments.` : ''}
      </p>

      {!ready ? (
        <p className="mt-4 text-ui text-notice">
          The pre-check still has blocking items. You can export anyway, but fix them first.
        </p>
      ) : null}

      <div className="mt-5 flex flex-wrap gap-3">
        <button
          type="button"
          className="btn btn-secondary"
          onClick={async () => {
            await navigator.clipboard.writeText(bodyTxt);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
          }}
        >
          {copied ? 'Copied' : 'Copy as text'}
        </button>
        <a className="btn btn-secondary" href={`/api/export/docx?case=${token}`}>
          Download DOCX
        </a>
      </div>
    </section>
  );
}
