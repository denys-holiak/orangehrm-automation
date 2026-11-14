import type { Locator, Page } from '@playwright/test';

// The application's labels are not associated with their inputs, so getByLabel finds nothing.
// A form group (label plus control) located by its exact label text is the stable handle.
// Dropdown and autocomplete options are rendered inside the group, so they are looked up there.
export class FormField {
  private readonly group: Locator;

  constructor(page: Page, label: string) {
    this.group = page
      .locator('.oxd-input-group')
      .filter({ has: page.getByText(label, { exact: true }) });
  }

  async fill(value: string): Promise<void> {
    await this.group.locator('input').fill(value);
  }

  async select(option: string): Promise<void> {
    await this.group.locator('.oxd-select-text').click();
    await this.option(option).click();
  }

  // Autocomplete: type a query, then choose one of the suggestions (the query itself by default).
  async pick(option: string, query = option): Promise<void> {
    await this.group.locator('input').fill(query);
    await this.option(option).click();
  }

  private option(name: string): Locator {
    return this.group.getByRole('option', { name, exact: true });
  }
}
