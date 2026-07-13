import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

const pages = ['/', '/brand/logo/', '/brand/color/', '/resources/downloads/'];

const getSeriousViolations = async (page: Parameters<typeof AxeBuilder>[0]['page']) => {
  const results = await new AxeBuilder({ page }).analyze();
  return results.violations.filter((violation) =>
    ['serious', 'critical'].includes(violation.impact ?? ''),
  );
};

for (const path of pages) {
  test(`${path} has no serious accessibility or overflow issues`, async ({ page }) => {
    await page.goto(path);
    await expect(page.locator('main')).toBeVisible();
    await expect(page).toHaveTitle(/OpenProject Design/);

    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth > document.documentElement.clientWidth,
    );
    expect(overflow).toBe(false);

    const serious = await getSeriousViolations(page);
    expect(serious, JSON.stringify(serious, null, 2)).toEqual([]);
  });
}

test('site colors respond to an explicit dark theme', async ({ page }) => {
  await page.goto('/');
  const before = await page.evaluate(() =>
    getComputedStyle(document.documentElement)
      .getPropertyValue('--cqut-semantic-color-background-canvas')
      .trim(),
  );
  await page.evaluate(() => document.documentElement.setAttribute('data-theme', 'dark'));
  const after = await page.evaluate(() =>
    getComputedStyle(document.documentElement)
      .getPropertyValue('--cqut-semantic-color-background-canvas')
      .trim(),
  );
  expect(before.toLowerCase()).toBe('#f7fafc');
  expect(after.toLowerCase()).toBe('#071f33');
});

test('home page omits the generated title and aligns grid items', async ({ page }) => {
  await page.goto('/');

  await expect(page.locator('main > .content-panel', { has: page.locator('#_top') })).toBeHidden();

  const gridItemMargins = await page
    .locator('.brand-grid')
    .evaluateAll((grids) =>
      grids.flatMap((grid) => [...grid.children].map((item) => getComputedStyle(item).marginTop)),
    );

  expect(gridItemMargins.every((margin) => margin === '0px')).toBe(true);
});

test('dark theme remains accessible', async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => document.documentElement.setAttribute('data-theme', 'dark'));
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');

  const serious = await getSeriousViolations(page);
  expect(serious, JSON.stringify(serious, null, 2)).toEqual([]);
});

test('keyboard focus is visible', async ({ page }) => {
  await page.goto('/');
  await page.keyboard.press('Tab');

  const focused = page.locator(':focus-visible');
  await expect(focused).toHaveAttribute('href', '#_top');
  const outline = await focused.evaluate((element) => getComputedStyle(element).outlineStyle);
  expect(outline).not.toBe('none');
});

test('reduced motion preference disables non-essential motion', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');

  const duration = await page.locator('.hero').evaluate((element) => {
    const styles = getComputedStyle(element);
    return {
      animation: styles.animationDuration,
      transition: styles.transitionDuration,
    };
  });
  expect(Number.parseFloat(duration.animation)).toBeLessThanOrEqual(0.001);
  expect(Number.parseFloat(duration.transition)).toBeLessThanOrEqual(0.001);
});

test('core content remains readable without JavaScript', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto('/');
  await expect(page.getByRole('heading', { name: /为校园开源项目建立/ })).toBeVisible();
  await expect(page.getByText(/独立运行的非营利开源社区/).first()).toBeVisible();
  await context.close();
});
