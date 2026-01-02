const BasePage = require('./BasePage');

class ProductsPage extends BasePage {
  constructor(page) {
    super(page);
    
    // Locators
    this.pageTitle = page.locator('.title');
    this.inventoryList = page.locator('.inventory_list');
    this.inventoryItems = page.locator('.inventory_item');
    this.cartBadge = page.locator('.shopping_cart_badge');
    this.cartLink = page.locator('.shopping_cart_link');
    this.sortDropdown = page.locator('[data-test="product-sort-container"]');
  }

  // Actions
  async getProductCount() {
    return await this.inventoryItems.count();
  }

  async addProductToCart(productName) {
    const addButton = this.page.locator(`[data-test="add-to-cart-${this.formatProductName(productName)}"]`);
    await addButton.click();
  }

  async removeProductFromCart(productName) {
    const removeButton = this.page.locator(`[data-test="remove-${this.formatProductName(productName)}"]`);
    await removeButton.click();
  }

  async getCartItemCount() {
    const isVisible = await this.cartBadge.isVisible();
    if (!isVisible) return 0;
    return parseInt(await this.cartBadge.textContent());
  }

  async goToCart() {
    await this.cartLink.click();
  }

  async sortProducts(sortOption) {
    // Options: 'az', 'za', 'lohi', 'hilo'
    await this.sortDropdown.selectOption(sortOption);
  }

  async clickProduct(productName) {
    await this.page.click(`.inventory_item_name:has-text("${productName}")`);
  }

  // Helper methods
  formatProductName(name) {
    return name.toLowerCase().replace(/\s+/g, '-');
  }

  async getAllProductNames() {
    const names = await this.page.locator('.inventory_item_name').allTextContents();
    return names;
  }

  async getAllProductPrices() {
    const prices = await this.page.locator('.inventory_item_price').allTextContents();
    return prices.map(price => parseFloat(price.replace('$', '')));
  }
}

module.exports = ProductsPage;