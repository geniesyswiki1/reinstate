import Link from 'next/link';

export default function NotFound() {
  return (
    <>
      <h1 className="mt-10">That page is not here</h1>
      <p className="prose-serif mt-5">
        The link may be wrong, or a case may have been deleted at the end of its 90 days. Start from
        the home page, or email desk@reinstate.app.
      </p>
      <p className="mt-6">
        <Link href="/" className="btn btn-primary no-underline">
          Go to the home page
        </Link>
      </p>
    </>
  );
}
