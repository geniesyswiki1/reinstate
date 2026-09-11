'use client';

import type { PreCheckReport } from '@reinstate/shared';

/** The pre-check report. Sticky on desktop, a collapsible bar on mobile. */
export default function PreCheck({ report, busy }: { report: PreCheckReport | null; busy: boolean }) {
  if (busy) {
    return (
      <div className="text-ui text-muted">
        <h2 className="mb-2">Before you submit</h2>
        <p className="m-0">Checking every sentence against the reasons this appeal gets rejected...</p>
      </div>
    );
  }

  if (!report) {
    return (
      <div className="text-ui text-muted">
        <h2 className="mb-2">Before you submit</h2>
        <p className="m-0">
          The pre-check runs on your draft and lists everything a policy team would reject.
        </p>
      </div>
    );
  }

  const failed = report.items.filter((i) => !i.passed);
  const blocking = failed.filter((i) => i.severity === 'blocking');
  const advisory = failed.filter((i) => i.severity === 'advisory');
  const passed = report.items.filter((i) => i.passed);

  const heading = report.ready
    ? 'Ready to submit'
    : `${blocking.length} ${blocking.length === 1 ? 'thing' : 'things'} will get this rejected`;

  return (
    <div className="text-ui">
      <h2 className={`mb-1 ${report.ready ? 'text-reinstated' : 'text-notice'}`}>{heading}</h2>
      <p className="mt-0 text-small text-muted">
        {passed.length} of {report.items.length} checks passed. Worst paragraph scores{' '}
        {report.generic_max.toFixed(2)} for genericity.
      </p>

      {blocking.length > 0 ? (
        <ul className="mt-5 list-none p-0">
          {blocking.map((item) => (
            <li key={item.id} className="mb-4">
              <span aria-hidden="true" className="mr-2 text-notice">
                x
              </span>
              <span className="font-medium">{item.reason}</span>
              {item.at_fault ? (
                <span className="mt-1 block border-l-2 border-rule pl-3 text-small text-muted">
                  {item.at_fault}
                </span>
              ) : null}
            </li>
          ))}
        </ul>
      ) : null}

      {advisory.length > 0 ? (
        <>
          <h3 className="mt-6 font-sans text-ui font-medium">Worth fixing</h3>
          <ul className="mt-2 list-none p-0">
            {advisory.map((item) => (
              <li key={item.id} className="mb-3 text-muted">
                <span aria-hidden="true" className="mr-2">
                  -
                </span>
                {item.reason}
              </li>
            ))}
          </ul>
        </>
      ) : null}

      {passed.length > 0 ? (
        <details className="mt-6">
          <summary className="cursor-pointer text-small text-muted">
            {passed.length} checks passed
          </summary>
          <ul className="mt-2 list-none p-0 text-small text-muted">
            {passed.map((item) => (
              <li key={item.id} className="mb-2">
                <span aria-hidden="true" className="mr-2 text-reinstated">
                  +
                </span>
                {item.reason}
              </li>
            ))}
          </ul>
        </details>
      ) : null}
    </div>
  );
}
