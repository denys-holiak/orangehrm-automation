import { expect, test } from '@app/fixtures';
import { env } from '@app/config/env';
import { routes } from '@app/config/routes';

const rejectedCredentials = [
  { reason: 'a wrong password', username: env.username, password: 'wrong-password' },
  { reason: 'an unknown username', username: 'no-such-user', password: env.password },
  {
    reason: 'an unknown username and password',
    username: 'no-such-user',
    password: 'wrong-password',
  },
];

test.describe('Login', () => {
  test.beforeEach(async ({ loginPage }) => {
    await loginPage.goto();
  });

  test('should log in with valid credentials', async ({ loginPage, dashboardPage, page }) => {
    await loginPage.login(env.username, env.password);

    await expect(page).toHaveURL(routes.dashboard);
    await expect(dashboardPage.heading).toBeVisible();
  });

  for (const { reason, username, password } of rejectedCredentials) {
    test(`should reject login with ${reason}`, async ({ loginPage, page }) => {
      await loginPage.login(username, password);

      await expect(loginPage.invalidCredentialsAlert).toHaveText('Invalid credentials');
      await expect(page).toHaveURL(routes.login);
    });
  }

  test('should require both fields when the form is submitted empty', async ({ loginPage }) => {
    await loginPage.submitEmpty();

    await expect(loginPage.requiredFieldErrors).toHaveCount(2);
  });

  test('should log out and return to the login page', async ({
    loginPage,
    dashboardPage,
    page,
  }) => {
    await loginPage.login(env.username, env.password);
    await expect(dashboardPage.heading).toBeVisible();

    await dashboardPage.header.logout();

    await expect(page).toHaveURL(routes.login);
    await expect(loginPage.heading).toBeVisible();
  });

  test('should redirect an unauthenticated visitor from a protected page to login', async ({
    loginPage,
    page,
  }) => {
    await page.goto(routes.users);

    await expect(page).toHaveURL(routes.login);
    await expect(loginPage.heading).toBeVisible();
  });
});
