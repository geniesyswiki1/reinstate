// Core domain types for Reinstate. Shared by web and mobile.

export type Platform =
  | 'amazon'
  | 'etsy'
  | 'ebay'
  | 'tiktok-shop'
  | 'paypal'
  | 'stripe'
  | 'shopify-payments';

export type Tier = 'amazon' | 'marketplace' | 'payments' | 'addon';

export type CaseStatus =
  | 'classified'
  | 'paid'
  | 'intake'
  | 'evidence'
  | 'drafted'
  | 'ready'
  | 'submitted'
  | 'closed';

export type Source = 'web' | 'ios' | 'android';

export type QuestionType = 'text' | 'longtext' | 'date' | 'number' | 'choice' | 'multichoice' | 'boolean';

export interface IntakeQuestion {
  id: string;
  label: string;
  type: QuestionType;
  /** Shown under the question in --muted. Every question has one. */
  why: string;
  required: boolean;
  options?: string[];
  placeholder?: string;
  /** Only ask when this other answer matches. */
  showIf?: { question_id: string; equals: string | boolean };
}

export interface EvidenceItem {
  id: string;
  label: string;
  why: string;
  required: boolean;
  accepts: string[];
}

export interface OutputSection {
  heading: string;
  guidance: string;
}

export interface OutputStructure {
  /** Exact headings, in order, that the platform expects. */
  sections: OutputSection[];
  opening: string;
  closing: string;
  first_person: true;
}

export type RejectionSeverity = 'blocking' | 'advisory';

export interface RejectionPattern {
  id: string;
  severity: RejectionSeverity;
  check: string;
  /** One-line reason shown in the pre-check when this fails. */
  fail_message: string;
}

export interface SubmissionPath {
  where: string;
  steps: string[];
  turnaround: string;
}

export interface CaseTypeLimits {
  max_chars?: number;
  target_words_min: number;
  target_words_max: number;
  max_attachments?: number;
}

export interface CaseType {
  id: string;
  platform: Platform;
  tier: Tier;
  name: string;
  /** Phrases in the notice that distinguish this case type from its neighbours. */
  distinguishing_phrases: string[];
  intake: IntakeQuestion[];
  evidence: EvidenceItem[];
  output: OutputStructure;
  rejection_patterns: RejectionPattern[];
  submission: SubmissionPath;
  limits: CaseTypeLimits;
}

export interface Classification {
  platform: Platform | null;
  case_type: string | null;
  confidence: number;
  key_sentences: string[];
  evidence_expected: string[];
  deadline: string | null;
  alternates: { case_type: string; confidence: number }[];
  /** Set when the notice is unreadable or not a deactivation notice at all. */
  note?: string;
}

export interface ExtractedFact {
  doc_type: string;
  issuer: string | null;
  dates: string[];
  addresses: string[];
  phone: string | null;
  amounts: string[];
  identifiers: string[];
  quantities: string[];
  flags: string[];
  summary: string;
}

export interface PreCheckItem {
  id: string;
  severity: RejectionSeverity;
  passed: boolean;
  reason: string;
  /** The sentence or missing item at fault, when the check failed. */
  at_fault: string | null;
}

export interface ParagraphScore {
  index: number;
  genericity: number;
  excerpt: string;
}

export interface PreCheckReport {
  items: PreCheckItem[];
  paragraphs: ParagraphScore[];
  blocking_count: number;
  advisory_count: number;
  generic_max: number;
  ready: boolean;
}

export interface DraftResult {
  body_md: string;
  body_txt: string;
  missing: string[];
  word_count: number;
}

export interface CaseRecord {
  id: string;
  token: string;
  email: string | null;
  platform: Platform | null;
  case_type: string | null;
  confidence: number | null;
  notice_text: string | null;
  deadline: string | null;
  status: CaseStatus;
  purchase_id: string | null;
  source: Source;
  created_at: string;
  expires_at: string;
}

export type OutcomeResult = 'reinstated' | 'rejected' | 'pending';
