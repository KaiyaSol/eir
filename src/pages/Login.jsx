import React, { useState } from 'react';
import { Capacitor } from '@capacitor/core';
import { Browser } from '@capacitor/browser';
import { LogIn, Loader2 } from 'lucide-react';
import AuthLayout from '@/components/AuthLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { supabase } from '@/lib/supabaseClient';
import { authRedirectUrl } from '@/lib/authRedirect';

export default function Login() {
  const [mode, setMode] = useState('sign_in');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    setInfo('');
    try {
      if (mode === 'sign_up') {
        const { error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: authRedirectUrl('/') },
        });
        if (signUpError) throw signUpError;
        setInfo('Check your email to confirm your account, then sign in.');
        setMode('sign_in');
      } else if (mode === 'forgot_password') {
        const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: authRedirectUrl('/reset-password'),
        });
        if (resetError) throw resetError;
        setInfo('If an account exists for that email, a reset link has been sent.');
      } else {
        const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
        if (signInError) throw signInError;
      }
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleOAuth = async (provider) => {
    setError('');
    try {
      if (Capacitor.isNativePlatform()) {
        // Google/Apple block OAuth inside an embedded WebView, so on native we
        // open the system browser instead of redirecting the app's own WebView.
        // The provider then redirects to the app's custom URL scheme, which
        // AuthCallbackListener turns into a session.
        const { data, error: oauthError } = await supabase.auth.signInWithOAuth({
          provider,
          options: { redirectTo: authRedirectUrl('/'), skipBrowserRedirect: true },
        });
        if (oauthError) throw oauthError;
        if (data?.url) await Browser.open({ url: data.url });
      } else {
        const { error: oauthError } = await supabase.auth.signInWithOAuth({
          provider,
          options: { redirectTo: window.location.origin },
        });
        if (oauthError) throw oauthError;
      }
    } catch (err) {
      setError(err.message || `Could not sign in with ${provider}.`);
    }
  };

  const titles = {
    sign_up: 'Create your account',
    forgot_password: 'Reset your password',
    sign_in: 'Welcome back',
  };

  return (
    <AuthLayout
      icon={LogIn}
      title={titles[mode]}
      subtitle={mode === 'forgot_password' ? "We'll email you a link to reset it" : 'A private space for recovery'}
    >
      {error && (
        <div className="mb-4 p-3 rounded-lg bg-destructive/10 text-destructive text-sm">{error}</div>
      )}
      {info && (
        <div className="mb-4 p-3 rounded-lg bg-primary/10 text-primary text-sm">{info}</div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="rounded-xl mt-1"
          />
        </div>
        {mode !== 'forgot_password' && (
          <div>
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Password</Label>
              {mode === 'sign_in' && (
                <button
                  type="button"
                  className="text-xs text-primary font-medium"
                  onClick={() => {
                    setMode('forgot_password');
                    setError('');
                    setInfo('');
                  }}
                >
                  Forgot password?
                </button>
              )}
            </div>
            <Input
              id="password"
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="rounded-xl mt-1"
            />
          </div>
        )}
        <Button type="submit" disabled={submitting} className="w-full h-12 rounded-xl font-medium">
          {submitting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
          {mode === 'sign_up' ? 'Sign up' : mode === 'forgot_password' ? 'Send reset link' : 'Sign in'}
        </Button>
      </form>

      {mode === 'forgot_password' ? (
        <p className="text-center text-sm text-muted-foreground mt-6">
          <button
            type="button"
            className="text-primary font-medium"
            onClick={() => {
              setMode('sign_in');
              setError('');
              setInfo('');
            }}
          >
            Back to sign in
          </button>
        </p>
      ) : (
        <>
          <div className="flex items-center gap-3 my-6">
            <div className="h-px bg-border flex-1" />
            <span className="text-xs text-muted-foreground">or</span>
            <div className="h-px bg-border flex-1" />
          </div>

          <div className="space-y-3">
            <Button type="button" variant="outline" className="w-full h-12 rounded-xl" onClick={() => handleOAuth('google')}>
              Continue with Google
            </Button>
            <Button type="button" variant="outline" className="w-full h-12 rounded-xl" onClick={() => handleOAuth('apple')}>
              Continue with Apple
            </Button>
          </div>

          <p className="text-center text-sm text-muted-foreground mt-6">
            {mode === 'sign_up' ? 'Already have an account?' : "Don't have an account?"}{' '}
            <button
              type="button"
              className="text-primary font-medium"
              onClick={() => {
                setMode(mode === 'sign_up' ? 'sign_in' : 'sign_up');
                setError('');
                setInfo('');
              }}
            >
              {mode === 'sign_up' ? 'Sign in' : 'Sign up'}
            </button>
          </p>
        </>
      )}
    </AuthLayout>
  );
}
