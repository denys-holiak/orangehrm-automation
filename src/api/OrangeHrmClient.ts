import type { APIRequestContext } from '@playwright/test';
import { apiEndpoints } from '@app/api/endpoints';
import type { Employee, NewEmployee, NewUser, UserRole } from '@app/data/models';

// Fixed ids of the application's two built-in roles.
const roleIds: Record<UserRole, number> = { Admin: 1, ESS: 2 };

// Prepares and removes test data through the application's own REST API, so that the UI
// tests only spend time on the behaviour they are actually about.
export class OrangeHrmClient {
  constructor(private readonly request: APIRequestContext) {}

  async createEmployee(employee: NewEmployee): Promise<Employee> {
    const created = await this.send<{ empNumber: number }>('POST', apiEndpoints.employees, {
      firstName: employee.firstName,
      middleName: '',
      lastName: employee.lastName,
      empPicture: null,
      employeeId: null,
    });
    return { ...employee, empNumber: created.empNumber };
  }

  async createUser(user: NewUser, empNumber: number): Promise<void> {
    await this.send('POST', apiEndpoints.users, {
      username: user.username,
      password: user.password,
      status: user.status === 'Enabled',
      userRoleId: roleIds[user.role],
      empNumber,
    });
  }

  // Deleting an employee also removes the user accounts that belong to them.
  async deleteEmployee(empNumber: number): Promise<void> {
    await this.send('DELETE', apiEndpoints.employees, { ids: [empNumber] });
  }

  private async send<T>(method: 'POST' | 'DELETE', url: string, body: object): Promise<T> {
    const response = await this.request.fetch(url, { method, data: body });
    if (!response.ok()) {
      throw new Error(
        `${method} ${url} failed with ${response.status()}: ${await response.text()}`,
      );
    }
    return ((await response.json()) as { data: T }).data;
  }
}
