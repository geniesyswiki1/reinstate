/** Model routing, section 4.1. Sonnet for classify, extract and review; Opus for the draft pass only. */
export const MODELS = {
  classify: 'claude-sonnet-5',
  extract: 'claude-sonnet-5',
  review: 'claude-sonnet-5',
  draft: 'claude-opus-5',
} as const;

/**
 * Section 4.1 asks for temperature 0 on the three Sonnet passes and 0.2 on the draft. The current
 * models reject `temperature` outright ("`temperature` is deprecated for this model", HTTP 400),
 * so the knob for how hard a pass thinks is `output_config.effort` instead. The intent carries
 * over: the draft is the pass worth deliberating over, and the rest stay cheap. Review sits at
 * medium deliberately. At high it spent its entire token budget thinking and returned no answer
 * at all, which is worse than a slightly less considered one; it is scoring a draft against a
 * fixed rubric, not writing prose.
 */
export const EFFORT = {
  classify: 'medium',
  extract: 'medium',
  review: 'medium',
  draft: 'high',
} as const;

/**
 * These budgets cover thinking as well as the visible answer, and thinking is on by default on
 * both current models, so they are well clear of what each pass actually emits. A truncated draft
 * is worse than a slow one.
 */
export const MAX_TOKENS = {
  classify: 4000,
  extract: 8000,
  review: 16000,
  draft: 16000,
} as const;
