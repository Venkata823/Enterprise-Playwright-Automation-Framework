# Roadmap

The framework is built in nine phases. Each phase ends with working code
that is pushed to GitHub and a green pipeline.

Application under test: ParaBank (banking demo).

| Phase | Name                    | Main output                                            | Time     | Status  |
| ----- | ----------------------- | ------------------------------------------------------ | -------- | ------- |
| 1     | Foundation              | Structure, strict TypeScript, lint, hooks, CI gate     | 0.5 day  | Done    |
| 2     | Configuration           | Environments, projects, timeouts, first ParaBank test  | 0.5 day  | Next    |
| 3     | Page layer              | Base page, page objects, components                    | 1.5 days | Planned |
| 4     | Fixtures                | Custom fixtures, saved login state                     | 2 days   | Planned |
| 5     | API layer               | Typed API clients, schema checks, API tests            | 1.5 days | Planned |
| 6     | Test data               | Builders, unique data per test, cleanup                | 1 day    | Planned |
| 7     | Reporting and debugging | Reports, traces, visual and accessibility checks       | 1 day    | Planned |
| 8     | CI at scale             | Sharding, merged reports, Docker, quality gates        | 2 days   | Planned |
| 9     | AI-assisted testing     | Agents, Playwright CLI and MCP for all test activities | 3 days   | Planned |

Times assume 4 to 5 hours of work per day on a demo application.

## How to read the step tables

| Column                 | Meaning                                                  |
| ---------------------- | -------------------------------------------------------- |
| Files created          | New files or folders this step adds                      |
| Files changed          | Existing files this step edits or removes                |
| Files and folders used | Things the step reads or depends on, but does not change |

File names for future phases are the planned names. A few may change
slightly while building. `.gitkeep` files are removed when a folder gets
its first real file. "-" means none.

## Phase 1: Foundation (done)

Goal: a clean, strict, team-ready project before any test is written.

| Step | What we do                                                    | Files created                                                                                                                                                                       | Files changed                             | Files and folders used    | Why                            |
| ---- | ------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------- | ------------------------- | ------------------------------ |
| 1.1  | Install Node.js, Git, VS Code and three extensions            | -                                                                                                                                                                                   | -                                         | Your computer             | Working machine                |
| 1.2  | Create the project and install Playwright                     | `package.json`, `package-lock.json`, `playwright.config.ts`, `node_modules/`                                                                                                        | -                                         | npm                       | Base platform                  |
| 1.3  | Create the layered folder structure                           | `tests/` (with `web`, `api`, `db`, `e2e`, `visual`), `pages/`, `components/`, `api/endpoints/`, `api/schemas/`, `fixtures/`, `testdata/`, `config/`, `utils/`, `types/`, `prompts/` | -                                         | -                         | One job per folder             |
| 1.4  | Turn on strict TypeScript and import aliases                  | `tsconfig.json`                                                                                                                                                                     | `package.json` (TypeScript version)       | All code folders          | Errors found while writing     |
| 1.5  | Add type-aware lint rules, including the missing-`await` rule | `eslint.config.mjs`                                                                                                                                                                 | `package.json` (dev packages)             | `tsconfig.json`           | Stops flaky code early         |
| 1.6  | Add automatic formatting                                      | `.prettierrc`, `.prettierignore`                                                                                                                                                    | `package.json` (dev packages)             | -                         | Clean code reviews             |
| 1.7  | Add shared editor settings                                    | `.vscode/settings.json`, `.vscode/extensions.json`                                                                                                                                  | -                                         | `node_modules/typescript` | Same editor behaviour for all  |
| 1.8  | Add npm scripts for test, lint, typecheck, verify             | -                                                                                                                                                                                   | `package.json` (scripts)                  | -                         | One command per task           |
| 1.9  | Add a pre-commit check                                        | `.husky/pre-commit`                                                                                                                                                                 | `package.json` (`prepare`, `lint-staged`) | `.git/`                   | Bad code never enters the repo |
| 1.10 | Protect secrets and generated files                           | `.gitattributes`, `.env.example`                                                                                                                                                    | `.gitignore`                              | -                         | No secrets or reports in Git   |
| 1.11 | Add a CI pipeline with a quality gate before the tests        | -                                                                                                                                                                                   | `.github/workflows/playwright.yml`        | `package.json` scripts    | Automatic checks on every push |
| 1.12 | Write the README and guides                                   | `README.md`, `docs/FILES_EXPLAINED.md`, `docs/FOLDER_GUIDE.md`, `docs/ROADMAP.md`                                                                                                   | -                                         | -                         | Onboarding and standards       |
| 1.13 | Create the Git repository and push to GitHub                  | `.git/`                                                                                                                                                                             | -                                         | GitHub repository         | Shared, versioned code         |

Done when: `npm run verify` passes, a missing `await` is blocked by lint,
and the quality job is green on GitHub.

## Phase 2: Configuration

Goal: one config that runs the same tests on any environment and browser,
and a first real test that turns the pipeline green.

| Step | What we do                                                                     | Files created                                                    | Files changed                                        | Files and folders used                           | Why                                                  |
| ---- | ------------------------------------------------------------------------------ | ---------------------------------------------------------------- | ---------------------------------------------------- | ------------------------------------------------ | ---------------------------------------------------- |
| 2.1  | Create one env file per environment                                            | `.env.qa`, `.env.stage` (not committed)                          | `.env.example` (new keys)                            | `.gitignore` (already ignores `.env*`)           | Same tests, different servers                        |
| 2.2  | Write a typed env loader that fails fast when a value is missing               | `config/env.ts`                                                  | -                                                    | `.env.qa`, `.env.stage`, `dotenv` package        | Clear error at start, not a strange failure later    |
| 2.3  | Choose the environment with one variable (`TEST_ENV=qa`)                       | -                                                                | `package.json` (scripts, `cross-env` package)        | `config/env.ts`                                  | One command switches environment                     |
| 2.4  | Set `baseURL` and the test id attribute                                        | -                                                                | `playwright.config.ts`                               | `config/env.ts`                                  | Tests use short paths such as `/login`               |
| 2.5  | Set the four timeouts: test, expect, action, navigation                        | -                                                                | `playwright.config.ts`                               | -                                                | Slow pages fail with a clear reason                  |
| 2.6  | Set retries, workers, `fullyParallel`, `forbidOnly` for local and CI           | -                                                                | `playwright.config.ts`                               | `CI` environment variable                        | Fast locally, stable on CI                           |
| 2.7  | Define projects: chromium, firefox, webkit, and an API project with no browser | -                                                                | `playwright.config.ts`                               | `tests/web/`, `tests/e2e/`, `tests/api/`         | Cross-browser runs and fast API runs                 |
| 2.8  | Set what to record on failure: trace, screenshot, video                        | -                                                                | `playwright.config.ts`                               | `test-results/` (generated)                      | Evidence for debugging without slowing passing tests |
| 2.9  | Set reporters: list and HTML locally; GitHub and blob on CI                    | -                                                                | `playwright.config.ts`                               | `playwright-report/`, `blob-report/` (generated) | Right report for each place                          |
| 2.10 | Define tags (`@smoke`, `@regression`, `@api`) and matching scripts             | -                                                                | `package.json` (scripts), `README.md`                | `tests/`                                         | Each pipeline runs only what it needs                |
| 2.11 | Write the first smoke tests: home page loads, API answers                      | `tests/web/home.smoke.spec.ts`, `tests/api/health.smoke.spec.ts` | Remove `.gitkeep` from `tests/web/` and `tests/api/` | `playwright.config.ts`, `config/env.ts`          | Proves the config end to end                         |
| 2.12 | Pass environment values to the pipeline                                        | -                                                                | `.github/workflows/playwright.yml`                   | GitHub repository variables                      | CI runs against the right server                     |
| 2.13 | Commit, push, and confirm both jobs are green                                  | -                                                                | -                                                    | Git, GitHub Actions                              | First fully passing run                              |

Done when: `npm run test:smoke` passes locally and on GitHub, and changing
`TEST_ENV` switches the target server with no code change.

## Phase 3: Page layer

Goal: every screen of ParaBank is reachable through a page object, so tests
never contain locators.

| Step | What we do                                                                       | Files created                                                                                                                 | Files changed                           | Files and folders used                                                                                      | Why                                      |
| ---- | -------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------- | --------------------------------------- | ----------------------------------------------------------------------------------------------------------- | ---------------------------------------- |
| 3.1  | Agree the locator order: role, label, text, test id, then CSS as the last choice | `docs/LOCATOR_STANDARDS.md`                                                                                                   | `README.md` (link)                      | -                                                                                                           | Stable locators and fewer flaky tests    |
| 3.2  | Write the base page: holds `page`, common navigation, "page is loaded" check     | `pages/BasePage.ts`                                                                                                           | Remove `pages/.gitkeep`                 | `playwright.config.ts` (`baseURL`)                                                                          | Shared behaviour written once            |
| 3.3  | Write shared types                                                               | `types/customer.ts`, `types/account.ts`, `types/transaction.ts`                                                               | Remove `types/.gitkeep`                 | -                                                                                                           | One definition for pages, API, and data  |
| 3.4  | Write components used on many pages                                              | `components/AccountServicesMenu.ts`, `components/LoginPanel.ts`, `components/AccountsTable.ts`                                | Remove `components/.gitkeep`            | `types/`                                                                                                    | No duplicate locators                    |
| 3.5  | Write entry pages                                                                | `pages/HomePage.ts`, `pages/RegisterPage.ts`                                                                                  | -                                       | `pages/BasePage.ts`, `components/LoginPanel.ts`, `types/customer.ts`                                        | Needed by every flow                     |
| 3.6  | Write account pages                                                              | `pages/AccountsOverviewPage.ts`, `pages/OpenAccountPage.ts`, `pages/AccountActivityPage.ts`                                   | -                                       | `pages/BasePage.ts`, `components/AccountServicesMenu.ts`, `components/AccountsTable.ts`, `types/account.ts` | Core banking screens                     |
| 3.7  | Write transaction pages                                                          | `pages/TransferFundsPage.ts`, `pages/BillPayPage.ts`, `pages/FindTransactionsPage.ts`, `pages/RequestLoanPage.ts`             | -                                       | `pages/BasePage.ts`, `components/`, `types/transaction.ts`                                                  | Money movement flows                     |
| 3.8  | Apply the page rules: no assertions, methods named by user intent, typed inputs  | -                                                                                                                             | All files in `pages/` and `components/` | `docs/LOCATOR_STANDARDS.md`, `eslint.config.mjs`                                                            | Reusable for positive and negative tests |
| 3.9  | Write UI tests that use the pages                                                | `tests/web/register.spec.ts`, `tests/web/login.spec.ts`, `tests/web/open-account.spec.ts`, `tests/web/transfer-funds.spec.ts` | -                                       | `pages/`, `components/`, `types/`                                                                           | Proves the pages work                    |
| 3.10 | Review, lint, push                                                               | -                                                                                                                             | -                                       | `npm run verify`, GitHub Actions                                                                            | Quality gate on the new layer            |

Done when: register, login, open account, and transfer funds are automated,
and no test file contains a locator.

## Phase 4: Fixtures

Goal: tests ask for what they need by name and get it ready to use, with
setup and cleanup handled for them.

| Step | What we do                                                                             | Files created                                        | Files changed                                          | Files and folders used                                        | Why                                                      |
| ---- | -------------------------------------------------------------------------------------- | ---------------------------------------------------- | ------------------------------------------------------ | ------------------------------------------------------------- | -------------------------------------------------------- |
| 4.1  | Learn the fixture model: `test.extend`, test scope, worker scope, automatic fixtures   | `docs/FIXTURES.md`                                   | -                                                      | -                                                             | The base for everything in this phase                    |
| 4.2  | Create page fixtures, so tests stop writing `new LoginPage(page)`                      | `fixtures/pages.fixture.ts`                          | Remove `fixtures/.gitkeep`                             | `pages/`, `components/`                                       | Shorter tests and one place to build pages               |
| 4.3  | Create a user fixture that registers a new customer for each worker                    | `fixtures/user.fixture.ts`                           | -                                                      | `pages/RegisterPage.ts`, `types/customer.ts`, `config/env.ts` | ParaBank resets its data, so each run needs its own user |
| 4.4  | Save the login session and reuse it                                                    | `playwright/.auth/*.json` (generated, not committed) | `fixtures/user.fixture.ts`                             | `.gitignore` (already ignores `playwright/.auth/`)            | Log in once, not in every test                           |
| 4.5  | Create a "logged in page" fixture built on the saved session                           | `fixtures/auth.fixture.ts`                           | -                                                      | `fixtures/user.fixture.ts`, `playwright/.auth/`               | Tests start already logged in                            |
| 4.6  | Add cleanup after `use()` in fixtures that create data                                 | -                                                    | `fixtures/user.fixture.ts`, `fixtures/auth.fixture.ts` | -                                                             | No leftover data between tests                           |
| 4.7  | Add option fixtures for values that change per project                                 | `fixtures/options.fixture.ts`                        | `playwright.config.ts` (project options)               | -                                                             | One test, many configurations                            |
| 4.8  | Merge all fixtures and export one `test` and `expect`                                  | `fixtures/index.ts`                                  | -                                                      | All files in `fixtures/`                                      | Tests import from one place                              |
| 4.9  | Add a lint rule that blocks importing `test` straight from `@playwright/test` in tests | -                                                    | `eslint.config.mjs`                                    | `fixtures/index.ts`                                           | Everyone uses the framework's fixtures                   |
| 4.10 | Move existing tests to fixtures and remove repeated setup                              | -                                                    | All files in `tests/web/`                              | `fixtures/index.ts`                                           | Proves the design                                        |
| 4.11 | Run in parallel with several workers and confirm tests do not clash                    | -                                                    | `playwright.config.ts` (workers, if needed)            | GitHub Actions                                                | Proves test isolation                                    |

Done when: no test has login steps or `new SomePage(...)`, and the suite
passes with several workers in parallel.

## Phase 5: API layer

Goal: typed API clients for fast API tests and for creating test data
before UI tests.

| Step | What we do                                                                    | Files created                                                                                                                            | Files changed                                                          | Files and folders used                                          | Why                                              |
| ---- | ----------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------- | --------------------------------------------------------------- | ------------------------------------------------ |
| 5.1  | Study the ParaBank REST API and list the endpoints we need                    | `docs/API_NOTES.md`                                                                                                                      | -                                                                      | ParaBank API documentation                                      | Know the contract before coding                  |
| 5.2  | Write a base API client: base URL, headers, logging, error handling           | `api/BaseApiClient.ts`                                                                                                                   | -                                                                      | `config/env.ts`                                                 | Shared behaviour written once                    |
| 5.3  | Write one client per service                                                  | `api/endpoints/CustomersClient.ts`, `api/endpoints/AccountsClient.ts`, `api/endpoints/TransactionsClient.ts`                             | Remove `api/endpoints/.gitkeep`                                        | `api/BaseApiClient.ts`, `types/`                                | Typed, readable API calls                        |
| 5.4  | Add request and response types                                                | `types/api.ts`                                                                                                                           | Files in `api/endpoints/`                                              | `types/customer.ts`, `types/account.ts`                         | Compile-time safety                              |
| 5.5  | Write JSON schemas and a schema checker using `ajv`                           | `api/schemas/customer.schema.json`, `api/schemas/account.schema.json`, `api/schemas/transaction.schema.json`, `utils/schemaValidator.ts` | Remove `api/schemas/.gitkeep`, `utils/.gitkeep`                        | `ajv` package                                                   | Catches a broken contract, not just a bad status |
| 5.6  | Add API client fixtures                                                       | `fixtures/api.fixture.ts`                                                                                                                | `fixtures/index.ts`                                                    | `api/endpoints/`                                                | Tests get clients by name                        |
| 5.7  | Write API tests: positive, negative, and boundary cases                       | `tests/api/customers.spec.ts`, `tests/api/accounts.spec.ts`, `tests/api/transfers.spec.ts`                                               | -                                                                      | `fixtures/index.ts`, `api/schemas/`, `utils/schemaValidator.ts` | Fast coverage of business rules                  |
| 5.8  | Use the API to set up data for UI tests                                       | `tests/e2e/transfer-funds.e2e.spec.ts`                                                                                                   | `fixtures/user.fixture.ts`; remove `tests/e2e/.gitkeep`                | `api/endpoints/`, `pages/`                                      | "Set up by API, verify by UI"                    |
| 5.9  | Mock the network for UI cases that are hard to create, such as a server error | `tests/web/error-handling.spec.ts`                                                                                                       | -                                                                      | `pages/`, `fixtures/index.ts`                                   | Tests error handling without breaking the server |
| 5.10 | Run API tests on every pull request                                           | -                                                                                                                                        | `.github/workflows/playwright.yml`, `package.json` (`test:api` script) | `playwright.config.ts` (API project)                            | Fastest feedback first                           |

Done when: accounts and transfers can be created and checked by API, schema
checks run in API tests, and at least one UI test gets its data from the API.

## Phase 6: Test data

Goal: every test has its own correct data, created in code, safe for
parallel runs.

| Step | What we do                                                                                                                                 | Files created                                                                                                                    | Files changed                                                  | Files and folders used                                        | Why                                       |
| ---- | ------------------------------------------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------- | ------------------------------------------------------------- | ----------------------------------------- |
| 6.1  | Write the data strategy: what is created per test, per worker, or shared                                                                   | `docs/TEST_DATA.md`                                                                                                              | -                                                              | -                                                             | Clear rules before code                   |
| 6.2  | Write builders with `faker` and sensible defaults                                                                                          | `testdata/builders/customer.builder.ts`, `testdata/builders/payee.builder.ts`, `testdata/builders/transfer.builder.ts`           | Remove `testdata/.gitkeep`                                     | `@faker-js/faker` package, `types/`                           | Valid, unique data in one line            |
| 6.3  | Write factories that create real records through the API                                                                                   | `testdata/factories/customer.factory.ts`, `testdata/factories/account.factory.ts`                                                | -                                                              | `testdata/builders/`, `api/endpoints/`                        | A ready customer with accounts in seconds |
| 6.4  | Add static data files and typed readers for JSON, CSV, and Excel                                                                           | `testdata/files/billpay.data.json`, `testdata/files/transfers.data.csv`, `testdata/files/loans.data.xlsx`, `utils/dataReader.ts` | -                                                              | `csv-parse` and `xlsx` packages, `types/`                     | Business teams can supply data            |
| 6.5  | Write data-driven tests that loop over a data set                                                                                          | `tests/web/bill-pay.data.spec.ts`, `tests/api/transfers.data.spec.ts`                                                            | -                                                              | `testdata/files/`, `utils/dataReader.ts`, `fixtures/index.ts` | Many cases from one test body             |
| 6.6  | Add boundary and negative data sets, such as zero and very large amounts                                                                   | `testdata/files/transfer-boundaries.data.json`                                                                                   | The data-driven tests from 6.5                                 | -                                                             | Finds real defects                        |
| 6.7  | Make random data repeatable with a seed that is printed on failure                                                                         | -                                                                                                                                | Files in `testdata/builders/`, `config/env.ts`, `.env.example` | -                                                             | A failed run can be reproduced            |
| 6.8  | Add cleanup for data that must not stay                                                                                                    | -                                                                                                                                | `fixtures/user.fixture.ts`, `fixtures/api.fixture.ts`          | `api/endpoints/`                                              | Clean shared environments                 |
| 6.9  | Show the database check pattern with `mysql2`. The public ParaBank site has no database access, so this runs only against a local database | `utils/dbClient.ts`, `tests/db/accounts.db.spec.ts`                                                                              | `config/env.ts`, `.env.example`; remove `tests/db/.gitkeep`    | `mysql2` package                                              | Proves data is stored correctly           |
| 6.10 | Add rules against real customer data and secrets in test data                                                                              | -                                                                                                                                | `docs/TEST_DATA.md`, `README.md`                               | -                                                             | Privacy and compliance                    |

Done when: no test has hard-coded customer data, and the suite passes
several times in a row in parallel.

## Phase 7: Reporting and debugging

Goal: when a test fails, anyone can see what happened and why within minutes.

| Step | What we do                                                         | Files created                                                                  | Files changed                                                                | Files and folders used               | Why                                              |
| ---- | ------------------------------------------------------------------ | ------------------------------------------------------------------------------ | ---------------------------------------------------------------------------- | ------------------------------------ | ------------------------------------------------ |
| 7.1  | Finalise reporters for local and CI runs                           | -                                                                              | `playwright.config.ts`                                                       | -                                    | Right detail for each reader                     |
| 7.2  | Set up the Allure report with feature, severity, and owner labels  | `allure-results/` (generated, not committed)                                   | `playwright.config.ts`, `package.json` (report scripts)                      | `allure-playwright` package          | Report that managers can read                    |
| 7.3  | Wrap actions in `test.step` with business wording                  | -                                                                              | Files in `pages/` and `tests/`                                               | -                                    | Reports read like test cases                     |
| 7.4  | Attach useful evidence, such as API responses, to the report       | -                                                                              | `api/BaseApiClient.ts`, `fixtures/api.fixture.ts`                            | -                                    | Faster root cause analysis                       |
| 7.5  | Practise the Trace Viewer on a failed CI run                       | `docs/DEBUGGING.md`                                                            | -                                                                            | `test-results/` traces, CI artifacts | The main tool for "passes locally, fails on CI"  |
| 7.6  | Add a small logger with levels                                     | `utils/logger.ts`                                                              | `api/BaseApiClient.ts`, `config/env.ts` (log level)                          | -                                    | Consistent, searchable logs                      |
| 7.7  | Practise UI mode and the VS Code debugger                          | -                                                                              | `docs/DEBUGGING.md`                                                          | `.vscode/`, Playwright extension     | Faster local debugging                           |
| 7.8  | Add visual tests with screenshot comparison and a baseline process | `tests/visual/home.visual.spec.ts`, baseline screenshots under `tests/visual/` | `playwright.config.ts` (screenshot settings); remove `tests/visual/.gitkeep` | `pages/`                             | Catches layout defects                           |
| 7.9  | Add accessibility checks with `axe`                                | `fixtures/a11y.fixture.ts`, `tests/web/accessibility.spec.ts`                  | `fixtures/index.ts`                                                          | `@axe-core/playwright` package       | Catches WCAG problems early                      |
| 7.10 | Track flaky tests and add a quarantine tag with a fix deadline     | `docs/FLAKY_TESTS.md`                                                          | `package.json` (scripts), `README.md`                                        | Test reports                         | Flaky tests do not block or hide real failures   |
| 7.11 | Define the quality metrics shown to leadership                     | `docs/METRICS.md`                                                              | -                                                                            | Reports from CI                      | Pass rate, flaky rate, run time, escaped defects |

Done when: a failed CI test can be explained from the report and trace
alone, without re-running it.

## Phase 8: CI at scale

Goal: fast, reliable pipelines that act as release gates.

| Step | What we do                                                        | Files created                                                                                | Files changed                                                    | Files and folders used                              | Why                                      |
| ---- | ----------------------------------------------------------------- | -------------------------------------------------------------------------------------------- | ---------------------------------------------------------------- | --------------------------------------------------- | ---------------------------------------- |
| 8.1  | Split into three pipelines: pull request, nightly, release        | `.github/workflows/pr.yml`, `.github/workflows/nightly.yml`, `.github/workflows/release.yml` | Remove `.github/workflows/playwright.yml`                        | `package.json` scripts                              | Fast feedback first, full coverage later |
| 8.2  | Add a manual run with choices for environment, browser, and tag   | -                                                                                            | `.github/workflows/nightly.yml`                                  | `config/env.ts`, projects in `playwright.config.ts` | Anyone can run a chosen subset           |
| 8.3  | Split tests across machines with sharding                         | -                                                                                            | `.github/workflows/nightly.yml`, `.github/workflows/release.yml` | `playwright.config.ts` (blob reporter)              | Cuts run time                            |
| 8.4  | Merge the report pieces from all machines into one report         | -                                                                                            | `.github/workflows/nightly.yml`, `.github/workflows/release.yml` | `blob-report/` (generated)                          | One report for one run                   |
| 8.5  | Publish the report where the team can open it                     | -                                                                                            | Workflow files                                                   | `playwright-report/` (generated)                    | No downloads needed                      |
| 8.6  | Run tests in Docker with the official Playwright image            | `Dockerfile`, `.dockerignore`                                                                | Workflow files                                                   | `package.json`, `package-lock.json`                 | Same browsers and libraries everywhere   |
| 8.7  | Cache packages and browsers                                       | -                                                                                            | Workflow files                                                   | `package-lock.json`                                 | Shorter runs                             |
| 8.8  | Store secrets and per-environment values in the CI tool           | -                                                                                            | Workflow files                                                   | GitHub secrets and environments, `config/env.ts`    | No secrets in code                       |
| 8.9  | Protect `main` with required checks                               | -                                                                                            | -                                                                | GitHub repository settings                          | Bad code cannot be merged                |
| 8.10 | Define gates: which failures block and which only warn            | `docs/RELEASE_GATES.md`                                                                      | Workflow files                                                   | Tags, `docs/FLAKY_TESTS.md`                         | Clear release decisions                  |
| 8.11 | Run all browsers nightly and only Chromium on pull requests       | -                                                                                            | `.github/workflows/pr.yml`, `.github/workflows/nightly.yml`      | Projects in `playwright.config.ts`                  | Balance of speed and coverage            |
| 8.12 | Send results to the team: run summary and chat message            | -                                                                                            | Workflow files                                                   | GitHub secrets (chat webhook)                       | Failures are seen quickly                |
| 8.13 | Write the same pipeline for Jenkins and Azure DevOps as reference | `docs/ci/Jenkinsfile.example`, `docs/ci/azure-pipelines.example.yml`                         | -                                                                | `package.json` scripts                              | Shows the design works on any CI tool    |
| 8.14 | Measure and record run times against a target                     | -                                                                                            | `docs/METRICS.md`                                                | GitHub Actions run history                          | Proof of the improvement                 |

Done when: the pull request pipeline finishes within its time target, the
nightly run covers all browsers with one merged report, and `main` cannot
be merged into without green checks.

## Phase 9: AI-assisted testing

Goal: use AI agents for every testing activity, from requirements to
maintenance, while the framework's layers and quality gates stay in control.

Estimated time: 3 days. Needs Phases 1 to 4 at minimum, because agents
copy the patterns they find in real page objects and fixtures.

### The workflow

```
requirements  ->  AI analysis    ->  human review
              ->  AI test plan   ->  human review
              ->  AI test data   ->  typecheck
              ->  AI test code   ->  lint + typecheck + human review
              ->  CI run         ->  AI failure summary  ->  human decision
              ->  AI healing     ->  human review of every changed assertion
```

### Steps

| Step | What we do                                                                                   | Files created                                                                                                                  | Files changed                                           | Files and folders used                                            | Why                                        |
| ---- | -------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------- | ----------------------------------------------------------------- | ------------------------------------------ |
| 9.1  | Agent rules: state the layer rules and coding standards for AI agents                        | `AGENTS.md` (project root)                                                                                                     | `README.md` (link)                                      | `docs/FOLDER_GUIDE.md`, `eslint.config.mjs`                       | Agents follow the framework's rules        |
| 9.2  | Prompt library: one reusable prompt per activity                                             | `prompts/requirement-analysis.md`, `prompts/test-plan.md`, `prompts/test-data.md`, `prompts/test-code.md`, `prompts/review.md` | Remove `prompts/.gitkeep`                               | `AGENTS.md`                                                       | Same quality from every engineer           |
| 9.3  | Browser access for agents: Playwright CLI with skills, and Playwright MCP as the alternative | CLI skill files, MCP config file                                                                                               | `.gitignore` (add `.playwright-cli/`)                   | `playwright-cli`, Playwright MCP                                  | Agents verify locators in a real browser   |
| 9.4  | Requirement analysis: agent reads user stories and writes gaps, risks, and questions         | `requirements/<feature>.md`, `requirements/<feature>.analysis.md`                                                              | -                                                       | `prompts/requirement-analysis.md`                                 | Problems found before any test is written  |
| 9.5  | Test case design: agent explores the app and writes Markdown test plans                      | `specs/<feature>-plan.md`, agent definition files, `tests/seed.spec.ts`                                                        | -                                                       | `requirements/`, `prompts/test-plan.md`, Playwright planner agent | Reviewable plans before code               |
| 9.6  | Test data preparation: agent writes typed builders and boundary data sets                    | New files in `testdata/builders/` and `testdata/files/`                                                                        | -                                                       | `types/`, `prompts/test-data.md`                                  | Faster, wider data coverage                |
| 9.7  | Script writing: agent turns a reviewed plan into tests, page objects, and fixtures           | New files in `tests/`, `pages/`, `components/`                                                                                 | `fixtures/index.ts` (when new pages are added)          | `specs/`, `AGENTS.md`, Playwright generator agent, CLI or MCP     | Fast first drafts inside the layers        |
| 9.8  | Review of AI code: human checklist plus automatic gates                                      | `docs/AI_REVIEW_CHECKLIST.md`, `.github/pull_request_template.md`                                                              | -                                                       | `eslint.config.mjs`, `tsconfig.json`, CI                          | AI output meets the same bar as human code |
| 9.9  | Maintenance: agent repairs failing tests and opens a pull request                            | -                                                                                                                              | Files in `tests/` and `pages/` (through a pull request) | `test-results/` traces, Playwright healer agent                   | Less time spent on broken locators         |
| 9.10 | Failure analysis in CI: agent groups failures by likely cause                                | -                                                                                                                              | `.github/workflows/nightly.yml`                         | `playwright-report/`, `test-results/`                             | Faster triage each morning                 |
| 9.11 | Governance: rules for secrets, data privacy, cost limits, and measuring AI value             | `docs/AI_GOVERNANCE.md`                                                                                                        | `docs/METRICS.md`                                       | -                                                                 | Safe and measurable use of AI              |

### Folders this phase adds

| Folder or file          | Holds                                                      | Commit to Git   |
| ----------------------- | ---------------------------------------------------------- | --------------- |
| `requirements/`         | Source stories and the AI analysis of them                 | Yes             |
| `specs/`                | AI-written test plans, reviewed by a human                 | Yes             |
| Agent rules file (root) | Framework rules the agent reads on every task              | Yes             |
| Agent definition files  | Planner, generator, and healer definitions from Playwright | Yes             |
| MCP config file         | How the AI client starts Playwright MCP                    | Yes, no secrets |
| CLI skill files         | Command knowledge for `playwright-cli`                     | Yes             |
| `.playwright-cli/`      | Working snapshots from the CLI                             | No              |

### Human review checklist for AI output

1. Assertions match the business rule, not just what the page shows today.
2. A healed test was not weakened to make it pass.
3. No invented requirements in the analysis or the test plan.
4. Locators are user-facing (`getByRole`, `getByLabel`), not long CSS paths.
5. The code follows the layers: no locators in tests, no assertions in page objects.
6. No secrets or real customer data in prompts, plans, or test data.

### How we measure it

| Measure                           | Why                                            |
| --------------------------------- | ---------------------------------------------- |
| Time from story to merged test    | Shows the real speed gain                      |
| Share of AI code merged unchanged | Shows the quality of rules and prompts         |
| Flaky rate of AI-written tests    | Shows whether speed is costing stability       |
| Defects found by AI-written tests | Shows whether the tests check the right things |
| Token cost per merged test        | Keeps the spend visible                        |

### Done when

- One ParaBank feature goes from a user story to merged tests through the full workflow.
- Every stage has a prompt, an output folder, and a review step.
- The pipeline blocks AI code that breaks the layer rules.
