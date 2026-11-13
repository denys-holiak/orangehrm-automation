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
- Logging out returns to the login page.
- Opening a protected page without a session redirects to the login page.

## Project structure

```
src/
  config/
    env.ts             Typed, fail-fast access to environment variables
    routes.ts          Application paths in one place
  pages/               One Page Object per application page
  components/          UI parts shared by several pages (the top bar)
  utils/step.ts        @Step decorator: wraps Page Object actions in test.step()
                       so the HTML report reads as a list of user actions
  fixtures.ts          Custom `test` that hands Page Objects to specs
tests/                 Test specs, grouped by feature
playwright.config.ts   Runner configuration (timeouts, reporters, artifacts)
eslint.config.ts       Linting (typescript-eslint + eslint-plugin-playwright)
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
