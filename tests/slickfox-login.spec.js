const { test, expect } = require('@playwright/test');

test.describe('Login test', () => {

  

  test('Registration Page', async ({ page }) => {
    // Go slickfox website
    await page.goto('https://demo.slickfox.com');
    await page.getByRole('button', { name: /Get Started/i }).click();
   
  // Text-based assertion (robust)
 await expect(page).toHaveURL('https://demo.slickfox.com/register');
  });

  test('User Registering', async ({ page }) => {
    // Go slickfox website
    await page.goto('https://demo.slickfox.com');

    await page.getByRole('button', { name: /Get Started/i }).click();
    await page.fill('#name', 'test user');
    await page.fill('input[type="email"]', 'testuser123@example.com');
    await page.fill('input[type="password"]', 'Pass@123');
    await page.fill('input[placeholder="Re-enter password"]', 'Pass@123');
    await page.fill('input[placeholder="Acme Corporation"]', 'comp test');
    await page.fill('input[placeholder="+60 12-345-6789"]', '0199999999');

    await page.getByRole('heading',{name:/Tier 1/i}).click();
    await page.click ("#terms")
    await page.getByRole('button', { name: /Complete Registration/i }).click();
   
  // Text-based assertion (robust)
 await expect(page).toHaveURL('https://demo.slickfox.com/register');
  });

  test('Password length less than 8', async ({ page }) => {
  await page.goto('https://demo.slickfox.com');
  await page.getByRole('button', { name: /Get Started/i }).click();

  await page.fill('input[type="password"]', 'Pas23');
  await page.getByRole('button', { name: /Complete Registration/i }).click();

  // Check error message by text
  const errorMessage = page.getByText('Password must be at least 8 characters');
  await expect(errorMessage).toBeVisible({ timeout: 10000 });
});

test('Password and Comfirm password diff', async ({ page }) => {
  await page.goto('https://demo.slickfox.com');
  await page.getByRole('button', { name: /Get Started/i }).click();

  await page.fill('input[type="password"]', 'Passwor23');
  await page.fill('input[placeholder="Re-enter password"]', 'Pass@123');

  await page.getByRole('button', { name: /Complete Registration/i }).click();

  // Check error message by text
  const errorMessage = page.getByText('Passwords do not match');
  await expect(errorMessage).toBeVisible({ timeout: 10000 });
});

test('login page', async ({ page }) => {
    // Go directly to login page
    await page.goto('https://demo.slickfox.com');

    await page.getByRole('link', { name: /Log in/i }).click();

  // Text-based assertion (robust)
     await expect(page).toHaveURL('https://demo.slickfox.com/login');
  });

test('login', async ({ page }) => {
    // Go directly to login page
    await page.goto('https://demo.slickfox.com/login');

    // Fill email & password
    await page.fill('input[type="email"]', 'caressa2004@gmail.com');
    await page.fill('input[type="password"]', 'Crexza04');

    // Click login / sign in
    await page.getByRole('button', { name: /login|sign in/i }).click();

   
  // Text-based assertion (robust)
 await expect(page).toHaveURL('https://demo.slickfox.com/login');
  });


  

});
