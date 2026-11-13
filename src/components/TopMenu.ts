import type { Locator, Page } from '@playwright/test';
import { Step } from '@app/utils/step';

export class TopMenu {
  private readonly menu: Locator;

  constructor(private readonly page: Page) {
    this.menu = page.getByRole('navigation', { name: 'Topbar Menu' });
  }

  @Step((section: string, item: string) => `Open "${section}" > "${item}" in the top menu`)
  async open(section: string, item: string): Promise<void> {
    await this.menu.getByText(section, { exact: true }).click();
    await this.page.getByRole('menuitem', { name: item, exact: true }).click();
  }
}
