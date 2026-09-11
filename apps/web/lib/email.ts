import { SITE_URL } from './env';

const FROM = 'Reinstate <desk@reinstate.app>';

async function send(to: string, subject: string, text: string): Promise<boolean> {
  const key = process.env.RESEND_API_KEY;
  if (!key) {
    console.warn('RESEND_API_KEY not set, email not sent:', subject);
    return false;
  }
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { authorization: `Bearer ${key}`, 'content-type': 'application/json' },
    body: JSON.stringify({ from: FROM, to, subject, text }),
  });
  if (!res.ok) {
    console.error('Resend error', res.status, await res.text());
    return false;
  }
  return true;
}

export function caseUrl(token: string): string {
  return `${SITE_URL}/case/${token}`;
}

export async function sendCaseLink(to: string, token: string, caseTypeName: string): Promise<boolean> {
  return send(
    to,
    'Your Reinstate case is open',
    `Your case is open: ${caseTypeName}

Open it here. This link is the only way back in, so keep the email:
${caseUrl(token)}

Next: answer the intake questions and upload the evidence on the checklist. The draft and the pre-check appear on the same page.

Your case includes unlimited redrafts and rejection handling for 30 days. Uploads are deleted 90 days after purchase.

Reinstate helps you write your own appeal. It is not legal advice and does not guarantee reinstatement.`,
  );
}

export async function sendMagicLink(to: string, token: string): Promise<boolean> {
  return send(
    to,
    'Your Reinstate case link',
    `Open your case:
${caseUrl(token)}

If you did not ask for this, ignore it.`,
  );
}

export async function sendDraftReady(to: string, token: string, blocking: number): Promise<boolean> {
  const line =
    blocking === 0
      ? 'The pre-check found nothing blocking. It is ready to submit.'
      : `The pre-check found ${blocking} ${blocking === 1 ? 'thing' : 'things'} that would get this rejected. They are listed on the case page.`;
  return send(to, 'Your draft is ready', `Your Plan of Action is drafted.

${line}

${caseUrl(token)}`);
}
