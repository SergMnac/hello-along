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
