# OrangeHRM automation

End-to-end tests for the [OrangeHRM demo site](https://opensource-demo.orangehrmlive.com/),
written with Playwright and TypeScript.

> Work in progress: this README grows with each pull request. The final version
> will document the full structure, approach, assumptions and limitations.

## Prerequisites

- Node.js 20 or newer
- npm

## Setup

```bash
npm install
npx playwright install chromium
cp .env.example .env
```

## Running the tests

```bash
npm test               # run the whole suite
npm run test:report    # open the HTML report of the last run
```

## Configuration

All environment-specific values live in `.env` (gitignored, copied from
`.env.example`):

| Variable             | Meaning                                |
| -------------------- | -------------------------------------- |
| `ORANGEHRM_BASE_URL` | Base URL of the application under test |
| `ORANGEHRM_USERNAME` | Login of the account the tests use     |
| `ORANGEHRM_PASSWORD` | Password of that account               |

The defaults in `.env.example` are the demo site's own public credentials, not
secrets. A missing variable fails fast with a clear error instead of silently
falling back to a default.

## What is covered

**Login** (`tests/auth/login.spec.ts`)

- Valid credentials land on the dashboard.
- A wrong password, an unknown username, and both wrong are rejected with the
  same "Invalid credentials" message and the user stays on the login page.
- Submitting the empty form shows a "Required" error on both fields.

**Session** (`tests/auth/session.spec.ts`)

- Logging out returns to the login page.
- Opening a protected page without a session redirects to the login page.

**User management** (`tests/admin/users.spec.ts`)

- Admin > User Management > Users is reachable through the menus.
- Adding a user, once for every role and status combination listed in
  `src/data/userScenarios.json`, shows it in the list with the entered role,
  employee name and status.
- Editing an existing user's role and status is reflected in the list.
- Deleting a user removes it from the list.

## Approach

**Authentication.** A `setup` project logs in over HTTP once and saves the
session; every other test starts already logged in, so nothing but the login
specs pays for the login form. The login specs opt out with an empty storage
state. A test that ends its session (logout) opts in to `ownSession` and gets a
fresh login of its own, because logging out invalidates the session on the
server and would otherwise log out every other test sharing it.

**Test data.** Employees and users are generated (faker, with a random suffix
so names stay unique on a shared site) and created through the application's
own REST API; only the behaviour under test is driven through the UI. Each test
gets an employee of its own through a fixture, which removes it, and any user
account created for it, when the test ends, so repeated and parallel runs
neither collide nor leave data behind.

**Selectors.** Roles and accessible names first (`alert`, `heading`, `menuitem`,
`navigation`). The application's form labels are not associated with their
inputs, so form fields are found through the form group that holds the label
text.

## Project structure

```
src/
  api/
    auth.ts              Logs in over HTTP (CSRF token + form POST)
    endpoints.ts         Paths of the REST API used for test data
    OrangeHrmClient.ts   Creates and removes employees and users
  config/
    env.ts               Typed, fail-fast access to environment variables
    routes.ts            Application paths in one place
    auth.ts              Where the saved admin session lives
  data/
    models.ts            Shared types (roles, statuses, employee, user)
    userBuilder.ts       Generates a unique user
    employeeBuilder.ts   Generates a unique employee
    userScenarios.json   Role and status combinations the add-user test covers
  pages/                 One Page Object per application page
  components/            UI parts shared by several pages (menus, form helpers)
  utils/step.ts          @Step decorator: wraps Page Object actions in test.step()
                         so the HTML report reads as a list of user actions
  fixtures.ts            Custom `test` that hands Page Objects and test data to specs
tests/                   Test specs, grouped by feature (auth.setup.ts logs in once)
playwright.config.ts     Runner configuration (projects, timeouts, reporters, artifacts)
eslint.config.ts         Linting (typescript-eslint + eslint-plugin-playwright)
```

`@app/*` resolves to `src/*` (see `tsconfig.json`).

Page Objects expose locators and actions; assertions stay in the specs, so a
spec reads as a complete statement of what it verifies.

## Quality checks

```bash
npm run lint
npm run typecheck
npm run format:check
```

A pre-commit hook (Husky + lint-staged) lints and formats staged files.
