import type { Metadata } from 'next';
import Link from 'next/link';
import './globals.css';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://reinstate.app';
const noindex = process.env.NEXT_PUBLIC_NOINDEX === '1';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'Reinstate: your account was deactivated. Here is exactly what to send back.',
    template: '%s | Reinstate',
  },
  description:
    'Paste your deactivation notice. We classify it, tell you what evidence the platform expects, and build a Plan of Action on your facts, not a template.',
  icons: { icon: '/favicon.svg' },
  ...(noindex ? { robots: { index: false, follow: false } } : {}),
  openGraph: { type: 'website', siteName: 'Reinstate', url: siteUrl },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const plausible = process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN;
  return (
    <html lang="en">
      <head>
        {plausible ? (
          // eslint-disable-next-line @next/next/no-sync-scripts
          <script defer data-domain={plausible} src="https://plausible.io/js/script.js" />
        ) : null}
      </head>
      <body>
        <div className="mx-auto max-w-content px-6">
          <header className="flex items-center justify-between py-5">
            <Link href="/" aria-label="Reinstate home" className="no-underline">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/logo.svg" alt="reinstate" width={132} height={29} />
            </Link>
            <nav className="flex gap-5 text-ui">
              <Link href="/pricing" className="text-ink no-underline hover:underline">
                Pricing
              </Link>
              <Link href="/#how-it-works" className="text-ink no-underline hover:underline">
                How it works
              </Link>
            </nav>
          </header>
          <main>{children}</main>
          <footer className="rule-top mt-16 py-8 text-small text-muted">
            <p className="m-0 max-w-measure">
              Reinstate helps you write your own appeal. It is not legal advice and does not
              guarantee reinstatement.
            </p>
            <p className="mt-3 flex flex-wrap gap-4">
              <Link href="/privacy" className="text-muted">
                Privacy
              </Link>
              <Link href="/terms" className="text-muted">
                Terms
              </Link>
              <a href="mailto:desk@reinstate.app" className="text-muted">
                desk@reinstate.app
              </a>
            </p>
          </footer>
        </div>
      </body>
    </html>
  );
}
