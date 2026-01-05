const { test, expect } = require('@playwright/test');
const LoginPage = require('../pages/LoginPage');
const ProductsPage = require('../pages/ProductsPage');
const ConfigHelper = require('../utils/ConfigHelper');

test.describe('Week 8: Configuration Management', () => {
  let loginPage;
  let productsPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    productsPage = new ProductsPage(page);
    
    // Use base URL from config
    await page.goto(ConfigHelper.getBaseUrl());
  });

  test('Login using credentials from configuration', async ({ page }) => {
    const user = ConfigHelper.getStandardUser();
    await loginPage.login(user.username, user.password);
    
    await expect(productsPage.pageTitle).toHaveText('Products');
  });

  test('Verify configuration values are loaded', async () => {
    console.log('Base URL:', ConfigHelper.getBaseUrl());
    console.log('Headless:', ConfigHelper.isHeadless());
    console.log('Timeout:', ConfigHelper.getTimeout());
    console.log('Browser:', ConfigHelper.getBrowser());
    
    expect(ConfigHelper.getBaseUrl()).toBeTruthy();
    expect(ConfigHelper.getStandardUser()).toHaveProperty('username');
  });
});