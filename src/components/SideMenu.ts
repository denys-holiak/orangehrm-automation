import type { Locator, Page } from '@playwright/test';
import { Step } from '@app/utils/step';

export type MainMenuItem = 'Admin';

export class SideMenu {
  private readonly menu: Locator;

  constructor(page: Page) {
    this.menu = page.getByRole('navigation', { name: 'Sidepanel' });
  }

  @Step((item: MainMenuItem) => `Open "${item}" in the main menu`)
  async open(item: MainMenuItem): Promise<void> {
    await this.menu.getByRole('link', { name: item, exact: true }).click();
  }
}
