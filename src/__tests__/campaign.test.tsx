import React from 'react';
import { describe, expect, it } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App, { getRouteContext } from '../App';
import UnderConstructionPage from '../UnderConstructionPage';
import { CAMPAIGN_PAYLOAD } from '../campaign/generatedCampaign';
import { CAMPAIGN_STAGES, getUnlockedStage } from '../campaign/schedule';
import campaignData from '../campaign/campaign-data.json';

const locales = ['en', 'es', 'ru'] as const;
const removedNote02Ctas = [
  "See what's happening nearby →",
  'Ver qué está pasando cerca →',
  'Посмотреть, что происходит рядом →',
];

describe('campaign schedule', () => {
  it('selects stages one second before, at, and after every UTC boundary', () => {
    CAMPAIGN_STAGES.forEach((stage, index) => {
      const at = Date.parse(stage.unlockAt);
      expect(getUnlockedStage(new Date(at)).id).toBe(stage.id);
      expect(getUnlockedStage(new Date(at + 1000)).id).toBe(stage.id);
      expect(getUnlockedStage(new Date(at - 1000)).id).toBe(index === 0 ? 't-21' : CAMPAIGN_STAGES[index - 1].id);
    });
  });

  it('selects the latest unlocked stage after missed intervals or restart', () => {
    expect(getUnlockedStage(new Date('2026-09-27T12:00:00Z')).id).toBe('t-6');
    expect(getUnlockedStage(new Date('2026-10-12T12:00:00Z')).id).toBe('t-0');
  });
});

describe('campaign content model', () => {
  it('contains all required stages and full localized note sets', () => {
    expect(CAMPAIGN_STAGES).toHaveLength(8);
    locales.forEach((locale) => expect(campaignData.notes[locale]).toHaveLength(7));
  });

  it('keeps T-3 CTA-free and T-0 launch CTA-complete', () => {
    locales.forEach((locale) => {
      expect(campaignData.notes[locale][6].cta).toBeUndefined();
      expect(campaignData.launch[locale].primaryCta).toBeTruthy();
      expect(campaignData.launch[locale].secondaryCta).toBeTruthy();
    });
  });

  it('removes the premature Note 02 CTA without changing later note CTAs', () => {
    locales.forEach((locale) => {
      expect(campaignData.notes[locale][1].cta).toBeUndefined();
      expect(campaignData.notes[locale][2].cta).toBeTruthy();
      expect(campaignData.notes[locale][3].cta).toBeTruthy();
      expect(campaignData.notes[locale][4].cta).toBeTruthy();
      expect(campaignData.notes[locale][5].cta).toBeTruthy();
    });
    removedNote02Ctas.forEach((cta) => {
      expect(JSON.stringify(campaignData.notes)).not.toContain(cta);
    });
  });

  it('ships only T-21 content in the default public payload', () => {
    expect(CAMPAIGN_PAYLOAD.stage.id).toBe('t-21');
    expect(CAMPAIGN_PAYLOAD.copy.notes.en).toHaveLength(1);
    expect(CAMPAIGN_PAYLOAD.copy.launch).toBeUndefined();
  });
});

describe('campaign routing', () => {
  it('recognizes locales and permanent reveal routes', () => {
    expect(getRouteContext('/ru/discover/hello/')).toMatchObject({
      locale: 'ru',
      revealSlug: 'hello',
      notFound: false,
    });
    expect(getRouteContext('/es/discover/future/')).toMatchObject({ locale: 'es', notFound: true });
  });

  it('covers every canonical slug', () => {
    campaignData.slugs.forEach((slug) => {
      expect(getRouteContext(`/discover/${slug}/`)).toMatchObject({ revealSlug: slug, notFound: false });
    });
  });

  it('renders localized shell and updates html lang', () => {
    render(
      <MemoryRouter initialEntries={['/ru']}>
        <App />
      </MemoryRouter>,
    );
    expect(document.documentElement.lang).toBe('ru');
    expect(screen.getByText('У каждого города есть истории, которым ещё предстоит случиться.')).toBeTruthy();
    expect(screen.getByAltText('Along')).toHaveAttribute('src', '/logo/along-logo-dark.svg');
  });
});

describe('note interaction', () => {
  it('opens and closes the T-21 full reading state for every locale', () => {
    locales.forEach((locale) => {
      const { unmount } = render(<UnderConstructionPage locale={locale} />);
      const note = campaignData.notes[locale][0];
      const trigger = screen.getByRole('button', { name: new RegExp(note.title, 'i') });

      fireEvent.click(trigger);
      expect(screen.getByRole('dialog')).toBeTruthy();
      expect(screen.getByText(note.body[0])).toBeTruthy();
      expect(screen.queryByText(/^T-\d+/)).toBeNull();
      fireEvent.click(screen.getByRole('button', { name: campaignData.base[locale].closeLabel }));
      expect(screen.queryByRole('dialog')).toBeNull();

      fireEvent.keyDown(trigger, { key: ' ' });
      expect(screen.getByRole('dialog')).toBeTruthy();
      fireEvent.keyDown(window, { key: 'Escape' });
      expect(screen.queryByRole('dialog')).toBeNull();
      unmount();
    });
  });

  it('opens and closes Note 02 for every locale without the removed CTA', () => {
    const originalNotes = { ...CAMPAIGN_PAYLOAD.copy.notes };

    try {
      locales.forEach((locale) => {
        CAMPAIGN_PAYLOAD.copy.notes[locale] = campaignData.notes[locale].slice(0, 2);
        const note = campaignData.notes[locale][1];
        const { unmount } = render(<UnderConstructionPage locale={locale} />);
        const trigger = screen.getByRole('button', { name: new RegExp(note.title, 'i') });

        fireEvent.click(trigger);
        expect(screen.getByRole('dialog')).toBeTruthy();
        expect(screen.getByText(note.body[0])).toBeTruthy();
        expect(screen.queryByRole('link', { name: removedNote02Ctas[locales.indexOf(locale)] })).toBeNull();
        removedNote02Ctas.forEach((cta) => expect(screen.queryByText(cta)).toBeNull());
        fireEvent.click(screen.getByRole('button', { name: campaignData.base[locale].closeLabel }));
        expect(screen.queryByRole('dialog')).toBeNull();
        unmount();
      });
    } finally {
      CAMPAIGN_PAYLOAD.copy.notes = originalNotes;
    }
  });

  it('opens with keyboard and closes with Escape and outside click', () => {
    render(<UnderConstructionPage locale="en" />);
    const trigger = screen.getByRole('button', { name: /Hello, Along/i });
    expect(screen.queryByText(/^T-\d+/)).toBeNull();
    expect(screen.getByText('21 days.')).toBeTruthy();
    fireEvent.keyDown(trigger, { key: 'Enter' });
    expect(screen.getByRole('dialog')).toBeTruthy();
    expect(screen.queryByText(/^T-\d+/)).toBeNull();
    expect(screen.getByText("We're creating Along not so you spend more time on your phone.")).toBeTruthy();
    fireEvent.keyDown(window, { key: 'Escape' });
    expect(screen.queryByRole('dialog')).toBeNull();

    fireEvent.click(trigger);
    expect(screen.getByRole('dialog')).toBeTruthy();
    fireEvent.mouseDown(screen.getByRole('dialog').parentElement as HTMLElement);
    expect(screen.queryByRole('dialog')).toBeNull();
  });
});
