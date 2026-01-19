class ForgotPasswordPage {
  constructor(page) {
    this.page = page;

    // Forgot password page has its own Email input + submit button
    this.emailInput = page.getByRole('textbox', { name: /^email$/i });
    this.submitButton = page.getByRole('button', { name: /email password reset link/i });

    // Success + error feedback on this page
    this.successMessage = page.getByText(/we have emailed your password reset link/i);
    this.emailNotFoundMessage = page.getByText(/we can't find a user with that email address/i);
  }

  async requestReset(email) {
    await this.emailInput.fill(email);
    await this.submitButton.click();
  }
}

module.exports = ForgotPasswordPage;
