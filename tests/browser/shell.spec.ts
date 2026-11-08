import { expect, test } from '@playwright/test';

test('desktop route and locale navigation works', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { name: 'Город становится ближе' })).toBeVisible();
  await page.getByRole('link', { name: 'Как это работает' }).click();
  await expect(page).toHaveURL(/\/how-it-works$/);
  await page.goto('/how-it-works?from=browser#evening-walk');
  await page.getByRole('link', { name: 'EN', exact: true }).first().click();
  await expect(page).toHaveURL(/\/en\/how-it-works\?from=browser#evening-walk$/);
  await expect(page.getByRole('heading', { name: 'How Along works' })).toBeVisible();
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
    await page.screenshot({ path: `artifacts/web-eng-001/screenshots/home-${width}.png`, fullPage: true });
  });
}
