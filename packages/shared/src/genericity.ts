import type { ParagraphScore } from './types';

/**
 * The share of a paragraph's sentences that contain no case-specific noun (section 4.5).
 * Run locally so a paragraph is always scored even when the review pass omits it.
 */
const SPECIFIC_PATTERNS: RegExp[] = [
  /\bB0[A-Z0-9]{8}\b/, // ASIN
  /\b\d{3}-\d{7}-\d{7}\b/, // Amazon order ID
  /\b\d{12,15}\b/, // eBay item number, tracking
  /\b\d{1,2}\s+(january|february|march|april|may|june|july|august|september|october|november|december)\s+\d{4}\b/i,
  /\b(january|february|march|april|may|june|july|august|september|october|november|december)\s+\d{1,2},?\s+\d{4}\b/i,
  /\b\d{4}-\d{2}-\d{2}\b/,
  /\b\d{1,2}\/\d{1,2}\/\d{2,4}\b/,
  /[£$€]\s?\d/,
  /\b\d+\s?(units|items|orders|pieces|pcs)\b/i,
  /\b\d+(\.\d+)?%/,
  /\.(pdf|png|jpg|jpeg|docx|csv)\b/i,
  /\b[A-Z][a-z]+\s(Ltd|Limited|LLC|Inc|GmbH|BV|SARL|Co)\b/,
  /\bSKU[-\s:]?[A-Z0-9]+/i,
];

export function sentencesOf(paragraph: string): string[] {
  return paragraph
    .split(/(?<=[.!?])\s+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 0);
}

export function isSpecific(sentence: string, extraTerms: string[] = []): boolean {
  if (SPECIFIC_PATTERNS.some((r) => r.test(sentence))) return true;
  const lower = sentence.toLowerCase();
  return extraTerms.some((t) => t.length > 3 && lower.includes(t.toLowerCase()));
}

export function scoreParagraph(paragraph: string, extraTerms: string[] = []): number {
  const sentences = sentencesOf(paragraph);
  if (sentences.length === 0) return 0;
  const generic = sentences.filter((s) => !isSpecific(s, extraTerms)).length;
  return Math.round((generic / sentences.length) * 100) / 100;
}

/** Paragraphs of the draft, skipping headings and bullet lists, which are scored by their own checks. */
export function scoreDraft(draftMarkdown: string, extraTerms: string[] = []): ParagraphScore[] {
  const blocks = draftMarkdown
    .split(/\n{2,}/)
    .map((b) => b.trim())
    .filter((b) => b.length > 0 && !b.startsWith('#'));

  return blocks.map((block, index) => ({
    index,
    genericity: scoreParagraph(block.replace(/^[-*]\s+/gm, ''), extraTerms),
    excerpt: sentencesOf(block)[0]?.slice(0, 160) ?? block.slice(0, 160),
  }));
}

/** Terms drawn from the case so a sentence naming the seller's own supplier counts as specific. */
export function caseTerms(answers: Record<string, string>, filenames: string[]): string[] {
  const fromAnswers = Object.values(answers)
    .filter((v) => typeof v === 'string')
    .flatMap((v) => v.split(/[,\n]/))
    .map((v) => v.trim())
    .filter((v) => v.length > 3 && v.length < 60);
  return [...new Set([...fromAnswers, ...filenames])];
}
