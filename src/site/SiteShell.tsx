import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import campaignData from '../campaign/campaign-data.json';
import HomePage from './HomePage';
import HowItWorksPage from './HowItWorksPage';
import type { Locale } from './config';
import { copy } from './copy';
import { localizedPath, switchLocale, type SiteContext } from './routing';
import { primaryRoutes } from './routes';

function Languages({ context, done }: { context: SiteContext; done?: () => void }) {
  return <div className="language-links" aria-label={copy[context.locale].language}>
    {(['ru', 'en', 'es'] as Locale[]).map((locale) => <Link key={locale} lang={locale} aria-current={locale === context.locale ? 'true' : undefined} to={switchLocale(window.location, locale, context.route.path)} onClick={done}>{locale.toUpperCase()}</Link>)}
  </div>;
}

function MobileMenu({ context }: { context: SiteContext }) {
  const [open, setOpen] = useState(false);
  const trigger = useRef<HTMLButtonElement>(null);
  const panel = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!open) return;
    panel.current?.querySelector<HTMLElement>('a,button')?.focus();
    const key = (event: KeyboardEvent) => {
      if (event.key === 'Escape') { setOpen(false); requestAnimationFrame(() => trigger.current?.focus()); }
      if (event.key === 'Tab' && panel.current) {
        const items = [...panel.current.querySelectorAll<HTMLElement>('a,button')];
        const first = items[0]; const last = items.at(-1);
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
        else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
      }
    };
    window.addEventListener('keydown', key);
    return () => window.removeEventListener('keydown', key);
  }, [open]);
  return <>
    <button ref={trigger} className="menu-trigger" type="button" aria-expanded={open} aria-controls="mobile-menu" onClick={() => setOpen(true)}>{copy[context.locale].menu}</button>
    {open && <div className="menu-backdrop"><div ref={panel} id="mobile-menu" className="mobile-menu" role="dialog" aria-modal="true" aria-label={copy[context.locale].menu}>
      <button type="button" className="menu-close" onClick={() => { setOpen(false); trigger.current?.focus(); }}>{copy[context.locale].close}</button>
      <nav>{primaryRoutes.filter((route) => route.nav).map((route) => <Link key={route.id} to={localizedPath(route.path, context.locale)} onClick={() => setOpen(false)}>{copy[context.locale].nav[route.id]}</Link>)}</nav>
      <Languages context={context} done={() => setOpen(false)} />
    </div></div>}
  </>;
}

function SkeletonContent({ context }: { context: SiteContext }) {
  const text = copy[context.locale];
  const key = context.notFound ? 'notFound' : context.route.id;
  let archiveTitle = '';
  if (context.archiveSlug) {
    const index = campaignData.slugs.indexOf(context.archiveSlug);
    archiveTitle = campaignData.notes[context.locale][index]?.title ?? '';
  }
  return <main id="main" className="page-main">
    <p className="eyebrow">Along · {context.locale.toUpperCase()}</p>
    <h1>{context.notFound ? '404' : archiveTitle || text.titles[key]}</h1>
    <p className="lead">{text.descriptions[key]}</p>
    {context.notFound ? <Link className="text-link" to={localizedPath('/', context.locale)}>{text.back}</Link> : <p className="status-line">{context.locale === 'ru' ? 'Страница готовится к следующему этапу реализации.' : context.locale === 'es' ? 'La página se prepara para la siguiente fase.' : 'This page is ready for its next implementation phase.'}</p>}
  </main>;
}

export default function SiteShell({ context }: { context: SiteContext }) {
  const text = copy[context.locale];
  const isRuHome = !context.notFound && context.route.id === 'home' && context.locale === 'ru';
  const isRuHow = !context.notFound && context.route.id === 'how' && context.locale === 'ru';
  return <div className={`site${isRuHome ? ' site-home' : ''}${isRuHow ? ' site-how' : ''}`}>
    <a className="skip-link" href="#main">{context.locale === 'ru' ? 'К содержанию' : context.locale === 'es' ? 'Ir al contenido' : 'Skip to content'}</a>
    <header className="site-header">
      <Link className="brand" to={localizedPath('/', context.locale)} aria-label="Along"><img src="/brand/along-wordmark-dark-primary.svg" alt="Along" /></Link>
      <nav className="desktop-nav" aria-label="Primary">{primaryRoutes.filter((route) => route.nav && route.id !== 'home').map((route) => <Link key={route.id} to={localizedPath(route.path, context.locale)}>{text.nav[route.id]}</Link>)}</nav>
      <div className="desktop-language"><Languages context={context} /></div><MobileMenu context={context} />
    </header>
    {isRuHome ? <HomePage /> : isRuHow ? <HowItWorksPage /> : <SkeletonContent context={context} />}
    <footer className="site-footer">
      <div className="footer-links"><Link to={localizedPath('/', context.locale)}>{text.nav.home}</Link><Link to={localizedPath('/how-it-works', context.locale)}>{text.nav.how}</Link><Link to={localizedPath('/business', context.locale)}>{text.nav.business}</Link><Link to={localizedPath('/about', context.locale)}>{text.nav.about}</Link><Link to={localizedPath('/support', context.locale)}>{text.titles.support}</Link><Link to={localizedPath('/safety', context.locale)}>{text.titles.safety}</Link><Link to={localizedPath('/legal', context.locale)}>{text.titles.legal}</Link></div>
      <p>support@hello-along.com</p>
    </footer>
  </div>;
}
