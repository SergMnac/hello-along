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
