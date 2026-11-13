import { expect, test } from '@playwright/test';

test.describe('Smoke', () => {
  test('should render the login form on the demo site', async ({ page }) => {
    await page.goto('/web/index.php/auth/login');

    await expect(page.getByRole('heading', { name: 'Login' })).toBeVisible();
    await expect(page.getByPlaceholder('Username')).toBeVisible();
    await expect(page.getByPlaceholder('Password')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Login' })).toBeEnabled();
  });
});
