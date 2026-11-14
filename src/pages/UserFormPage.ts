import type { Locator, Page } from '@playwright/test';
import { FormField } from '@app/components/FormField';
import { fullName } from '@app/data/models';
import type { NewEmployee, NewUser, UserRole, UserStatus } from '@app/data/models';
import { Step } from '@app/utils/step';

export class UserFormPage {
  readonly addUserHeading: Locator;
  readonly editUserHeading: Locator;
  private readonly role: FormField;
  private readonly status: FormField;
  private readonly employeeName: FormField;
  private readonly username: FormField;
  private readonly password: FormField;
  private readonly confirmPassword: FormField;
  private readonly saveButton: Locator;

  constructor(page: Page) {
    this.addUserHeading = page.getByRole('heading', { name: 'Add User' });
    this.editUserHeading = page.getByRole('heading', { name: 'Edit User' });
    this.role = new FormField(page, 'User Role');
    this.status = new FormField(page, 'Status');
    this.employeeName = new FormField(page, 'Employee Name');
    this.username = new FormField(page, 'Username');
    this.password = new FormField(page, 'Password');
    this.confirmPassword = new FormField(page, 'Confirm Password');
    this.saveButton = page.getByRole('button', { name: 'Save', exact: true });
  }

  @Step((user: NewUser) => `Create user "${user.username}"`)
  async create(user: NewUser, employee: NewEmployee): Promise<void> {
    await this.role.select(user.role);
    await this.status.select(user.status);
    await this.employeeName.pick(fullName(employee));
    await this.username.fill(user.username);
    await this.password.fill(user.password);
    await this.confirmPassword.fill(user.password);
    await this.saveButton.click();
  }

  @Step((role: UserRole, status: UserStatus) => `Change the user to ${role} / ${status}`)
  async changeAccess(role: UserRole, status: UserStatus): Promise<void> {
    await this.role.select(role);
    await this.status.select(status);
    await this.saveButton.click();
  }
}
