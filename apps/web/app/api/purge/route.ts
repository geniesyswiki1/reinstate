import { NextResponse } from 'next/server';
import { db, EVIDENCE_BUCKET } from '@/lib/supabase';
import { notifyOps, captureError } from '@/lib/ops';

export const runtime = 'nodejs';
export const maxDuration = 120;

/**
 * Nightly purge (section 4.7). Called by the scheduled Netlify function, which passes
 * the site's own secret so the endpoint cannot be triggered from outside.
 */
export async function POST(request: Request) {
  const secret = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!secret || request.headers.get('x-purge-key') !== secret) {
    return NextResponse.json({ error: 'not authorised' }, { status: 401 });
  }

  try {
    const { data, error } = await db().rpc('purge_expired_cases');
    if (error) throw new Error(error.message);

    const rows = (data ?? []) as { purged_case_id: string; storage_path: string | null }[];
    const paths = rows.map((r) => r.storage_path).filter((p): p is string => Boolean(p));
    if (paths.length > 0) {
      await db().storage.from(EVIDENCE_BUCKET).remove(paths);
    }

    const cases = new Set(rows.map((r) => r.purged_case_id)).size;
    await notifyOps('purge', { cases, files: paths.length });

    return NextResponse.json({ ok: true, cases, files: paths.length });
  } catch (err) {
    captureError(err, { route: 'purge' });
    return NextResponse.json({ error: 'purge failed' }, { status: 500 });
  }
}
