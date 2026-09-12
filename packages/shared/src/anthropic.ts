/**
 * Minimal Anthropic Messages client. Kept dependency free so the same module runs
 * in a Netlify function, a Node script and the Expo app's server calls.
 */

export interface TextBlock { type: 'text'; text: string }
export interface ImageBlock {
  type: 'image';
  source: { type: 'base64'; media_type: string; data: string };
}
export interface DocumentBlock {
  type: 'document';
  source: { type: 'base64'; media_type: 'application/pdf'; data: string };
}
export type ContentBlock = TextBlock | ImageBlock | DocumentBlock;

export interface MessageCall {
  model: string;
  system: string;
  content: ContentBlock[];
  /** How hard the model should think: low, medium, high, xhigh or max. See EFFORT in prompts/models. */
  effort: string;
  max_tokens: number;
  apiKey?: string;
}

export interface MessageResult {
  text: string;
  input_tokens: number;
  output_tokens: number;
}

/**
 * The backend is misconfigured, as distinct from the model or the notice being unreadable. The two
 * need different answers: telling a seller to paste the text again when the key is missing sends
 * them round a loop they cannot get out of, and hides the outage from us.
 */
export class ConfigError extends Error {
  readonly isConfigError = true;
  /** Coarse cause, safe to return to a caller: no key at all, or an upstream that rejected us. */
  readonly code: string;
  constructor(message: string, code = 'no_api_key') {
    super(message);
    this.name = 'ConfigError';
    this.code = code;
  }
}

export function configErrorCode(err: unknown): string {
  return (err as { code?: string })?.code ?? 'unknown';
}

export function isConfigError(err: unknown): boolean {
  return err instanceof ConfigError || (err as { isConfigError?: boolean })?.isConfigError === true;
}

const ENDPOINT = 'https://api.anthropic.com/v1/messages';

export async function callAnthropic(call: MessageCall): Promise<MessageResult> {
  const apiKey = call.apiKey ?? process.env.ANTHROPIC_API_KEY;
  if (!apiKey) throw new ConfigError('ANTHROPIC_API_KEY is not set');

  const res = await fetch(ENDPOINT, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: call.model,
      max_tokens: call.max_tokens,
      output_config: { effort: call.effort },
      system: call.system,
      messages: [{ role: 'user', content: call.content }],
    }),
  });

  if (!res.ok) {
    const body = await res.text();
    if (res.status === 401 || res.status === 403 || res.status === 404) {
      throw new ConfigError(`Anthropic API ${res.status}: ${body.slice(0, 300)}`, `upstream_${res.status}`);
    }
    throw new Error(`Anthropic API ${res.status}: ${body.slice(0, 500)}`);
  }

  const json = (await res.json()) as {
    content: { type: string; text?: string }[];
    stop_reason?: string;
    usage?: { input_tokens: number; output_tokens: number };
  };

  const text = json.content
    .filter((b) => b.type === 'text')
    .map((b) => b.text ?? '')
    .join('');

  /**
   * Thinking is on by default on both current models and is billed against max_tokens, so a pass
   * whose budget is too small burns the lot thinking and returns no answer at all. Say that
   * plainly: the alternative is an empty string reaching parseJson, which reports "No JSON found"
   * and sends you looking for a prompt bug that is not there.
   */
  if (!text.trim()) {
    if (json.stop_reason === 'max_tokens') {
      throw new Error(
        `Anthropic returned no text: the ${call.model} call hit max_tokens (${call.max_tokens}) while thinking. Raise MAX_TOKENS or lower EFFORT for this pass.`,
      );
    }
    throw new Error(`Anthropic returned no text (stop_reason: ${json.stop_reason ?? 'unknown'}).`);
  }

  return {
    text,
    input_tokens: json.usage?.input_tokens ?? 0,
    output_tokens: json.usage?.output_tokens ?? 0,
  };
}

/** Models are asked for JSON only, but a stray fence should not fail a case. */
export function parseJson<T>(text: string): T {
  const trimmed = text.trim();
  const fenced = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/);
  const candidate = fenced ? fenced[1] : trimmed;
  const start = candidate.search(/[[{]/);
  if (start === -1) throw new Error(`No JSON found in model response: ${trimmed.slice(0, 200)}`);
  const end = Math.max(candidate.lastIndexOf('}'), candidate.lastIndexOf(']'));
  return JSON.parse(candidate.slice(start, end + 1)) as T;
}
