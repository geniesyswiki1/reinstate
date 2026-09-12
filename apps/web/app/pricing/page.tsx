import type { Metadata } from 'next';
import { PRICING, PRICING_RULES } from '@reinstate/content';

export const metadata: Metadata = {
  title: 'Pricing',
  description:
    'One payment per case. Amazon £49, marketplace £29, payments £19. Unlimited redrafts and rejection handling for 30 days. No subscription.',
  alternates: { canonical: '/pricing' },
};

export default function Pricing() {
  return (
    <>
      <h1 className="mt-6 max-w-measure">One payment per case.</h1>
      <p className="prose-serif mt-5">
        You pay once, when you decide to build the appeal. Classification is free and stays free.
      </p>

      <table className="mt-8 w-full border-collapse text-ui">
        <thead>
          <tr className="border-b border-rule text-left">
            <th className="py-2 pr-4 font-medium">Product</th>
            <th className="py-2 pr-4 font-medium">Price</th>
            <th className="py-2 font-medium">Includes</th>
          </tr>
        </thead>
        <tbody>
          {PRICING.map((row) => (
            <tr key={row.id} className="border-b border-rule align-top">
              <td className="py-3 pr-4">{row.product}</td>
              <td className="py-3 pr-4 whitespace-nowrap">{row.price}</td>
              <td className="py-3 text-muted">{row.includes}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <section className="rule-top mt-12 pt-8">
        <h2>The rules</h2>
        <ul className="prose-serif mt-5 list-none p-0">
          {PRICING_RULES.map((rule) => (
            <li key={rule} className="mb-3">
              {rule}
            </li>
          ))}
        </ul>
      </section>

      <section className="rule-top mt-12 pt-8">
        <h2>On the apps</h2>
        <p className="prose-serif mt-4">
          In the iPhone and Android apps a case is bought in-app at the nearest store price:{' '}
          {PRICING.map((p) => `${p.storePrice} for the ${p.product.toLowerCase()}`).slice(0, 3).join(', ')}. A
          case bought on the web opens in the app through the link in your email, and the reverse.
        </p>
      </section>
    </>
  );
}
