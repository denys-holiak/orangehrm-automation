/* eslint-disable no-empty-pattern */
import { test as base } from '@playwright/test';
import { loginViaApi } from '@app/api/auth';
import { OrangeHrmClient } from '@app/api/OrangeHrmClient';
import { SideMenu } from '@app/components/SideMenu';
import { TopMenu } from '@app/components/TopMenu';
import { env } from '@app/config/env';
import { EmployeeBuilder } from '@app/data/employeeBuilder';
import type { Employee, NewUser } from '@app/data/models';
import { UserBuilder } from '@app/data/userBuilder';
import { DashboardPage } from '@app/pages/DashboardPage';
import { LoginPage } from '@app/pages/LoginPage';
import { UserFormPage } from '@app/pages/UserFormPage';
import { UsersPage } from '@app/pages/UsersPage';

export const test = base.extend<{
  loginPage: LoginPage;
  dashboardPage: DashboardPage;
  usersPage: UsersPage;
  userFormPage: UserFormPage;
  sideMenu: SideMenu;
  topMenu: TopMenu;
  userBuilder: UserBuilder;
  employeeBuilder: EmployeeBuilder;
  hrmApi: OrangeHrmClient;
  employee: Employee;
  user: NewUser;
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

  usersPage: async ({ page }, use) => {
    await use(new UsersPage(page));
  },

  userFormPage: async ({ page }, use) => {
    await use(new UserFormPage(page));
  },

  sideMenu: async ({ page }, use) => {
    await use(new SideMenu(page));
  },

  topMenu: async ({ page }, use) => {
    await use(new TopMenu(page));
  },

  userBuilder: async ({}, use) => {
    await use(new UserBuilder());
  },

  employeeBuilder: async ({}, use) => {
    await use(new EmployeeBuilder());
  },

  hrmApi: async ({ context }, use) => {
    await use(new OrangeHrmClient(context.request));
  },

  // A brand-new employee for this test alone, removed afterwards together with any
  // user account that was created for them.
  employee: async ({ hrmApi, employeeBuilder }, use) => {
    const employee = await hrmApi.createEmployee(employeeBuilder.build());
    await use(employee);
    await hrmApi.deleteEmployee(employee.empNumber);
  },

  // An enabled ESS account that already exists when the test starts; it goes away
  // with its employee.
  user: async ({ hrmApi, employee, userBuilder }, use) => {
    const user = userBuilder.build();
    await hrmApi.createUser(user, employee.empNumber);
    await use(user);
  },
});

export const expect = test.expect;
