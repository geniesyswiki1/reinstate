export interface FaqItem {
  q: string;
  a: string;
}

export const HOME_FAQ: FaqItem[] = [
  {
    q: 'Is the classification really free?',
    a: 'Yes. Paste the notice and read the result. You pay only to build the appeal.',
  },
  {
    q: 'What if it is rejected?',
    a: 'Paste the rejection into your case. We reclassify, ask the new questions, and redraft. Included for 30 days.',
  },
  {
    q: 'Do you submit it for me?',
    a: 'No. You paste it into the platform’s appeal form; we show you exactly where.',
  },
  {
    q: 'Will the platform know this was drafted with a tool?',
    a: 'The document contains only your facts in your first person. Generic wording is exactly what we remove.',
  },
  {
    q: 'What happens to my documents?',
    a: 'Used only for this case, deleted after 90 days, never used for anything else.',
  },
  {
    q: 'How does it work?',
    a: 'A language model classifies the notice, reads your documents, drafts the appeal from confirmed facts, and a second pass checks it against the known reasons appeals fail.',
  },
];
