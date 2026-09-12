import type { Config } from '@netlify/functions';

/**
 * Nightly purge (section 4.7). Calls the app's own purge route with the service key,
 * so the deletion logic lives in one place next to the database client.
 */
export default async function handler(): Promise<Response> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? process.env.URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!siteUrl || !key) {
    console.error('purge: NEXT_PUBLIC_SITE_URL and SUPABASE_SERVICE_ROLE_KEY must both be set');
    return new Response('not configured', { status: 500 });
  }

  const res = await fetch(`${siteUrl}/api/purge`, {
    method: 'POST',
    headers: { 'x-purge-key': key },
  });
  const body = await res.text();
  console.log('purge', res.status, body);
  return new Response(body, { status: res.status });
}

export const config: Config = { schedule: '0 3 * * *' };
