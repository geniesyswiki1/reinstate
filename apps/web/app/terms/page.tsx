import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms',
  description:
    'What you are buying from Reinstate: a document and a process, with 30 days of redrafts. Not legal advice, and no guarantee of reinstatement.',
  alternates: { canonical: '/terms' },
};

export default function Terms() {
  return (
    <article className="prose-serif mt-6">
      <h1 className="mb-6">Terms</h1>

      <h2 className="mb-3 mt-8">What you are buying</h2>
      <p className="mb-4">
        A document and a process. You pay once for a case. That gives you the intake, the reading of
        your documents, the draft, the pre-check, the exports, and unlimited redrafts and
        rejection handling for 30 days from purchase.
      </p>

      <h2 className="mb-3 mt-8">What this is not</h2>
      <p className="mb-4">
        Reinstate is not a law firm and nothing here is legal advice. We do not represent you, we do
        not contact the platform for you, and we cannot guarantee that your account will be
        reinstated. No one honestly can. What we do is remove the reasons appeals get rejected.
      </p>

      <h2 className="mb-3 mt-8">What we ask of you</h2>
      <p className="mb-4">
        That your answers and documents are true. The appeal is written in your name and you submit
        it. We will not draft an appeal that contradicts what you have told us, and we will say so
        plainly if your answers mean the appeal you want cannot honestly be written.
      </p>

      <h2 className="mb-3 mt-8">Refunds</h2>
      <p className="mb-4">
        A full refund if no draft is delivered within 24 hours of you completing the intake, or if we
        classified your notice wrongly and you tell us before drafting. Otherwise no refunds, because
        the value is delivered when the draft is. Email{' '}
        <a href="mailto:desk@reinstate.app">desk@reinstate.app</a>.
      </p>

      <h2 className="mb-3 mt-8">Your case link</h2>
      <p className="mb-4">
        Your case is reached by a link with a 32 character token, also sent to the email you paid
        with. Anyone with the link can open the case, so treat it as private. We can resend it to
        the purchase address.
      </p>

      <h2 className="mb-3 mt-8">Retention</h2>
      <p className="mb-4">
        Cases and uploads are deleted 90 days after purchase. Export anything you want to keep
        before then.
      </p>

      <h2 className="mb-3 mt-8">Liability</h2>
      <p className="mb-4">
        Our liability to you is limited to what you paid for the case. We are not liable for the
        platform&rsquo;s decision, for lost sales, or for any consequence of a suspension we did not
        cause.
      </p>
    </article>
  );
}
