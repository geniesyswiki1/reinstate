# Reinstate

A guided appeal builder for sellers whose marketplace or payment account was just suspended.
Paste the notice, answer a structured intake, attach evidence, get back a specific Plan of Action
plus a pre-check and a submission checklist. One price per case, resubmission included.

Built to `SPEC.md`. Read that first; this file only covers running the code.

## What is here

```
apps/web              Next.js 15 app: hero classify, 20 landing pages, case workspace, API routes
packages/shared       18 case types, the four prompts, types, the genericity scorer, refusal rules
content               landing.ts (20 pages), faq.ts, pricing.ts
apps/mobile           Expo app: the six screens in section 12.5, EAS build and submit config
scripts               casetype-lint.ts (offline), run-fixture.ts (needs an API key),
                      render-app-assets.mjs (icons and splash from the brand SVGs)
supabase/schema.sql   the data model in section 4.4, plus the nightly purge function
netlify/functions     the scheduled purge that calls /api/purge
fixtures              an Amazon inauthentic notice and a case with two invoices, one dated late
```

## Running it

```bash
npm install
cp .env.example .env      # fill in what you have; classify needs only ANTHROPIC_API_KEY
npm run dev               # http://localhost:3000
```

The free classify endpoint works with `ANTHROPIC_API_KEY` alone. Cases, uploads, drafts and the
pre-check need Supabase; payments need Lemon Squeezy; the case link email needs Resend.

## Checks

```bash
npm run casecheck   # offline: validates all 18 case types and the genericity scorer
npm run typecheck   # shared packages, content and scripts
npm run lint        # the web app
npm run build       # the web app, including the 20 landing pages and their OG images
npm run dashcheck   # hyphens only: no em or en dashes in shipped copy
npm run fixture     # needs ANTHROPIC_API_KEY: runs classify, draft and review end to end
```

`.github/workflows/ci.yml` runs everything except `fixture` on every pull request and on
pushes to `main`. `fixture` calls the Anthropic API, so it stays a local and pre-release check.

`npm run fixture` is the Phase 1 check in section 11. It asserts that the fixture notice
classifies as `amazon-inauthentic` at 0.9 or better, that the draft carries the three headed
sections with dated bullets inside the word target, and that the review blocks on the fixture
invoice dated after the first listing date.

## Database

Run `supabase/schema.sql` once against a fresh Supabase project. It creates the tables in
section 4.4, the private `evidence` bucket, and `purge_expired_cases()`. Row level security is on
with no policies: only the service role reaches these tables, and the app never ships an anon key.

## Deploying

Netlify, with `@netlify/plugin-nextjs`. Set every variable in `.env.example` in the site
environment. `netlify/functions/purge.mts` runs nightly at 03:00 UTC and calls `/api/purge`, which
deletes expired cases and their stored files.

Point the Lemon Squeezy `order_created` webhook at `/api/webhooks/lemonsqueezy` and the RevenueCat
webhook at `/api/webhooks/revenuecat` with `Authorization: Bearer $REVENUECAT_WEBHOOK_SECRET`.

## Conventions

- Hyphens only. No em dashes or en dashes anywhere, including generated documents and commits.
- Six colours, two fonts, no icons beyond the check and cross glyphs, no dark mode in v1.
- Never promise reinstatement, in copy or in a generated document.
- Nothing is cited in a draft that the user has not confirmed. Missing facts become
  `[MISSING: ...]` markers, which the pre-check turns into blocking items.

## The mobile app

`apps/mobile` is an Expo app sharing `packages/shared` with the web, so the case types, the intake
schemas and the API client are the same objects on both. All model calls stay server side; the app
never holds a key.

```bash
npm run start --workspace=@reinstate/mobile   # Expo dev server
npm run typecheck --workspace=@reinstate/mobile
node scripts/render-app-assets.mjs            # re-render icons and splash after editing the SVGs
```

`apps/mobile/TESTFLIGHT.md` is the runbook for getting it onto TestFlight and the Play internal
track: which placeholders to replace, and the two EAS commands that build and submit. It needs an
Apple Developer account, an EAS account and a RevenueCat project.

`apps/mobile/store-listing.md` holds the store copy, keywords, privacy labels, in-app purchase ids,
and the review notes for Apple, including a sample notice a reviewer can paste to reach the core
action without an account.
