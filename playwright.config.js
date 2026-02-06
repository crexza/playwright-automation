// playwright.config.js
require('dotenv').config();
const { defineConfig, devices } = require('@playwright/test');

module.exports = defineConfig({
  testDir: './tests',
  timeout: 30 * 1000,
  expect: { timeout: 5000 },
  fullyParallel: true,
  reporter: [['html'], ['list']],

  use: {
    baseURL: 'https://demo.slickfox.com',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },

  projects: [
    // setup project generates the auth file
    {
      name: 'setup',
      testMatch: /auth\.setup\.js/,
    },

    // PUBLIC tests - no auth
    {
      name: 'chromium-public',
      use: { ...devices['Desktop Chrome'] },
      testIgnore: [
        /us-acc-08-edit-profile\.spec\.js/,
        /us-acc-09-10-11-profile\.spec\.js/,
        /us-proj-01-02-projects\.spec\.js/,
        /us-epic\.spec\.js/,
        /us-user-story\.spec\.js/,
      ],
    },

    // AUTH tests - depends on setup + uses storageState
    {
      name: 'chromium-auth',
      dependencies: ['setup'],
      use: {
        ...devices['Desktop Chrome'],
        storageState: 'playwright/.auth/user.json',
      },
      testMatch: [
        /us-acc-08-edit-profile\.spec\.js/,
        /us-acc-09-10-11-profile\.spec\.js/,
        /us-proj-01-02-projects\.spec\.js/,
        /us-epic\.spec\.js/,
        /us-user-story\.spec\.js/,
      ],
    },
  ],
});
