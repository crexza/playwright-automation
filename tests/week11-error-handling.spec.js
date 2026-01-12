const { test, expect } = require('@playwright/test');
const LoginPage = require('../pages/LoginPage');
const ProductsPage = require('../pages/ProductsPage');
const WaitHelper = require('../utils/WaitHelper');
const ConfigHelper = require('../utils/ConfigHelper');

test.describe('Week 11: Error Handling and Resilience', () => {
  let loginPage;
  let productsPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    productsPage = new ProductsPage(page);
  });

  test('Handle network delays gracefully', async ({ page }) => {
    // Simulate slow network
    await page.route('**/*', route => {
      setTimeout(() => route.continue(), 1000);
    });

    await loginPage.navigate();
    const user = ConfigHelper.getStandardUser();
    await loginPage.login(user.username, user.password);
    
    // Wait for page load
    await WaitHelper.waitForNavigation(page);
    await expect(productsPage.pageTitle).toHaveText('Products');
  });

  test('Retry failed actions', async ({ page }) => {
    await loginPage.navigate();
    const user = ConfigHelper.getStandardUser();
    await loginPage.login(user.username, user.password);

    // Use retry mechanism for potentially flaky action
    await WaitHelper.retryAction(async () => {
      await productsPage.addProductToCart('sauce-labs-backpack');
      const count = await productsPage.getCartItemCount();
      expect(count).toBe(1);
    }, 3, 500);
  });

  test('Handle missing elements gracefully', async ({ page }) => {
    await loginPage.navigate();
    const user = ConfigHelper.getStandardUser();
    await loginPage.login(user.username, user.password);

    // Check if element exists before interacting
    const elementExists = await WaitHelper.waitForElement(
      page, 
      '.inventory_list', 
      5000
    );
    
    expect(elementExists).toBe(true);
  });

  test('Custom timeout for slow operations', async ({ page }) => {
    // Set custom timeout for this test
    test.setTimeout(60000);

    await loginPage.navigate();
    const user = ConfigHelper.getStandardUser();
    await loginPage.login(user.username, user.password);
    
    // Operation with custom wait
    await page.waitForSelector('.inventory_list', { timeout: 10000 });
    await expect(productsPage.inventoryList).toBeVisible();
  });
});