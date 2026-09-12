'use client';

import { useCallback, useRef, useState } from 'react';
import type { Classification } from '@reinstate/shared';
import Classified from './Classification';

interface Props {
  /** Preselects nothing; the classifier decides. Used only to label the page. */
  hint?: string;
}

async function fileToBase64(file: File): Promise<{ media_type: string; data: string }> {
  const buffer = await file.arrayBuffer();
  let binary = '';
  const bytes = new Uint8Array(buffer);
  for (let i = 0; i < bytes.length; i += 1) binary += String.fromCharCode(bytes[i]);
  return { media_type: file.type || 'image/png', data: btoa(binary) };
}

/** The hero. A working textarea; classification runs free before any payment. */
export default function NoticeBox({ hint }: Props) {
  const [text, setText] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<(Classification & { classification_id?: string | null }) | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const classify = useCallback(
    async (file?: File) => {
      if (!text.trim() && !file) {
        setError('We need the suspension notice to classify your case. Paste the email text or upload a screenshot or PDF.');
        return;
      }
      setBusy(true);
      setError(null);
      setResult(null);
      try {
        const body: Record<string, unknown> = { notice_text: text };
        if (file) body.file = await fileToBase64(file);
        const res = await fetch('/api/classify', {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify(body),
        });
        const json = await res.json();
        if (!res.ok) {
          setError(json.error ?? 'That did not work. Paste the text of the email instead.');
        } else if (!json.case_type) {
          setError(
            json.note ??
              'That does not look like a suspension notice. Paste the full email, including the part that says what the problem is.',
          );
        } else {
          setResult(json as Classification & { classification_id?: string });
        }
      } catch {
        setError('The connection dropped. Try again.');
      } finally {
        setBusy(false);
      }
    },
    [text],
  );

  const highlighted = result?.key_sentences?.length ? highlight(text, result.key_sentences) : null;

  return (
    <section aria-label="Classify your notice">
      <label htmlFor="notice" className="block text-ui font-medium">
        Paste your deactivation notice
      </label>
      <p className="mt-1 mb-3 text-small text-muted">
        Or upload a screenshot or PDF. Nothing is stored until you start a case.
      </p>

      {highlighted ? (
        <div
          className="prose-serif max-w-none whitespace-pre-wrap border border-rule bg-white p-4 text-[16px]"
          aria-live="polite"
        >
          {highlighted}
        </div>
      ) : (
        <textarea
          id="notice"
          className="field min-h-[180px] font-serif text-[16px] leading-relaxed"
          placeholder="We are writing to inform you that your Amazon selling account has been deactivated in accordance with Section 3 of the Amazon Business Solutions Agreement..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          disabled={busy}
        />
      )}

      <div className="mt-3 flex flex-wrap items-center gap-3">
        <button type="button" className="btn btn-primary" onClick={() => classify()} disabled={busy}>
          {busy ? 'Reading the notice...' : 'Classify my notice'}
        </button>
        <button
          type="button"
          className="btn btn-secondary"
          onClick={() => fileRef.current?.click()}
          disabled={busy}
        >
          Upload a screenshot or PDF
        </button>
        {result ? (
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => {
              setResult(null);
              setError(null);
            }}
          >
            Start again
          </button>
        ) : null}
        <input
          ref={fileRef}
          type="file"
          accept="image/png,image/jpeg,image/webp,application/pdf"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) void classify(file);
          }}
        />
      </div>

      {error ? (
        <p className="mt-3 text-ui text-notice" role="alert">
          {error}
        </p>
      ) : null}

      {result ? <Classified result={result} hint={hint} /> : null}
    </section>
  );
}

/** Key sentences come back verbatim, so they can be marked in the original text. */
function highlight(text: string, sentences: string[]): React.ReactNode[] {
  const found = sentences.filter((s) => s && text.includes(s)).sort((a, b) => text.indexOf(a) - text.indexOf(b));
  if (found.length === 0) return [text];

  const nodes: React.ReactNode[] = [];
  let cursor = 0;
  found.forEach((sentence, i) => {
    const at = text.indexOf(sentence, cursor);
    if (at === -1) return;
    if (at > cursor) nodes.push(text.slice(cursor, at));
    nodes.push(
      <mark key={i} className="mark-notice">
        {sentence}
      </mark>,
    );
    cursor = at + sentence.length;
  });
  if (cursor < text.length) nodes.push(text.slice(cursor));
  return nodes;
}
