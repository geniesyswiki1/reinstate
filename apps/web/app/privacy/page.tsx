import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy',
  description:
    'What Reinstate does with your notice, your answers and your documents. Used only for your case, never for training, deleted after 90 days.',
  alternates: { canonical: '/privacy' },
};

export default function Privacy() {
  return (
    <article className="prose-serif mt-6">
      <h1 className="mb-6">Privacy</h1>

      <h2 className="mb-3 mt-8">What we hold</h2>
      <p className="mb-4">
        The text of the notice you paste, the answers you give in the intake, the documents you
        upload, the drafts we produce, the pre-check reports, and the email address you paid with.
        Nothing else. We do not ask for your Seller Central login and you should never give it to us
        or to anyone offering to appeal on your behalf.
      </p>

      <h2 className="mb-3 mt-8">What we do with it</h2>
      <p className="mb-4">
        We use it to classify your case, read your documents, draft your appeal and check it. That
        is the whole purpose. Your documents are sent to Anthropic&rsquo;s API for that processing,
        under its commercial terms, which mean your inputs are not used to train models. No file
        leaves our infrastructure for any other reason.
      </p>

      <h2 className="mb-3 mt-8">How long we keep it</h2>
      <p className="mb-4">
        Cases and uploads are deleted 90 days after purchase. A scheduled job runs nightly and
        removes both the database rows and the stored files. Free classifications that never became
        a case are deleted on the same schedule.
      </p>

      <h2 className="mb-3 mt-8">How it is stored</h2>
      <p className="mb-4">
        Uploads go to a private bucket that is not publicly readable. When your own case page needs
        to show you a file, it uses a link that expires after fifteen minutes. Location data is
        stripped from photographs on upload. If our document reader sees anything resembling a
        payment card number, only the last four digits are kept.
      </p>

      <h2 className="mb-3 mt-8">Who else sees it</h2>
      <p className="mb-4">
        Our payment provider, Stripe, is the merchant of record and holds your purchase record and your email; we never see
        your card details. Our email provider, Resend, sends your case link. Our hosting and database
        providers store the data described above. Nobody else.
      </p>

      <h2 className="mb-3 mt-8">Your rights</h2>
      <p className="mb-4">
        Ask us to delete your case at any time and we will do it the same day. Email{' '}
        <a href="mailto:desk@reinstate.app">desk@reinstate.app</a> from the address you bought with.
        You can also ask for a copy of everything we hold on your case.
      </p>

      <h2 className="mb-3 mt-8">Analytics</h2>
      <p className="mb-4">
        We count page views and product events without cookies and without tracking individuals
        across sites. We do not run advertising pixels.
      </p>
    </article>
  );
}
