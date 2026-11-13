import type { Locator, Page } from '@playwright/test';

// The application's labels are not associated with their inputs, so getByLabel finds nothing.
// A form group (label plus control) located by its exact label text is the stable handle.
export function formGroup(page: Page, label: string): Locator {
  return page.locator('.oxd-input-group').filter({ has: page.getByText(label, { exact: true }) });
}

export async function chooseOption(page: Page, group: Locator, option: string): Promise<void> {
  await group.locator('.oxd-select-text').click();
  await page.getByRole('option', { name: option, exact: true }).click();
}
