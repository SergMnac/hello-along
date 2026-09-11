import { useEffect, useMemo } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import UnderConstructionPage from './UnderConstructionPage';
import { isRevealSlug } from './campaign/reveals';
import type { Locale } from './campaign/types';

const locales: Locale[] = ['en', 'es', 'ru'];

const isLocale = (value: string): value is Locale => locales.includes(value as Locale);

const detectPreferredLocale = (): Locale => {
  if (typeof window === 'undefined') return 'en';
  try {
    const stored = localStorage.getItem('along-language');
    if (stored && isLocale(stored)) return stored;
  } catch {
    // Storage can be unavailable in isolated test or privacy contexts.
  }
  const language = navigator.language.toLowerCase();
  if (language.startsWith('es')) return 'es';
  if (language.startsWith('ru')) return 'ru';
  return 'en';
};

export interface RouteContext {
  locale: Locale;
  revealSlug?: string;
  notFound: boolean;
}

export const getRouteContext = (pathname: string): RouteContext => {
  const parts = pathname.split('/').filter(Boolean);
  let locale = detectPreferredLocale();
  let cursor = 0;

  if (parts[0] && isLocale(parts[0])) {
    locale = parts[0];
    cursor = 1;
  }

  if (parts.length === cursor) return { locale, notFound: false };

  if (parts[cursor] === 'discover') {
    const slug = parts[cursor + 1];
    const clean = parts.length === cursor + 2 && slug && isRevealSlug(slug);
    return { locale, revealSlug: clean ? slug : undefined, notFound: !clean };
  }

  return { locale, notFound: true };
};

function App() {
  const location = useLocation();
  const route = useMemo(() => getRouteContext(location.pathname), [location.pathname]);

  useEffect(() => {
    document.documentElement.lang = route.locale;
    try {
      localStorage.setItem('along-language', route.locale);
    } catch {
      // Ignore unavailable storage; route locale remains authoritative.
    }
  }, [route.locale]);

  return (
    <Routes>
      <Route
        path="*"
        element={
          <UnderConstructionPage
            locale={route.locale}
            revealSlug={route.revealSlug}
            notFound={route.notFound}
            pathname={location.pathname}
          />
        }
      />
    </Routes>
  );
}

export default App;
