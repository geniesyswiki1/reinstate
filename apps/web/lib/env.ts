/** Server-only env access. Never import from a client component. */
export function env(name: string): string {
  const v = process.env[name];
  if (!v) throw new Error(`${name} is not set`);
  return v;
}

export function optionalEnv(name: string): string | null {
  return process.env[name] ?? null;
}

export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://reinstate.app';

/** True when the database is configured. Lets the free classify endpoint work without it. */
export function hasSupabase(): boolean {
  return Boolean(process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY);
}
