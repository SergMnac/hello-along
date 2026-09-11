import React from 'react';
import { describe, expect, it } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App, { getRouteContext } from '../App';
import UnderConstructionPage from '../UnderConstructionPage';
import { CAMPAIGN_PAYLOAD } from '../campaign/generatedCampaign';
import { getUnlockedStage } from '../campaign/schedule';

describe('campaign schedule', () => {
  it('unlocks the fixed UTC stages', () => {
    expect(getUnlockedStage(new Date('2026-09-10T00:00:00Z')).id).toBe('t-21');
    expect(getUnlockedStage(new Date('2026-09-13T00:00:00Z')).id).toBe('t-18');
    expect(getUnlockedStage(new Date('2026-10-01T00:00:00Z')).id).toBe('t-0');
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

  it('renders the localized app shell', () => {
    render(
      <MemoryRouter initialEntries={['/en']}>
        <App />
      </MemoryRouter>,
    );
    expect(screen.getByText('Every city has stories waiting to happen.')).toBeTruthy();
    expect(screen.getByAltText('Along')).toHaveAttribute('src', '/logo/along-logo-dark.svg');
  });
});

describe('campaign notes', () => {
  it('ships only currently unlocked notes in the default public payload', () => {
    expect(CAMPAIGN_PAYLOAD.stage.id).toBe('t-21');
    expect(CAMPAIGN_PAYLOAD.copy.notes.en).toHaveLength(1);
    expect(CAMPAIGN_PAYLOAD.copy.launch).toBeUndefined();
  });

  it('opens and closes a note dialog with keyboard support', () => {
    render(<UnderConstructionPage locale="en" />);
    const trigger = screen.getByRole('button', { name: /Hello, Along/i });
    fireEvent.keyDown(trigger, { key: 'Enter' });
    expect(screen.getByRole('dialog')).toBeTruthy();
    fireEvent.keyDown(window, { key: 'Escape' });
    expect(screen.queryByRole('dialog')).toBeNull();
  });
});
