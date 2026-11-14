export type UserRole = 'Admin' | 'ESS';
export type UserStatus = 'Enabled' | 'Disabled';

export interface NewEmployee {
  firstName: string;
  lastName: string;
}

export interface Employee extends NewEmployee {
  empNumber: number;
}

export interface NewUser {
  username: string;
  password: string;
  role: UserRole;
  status: UserStatus;
}

export function fullName(employee: NewEmployee): string {
  return `${employee.firstName} ${employee.lastName}`;
}
