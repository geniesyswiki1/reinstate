'use client';

import type { CaseType } from '@reinstate/shared';

/** The draft, rendered in serif on the left (section 2.4). */
export default function Draft({ markdown, caseType }: { markdown: string; caseType: CaseType }) {
  const blocks = markdown.split('\n').filter((l) => l.trim().length > 0);

  return (
    <article className="prose-serif max-w-none">
      {blocks.map((line, i) => {
        const text = line.trim();
        if (text.startsWith('#')) {
          return (
            <h3 key={i} className="mb-2 mt-6 font-serif text-[20px] font-semibold">
              {text.replace(/^#{1,6}\s*/, '')}
            </h3>
          );
        }
        if (/^[-*]\s+/.test(text)) {
          const body = text.replace(/^[-*]\s+/, '');
          return (
            <p key={i} className="m-0 mb-2 flex gap-2 pl-1">
              <span aria-hidden="true">-</span>
              <span>{withMissing(body)}</span>
            </p>
          );
        }
        return (
          <p key={i} className="mb-4">
            {withMissing(text)}
          </p>
        );
      })}
      <p className="mt-8 text-small text-muted">
        Reinstate helps you write your own appeal. It is not legal advice and does not guarantee
        reinstatement. This line is for you and is not part of what you submit. Target length for a{' '}
        {caseType.platform} {caseType.name.toLowerCase()} is {caseType.limits.target_words_min} to{' '}
        {caseType.limits.target_words_max} words.
      </p>
    </article>
  );
}

/** Missing markers are shown as gaps, not hidden, because they are the point. */
function withMissing(text: string): React.ReactNode {
  const parts = text.split(/(\[MISSING:[^\]]+\])/g);
  if (parts.length === 1) return text;
  return parts.map((part, i) =>
    part.startsWith('[MISSING:') ? (
      <mark key={i} className="mark-notice font-sans text-[14px]">
        {part}
      </mark>
    ) : (
      <span key={i}>{part}</span>
    ),
  );
}
