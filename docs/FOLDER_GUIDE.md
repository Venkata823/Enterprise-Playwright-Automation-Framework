# Folder guide

This page explains every folder in the framework: what it holds, why an
enterprise framework needs it, and the rules for using it.

For line-by-line notes on the config files, see
[FILES_EXPLAINED.md](./FILES_EXPLAINED.md).

## The big picture

The framework is built in layers. Each layer talks only to the layer below it.

```
tests/        WHAT to check      (business steps and assertions)
   |
fixtures/     SETUP              (gives tests ready pages, users, data)
   |
pages/  components/  api/        HOW to talk to the app (UI and API)
   |
testdata/  config/  utils/  types/     SUPPORT (data, settings, helpers, types)
```

Why layers matter: when the application changes, you fix one place.
If a button id changes, you edit one page object, not 200 tests.

## Folder structure and layers are not the same thing

|               | Folder structure            | Layers                                        |
| ------------- | --------------------------- | --------------------------------------------- |
| Answers       | "Where do I put this file?" | "Who is allowed to call whom?"                |
| What it is    | Physical: folders on disk   | Logical: rules between parts of the code      |
| Can it change | Yes. Folders can be renamed | No. Breaking a rule damages the design        |
| Example       | `pages/LoginPage.ts`        | "Tests may use pages. Pages never use tests." |

The layer rules, with calls going downward only:

```
tests        ->  may use fixtures
fixtures     ->  may use pages, components, api
pages / api  ->  may use testdata, config, utils, types
support      ->  uses nothing above it
```

Two frameworks can have different folders and the same layers.
When you explain the framework, explain the layers first (the design),
then the folders (how the design is stored on disk).

## What changes when the application changes

Not every layer changes. Each layer knows one thing about the application,
so each kind of change has one home.

| Application change                 | Where you edit                         | Tests edited     |
| ---------------------------------- | -------------------------------------- | ---------------- |
| Button id or label changes         | One page object                        | 0                |
| A shared menu moves or changes     | One component                          | 0                |
| API URL or response field changes  | One API client or schema               | 0                |
| Server address changes             | One env file                           | 0                |
| A new required data field is added | `types/` and the data builder          | 0                |
| Login gets a new step              | Login page object and the auth fixture | 0                |
| A business rule changes            | The tests for that rule                | Only those tests |
| A new feature is added             | New page object and new tests          | New ones only    |

A big redesign of one feature can touch several layers, but the change
stays inside that feature. Other features are not affected.

Layers do not mean zero maintenance. They mean the cost of a change is
small and predictable.

## What changes for a new client or domain

A new client (for example retail instead of banking) is a new application.
The layers and their rules stay the same. The content inside the layers is new.

| Layer (stays) | Rule (stays)                        | Banking content          | Retail content     |
| ------------- | ----------------------------------- | ------------------------ | ------------------ |
| Tests         | Steps and assertions only           | `transfer-funds.spec.ts` | `checkout.spec.ts` |
| Pages         | Locators and actions, no assertions | `TransferFundsPage.ts`   | `CartPage.ts`      |
| API           | Typed clients, schema checks        | `AccountsClient.ts`      | `OrdersClient.ts`  |
| Test data     | Unique data per test                | Customer builder         | Product builder    |
| Types         | One shared definition               | `Account`                | `Order`            |

What is reused and what is written new:

| Reused as it is                                            | Written new for each client      |
| ---------------------------------------------------------- | -------------------------------- |
| Folder structure and layer rules                           | Page objects and components      |
| TypeScript, ESLint, Prettier, Husky settings               | API clients and schemas          |
| CI pipeline design                                         | Test data and types              |
| Config loader, utils, reporting                            | Tests                            |
| Base page, base API client, common fixtures (later phases) | Environment values (URLs, users) |

At enterprise scale, the reused part becomes a shared core package, and
each client project installs it:

```
core framework   (shared package, no domain knowledge)
banking project  ->  core + banking pages, APIs, data, tests
retail project   ->  core + retail pages, APIs, data, tests
```

Current status: this repository is one banking project. The core is not
separated yet. That step comes after the framework is complete, when it is
clear which parts are truly common.

## How one test uses the folders

Example: "transfer funds between two accounts".

1. `config/` gives the base URL for the chosen environment.
2. `testdata/` builds a new customer with random details.
3. `api/endpoints/` creates that customer and two accounts through the API (fast).
4. `fixtures/` logs the user in and hands a ready `TransferPage` to the test.
5. `pages/` and `components/` click and type in the browser.
6. `tests/e2e/` holds the test itself and the assertions.
7. `api/schemas/` checks the shape of the API response.
8. `utils/` formats the amount; `types/` describes what a "customer" and an "account" look like.

## Test folders

### `tests/`

|                  |                                                                         |
| ---------------- | ----------------------------------------------------------------------- |
| Holds            | Test files only (`*.spec.ts`). No locators, no helper code.             |
| Why              | Tests stay short and readable, like business steps.                     |
| Rule             | A test must not depend on another test. Each test creates its own data. |
| Rule             | Assertions (`expect`) live here, not in page objects.                   |
| Enterprise value | Split by type, so each pipeline runs only what it needs.                |

Sub-folders:

| Folder         | Holds                                                       | Speed  | Typical pipeline         |
| -------------- | ----------------------------------------------------------- | ------ | ------------------------ |
| `tests/web`    | UI tests for one page or one feature                        | Medium | Pull request and nightly |
| `tests/api`    | REST API tests with no browser                              | Fast   | Every pull request       |
| `tests/db`     | Checks that data is stored correctly in the database        | Fast   | Nightly                  |
| `tests/e2e`    | Full business flows across several pages, often UI plus API | Slow   | Nightly and release      |
| `tests/visual` | Screenshot comparison tests (`toHaveScreenshot`)            | Medium | Release                  |

Example file (later phases): `tests/web/login.spec.ts`.

Example (simplified; real tests arrive from Phase 2):

```ts
// tests/web/transfer-funds.spec.ts
// The test imports "test" from OUR fixtures, not from Playwright directly.
import { test, expect } from '@fixtures/index';

// The tag @smoke lets a pipeline pick this test.
test('transfer moves money between two accounts @smoke', async ({ transferFundsPage }) => {
  // Steps: plain business language. No locators here.
  await transferFundsPage.open();
  await transferFundsPage.transfer({ amount: 100, from: '13344', to: '13455' });

  // Assertion: lives in the test, not in the page object.
  await expect(transferFundsPage.successMessage).toBeVisible();
});
```

What you do NOT see in a test: `page.locator('#amount')`, a URL, a user
name, or a password. Those live in lower layers.

Note: the account numbers are typed in here only to keep the example short.
In the real framework, a fixture creates the two accounts and passes them
to the test, so every test has its own data.

## Application layers

### `pages/`

|                  |                                                                           |
| ---------------- | ------------------------------------------------------------------------- |
| Holds            | Page objects: one class per page of the application.                      |
| Inside a class   | Locators (where things are) and actions (what a user can do).             |
| Why              | One place to fix when the UI changes. Tests do not know about locators.   |
| Rule             | No assertions. A page object does things; a test checks things.           |
| Rule             | Use user-facing locators first: `getByRole`, `getByLabel`, `getByTestId`. |
| Enterprise value | Many teams reuse the same page object instead of copying locators.        |

Example files (Phase 3): `BasePage.ts`, `LoginPage.ts`, `TransferFundsPage.ts`.

Example (simplified; real page objects arrive in Phase 3):

```ts
// pages/TransferFundsPage.ts
import { BasePage } from '@pages/BasePage';

export class TransferFundsPage extends BasePage {
  // Locators: WHERE things are. Written once, here only.
  readonly amountInput = this.page.locator('#amount');
  readonly transferButton = this.page.getByRole('button', { name: 'Transfer' });
  readonly successMessage = this.page.getByRole('heading', { name: 'Transfer Complete!' });

  // Actions: WHAT a user can do. Named in business words.
  async open(): Promise<void> {
    await this.page.goto('/transfer.htm');
  }

  async transfer(details: { amount: number; from: string; to: string }): Promise<void> {
    await this.amountInput.fill(String(details.amount));
    await this.page.locator('#fromAccountId').selectOption(details.from);
    await this.page.locator('#toAccountId').selectOption(details.to);
    await this.transferButton.click();
  }
  // No "expect" in this file. The test decides what is correct.
}
```

If the Transfer button changes, you edit this one file. No test changes.

### `components/`

|                          |                                                                                     |
| ------------------------ | ----------------------------------------------------------------------------------- |
| Holds                    | Classes for UI parts that appear on many pages.                                     |
| Why                      | A header or side menu is on every page. Write it once, use it in every page object. |
| Difference from `pages/` | A page is a full screen. A component is a reusable piece of a screen.               |
| Enterprise value         | Removes duplicate locators. Works well with design-system based apps.               |

Example files (Phase 3): `AccountServicesMenu.ts`, `TransactionsTable.ts`.

Example (simplified; real components arrive in Phase 3):

```ts
// components/AccountServicesMenu.ts
// The left-side menu appears on every page after login.
import type { Page } from '@playwright/test';

export class AccountServicesMenu {
  constructor(private readonly page: Page) {}

  async goTo(linkName: 'Open New Account' | 'Transfer Funds' | 'Bill Pay'): Promise<void> {
    await this.page.getByRole('link', { name: linkName }).click();
  }
}
```

A page object then uses it, instead of repeating the menu locators:

```ts
// inside pages/AccountsOverviewPage.ts
readonly menu = new AccountServicesMenu(this.page);
```

### `api/`

|                  |                                                                       |
| ---------------- | --------------------------------------------------------------------- |
| Holds            | Code that calls the application's REST API.                           |
| Why              | API calls are much faster and more stable than the UI.                |
| Used for         | API tests, and for creating test data before a UI test.               |
| Enterprise value | Cuts run time. "Set up by API, verify by UI" is the standard pattern. |

Sub-folders:

| Folder          | Holds                                                                | Example (Phase 5)     |
| --------------- | -------------------------------------------------------------------- | --------------------- |
| `api/endpoints` | API clients: one class per service, with typed methods               | `AccountsClient.ts`   |
| `api/schemas`   | JSON schemas that describe the expected response; checked with `ajv` | `account.schema.json` |

Why schemas: a test that checks only `status 200` misses a renamed or
missing field. A schema check catches a broken contract.

Example (simplified; real clients arrive in Phase 5):

```ts
// api/endpoints/AccountsClient.ts
import type { APIRequestContext } from '@playwright/test';
import type { Account } from '@app-types/account';

export class AccountsClient {
  constructor(private readonly request: APIRequestContext) {}

  // One method per API operation, with a typed result.
  async getAccount(accountId: number): Promise<Account> {
    const response = await this.request.get(`/accounts/${accountId}`);
    return (await response.json()) as Account;
  }
}
```

`api/schemas/account.schema.json` describes the response shape. A missing
or renamed field fails the check. (A real `.json` file cannot hold comments.)

```json
{
  "type": "object",
  "required": ["id", "customerId", "type", "balance"],
  "properties": {
    "id": { "type": "number" },
    "customerId": { "type": "number" },
    "type": { "type": "string" },
    "balance": { "type": "number" }
  }
}
```

Doubt: "schema or type?" A type (`types/account.ts`) is checked while
writing code. A schema is checked while the test runs, against the real
response. You need both.

### `fixtures/`

|                   |                                                                                     |
| ----------------- | ----------------------------------------------------------------------------------- |
| Holds             | Custom Playwright fixtures.                                                         |
| What a fixture is | Setup and cleanup code that Playwright runs for a test and passes in by name.       |
| Why               | Tests ask for what they need (`loginPage`, `loggedInUser`) and get it ready to use. |
| Replaces          | `beforeEach` blocks and `new LoginPage(page)` lines repeated in every test.         |
| Enterprise value  | The main reuse tool. Teams share fixtures; setup and cleanup are never forgotten.   |

Example files (Phase 4): `pages.fixture.ts`, `auth.fixture.ts`, `index.ts`.

Example (simplified; real fixtures arrive in Phase 4):

```ts
// fixtures/pages.fixture.ts
import { test as base } from '@playwright/test';
import { TransferFundsPage } from '@pages/TransferFundsPage';

// Tell TypeScript which new names tests can ask for.
type PageFixtures = { transferFundsPage: TransferFundsPage };

export const test = base.extend<PageFixtures>({
  transferFundsPage: async ({ page }, use) => {
    // Setup: runs before the test.
    const transferFundsPage = new TransferFundsPage(page);

    // Hand it to the test.
    await use(transferFundsPage);

    // Cleanup: anything written here runs after the test, even if it failed.
  },
});
```

A test just writes `async ({ transferFundsPage }) => { ... }`. A fixture
that the test does not ask for does not run.

Doubt: "fixture or util?" A fixture sets up and cleans up something for a
test. A util is a plain helper function with no setup or cleanup.

## Support layers

### `testdata/`

|                   |                                                                                  |
| ----------------- | -------------------------------------------------------------------------------- |
| Holds             | Static data files (JSON, CSV, Excel) and data builders.                          |
| What a builder is | A function that creates a valid object with random values (using `faker`).       |
| Why               | Hard-coded data breaks when tests run in parallel or when the database is reset. |
| Rule              | Every test gets unique data. Never share one user between parallel tests.        |
| Enterprise value  | Parallel-safe tests, and data-driven tests from files.                           |

Example files (Phase 6): `customer.builder.ts`, `billpay.data.json`.

Example (simplified; real builders arrive in Phase 6):

```ts
// testdata/builders/customer.builder.ts
import { faker } from '@faker-js/faker';
import type { Customer } from '@app-types/customer';

// Gives a valid customer. Pass only the fields you want to control.
export function buildCustomer(overrides: Partial<Customer> = {}): Customer {
  return {
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    username: `user_${faker.string.alphanumeric(8)}`, // unique per call
    password: faker.internet.password(),
    ...overrides,
  };
}
```

```ts
// In a test or fixture:
const customer = buildCustomer({ firstName: 'Ravi' });
```

Doubt: "testdata or types?" `types/` says what a customer looks like (the
shape). `testdata/` creates actual customers (the values).

### `config/`

|                  |                                                                                     |
| ---------------- | ----------------------------------------------------------------------------------- |
| Holds            | Code that loads and checks environment settings.                                    |
| Why              | The same tests must run on QA, stage, and other environments without code changes.  |
| How              | Reads values from an env file with `dotenv`, checks them, and exports typed values. |
| Rule             | No URL or password is written in test code. Everything comes from config.           |
| Enterprise value | One command switches environment. Missing settings fail fast with a clear message.  |

Example file (Phase 2): `env.ts`.

Example (simplified; the real loader arrives in Phase 2):

```
# .env.qa   (VALUES. Not committed to Git.)
BASE_URL=https://parabank.parasoft.com/parabank
TEST_USERNAME=john
TEST_PASSWORD=secret123
```

```ts
// config/env.ts   (CODE. Committed to Git.)
import dotenv from 'dotenv';

// Pick the file from one variable: TEST_ENV=qa loads .env.qa
dotenv.config({ path: `.env.${process.env.TEST_ENV ?? 'qa'}` });

// Stop at once, with a clear message, if a value is missing.
function required(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`${name} is not set`);
  return value;
}

export const env = {
  baseUrl: required('BASE_URL'),
  username: required('TEST_USERNAME'),
  password: required('TEST_PASSWORD'),
};
```

Doubt: "`config/` has environment details, so why are env files in
`.gitignore`?" They are two different things.

|                  | `config/env.ts`                            | `.env.qa`, `.env.stage`             |
| ---------------- | ------------------------------------------ | ----------------------------------- |
| What it is       | Code                                       | Plain text values                   |
| Contains         | How to read and check the settings         | The real URLs, users, and passwords |
| Has secrets      | No. It knows only the NAME `TEST_PASSWORD` | Yes                                 |
| Committed to Git | Yes                                        | No                                  |

A new team member copies `.env.example` (committed, keys only) to
`.env.qa` and fills in the values. The CI pipeline gets the values from
its secret store, so it needs no env file.

### `utils/`

|                  |                                                                        |
| ---------------- | ---------------------------------------------------------------------- |
| Holds            | Small helper functions that are not tied to one page.                  |
| Examples         | Date and currency formatting, a logger, wait helpers, file readers.    |
| Rule             | Keep it small. If a helper knows about a page, it belongs in `pages/`. |
| Enterprise value | Avoids the same helper being written five times by five teams.         |

Example files (later phases): `logger.ts`, `currency.ts`.

Example (simplified):

```ts
// utils/currency.ts
// Turns the text "$1,250.50" from the page into the number 1250.5
export function parseCurrency(text: string): number {
  return Number(text.replace(/[$,]/g, ''));
}
```

It knows nothing about any page, so any team can use it.

### `types/`

|                  |                                                                        |
| ---------------- | ---------------------------------------------------------------------- |
| Holds            | Shared TypeScript types and interfaces.                                |
| Examples         | `Customer`, `Account`, `Transaction`, API response shapes.             |
| Why              | One definition used by page objects, API clients, builders, and tests. |
| Enterprise value | When the data model changes, the compiler shows every place to fix.    |

Example file (Phase 3 onwards): `customer.ts`.

Example (simplified; real types arrive in Phase 3):

```ts
// types/account.ts
export interface Account {
  id: number;
  customerId: number;
  type: 'CHECKING' | 'SAVINGS' | 'LOAN';
  balance: number;
}
```

The API client returns an `Account`, the page object reads an `Account`,
and the builder creates an `Account`. If a field is renamed here, the
compiler lists every file that must be fixed.

## Project and tooling folders

### `prompts/`

|                  |                                                                               |
| ---------------- | ----------------------------------------------------------------------------- |
| Holds            | Prompts and rules for AI coding tools (Cursor, Copilot, Claude Code).         |
| Why              | AI tools write better tests when they are told the framework's rules.         |
| Example          | A rules file: "use fixtures, no assertions in page objects, use `getByRole`". |
| Enterprise value | AI-generated code follows team standards, so reviews are faster.              |

Example (the real rules file arrives in Phase 9):

```markdown
<!-- prompts/test-code.md -->

You write Playwright tests for this framework. Rules:

- Import `test` and `expect` from `@fixtures/index`.
- Do not put locators in tests. Use or extend a page object in `pages/`.
- Do not put `expect` in page objects.
- Prefer `getByRole` and `getByLabel` locators.
- Create test data with builders from `testdata/builders/`.
```

### `docs/`

|                  |                                                       |
| ---------------- | ----------------------------------------------------- |
| Holds            | Explanations for people: this guide and others.       |
| Why              | New team members learn the framework without asking.  |
| Enterprise value | Faster onboarding and written standards (governance). |

### `.github/workflows/`

|                  |                                                                             |
| ---------------- | --------------------------------------------------------------------------- |
| Holds            | CI pipeline definitions for GitHub Actions.                                 |
| Current file     | `playwright.yml`: a quality job (typecheck, lint, format), then a test job. |
| Why              | Every push and pull request is checked automatically.                       |
| Enterprise value | Bad code cannot reach `main`. Results are visible to the whole team.        |

Example: what happens after `git push`.

1. GitHub sees a new commit on `main`.
2. It reads `playwright.yml` and starts the job "Typecheck and lint".
3. If that job passes, it starts the job "Playwright tests".
4. The Actions tab shows a green tick or a red cross for each job.

### `.husky/`

|              |                                                                            |
| ------------ | -------------------------------------------------------------------------- |
| Holds        | Git hook scripts. `pre-commit` runs before every commit.                   |
| What it does | Runs lint and format on the files being committed (through `lint-staged`). |
| Why          | Problems are caught on the developer's machine in seconds, before CI.      |
| Note         | The `_` sub-folder is created by Husky. Do not edit it.                    |

Example: what happens when you run `git commit`.

1. Git runs `.husky/pre-commit`.
2. That file runs `npx lint-staged`.
3. ESLint and Prettier run on the files you are committing.
4. If ESLint finds an error, for example a missing `await`, the commit is cancelled.

### `.vscode/`

|                  |                                                                   |
| ---------------- | ----------------------------------------------------------------- |
| Holds            | Editor settings and recommended extensions for this project.      |
| Why              | Everyone gets format-on-save and lint hints with no manual setup. |
| Enterprise value | The same editor behaviour for the whole team.                     |

Example: you press `Ctrl+S` in a test file. Because of
`.vscode/settings.json`, Prettier formats the file and ESLint fixes what
it can, with no extra steps from you.

## Generated and hidden folders

These are not written by you and are not pushed to GitHub (except `.git` itself, which is the repository).

| Folder               | Created by          | Holds                                                        |
| -------------------- | ------------------- | ------------------------------------------------------------ |
| `node_modules/`      | `npm install`       | All installed packages. Re-created from `package-lock.json`. |
| `.git/`              | `git init`          | The local repository: all commits and history.               |
| `playwright-report/` | A test run          | The HTML report.                                             |
| `test-results/`      | A test run          | Traces, screenshots, and videos of failed tests.             |
| `playwright/.auth/`  | Phase 4 login setup | Saved login sessions. These are secrets.                     |

## Root files

| File                   | Purpose                                                   |
| ---------------------- | --------------------------------------------------------- |
| `playwright.config.ts` | Test runner settings: browsers, retries, workers, reports |
| `tsconfig.json`        | TypeScript checking rules and import aliases              |
| `eslint.config.mjs`    | Lint rules                                                |
| `.prettierrc`          | Formatting rules                                          |
| `.prettierignore`      | Files Prettier skips                                      |
| `package.json`         | Project name, commands, and packages                      |
| `package-lock.json`    | Exact installed versions                                  |
| `.gitignore`           | Files Git does not track                                  |
| `.gitattributes`       | Line-ending rule                                          |
| `.env.example`         | List of environment settings, with no secrets             |
| `README.md`            | Setup steps, commands, and team rules                     |

## Common doubts

| Doubt                           | Answer                                                                                                |
| ------------------------------- | ----------------------------------------------------------------------------------------------------- |
| `config/` or `.env` files?      | `config/` is code and is committed. `.env.qa` holds values and secrets and is not committed.          |
| `pages/` or `components/`?      | A page is a full screen. A component is a part used on many screens.                                  |
| `fixtures/` or `utils/`?        | A fixture sets up and cleans up for a test. A util is a plain helper function.                        |
| `types/` or `testdata/`?        | A type is the shape of the data. Test data is the actual values.                                      |
| `types/` or `api/schemas/`?     | A type is checked while writing code. A schema is checked at run time against the real response.      |
| `tests/web` or `tests/e2e`?     | `web` tests one page or feature. `e2e` tests a full business flow across pages, often with API setup. |
| Where do locators go?           | Only in `pages/` and `components/`.                                                                   |
| Where do assertions go?         | Only in `tests/`.                                                                                     |
| Where do URLs and passwords go? | In env files, read through `config/`. Never in code.                                                  |
| Where does login setup go?      | In `fixtures/`, so tests start already logged in.                                                     |

## Rules that keep the structure clean

1. Tests contain steps and assertions, nothing else.
2. Page objects contain locators and actions, with no assertions.
3. Tests get everything through fixtures, not by creating objects themselves.
4. Test data is created per test, by API where possible.
5. No URL, user name, or password in code. Use `config/`.
6. Shared types live in `types/`; shared helpers live in `utils/`.
7. Import with aliases (`@pages/...`), not long relative paths.
