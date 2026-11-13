import { faker } from '@faker-js/faker';
import type { NewUser } from '@app/data/models';

export class UserBuilder {
  build(overrides: Partial<NewUser> = {}): NewUser {
    return {
      username: `qa_${faker.string.alphanumeric({ length: 10, casing: 'lower' })}`,
      // Starts with an upper-case letter, a lower-case letter and a digit so it satisfies
      // the application's password rules whatever the random tail turns out to be.
      password: `Qa1${faker.string.alphanumeric(8)}`,
      role: 'ESS',
      status: 'Enabled',
      ...overrides,
    };
  }
}
