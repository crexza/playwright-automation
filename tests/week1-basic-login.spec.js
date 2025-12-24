const { test, expect } = require('@playwright/test');

test.describe('Week 1: Basic Login Tests', () => {
  
  test('should login successfully with valid credentials', async ({ page }) => {
    // Step 1: Navigate to the website
    await page.goto('https://www.saucedemo.com');
    
    // Step 2: Fill in username
    await page.fill('#user-name', 'standard_user');
    
    // Step 3: Fill in password
    await page.fill('#password', 'secret_sauce');
    
    // Step 4: Click login button
    await page.click('#login-button');
    
    // Step 5: Verify successful login by checking URL
    await expect(page).toHaveURL('https://www.saucedemo.com/inventory.html');
    
    // Step 6: Verify products page is displayed
    await expect(page.locator('.inventory_list')).toBeVisible();
  });

  test('should show error message with invalid credentials', async ({ page }) => {
    await page.goto('https://www.saucedemo.com');
    
    // Use wrong credentials
    await page.fill('#user-name', 'invalid_user');
    await page.fill('#password', 'wrong_password');
    await page.click('#login-button');
    
    // Verify error message appears
    const errorMessage = page.locator('[data-test="error"]');
    await expect(errorMessage).toBeVisible();
    await expect(errorMessage).toContainText('Epic sadface');
  });
});