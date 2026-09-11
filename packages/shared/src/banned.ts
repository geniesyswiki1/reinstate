/** Phrases that appear in rejected appeals more often than in accepted ones (section 3.4). */
export const BANNED_PHRASES = [
  'unfortunately',
  'i assure you',
  'please give me one more chance',
  'loyal seller',
  'unfair',
];

/** Words the brand never uses in generated output or interface copy (section 2.5). */
export const FORBIDDEN_CLAIMS = ['guaranteed', '100%', 'reinstated in 24 hours'];

export function findBannedPhrases(text: string): string[] {
  const lower = text.toLowerCase();
  return BANNED_PHRASES.filter((p) => lower.includes(p));
}

/** Hyphens only. No em or en dashes anywhere, including generated documents (section 2.3). */
export function normaliseDashes(text: string): string {
  return text.replace(/[‐-―−]/g, '-');
}
