# Working agreements

Standing decisions for this repository. These override anything in `SPEC.md` that contradicts
them: the spec is the original brief, this file is the current one.

## Payments: Stripe Managed Payments, never Lemon Squeezy

**Every app we build takes payment through Stripe Managed Payments.** Not Lemon Squeezy, not
Paddle, not raw Stripe Payments. This is a standing decision across all projects, not a Reinstate
detail, so start new work on Stripe and do not reintroduce Lemon Squeezy because a spec or an older
document mentions it.

Managed Payments is Stripe acting as merchant of record: it handles indirect tax compliance in more
than 80 countries, fraud, disputes and transaction-level customer support. That is the same job
Lemon Squeezy was doing in the original spec, which is why it is a like-for-like replacement rather
than a downgrade to self-serve payments.

What that means in code:

- Products and prices live in the Stripe dashboard. The app holds price ids, never amounts, so a
  price change does not need a deploy.
- Checkout is a Stripe Checkout Session created server side with `managed_payments[enabled]: true`.
  Without that flag you get ordinary Stripe payments and you are the merchant of record, which is
  the thing we are deliberately not doing.
- Requires API version `2025-03-31.basil` or later, and the Managed Payments terms accepted in the
  dashboard.
- Products must carry a tax code that is eligible for Managed Payments, or checkout fails.
- Fulfil on the `checkout.session.completed` webhook, and handle
  `checkout.session.async_payment_succeeded` and `checkout.session.async_payment_failed` too, since
  delayed payment methods do not settle during the session. Never fulfil from the success page.
- Webhooks are idempotent on the provider's own id, so a redelivery cannot double-create.

Apple requires in-app purchase for digital goods bought inside an iOS app, so the mobile app keeps
RevenueCat. That is not a payments-provider choice, it is a store rule: routing iOS purchases to
Stripe would get the build rejected under guideline 3.1.1.

## House style

- **Hyphens only.** No em dashes, no en dashes, anywhere: shipped copy, code comments, commit
  messages. `npm run dashcheck` enforces it and CI runs it.
- Never promise reinstatement. The product improves an appeal, it does not guarantee an outcome.
- Never commit secrets. Read them from the environment and list every one in `.env.example`.
