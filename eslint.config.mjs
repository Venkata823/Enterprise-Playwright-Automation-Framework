// eslint.config.mjs tells ESLint which code rules to apply.
// ESLint reads the code without running it and reports bad patterns.
// Run it with: npm run lint

// TypeScript support for ESLint: the parser and the TypeScript rules.
import tseslint from 'typescript-eslint';

// Rules written for Playwright tests, for example "no test.only left in code".
import playwright from 'eslint-plugin-playwright';

// Turns OFF the ESLint rules that only deal with formatting, because
// Prettier owns formatting. This stops the two tools from fighting.
import prettier from 'eslint-config-prettier';

// The config is a list of blocks. ESLint applies them from top to bottom,
// and a later block can override an earlier one.
export default tseslint.config(
  // Block 1: files and folders ESLint must skip completely.
  {
    ignores: [
      'node_modules', // installed packages, not our code
      'playwright-report', // generated HTML report
      'test-results', // generated traces, screenshots, videos
      'blob-report', // generated report pieces from sharded CI runs
      'allure-results', // generated Allure raw data
      'allure-report', // generated Allure HTML report
      'custom-report', // generated custom reports
      'reports', // generated reports
      'Typescript', // old practice folder, not part of the framework
      'eslint.config.mjs', // this file itself (plain JavaScript, not in tsconfig)
    ],
  },

  // Block 2: the recommended TypeScript rules that use type information.
  // "TypeChecked" means the rules can see types, which is needed to know
  // whether a call returns a Promise.
  ...tseslint.configs.recommendedTypeChecked,

  // Block 3: our own project settings and rules.
  {
    languageOptions: {
      parserOptions: {
        // Let ESLint find and use tsconfig.json automatically for type info.
        projectService: true,
        // The folder where tsconfig.json lives: the folder of this file.
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      // A missing "await" is the number one cause of flaky tests.
      // Example blocked by this rule:  page.click('#login')  without await.
      '@typescript-eslint/no-floating-promises': 'error',

      // Do not allow the "any" type. "any" switches off type checking.
      '@typescript-eslint/no-explicit-any': 'error',

      // Warn (not block) on console.log. Use the reporter or a logger instead.
      'no-console': 'warn',
    },
  },

  // Block 4: Playwright rules, applied only to files inside tests/.
  { files: ['tests/**/*.ts'], ...playwright.configs['flat/recommended'] },

  // Block 5: must be LAST, so it can switch off any formatting rules
  // that the blocks above turned on.
  prettier,
);
