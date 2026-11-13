# ParaBank Playwright Framework

Enterprise test automation framework built with Playwright and TypeScript.
Application under test: [ParaBank](https://parabank.parasoft.com/parabank) (banking demo).

## Setup

```bash
npm install
npx playwright install
```

## Commands

| Command                | What it does                             |
| ---------------------- | ---------------------------------------- |
| `npm test`             | Run all tests                            |
| `npm run test:smoke`   | Run tests tagged `@smoke`                |
| `npm run test:ui-mode` | Open Playwright UI mode                  |
| `npm run report`       | Open the last HTML report                |
| `npm run typecheck`    | Check TypeScript types                   |
| `npm run lint`         | Check code rules                         |
| `npm run format`       | Format all files                         |
| `npm run verify`       | Typecheck + lint + format check together |

## Folder structure

| Folder       | Holds                                              |
| ------------ | -------------------------------------------------- |
| `tests/web`  | UI tests                                           |
| `tests/api`  | API tests                                          |
| `tests/db`   | Database tests                                     |
| `pages`      | Page objects (locators and actions, no assertions) |
| `components` | Shared UI parts (header, menus, tables)            |
| `api`        | API clients (`endpoints`) and response `schemas`   |
| `fixtures`   | Custom Playwright fixtures                         |
| `testdata`   | Test data files and data builders                  |
| `utils`      | Helpers, logger, environment config                |
| `types`      | Shared TypeScript types                            |
| `prompts`    | Prompts and rules for AI coding tools              |

## Import aliases

Use aliases instead of long relative paths:

```ts
import { LoginPage } from '@pages/LoginPage';
```

Available: `@config`, `@pages`, `@components`, `@api`, `@fixtures`, `@testdata`, `@utils`, `@app-types`.

## Team rules

- `main` is protected. Work on `feature/<ticket>-short-name` branches.
- Every pull request needs one reviewer and a green pipeline (typecheck, lint, tests).
- Commit messages start with `feat:`, `fix:`, `test:` or `chore:`.
- Every Playwright call that returns a promise must have `await`. Lint blocks the commit if not.
- Each test creates its own data and does not depend on another test.
- Assertions go in tests, not in page objects.
- Never commit passwords or env files. Use `.env.example` to list the keys only.
