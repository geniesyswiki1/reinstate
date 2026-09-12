import { NextResponse } from 'next/server';
import { MODELS } from '@reinstate/shared';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * Which integrations this deploy can actually see. Booleans only, never values: the point is to
 * answer "is the backend configured" without a Netlify login and without a function log, which is
 * the question you have every time a route returns 503. A misconfigured deploy is otherwise
 * indistinguishable from a broken one from the outside.
 */
export function GET() {
  return NextResponse.json({
    ok: Boolean(process.env.ANTHROPIC_API_KEY),
    configured: {
      anthropic: Boolean(process.env.ANTHROPIC_API_KEY),
      supabase: Boolean(process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY),
      stripe: Boolean(process.env.STRIPE_SECRET_KEY && process.env.STRIPE_WEBHOOK_SECRET),
      revenuecat: Boolean(process.env.REVENUECAT_WEBHOOK_SECRET),
      resend: Boolean(process.env.RESEND_API_KEY),
    },
    models: MODELS,
    site_url: process.env.NEXT_PUBLIC_SITE_URL ?? null,
    noindex: process.env.NEXT_PUBLIC_NOINDEX === '1',
  });
}
