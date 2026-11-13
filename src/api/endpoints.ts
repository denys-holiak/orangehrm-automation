const API = '/web/index.php/api/v2';

export const apiEndpoints = {
  employees: `${API}/pim/employees`,
  users: `${API}/admin/users`,
} as const;
