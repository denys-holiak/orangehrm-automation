import { expect, test } from '@app/fixtures';
import { routes } from '@app/config/routes';
import { fullName } from '@app/data/models';
import { userScenarios } from '@app/data/userScenarios';

test.describe('User management', () => {
  test('should reach the users list through Admin > User Management > Users', async ({
    dashboardPage,
    sideMenu,
    topMenu,
    usersPage,
    page,
  }) => {
    await dashboardPage.goto();
    await sideMenu.open('Admin');
    await topMenu.open('User Management', 'Users');

    await expect(page).toHaveURL(routes.users);
    await expect(usersPage.heading).toBeVisible();
  });

  for (const { role, status } of userScenarios) {
    test(`should add a ${role} user with ${status} status and list it with the entered details`, async ({
      page,
      usersPage,
      userFormPage,
      userBuilder,
      employee,
    }) => {
      const user = userBuilder.build({ role, status });

      await usersPage.goto();
      await usersPage.startAdding();
      await expect(userFormPage.addUserHeading).toBeVisible();
      await userFormPage.create(user, employee);

      await expect(page).toHaveURL(routes.users);
      await usersPage.search(user.username);
      const row = usersPage.row(user.username);
      await expect(row.username).toHaveText(user.username);
      await expect(row.role).toHaveText(role);
      await expect(row.employeeName).toHaveText(fullName(employee));
      await expect(row.status).toHaveText(status);
    });
  }

  test('should change the role and status of an existing user', async ({
    page,
    usersPage,
    userFormPage,
    user,
  }) => {
    await usersPage.goto();
    await usersPage.search(user.username);
    await usersPage.startEditing(user.username);
    await expect(userFormPage.editUserHeading).toBeVisible();
    await userFormPage.changeAccess('Admin', 'Disabled');

    await expect(page).toHaveURL(routes.users);
    await usersPage.search(user.username);
    const row = usersPage.row(user.username);
    await expect(row.role).toHaveText('Admin');
    await expect(row.status).toHaveText('Disabled');
  });

  test('should remove a deleted user from the list', async ({ usersPage, user }) => {
    await usersPage.goto();
    await usersPage.search(user.username);
    await expect(usersPage.row(user.username).root).toHaveCount(1);

    await usersPage.delete(user.username);

    await expect(usersPage.row(user.username).root).toHaveCount(0);
  });
});
