const { test } = require('./fixtures/testFixtures');
const { expect } = require('@playwright/test');

test.describe('Week 9: Hooks and Fixtures', () => {
  
  // Runs once before all tests in this describe block
  test.beforeAll(async () => {
    console.log('🚀 Starting test suite');
  });

  // Runs once after all tests in this describe block
  test.afterAll(async () => {
    console.log('✅ Test suite completed');
  });

  // Runs before each test
  test.beforeEach(async ({ page }) => {
    console.log(`📝 Running test: ${test.info().title}`);
  });

  // Runs after each test
  test.afterEach(async ({ page }, testInfo) => {
    console.log(`✔️ Test completed: ${testInfo.status}`);
    
    // Take screenshot on failure
    if (testInfo.status !== 'passed') {
      await page.screenshot({ 
        path: `screenshots/failure-${Date.now()}.png`,
        fullPage: true 
      });
    }
  });

  test('Using authenticated fixture', async ({ authenticatedPage, pageObjects }) => {
    // Already logged in via fixture
    await expect(pageObjects.productsPage.pageTitle).toHaveText('Products');
  });

  test('Add products using page objects fixture', async ({ authenticatedPage, pageObjects }) => {
    await pageObjects.productsPage.addProductToCart('sauce-labs-backpack');
    await pageObjects.productsPage.addProductToCart('sauce-labs-bike-light');
    
    const cartCount = await pageObjects.productsPage.getCartItemCount();
    expect(cartCount).toBe(2);
  });
});