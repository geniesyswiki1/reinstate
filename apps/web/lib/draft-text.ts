import { normaliseDashes } from '@reinstate/shared';

/** Markdown to the plain text the platforms' appeal boxes take. */
export function toPlainText(markdown: string): string {
  return normaliseDashes(markdown)
    .replace(/^#{1,6}\s*/gm, '')
    .replace(/\*\*(.+?)\*\*/g, '$1')
    .replace(/\*(.+?)\*/g, '$1')
    .replace(/^[-*]\s+/gm, '- ')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

export function countWords(text: string): number {
  return text.split(/\s+/).filter(Boolean).length;
}

export function missingMarkers(text: string): string[] {
  return [...text.matchAll(/\[MISSING:\s*([^\]]+)\]/g)].map((m) => m[1].trim());
}
