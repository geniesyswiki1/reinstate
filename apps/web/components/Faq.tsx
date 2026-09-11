import type { FaqItem } from '@reinstate/content';

export default function Faq({ items, heading = 'Questions' }: { items: FaqItem[]; heading?: string }) {
  return (
    <section className="rule-top mt-12 pt-8">
      <h2>{heading}</h2>
      <dl className="mt-5">
        {items.map((item) => (
          <div key={item.q} className="mb-5 max-w-measure">
            <dt className="text-ui font-medium">{item.q}</dt>
            <dd className="prose-serif m-0 mt-1">{item.a}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
