import type { Locator, Page } from '@playwright/test';
import { chooseOption, formGroup } from '@app/components/formControls';
import { fullName } from '@app/data/models';
import type { NewEmployee, NewUser, UserRole, UserStatus } from '@app/data/models';
import { Step } from '@app/utils/step';

export class UserFormPage {
  readonly addUserHeading: Locator;
  readonly editUserHeading: Locator;
  private readonly saveButton: Locator;

  constructor(private readonly page: Page) {
    this.addUserHeading = page.getByRole('heading', { name: 'Add User' });
    this.editUserHeading = page.getByRole('heading', { name: 'Edit User' });
    this.saveButton = page.getByRole('button', { name: 'Save', exact: true });
  }

  @Step((user: NewUser) => `Create user "${user.username}"`)
  async create(user: NewUser, employee: NewEmployee): Promise<void> {
    await this.selectRole(user.role);
    await this.selectStatus(user.status);
    await this.selectEmployee(employee);
    await formGroup(this.page, 'Username').getByRole('textbox').fill(user.username);
    await formGroup(this.page, 'Password').locator('input').fill(user.password);
    await formGroup(this.page, 'Confirm Password').locator('input').fill(user.password);
    await this.saveButton.click();
  }

  @Step((role: UserRole, status: UserStatus) => `Change the user to ${role} / ${status}`)
  async changeAccess(role: UserRole, status: UserStatus): Promise<void> {
    await this.selectRole(role);
    await this.selectStatus(status);
    await this.saveButton.click();
  }

  private async selectRole(role: UserRole): Promise<void> {
    await chooseOption(this.page, formGroup(this.page, 'User Role'), role);
  }

  private async selectStatus(status: UserStatus): Promise<void> {
    await chooseOption(this.page, formGroup(this.page, 'Status'), status);
  }

  private async selectEmployee(employee: NewEmployee): Promise<void> {
    const name = fullName(employee);
    await formGroup(this.page, 'Employee Name').getByPlaceholder('Type for hints...').fill(name);
    await this.page.getByRole('option', { name, exact: true }).click();
  }
}
