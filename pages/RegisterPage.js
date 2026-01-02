const SlickfoxBasePage = require('./SlickfoxBasePage');

class RegisterPage extends SlickfoxBasePage {
  constructor(page) {
    super(page);

    // Locators
    this.getStartedButton = page.getByRole('button', { name: /Get Started/i });
    this.nameInput = page.locator('#name');
    this.emailInput = page.locator('input[type="email"]');
    this.passwordInput = page.locator('input[placeholder="Min. 8 characters"]');
    this.confirmPasswordInput = page.locator('input[placeholder="Re-enter password"]');
    this.companyInput = page.locator('input[placeholder="Acme Corporation"]');
    this.phoneInput = page.locator('input[placeholder="+60 12-345-6789"]');
    this.tier1Heading = page.getByRole('heading', { name: /Tier 1/i });
    this.termsCheckbox = page.locator('#terms');
    this.completeRegistrationButton = page.getByRole('button', { name: /Complete Registration/i });
  }

  async openRegisterPage() {
    await this.goto();
    await this.getStartedButton.click();
  }

  async register(user) {
    await this.nameInput.fill(user.name);
    await this.emailInput.fill(user.email);
    await this.passwordInput.fill(user.password);
    await this.confirmPasswordInput.fill(user.confirmPassword);
    await this.companyInput.fill(user.company);
    await this.phoneInput.fill(user.phone);
    await this.tier1Heading.click();
    await this.termsCheckbox.check();
    await this.completeRegistrationButton.click();
  }

  async getErrorByText(text) {
    return this.page.getByText(text);
  }
}

module.exports = RegisterPage;
