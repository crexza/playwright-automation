class UserStoryCreatePage {
  constructor(page) {
    this.page = page;

    // Buttons
    this.submitBtn = page.getByRole('button', { name: /save|create/i });
    this.cancelBtn = page.getByRole('button', { name: /cancel/i });

    // Validation
    this.requiredMsg = page.getByText(/required|must|cannot be blank/i);
  }

  async waitForLoaded() {
    await this.page.waitForLoadState('networkidle');
  }

  async fillManualForm({ asA, iWant, soThat } = {}) {
    // Wait until ANY form field appears
    await this.page.locator('textarea, input').first().waitFor({
      state: 'visible',
      timeout: 20000,
    });

    if (asA) {
      await this.page
        .getByLabel(/as a/i)
        .fill(asA);
    }

    if (iWant) {
      await this.page
        .getByLabel(/i want/i)
        .fill(iWant);
    }

    if (soThat) {
      await this.page
        .getByLabel(/so that/i)
        .fill(soThat);
    }
  }

  async submit() {
    await this.submitBtn.click();
  }

  async cancel() {
    await this.cancelBtn.click();
  }

  async expectRequiredValidationAtLeastOne() {
    await this.requiredMsg.first().waitFor({
      state: 'visible',
      timeout: 15000,
    });
  }
}

module.exports = UserStoryCreatePage;
