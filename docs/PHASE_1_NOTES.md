# Phase 1 notes: Foundation

Notes for a newcomer. You do not need to know Playwright to read this.

Phase 1 builds the base of the framework. No real tests are written yet.
The goal is a project where mistakes are caught automatically, before
they become failing tests.

Related pages: [FOLDER_GUIDE.md](./FOLDER_GUIDE.md) (every folder),
[FILES_EXPLAINED.md](./FILES_EXPLAINED.md) (every config line),
[GLOSSARY.md](./GLOSSARY.md) (every term),
[ARCHITECTURE.md](./ARCHITECTURE.md) (diagrams).

## 1. Basics first

### What is test automation?

A person can test an application by clicking through it by hand. Test
automation is code that does the same clicks and checks, so the tests can
run in minutes, at any time, without a person.

### What is Playwright?

Playwright is a free tool from Microsoft. It opens a real browser, does
what a user would do, and checks the result.

```ts
import { test, expect } from '@playwright/test';

test('home page has the right title', async ({ page }) => {
  await page.goto('https://parabank.parasoft.com/parabank'); // open the page
  await expect(page).toHaveTitle(/ParaBank/); // check the title
});
```

| Word in the example | Meaning                                                      |
| ------------------- | ------------------------------------------------------------ |
| `test(...)`         | Defines one test with a name                                 |
| `page`              | A browser tab that Playwright gives to the test              |
| `await`             | Wait for this action to finish before going to the next line |
| `expect(...)`       | A check. If it is not true, the test fails                   |

### What is a framework, and why not just write tests?

A few tests in one folder work fine. Hundreds of tests written by many
people do not: the same code is copied everywhere, one change in the
application breaks many tests, and nobody follows the same style.

A framework is the structure and the rules around the tests, so that
tests stay short, a change is fixed in one place, and every engineer
works the same way.

### Why TypeScript?

TypeScript is JavaScript with types. A type says what kind of value
something is. With types, the editor shows many mistakes while you type,
before any test runs.

### What application do we test?

ParaBank, a demo online banking site. It has pages (login, accounts,
transfer funds, bill pay) and an API.

## 2. What Phase 1 delivers

| Area              | What we have                                            |
| ----------------- | ------------------------------------------------------- |
| Project           | Node.js project with Playwright installed               |
| Folder structure  | Layered folders for tests, pages, fixtures, API, data   |
| Strict TypeScript | Type mistakes are reported while writing                |
| Lint              | Code mistakes are reported, including a missing `await` |
| Format            | All code looks the same                                 |
| Pre-commit check  | Lint and format run by themselves before every commit   |
| CI pipeline       | GitHub checks every push automatically                  |
| Documentation     | README and the pages in `docs/`                         |

## 3. Tools and what each one does

| Tool               | What it is                             | Why we need it                           |
| ------------------ | -------------------------------------- | ---------------------------------------- |
| Node.js            | Runs JavaScript tools on your computer | Playwright and all other tools run on it |
| npm                | Package manager; comes with Node.js    | Installs packages and runs commands      |
| Git                | Version control                        | Saves the history of every change        |
| GitHub             | Website that stores the repository     | Team sharing and the CI pipeline         |
| VS Code            | Code editor                            | Writing and running tests                |
| Playwright         | Test automation tool                   | Drives the browser and calls APIs        |
| TypeScript         | JavaScript with types                  | Finds mistakes while writing             |
| ESLint             | Lint tool                              | Finds code problems without running code |
| Prettier           | Formatter                              | Same code style for everyone             |
| Husky, lint-staged | Git hook tools                         | Run checks before each commit            |
| GitHub Actions     | CI tool inside GitHub                  | Runs checks on every push                |

Three kinds of things, often confused:

| Kind                     | Examples                                 | Where it lives                     |
| ------------------------ | ---------------------------------------- | ---------------------------------- |
| Program on your computer | Node.js, Git, VS Code                    | Installed once on the machine      |
| npm package              | Playwright, TypeScript, ESLint, Prettier | `node_modules/` inside the project |
| VS Code extension        | Playwright, ESLint, Prettier extensions  | Inside the editor only             |

The npm packages do the real work. The extensions only show their results
in the editor. The pipeline has no editor and uses the packages directly.

## 4. Setting up your machine (new team member)

Run these in a terminal. In VS Code, open one with `` Ctrl+` ``.

**Step 1. Install the programs**

- Node.js (LTS version) from nodejs.org
- Git from git-scm.com
- VS Code from code.visualstudio.com

Check them. Each command should print a version number:

```bash
node -v
npm -v
git --version
```

**Step 2. Tell Git who you are (one time)**

```bash
git config --global user.name "Your Name"
git config --global user.email "your-email@example.com"
```

**Step 3. Get the project**

```bash
git clone https://github.com/Venkata823/Enterprise-Playwright-Automation-Framework.git
cd Enterprise-Playwright-Automation-Framework
```

**Step 4. Install packages and browsers**

```bash
npm install
npx playwright install
```

`npm install` reads `package.json` and downloads the packages into
`node_modules/`. It also runs the `prepare` script, which connects Git to
the `.husky` folder. `npx playwright install` downloads the browsers that
Playwright controls.

**Step 5. Open in VS Code and install the recommended extensions**

Open the folder in VS Code. It offers three extensions: Playwright Test,
ESLint, and Prettier. Accept them.

**Step 6. Check that everything works**

```bash
npm run verify
```

It should end with "All matched files use Prettier code style!" and no errors.

## 5. How Phase 1 was built, step by step

Each step says what was done, the command or file, and why.

### Step 1. Create the project and install Playwright

```bash
npm init playwright@latest
```

Answers: TypeScript, tests folder `tests`, add a GitHub Actions workflow.

Created: `package.json`, `package-lock.json`, `playwright.config.ts`,
`node_modules/`, `.github/workflows/playwright.yml`.

Why: this is the base. `package.json` lists the packages,
`playwright.config.ts` holds the test runner settings.

### Step 2. Create the folder structure

| Folder        | Job                                              |
| ------------- | ------------------------------------------------ |
| `tests/`      | Tests only: steps and checks                     |
| `fixtures/`   | Setup and cleanup that tests ask for by name     |
| `pages/`      | One class per page: where things are, what to do |
| `components/` | Screen parts used on many pages                  |
| `api/`        | Code that calls the application's API            |
| `testdata/`   | Test data files and data builders                |
| `config/`     | Code that loads environment settings             |
| `utils/`      | Small general helpers                            |
| `types/`      | Shared TypeScript types                          |

Why: each folder has one job. When the application changes, the fix is in
one place. Most folders hold only a `.gitkeep` file for now, because Git
does not track empty folders.

### Step 3. Turn on strict TypeScript

File: `tsconfig.json`.

| Setting             | What it does                                    |
| ------------------- | ----------------------------------------------- |
| `"strict": true`    | Turns on the main type checks                   |
| `"noEmit": true`    | Only check the code; do not create output files |
| `"types": ["node"]` | Makes Node.js names such as `process` known     |
| `"paths"`           | Short import names, such as `@pages/LoginPage`  |

Command: `npm run typecheck`.

Important: Playwright runs TypeScript files but does not check their
types. That is why we run the typecheck as a separate command.

### Step 4. Add lint

File: `eslint.config.mjs`. Command: `npm run lint`.

Lint reads the code without running it and reports problems. The most
important rule here is `no-floating-promises`. It reports a Playwright
call that has no `await`:

```ts
page.click('#login'); // wrong: lint reports an error
await page.click('#login'); // right
```

Why it matters: without `await`, the test moves on before the click has
happened. The test then fails sometimes and passes sometimes. This is the
most common cause of unreliable ("flaky") tests.

### Step 5. Add formatting

Files: `.prettierrc`, `.prettierignore`. Command: `npm run format`.

Prettier rewrites the code layout: quotes, spaces, line length. It does
not change what the code does.

Why: code reviews then show real changes only, not spacing changes.

Lint and Prettier are different. Lint finds problems. Prettier fixes
appearance only.

### Step 6. Add shared editor settings

Files: `.vscode/settings.json`, `.vscode/extensions.json`.

Result: every time you save a file (`Ctrl+S`), it is formatted and lint
fixes what it can.

### Step 7. Add npm scripts

File: `package.json`, section `scripts`. A script is a short name for a
longer command. See the command table in section 6.

### Step 8. Add the pre-commit check

Files: `.husky/pre-commit`, and `lint-staged` in `package.json`.

What happens when you run `git commit`:

1. Git runs the hook file `.husky/pre-commit`.
2. The hook runs `lint-staged`.
3. `lint-staged` runs ESLint and Prettier on the files in this commit.
4. If ESLint finds an error, the commit is cancelled. Fix it and commit again.

Why: problems are caught on your machine in seconds, not later in the pipeline.

### Step 9. Protect secrets and generated files

| File             | What it does                                                |
| ---------------- | ----------------------------------------------------------- |
| `.gitignore`     | Lists what Git must not track: packages, reports, env files |
| `.env.example`   | Lists the settings the framework needs, with no real values |
| `.gitattributes` | Makes line endings the same on Windows, Mac, and Linux      |

Rule: passwords and URLs go in an env file such as `.env.qa`, which is
never committed. Git history keeps a secret forever, even after the file
is deleted.

### Step 10. Add the CI pipeline

File: `.github/workflows/playwright.yml`.

On every push and pull request, GitHub runs two jobs on its own machine:

| Job                | Commands                                | Purpose                   |
| ------------------ | --------------------------------------- | ------------------------- |
| Typecheck and lint | `npm ci`, typecheck, lint, format check | Quality gate              |
| Playwright tests   | Install browsers, `npx playwright test` | Runs only if job 1 passed |

See the result in the Actions tab of the repository on GitHub.

Note: until Phase 2 adds the first test, the second job reports "No tests
found". That is expected.

### Step 11. Create the Git repository and push

```bash
git init
git add .
git commit -m "chore: project foundation"
git branch -M main
git remote add origin https://github.com/Venkata823/Enterprise-Playwright-Automation-Framework.git
git push -u origin main
```

| Command          | Meaning                                    |
| ---------------- | ------------------------------------------ |
| `git init`       | Make this folder a Git repository          |
| `git add .`      | Mark all changed files for the next commit |
| `git commit`     | Save a snapshot with a message             |
| `git remote add` | Tell Git where the GitHub repository is    |
| `git push`       | Send the commits to GitHub                 |

## 6. Commands you will use every day

| Command                | What it does                               | When to use                 |
| ---------------------- | ------------------------------------------ | --------------------------- |
| `npm test`             | Runs all tests                             | Before pushing              |
| `npm run test:smoke`   | Runs tests tagged `@smoke`                 | Quick check                 |
| `npm run test:headed`  | Runs tests with the browser visible        | To watch a test             |
| `npm run test:ui-mode` | Opens Playwright's interactive window      | Writing and debugging tests |
| `npm run report`       | Opens the last HTML report                 | After a run                 |
| `npm run typecheck`    | Checks types                               | After code changes          |
| `npm run lint`         | Checks code rules                          | After code changes          |
| `npm run lint:fix`     | Fixes lint problems where it can           | When lint reports errors    |
| `npm run format`       | Formats all files                          | Before committing           |
| `npm run verify`       | Typecheck, lint, and format check together | Before every push           |

Daily flow:

```bash
git pull                      # get the latest code
# ... write code ...
npm run verify                # check it
git add .
git commit -m "test: add login test"
git push
```

## 7. How to check that Phase 1 works

| Check                     | How                                                | Expected result                     |
| ------------------------- | -------------------------------------------------- | ----------------------------------- |
| Tools installed           | `node -v`, `git --version`                         | Version numbers                     |
| Types are correct         | `npm run typecheck`                                | No output, no errors                |
| Lint passes               | `npm run lint`                                     | No errors                           |
| Format is correct         | `npm run format:check`                             | "All matched files use Prettier..." |
| Missing `await` is caught | Remove an `await` from a Playwright call in a test | Red underline; `npm run lint` fails |
| Format on save works      | Add extra spaces, press `Ctrl+S`                   | Spaces are removed                  |
| Pre-commit check works    | Commit a file that has a lint error                | Commit is cancelled                 |
| Pipeline runs             | Push, then open the Actions tab on GitHub          | "Typecheck and lint" is green       |

## 8. Problems we met and how we fixed them

| Problem                               | Cause                                                               | Fix                                                       |
| ------------------------------------- | ------------------------------------------------------------------- | --------------------------------------------------------- |
| Every `import` line was red           | `verbatimModuleSyntax` in `tsconfig.json` with a CommonJS project   | Removed that option                                       |
| "Cannot find name 'process'"          | `"types": []` hid the Node.js types                                 | Set `"types": ["node"]`                                   |
| Lint tools would not install          | TypeScript 7 was installed; `typescript-eslint` supported up to 6.0 | Pinned TypeScript to `~6.0.3`                             |
| "git is not recognized"               | Git was not installed, or VS Code was not restarted                 | Install Git, then close and reopen VS Code                |
| ".git can't be found" from Husky      | `npm run prepare` ran before `git init`                             | Run `git init`, then `npm run prepare`                    |
| "remote origin already exists"        | A remote was already set                                            | `git remote set-url origin <url>`                         |
| "Repository not found" on push        | The remote pointed to a wrong repository name                       | Correct the URL with `git remote set-url`                 |
| A folder named `.env`                 | `.env` must be a file; `dotenv` cannot read a folder                | Removed the folder; env files are `.env.qa`, `.env.stage` |
| "No tests found" in the pipeline      | Practice tests were removed; real tests start in Phase 2            | Expected until Phase 2                                    |
| Red marks stay in VS Code after a fix | The editor's TypeScript server has old information                  | `Ctrl+Shift+P`, then "TypeScript: Restart TS Server"      |

## 9. Rules to remember

1. Every Playwright call that does something needs `await`.
2. Never commit passwords, URLs, or env files.
3. Do not edit `package-lock.json` or anything in `node_modules/` by hand.
4. Run `npm run verify` before every push.
5. Do not skip the pre-commit check.
6. Work on a branch, not directly on `main`, once the team grows.
7. Put each file in the folder that matches its job.

## 10. Try it yourself

1. Run `npm run verify` and read each part of the output.
2. Create `tests/web/practice.spec.ts` with the example test from section 1 and run `npx playwright test`.
3. Remove the `await` before `page.goto` and run `npm run lint`. Read the error, then put the `await` back.
4. Change single quotes to double quotes in that file, save, and watch Prettier change them back.
5. Try to commit the file while it has the lint error. See the commit cancelled.
6. Open `docs/FILES_EXPLAINED.md` and find what `"prepare": "husky"` does.
7. Delete the practice file when you finish.

## 11. Check your understanding

| Question                                                    | Answer                                                                         |
| ----------------------------------------------------------- | ------------------------------------------------------------------------------ |
| What is the difference between lint and Prettier?           | Lint finds problems in code. Prettier changes only how the code looks.         |
| Why do we run `tsc --noEmit` if Playwright runs TypeScript? | Playwright does not check types. `tsc` does.                                   |
| What happens when you run `git commit`?                     | The pre-commit hook runs lint and format on the files in the commit.           |
| Why is `node_modules/` not in Git?                          | It is large and can be re-created with `npm install`.                          |
| Why is `.env.example` committed but `.env.qa` is not?       | The example has only names. The real file has secrets.                         |
| What does a missing `await` cause?                          | The test continues too early, which gives random failures.                     |
| What is the difference between `npm install` and `npm ci`?  | `npm ci` installs exactly what the lock file says. Pipelines use it.           |
| What are the two jobs in the pipeline?                      | A quality gate (typecheck, lint, format), then the Playwright tests.           |
| Is the ESLint VS Code extension needed for the pipeline?    | No. The pipeline uses the npm package. The extension only helps in the editor. |
| Why are most folders empty after Phase 1?                   | Phase 1 builds the base. Code is added from Phase 2 onwards.                   |

## 12. What comes next

Phase 2 sets up the configuration for ParaBank: environment files, browser
projects, timeouts, reports, and the first real tests. See
[ROADMAP.md](./ROADMAP.md).
