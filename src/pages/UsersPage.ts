import type { Locator, Page } from '@playwright/test';
import { FormField } from '@app/components/FormField';
import { routes } from '@app/config/routes';
import { Step } from '@app/utils/step';

export interface UserRow {
  root: Locator;
  username: Locator;
  role: Locator;
  employeeName: Locator;
  status: Locator;
}

// Position of each column in a row: a checkbox cell comes first, an actions cell last.
const column = { username: 1, role: 2, employeeName: 3, status: 4 } as const;

export class UsersPage {
  readonly heading: Locator;
  private readonly recordsSummary: Locator;
  private readonly usernameFilter: FormField;
  private readonly searchButton: Locator;
  private readonly addButton: Locator;

  constructor(private readonly page: Page) {
    this.heading = page.getByRole('heading', { name: 'System Users' });
    this.recordsSummary = page.getByText(/Records? Found/).first();
    this.usernameFilter = new FormField(page, 'Username');
    this.searchButton = page.getByRole('button', { name: 'Search', exact: true });
    this.addButton = page.getByRole('button', { name: 'Add' });
  }

  row(username: string): UserRow {
    const root = this.page.getByRole('row').filter({ hasText: username });
    const cell = (index: number): Locator => root.getByRole('cell').nth(index);
    return {
      root,
      username: cell(column.username),
      role: cell(column.role),
      employeeName: cell(column.employeeName),
      status: cell(column.status),
    };
  }

  @Step('Open the users list')
  async goto(): Promise<void> {
    await this.page.goto(routes.users);
    await this.recordsSummary.waitFor();
  }

  @Step((username: string) => `Search for user "${username}"`)
  async search(username: string): Promise<void> {
    await this.recordsSummary.waitFor();
    await this.usernameFilter.fill(username);
    await this.searchButton.click();
  }

  @Step('Start adding a user')
  async startAdding(): Promise<void> {
    await this.addButton.click();
  }

  @Step((username: string) => `Start editing user "${username}"`)
  async startEditing(username: string): Promise<void> {
    await this.row(username).root.locator('button:has(.bi-pencil-fill)').click();
  }

  @Step((username: string) => `Delete user "${username}"`)
  async delete(username: string): Promise<void> {
    await this.row(username).root.locator('button:has(.bi-trash)').click();
    await this.page.getByRole('dialog').getByRole('button', { name: 'Yes, Delete' }).click();
  }
}
