import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { env } from './env';

let client: SupabaseClient | null = null;

/** Service role client. Server only: this key bypasses row level security. */
export function db(): SupabaseClient {
  if (!client) {
    client = createClient(env('SUPABASE_URL'), env('SUPABASE_SERVICE_ROLE_KEY'), {
      auth: { persistSession: false, autoRefreshToken: false },
    });
  }
  return client;
}

export const EVIDENCE_BUCKET = 'evidence';

/** Signed URLs are valid for 15 minutes (section 4.7). */
export async function signedEvidenceUrl(storagePath: string): Promise<string | null> {
  const { data, error } = await db().storage.from(EVIDENCE_BUCKET).createSignedUrl(storagePath, 900);
  if (error) return null;
  return data.signedUrl;
}
