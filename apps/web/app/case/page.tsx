'use client';

import { useState } from 'react';

/** Section 3.5. The email is the account: a magic link, no password. */
export default function OpenCase() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function send() {
    setBusy(true);
    try {
      const res = await fetch('/api/magic-link', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const json = await res.json();
      setMessage(json.message ?? json.error ?? 'Check your inbox.');
    } catch {
      setMessage('The connection dropped. Try again.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <h1 className="mt-6 max-w-measure">Open your case</h1>
      <p className="prose-serif mt-5">
        Your case link is in the email we sent when you paid. Lost it? Enter the address you bought
        with and we will send it again.
      </p>

      <div className="mt-6 max-w-md">
        <label htmlFor="email" className="block text-ui font-medium">
          Email
        </label>
        <input
          id="email"
          type="email"
          className="field mt-2"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@yourbusiness.com"
        />
        <button type="button" className="btn btn-primary mt-3" onClick={send} disabled={busy || !email.includes('@')}>
          {busy ? 'Sending...' : 'Send my case link'}
        </button>
        {message ? <p className="mt-3 text-ui">{message}</p> : null}
      </div>
    </>
  );
}
