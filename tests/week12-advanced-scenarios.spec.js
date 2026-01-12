const { test, expect } = require('@playwright/test');
const LoginPage = require('../pages/LoginPage');
const ProductsPage = require('../pages/ProductsPage');
const CartPage = require('../pages/CartPage');
const ConfigHelper = require('../utils/ConfigHelper');
const TestDataHelper = require('../utils/TestDataHelper');

test.describe('Week 12: Complete E2E Scenarios', () => {
  let loginPage, productsPage, cartPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    productsPage = new ProductsPage(page);
    cartPage = new CartPage(page);
    
    await loginPage.navigate();
    const user = ConfigHelper.getStandardUser();
    await loginPage.login(user.username, user.password);
  });

  test('Complete shopping flow - Happy path', async ({ page }) => {
    // Add product information for reporting
    test.info().annotations.push({
      type: 'test-case-id',
      description: 'TC-001'
    });

    // Step 1: Browse products
    const products = TestDataHelper.getProducts();
    await expect(productsPage.inventoryList).toBeVisible();
    
    // Step 2: Sort by price
    await productsPage.sortProducts('lohi');
    
    // Step 3: Add cheapest 2 products
    await productsPage.addProductToCart(products[1].dataTestId);
    await productsPage.addProductToCart(products[2].dataTestId);
    
    // Step 4: Verify cart badge
    expect(await productsPage.getCartItemCount()).toBe(2);
    
    // Step 5: Review cart
    await productsPage.goToCart();
    const itemsInCart = await cartPage.getItemNames();
    expect(itemsInCart).toHaveLength(2);
    
    // Step 6: Remove one item
    await cartPage.removeItem(products[1].dataTestId);
    
    // Step 7: Verify final state
    expect(await cartPage.getCartItemCount()).toBe(1);
    
    // Take screenshot for report
    await page.screenshot({ 
      path: 'screenshots/final-cart-state.png',
      fullPage: true 
    });
  });

  test('Price calculation verification', async ({ page }) => {
    test.info().annotations.push({
      type: 'test-case-id',
      description: 'TC-002'
    });

    const testProducts = TestDataHelper.getProducts();
    
    // Add specific products
    await productsPage.addProductToCart(testProducts[0].dataTestId);
    await productsPage.addProductToCart(testProducts[1].dataTestId);
    
    // Calculate expected total
    const expectedTotal = testProducts[0].price + testProducts[1].price;
    
    await productsPage.goToCart();
    
    // In a real scenario, you'd verify the total price here
    // This is a simplified example
    console.log(`Expected total: $${expectedTotal.toFixed(2)}`);
    
    expect(await cartPage.getCartItemCount()).toBe(2);
  });

  test('Multi-user workflow comparison @performance', async ({ browser }) => {
    test.slow(); // Mark as slow test (3x timeout)

    // Create multiple contexts to simulate different users
    const context1 = await browser.newContext();
    const context2 = await browser.newContext();
    
    const page1 = await context1.newPage();
    const page2 = await context2.newPage();
    
    // User 1: Standard user
    const loginPage1 = new LoginPage(page1);
    const productsPage1 = new ProductsPage(page1);
    
    await loginPage1.navigate();
    await loginPage1.login('standard_user', 'secret_sauce');
    const startTime1 = Date.now();
    await productsPage1.addProductToCart('sauce-labs-backpack');
    const endTime1 = Date.now();
    
    // User 2: Performance glitch user
    const loginPage2 = new LoginPage(page2);
    const productsPage2 = new ProductsPage(page2);
    
    await loginPage2.navigate();
    await loginPage2.login('performance_glitch_user', 'secret_sauce');
    const startTime2 = Date.now();
    await productsPage2.addProductToCart('sauce-labs-backpack');
    const endTime2 = Date.now();
    
    // Compare performance
    const time1 = endTime1 - startTime1;
    const time2 = endTime2 - startTime2;
    
    console.log(`Standard user time: ${time1}ms`);
    console.log(`Performance glitch user time: ${time2}ms`);
    
    // Cleanup
    await context1.close();
    await context2.close();
  });
});