const { test, expect } = require('@playwright/test');

test.describe('Week 3: Element Interactions', () => {
  
  test.beforeEach(async ({ page }) => {
    await page.goto('https://www.saucedemo.com');
    await page.fill('#user-name', 'standard_user');
    await page.fill('#password', 'secret_sauce');
    await page.click('#login-button');
  });

  test('Click interactions - Add items to cart', async ({ page }) => {
    // Single click
    await page.click('[data-test="add-to-cart-sauce-labs-backpack"]');
    
    // Verify button text changed
    await expect(page.locator('[data-test="remove-sauce-labs-backpack"]')).toBeVisible();
    
    // Add another item
    await page.locator('[data-test="add-to-cart-sauce-labs-bike-light"]').click();
    
    // Verify cart count
    await expect(page.locator('.shopping_cart_badge')).toHaveText('2');
  });

  test('Dropdown/Select interactions', async ({ page }) => {
    // Select from dropdown
    await page.selectOption('[data-test="product-sort-container"]', 'lohi');
    
    // Verify first product is lowest price
    const firstProductPrice = await page.locator('.inventory_item_price').first().textContent();
    expect(firstProductPrice).toBe('$7.99');
  });

  test('Navigation and links', async ({ page }) => {
    // Click on a product
    await page.click('.inventory_item_name >> text=Sauce Labs Backpack');
    
    // Verify we're on product detail page
    await expect(page).toHaveURL(/inventory-item/);
    
    // Go back
    await page.click('[data-test="back-to-products"]');
    
    // Verify we're back on products page
    await expect(page).toHaveURL(/inventory.html/);
  });

  test('Multiple element handling', async ({ page }) => {
    // Get all "Add to cart" buttons
    const addToCartButtons = page.locator('[id^="add-to-cart"]');
    
    // Get count of buttons
    const count = await addToCartButtons.count();
    console.log(`Total products: ${count}`);
    
    // Click first 3 items
    for (let i = 0; i < 3; i++) {
      await addToCartButtons.nth(i).click();
    }
    
    // Verify cart count
    await expect(page.locator('.shopping_cart_badge')).toHaveText('3');
  });

  test('Checkbox and radio interactions', async ({ page }) => {
    // Navigate to cart
    await page.click('[data-test="add-to-cart-sauce-labs-backpack"]');
    await page.click('.shopping_cart_link');
    
    // Verify item is in cart
    await expect(page.locator('.cart_item')).toHaveCount(1);
  });
});