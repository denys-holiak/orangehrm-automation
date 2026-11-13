import type { APIRequestContext } from '@playwright/test';
import { routes } from '@app/config/routes';

// The login page embeds its CSRF token in a Vue component attribute:
// :token="&quot;<value>&quot;"
const TOKEN_PATTERN = /:token="&quot;([^&]+)&quot;"/;

export async function loginViaApi(
  request: APIRequestContext,
  username: string,
  password: string,
): Promise<void> {
  const loginPage = await request.get(routes.login);
  const token = TOKEN_PATTERN.exec(await loginPage.text())?.[1];
  if (!token) {
    throw new Error('Could not find the CSRF token on the login page - has its markup changed?');
  }

  const response = await request.post(routes.loginSubmit, {
    form: { _token: token, username, password },
  });
  // A rejected login ends up back on the login page; an accepted one is redirected away.
  if (new URL(response.url()).pathname === routes.login) {
    throw new Error(`API login was rejected for user "${username}".`);
  }
}
