import { test as base } from '@playwright/test';
import { loginViaApi } from '@app/api/auth';
import { env } from '@app/config/env';
import { DashboardPage } from '@app/pages/DashboardPage';
import { LoginPage } from '@app/pages/LoginPage';

export const test = base.extend<{
  loginPage: LoginPage;
  dashboardPage: DashboardPage;
  ownSession: boolean;
}>({
  // Opt in with test.use({ ownSession: true }) for a test that ends or alters its session
  // (logging out invalidates it on the server, which would also log out every other test
  // sharing the saved storage state). The test then starts logged in with a session of its own.
  ownSession: [false, { option: true }],

  storageState: async ({ storageState, ownSession, playwright, baseURL }, use) => {
    if (!ownSession) {
      await use(storageState);
      return;
    }
    const request = await playwright.request.newContext({ baseURL });
    await loginViaApi(request, env.username, env.password);
    await use(await request.storageState());
    await request.dispose();
  },

  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },

  dashboardPage: async ({ page }, use) => {
    await use(new DashboardPage(page));
  },
});

export const expect = test.expect;
