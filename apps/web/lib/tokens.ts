import { randomBytes, createHash, timingSafeEqual } from 'node:crypto';

/** A case has a 32 character token in its URL (section 3.5). */
export function newCaseToken(): string {
  return randomBytes(24).toString('base64url').slice(0, 32);
}

export function newMagicToken(): string {
  return randomBytes(32).toString('base64url');
}

export function hashToken(token: string): string {
  return createHash('sha256').update(token).digest('hex');
}

export function safeEqual(a: string, b: string): boolean {
  const ab = Buffer.from(a);
  const bb = Buffer.from(b);
  if (ab.length !== bb.length) return false;
  return timingSafeEqual(ab, bb);
}
