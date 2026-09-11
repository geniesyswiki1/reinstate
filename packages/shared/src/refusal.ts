import type { CaseType } from './types';

/**
 * Section 4.7. We refuse to draft when the seller's own answers say the violation was
 * intentional, because the appeal would have to assert the opposite. The copy is honest.
 */
export interface Refusal {
  refused: true;
  message: string;
}

const RULES: { caseType: string; questionId: string; values: string[]; message: string }[] = [
  {
    caseType: 'amazon-inauthentic',
    questionId: 'items_genuine',
    values: ['No, or I am not sure'],
    message:
      'This appeal would need to say the items were authentic. Your answers say they were not. We cannot draft that. What we can do is help you write an accurate account of what happened and what you have changed, but it will not claim the goods were genuine. Change your answer if you got the question wrong, or email desk@reinstate.app for a refund.',
  },
  {
    caseType: 'etsy-ip',
    questionId: 'source_of_design',
    values: [],
    message:
      'This appeal would need to say you hold the right to use the design. Your answers say you do not. We cannot draft that. We can help you write a removal and correction response instead.',
  },
];

const INTENT_MARKERS = [
  'i knew they were fake',
  'they were fake',
  'they are counterfeit',
  'knowingly sold counterfeit',
  'i copied the design',
  'i stole',
  'faked the invoice',
  'forged the invoice',
  'made up the invoice',
  'i used someone else',
];

export function checkRefusal(caseType: CaseType, answers: Record<string, string>): Refusal | null {
  for (const rule of RULES) {
    if (rule.caseType !== caseType.id) continue;
    const answer = (answers[rule.questionId] ?? '').trim();
    if (!answer) continue;
    if (rule.values.length > 0 && rule.values.includes(answer)) {
      return { refused: true, message: rule.message };
    }
  }

  const all = Object.values(answers).join(' \n ').toLowerCase();
  if (INTENT_MARKERS.some((m) => all.includes(m))) {
    return {
      refused: true,
      message:
        'Your answers describe a deliberate violation. An appeal that denies it would be false, and we will not write one. If that is not what you meant, correct the answer and try again.',
    };
  }

  return null;
}

/** A forged or altered document is never cited. */
export function factIsCitable(flags: string[]): boolean {
  return !flags.includes('unreadable') && !flags.includes('redacted');
}
