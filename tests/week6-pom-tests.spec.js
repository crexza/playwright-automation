const { test, expect } = require('@playwright/test');
const LoginPage = require('../pages/LoginPage');
const ProductsPage = require('../pages/ProductsPage');
const CartPage = require('../pages/CartPage');

test.describe('Week 6: Page Object Model Tests', () => {
  let loginPage;
  let productsPage;
  let cartPage;

  test.beforeEach(async ({ page }) => {
    // Initialize page objects
    loginPage = new LoginPage(page);
    productsPage = new ProductsPage(page);
    cartPage = new CartPage(page);
    
    // Navigate and login
    await loginPage.navigate();
    await loginPage.login('standard_user', 'secret_sauce');
  });

  test('Add multiple products to cart using POM', async ({ page }) => {
    // Add products
    await productsPage.addProductToCart('sauce-labs-backpack');
    await productsPage.addProductToCart('sauce-labs-bike-light');
    await productsPage.addProductToCart('sauce-labs-bolt-t-shirt');
    
    // Verify cart count
    const cartCount = await productsPage.getCartItemCount();
    expect(cartCount).toBe(3);
    
    // Go to cart
    await productsPage.goToCart();
    
    // Verify items in cart
    const itemsInCart = await cartPage.getCartItemCount();
    expect(itemsInCart).toBe(3);
  });

  test('Remove product from cart using POM', async ({ page }) => {
    // Add and remove product
    await productsPage.addProductToCart('sauce-labs-backpack');
    await productsPage.goToCart();
    
    await cartPage.removeItem('sauce-labs-backpack');
    
    // Verify cart is empty
    const isEmpty = await cartPage.isCartEmpty();
    expect(isEmpty).toBe(true);
  });

  test('Sort products and verify order', async ({ page }) => {
    // Sort by price low to high
    await productsPage.sortProducts('lohi');
    
    // Get all prices
    const prices = await productsPage.getAllProductPrices();
    
    // Verify prices are in ascending order
    for (let i = 0; i < prices.length - 1; i++) {
      expect(prices[i]).toBeLessThanOrEqual(prices[i + 1]);
    }
  });

  test('End-to-end shopping flow with POM', async ({ page }) => {
    // Step 1: Add products
    await productsPage.addProductToCart('sauce-labs-backpack');
    await productsPage.addProductToCart('sauce-labs-fleece-jacket');
    
    // Step 2: Verify cart badge
    expect(await productsPage.getCartItemCount()).toBe(2);
    
    // Step 3: Go to cart
    await productsPage.goToCart();
    
    // Step 4: Verify items
    const items = await cartPage.getItemNames();
    expect(items).toContain('Sauce Labs Backpack');
    expect(items).toContain('Sauce Labs Fleece Jacket');
    
    // Step 5: Remove one item
    await cartPage.removeItem('sauce-labs-backpack');
    
    // Step 6: Verify remaining item
    expect(await cartPage.getCartItemCount()).toBe(1);
  });
});