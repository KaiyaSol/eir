import React, { createContext, useContext, useState, useLayoutEffect } from 'react';
import { useAuth } from '@/lib/AuthContext';

const ThemeContext = createContext(undefined);

export const THEMES = [
  { id: 'pink',   name: 'Pink',   color: '#ec4899', hsl: '330 81% 60%' },
  { id: 'orange', name: 'Orange', color: '#f97316', hsl: '24 95% 53%' },
  { id: 'yellow', name: 'Yellow', color: '#eab308', hsl: '48 96% 53%' },
  { id: 'green',  name: 'Green',  color: '#15803d', hsl: '142 72% 30%' },
  { id: 'blue',   name: 'Blue',   color: '#3b82f6', hsl: '217 91% 60%' },
  { id: 'purple', name: 'Purple', color: '#a855f7', hsl: '271 91% 65%' },
  { id: 'white',  name: 'White',  color: '#e2e8f0', hsl: '214 32% 91%' },
];

const BLACK_BG_VARS = {
  background:          '0 0% 6%',
  foreground:          '0 0% 92%',
  card:                '0 0% 10%',
  cardForeground:      '0 0% 92%',
  popover:             '0 0% 10%',
  popoverForeground:   '0 0% 92%',
  muted:               '0 0% 14%',
  mutedForeground:     '0 0% 50%',
  secondary:           '0 0% 14%',
  secondaryForeground: '0 0% 75%',
  accent:              '0 0% 16%',
  accentForeground:    '0 0% 80%',
  border:              '0 0% 18%',
  input:               '0 0% 18%',
};

function applyTheme(themeId) {
  const root = document.documentElement;
  const theme = THEMES.find(t => t.id === themeId) || THEMES[0];

  root.style.setProperty('--background',           BLACK_BG_VARS.background);
  root.style.setProperty('--foreground',           BLACK_BG_VARS.foreground);
  root.style.setProperty('--card',                 BLACK_BG_VARS.card);
  root.style.setProperty('--card-foreground',      BLACK_BG_VARS.cardForeground);
  root.style.setProperty('--popover',              BLACK_BG_VARS.popover);
  root.style.setProperty('--popover-foreground',   BLACK_BG_VARS.popoverForeground);
  root.style.setProperty('--muted',                BLACK_BG_VARS.muted);
  root.style.setProperty('--muted-foreground',     BLACK_BG_VARS.mutedForeground);
  root.style.setProperty('--secondary',            BLACK_BG_VARS.secondary);
  root.style.setProperty('--secondary-foreground', BLACK_BG_VARS.secondaryForeground);
  root.style.setProperty('--accent',               BLACK_BG_VARS.accent);
  root.style.setProperty('--accent-foreground',    BLACK_BG_VARS.accentForeground);
  root.style.setProperty('--border',               BLACK_BG_VARS.border);
  root.style.setProperty('--input',                BLACK_BG_VARS.input);

  root.style.setProperty('--primary',              theme.hsl);
  root.style.setProperty('--primary-foreground',   (themeId === 'white' || themeId === 'yellow') ? '0 0% 10%' : '0 0% 100%');
  root.style.setProperty('--ring',                 theme.hsl);
}

const DEFAULT_THEME = 'white';
// Before themes were saved per user, one device-wide choice lived here
const LEGACY_KEY = 'app-theme';
const keyFor = (userId) => `app-theme:${userId}`;

// Signed out → the default theme, so the login screen never shows the last
// user's colour. Signed in → that user's own saved choice on this device.
function readSavedTheme(userId) {
  if (!userId) return DEFAULT_THEME;
  try {
    const saved = localStorage.getItem(keyFor(userId));
    if (saved) return saved;
    const legacy = localStorage.getItem(LEGACY_KEY);
    if (legacy) {
      localStorage.setItem(keyFor(userId), legacy);
      localStorage.removeItem(LEGACY_KEY);
      return legacy;
    }
  } catch (_) {
    // Storage unavailable — fall back to the default
  }
  return DEFAULT_THEME;
}

export function ThemeProvider({ children }) {
  const { user } = useAuth();
  const userId = user?.id ?? null;
  const [theme, setThemeState] = useState(() => readSavedTheme(userId));

  // Re-read whenever the signed-in user changes (sign in, sign out, switch user)
  useLayoutEffect(() => {
    setThemeState(readSavedTheme(userId));
  }, [userId]);

  // Apply theme before paint so a reload never flashes a different colour
  useLayoutEffect(() => {
    applyTheme(theme);
  }, [theme]);

  const setTheme = (id) => {
    applyTheme(id);
    if (userId) {
      try { localStorage.setItem(keyFor(userId), id); } catch (_) { /* not persisted */ }
    }
    setThemeState(id);
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme, themes: THEMES }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}