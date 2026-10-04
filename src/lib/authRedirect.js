import { Capacitor } from '@capacitor/core';

// Custom URL scheme registered in ios/App/App/Info.plist (CFBundleURLTypes) and
// android/app/src/main/AndroidManifest.xml. Supabase must also allow it under
// Authentication → URL Configuration → Redirect URLs (`com.eirselfhelp.app://**`).
export const NATIVE_AUTH_CALLBACK = 'com.eirselfhelp.app://auth-callback';

/**
 * Where Supabase should send the user after an email link (sign-up confirmation,
 * password reset) or OAuth sign-in. On native that's back into the app via the
 * custom scheme, carrying the in-app path to open; on web it's this site.
 * @param {string} [path] in-app route to land on, e.g. '/reset-password'
 */
export function authRedirectUrl(path = '/') {
  const suffix = path === '/' ? '' : path;
  if (Capacitor.isNativePlatform()) return `${NATIVE_AUTH_CALLBACK}${suffix}`;
  return `${window.location.origin}${suffix}`;
}
