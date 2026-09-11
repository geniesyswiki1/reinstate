/**
 * Upstash Redis REST rate limiting (section 4.1). Fails open when Upstash is not
 * configured so local development and preview deploys still work.
 */
const url = process.env.UPSTASH_REDIS_REST_URL;
const token = process.env.UPSTASH_REDIS_REST_TOKEN;

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
}

export async function rateLimit(key: string, limit: number, windowSeconds: number): Promise<RateLimitResult> {
  if (!url || !token) return { allowed: true, remaining: limit };

  const res = await fetch(`${url}/pipeline`, {
    method: 'POST',
    headers: { authorization: `Bearer ${token}`, 'content-type': 'application/json' },
    body: JSON.stringify([
      ['INCR', key],
      ['EXPIRE', key, String(windowSeconds), 'NX'],
    ]),
  });

  if (!res.ok) return { allowed: true, remaining: limit };

  const body = (await res.json()) as { result: number }[];
  const count = Number(body[0]?.result ?? 0);
  return { allowed: count <= limit, remaining: Math.max(0, limit - count) };
}

export function clientIp(headers: Headers): string {
  const forwarded = headers.get('x-nf-client-connection-ip') ?? headers.get('x-forwarded-for');
  return forwarded?.split(',')[0]?.trim() || 'unknown';
}
