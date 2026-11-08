import React from 'react';
import { render,screen,waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe,expect,it } from 'vitest';
import App from '../App';
import { legalMarketSlots } from '../site/legalContent';

describe('approval-gated safety and legal pages',()=>{
  it('renders Safety as unapproved guidance slots with real internal navigation',async()=>{
    render(<MemoryRouter initialEntries={['/safety']}><App/></MemoryRouter>);
    expect(screen.getByRole('heading',{level:1,name:'Безопасность'})).toBeTruthy();
    expect(screen.getAllByText('НЕ СОГЛАСОВАНО / НЕАКТИВНЫЙ ТЕКСТОВЫЙ БЛОК')).toHaveLength(3);
    expect(screen.getByRole('link',{name:'Перейти в поддержку →'})).toHaveAttribute('href','/support');
    expect(screen.getByRole('link',{name:'Правовая информация →'})).toHaveAttribute('href','/legal');
    await waitFor(()=>expect(document.querySelector('meta[name="robots"]')).toHaveAttribute('content','noindex,follow'));
  });

  it('keeps .com and .ru legal slots separate and non-interactive',async()=>{
    render(<MemoryRouter initialEntries={['/legal']}><App/></MemoryRouter>);
    expect(legalMarketSlots.com).not.toBe(legalMarketSlots.ru);
    expect(legalMarketSlots.com.every(slot=>slot.market==='com'&&!slot.approved&&slot.href===null)).toBe(true);
    expect(legalMarketSlots.ru.every(slot=>slot.market==='ru'&&!slot.approved&&slot.href===null)).toBe(true);
    expect(document.querySelectorAll('[data-market="com"]')).toHaveLength(3);
    expect(document.querySelectorAll('[data-market="ru"]')).toHaveLength(3);
    expect(screen.queryByRole('link',{name:/Оператор|Условия использования|Конфиденциальность/})).toBeNull();
    expect(document.body.textContent).not.toMatch(/1243600011324|3665827614|ООО «Элонг РУС»/);
    await waitFor(()=>expect(document.querySelector('meta[name="robots"]')).toHaveAttribute('content','noindex,follow'));
  });

  it('does not cross-fill RU legal content into the international locale',()=>{
    render(<MemoryRouter initialEntries={['/en/legal']}><App/></MemoryRouter>);
    expect(screen.getByRole('heading',{name:'Legal'})).toBeTruthy();
    expect(screen.queryByText('Условия использования .ru')).toBeNull();
    expect(document.body.textContent).not.toMatch(/ООО|ОГРН|ИНН/);
  });
});
