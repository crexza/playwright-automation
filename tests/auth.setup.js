const { test } = require('@playwright/test');

test('authenticate user', async ({ page }) => {
  await page.goto('https://demo.slickfox.com/login');

  // 🔐 replace selectors if needed
  await page.getByRole('textbox', { name: /email/i })
    .fill(process.env.SLICKFOX_EMAIL);

  await page.getByRole('textbox', { name: /password/i })
    .fill(process.env.SLICKFOX_PASSWORD);

  await page.getByRole('button', { name: /sign in|login/i }).click();

  // wait until logged in
  await page.waitForURL(/dashboard|projects/i);

  // ensure folder exists
  await page.context().storageState({
    path: 'playwright/.auth/user.json',
  });
});
