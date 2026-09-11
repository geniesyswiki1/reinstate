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
  temperature: number;
  max_tokens: number;
  apiKey?: string;
}

export interface MessageResult {
  text: string;
  input_tokens: number;
  output_tokens: number;
}

const ENDPOINT = 'https://api.anthropic.com/v1/messages';

export async function callAnthropic(call: MessageCall): Promise<MessageResult> {
  const apiKey = call.apiKey ?? process.env.ANTHROPIC_API_KEY;
  if (!apiKey) throw new Error('ANTHROPIC_API_KEY is not set');

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
      temperature: call.temperature,
      system: call.system,
      messages: [{ role: 'user', content: call.content }],
    }),
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Anthropic API ${res.status}: ${body.slice(0, 500)}`);
  }

  const json = (await res.json()) as {
    content: { type: string; text?: string }[];
    usage?: { input_tokens: number; output_tokens: number };
  };

  const text = json.content
    .filter((b) => b.type === 'text')
    .map((b) => b.text ?? '')
    .join('');

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
