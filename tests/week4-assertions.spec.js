const { test, expect } = require('@playwright/test');

test.describe('Week 4: Assertions and Verifications', () => {
  
  test.beforeEach(async ({ page }) => {
    await page.goto('https://www.saucedemo.com');
  });

  test('Visibility assertions', async ({ page }) => {
    // Element is visible
    await expect(page.locator('#login-button')).toBeVisible();
    
    // Element is hidden (not present initially)
    await expect(page.locator('[data-test="error"]')).toBeHidden();
  });

  test('Text content assertions', async ({ page }) => {
    // Exact text match
    const loginButton = page.locator('#login-button');
    await expect(loginButton).toHaveText('Login');
    
    // Contains text
    await expect(page.locator('.login_logo')).toContainText('Swag Labs');
  });

  test('Input value assertions', async ({ page }) => {
    // Fill input
    await page.fill('#user-name', 'standard_user');
    
    // Verify input value
    await expect(page.locator('#user-name')).toHaveValue('standard_user');
  });

  test('URL assertions', async ({ page }) => {
    // Exact URL
    await expect(page).toHaveURL('https://www.saucedemo.com/');
    
    // After login, check URL contains
    await page.fill('#user-name', 'standard_user');
    await page.fill('#password', 'secret_sauce');
    await page.click('#login-button');
    await expect(page).toHaveURL(/inventory/);
  });

  test('Element state assertions', async ({ page }) => {
    const loginButton = page.locator('#login-button');
    
    // Button is enabled
    await expect(loginButton).toBeEnabled();
    
    // Input is editable
    await expect(page.locator('#user-name')).toBeEditable();
  });

  test('Count assertions', async ({ page }) => {
    await page.fill('#user-name', 'standard_user');
    await page.fill('#password', 'secret_sauce');
    await page.click('#login-button');
    
    // Count items
    const products = page.locator('.inventory_item');
    await expect(products).toHaveCount(6);
  });

  test('Attribute assertions', async ({ page }) => {
    // Check element has specific attribute
    await expect(page.locator('#user-name')).toHaveAttribute('placeholder', 'Username');
  });

  test('Soft assertions - Continue on failure', async ({ page }) => {
    await page.fill('#user-name', 'standard_user');
    await page.fill('#password', 'secret_sauce');
    await page.click('#login-button');
    
    // Soft assertions don't stop test execution
    await expect.soft(page.locator('.title')).toHaveText('Products');
    await expect.soft(page.locator('.inventory_list')).toBeVisible();
    await expect.soft(page.locator('.shopping_cart_link')).toBeVisible();
    
    // Test continues even if soft assertions fail
    console.log('Test continues after soft assertions');
  });
});