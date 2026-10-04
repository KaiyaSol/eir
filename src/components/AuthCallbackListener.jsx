import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Capacitor } from '@capacitor/core';
import { App } from '@capacitor/app';
import { Browser } from '@capacitor/browser';
import { supabase } from '@/lib/supabaseClient';
import { NATIVE_AUTH_CALLBACK } from '@/lib/authRedirect';
import { toast } from '@/components/ui/use-toast';

// Links already handled this session. getLaunchUrl() keeps returning the URL the
// app was cold-launched with, so without this a launch link would be re-handled
// (and its error re-shown) every time the listener mounts.
const handledUrls = new Set();

/**
 * Native only: catches `com.eirselfhelp.app://auth-callback...` links (from the
 * sign-up confirmation email, the password reset email, or the OAuth browser
 * redirect), turns the tokens they carry into a Supabase session, and opens the
 * in-app path encoded after the callback (e.g. `/reset-password`).
 */
export default function AuthCallbackListener() {
  const navigate = useNavigate();
  // useNavigate's identity changes on every route change; keep the effect from
  // re-subscribing (and re-reading the launch URL) each time
  const navigateRef = useRef(navigate);
  navigateRef.current = navigate;

  useEffect(() => {
    if (!Capacitor.isNativePlatform()) return undefined;

    const handleUrl = async (url) => {
      if (!url?.startsWith(NATIVE_AUTH_CALLBACK) || handledUrls.has(url)) return;
      handledUrls.add(url);
      // OAuth leaves the system browser open on top of the app
      Browser.close().catch(() => {});

      const parsed = new URL(url);
      // Supabase's implicit flow puts tokens/errors in the #fragment; PKCE uses ?code=
      const params = new URLSearchParams(parsed.hash.slice(1));
      parsed.searchParams.forEach((value, key) => params.set(key, value));

      const errorDescription = params.get('error_description');
      if (errorDescription) {
        toast({
          title: "That link didn't work",
          description: `${errorDescription.replace(/\+/g, ' ')}. Please try again.`,
          variant: 'destructive',
        });
        return;
      }

      let error = null;
      const code = params.get('code');
      const accessToken = params.get('access_token');
      const refreshToken = params.get('refresh_token');
      if (code) {
        ({ error } = await supabase.auth.exchangeCodeForSession(code));
      } else if (accessToken && refreshToken) {
        ({ error } = await supabase.auth.setSession({ access_token: accessToken, refresh_token: refreshToken }));
      } else {
        return;
      }

      if (error) {
        toast({
          title: "Couldn't sign you in",
          description: 'That link may have expired. Please try again.',
          variant: 'destructive',
        });
        return;
      }

      navigateRef.current(parsed.pathname && parsed.pathname !== '/' ? parsed.pathname : '/', { replace: true });
    };

    // The link may launch the app from closed, or arrive while it's running
    App.getLaunchUrl().then((launch) => handleUrl(launch?.url)).catch(() => {});
    const listener = App.addListener('appUrlOpen', ({ url }) => handleUrl(url));

    return () => {
      listener.then((handle) => handle.remove());
    };
  }, []);

  return null;
}
