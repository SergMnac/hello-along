import { expect, test } from '@playwright/test';

test('desktop route and locale navigation works', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { name: 'Больше места для жизни.' })).toBeVisible();
  await page.getByRole('navigation', { name: 'Primary' }).getByRole('link', { name: 'Как это работает' }).click();
  await expect(page).toHaveURL(/\/how-it-works$/);
  await page.goto('/how-it-works?from=browser#evening-walk');
  await expect(page.locator('#evening-walk')).toBeFocused();
  await page.getByRole('link', { name: 'EN', exact: true }).first().click();
  await expect(page).toHaveURL(/\/en\/how-it-works\?from=browser#evening-walk$/);
  await expect(page.getByRole('heading', { name: 'How Along works' })).toBeVisible();
});

test('RU Home actions navigate and direct refresh preserves the destination', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('link', { name: 'Как это работает →' }).click();
  await expect(page).toHaveURL(/\/how-it-works$/);
  await page.reload();
  await expect(page.getByRole('heading', { name: 'Хорошая компания начинается с плана.' })).toBeVisible();
  await page.goto('/');
  await page.getByRole('link', { name: 'Для бизнеса →' }).click();
  await expect(page).toHaveURL(/\/business$/);
});

test('How It Works anchors, history and truthful availability work', async ({ page }) => {
  await page.goto('/how-it-works');
  await page.getByRole('link', { name: 'Пример вечерней прогулки ↓' }).click();
  await expect(page).toHaveURL(/\/how-it-works#evening-walk$/);
  await expect(page.locator('#evening-walk')).toBeFocused();
  await page.getByRole('link', { name: 'Проверить доступность ↓' }).click();
  await expect(page).toHaveURL(/\/how-it-works#availability$/);
  await expect(page.locator('#availability')).toBeFocused();
  await expect(page.getByRole('heading', { name: 'Публичная установка пока недоступна' })).toBeVisible();
  await page.goBack();
  await expect(page.locator('#evening-walk')).toBeFocused();
  await page.reload();
  await expect(page.locator('#evening-walk')).toBeFocused();
});

test('Business, About and Support routes use real navigation and contacts', async ({ page }) => {
  const partnership = `mailto:support@hello-along.com?subject=${encodeURIComponent('Партнёрство с Along')}`;
  const support = `mailto:support@hello-along.com?subject=${encodeURIComponent('Поддержка Along')}`;
  await page.goto('/business');
  await expect(page.getByRole('heading', { name: 'Часть повседневной жизни города.' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Обсудить партнёрство ↗' })).toHaveAttribute('href', partnership);
  await page.getByRole('navigation', { name: 'Primary' }).getByRole('link', { name: 'О нас' }).click();
  await expect(page).toHaveURL(/\/about$/);
  await expect(page.getByRole('heading', { name: 'Больше места для жизни вокруг.' })).toBeVisible();
  await page.goBack();
  await expect(page).toHaveURL(/\/business$/);
  await page.goto('/support');
  const supportAction = page.getByRole('link', { name: 'Открыть почту ↗' });
  await expect(supportAction).toHaveAttribute('href', support);
  await supportAction.focus();
  await expect(supportAction).toBeFocused();
  await page.reload();
  await expect(page.getByRole('heading', { name: 'Поддержка' })).toBeVisible();
});

test('mobile menu traps keyboard focus, closes with Escape and returns focus', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  const trigger = page.getByRole('button', { name: 'Меню' });
  await trigger.focus(); await page.keyboard.press('Enter');
  await expect(page.getByRole('dialog')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Закрыть' })).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(page.getByRole('dialog')).toBeHidden();
  await expect(trigger).toBeFocused();
});

test('archive reading, keyboard navigation and browser history work', async ({ page }) => {
  await page.goto('/story/21-days-to-life');
  const firstNote=page.getByRole('link',{name:/Hello, Along/});
  await firstNote.focus(); await page.keyboard.press('Enter');
  await expect(page).toHaveURL(/\/discover\/hello$/);
  await expect(page.getByRole('heading',{level:1,name:'Hello, Along.'})).toBeVisible();
  await page.reload();
  await expect(page.getByText('Мы создаём Along не для того, чтобы ты проводил больше времени в телефоне.')).toBeVisible();
  await page.getByRole('link',{name:'Закрыть / Вернуться в архив'}).first().click();
  await expect(page).toHaveURL(/\/story\/21-days-to-life$/);
  await page.goBack();
  await expect(page).toHaveURL(/\/discover\/hello$/);
});

test('all archive locales, trailing slash and missing slug resolve correctly', async ({ page }) => {
  for (const [path,title] of [['/discover/city/','Город уже живёт.'],['/en/discover/city','The city is already alive.'],['/es/discover/city','La ciudad ya está viva.']]) {
    await page.goto(path); await expect(page.getByRole('heading',{level:1,name:title})).toBeVisible();
  }
  await page.goto('/discover/not-a-note');
  await expect(page.getByRole('heading',{name:'404'})).toBeVisible();
});

test('Safety and Legal navigation, refresh, history and keyboard focus work',async({page})=>{
  await page.goto('/safety');
  await expect(page.getByRole('heading',{level:1,name:'Безопасность'})).toBeVisible();
  const legalLink=page.getByRole('link',{name:'Правовая информация →'});
  await legalLink.focus(); await expect(legalLink).toBeFocused(); await page.keyboard.press('Enter');
  await expect(page).toHaveURL(/\/legal$/);
  await expect(page.getByRole('heading',{level:1,name:'Правовая информация'})).toBeVisible();
  await expect(page.locator('[data-market="com"]')).toHaveCount(3);
  await expect(page.locator('[data-market="ru"]')).toHaveCount(3);
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content','noindex,follow');
  await page.reload(); await expect(page.getByText('Условия использования .ru')).toBeVisible();
  await page.goBack(); await expect(page).toHaveURL(/\/safety$/);
});

for(const route of ['safety','legal']){
  for(const width of [320,390,768,1440]){
    test(`WEB-ENG-006 ${route} visual evidence ${width}px`,async({page})=>{
      await page.setViewportSize({width,height:width<700?844:900}); await page.goto(`/${route}`);
      await expect(page.locator('main')).toBeVisible();
      expect(await page.evaluate(()=>document.documentElement.scrollWidth<=document.documentElement.clientWidth)).toBe(true);
      await page.screenshot({path:`artifacts/web-eng-006/screenshots/${route}-${width}.png`,fullPage:true});
    });
  }
}

for (const width of [320,390,768,1440]) {
  test(`archive visual evidence ${width}px`,async({page})=>{
    await page.setViewportSize({width,height:width<700?844:900});
    await page.goto('/story/21-days-to-life');
    expect(await page.evaluate(()=>document.documentElement.scrollWidth<=document.documentElement.clientWidth)).toBe(true);
    await page.screenshot({path:`artifacts/web-eng-005/screenshots/archive-${width}.png`,fullPage:true});
    await page.goto('/discover/hello');
    expect(await page.evaluate(()=>document.documentElement.scrollWidth<=document.documentElement.clientWidth)).toBe(true);
    await page.screenshot({path:`artifacts/web-eng-005/screenshots/reader-${width}.png`,fullPage:true});
  });
}

for (const width of [320, 390, 768, 1440]) {
  test(`visual evidence ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: width < 700 ? 844 : 900 });
    await page.goto('/');
    await expect(page.locator('main')).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth)).toBe(true);
    await page.screenshot({ path: `artifacts/web-eng-002/screenshots/home-${width}.png`, fullPage: true });
  });
}

for (const route of ['business', 'about', 'support']) {
  for (const width of [320, 390, 768, 1440]) {
    test(`${route} visual evidence ${width}px`, async ({ page }) => {
      await page.setViewportSize({ width, height: width < 700 ? 844 : 900 });
      await page.goto(`/${route}`);
      await expect(page.locator('main')).toBeVisible();
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth)).toBe(true);
      await page.screenshot({ path: `artifacts/web-eng-004/screenshots/${route}-${width}.png`, fullPage: true });
    });
  }
}

for (const width of [320, 390, 768, 1440]) {
  test(`How It Works visual evidence ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: width < 700 ? 844 : 900 });
    await page.goto('/how-it-works');
    await expect(page.getByRole('heading', { name: 'Хорошая компания начинается с плана.' })).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth)).toBe(true);
    await page.screenshot({ path: `artifacts/web-eng-003/screenshots/how-${width}.png`, fullPage: true });
  });
}
