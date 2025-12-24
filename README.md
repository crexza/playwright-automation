# Playwright Test Automation - 12 Week Learning Guide

## 📋 Overview
This guide will take you from beginner to intermediate level in Playwright test automation over 12 weeks. You'll learn JavaScript, Playwright framework, and industry best practices for test automation.

**Target Site for Practice:** https://www.saucedemo.com/

---

## 🎯 Learning Objectives
By the end of this program, you will be able to:
- Write maintainable and scalable test automation scripts
- Implement Page Object Model design pattern
- Handle various web elements and scenarios
- Debug and troubleshoot test failures
- Integrate tests with CI/CD pipelines
- Follow coding best practices and standards

---

## 📅 12-Week Progressive Learning Plan

### **Weeks 1-2: Foundation & Environment Setup**
- Setting up development environment
- Understanding basic JavaScript concepts
- Writing your first Playwright test
- Version control basics with Git

### **Weeks 3-4: Core Playwright Concepts**
- Locator strategies and best practices
- Interacting with different web elements
- Assertions and verifications
- Test organization and structure

### **Weeks 5-6: Intermediate Concepts**
- Page Object Model implementation
- Handling dynamic content and waits
- Working with multiple pages and contexts
- Test data management

### **Weeks 7-8: Advanced Interactions**
- File uploads and downloads
- API testing with Playwright
- Visual regression testing
- Handling authentication

### **Weeks 9-10: Test Organization & Reporting**
- Test suites and tagging
- Parallel execution
- Custom reporters
- Screenshot and video capture

### **Weeks 11-12: Best Practices & Real-World Scenarios**
- Error handling and retry mechanisms
- Performance testing basics
- CI/CD integration
- Code review and maintenance strategies

---

## 🛠️ Part 1: Environment Setup

### Step 1: Install Visual Studio Code

1. Download VSCode from https://code.visualstudio.com/
2. Install the application following the installer prompts
3. Launch VSCode

### Step 2: Install Required VSCode Extensions

Open VSCode and install these extensions (Ctrl+Shift+X or Cmd+Shift+X):

1. **JavaScript (ES6) code snippets** - for code completion
2. **ESLint** - for code quality and formatting
3. **Playwright Test for VSCode** - official Playwright extension
4. **GitLens** - enhanced Git capabilities
5. **Prettier - Code formatter** - consistent code formatting
6. **Path Intellisense** - autocomplete for file paths

### Step 3: Install Node.js

1. Download Node.js LTS from https://nodejs.org/
2. Install following the installer (includes npm)
3. Verify installation:
```bash
node --version
npm --version
```

### Step 4: Create Project Directory

```bash
# Create project folder
mkdir playwright-automation
cd playwright-automation
```

### Step 5: Initialize Node.js Project

```bash
# Initialize package.json
npm init -y
```

### Step 6: Install Playwright

```bash
# Install Playwright with browsers
npm init playwright@latest

# During installation, choose:
# - JavaScript as language
# - tests folder for test files
# - Add GitHub Actions workflow? No (we'll do this later)
# - Install Playwright browsers? Yes
```

### Step 7: Install Additional Dependencies

```bash
# Install development dependencies
npm install --save-dev @faker-js/faker
npm install --save-dev dotenv
npm install --save-dev eslint
```

### Step 8: Project Structure Setup

Your project should look like this:

```
playwright-automation/
├── node_modules/
├── tests/
│   └── example.spec.js
├── pages/              # We'll create this for Page Objects
├── test-data/          # We'll create this for test data
├── utils/              # We'll create this for helper functions
├── .gitignore
├── package.json
├── playwright.config.js
└── README.md
```

Create the additional folders:
```bash
mkdir pages test-data utils
```

### Step 9: Configure ESLint

Create `.eslintrc.json` in project root:

```json
{
  "env": {
    "browser": true,
    "es2021": true,
    "node": true
  },
  "extends": "eslint:recommended",
  "parserOptions": {
    "ecmaVersion": "latest",
    "sourceType": "module"
  },
  "rules": {
    "indent": ["error", 2],
    "linebreak-style": ["error", "unix"],
    "quotes": ["error", "single"],
    "semi": ["error", "always"],
    "no-unused-vars": "warn",
    "no-console": "off"
  }
}
```

### Step 10: Update playwright.config.js

Replace the content with this optimized configuration:

```javascript
// @ts-check
const { defineConfig, devices } = require('@playwright/test');

module.exports = defineConfig({
  testDir: './tests',
  timeout: 30 * 1000,
  expect: {
    timeout: 5000
  },
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [
    ['html'],
    ['list']
  ],
  use: {
    baseURL: 'https://www.saucedemo.com',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    headless: true
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    // Uncomment to test on other browsers
    // {
    //   name: 'firefox',
    //   use: { ...devices['Desktop Firefox'] },
    // },
    // {
    //   name: 'webkit',
    //   use: { ...devices['Desktop Safari'] },
    // },
  ],
});
```

### Step 11: Update .gitignore

Create or update `.gitignore`:

```
node_modules/
/test-results/
/playwright-report/
/playwright/.cache/
.env
.DS_Store
package-lock.json
```

---

## 📦 Part 2: Git and GitHub Setup

### Step 1: Initialize Git Repository

```bash
# Initialize git
git init

# Configure user (first time only)
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"

# Add files to staging
git add .

# Create first commit
git commit -m "Initial project setup with Playwright"
```

### Step 2: Create GitHub Repository

1. Go to https://github.com
2. Click "New repository"
3. Name it `playwright-automation`
4. Don't initialize with README (we already have one)
5. Click "Create repository"

### Step 3: Push to GitHub

```bash
# Add remote repository
git remote add origin https://github.com/YOUR_USERNAME/playwright-automation.git

# Push to GitHub
git branch -M main
git push -u origin main
```

### Step 4: Regular Git Workflow

```bash
# Check status
git status

# Add specific files
git add tests/login.spec.js

# Or add all changes
git add .

# Commit with meaningful message
git commit -m "Add login test scenarios"

# Push to GitHub
git push

# Pull latest changes (before starting work)
git pull
```

---

## 🧪 Part 3: Your First Test - Week 1-2

### Week 1: Basic Login Test

Create `tests/week1-basic-login.spec.js`:

```javascript
const { test, expect } = require('@playwright/test');

test.describe('Week 1: Basic Login Tests', () => {
  
  test('should login successfully with valid credentials', async ({ page }) => {
    // Step 1: Navigate to the website
    await page.goto('https://www.saucedemo.com');
    
    // Step 2: Fill in username
    await page.fill('#user-name', 'standard_user');
    
    // Step 3: Fill in password
    await page.fill('#password', 'secret_sauce');
    
    // Step 4: Click login button
    await page.click('#login-button');
    
    // Step 5: Verify successful login by checking URL
    await expect(page).toHaveURL('https://www.saucedemo.com/inventory.html');
    
    // Step 6: Verify products page is displayed
    await expect(page.locator('.inventory_list')).toBeVisible();
  });

  test('should show error message with invalid credentials', async ({ page }) => {
    await page.goto('https://www.saucedemo.com');
    
    // Use wrong credentials
    await page.fill('#user-name', 'invalid_user');
    await page.fill('#password', 'wrong_password');
    await page.click('#login-button');
    
    // Verify error message appears
    const errorMessage = page.locator('[data-test="error"]');
    await expect(errorMessage).toBeVisible();
    await expect(errorMessage).toContainText('Epic sadface');
  });
});
```

**Run your first test:**

```bash
# Run in headed mode to see browser
npx playwright test week1-basic-login.spec.js --headed

# Run in headless mode
npx playwright test week1-basic-login.spec.js

# Run specific test by name
npx playwright test --grep "should login successfully"

# View HTML report
npx playwright show-report
```

### Week 2: Understanding Selectors

Create `tests/week2-selectors-practice.spec.js`:

```javascript
const { test, expect } = require('@playwright/test');

test.describe('Week 2: Learning Different Selectors', () => {
  
  test.beforeEach(async ({ page }) => {
    await page.goto('https://www.saucedemo.com');
    await page.fill('#user-name', 'standard_user');
    await page.fill('#password', 'secret_sauce');
    await page.click('#login-button');
  });

  test('CSS Selector - Select by ID', async ({ page }) => {
    // Using ID selector
    const menuButton = page.locator('#react-burger-menu-btn');
    await expect(menuButton).toBeVisible();
  });

  test('CSS Selector - Select by Class', async ({ page }) => {
    // Using class selector
    const inventoryItems = page.locator('.inventory_item');
    await expect(inventoryItems).toHaveCount(6);
  });

  test('Data Attribute Selector (BEST PRACTICE)', async ({ page }) => {
    // Using data-test attribute (most stable)
    const addToCartButton = page.locator('[data-test="add-to-cart-sauce-labs-backpack"]');
    await addToCartButton.click();
    
    // Verify cart badge shows 1
    await expect(page.locator('.shopping_cart_badge')).toHaveText('1');
  });

  test('Text-based Selector', async ({ page }) => {
    // Find element by text content
    const productName = page.getByText('Sauce Labs Backpack');
    await expect(productName).toBeVisible();
  });

  test('Combining Selectors', async ({ page }) => {
    // Find element within another element
    const firstProduct = page.locator('.inventory_item').first();
    const addButton = firstProduct.locator('button');
    await expect(addButton).toBeVisible();
  });
});
```

**Best Practices - Locator Strategy Priority:**

1. **Data attributes** (`data-test`, `data-testid`) - MOST STABLE ⭐
2. **ID selectors** (`#unique-id`) - Good for unique elements
3. **Role-based** (`getByRole('button')`) - Accessibility-friendly
4. **Text content** (`getByText('Login')`) - Good for labels
5. **CSS classes** (`.class-name`) - Use with caution (may change)
6. **XPath** - AVOID unless absolutely necessary ❌

---

## 📚 Week 3-4: Core Playwright Concepts

### Week 3: Interacting with Elements

Create `tests/week3-element-interactions.spec.js`:

```javascript
const { test, expect } = require('@playwright/test');

test.describe('Week 3: Element Interactions', () => {
  
  test.beforeEach(async ({ page }) => {
    await page.goto('https://www.saucedemo.com');
    await page.fill('#user-name', 'standard_user');
    await page.fill('#password', 'secret_sauce');
    await page.click('#login-button');
  });

  test('Click interactions - Add items to cart', async ({ page }) => {
    // Single click
    await page.click('[data-test="add-to-cart-sauce-labs-backpack"]');
    
    // Verify button text changed
    await expect(page.locator('[data-test="remove-sauce-labs-backpack"]')).toBeVisible();
    
    // Add another item
    await page.locator('[data-test="add-to-cart-sauce-labs-bike-light"]').click();
    
    // Verify cart count
    await expect(page.locator('.shopping_cart_badge')).toHaveText('2');
  });

  test('Dropdown/Select interactions', async ({ page }) => {
    // Select from dropdown
    await page.selectOption('[data-test="product-sort-container"]', 'lohi');
    
    // Verify first product is lowest price
    const firstProductPrice = await page.locator('.inventory_item_price').first().textContent();
    expect(firstProductPrice).toBe('$7.99');
  });

  test('Navigation and links', async ({ page }) => {
    // Click on a product
    await page.click('.inventory_item_name >> text=Sauce Labs Backpack');
    
    // Verify we're on product detail page
    await expect(page).toHaveURL(/inventory-item/);
    
    // Go back
    await page.click('[data-test="back-to-products"]');
    
    // Verify we're back on products page
    await expect(page).toHaveURL(/inventory.html/);
  });

  test('Multiple element handling', async ({ page }) => {
    // Get all "Add to cart" buttons
    const addToCartButtons = page.locator('[id^="add-to-cart"]');
    
    // Get count of buttons
    const count = await addToCartButtons.count();
    console.log(`Total products: ${count}`);
    
    // Click first 3 items
    for (let i = 0; i < 3; i++) {
      await addToCartButtons.nth(i).click();
    }
    
    // Verify cart count
    await expect(page.locator('.shopping_cart_badge')).toHaveText('3');
  });

  test('Checkbox and radio interactions', async ({ page }) => {
    // Navigate to cart
    await page.click('[data-test="add-to-cart-sauce-labs-backpack"]');
    await page.click('.shopping_cart_link');
    
    // Verify item is in cart
    await expect(page.locator('.cart_item')).toHaveCount(1);
  });
});
```

### Week 4: Assertions and Verifications

Create `tests/week4-assertions.spec.js`:

```javascript
const { test, expect } = require('@playwright/test');

test.describe('Week 4: Assertions and Verifications', () => {
  
  test.beforeEach(async ({ page }) => {
    await page.goto('https://www.saucedemo.com');
  });

  test('Visibility assertions', async ({ page }) => {
    // Element is visible
    await expect(page.locator('#login-button')).toBeVisible();
    
    // Element is hidden (not present initially)
    await expect(page.locator('[data-test="error"]')).toBeHidden();
  });

  test('Text content assertions', async ({ page }) => {
    // Exact text match
    const loginButton = page.locator('#login-button');
    await expect(loginButton).toHaveText('Login');
    
    // Contains text
    await expect(page.locator('.login_logo')).toContainText('Swag Labs');
  });

  test('Input value assertions', async ({ page }) => {
    // Fill input
    await page.fill('#user-name', 'standard_user');
    
    // Verify input value
    await expect(page.locator('#user-name')).toHaveValue('standard_user');
  });

  test('URL assertions', async ({ page }) => {
    // Exact URL
    await expect(page).toHaveURL('https://www.saucedemo.com/');
    
    // After login, check URL contains
    await page.fill('#user-name', 'standard_user');
    await page.fill('#password', 'secret_sauce');
    await page.click('#login-button');
    await expect(page).toHaveURL(/inventory/);
  });

  test('Element state assertions', async ({ page }) => {
    const loginButton = page.locator('#login-button');
    
    // Button is enabled
    await expect(loginButton).toBeEnabled();
    
    // Input is editable
    await expect(page.locator('#user-name')).toBeEditable();
  });

  test('Count assertions', async ({ page }) => {
    await page.fill('#user-name', 'standard_user');
    await page.fill('#password', 'secret_sauce');
    await page.click('#login-button');
    
    // Count items
    const products = page.locator('.inventory_item');
    await expect(products).toHaveCount(6);
  });

  test('Attribute assertions', async ({ page }) => {
    // Check element has specific attribute
    await expect(page.locator('#user-name')).toHaveAttribute('placeholder', 'Username');
  });

  test('Soft assertions - Continue on failure', async ({ page }) => {
    await page.fill('#user-name', 'standard_user');
    await page.fill('#password', 'secret_sauce');
    await page.click('#login-button');
    
    // Soft assertions don't stop test execution
    await expect.soft(page.locator('.title')).toHaveText('Products');
    await expect.soft(page.locator('.inventory_list')).toBeVisible();
    await expect.soft(page.locator('.shopping_cart_link')).toBeVisible();
    
    // Test continues even if soft assertions fail
    console.log('Test continues after soft assertions');
  });
});
```

---

## 🏗️ Week 5-6: Page Object Model

### Understanding Page Object Model (POM)

Page Object Model is a design pattern that:
- Separates test logic from page-specific code
- Makes tests more maintainable
- Reduces code duplication
- Makes tests more readable

### Week 5: Creating Page Objects

Create `pages/BasePage.js`:

```javascript
class BasePage {
  constructor(page) {
    this.page = page;
  }

  async navigate(path = '') {
    await this.page.goto(`https://www.saucedemo.com${path}`);
  }

  async waitForPageLoad() {
    await this.page.waitForLoadState('networkidle');
  }

  async getPageTitle() {
    return await this.page.title();
  }
}

module.exports = BasePage;
```

Create `pages/LoginPage.js`:

```javascript
const BasePage = require('./BasePage');

class LoginPage extends BasePage {
  constructor(page) {
    super(page);
    
    // Locators
    this.usernameInput = page.locator('#user-name');
    this.passwordInput = page.locator('#password');
    this.loginButton = page.locator('#login-button');
    this.errorMessage = page.locator('[data-test="error"]');
  }

  // Actions
  async login(username, password) {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }

  async isErrorDisplayed() {
    return await this.errorMessage.isVisible();
  }

  async getErrorMessage() {
    return await this.errorMessage.textContent();
  }

  async clearLoginForm() {
    await this.usernameInput.clear();
    await this.passwordInput.clear();
  }
}

module.exports = LoginPage;
```

Create `pages/ProductsPage.js`:

```javascript
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
```

Create `pages/CartPage.js`:

```javascript
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
```

### Week 6: Using Page Objects in Tests

Create `tests/week6-pom-tests.spec.js`:

```javascript
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
```

**Benefits of Page Object Model:**
- ✅ Tests are more readable and maintainable
- ✅ Changes to UI only require updates in one place
- ✅ Reusable methods across multiple tests
- ✅ Clear separation of concerns
- ✅ Easier to onboard new team members

---

## 📊 Week 7-8: Test Data Management

### Week 7: Test Data Organization

Create `test-data/users.json`:

```json
{
  "validUsers": {
    "standard": {
      "username": "standard_user",
      "password": "secret_sauce"
    },
    "problem": {
      "username": "problem_user",
      "password": "secret_sauce"
    },
    "performance": {
      "username": "performance_glitch_user",
      "password": "secret_sauce"
    }
  },
  "invalidUsers": [
    {
      "username": "invalid_user",
      "password": "wrong_password",
      "expectedError": "Epic sadface: Username and password do not match"
    },
    {
      "username": "",
      "password": "secret_sauce",
      "expectedError": "Epic sadface: Username is required"
    },
    {
      "username": "standard_user",
      "password": "",
      "expectedError": "Epic sadface: Password is required"
    }
  ],
  "lockedUser": {
    "username": "locked_out_user",
    "password": "secret_sauce",
    "expectedError": "Epic sadface: Sorry, this user has been locked out"
  }
}
```

Create `test-data/products.json`:

```json
{
  "testProducts": [
    {
      "name": "Sauce Labs Backpack",
      "dataTestId": "sauce-labs-backpack",
      "price": 29.99
    },
    {
      "name": "Sauce Labs Bike Light",
      "dataTestId": "sauce-labs-bike-light",
      "price": 9.99
    },
    {
      "name": "Sauce Labs Bolt T-Shirt",
      "dataTestId": "sauce-labs-bolt-t-shirt",
      "price": 15.99
    },
    {
      "name": "Sauce Labs Fleece Jacket",
      "dataTestId": "sauce-labs-fleece-jacket",
      "price": 49.99
    }
  ],
  "sortOptions": {
    "nameAsc": "az",
    "nameDesc": "za",
    "priceLowToHigh": "lohi",
    "priceHighToLow": "hilo"
  }
}
```

Create `utils/TestDataHelper.js`:

```javascript
const fs = require('fs');
const path = require('path');

class TestDataHelper {
  static loadJsonData(filename) {
    const filePath = path.join(__dirname, '../test-data', filename);
    const rawData = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(rawData);
  }

  static getValidUser(userType = 'standard') {
    const users = this.loadJsonData('users.json');
    return users.validUsers[userType];
  }

  static getInvalidUsers() {
    const users = this.loadJsonData('users.json');
    return users.invalidUsers;
  }

  static getLockedUser() {
    const users = this.loadJsonData('users.json');
    return users.lockedUser;
  }

  static getProducts() {
    const products = this.loadJsonData('products.json');
    return products.testProducts;
  }

  static getRandomProduct() {
    const products = this.getProducts();
    return products[Math.floor(Math.random() * products.length)];
  }

  static getProductByName(name) {
    const products = this.getProducts();
    return products.find(p => p.name === name);
  }
}

module.exports = TestDataHelper;
```

Create `tests/week7-data-driven-tests.spec.js`:

```javascript
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
    
    // Get 3 random products
    const product1 = TestDataHelper.getRandomProduct();
    const product2 = TestDataHelper.getRandomProduct();
    const product3 = TestDataHelper.getRandomProduct();
    
    // Add to cart
    await productsPage.addProductToCart(product1.dataTestId);
    await productsPage.addProductToCart(product2.dataTestId);
    await productsPage.addProductToCart(product3.dataTestId);
    
    // Verify cart count
    expect(await productsPage.getCartItemCount()).toBe(3);
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
```

### Week 8: Environment Configuration

Create `.env.example`:

```
# Application URL
BASE_URL=https://www.saucedemo.com

# Test Users
STANDARD_USER=standard_user
STANDARD_PASSWORD=secret_sauce

# Test Configuration
HEADLESS=true
TIMEOUT=30000
RETRIES=2

# Browser Configuration
BROWSER=chromium
```

Create `.env` (copy from .env.example and customize):
```bash
cp .env.example .env
```

Create `utils/ConfigHelper.js`:

```javascript
require('dotenv').config();

class ConfigHelper {
  static getBaseUrl() {
    return process.env.BASE_URL || 'https://www.saucedemo.com';
  }

  static getStandardUser() {
    return {
      username: process.env.STANDARD_USER || 'standard_user',
      password: process.env.STANDARD_PASSWORD || 'secret_sauce'
    };
  }

  static isHeadless() {
    return process.env.HEADLESS === 'true';
  }

  static getTimeout() {
    return parseInt(process.env.TIMEOUT) || 30000;
  }

  static getRetries() {
    return parseInt(process.env.RETRIES) || 0;
  }

  static getBrowser() {
    return process.env.BROWSER || 'chromium';
  }
}

module.exports = ConfigHelper;
```

Create `tests/week8-configuration-tests.spec.js`:

```javascript
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
```

---

## 🎯 Week 9-10: Advanced Testing Concepts

### Week 9: Fixtures and Hooks

Create `tests/fixtures/testFixtures.js`:

```javascript
const { test as base } = require('@playwright/test');
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
```

Create `tests/week9-hooks-and-fixtures.spec.js`:

```javascript
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
```

### Week 10: Test Organization and Tagging

Create `tests/week10-test-organization.spec.js`:

```javascript
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
```

**Run tests by tags:**

```bash
# Run smoke tests only
npx playwright test --grep @smoke

# Run critical tests
npx playwright test --grep @critical

# Run regression but exclude edge cases
npx playwright test --grep @regression --grep-invert @edge-cases

# Run specific combination
npx playwright test --grep "@smoke|@critical"
```

---

## 📈 Week 11-12: Best Practices & Real-World Scenarios

### Week 11: Error Handling and Resilience

Create `utils/WaitHelper.js`:

```javascript
class WaitHelper {
  static async waitForElement(page, selector, timeout = 5000) {
    try {
      await page.waitForSelector(selector, { 
        state: 'visible', 
        timeout 
      });
      return true;
    } catch (error) {
      console.error(`Element ${selector} not found within ${timeout}ms`);
      return false;
    }
  }

  static async waitForNavigation(page, timeout = 30000) {
    try {
      await page.waitForLoadState('networkidle', { timeout });
      return true;
    } catch (error) {
      console.error('Page navigation timeout');
      return false;
    }
  }

  static async retryAction(action, maxRetries = 3, delayMs = 1000) {
    for (let i = 0; i < maxRetries; i++) {
      try {
        await action();
        return true;
      } catch (error) {
        console.log(`Attempt ${i + 1} failed: ${error.message}`);
        if (i < maxRetries - 1) {
          await this.sleep(delayMs);
        }
      }
    }
    throw new Error(`Action failed after ${maxRetries} attempts`);
  }

  static async sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  static async waitForTextChange(page, selector, expectedText, timeout = 5000) {
    const endTime = Date.now() + timeout;
    
    while (Date.now() < endTime) {
      const currentText = await page.locator(selector).textContent();
      if (currentText === expectedText) {
        return true;
      }
      await this.sleep(100);
    }
    return false;
  }
}

module.exports = WaitHelper;
```

Create `tests/week11-error-handling.spec.js`:

```javascript
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
```

### Week 12: Reporting and CI/CD Preparation

Create `tests/week12-advanced-scenarios.spec.js`:

```javascript
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
```

Create `.github/workflows/playwright.yml` for CI/CD:

```yaml
name: Playwright Tests

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]
  schedule:
    # Run tests every day at 2 AM
    - cron: '0 2 * * *'

jobs:
  test:
    timeout-minutes: 60
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - uses: actions/setup-node@v3
      with:
        node-version: 18
        
    - name: Install dependencies
      run: npm ci
      
    - name: Install Playwright Browsers
      run: npx playwright install --with-deps
      
    - name: Run Playwright tests
      run: npx playwright test
      
    - uses: actions/upload-artifact@v3
      if: always()
      with:
        name: playwright-report
        path: playwright-report/
        retention-days: 30
```

---

## 📝 Best Practices Summary

### 1. **Code Organization**
```
✅ DO:
- Use Page Object Model
- Keep tests independent
- One assertion per test (generally)
- Descriptive test names

❌ DON'T:
- Hard-code test data in tests
- Create test dependencies
- Use sleeps (use proper waits)
- Ignore error handling
```

### 2. **Locator Strategy Priority**
```
1. Data attributes (data-test-id) ⭐⭐⭐⭐⭐
2. ID selectors (#id) ⭐⭐⭐⭐
3. Role-based (getByRole) ⭐⭐⭐⭐
4. Text content (getByText) ⭐⭐⭐
5. CSS classes (.class) ⭐⭐
6. XPath (avoid unless necessary) ⭐
```

### 3. **Test Structure**
```javascript
// AAA Pattern: Arrange, Act, Assert
test('should add product to cart', async ({ page }) => {
  // Arrange: Setup
  await loginPage.navigate();
  await loginPage.login('user', 'pass');
  
  // Act: Perform action
  await productsPage.addProductToCart('product-name');
  
  // Assert: Verify result
  expect(await productsPage.getCartItemCount()).toBe(1);
});
```

### 4. **Waiting Strategies**
```javascript
// ✅ GOOD: Auto-waiting
await page.click('button');
await expect(page.locator('.message')).toBeVisible();

// ✅ GOOD: Explicit wait for condition
await page.waitForSelector('.loaded', { state: 'visible' });

// ❌ BAD: Fixed sleep
await page.waitForTimeout(3000); // Avoid this!
```

### 5. **Error Messages**
```javascript
// ✅ GOOD: Descriptive messages
expect(cartCount, 'Cart should contain 2 items after adding products').toBe(2);

// ❌ BAD: No context
expect(cartCount).toBe(2);
```

### 6. **Test Independence**
```javascript
// ✅ GOOD: Each test is independent
test.beforeEach(async ({ page }) => {
  await loginPage.navigate();
  await loginPage.login('user', 'pass');
});

// ❌ BAD: Tests depend on each other
test('add product', async () => { /* ... */ });
test('checkout', async () => { /* expects product from previous test */ });
```

---

## 🎓 Weekly Progress Checklist

### Week 1-2: Foundation
- [ ] VSCode installed and configured
- [ ] Node.js and npm installed
- [ ] Playwright project initialized
- [ ] First test written and executed
- [ ] Git repository created
- [ ] Code pushed to GitHub
- [ ] Understanding of basic selectors

### Week 3-4: Core Concepts
- [ ] Element interactions mastered
- [ ] Different assertion types used
- [ ] Test organization understood
- [ ] Debugging basics learned
- [ ] Screenshot and video capture used

### Week 5-6: POM Implementation
- [ ] Page Object Model structure created
- [ ] Base page implemented
- [ ] At least 3 page objects created
- [ ] Tests refactored to use POM
- [ ] Understanding of DRY principle

### Week 7-8: Test Data
- [ ] Test data externalized to JSON
- [ ] Data helper utility created
- [ ] Data-driven tests implemented
- [ ] Environment configuration setup
- [ ] .env file configured

### Week 9-10: Advanced Concepts
- [ ] Custom fixtures created
- [ ] Hooks implemented
- [ ] Test tagging used
- [ ] Parallel execution tested
- [ ] Custom reporting explored

### Week 11-12: Production Ready
- [ ] Error handling implemented
- [ ] Retry mechanisms added
- [ ] Complete E2E scenarios written
- [ ] CI/CD pipeline configured
- [ ] Code review checklist created
- [ ] Documentation updated

---

## 🚀 Running Tests - Quick Reference

```bash
# Run all tests
npx playwright test

# Run specific file
npx playwright test tests/login.spec.js

# Run in headed mode (see browser)
npx playwright test --headed

# Run in debug mode
npx playwright test --debug

# Run specific browser
npx playwright test --project=chromium

# Run tests matching pattern
npx playwright test --grep "login"

# Run tests by tag
npx playwright test --grep @smoke

# Run with specific number of workers
npx playwright test --workers=2

# Show report
npx playwright show-report

# Update snapshots (for visual testing)
npx playwright test --update-snapshots

# Run in UI mode (interactive)
npx playwright test --ui
```

---

## 🐛 Debugging Tips

### 1. **Visual Debugging**
```javascript
// Slow down actions
await page.pause(); // Pauses execution

// Add console logs
console.log('Current URL:', page.url());
console.log('Cart count:', await productsPage.getCartItemCount());
```

### 2. **Screenshots on Failure**
```javascript
test.afterEach(async ({ page }, testInfo) => {
  if (testInfo.status !== 'passed') {
    await page.screenshot({ 
      path: `screenshots/${testInfo.title}-${Date.now()}.png` 
    });
  }
});
```

### 3. **Trace Viewer**
```bash
# Run with trace
npx playwright test --trace on

# View trace
npx playwright show-trace trace.zip
```

### 4. **Inspector**
```bash
# Run with inspector
npx playwright test --debug

# Record test
npx playwright codegen https://www.saucedemo.com
```

---

## 📚 Additional Resources

### Official Documentation
- Playwright Docs: https://playwright.dev
- JavaScript MDN: https://developer.mozilla.org/en-US/docs/Web/JavaScript

### Recommended Reading
- Page Object Model Pattern
- Test Automation Best Practices
- JavaScript ES6+ Features
- Git Version Control Basics

### Community
- Playwright Discord: https://discord.gg/playwright
- Stack Overflow: [playwright] tag
- GitHub Discussions: Playwright repository

---

## 🎯 Success Criteria

By the end of 12 weeks, you should be able to:

✅ Write clean, maintainable test automation code
✅ Implement Page Object Model effectively
✅ Handle various web elements and scenarios
✅ Debug and troubleshoot test failures independently
✅ Organize and structure test suites
✅ Use Git for version control
✅ Follow coding best practices
✅ Explain your test automation decisions
✅ Review and improve existing test code
✅ Contribute to team's automation efforts

---

## 💡 Tips for Success

1. **Practice Daily**: Consistency is key - practice at least 1 hour daily
2. **Understand Before Copying**: Don't just copy code, understand what it does
3. **Ask Questions**: Don't hesitate to ask for clarification
4. **Review Others' Code**: Learn from existing test code
5. **Take Notes**: Document your learnings and challenges
6. **Build Side Projects**: Create additional test scenarios beyond the guide
7. **Join Community**: Participate in Playwright community discussions
8. **Stay Updated**: Follow Playwright release notes and updates

---

## 📞 Getting Help

When you're stuck:

1. **Check Console Errors**: Read error messages carefully
2. **Add Debug Logs**: Use console.log to understand flow
3. **Use Playwright Inspector**: Debug step by step
4. **Search Documentation**: Check official Playwright docs
5. **Ask Your Team**: Share your code and error with mentors
6. **Stack Overflow**: Search for similar issues
7. **GitHub Issues**: Check Playwright GitHub for known issues

---

## 🎉 Final Project (Week 12)

Create a complete test suite that includes:

1. **Login Scenarios** (5+ tests)
   - Valid login
   - Invalid credentials
   - Locked user
   - Empty fields
   - SQL injection attempt

2. **Shopping Flow** (8+ tests)
   - Browse products
   - Sort products
   - Add to cart
   - Remove from cart
   - Cart calculations
   - Complete checkout
   - Multiple items
   - Edge cases

3. **Test Organization**
   - Use Page Object Model
   - Implement test data management
   - Add proper assertions
   - Include error handling
   - Add screenshots/videos on failure

4. **Documentation**
   - Update README
   - Add test case documentation
   - Include setup instructions
   - Document known issues

5. **CI/CD Integration**
   - GitHub Actions workflow
   - Automated test execution
   - Report generation
   - Artifact upload

---

## 🔄 Continuous Improvement

After completing the 12 weeks:

- **Review Your Code**: Refactor and improve
- **Performance Testing**: Add response time checks
- **Visual Testing**: Implement screenshot comparison
- **API Testing**: Add backend API tests
- **Mobile Testing**: Test on mobile viewports
- **Accessibility**: Add accessibility checks
- **Security**: Add security test scenarios

---

Good luck with your Playwright learning journey! Remember, becoming proficient takes time and practice. Don't rush through the weeks - make sure you understand each concept before moving forward. 🚀

**Questions or feedback?** Create an issue in your repository or discuss with your team lead!
