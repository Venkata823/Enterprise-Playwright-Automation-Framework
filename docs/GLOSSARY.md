# Glossary

Every term used in this framework, in simple words, from A to Z.

- "Where" shows the file or folder in this project that uses the term.
- "Phase N" means the item is planned and arrives in that phase (see [ROADMAP.md](./ROADMAP.md)).

## The four you will be asked first

| Term     | One-line meaning                                                                             |
| -------- | -------------------------------------------------------------------------------------------- |
| Lint     | An automatic check that reads code without running it and reports mistakes and bad patterns. |
| Prettier | A tool that formats code (spacing, quotes, line length) the same way for everyone.           |
| Git hook | A script that Git runs by itself at a certain moment, for example just before a commit.      |
| Husky    | A small tool that makes Git hooks easy to set up and share with the whole team.              |

How they work together: you run `git commit` → the Git hook `pre-commit` starts (set up by Husky) → it runs `lint-staged` → ESLint (lint) and Prettier (format) check the files you are committing → if lint finds an error, the commit is cancelled.

## A

| Term                 | Meaning                                                                                         | Where                              |
| -------------------- | ----------------------------------------------------------------------------------------------- | ---------------------------------- |
| Accessibility (a11y) | Checking that people with disabilities can use the app, for example with a screen reader.       | Phase 7                            |
| Action               | Something a user does on a page: click, type, select. Page objects expose actions as methods.   | `pages/`                           |
| Agent (AI agent)     | An AI tool that can carry out a task in steps, such as writing or fixing tests.                 | Phase 9                            |
| ajv                  | A package that checks whether JSON data matches a JSON schema.                                  | `package.json`, Phase 5            |
| Alias (import alias) | A short name for a folder in imports, such as `@pages/LoginPage`. Also called a path alias.     | `tsconfig.json` (`paths`)          |
| Allure               | A report tool that shows test results with features, severity, and history.                     | `package.json`, Phase 7            |
| API                  | A way for programs to talk to the application without the screen.                               | `api/`, `tests/api/`               |
| API client           | A class in the framework with one method per API operation.                                     | `api/endpoints/`, Phase 5          |
| Artifact (CI)        | A file saved from a pipeline run, such as the HTML report, that can be downloaded later.        | `.github/workflows/playwright.yml` |
| Assertion            | A check that something is correct, written with `expect`. If it is wrong, the test fails.       | `tests/`                           |
| async / await        | Keywords for actions that take time. `await` means "wait for this to finish before continuing". | All test code                      |
| Auto-wait            | Playwright waits by itself until an element is ready before acting on it.                       | Built into Playwright              |
| axe                  | A tool that finds accessibility problems on a page.                                             | `package.json`, Phase 7            |

## B

| Term              | Meaning                                                                                       | Where                           |
| ----------------- | --------------------------------------------------------------------------------------------- | ------------------------------- |
| Base page         | A parent class that holds what all page objects share.                                        | `pages/BasePage.ts`, Phase 3    |
| baseURL           | The start address of the app, so tests write `/login` and not the full URL.                   | `playwright.config.ts`, Phase 2 |
| Blob report       | Report pieces created by each CI machine, later merged into one report.                       | `.gitignore`, Phase 8           |
| Boundary data     | Test values at the edges of what is allowed, such as zero or the largest amount.              | Phase 6                         |
| Branch            | A separate line of work in Git. Changes are made on a branch and then merged.                 | Git                             |
| Branch protection | GitHub rules that stop code from reaching `main` without review and passing checks.           | GitHub settings, Phase 8        |
| Browser context   | A fresh, separate browser session. Each test gets its own, so tests do not affect each other. | Built into Playwright           |
| Builder           | A function that creates a valid test data object with random values.                          | `testdata/builders/`, Phase 6   |

## C

| Term           | Meaning                                                                                  | Where                              |
| -------------- | ---------------------------------------------------------------------------------------- | ---------------------------------- |
| Cache (CI)     | Saved downloads that the pipeline reuses to run faster.                                  | Workflow file (`cache: npm`)       |
| CD             | Continuous Delivery or Deployment: releasing automatically after checks pass.            | Phase 8                            |
| CI             | Continuous Integration: every push is checked and tested automatically.                  | `.github/workflows/`               |
| CI/CD pipeline | The automatic series of steps that checks, tests, and releases code.                     | `.github/workflows/playwright.yml` |
| CLI            | Command-line interface: a tool used by typing commands in the terminal.                  | `npx playwright`, `git`, `npm`     |
| Commit         | A saved snapshot of changes in Git, with a message.                                      | Git                                |
| CommonJS       | The older module system of Node.js. This project is set to it with `"type": "commonjs"`. | `package.json`                     |
| Component      | A class for a UI part that appears on many pages, such as a menu or table.               | `components/`, Phase 3             |
| Config         | Settings that control how the tool or framework behaves.                                 | `playwright.config.ts`, `config/`  |
| Contract (API) | The agreed shape of an API request and response. A schema check tests it.                | `api/schemas/`, Phase 5            |
| cross-env      | A package that sets environment variables the same way on Windows, Mac, and Linux.       | Phase 2                            |
| CSV            | A plain text data file with values separated by commas.                                  | `testdata/`, Phase 6               |

## D

| Term             | Meaning                                                                                          | Where                   |
| ---------------- | ------------------------------------------------------------------------------------------------ | ----------------------- |
| Data-driven test | One test body that runs many times with different data rows.                                     | Phase 6                 |
| Dependency       | A package the project needs. Listed under `dependencies`.                                        | `package.json`          |
| devDependency    | A package needed only for building and checking, such as ESLint. Listed under `devDependencies`. | `package.json`          |
| Docker           | A way to run code in a fixed, repeatable environment (a container).                              | Phase 8                 |
| DOM              | The browser's tree of all elements on a page. Locators search it.                                | Browser                 |
| dotenv           | A package that reads values from an env file into `process.env`.                                 | `package.json`, Phase 2 |

## E

| Term                 | Meaning                                                                                         | Where                                   |
| -------------------- | ----------------------------------------------------------------------------------------------- | --------------------------------------- |
| E2E test             | End-to-end test: a full business flow across several pages, like a real user.                   | `tests/e2e/`                            |
| Endpoint             | One address of an API, such as `/accounts/123`.                                                 | `api/endpoints/`                        |
| Environment          | A copy of the application for a purpose: QA, stage, production.                                 | Env files, `config/`                    |
| Environment variable | A named value given to a program from outside, such as `BASE_URL`.                              | `process.env`, env files                |
| Env file             | A text file of environment variables, such as `.env.qa`. Holds secrets, so it is not committed. | `.env.example` shows the keys           |
| ESLint               | The lint tool used here. It applies the rules in `eslint.config.mjs`.                           | `eslint.config.mjs`, `npm run lint`     |
| ESM                  | ES Modules: the modern `import` / `export` module system.                                       | `eslint.config.mjs` (the `.mjs` ending) |
| expect               | The Playwright function used to write assertions.                                               | `tests/`                                |

## F

| Term          | Meaning                                                                       | Where                            |
| ------------- | ----------------------------------------------------------------------------- | -------------------------------- |
| Factory       | A function that creates a real record in the app, usually through the API.    | `testdata/factories/`, Phase 6   |
| Faker         | A package that makes random, realistic data such as names and addresses.      | `package.json`, Phase 6          |
| Fixture       | Setup and cleanup code that Playwright runs for a test and passes in by name. | `fixtures/`, Phase 4             |
| Flaky test    | A test that sometimes passes and sometimes fails with no code change.         | Prevented by lint rules; Phase 7 |
| forbidOnly    | A setting that fails the CI run if someone left `test.only` in the code.      | `playwright.config.ts`           |
| Format        | The look of the code: spacing, quotes, line breaks. Prettier controls it.     | `.prettierrc`, `npm run format`  |
| fullyParallel | A setting that runs all tests in parallel, even tests inside one file.        | `playwright.config.ts`           |

## G

| Term              | Meaning                                                                                      | Where                         |
| ----------------- | -------------------------------------------------------------------------------------------- | ----------------------------- |
| Git               | The version control tool. It records every change to the code.                               | `.git/`                       |
| Git hook          | A script that Git runs by itself at a certain moment, such as before a commit.               | `.husky/pre-commit`           |
| GitHub            | The website that stores the repository and runs the pipeline.                                | Remote repository             |
| GitHub Actions    | GitHub's built-in CI/CD tool.                                                                | `.github/workflows/`          |
| .gitattributes    | A file that tells Git how to treat files. Here it forces the same line endings for everyone. | `.gitattributes`              |
| .gitignore        | A file that lists what Git must not track, such as `node_modules` and env files.             | `.gitignore`                  |
| .gitkeep          | An empty file that makes Git keep an otherwise empty folder.                                 | Empty folders                 |
| grep (tag filter) | A Playwright option that runs only tests whose title matches, such as `--grep @smoke`.       | `package.json` (`test:smoke`) |

## H

| Term        | Meaning                                                                    | Where                                  |
| ----------- | -------------------------------------------------------------------------- | -------------------------------------- |
| Headed      | Running tests with the browser window visible.                             | `npm run test:headed`                  |
| Headless    | Running tests with no visible browser window. The default, and used on CI. | Built into Playwright                  |
| Healer      | A Playwright AI agent that runs failing tests and tries to repair them.    | Phase 9                                |
| HTML report | Playwright's built-in report, opened in a browser.                         | `playwright-report/`, `npm run report` |
| Husky       | A tool that sets up and shares Git hooks through the project.              | `.husky/`, `package.json` (`prepare`)  |

## I

| Term      | Meaning                                                                            | Where             |
| --------- | ---------------------------------------------------------------------------------- | ----------------- |
| Interface | A TypeScript description of the shape of an object, such as what an `Account` has. | `types/`, Phase 3 |

## J

| Term        | Meaning                                                                 | Where                             |
| ----------- | ----------------------------------------------------------------------- | --------------------------------- |
| Job         | A group of pipeline steps that run on one machine.                      | Workflow file (`quality`, `test`) |
| JSON        | A common text format for data and settings. It does not allow comments. | `package.json`, `.prettierrc`     |
| JSON Schema | A JSON file that describes the expected shape of some JSON data.        | `api/schemas/`, Phase 5           |
| JSONC       | JSON that allows comments.                                              | `tsconfig.json`, `.vscode/*.json` |

## L

| Term         | Meaning                                                                                           | Where                               |
| ------------ | ------------------------------------------------------------------------------------------------- | ----------------------------------- |
| Layer        | A group of code with one job and a rule about what it may call. Calls go downward only.           | `docs/FOLDER_GUIDE.md`              |
| Line endings | The hidden characters at the end of each line. Windows uses CRLF; Linux and Mac use LF.           | `.gitattributes`                    |
| Lint         | An automatic check that reads code without running it and reports mistakes and bad patterns.      | `eslint.config.mjs`, `npm run lint` |
| lint-staged  | A tool that runs lint and format only on the files being committed.                               | `package.json` (`lint-staged`)      |
| Locator      | Playwright's way to find an element on a page, such as `getByRole('button', { name: 'Log In' })`. | `pages/`, `components/`             |
| Lock file    | `package-lock.json`: the exact version of every installed package.                                | `package-lock.json`                 |

## M

| Term           | Meaning                                                                        | Where                  |
| -------------- | ------------------------------------------------------------------------------ | ---------------------- |
| main           | The main branch. It should always hold working, reviewed code.                 | Git                    |
| Markdown       | A simple text format for documents. Files end in `.md`.                        | `README.md`, `docs/`   |
| MCP            | Model Context Protocol: a standard way to give AI tools access to other tools. | Phase 9                |
| Mermaid        | A way to write diagrams as text inside Markdown.                               | `docs/ARCHITECTURE.md` |
| Merge          | Bringing the changes of one branch into another.                               | Git, pull requests     |
| Mock (network) | Replacing a real server response with a made-up one during a test.             | Phase 5                |

## N

| Term         | Meaning                                                                              | Where                        |
| ------------ | ------------------------------------------------------------------------------------ | ---------------------------- |
| Node.js      | The program that runs JavaScript and TypeScript tools outside a browser.             | Your computer, CI            |
| node_modules | The folder where npm puts all installed packages. Never committed.                   | `node_modules/`              |
| npm          | The package manager for Node.js. It installs packages and runs scripts.              | `npm install`, `npm run ...` |
| npm ci       | A clean install that uses the lock file exactly. Used in pipelines.                  | Workflow file                |
| npm script   | A short command name defined in `package.json`, run with `npm run <name>`.           | `package.json` (`scripts`)   |
| npx          | A command that runs a tool from an installed package, such as `npx playwright test`. | Terminal                     |

## O

| Term   | Meaning                                               | Where           |
| ------ | ----------------------------------------------------- | --------------- |
| origin | The default name for the remote repository on GitHub. | `git remote -v` |

## P

| Term                 | Meaning                                                                                                      | Where                               |
| -------------------- | ------------------------------------------------------------------------------------------------------------ | ----------------------------------- |
| package.json         | The project's identity card: name, scripts, and packages.                                                    | `package.json`                      |
| Page object          | A class for one page of the app, holding its locators and actions. The pattern is called POM.                | `pages/`, Phase 3                   |
| ParaBank             | The demo banking application that this framework tests.                                                      | `.env.example`                      |
| Parallel run         | Running several tests at the same time to save time.                                                         | `playwright.config.ts`              |
| Planner, generator   | Playwright AI agents. The planner writes a test plan; the generator turns it into test code.                 | Phase 9                             |
| Playwright           | The test automation tool by Microsoft that drives browsers and calls APIs.                                   | `@playwright/test`                  |
| Playwright CLI       | `playwright-cli`: commands that let AI coding agents drive a browser. Not the same as `npx playwright test`. | Phase 9                             |
| Pre-commit hook      | The Git hook that runs just before a commit is created.                                                      | `.husky/pre-commit`                 |
| Prettier             | The tool that formats code the same way for everyone.                                                        | `.prettierrc`, `npm run format`     |
| Project (Playwright) | A named group of settings in the config, usually one per browser.                                            | `playwright.config.ts` (`projects`) |
| Promise              | A value that will be ready later. Most Playwright calls return one, so they need `await`.                    | All test code                       |
| Pull request         | A request on GitHub to merge a branch, with review and checks.                                               | GitHub                              |
| Push                 | Sending local commits to the remote repository.                                                              | `git push`                          |

## Q

| Term         | Meaning                                                                              | Where                  |
| ------------ | ------------------------------------------------------------------------------------ | ---------------------- |
| Quality gate | A check that must pass before the next step is allowed.                              | Workflow job `quality` |
| Quarantine   | Moving a flaky test aside with a tag, so it does not block others while it is fixed. | Phase 7                |

## R

| Term            | Meaning                                                                              | Where                               |
| --------------- | ------------------------------------------------------------------------------------ | ----------------------------------- |
| Regression test | A test that checks existing features still work after a change.                      | Tag `@regression`, Phase 2          |
| Remote          | A copy of the repository on a server, such as GitHub.                                | `git remote -v`                     |
| Reporter        | The part of Playwright that writes results, such as the HTML or list reporter.       | `playwright.config.ts` (`reporter`) |
| Repository      | The project with its full Git history. Short form: repo.                             | `.git/`, GitHub                     |
| REST API        | A common style of API that uses web addresses and HTTP methods such as GET and POST. | `api/`, `tests/api/`                |
| Retry           | Running a failed test again automatically.                                           | `playwright.config.ts` (`retries`)  |
| Runner          | The machine that runs a pipeline job.                                                | Workflow file (`runs-on`)           |

## S

| Term          | Meaning                                                                  | Where                              |
| ------------- | ------------------------------------------------------------------------ | ---------------------------------- |
| Schema        | A description of the expected shape of data. See JSON Schema.            | `api/schemas/`                     |
| Secret        | A private value such as a password or token. Never stored in code.       | Env files, GitHub secrets          |
| Sharding      | Splitting the tests across several machines to finish faster.            | Phase 8                            |
| Smoke test    | A small, fast set of tests that checks the most important features work. | Tag `@smoke`, `npm run test:smoke` |
| Spec file     | A test file. Its name ends in `.spec.ts`.                                | `tests/`                           |
| Staged files  | Files marked with `git add` to be included in the next commit.           | Git, `lint-staged`                 |
| Step (CI)     | One command or action inside a pipeline job.                             | Workflow file (`steps`)            |
| Storage state | A saved login session (cookies and tokens) that tests can reuse.         | `playwright/.auth/`, Phase 4       |
| Strict mode   | TypeScript's strongest checking, turned on with `"strict": true`.        | `tsconfig.json`                    |

## T

| Term              | Meaning                                                                               | Where                           |
| ----------------- | ------------------------------------------------------------------------------------- | ------------------------------- |
| Tag               | A label in a test title, such as `@smoke`, used to choose which tests to run.         | `tests/`, `package.json`        |
| Test data         | The values a test uses, such as a customer and an amount.                             | `testdata/`                     |
| Test ID           | A special attribute added to an element so tests can find it reliably.                | `getByTestId`, Phase 2          |
| Test pyramid      | A guide: many fast low-level tests, fewer UI tests, very few end-to-end tests.        | `tests/` sub-folders            |
| test.step         | A Playwright function that names a group of actions, so reports read like test cases. | Phase 7                         |
| Timeout           | The longest time allowed for a test or an action before it fails.                     | `playwright.config.ts`, Phase 2 |
| Trace             | A recording of a test run: screenshots, page state, and network calls.                | `test-results/`                 |
| Trace Viewer      | The Playwright tool that opens a trace to show what happened step by step.            | `npx playwright show-trace`     |
| tsc               | The TypeScript compiler. Here it is used only to check types.                         | `npm run typecheck`             |
| tsconfig.json     | The settings file for TypeScript.                                                     | `tsconfig.json`                 |
| Type              | A description of what kind of value something is: a number, a string, a `Customer`.   | `types/`                        |
| Typecheck         | Checking that all values are used according to their types, without running the code. | `npm run typecheck`             |
| TypeScript        | JavaScript with types added. Mistakes are found while writing.                        | All `.ts` files                 |
| typescript-eslint | The package that lets ESLint understand TypeScript and use type information.          | `eslint.config.mjs`             |

## U

| Term    | Meaning                                                                     | Where                  |
| ------- | --------------------------------------------------------------------------- | ---------------------- |
| UI mode | Playwright's interactive window for running, watching, and debugging tests. | `npm run test:ui-mode` |
| Util    | A small general helper function, not tied to any page.                      | `utils/`               |

## V

| Term            | Meaning                                                                               | Where                    |
| --------------- | ------------------------------------------------------------------------------------- | ------------------------ |
| Version symbols | In `package.json`: `^1.2.3` allows 1.x.x updates, `~1.2.3` allows only 1.2.x updates. | `package.json`           |
| Viewport        | The size of the browser window used in a test.                                        | `playwright.config.ts`   |
| Visual test     | A test that compares a screenshot with a saved, approved one.                         | `tests/visual/`, Phase 7 |
| VS Code         | The code editor used for this project.                                                | `.vscode/`               |

## W

| Term     | Meaning                                                                             | Where                              |
| -------- | ----------------------------------------------------------------------------------- | ---------------------------------- |
| WCAG     | The international guidelines for web accessibility.                                 | Phase 7                            |
| Worker   | A separate process that runs tests. More workers means more tests at the same time. | `playwright.config.ts` (`workers`) |
| Workflow | A GitHub Actions pipeline, defined in one `.yml` file.                              | `.github/workflows/playwright.yml` |

## X

| Term | Meaning                                               | Where                   |
| ---- | ----------------------------------------------------- | ----------------------- |
| xlsx | The Excel file format, and the package that reads it. | `package.json`, Phase 6 |

## Y

| Term | Meaning                                                                           | Where                              |
| ---- | --------------------------------------------------------------------------------- | ---------------------------------- |
| YAML | A text format for settings that uses indentation. Files end in `.yml` or `.yaml`. | `.github/workflows/playwright.yml` |

There are no terms for K and Z in this framework.
