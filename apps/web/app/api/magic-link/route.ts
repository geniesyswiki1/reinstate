import { NextResponse } from 'next/server';
import { db } from '@/lib/supabase';
import { sendMagicLink } from '@/lib/email';
import { rateLimit, clientIp } from '@/lib/ratelimit';
import { captureError } from '@/lib/ops';

export const runtime = 'nodejs';

/** The email is the account (section 3.5). No password, no enumeration. */
export async function POST(request: Request) {
  const ip = clientIp(request.headers);
  const limit = await rateLimit(`magic:${ip}:${new Date().toISOString().slice(0, 13)}`, 5, 3600);
  if (!limit.allowed) {
    return NextResponse.json({ error: 'Too many requests. Try again in an hour.' }, { status: 429 });
  }

  const { email } = (await request.json()) as { email?: string };
  const address = (email ?? '').trim().toLowerCase();
  if (!address.includes('@')) {
    return NextResponse.json({ error: 'Enter the email you bought the case with.' }, { status: 400 });
  }

  // Always the same answer, whether or not a case exists.
  const reply = NextResponse.json({
    ok: true,
    message: 'If we have a case for that email, the link is on its way.',
  });

  try {
    const { data } = await db()
      .from('cases')
      .select('token')
      .eq('email', address)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();
    if (data?.token) await sendMagicLink(address, data.token as string);
  } catch (err) {
    captureError(err, { route: 'magic-link' });
  }

  return reply;
}
