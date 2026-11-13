# Files explained

Some files cannot hold comments (JSON does not allow them), and some are
tool-managed. This page explains those files line by line.
All other files have their comments inside the file itself.

## package.json

The identity card of the project: its name, its commands, and its packages.

```jsonc
{
  "name": "parabank-playwright-framework", // project name
  "version": "1.0.0", // project version
  "description": "...", // one-line summary
  "type": "commonjs", // how Node.js loads .js files in this project

  "scripts": {
    // short commands, run with: npm run <name>
    "test": "playwright test", // run all tests
    "test:smoke": "playwright test --grep @smoke", // run only tests tagged @smoke
    "test:headed": "playwright test --headed", // run with the browser window visible
    "test:ui-mode": "playwright test --ui", // open Playwright's interactive UI
    "report": "playwright show-report", // open the last HTML report
    "typecheck": "tsc --noEmit", // check types, create no output files
    "lint": "eslint .", // check code rules in all files
    "lint:fix": "eslint . --fix", // same, and auto-fix what it can
    "format": "prettier --write .", // format all files
    "format:check": "prettier --check .", // only report unformatted files (used on CI)
    "verify": "npm run typecheck && npm run lint && npm run format:check",
    // all three quality checks; stops at the first failure
    "prepare": "husky", // runs automatically after "npm install";
    // connects Git to the .husky folder
  },

  "lint-staged": {
    // what to run on files that are staged for commit
    "*.ts": ["eslint --fix", "prettier --write"], // TypeScript files: lint, then format
    "*.{json,md,yml}": ["prettier --write"], // JSON, Markdown, YAML files: format only
  },

  "devDependencies": {
    // tools needed to build and check the framework
    "@playwright/test": "...", // the test runner and browser automation
    "@types/node": "...", // type definitions for Node.js (process, path, ...)
    "eslint": "...", // the lint engine
    "eslint-config-prettier": "...", // switches off ESLint rules that clash with Prettier
    "eslint-plugin-playwright": "...", // lint rules for Playwright tests
    "husky": "...", // runs scripts on Git events (pre-commit)
    "lint-staged": "...", // runs tools only on the files being committed
    "prettier": "...", // the code formatter
    "typescript": "~6.0.3", // the type checker. "~" allows only 6.0.x updates,
    // because typescript-eslint does not support 7 yet
    "typescript-eslint": "...", // lets ESLint understand TypeScript
  },

  "dependencies": {
    // libraries used by the test code itself
    "@axe-core/playwright": "...", // accessibility checks (WCAG)
    "@faker-js/faker": "...", // random test data (names, addresses, amounts)
    "ajv": "...", // checks API responses against JSON schemas
    "allure-playwright": "...", // Allure reporter
    "csv-parse": "...", // reads CSV test data
    "dotenv": "...", // loads values from env files into process.env
    "mysql2": "...", // connects to MySQL for database tests
    "xlsx": "...", // reads Excel test data
  },
}
```

Version symbols: `^1.2.3` allows any 1.x.x update, `~1.2.3` allows only
1.2.x updates, and `1.2.3` allows exactly that version.

## package-lock.json

Written by npm; never edit it by hand. It records the exact version of
every installed package, so that every machine and the CI server install
the same thing. `npm ci` (used in the pipeline) installs strictly from
this file. Always commit it.

## .prettierrc

Formatting rules for Prettier.

```jsonc
{
  "singleQuote": true, // use 'text' instead of "text"
  "semi": true, // end statements with a semicolon
  "printWidth": 100, // wrap lines longer than 100 characters
  "trailingComma": "all", // add a comma after the last item in multi-line lists,
  // which keeps Git diffs small
}
```

## .husky/pre-commit

```bash
npx lint-staged   # before every "git commit", run lint-staged
```

Flow: `git commit` → Git calls this file → `lint-staged` reads its rules
from package.json → ESLint and Prettier run on the staged files → if
ESLint finds an error, the commit is cancelled.

The `.husky/_` folder is created by Husky itself; do not edit it.

## .vscode/settings.json

Editor settings shared by everyone who opens this project in VS Code.

```jsonc
{
  "editor.formatOnSave": true, // format the file on every save
  "editor.defaultFormatter": "esbenp.prettier-vscode", // use the Prettier extension to format
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": "explicit", // auto-fix ESLint problems on manual save
  },
  "typescript.tsdk": "node_modules/typescript/lib", // use the project's TypeScript version,
  // not the one bundled with VS Code
  "files.eol": "\n", // new files use Linux line endings (LF)
}
```

## .vscode/extensions.json

```jsonc
{
  "recommendations": [
    // VS Code suggests these to anyone opening the project
    "ms-playwright.playwright", // run and debug tests from the editor
    "dbaeumer.vscode-eslint", // show lint errors while typing
    "esbenp.prettier-vscode", // format on save
  ],
}
```

## .github/workflows/playwright.yml

The CI pipeline. GitHub runs every `.yml` file in this folder.

```yaml
name: Playwright Tests # name shown in the Actions tab

on: # WHEN the pipeline starts
  push:
    branches: [main, master] # on every push to main (or master)
  pull_request:
    branches: [main, master] # on every pull request that targets main

jobs: # WHAT the pipeline does
  quality: # JOB 1 (internal id)
    name: Typecheck and lint # name shown on GitHub
    timeout-minutes: 10 # stop the job if it runs longer than 10 minutes
    runs-on: ubuntu-latest # use a fresh GitHub Linux machine
    steps:
      - uses: actions/checkout@v4 # download the repo code onto the machine
      - uses: actions/setup-node@v4 # install Node.js
        with:
          node-version: lts/* # the latest long-term-support version
          cache: npm # reuse downloaded packages to save time
      - name: Install dependencies
        run: npm ci # clean install, exactly from package-lock.json
      - name: Typecheck
        run: npm run typecheck # fail on any type error
      - name: Lint
        run: npm run lint # fail on any lint error
      - name: Format check
        run: npm run format:check # fail on any unformatted file

  test: # JOB 2
    name: Playwright tests
    needs: quality # run only if JOB 1 passed (the quality gate)
    timeout-minutes: 60
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: lts/*
          cache: npm
      - name: Install dependencies
        run: npm ci
      - name: Install Playwright Browsers
        run: npx playwright install --with-deps # download browsers and their Linux libraries
      - name: Run Playwright tests
        run: npx playwright test # run all tests; CI=true is set by GitHub
      - uses: actions/upload-artifact@v4 # save files from the run
        if: ${{ !cancelled() }} # upload even when tests failed
        with:
          name: playwright-report # name of the download on GitHub
          path: playwright-report/ # folder to upload
          retention-days: 30 # keep it for 30 days
```

## .gitkeep files

Git does not track empty folders. An empty file named `.gitkeep` inside a
folder makes Git keep that folder. Delete the `.gitkeep` once the folder
has real files.

## Files with comments inside

| File                   | Purpose                               |
| ---------------------- | ------------------------------------- |
| `tsconfig.json`        | TypeScript checking rules and aliases |
| `eslint.config.mjs`    | Lint rules                            |
| `playwright.config.ts` | Test runner settings                  |
| `.gitignore`           | What Git must not track               |
| `.prettierignore`      | What Prettier must not format         |
| `.gitattributes`       | Line-ending rule for Git              |
| `.env.example`         | List of environment settings          |
