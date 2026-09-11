'use client';

import { useState } from 'react';
import type { OutcomeResult } from '@reinstate/shared';

export default function OutcomeControl({
  token,
  initial,
  onReclassified,
}: {
  token: string;
  initial: OutcomeResult | null;
  onReclassified?: () => void;
}) {
  const [result, setResult] = useState<OutcomeResult | null>(initial);
  const [rejection, setRejection] = useState('');
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function record(next: OutcomeResult, text?: string) {
    setBusy(true);
    setMessage(null);
    try {
      const res = await fetch('/api/outcome', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ case_token: token, result: next, rejection_text: text }),
      });
      const json = await res.json();
      if (!res.ok) {
        setMessage(json.error ?? 'That did not save. Try again.');
        return;
      }
      setResult(next);
      if (next === 'rejected' && text) {
        setMessage(
          json.reclassified
            ? 'We have read the rejection and updated your case. Answer the new questions and redraft.'
            : 'We have recorded the rejection. Review your answers and redraft.',
        );
        onReclassified?.();
      } else if (next === 'reinstated') {
        setMessage('Good. Thank you for telling us; it makes the pre-check sharper for the next seller.');
      }
    } catch {
      setMessage('That did not save. Check your connection and try again.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="rule-top mt-10 pt-8">
      <h2>What happened?</h2>
      <div className="mt-4 flex flex-wrap gap-3">
        <button
          type="button"
          className={`btn ${result === 'reinstated' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => record('reinstated')}
          disabled={busy}
        >
          Reinstated
        </button>
        <button
          type="button"
          className={`btn ${result === 'rejected' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setResult('rejected')}
          disabled={busy}
        >
          Rejected, paste the reply
        </button>
        <button
          type="button"
          className={`btn ${result === 'pending' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => record('pending')}
          disabled={busy}
        >
          No reply yet
        </button>
      </div>

      {result === 'rejected' ? (
        <div className="mt-4">
          <label htmlFor="rejection" className="block text-ui font-medium">
            Paste the platform&rsquo;s reply
          </label>
          <p className="mb-2 mt-1 text-small text-muted">
            We read it, work out what they are now asking for, update your questions and unlock a
            redraft. Included for 30 days.
          </p>
          <textarea
            id="rejection"
            className="field min-h-[120px] font-serif text-[16px]"
            value={rejection}
            onChange={(e) => setRejection(e.target.value)}
          />
          <button
            type="button"
            className="btn btn-primary mt-3"
            onClick={() => record('rejected', rejection)}
            disabled={busy || rejection.trim().length < 20}
          >
            {busy ? 'Reading the rejection...' : 'Read it and update my case'}
          </button>
        </div>
      ) : null}

      {message ? <p className="mt-3 text-ui">{message}</p> : null}
    </section>
  );
}
