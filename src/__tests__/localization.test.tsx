import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import { LocalizedPage, localizedPages, translationReview } from '../site/localizedPages';
import { marketConfig } from '../site/config';
import { alternatesFor, canonicalFor } from '../site/seo';

const pageIds=['home','how','business','about','support','safety','legal'] as const;
describe('locale and market boundaries',()=>{
  it('has complete engineering dictionaries without empty required content',()=>{for(const locale of ['en','es'] as const)for(const id of pageIds){const p=localizedPages[locale][id];expect(p.title).toBeTruthy();expect(p.lead).toBeTruthy();expect(p.sections.length).toBeGreaterThan(0);expect(p.sections.every(s=>s.body.every(Boolean))).toBe(true);}expect(translationReview.en).toBe('engineering-unreviewed');});
  it('renders implemented families in EN and ES instead of skeletons',()=>{render(<MemoryRouter><LocalizedPage locale="en" pageId="home"/></MemoryRouter>);expect(screen.getByRole('heading',{level:1,name:'More room for life.'})).toBeInTheDocument();render(<MemoryRouter><LocalizedPage locale="es" pageId="how"/></MemoryRouter>);expect(screen.getByRole('heading',{level:1,name:'Una buena compañía empieza con un plan.'})).toBeInTheDocument();});
  it('keeps unavailable market values independent',()=>{expect(marketConfig.com.stores).toEqual({apple:null,google:null});expect(marketConfig.ru.stores).toEqual({apple:null,google:null});expect(marketConfig.com.operator).toBeNull();expect(marketConfig.ru.operator).toBeNull();});
  it('uses authoritative shared canonicals and same-market legal canonicals',()=>{const shared={locale:'ru',route:{id:'about',path:'/about'},notFound:false} as const;expect(canonicalFor(shared)).toBe('https://hello-along.ru/about');const legal={locale:'en',route:{id:'legal',path:'/legal'},notFound:false} as const;expect(canonicalFor(legal)).toContain('/legal');expect(alternatesFor(legal).every(x=>x.href.includes('/legal'))).toBe(true);});
});
