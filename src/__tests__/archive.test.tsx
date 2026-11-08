import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import App from '../App';
import campaignData from '../campaign/campaign-data.json';

function payloadChecksum(value: unknown) {
  const input=JSON.stringify(value); let hash=2166136261;
  for(let index=0;index<input.length;index+=1){const code=input.charCodeAt(index);hash^=code&255;hash=Math.imul(hash,16777619);hash^=code>>>8;hash=Math.imul(hash,16777619);}
  return (hash>>>0).toString(16).padStart(8,'0');
}

describe('21 Days to Life archive',()=>{
  it('locks the canonical 21-note payload with an exact checksum',()=>{
    expect(Object.values(campaignData.notes).flat()).toHaveLength(21);
    expect(payloadChecksum(campaignData)).toBe('d25d6ab7');
  });

  it('renders all seven RU originals and opens a permanent reader route',()=>{
    render(<MemoryRouter initialEntries={['/story/21-days-to-life']}><App/></MemoryRouter>);
    expect(screen.getByRole('heading',{name:'21 Days to Life'})).toBeTruthy();
    expect(screen.getAllByText('Историческая заметка · оригинальный текст')).toHaveLength(7);
    const first=screen.getByRole('link',{name:/Hello, Along/});
    expect(first).toHaveAttribute('href','/discover/hello');
    fireEvent.click(first);
    expect(screen.getByRole('heading',{level:1,name:campaignData.notes.ru[0].title})).toBeTruthy();
    expect(screen.getByText(campaignData.notes.ru[0].body[0])).toBeTruthy();
    fireEvent.click(screen.getAllByRole('link',{name:'Закрыть / Вернуться в архив'})[0]);
    expect(screen.getByRole('heading',{name:'Сохраняем начало. Целиком.'})).toBeTruthy();
  });

  it('renders the exact EN and ES originals on direct reader entries',()=>{
    const english=render(<MemoryRouter initialEntries={['/en/discover/city']}><App/></MemoryRouter>);
    expect(screen.getByRole('heading',{level:1,name:campaignData.notes.en[2].title})).toBeTruthy();
    expect(screen.getByText(campaignData.notes.en[2].body[0])).toBeTruthy(); english.unmount();
    render(<MemoryRouter initialEntries={['/es/discover/city']}><App/></MemoryRouter>);
    expect(screen.getByRole('heading',{level:1,name:campaignData.notes.es[2].title})).toBeTruthy();
    expect(screen.getByText(campaignData.notes.es[2].body[0])).toBeTruthy();
  });
});
