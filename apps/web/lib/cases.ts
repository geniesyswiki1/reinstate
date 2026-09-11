import type { CaseRecord, CaseStatus, ExtractedFact, Platform, Source } from '@reinstate/shared';
import { db } from './supabase';
import { newCaseToken } from './tokens';

export interface CreateCaseInput {
  email: string | null;
  platform: Platform | null;
  caseType: string | null;
  confidence: number | null;
  noticeText: string | null;
  deadline: string | null;
  purchaseId: string | null;
  source: Source;
}

const NINETY_DAYS_MS = 90 * 24 * 60 * 60 * 1000;

export async function createCase(input: CreateCaseInput): Promise<CaseRecord> {
  const token = newCaseToken();
  const { data, error } = await db()
    .from('cases')
    .insert({
      token,
      email: input.email,
      platform: input.platform,
      case_type: input.caseType,
      confidence: input.confidence,
      notice_text: input.noticeText,
      deadline: input.deadline,
      status: 'paid' satisfies CaseStatus,
      purchase_id: input.purchaseId,
      source: input.source,
      expires_at: new Date(Date.now() + NINETY_DAYS_MS).toISOString(),
    })
    .select()
    .single();

  if (error) throw new Error(`createCase: ${error.message}`);
  return data as CaseRecord;
}

export async function caseByToken(token: string): Promise<CaseRecord | null> {
  if (!token || token.length < 16) return null;
  const { data, error } = await db().from('cases').select('*').eq('token', token).maybeSingle();
  if (error) throw new Error(`caseByToken: ${error.message}`);
  return (data as CaseRecord) ?? null;
}

export async function setCaseStatus(caseId: string, status: CaseStatus): Promise<void> {
  const { error } = await db().from('cases').update({ status }).eq('id', caseId);
  if (error) throw new Error(`setCaseStatus: ${error.message}`);
}

export async function answersFor(caseId: string): Promise<Record<string, string>> {
  const { data, error } = await db().from('answers').select('question_id, value').eq('case_id', caseId);
  if (error) throw new Error(`answersFor: ${error.message}`);
  return Object.fromEntries((data ?? []).map((r) => [r.question_id as string, r.value as string]));
}

export async function saveAnswer(caseId: string, questionId: string, value: string): Promise<void> {
  const { error } = await db()
    .from('answers')
    .upsert(
      { case_id: caseId, question_id: questionId, value, updated_at: new Date().toISOString() },
      { onConflict: 'case_id,question_id' },
    );
  if (error) throw new Error(`saveAnswer: ${error.message}`);
}

export interface EvidenceRow {
  id: string;
  case_id: string;
  filename: string;
  storage_path: string;
  doc_type: string | null;
  extracted_json: ExtractedFact | null;
  confirmed: boolean;
  created_at: string;
}

export async function evidenceFor(caseId: string): Promise<EvidenceRow[]> {
  const { data, error } = await db()
    .from('evidence')
    .select('*')
    .eq('case_id', caseId)
    .order('created_at', { ascending: true });
  if (error) throw new Error(`evidenceFor: ${error.message}`);
  return (data ?? []) as EvidenceRow[];
}

/** Only confirmed facts may be cited by the drafter (section 3.2 step 4). */
export async function confirmedFacts(
  caseId: string,
): Promise<{ filename: string; fact: ExtractedFact }[]> {
  const rows = await evidenceFor(caseId);
  return rows
    .filter((r) => r.confirmed && r.extracted_json)
    .map((r) => ({ filename: r.filename, fact: r.extracted_json as ExtractedFact }));
}

export async function latestDraft(
  caseId: string,
): Promise<{ id: string; version: number; body_md: string; body_txt: string } | null> {
  const { data, error } = await db()
    .from('drafts')
    .select('id, version, body_md, body_txt')
    .eq('case_id', caseId)
    .order('version', { ascending: false })
    .limit(1)
    .maybeSingle();
  if (error) throw new Error(`latestDraft: ${error.message}`);
  return data as { id: string; version: number; body_md: string; body_txt: string } | null;
}
