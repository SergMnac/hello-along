import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import App from '../App';

const partnershipHref = `mailto:support@hello-along.com?subject=${encodeURIComponent('Партнёрство с Along')}`;
const supportHref = `mailto:support@hello-along.com?subject=${encodeURIComponent('Поддержка Along')}`;

describe('RU editorial pages', () => {
  it('renders Business with a real partnership contact and no commercial claims', () => {
    render(<MemoryRouter initialEntries={['/business']}><App /></MemoryRouter>);
    expect(screen.getByRole('heading', { level: 1, name: 'Часть повседневной жизни города.' })).toBeTruthy();
    expect(screen.getAllByRole('link', { name: /партнёрство|почту/i })[0]).toHaveAttribute('href', partnershipHref);
    expect(screen.getByText(/Здесь нет оплаты, подписки или кабинета бизнеса/)).toBeTruthy();
    expect(document.body.textContent).not.toMatch(/тариф|рекламный кабинет|гарантируем охват/i);
  });

  it('renders About with canonical terminology and the preserved archive route', () => {
    render(<MemoryRouter initialEntries={['/about']}><App /></MemoryRouter>);
    expect(screen.getByRole('heading', { level: 1, name: 'Больше места для жизни вокруг.' })).toBeTruthy();
    expect(screen.getByText(/Люди создают Искры/)).toBeTruthy();
    expect(screen.getByRole('link', { name: 'Читать архив 21 Days to Life →' })).toHaveAttribute('href', '/story/21-days-to-life');
    expect(document.body.textContent).not.toMatch(/спарк/i);
  });

  it('renders Support with visible contact, truthful mailto and real internal links', () => {
    render(<MemoryRouter initialEntries={['/support']}><App /></MemoryRouter>);
    expect(screen.getByRole('heading', { level: 1, name: 'Поддержка' })).toBeTruthy();
    expect(screen.getByRole('link', { name: 'Открыть почту ↗' })).toHaveAttribute('href', supportHref);
    expect(screen.getByRole('link', { name: 'support@hello-along.com' })).toHaveAttribute('href', 'mailto:support@hello-along.com');
    expect(screen.getByRole('link', { name: 'Проверить доступность →' })).toHaveAttribute('href', '/how-it-works#availability');
    expect(screen.getByText(/не отправляет письмо и не подтверждает доставку/)).toBeTruthy();
    expect(screen.queryByRole('form')).toBeNull();
  });

  it('keeps EN editorial bodies as honest localization skeletons', () => {
    render(<MemoryRouter initialEntries={['/en/business']}><App /></MemoryRouter>);
    expect(screen.getByRole('heading', { name: 'Along for city places' })).toBeTruthy();
    expect(screen.queryByText(/Everyday city life/)).toBeNull();
  });
});
