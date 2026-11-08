import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import App from '../App';

describe('RU How It Works', () => {
  it('renders the approved four-step narrative with canonical terminology', () => {
    render(<MemoryRouter initialEntries={['/how-it-works']}><App /></MemoryRouter>);
    expect(screen.getByRole('heading', { level: 1, name: 'Хорошая компания начинается с плана.' })).toBeTruthy();
    expect(screen.getAllByRole('article')).toHaveLength(6);
    expect(screen.getByRole('heading', { name: 'Кто-то создаёт Искру.' })).toBeTruthy();
    expect(document.body.textContent).not.toMatch(/спарк/i);
  });

  it('keeps availability truthful and all actions on existing internal routes', () => {
    render(<MemoryRouter initialEntries={['/how-it-works#availability']}><App /></MemoryRouter>);
    expect(screen.getByRole('heading', { name: 'Публичная установка пока недоступна' })).toBeTruthy();
    expect(screen.getByText(/Подтверждённых ссылок на установку пока нет/)).toBeTruthy();
    expect(screen.getByRole('link', { name: 'Написать в поддержку →' })).toHaveAttribute('href', '/support');
    expect(screen.getByRole('link', { name: 'На главную' })).toHaveAttribute('href', '/');
    expect(document.body.textContent).not.toMatch(/App Store|Google Play|дата выпуска:/i);
  });

  it('keeps non-RU routes as honest translation skeletons', () => {
    render(<MemoryRouter initialEntries={['/en/how-it-works']}><App /></MemoryRouter>);
    expect(screen.getByRole('heading', { name: 'How Along works' })).toBeTruthy();
    expect(screen.queryByRole('heading', { name: /Good company/i })).toBeNull();
  });
});
