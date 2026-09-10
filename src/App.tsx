import { useEffect, useMemo } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import UnderConstructionPage from './UnderConstructionPage';

const localeMap: Record<string, 'en' | 'es' | 'ru'> = {
  en: 'en',
  es: 'es',
  ru: 'ru',
};

const detectPreferredLocale = () => {
  if (typeof window === 'undefined') return 'en';
  const stored = localStorage.getItem('along-language');
  if (stored && localeMap[stored]) return stored as 'en' | 'es' | 'ru';

  const nav = navigator.language || navigator.userLanguage || 'en';
  const lower = nav.toLowerCase();
  if (lower.startsWith('es')) return 'es';
  if (lower.startsWith('ru')) return 'ru';
  return 'en';
};

function App() {
  const location = useLocation();
  const currentLocale = useMemo<'en' | 'es' | 'ru'>(() => {
    const path = location.pathname.replace(/^\//, '');
    if (path === '') return 'en';
    if (path === 'en') return 'en';
    if (path === 'es') return 'es';
    if (path === 'ru') return 'ru';
    return detectPreferredLocale();
  }, [location.pathname]);

  useEffect(() => {
    document.documentElement.lang = currentLocale;
  }, [currentLocale]);

  return (
    <Routes>
      <Route path="/" element={<UnderConstructionPage locale={currentLocale} />} />
      <Route path="/:lang" element={<UnderConstructionPage locale={currentLocale} />} />
    </Routes>
  );
}

export default App;
