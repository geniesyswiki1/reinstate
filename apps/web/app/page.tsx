import Link from 'next/link';
import { HOME_FAQ, PRICING } from '@reinstate/content';
import NoticeBox from '@/components/NoticeBox';
import Faq from '@/components/Faq';
import { SITE_URL } from '@/lib/env';

const howTo = {
  '@context': 'https://schema.org',
  '@type': 'HowTo',
  name: 'How to appeal a marketplace account deactivation',
  description:
    'Classify the deactivation notice, answer the questions that matter for that case type, upload evidence, and build a Plan of Action on confirmed facts.',
  step: [
    { '@type': 'HowToStep', name: 'Paste the notice', text: 'We classify it and list the evidence you will need.' },
    {
      '@type': 'HowToStep',
      name: 'Answer the questions that matter',
      text: 'Each one is there because appeals get rejected without it.',
    },
    {
      '@type': 'HowToStep',
      name: 'Upload your documents',
      text: 'We read them and only cite what you confirm.',
    },
    {
      '@type': 'HowToStep',
      name: 'Get your Plan of Action',
      text: 'With a pre-check of every weak point and the exact place to submit it.',
    },
  ],
};

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: HOME_FAQ.map((f) => ({
    '@type': 'Question',
    name: f.q,
    acceptedAnswer: { '@type': 'Answer', text: f.a },
  })),
};

export default function Home() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(howTo) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <section className="pt-6">
        <h1 className="max-w-measure">Your account was deactivated. Here is exactly what to send back.</h1>
        <p className="prose-serif mt-5">
          Paste the notice. We will tell you what kind of case it is and what evidence the platform
          expects, free. Then build a Plan of Action on your facts, not a template, in about 15
          minutes.
        </p>
      </section>

      <div className="mt-8">
        <NoticeBox />
      </div>

      <section id="how-it-works" className="rule-top mt-16 pt-8">
        <h2>How it works</h2>
        <ol className="prose-serif mt-5 list-decimal pl-6">
          <li className="mb-3">Paste the notice. We classify it and list the evidence you will need.</li>
          <li className="mb-3">
            Answer the questions that matter for your case. Each one is there because appeals get
            rejected without it.
          </li>
          <li className="mb-3">Upload your documents. We read them and only cite what you confirm.</li>
          <li>
            Get your Plan of Action, a pre-check of every weak point, and the exact place to submit
            it. Redraft as often as you need for 30 days.
          </li>
        </ol>
      </section>

      <section className="rule-top mt-12 pt-8">
        <h2>Why appeals get rejected</h2>
        <div className="prose-serif mt-5">
          <p className="m-0 mb-2">They restate the notice instead of explaining the cause.</p>
          <p className="m-0 mb-2">They promise to do better with no dated, verifiable action.</p>
          <p className="m-0 mb-2">
            They cite invoices that do not match the ASINs, the dates or the quantities.
          </p>
          <p className="m-0 mt-4">Reinstate checks all three before you submit.</p>
        </div>
      </section>

      <section className="rule-top mt-12 pt-8">
        <h2>What this is and is not</h2>
        <p className="prose-serif mt-5">
          Reinstate helps you write your own appeal. It is not legal advice and nobody can guarantee
          reinstatement. What we can do is remove the reasons appeals fail, in minutes instead of
          days, for the price of a takeaway.
        </p>
      </section>

      <section className="rule-top mt-12 pt-8">
        <h2>Pricing</h2>
        <table className="mt-5 w-full border-collapse text-ui">
          <thead>
            <tr className="border-b border-rule text-left">
              <th className="py-2 pr-4 font-medium">Product</th>
              <th className="py-2 pr-4 font-medium">Price</th>
            </tr>
          </thead>
          <tbody>
            {PRICING.map((row) => (
              <tr key={row.id} className="border-b border-rule align-top">
                <td className="py-3 pr-4">
                  {row.product}
                  <span className="block text-small text-muted">{row.includes}</span>
                </td>
                <td className="py-3 pr-4 whitespace-nowrap">{row.price}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="mt-4 text-small text-muted">
          One-time. No subscription.{' '}
          <Link href="/pricing" className="text-reinstated">
            Full pricing and refund terms
          </Link>
          .
        </p>
      </section>

      <Faq items={HOME_FAQ} />

      <p className="mt-10 text-small text-muted">
        Already have a case?{' '}
        <Link href="/case" className="text-reinstated">
          Open it with your email
        </Link>
        .
      </p>
      <link rel="canonical" href={SITE_URL} />
    </>
  );
}
