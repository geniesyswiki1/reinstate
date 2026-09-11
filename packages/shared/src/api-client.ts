/**
 * The API surface both the web and the Expo app call. All processing stays
 * server side (section 12.3), so the app never holds a model key.
 */
import type { Classification, ExtractedFact, OutcomeResult, PreCheckReport } from './types';

export interface ApiClientOptions {
  baseUrl: string;
  fetchImpl?: typeof fetch;
}

export interface ClassifyResult extends Classification {
  classification_id: string | null;
}

export interface DraftResponse {
  ok: boolean;
  draft: { id: string; version: number; body_md: string; body_txt: string };
  missing: string[];
  word_count: number;
}

export interface RefusalResponse {
  refused: true;
  message: string;
}

export class ApiError extends Error {
  constructor(
    message: string,
    readonly status: number,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export class ReinstateApi {
  private readonly baseUrl: string;
  private readonly doFetch: typeof fetch;

  constructor(options: ApiClientOptions) {
    this.baseUrl = options.baseUrl.replace(/\/$/, '');
    this.doFetch = options.fetchImpl ?? fetch;
  }

  private async request<T>(path: string, init?: RequestInit): Promise<T> {
    const res = await this.doFetch(`${this.baseUrl}${path}`, {
      ...init,
      headers: { 'content-type': 'application/json', ...(init?.headers ?? {}) },
    });

    const body = (await res.json().catch(() => ({}))) as Record<string, unknown>;
    if (!res.ok) {
      throw new ApiError(
        (body.error as string) ?? 'Something went wrong. Try again.',
        res.status,
      );
    }
    return body as T;
  }

  /** Free, before any payment. */
  classify(input: { notice_text?: string; file?: { media_type: string; data: string } }) {
    return this.request<ClassifyResult>('/api/classify', {
      method: 'POST',
      body: JSON.stringify(input),
    });
  }

  saveAnswer(caseToken: string, questionId: string, value: string) {
    return this.request<{ ok: boolean }>(`/api/case/${caseToken}/answer`, {
      method: 'POST',
      body: JSON.stringify({ question_id: questionId, value }),
    });
  }

  /** FormData upload, so content-type is left to the runtime. */
  async uploadEvidence(caseToken: string, form: FormData) {
    const res = await this.doFetch(`${this.baseUrl}/api/case/${caseToken}/evidence`, {
      method: 'POST',
      body: form,
    });
    const body = (await res.json().catch(() => ({}))) as Record<string, unknown>;
    if (!res.ok) throw new ApiError((body.error as string) ?? 'The upload failed.', res.status);
    return body as { ok: boolean; evidence: { id: string; filename: string } };
  }

  extract(caseToken: string, evidenceId: string) {
    return this.request<{ ok: boolean; fact: ExtractedFact }>('/api/extract', {
      method: 'POST',
      body: JSON.stringify({ case_token: caseToken, evidence_id: evidenceId }),
    });
  }

  confirmEvidence(caseToken: string, evidenceId: string, confirmed: boolean) {
    return this.request<{ ok: boolean }>(`/api/case/${caseToken}/evidence`, {
      method: 'PATCH',
      body: JSON.stringify({ evidence_id: evidenceId, confirmed }),
    });
  }

  /** Returns the refusal body rather than throwing, because it is a real answer. */
  async draft(caseToken: string): Promise<DraftResponse | RefusalResponse> {
    const res = await this.doFetch(`${this.baseUrl}/api/draft`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ case_token: caseToken }),
    });
    const body = (await res.json().catch(() => ({}))) as Record<string, unknown>;
    if (res.status === 422 && body.refused) return body as unknown as RefusalResponse;
    if (!res.ok) throw new ApiError((body.error as string) ?? 'The draft did not complete.', res.status);
    return body as unknown as DraftResponse;
  }

  review(caseToken: string) {
    return this.request<{ ok: boolean; report: PreCheckReport }>('/api/review', {
      method: 'POST',
      body: JSON.stringify({ case_token: caseToken }),
    });
  }

  recordOutcome(caseToken: string, result: OutcomeResult, rejectionText?: string) {
    return this.request<{ ok: boolean; reclassified: string | null }>('/api/outcome', {
      method: 'POST',
      body: JSON.stringify({ case_token: caseToken, result, rejection_text: rejectionText }),
    });
  }

  requestMagicLink(email: string) {
    return this.request<{ ok: boolean; message: string }>('/api/magic-link', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  }

  docxUrl(caseToken: string): string {
    return `${this.baseUrl}/api/export/docx?case=${encodeURIComponent(caseToken)}`;
  }
}
