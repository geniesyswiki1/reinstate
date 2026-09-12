# Getting Reinstate onto TestFlight

Written from an actual run, not from the docs. What was done, what Apple would not let a
machine do, and what is left.

## Done already

Against the Expo account `7amdev` and Apple team `9Z6DNX67TV`:

| | |
| --- | --- |
| EAS project | `@7amdev/reinstate`, id `6e69c9e6-6e1e-49e0-87c2-856d25bcdcf7` |
| Bundle ids registered | `app.reinstate.mobile`, `app.reinstate.mobile.share-extension` |
| Distribution certificate | `PUUPG2UJ92`, expires 2027-09-12 |
| Provisioning profile | `Reinstate App Store`, App Store type, ACTIVE |
| Build profile | `production`, `credentialsSource: local` |

The signing private key was generated in the build environment and never transmitted. The
`.p12`, the `.mobileprovision` and the App Store Connect `.p8` all live outside the repository;
`credentials.json` points at them and is gitignored.

You are now at two iOS distribution certificates, which is the Apple maximum. Revoke one before
creating another.

## What Apple will not let a machine do

**Creating the App Store Connect app record.** `POST /v1/apps` returns
`The resource 'apps' does not allow 'CREATE'`. There is no app-creation endpoint in the App Store
Connect API at all, for any key role. Do it once by hand:

1. App Store Connect, Apps, the plus button, New App.
2. Platform iOS. Name **Reinstate: Seller Appeals**. Primary language **English (UK)**.
3. Bundle ID **app.reinstate.mobile**, already registered so it appears in the dropdown.
4. SKU **REINSTATE001**. Full Access.

**Creating an App Group.** `/v1/appGroups` does not exist. This is why the share extension is not
in the build; see below.

## Submitting

Once the app record exists:

```bash
cd apps/mobile
export EXPO_TOKEN=...                       # expo.dev, Account Settings, Access tokens
export EXPO_ASC_API_KEY_PATH=/path/to/AuthKey_PU69GN8JYQ.p8
export EXPO_ASC_KEY_ID=PU69GN8JYQ
export EXPO_ASC_ISSUER_ID=a005fd01-4aff-48ae-ae4e-5e1f5a680677
export EXPO_APPLE_TEAM_ID=9Z6DNX67TV

npx eas-cli submit --platform ios --latest --non-interactive
```

Then in App Store Connect, TestFlight, Internal Testing: add a group, add the alpha cohort by
email, up to 100 testers. Internal testing needs no Beta App Review, so the build appears for them
as soon as processing finishes. Create the external group in parallel; its review takes about a day
and does not block internal testers.

Paste the review notes from `store-listing.md` into Test Information, including the sample notice,
and attach a test invoice PDF.

## Rebuilding

```bash
npx eas-cli build --platform ios --profile production --non-interactive
```

`credentials.json` must exist and point at the `.p12` and `.mobileprovision`. If it is missing, the
build fails at credential setup, because `eas credentials` is interactive only and cannot run here.

## Two things this build does not have

**The share extension, so no sharing a suspension email from Mail.** `expo-share-intent` adds a
Share Extension target that needs the App Group `group.app.reinstate.mobile`, and app groups can
only be created in the developer portal. Paste and camera capture both work. To restore it:

1. Create the App Group `group.app.reinstate.mobile` in the developer portal, and enable App Groups
   on both bundle ids.
2. Put `["expo-share-intent", { "iosActivationRules": { "NSExtensionActivationSupportsText": true,
   "NSExtensionActivationSupportsWebURLWithMaxCount": 1 } }]` back in `app.json` plugins.
3. Restore the `useShareIntent` hook in `app/index.tsx`: the import, the destructure, and the
   effect that copies `shareIntent.text` into the notice box.
4. Regenerate the provisioning profiles; there will be two targets to sign.

**Deep linking from the purchase into the new case.** After a purchase the RevenueCat webhook
creates the case and emails the link, and the app waits for that email. Closing the loop needs
RevenueCat live.

## A patch you must not delete

`patches/xcode+3.0.1.patch` is required whenever the share extension is re-enabled.
`expo-share-intent` adds its target through the `xcode` package, whose `correctForPath` reads
`.path` on a `Resources` group a share extension does not have, so `expo prebuild` and every iOS
build fail without it. The root `postinstall` applies it on every install, including `npm ci` in CI.

## Which backend the app talks to

`eas.json` sets `EXPO_PUBLIC_API_BASE_URL` per profile. It currently points at
`https://reinstate-test.netlify.app` for every profile, including production, because
**reinstate.app is registered to another company** and serves an unrelated product. Point this at
the real domain once you have one, or the app posts sellers' notices and documents to a third party.
