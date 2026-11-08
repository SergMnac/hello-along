import React from 'react';
import { fireEvent,render,screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe,expect,it } from 'vitest';
import App from '../App';
import campaignData from '../campaign/campaign-data.json';
import { canonicalFor } from '../site/seo';
import { parseSiteLocation,switchLocale } from '../site/routing';

describe('Along.Web registry',()=>{
  it('resolves the eight page families and a truthful 404',()=>{
    ['/','/how-it-works','/business','/about','/story/21-days-to-life','/safety','/support','/legal'].forEach(path=>expect(parseSiteLocation(path).notFound).toBe(false));
    expect(parseSiteLocation('/missing').notFound).toBe(true);
  });
  it('preserves all 28 historic URL variants and 21 original notes',()=>{
    expect(Object.values(campaignData.notes).flat()).toHaveLength(21);
    const paths=campaignData.slugs.flatMap(slug=>[`/discover/${slug}`,...['ru','en','es'].map(locale=>`/${locale}/discover/${slug}`)]);
    expect(paths).toHaveLength(28);paths.forEach(path=>expect(parseSiteLocation(path)).toMatchObject({notFound:false,route:{id:'archive'}}));
  });
  it('preserves query and supported anchors during locale switches',()=>expect(switchLocale({search:'?from=test',hash:'#evening-walk'},'en','/how-it-works')).toContain('?from=test#evening-walk'));
  it('uses cross-market content authority and legal jurisdiction',()=>{expect(canonicalFor(parseSiteLocation('/en/about'))).toBe('https://hello-along.com/about');expect(canonicalFor(parseSiteLocation('/legal'))).toContain('/legal')});
});
describe('accessible shell',()=>{
  it('opens the mobile menu, closes with Escape, and renders RU first',()=>{render(<MemoryRouter initialEntries={['/']}><App/></MemoryRouter>);expect(screen.getByRole('heading',{name:'Больше места для жизни.'})).toBeTruthy();const button=screen.getByRole('button',{name:'Меню'});fireEvent.click(button);expect(screen.getByRole('dialog')).toBeTruthy();fireEvent.keyDown(window,{key:'Escape'});expect(screen.queryByRole('dialog')).toBeNull()});
});
