import { test as base } from '@playwright/test';
import { DashboardPage } from '@app/pages/DashboardPage';
import { LoginPage } from '@app/pages/LoginPage';

export const test = base.extend<{
  loginPage: LoginPage;
  dashboardPage: DashboardPage;
}>({
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },

  dashboardPage: async ({ page }, use) => {
    await use(new DashboardPage(page));
  },
});

export const expect = test.expect;
