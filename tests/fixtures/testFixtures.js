const { test: base } = require('@playwright/test');
const LoginPage = require('../../pages/LoginPage');
const ProductsPage = require('../../pages/ProductsPage');
const CartPage = require('../../pages/CartPage');
const ConfigHelper = require('../../utils/ConfigHelper');

// Extend base test with custom fixtures
const test = base.extend({
  // Auto-login fixture
  authenticatedPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await loginPage.navigate();
    
    const user = ConfigHelper.getStandardUser();
    await loginPage.login(user.username, user.password);
    
    await use(page);
  },

  // Page objects fixture
  pageObjects: async ({ page }, use) => {
    const po = {
      loginPage: new LoginPage(page),
      productsPage: new ProductsPage(page),
      cartPage: new CartPage(page)
    };
    await use(po);
  }
});

module.exports = { test };