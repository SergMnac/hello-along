import { KeyboardEvent, useEffect, useMemo, useRef, useState } from 'react';
import { emitAnalytics, markRepeatVisit } from './campaign/analytics';
import { CAMPAIGN_PAYLOAD } from './campaign/generatedCampaign';
import { getRevealIndex, REVEAL_SLUGS } from './campaign/reveals';
import { getStageIndex } from './campaign/schedule';
import type { Locale, LocalizedNote } from './campaign/types';

interface Props {
  locale: Locale;
  revealSlug?: string;
  notFound?: boolean;
  pathname?: string;
}

const locales: Locale[] = ['en', 'es', 'ru'];

const languagePath = (locale: Locale, pathname: string) => {
  const parts = pathname.split('/').filter(Boolean);
  if (parts[0] === 'en' || parts[0] === 'es' || parts[0] === 'ru') parts.shift();
  const suffix = parts.length ? `/${parts.join('/')}` : '';
  return locale === 'en' ? suffix || '/en' : `/${locale}${suffix}`;
};

const UnderConstructionPage = ({ locale, revealSlug, notFound = false, pathname = '/' }: Props) => {
  const copy = CAMPAIGN_PAYLOAD.copy;
  const base = copy.base[locale];
  const notes = copy.notes[locale];
  const launch = copy.launch?.[locale];
  const stageIndex = getStageIndex(CAMPAIGN_PAYLOAD.stage.id);
  const requestedRevealIndex = revealSlug ? getRevealIndex(revealSlug as never) : -1;
  const isLaunch = CAMPAIGN_PAYLOAD.stage.id === 't-0' && Boolean(launch);
  const [openIndex, setOpenIndex] = useState<number | null>(
    !notFound && requestedRevealIndex >= 0 && requestedRevealIndex < notes.length ? requestedRevealIndex : null,
  );
  const lastTriggerRef = useRef<HTMLButtonElement | null>(null);
  const closeRef = useRef<HTMLButtonElement | null>(null);
  const activeNote = openIndex === null ? null : notes[openIndex];

  useEffect(() => {
    document.title = 'Along - 21 Days to Life';
    document.querySelector('meta[name=description]')?.setAttribute('content', `${base.atmospheric} ${base.subtitle}`);
    const canonical = document.querySelector('link[rel=canonical]') || document.createElement('link');
    canonical.setAttribute('rel', 'canonical');
    canonical.setAttribute('href', pathname || '/');
    if (!document.head.contains(canonical)) document.head.appendChild(canonical);
  }, [base.atmospheric, base.subtitle, pathname]);

  useEffect(() => {
    emitAnalytics('uc_view', { locale, stage: CAMPAIGN_PAYLOAD.stage.id });
    if (markRepeatVisit()) emitAnalytics('repeat_visit', { locale });
    if (revealSlug && !notFound) emitAnalytics('permanent_reveal_page_view', { locale, reveal: revealSlug });
    if (isLaunch) emitAnalytics('launch_state_view', { locale });
  }, [isLaunch, locale, notFound, revealSlug]);

  useEffect(() => {
    if (activeNote) closeRef.current?.focus();
  }, [activeNote]);

  useEffect(() => {
    if (!activeNote) return undefined;
    const onKeyDown = (event: globalThis.KeyboardEvent) => {
      if (event.key === 'Escape') closeModal();
      if (event.key !== 'Tab') return;
      const dialog = document.querySelector('[role="dialog"]');
      const focusables = Array.from(dialog?.querySelectorAll<HTMLElement>('button, a, [tabindex]:not([tabindex="-1"])') ?? []);
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [activeNote]);

  const openModal = (note: LocalizedNote, index: number, trigger: HTMLButtonElement) => {
    lastTriggerRef.current = trigger;
    setOpenIndex(index);
    emitAnalytics(index === notes.length - 1 ? 'current_reveal_view' : 'resting_note_open', {
      locale,
      index: index + 1,
      title: note.title,
    });
  };

  const closeModal = () => {
    setOpenIndex(null);
    window.setTimeout(() => lastTriggerRef.current?.focus(), 0);
  };

  const onCardKeyDown = (event: KeyboardEvent<HTMLButtonElement>, note: LocalizedNote, index: number) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      openModal(note, index, event.currentTarget);
    }
  };

  const langLinks = useMemo(
    () => locales.map((code) => ({ code, label: code.toUpperCase(), href: languagePath(code, pathname), active: code === locale })),
    [locale, pathname],
  );

  return (
    <main className="page-shell" role="main">
      <nav className="language-switcher" aria-label={base.languageLabel}>
        {langLinks.map((link, index) => (
          <span className="language-item" key={link.code}>
            <a className={link.active ? 'language-link active' : 'language-link'} href={link.href} aria-current={link.active ? 'page' : undefined}>
              {link.label}
            </a>
            {index < langLinks.length - 1 ? <span className="language-separator">.</span> : null}
          </span>
        ))}
      </nav>

      <section className="intro-panel">
        <img src="/logo/along-logo-dark.svg" alt="Along" className="brand-logo" />
        <p className="campaign-kicker">{base.campaignLabel}</p>
        <h1>{isLaunch && launch ? launch.title : base.atmospheric}</h1>
        <p>{isLaunch && launch ? launch.body : base.subtitle}</p>
      </section>

      {notFound || (revealSlug && requestedRevealIndex >= notes.length) ? (
        <section className="status-panel" aria-live="polite">
          <p className="status-eyebrow">{CAMPAIGN_PAYLOAD.stage.label}</p>
          <h2>{base.notFoundTitle}</h2>
          <p>{base.notFoundBody}</p>
        </section>
      ) : null}

      {isLaunch && launch ? (
        <section className="launch-panel" aria-label={launch.kicker}>
          <p>{launch.kicker}</p>
          <a href="mailto:hello@hello-along.com" onClick={() => emitAnalytics('launch_primary_cta', { locale })}>
            {launch.primaryCta}
          </a>
          <button type="button" onClick={() => emitAnalytics('launch_secondary_cta', { locale })}>
            {launch.secondaryCta}
          </button>
        </section>
      ) : null}

      <section className="campaign-wall" aria-label={base.noteListLabel}>
        <div className="stage-rail" aria-hidden="true">
          {CAMPAIGN_PAYLOAD.stages.map((stage, index) => (
            <span className={index <= stageIndex ? 'stage-dot unlocked' : 'stage-dot'} key={stage.id} />
          ))}
        </div>
        {notes.map((note, index) => (
          <button
            type="button"
            className="note-card"
            key={note.title}
            onClick={(event) => openModal(note, index, event.currentTarget)}
            onKeyDown={(event) => onCardKeyDown(event, note, index)}
          >
            <span className="note-index">{String(index + 1).padStart(2, '0')}</span>
            <span className="note-title">{note.title}</span>
            {note.accent ? <span className="note-accent">{note.accent}</span> : null}
            <span className="note-tap">{note.tapLabel}</span>
          </button>
        ))}
      </section>

      <footer className="footer-row">
        <a className="email-link" href={`mailto:${base.email}`}>{base.email}</a>
        <span className="copyright">{base.copyright}</span>
      </footer>

      {activeNote ? (
        <div className="modal-backdrop" onMouseDown={closeModal}>
          <article className="note-modal" role="dialog" aria-modal="true" aria-labelledby="note-modal-title" onMouseDown={(event) => event.stopPropagation()}>
            <button ref={closeRef} type="button" className="modal-close" onClick={closeModal} aria-label={base.closeLabel}>
              x
            </button>
            <p className="modal-eyebrow">{CAMPAIGN_PAYLOAD.stage.label}</p>
            <h2 id="note-modal-title">{activeNote.title}</h2>
            {activeNote.body.map((line) => (
              <p key={line} className={activeNote.emphasis?.includes(line) ? 'emphasis-line' : undefined}>{line}</p>
            ))}
            {activeNote.returnLine ? <p className="return-line">{activeNote.returnLine}</p> : null}
            {activeNote.cta ? (
              <a
                href={`/discover/${REVEAL_SLUGS[Math.min(openIndex ?? 0, REVEAL_SLUGS.length - 1)]}/`}
                className="modal-cta"
                onClick={() => emitAnalytics('cta_click', { locale, index: (openIndex ?? 0) + 1 })}
              >
                {activeNote.cta}
              </a>
            ) : null}
          </article>
        </div>
      ) : null}
    </main>
  );
};

export default UnderConstructionPage;
