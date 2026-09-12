'use client';

import { useRef, useState } from 'react';
import type { CaseType, ExtractedFact } from '@reinstate/shared';

export interface EvidenceView {
  id: string;
  filename: string;
  doc_type: string | null;
  extracted_json: ExtractedFact | null;
  confirmed: boolean;
}

interface Props {
  token: string;
  caseType: CaseType;
  initial: EvidenceView[];
}

/** The evidence list from classification becomes a checklist (section 3.2 step 4). */
export default function EvidenceList({ token, caseType, initial }: Props) {
  const [files, setFiles] = useState<EvidenceView[]>(initial);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  async function upload(file: File) {
    setBusy(true);
    setError(null);
    try {
      const form = new FormData();
      form.append('file', file);
      const res = await fetch(`/api/case/${token}/evidence`, { method: 'POST', body: form });
      const json = await res.json();
      if (!res.ok) {
        setError(json.error ?? 'The upload failed. Try again.');
        return;
      }

      const row: EvidenceView = { ...json.evidence, doc_type: null, extracted_json: null, confirmed: false };
      setFiles((prev) => [...prev, row]);

      const extracted = await fetch('/api/extract', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ case_token: token, evidence_id: row.id }),
      });
      const factJson = await extracted.json();
      if (extracted.ok) {
        setFiles((prev) =>
          prev.map((f) =>
            f.id === row.id ? { ...f, extracted_json: factJson.fact, doc_type: factJson.fact.doc_type } : f,
          ),
        );
      } else {
        setError(factJson.error ?? 'We could not read that document.');
      }
    } catch {
      setError('The upload failed. Check your connection and try again.');
    } finally {
      setBusy(false);
    }
  }

  async function patch(id: string, body: Record<string, unknown>) {
    await fetch(`/api/case/${token}/evidence`, {
      method: 'PATCH',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ evidence_id: id, ...body }),
    });
  }

  async function confirm(id: string, confirmed: boolean) {
    setFiles((prev) => prev.map((f) => (f.id === id ? { ...f, confirmed } : f)));
    await patch(id, { confirmed });
  }

  async function remove(id: string) {
    setFiles((prev) => prev.filter((f) => f.id !== id));
    await patch(id, { remove: true });
  }

  return (
    <section aria-label="Evidence" className="rule-top mt-10 pt-8">
      <h2>Your evidence</h2>
      <p className="mt-2 text-ui text-muted">
        {caseType.platform === 'amazon' ? 'Amazon' : 'The platform'} will expect these. Upload what
        you have; we read each file and cite only what you confirm.
      </p>

      <ul className="mt-5 list-none p-0">
        {caseType.evidence.map((item) => {
          const matched = files.filter((f) => f.confirmed).length > 0;
          return (
            <li key={item.id} className="mb-3 flex gap-2 text-ui">
              <span aria-hidden="true" className={matched ? 'text-reinstated' : 'text-muted'}>
                {item.required ? '+' : '-'}
              </span>
              <span>
                {item.label}
                {item.required ? '' : ' (optional)'}
                <span className="block text-small text-muted">{item.why}</span>
              </span>
            </li>
          );
        })}
      </ul>

      <div className="mt-5">
        <button
          type="button"
          className="btn btn-secondary"
          onClick={() => inputRef.current?.click()}
          disabled={busy || files.length >= 20}
        >
          {busy ? 'Reading the document...' : 'Upload invoices (PDF or photo)'}
        </button>
        <input
          ref={inputRef}
          type="file"
          accept="image/png,image/jpeg,image/webp,application/pdf"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) void upload(file);
            e.target.value = '';
          }}
        />
      </div>

      {error ? (
        <p className="mt-3 text-ui text-notice" role="alert">
          {error}
        </p>
      ) : null}

      {files.length > 0 ? (
        <ul className="mt-6 list-none p-0">
          {files.map((f) => (
            <li key={f.id} className="mb-4 border-b border-rule pb-4">
              <p className="m-0 text-ui font-medium">{f.filename}</p>
              {f.extracted_json ? (
                <>
                  <p className="prose-serif m-0 mt-1 text-[16px]">
                    We found: {f.extracted_json.summary} Is this right?
                  </p>
                  {f.extracted_json.flags.length > 0 ? (
                    <p className="mt-1 text-small text-notice">
                      Watch out: {f.extracted_json.flags.join(', ')}.
                    </p>
                  ) : null}
                  <div className="mt-2 flex flex-wrap gap-2">
                    <button
                      type="button"
                      className={`btn ${f.confirmed ? 'btn-primary' : 'btn-secondary'}`}
                      onClick={() => confirm(f.id, true)}
                    >
                      Yes, use it
                    </button>
                    <button type="button" className="btn btn-secondary" onClick={() => confirm(f.id, false)}>
                      No, skip this
                    </button>
                    <button type="button" className="btn btn-secondary" onClick={() => remove(f.id)}>
                      Remove the file
                    </button>
                  </div>
                </>
              ) : (
                <p className="mt-1 text-small text-muted">Reading this document...</p>
              )}
            </li>
          ))}
        </ul>
      ) : null}
    </section>
  );
}
