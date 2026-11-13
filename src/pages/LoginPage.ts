import type { Locator, Page } from '@playwright/test';
import { routes } from '@app/config/routes';
import { Step } from '@app/utils/step';

export class LoginPage {
  readonly heading: Locator;
  readonly invalidCredentialsAlert: Locator;
  readonly requiredFieldErrors: Locator;
  private readonly usernameInput: Locator;
  private readonly passwordInput: Locator;
  private readonly submitButton: Locator;

  constructor(private readonly page: Page) {
    this.heading = page.getByRole('heading', { name: 'Login' });
    this.invalidCredentialsAlert = page.getByRole('alert');
    this.requiredFieldErrors = page.getByText('Required', { exact: true });
    this.usernameInput = page.getByPlaceholder('Username');
    this.passwordInput = page.getByPlaceholder('Password');
    this.submitButton = page.getByRole('button', { name: 'Login' });
  }

  @Step('Open the login page')
  async goto(): Promise<void> {
    await this.page.goto(routes.login);
  }

  @Step((username: string) => `Log in as "${username}"`)
  async login(username: string, password: string): Promise<void> {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.submitButton.click();
  }

  @Step('Submit the login form without filling it in')
  async submitEmpty(): Promise<void> {
    await this.submitButton.click();
  }
}
