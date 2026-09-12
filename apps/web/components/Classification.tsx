'use client';

import { useState } from 'react';
import {
  getCaseType,
  priceForCaseType,
  PLATFORM_LABELS,
  type Classification as ClassificationResult,
} from '@reinstate/shared';

interface Props {
  result: ClassificationResult & { classification_id?: string | null };
  hint?: string;
}

/** Shown under the notice box after a free classification, with the paywall. */
export default function Classified({ result }: Props) {
  const [chosen, setChosen] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const uncertain = result.confidence < 0.7 && result.alternates.length > 0;
  const caseTypeId = chosen ?? result.case_type;
  const caseType = getCaseType(caseTypeId);
  const price = priceForCaseType(caseTypeId);

  async function start() {
    if (!caseType) return;
    setBusy(true);
    setError(null);
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ classification_id: result.classification_id, case_type: caseType.id }),
      });
      const json = await res.json();
      if (!res.ok || !json.url) {
        setError(json.error ?? 'Checkout is not available right now. Email desk@reinstate.app.');
      } else {
        window.location.href = json.url;
      }
    } catch {
      setError('The connection dropped. Try again.');
    } finally {
      setBusy(false);
    }
  }

  if (!caseType) return null;

  return (
    <div className="rule-top mt-6 pt-6">
      {uncertain && !chosen ? (
        <>
          <p className="prose-serif m-0">
            This could be one of two things. Which matches your notice?
          </p>
          <div className="mt-3 flex flex-col gap-2">
            {[{ case_type: result.case_type as string, confidence: result.confidence }, ...result.alternates]
              .slice(0, 2)
              .map((alt) => {
                const ct = getCaseType(alt.case_type);
                if (!ct) return null;
                return (
                  <button
                    key={alt.case_type}
                    type="button"
                    className="btn btn-secondary text-left"
                    onClick={() => setChosen(alt.case_type)}
                  >
                    {PLATFORM_LABELS[ct.platform]}: {ct.name}
                  </button>
                );
              })}
          </div>
        </>
      ) : (
        <>
          <p className="prose-serif m-0">
            This is a {caseType.name.toLowerCase()}. {PLATFORM_LABELS[caseType.platform]} will expect{' '}
            {(result.evidence_expected.length
              ? result.evidence_expected
              : caseType.evidence.filter((e) => e.required).map((e) => e.label.toLowerCase())
            ).join(', ')}
            .
          </p>
          <p className="mt-2 text-ui text-muted">
            Deadline in the notice: {result.deadline ?? 'none stated'}.
          </p>

          <ul className="mt-5 list-none p-0 text-ui">
            {caseType.evidence
              .filter((e) => e.required)
              .map((e) => (
                <li key={e.id} className="mb-2 flex gap-2">
                  <span aria-hidden="true" className="text-reinstated">
                    +
                  </span>
                  <span>
                    {e.label}
                    <span className="block text-small text-muted">{e.why}</span>
                  </span>
                </li>
              ))}
          </ul>

          <div className="mt-5 flex flex-wrap items-center gap-3">
            <button type="button" className="btn btn-primary" onClick={start} disabled={busy}>
              {busy ? 'Opening checkout...' : `Build my appeal, ${price.display}`}
            </button>
            <span className="text-small text-muted">
              Includes unlimited redrafts and rejection handling for 30 days.
            </span>
          </div>
          {error ? (
            <p className="mt-3 text-ui text-notice" role="alert">
              {error}
            </p>
          ) : null}
        </>
      )}
    </div>
  );
}
