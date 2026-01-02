const BasePage = require('./BasePage');

class CartPage extends BasePage {
  constructor(page) {
    super(page);
    
    // Locators
    this.pageTitle = page.locator('.title');
    this.cartItems = page.locator('.cart_item');
    this.checkoutButton = page.locator('[data-test="checkout"]');
    this.continueShoppingButton = page.locator('[data-test="continue-shopping"]');
    this.removeButtons = page.locator('[id^="remove"]');
  }

  // Actions
  async getCartItemCount() {
    return await this.cartItems.count();
  }

  async removeItem(productName) {
    const removeButton = this.page.locator(`[data-test="remove-${this.formatProductName(productName)}"]`);
    await removeButton.click();
  }

  async proceedToCheckout() {
    await this.checkoutButton.click();
  }

  async continueShopping() {
    await this.continueShoppingButton.click();
  }

  async getItemNames() {
    return await this.page.locator('.inventory_item_name').allTextContents();
  }

  async isCartEmpty() {
    const count = await this.getCartItemCount();
    return count === 0;
  }

  // Helper methods
  formatProductName(name) {
    return name.toLowerCase().replace(/\s+/g, '-');
  }
}

module.exports = CartPage;