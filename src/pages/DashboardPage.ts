import type { Locator, Page } from '@playwright/test';
import { Header } from '@app/components/Header';
import { routes } from '@app/config/routes';
import { Step } from '@app/utils/step';

export class DashboardPage {
  readonly heading: Locator;
  readonly header: Header;

  constructor(private readonly page: Page) {
    this.heading = page.getByRole('heading', { name: 'Dashboard' });
    this.header = new Header(page);
  }

  @Step('Open the dashboard')
  async goto(): Promise<void> {
    await this.page.goto(routes.dashboard);
  }
}
