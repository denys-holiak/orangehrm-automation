import type { Locator, Page } from '@playwright/test';
import { Header } from '@app/components/Header';

export class DashboardPage {
  readonly heading: Locator;
  readonly header: Header;

  constructor(page: Page) {
    this.heading = page.getByRole('heading', { name: 'Dashboard' });
    this.header = new Header(page);
  }
}
