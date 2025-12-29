const { test, expect } = require('@playwright/test');

test.describe('Login test', () => {

  test('login', async ({ page }) => {
    // Go directly to login page
    await page.goto('https://demo.slickfox.com/login');

    // Fill email & password
    await page.fill('input[type="email"]', 'caressa2004@gmail.com');
    await page.fill('input[type="password"]', 'Crexza04');

    // Click login / sign in
    await page.getByRole('button', { name: /login|sign in/i }).click();

   
  // Text-based assertion (robust)
 await expect(page).toHaveURL('https://demo.slickfox.com/dashboard');
  });

});
