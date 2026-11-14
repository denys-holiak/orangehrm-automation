import { expect, test } from '@app/fixtures';
import { routes } from '@app/config/routes';

test.describe('Logout', () => {
  test.use({ ownSession: true });

  test('should log out and return to the login page', async ({
    loginPage,
    dashboardPage,
    page,
  }) => {
    await dashboardPage.goto();
    await expect(dashboardPage.heading).toBeVisible();

    await dashboardPage.header.logout();

    await expect(page).toHaveURL(routes.login);
    await expect(loginPage.heading).toBeVisible();
  });
});

test.describe('Access control', () => {
  test.use({ storageState: { cookies: [], origins: [] } });

  test('should redirect an unauthenticated visitor from a protected page to login', async ({
    loginPage,
    page,
  }) => {
    await page.goto(routes.users);

    await expect(page).toHaveURL(routes.login);
    await expect(loginPage.heading).toBeVisible();
  });
});
