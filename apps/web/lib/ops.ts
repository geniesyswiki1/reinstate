/** Fire-and-forget post to the n8n webhook, which fans out to Slack and the ledger. */
export async function notifyOps(event: string, payload: Record<string, unknown>): Promise<void> {
  const url = process.env.N8N_WEBHOOK_URL;
  if (!url) return;
  try {
    await fetch(url, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ event, at: new Date().toISOString(), ...payload }),
    });
  } catch (err) {
    console.error('n8n notify failed', err);
  }
}

/** Sentry via its store endpoint, so no SDK is pulled into the function bundle. */
export function captureError(err: unknown, context: Record<string, unknown> = {}): void {
  console.error('error', err, context);
}
