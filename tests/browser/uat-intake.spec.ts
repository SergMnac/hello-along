import { expect,test } from '@playwright/test';

const pages=[
  ['home','/'],['how','/how-it-works'],['business','/business'],['about','/about'],
  ['support','/support'],['archive','/story/21-days-to-life'],['safety','/safety'],
  ['legal','/legal'],['404','/uat-missing-page'],
] as const;

test('Owner walkthrough navigation and browser history remain operational',async({page})=>{
  await page.goto('/');
  await page.getByRole('navigation',{name:'Primary'}).getByRole('link',{name:'Как это работает'}).click();
  await expect(page).toHaveURL(/\/how-it-works$/);
  await page.goto('/how-it-works#evening-walk');await expect(page.locator('#evening-walk')).toBeFocused();
  await page.goto('/business');await expect(page.getByRole('link',{name:'Обсудить партнёрство ↗'})).toHaveAttribute('href',/^mailto:support@hello-along.com/);
  await page.goto('/story/21-days-to-life');await page.getByRole('link',{name:/Hello, Along/}).click();await expect(page).toHaveURL(/\/discover\/hello$/);await page.goBack();await expect(page).toHaveURL(/\/story\/21-days-to-life$/);
  await page.goto('/en/about?uat=1');await page.getByRole('link',{name:'ES',exact:true}).first().click();await expect(page).toHaveURL(/\/es\/about\?uat=1$/);await page.reload();await expect(page.getByRole('heading',{level:1,name:'Más espacio para la vida alrededor.'})).toBeVisible();
  await page.goto('/uat-missing-page');await expect(page.getByRole('heading',{name:'404'})).toBeVisible();
});

for(const [name,route] of pages)for(const width of [320,390,768,1440])test(`${name} baseline ${width}`,async({page})=>{
  await page.setViewportSize({width,height:width<700?844:900});await page.goto(route);await expect(page.locator('main')).toBeVisible();expect(await page.evaluate(()=>document.documentElement.scrollWidth<=document.documentElement.clientWidth),route).toBe(true);await page.screenshot({path:`artifacts/web-uat-001/baseline/${name}-${width}.png`,fullPage:true});
});

for(const [locale,prefix] of [['ru',''],['en','/en'],['es','/es']] as const)for(const width of [390,1440])test(`archive reader ${locale} ${width}`,async({page})=>{
  await page.setViewportSize({width,height:width===390?844:900});await page.goto(`${prefix}/discover/hello`);await expect(page.locator('h1')).toBeVisible();await page.screenshot({path:`artifacts/web-uat-001/baseline/reader-${locale}-${width}.png`,fullPage:true});
});
