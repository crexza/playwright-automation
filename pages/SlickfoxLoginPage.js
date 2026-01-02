const SlickfoxBasePage = require('./SlickfoxBasePage');

class SlickfoxLoginPage extends SlickfoxBasePage {
  constructor(page) {
    super(page);

    // Locators
    this.loginLink = page.getByRole('link', { name: /Log in/i });
    this.emailInput = page.locator('input[type="email"]');
    this.passwordInput = page.locator('input[type="password"]');
    this.loginButton = page.getByRole('button', { name: /login|sign in/i });
  }

  async openLoginPage() {
    await this.goto();
    await this.loginLink.click();
  }

  async login(email, password) {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }
}

module.exports = SlickfoxLoginPage;
