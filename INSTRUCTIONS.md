# Building the mobile apps (iOS & Android)

Eir is wrapped for native mobile via [Capacitor](https://capacitorjs.com) — the same React/Vite web app in this repo, running inside a native WebView shell, with native platform APIs (like the system browser for OAuth) available where the code uses them. The `ios/` and `android/` native project folders are already generated and committed in this repo — you're building an existing project, not starting Capacitor from scratch.

**Read "Auth links" and "Known limitations" at the bottom before you ship anything** — they list a required Supabase setting and what still needs real-device testing.

## Prerequisites

| Need | For | Get it from |
|---|---|---|
| Node.js 18+ and npm | Building the web app that gets wrapped | Already required for the rest of this repo |
| **Xcode** (full app, not just Command Line Tools) | iOS builds, Simulator | Mac App Store |
| Apple ID | Running Xcode, iOS code signing | — |
| **Android Studio** | Android builds, emulator, SDK | https://developer.android.com/studio |

CocoaPods is **not** needed — this project's iOS platform uses Swift Package Manager for Capacitor's plugin dependencies (Capacitor 8 default), not CocoaPods.

You do not need a paid Apple Developer or Google Play account to build and run on a Simulator/emulator or your own physical device via Xcode/Android Studio. You do need one to distribute via TestFlight or the Play Store — see "Signing and store submission" below.

## The workflow

Every time you change the app's web code (anything in `src/`) and want to see it on iOS/Android, rebuild and re-sync before opening the native IDE:

```bash
npm run cap:sync    # runs `vite build`, then copies dist/ into ios/ and android/, and syncs plugin config
```

Then open whichever platform you're working on:

```bash
npm run cap:open:ios      # opens ios/App/App.xcodeproj in Xcode
npm run cap:open:android  # opens android/ in Android Studio
```

## Building for iOS

1. `npm run cap:sync`
2. `npm run cap:open:ios` — this opens Xcode.
3. In Xcode, pick a Simulator (or a connected device) from the scheme/device dropdown at the top, then press ▶ (Run). First build will take a while as Xcode resolves the Swift Package dependencies.
4. To run on a **physical device**: connect it, select it as the target, and you'll need to set up code signing — select the `App` target → Signing & Capabilities → choose your Apple ID team. Xcode will prompt you through free "Personal Team" signing for local testing (no paid account needed for this).
5. To produce a build for **TestFlight/App Store**: Product → Archive, then follow Xcode's distribution flow. This requires a paid Apple Developer Program membership (see below).

## Building for Android

1. `npm run cap:sync`
2. `npm run cap:open:android` — this opens Android Studio. First open will take a while as Gradle syncs.
3. Pick an emulator (Android Studio's Device Manager can create one) or a connected device (enable USB debugging in the device's Developer Options), then press ▶ (Run).
4. To produce a **signed release build** (APK or AAB) for the Play Store: Build → Generate Signed Bundle/APK, which will walk you through creating a signing keystore the first time (`keytool -genkey ...` under the hood — Android Studio's UI does this for you). **Keep that keystore file and its password safe and backed up outside this repo** — losing it means you can never update the app under the same listing again.

## Updating the app id / name

`capacitor.config.ts` has `appId` (`com.eirselfhelp.app`, reverse-DNS, part of both stores' bundle identifier) and `appName` ("Eir"). Change either here, then run `npm run cap:sync` — do this **before** you first submit to either store; changing the app id after publishing effectively means shipping as a new, separate app listing.

## Auth links (sign-up, password reset, Google/Apple)

On native, Supabase sends people back into the app through the custom URL scheme `com.eirselfhelp.app://auth-callback` (registered in `ios/App/App/Info.plist` and `android/app/src/main/AndroidManifest.xml`). `src/lib/authRedirect.js` builds the redirect URLs, and `src/components/AuthCallbackListener.jsx` turns the incoming link into a Supabase session and opens the right screen (e.g. `/reset-password`).

**Required one-time Supabase setting:** under **Authentication → URL Configuration → Redirect URLs**, add `com.eirselfhelp.app://**`. Without it, Supabase ignores the app's redirect and falls back to the **Site URL**, so email links land on a broken page.

The link only opens the app on a device that has Eir installed — someone who signs up on their phone but taps the email on a computer gets an error page and should tap it on their phone instead. Universal Links/App Links would fix that, but need a file hosted on a real domain; not set up.

Google/Apple sign-in also needs each provider enabled and configured in Supabase (**Authentication → Providers**); the app side of the return trip is done, but has not been tested against real providers.

## App icon and splash screen

Generated with [`@capacitor/assets`](https://github.com/ionic-team/capacitor-assets) from `assets/icon-only.png` and `assets/logo.png` (both the 1024×1024 app icon) on a `#0f101a` background. To change them, replace those files and run:

```bash
npx @capacitor/assets generate --ios --android --iconBackgroundColor '#0f101a' --iconBackgroundColorDark '#0f101a' --splashBackgroundColor '#0f101a' --splashBackgroundColorDark '#0f101a'
```

## Minimum iOS version

iOS 17.0 (Xcode's recommended target) — iPhone XS/XR (2018) and newer. Set via `IPHONEOS_DEPLOYMENT_TARGET` in `ios/App/App.xcodeproj/project.pbxproj`.

## Known limitations

### Daily reminder notifications

`src/hooks/useDailyReminder.js` schedules a repeating OS notification via `@capacitor/local-notifications` on native (the browser `Notification` API is used on web only). Each reminder sets the app icon badge to 1; `ios/App/App/SceneDelegate.swift` clears it when the app becomes active. Permission prompt and delivery tested on a real iPhone (October 2026); the badge change still needs a device check.

### Account deletion

Settings → Delete Account calls the `delete_own_account()` database function (`supabase/migrations/0003_delete_own_account.sql`, already applied to the live project), which deletes the user's auth account; the profile, daily logs and vents go with it via `on delete cascade`. Tested end-to-end on a real iPhone (October 2026).

Not implemented: for accounts created with Sign in with Apple, Apple asks apps to revoke the user's Apple tokens on deletion (via Apple's REST API). Supabase doesn't do this automatically.

### Signing and store submission

- **iOS**: needs an Apple Developer Program membership ($99/yr) to create the signing certificate and provisioning profile Xcode needs for anything beyond Simulator/personal-device builds, and eventually to submit to TestFlight/App Store.
- **Android**: needs the signing keystore described above for release builds, and a Google Play Developer account ($25 one-time) to publish.

Neither is set up — this is entirely manual, account-holder-specific work only you can do.

## Also see

- [README.md](README.md) — project overview, web stack, local dev setup.
- [docs/qa-checklist.md](docs/qa-checklist.md) — manual QA pass, includes items specific to a shared/mobile device.
