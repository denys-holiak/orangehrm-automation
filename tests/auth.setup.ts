import { expect, test as setup } from '@playwright/test';
import { loginViaApi } from '@app/api/auth';
import { adminAuthFile } from '@app/config/auth';
import { env } from '@app/config/env';

setup('authenticate as the admin user', async ({ request }) => {
  await loginViaApi(request, env.username, env.password);
  const { cookies } = await request.storageState({ path: adminAuthFile });

  expect(cookies.map((cookie) => cookie.name)).toContain('orangehrm');
});
