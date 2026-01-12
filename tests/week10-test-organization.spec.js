const { test } = require('./fixtures/testFixtures');
const { expect } = require('@playwright/test');

// Tag tests for selective execution
test.describe('Smoke Tests', { tag: '@smoke' }, () => {
  
  test('Critical: User can login @critical', async ({ pageObjects }) => {
    await pageObjects.loginPage.navigate();
    await pageObjects.loginPage.login('standard_user', 'secret_sauce');
    await expect(pageObjects.productsPage.pageTitle).toHaveText('Products');
  });

  test('Critical: User can add to cart @critical', async ({ authenticatedPage, pageObjects }) => {
    await pageObjects.productsPage.addProductToCart('sauce-labs-backpack');
    expect(await pageObjects.productsPage.getCartItemCount()).toBe(1);
  });
});

test.describe('Regression Tests', { tag: '@regression' }, () => {
  
  test('Sort products by price @sorting', async ({ authenticatedPage, pageObjects }) => {
    await pageObjects.productsPage.sortProducts('lohi');
    const prices = await pageObjects.productsPage.getAllProductPrices();
    
    for (let i = 0; i < prices.length - 1; i++) {
      expect(prices[i]).toBeLessThanOrEqual(prices[i + 1]);
    }
  });

  test('Remove product from cart @cart', async ({ authenticatedPage, pageObjects }) => {
    await pageObjects.productsPage.addProductToCart('sauce-labs-backpack');
    await pageObjects.productsPage.goToCart();
    await pageObjects.cartPage.removeItem('sauce-labs-backpack');
    
    expect(await pageObjects.cartPage.isCartEmpty()).toBe(true);
  });
});

test.describe('Edge Cases', { tag: '@edge-cases' }, () => {
  
  test('Handle locked out user @negative', async ({ pageObjects }) => {
    await pageObjects.loginPage.navigate();
    await pageObjects.loginPage.login('locked_out_user', 'secret_sauce');
    
    const isErrorDisplayed = await pageObjects.loginPage.isErrorDisplayed();
    expect(isErrorDisplayed).toBe(true);
  });
});