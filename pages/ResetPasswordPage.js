class ResetPasswordPage {
  constructor(page) {
    this.page = page;
    this.passwordInput = page.getByLabel(/new password/i);
    this.confirmPasswordInput = page.getByLabel(/confirm password/i);
    this.submitButton = page.getByRole('button', { name: /reset/i });
    this.successMessage = page.getByText(/password updated|success/i);
  }

  async setNewPassword(password) {
    await this.passwordInput.fill(password);
    await this.confirmPasswordInput.fill(password);
    await this.submitButton.click();
  }
}

module.exports = ResetPasswordPage;
