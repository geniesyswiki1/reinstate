# Getting Reinstate onto TestFlight

Everything in this repo is ready to build. The steps below are the ones that need accounts and
credentials, which is why they were not run for you.

## What you need first

- An Apple Developer account (company enrolment, and the Small Business Program).
- An Expo account with EAS. `npx eas login`.
- A RevenueCat project with the four consumables in section 12.4.

## 1. Point the app at your accounts

Three placeholders in `eas.json` must be replaced. `eas init` writes the project id and the
owner into `app.json` itself, so neither needs editing by hand.

| File | Field | Replace with |
| --- | --- | --- |
| `eas.json` | `submit.production.ios.appleId` | your Apple ID email |
| `eas.json` | `submit.production.ios.ascAppId` | the App Store Connect app id |
| `eas.json` | `submit.production.ios.appleTeamId` | your Apple team id |

Set the RevenueCat keys as EAS secrets rather than committing them:

```bash
npx eas secret:create --name EXPO_PUBLIC_REVENUECAT_IOS_KEY --value appl_xxx
npx eas secret:create --name EXPO_PUBLIC_REVENUECAT_ANDROID_KEY --value goog_xxx
```

## 2. Create the app record

```bash
cd apps/mobile
npx eas init                 # creates the EAS project, writes the projectId
npx eas credentials          # generates the signing certificate and provisioning profile
```

Create the app in App Store Connect with bundle id `app.reinstate.mobile`, then add the four
consumable in-app purchases from `store-listing.md`.

## 3. Build and upload

```bash
npx eas build --platform ios --profile production
npx eas submit --platform ios --latest
```

The build runs on EAS, so no Mac is needed. `eas submit` uploads to App Store Connect.

## 4. TestFlight

Internal testing takes minutes and needs no Beta App Review:

1. App Store Connect, TestFlight, Internal Testing, add a group.
2. Add the alpha cohort by email, up to 100 testers.
3. The build appears for them as soon as processing finishes.

Create the external group in parallel. Its Beta App Review takes about a day and does not block the
internal testers.

Paste the review notes from `store-listing.md` into the Test Information tab, including the sample
notice, and attach a test invoice PDF.

## 5. Android, same day

```bash
npx eas build --platform android --profile production
npx eas submit --platform android --latest    # goes to the internal track
```

Put the Play service account JSON at `apps/mobile/play-service-account.json`. It is gitignored.

## Before you submit for store review

- Replace the API base URL in the `production` profile of `eas.json` if you are not using
  `https://reinstate.app`.
- Take the six screenshots in the order listed in `store-listing.md`.
- Fill in the privacy labels from the table in `store-listing.md`.
- Confirm the free classify runs before any paywall. Apple reviewers try the core action first, and
  it must work without an account.

## A patch you must not delete

`patches/xcode+3.0.1.patch` is required. `expo-share-intent` adds the Share Extension target through
the `xcode` package, whose `correctForPath` reads `.path` on a `Resources` group that a share
extension does not have, so `expo prebuild` and therefore every iOS build fails without it. The root
`postinstall` script applies it on every install, including `npm ci` in CI. If you ever see
"Could not add resource files to the Share Extension", the patch did not apply.

## What this app does not do yet

- The paywall completes a purchase and RevenueCat's webhook creates the case, but the app then waits
  for the case link by email. Deep linking straight from the purchase into the new case needs the
  webhook to return the token to the client, which is a small addition once RevenueCat is live.
- The document scanner uses the camera and the photo library. Edge-detected multi-page scanning
  (section 12.2) needs a dev client build with a scanner plugin, which cannot be verified without a
  device.
