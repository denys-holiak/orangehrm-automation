import { faker } from '@faker-js/faker';
import type { NewEmployee } from '@app/data/models';

const lettersOnly = (value: string): string => value.replace(/[^A-Za-z]/g, '');

export class EmployeeBuilder {
  // The random suffix keeps the full name unique, so an autocomplete lookup by name
  // finds exactly this employee even though the demo site is shared with other people.
  build(overrides: Partial<NewEmployee> = {}): NewEmployee {
    return {
      firstName: lettersOnly(faker.person.firstName()),
      lastName: `${lettersOnly(faker.person.lastName())}${faker.string.alpha({ length: 6 })}`,
      ...overrides,
    };
  }
}
