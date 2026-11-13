// playwright.config.ts is the main settings file for the test runner.
// Every "npx playwright test" run reads this file first.
// Note: this is still the starter config. Phase 2 replaces it with
// ParaBank settings (base URL, environments, timeouts, reporters).

// defineConfig gives type checking and auto-complete for the settings.
// devices is a built-in list of ready browser and phone settings.
import { defineConfig, devices } from '@playwright/test';

// Node.js "process" object. process.env holds environment variables.
// The CI variable is set to "true" automatically on GitHub Actions.
import process from 'process';

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 * (Switched on in Phase 2, when we add the env files.)
 */
// import dotenv from 'dotenv';
// import path from 'path';
// dotenv.config({ path: path.resolve(__dirname, '.env') });

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  /* Folder where Playwright looks for test files (*.spec.ts). */
  testDir: './tests',

  /* Run all tests in parallel, even tests inside the same file.
     This needs every test to be independent of the others. */
  fullyParallel: true,

  /* On CI, fail the run if someone left test.only in the code.
     "!!" turns the value into true or false. Locally it is allowed. */
  forbidOnly: !!process.env.CI,

  /* How many times to re-run a failed test: 2 on CI, 0 on your machine.
     A test that passes only on retry is reported as "flaky". */
  retries: process.env.CI ? 2 : 0,

  /* How many tests run at the same time. 1 on CI for stable results;
     undefined locally means "use half of the CPU cores". */
  workers: process.env.CI ? 1 : undefined,

  /* Which report to create. 'html' writes the playwright-report folder.
     Open it with: npm run report */
  reporter: 'html',

  /* Settings shared by ALL projects below.
     See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL lets tests write page.goto('/login') instead of a full URL.
       Set to ParaBank in Phase 2. */
    // baseURL: 'http://localhost:3000',

    /* Record a trace (screenshots, DOM, network) only when a failed test
       is retried. Open traces in the Trace Viewer to debug CI failures. */
    trace: 'on-first-retry',

    /* Ask the browser to open maximized. Note: this has an effect only in
       headed mode and only when viewport is null. The 'chromium' project
       below uses devices['Desktop Chrome'], which sets its own viewport,
       so the window size still comes from there. Fixed in Phase 2. */
    launchOptions: { args: ['--start-maximized'] },
    //viewport: null,

    /* A fixed window size in pixels (switched off for now). */
    /*viewport: {
        width: 3840,
        height: 2160,
    },*/
  },

  /* Projects: each project runs the same tests with different settings,
     usually one project per browser. */
  projects: [
    {
      /* Name shown in reports and used with: --project=chromium */
      name: 'chromium',
      /* Copy all ready-made settings for desktop Chrome
         ("..." spreads the values into this object). */
      use: { ...devices['Desktop Chrome'] },
    },

    /* Firefox and Safari (WebKit) projects, switched off for now. */
    /*{
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },

    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },*/

    /* Test against mobile viewports. */
    // {
    //   name: 'Mobile Chrome',
    //   use: { ...devices['Pixel 5'] },
    // },
    // {
    //   name: 'Mobile Safari',
    //   use: { ...devices['iPhone 12'] },
    // },

    /* Test against branded browsers. */
    // {
    //   name: 'Microsoft Edge',
    //   use: { ...devices['Desktop Edge'], channel: 'msedge' },
    // },
    // {
    //   name: 'Google Chrome',
    //   use: { ...devices['Desktop Chrome'], channel: 'chrome' },
    // },
  ],

  /* Start a local app server before the tests. Not needed for us,
     because ParaBank is already hosted on the internet. */
  // webServer: {
  //   command: 'npm run start',
  //   url: 'http://localhost:3000',
  //   reuseExistingServer: !process.env.CI,
  // },
});
