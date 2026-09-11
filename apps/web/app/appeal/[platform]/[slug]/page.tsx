import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { LANDING_PAGES } from '@reinstate/content';
import { getCaseType, PLATFORM_LABELS } from '@reinstate/shared';
import NoticeBox from '@/components/NoticeBox';
import Faq from '@/components/Faq';

type Params = { platform: string; slug: string };

export function generateStaticParams(): Params[] {
  return LANDING_PAGES.map((p) => ({ platform: p.platform, slug: p.slug }));
}

function findPage(platform: string, slug: string) {
  return LANDING_PAGES.find((p) => p.platform === platform && p.slug === slug) ?? null;
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { platform, slug } = await params;
  const page = findPage(platform, slug);
  if (!page) return {};
  const path = `/appeal/${page.platform}/${page.slug}`;
  return {
    title: { absolute: page.title },
    description: page.description,
    alternates: { canonical: path },
    openGraph: {
      title: page.title,
      description: page.description,
      url: path,
      images: [{ url: `/og/${page.platform}-${page.slug}.png`, width: 1200, height: 630 }],
    },
  };
}

export default async function LandingPage({ params }: { params: Promise<Params> }) {
  const { platform, slug } = await params;
  const page = findPage(platform, slug);
  if (!page) notFound();

  const caseType = getCaseType(page.caseTypeId);

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: page.faq.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <section className="pt-6">
        <p className="text-small text-muted">
          {caseType ? PLATFORM_LABELS[caseType.platform] : page.platform} appeals
        </p>
        <h1 className="mt-2 max-w-measure">{page.h1}</h1>
        <p className="prose-serif mt-5">{page.intro}</p>
      </section>

      <div className="mt-8">
        <NoticeBox hint={page.caseTypeId} />
      </div>

      <section className="rule-top mt-16 pt-8">
        <h2>What this notice means</h2>
        <div className="prose-serif mt-5">
          {page.explainer.map((para) => (
            <p key={para.slice(0, 40)} className="mb-4">
              {para}
            </p>
          ))}
        </div>
      </section>

      <section className="rule-top mt-12 pt-8">
        <h2>The three commonest reasons this appeal is rejected</h2>
        <ol className="prose-serif mt-5 list-decimal pl-6">
          {page.rejections.map((r) => (
            <li key={r} className="mb-2">
              {r}
            </li>
          ))}
        </ol>
      </section>

      <section className="rule-top mt-12 pt-8">
        <h2>What to have ready</h2>
        <ul className="prose-serif mt-5 list-none p-0">
          {page.evidence.map((e) => (
            <li key={e} className="mb-2 flex gap-2">
              <span aria-hidden="true" className="text-reinstated">
                +
              </span>
              <span>{e}</span>
            </li>
          ))}
        </ul>
        {caseType ? (
          <p className="mt-6 text-ui">
            Where it goes: {caseType.submission.where}.{' '}
            <span className="text-muted">{caseType.submission.turnaround}</span>
          </p>
        ) : null}
      </section>

      <section className="rule-top mt-12 pt-8">
        <h2>Price</h2>
        <p className="prose-serif mt-4">
          {page.price} for this case. That covers classification, the intake, reading your documents,
          the draft, the pre-check, the DOCX, and unlimited redrafts and rejection handling for 30
          days. One payment, no subscription.
        </p>
        <p className="mt-4 text-small text-muted">
          <Link href="/pricing" className="text-reinstated">
            Pricing and refund terms
          </Link>
        </p>
      </section>

      <Faq items={page.faq} />
    </>
  );
}
