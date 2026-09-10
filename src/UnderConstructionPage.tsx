import { useEffect, useMemo } from 'react';

const copy = {
  en: {
    title: 'Every city has stories waiting to happen.',
    subtitle: 'Creating something beautiful takes time.',
    email: 'hello@hello-along.com',
    langLabel: 'EN · ES · RU',
  },
  es: {
    title: 'Cada ciudad tiene historias esperando suceder.',
    subtitle: 'Crear algo hermoso lleva tiempo.',
    email: 'hello@hello-along.com',
    langLabel: 'EN · ES · RU',
  },
  ru: {
    title: 'В каждом городе есть истории, которым ещё предстоит случиться.',
    subtitle: 'Чтобы создать что-то красивое, нужно время.',
    email: 'hello@hello-along.com',
    langLabel: 'EN · ES · RU',
  },
};

const localeTitles: Record<'en' | 'es' | 'ru', string> = {
  en: 'Along — Under Construction',
  es: 'Along — En Construcción',
  ru: 'Along — В разработке',
};

const localeDescriptions: Record<'en' | 'es' | 'ru', string> = {
  en: 'Along is under construction. Creating something beautiful takes time.',
  es: 'Along está en construcción. Crear algo hermoso lleva tiempo.',
  ru: 'Along находится в разработке. Чтобы создать что-то красивое, нужно время.',
};

interface Props {
  locale: 'en' | 'es' | 'ru';
}

const langs: Array<'en' | 'es' | 'ru'> = ['en', 'es', 'ru'];

const UnderConstructionPage = ({ locale }: Props) => {
  const text = copy[locale];

  useEffect(() => {
    document.title = localeTitles[locale];
    const description = document.querySelector('meta[name=description]');
    if (description) description.setAttribute('content', localeDescriptions[locale]);

    const canonical = document.querySelector('link[rel=canonical]') || document.createElement('link');
    if (!canonical.getAttribute) {
      return;
    }
    canonical.setAttribute('rel', 'canonical');
    canonical.setAttribute('href', locale === 'en' ? '/' : `/${locale}`);
    if (!document.head.contains(canonical)) {
      document.head.appendChild(canonical);
    }

    const ogUrl = document.querySelector('meta[property="og:url"]');
    if (ogUrl) ogUrl.setAttribute('content', locale === 'en' ? '/' : `/${locale}`);
  }, [locale]);

  useEffect(() => {
    localStorage.setItem('along-language', locale);
  }, [locale]);

  const langLinks = useMemo(
    () =>
      langs.map((lang) => ({
        code: lang,
        label: lang.toUpperCase(),
        active: lang === locale,
        href: lang === 'en' ? '/en' : `/${lang}`,
      })),
    [locale],
  );

  return (
    <main className="page-shell" role="main">
      <div className="language-switcher" aria-label="Language selector">
        {langLinks.map((link, index) => (
          <span className="language-item" key={link.code}>
            <a
              href={link.href}
              className={link.active ? 'language-link active' : 'language-link'}
              aria-current={link.active ? 'page' : undefined}
            >
              {link.label}
            </a>
            {index < langLinks.length - 1 ? <span className="language-separator">·</span> : null}
          </span>
        ))}
      </div>
      <div className="page-content">
        <div className="logo-wrapper" aria-label="Along">
          <img src="/logo/along-logo-dark.svg" alt="Along" className="brand-logo" />
        </div>
        <div className="text-block">
          <h1>{text.title}</h1>
          <p>{text.subtitle}</p>
        </div>
        <div className="footer-row">
          <a className="email-link" href={`mailto:${text.email}`}>
            {text.email}
          </a>
          <span className="copyright">© 2025 Along</span>
        </div>
      </div>
    </main>
  );
};

export default UnderConstructionPage;
