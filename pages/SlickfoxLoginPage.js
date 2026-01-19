const SlickfoxBasePage = require('./SlickfoxBasePage');
const { expect } = require('@playwright/test');

class SlickfoxLoginPage extends SlickfoxBasePage {
  constructor(page) {
    super(page);

    // Login page locators
    this.loginLink = page.getByRole('link', { name: /log in/i });
    this.emailInput = page.locator('input[type="email"]');
    this.passwordInput = page.locator('input[type="password"]');
    this.rememberMeCheckbox = page.locator('input[type="checkbox"]');
    this.loginButton = page.getByRole('button', { name: /login|sign in/i });
    this.forgotPasswordLink = page.getByRole('link', { name: /forgot password/i });
    this.emailInput = page.locator('input[type="email"]');
    this.submitButton = page.getByRole('button', { name: /reset|send/i });
    this.successMessage = page.locator('[role="alert"], .alert, .success');


    // Header locators (after login)
    // Unique avatar/user menu button
    this.userMenuButton = page.locator('nav button:has(img)');

    // Logout button (actual button in DOM, not menuitem)
    this.logoutButton = page.getByRole('button', { name: /log out/i });
  }

  // Open the login page
  async openLoginPage() {
    await this.goto();
    await this.loginLink.click();
  }

  // Login function with optional Remember Me
  async login(email, password, rememberMe = false) {
  await this.emailInput.fill(email);
  await this.passwordInput.fill(password);

  if (rememberMe) {
    await this.rememberMeCheckbox.check();
  }

  await this.loginButton.click();

  // ✅ Reliable login success check
  await this.page.waitForURL(/dashboard/);
}


  // Logout function
  async logout() {
    await this.userMenuButton.click();

    // Ensure logout button is visible before clicking
    await expect(this.logoutButton).toBeVisible();
    await this.logoutButton.click();

    // Ensure login link is visible again after logout
    await expect(this.loginLink).toBeVisible();
  }

  async goToForgotPassword() {
  await this.forgotPasswordLink.click();
}

async requestPasswordReset(email) {
  await this.emailInput.fill(email);
  await this.submitButton.click();
}





}

module.exports = SlickfoxLoginPage;
