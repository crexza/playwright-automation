const { test, expect } = require('@playwright/test');

test.describe('Week 2: Learning Different Selectors', () => {
  
  test.beforeEach(async ({ page }) => {
    await page.goto('https://www.saucedemo.com');
    await page.fill('#user-name', 'standard_user');
    await page.fill('#password', 'secret_sauce');
    await page.click('#login-button');
  });

  test('CSS Selector - Select by ID', async ({ page }) => {
    // Using ID selector
    const menuButton = page.locator('#react-burger-menu-btn');
    await expect(menuButton).toBeVisible();
  });

  test('CSS Selector - Select by Class', async ({ page }) => {
    // Using class selector
    const inventoryItems = page.locator('.inventory_item');
    await expect(inventoryItems).toHaveCount(6);
  });

  test('Data Attribute Selector (BEST PRACTICE)', async ({ page }) => {
    // Using data-test attribute (most stable)
    const addToCartButton = page.locator('[data-test="add-to-cart-sauce-labs-backpack"]');
    await addToCartButton.click();
    
    // Verify cart badge shows 1
    await expect(page.locator('.shopping_cart_badge')).toHaveText('1');
  });

  test('Text-based Selector', async ({ page }) => {
    // Find element by text content
    const productName = page.getByText('Sauce Labs Backpack');
    await expect(productName).toBeVisible();
  });

  test('Combining Selectors', async ({ page }) => {
    // Find element within another element
    const firstProduct = page.locator('.inventory_item').first();
    const addButton = firstProduct.locator('button');
    await expect(addButton).toBeVisible();
  });
});