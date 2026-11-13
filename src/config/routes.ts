const APP = '/web/index.php';

export const routes = {
  login: `${APP}/auth/login`,
  dashboard: `${APP}/dashboard/index`,
  users: `${APP}/admin/viewSystemUsers`,
} as const;
