import type { Locator, Page } from '@playwright/test';
import { Step } from '@app/utils/step';

export class Header {
  private readonly userMenuTrigger: Locator;
  private readonly logoutItem: Locator;

  constructor(page: Page) {
    this.userMenuTrigger = page.getByRole('banner').getByRole('img', { name: 'profile picture' });
    this.logoutItem = page.getByRole('menuitem', { name: 'Logout' });
  }

  @Step('Log out')
  async logout(): Promise<void> {
    await this.userMenuTrigger.click();
    await this.logoutItem.click();
  }
}
