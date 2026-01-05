const { test, expect } = require('@playwright/test');
const LoginPage = require('../pages/LoginPage');
const ProductsPage = require('../pages/ProductsPage');
const TestDataHelper = require('../utils/TestDataHelper');

test.describe('Week 7: Data-Driven Tests', () => {
  let loginPage;
  let productsPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    productsPage = new ProductsPage(page);
    await loginPage.navigate();
  });

  test('Login with different valid users', async ({ page }) => {
    // Test with standard user
    const standardUser = TestDataHelper.getValidUser('standard');
    await loginPage.login(standardUser.username, standardUser.password);
    await expect(productsPage.pageTitle).toHaveText('Products');
  });

  // Data-driven test for invalid credentials
  TestDataHelper.getInvalidUsers().forEach((user) => {
    test(`Login fails with: ${user.username || 'empty username'}`, async ({ page }) => {
      await loginPage.login(user.username, user.password);
      
      // Verify error is displayed
      const isErrorShown = await loginPage.isErrorDisplayed();
      expect(isErrorShown).toBe(true);
      
      // Verify error message
      const errorText = await loginPage.getErrorMessage();
      expect(errorText).toContain(user.expectedError);
    });
  });

  test('Add random products from test data', async ({ page }) => {
  const user = TestDataHelper.getValidUser();
  await loginPage.login(user.username, user.password);

  // Get 3 UNIQUE random products
  const products = TestDataHelper.getProducts();
  const selectedProducts = products
    .sort(() => 0.5 - Math.random())
    .slice(0, 3);

  for (const product of selectedProducts) {
    await productsPage.addProductToCart(product.name);
  }

  // Verify cart count
  await expect
    .poll(() => productsPage.getCartItemCount())
    .toBe(3);
});


  test('Verify all products from test data are displayed', async ({ page }) => {
    const user = TestDataHelper.getValidUser();
    await loginPage.login(user.username, user.password);
    
    const expectedProducts = TestDataHelper.getProducts();
    const displayedProducts = await productsPage.getAllProductNames();
    
    // Verify each expected product is displayed
    expectedProducts.forEach(product => {
      expect(displayedProducts).toContain(product.name);
    });
  });
});