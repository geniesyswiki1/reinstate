/** Model routing, section 4.1. Sonnet for classify, extract and review; Opus for the draft pass only. */
export const MODELS = {
  classify: 'claude-sonnet-4-6',
  extract: 'claude-sonnet-4-6',
  review: 'claude-sonnet-4-6',
  draft: 'claude-opus-4-1',
} as const;

export const TEMPERATURES = {
  classify: 0,
  extract: 0,
  review: 0,
  draft: 0.2,
} as const;

export const MAX_TOKENS = {
  classify: 1500,
  extract: 1500,
  review: 3000,
  draft: 3000,
} as const;
