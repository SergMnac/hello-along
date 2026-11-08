import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import App from '../App';

describe('RU Home', () => {
  it('renders the approved narrative with the canonical product term', () => {
    render(<MemoryRouter initialEntries={['/']}><App /></MemoryRouter>);
    expect(screen.getByRole('heading', { level: 1, name: /Больше места/ })).toBeTruthy();
    expect(screen.getByText(/Люди создают Искры/)).toBeTruthy();
    expect(screen.getByRole('heading', { name: 'Чем займёмся?' })).toBeTruthy();
    expect(screen.getByRole('heading', { name: 'От простого плана — к встрече.' })).toBeTruthy();
    expect(document.body.textContent).not.toMatch(/спарк/i);
  });

  it('uses only real internal destinations and discloses concept imagery', () => {
    render(<MemoryRouter initialEntries={['/']}><App /></MemoryRouter>);
    expect(screen.getAllByRole('link', { name: /Как это работает/ })[0]).toHaveAttribute('href', '/how-it-works');
    expect(screen.getByRole('link', { name: 'Для бизнеса →' })).toHaveAttribute('href', '/business');
    expect(screen.getByRole('link', { name: /Читать архив/ })).toHaveAttribute('href', '/story/21-days-to-life');
    expect(screen.getByText(/ПРАВА НЕ ПОДТВЕРЖДЕНЫ/)).toBeTruthy();
    expect(screen.queryByText(/скачать|App Store|Google Play/i)).toBeNull();
  });

  it('keeps non-RU Home honest until the translation work unit', () => {
    render(<MemoryRouter initialEntries={['/en/']}><App /></MemoryRouter>);
    expect(screen.getByRole('heading', { name: 'The city feels closer' })).toBeTruthy();
    expect(screen.queryByRole('heading', { name: /More Life/ })).toBeNull();
  });
});
