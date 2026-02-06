// pages/UserStoryCreatePage.js
const { expect } = require('@playwright/test');

class UserStoryCreatePage {
  constructor(page) {
    this.page = page;

    // Page ready signal
    this.heading = page.getByRole('heading', { name: /create user stor(y|ies)|user stor(y|ies) create/i });

    // Robust field locators (label OR placeholder OR name/id)
    this.title = page.getByLabel(/title/i)
      .or(page.getByPlaceholder(/title/i))
      .or(page.locator('input[name*="title" i], textarea[name*="title" i], #title'));

    this.asA = page.getByLabel(/^as a$/i)
      .or(page.getByPlaceholder(/as a/i))
      .or(page.locator('textarea[name*="as" i], input[name*="as" i]'));

    this.iWant = page.getByLabel(/i want/i)
      .or(page.getByPlaceholder(/i want/i))
      .or(page.locator('textarea[name*="want" i], input[name*="want" i]'));

    this.soThat = page.getByLabel(/so that/i)
      .or(page.getByPlaceholder(/so that/i))
      .or(page.locator('textarea[name*="so" i], input[name*="so" i]'));

    this.submitBtn = page.getByRole('button', { name: /create user stor(y|ies)|save|create/i });
    this.cancelBtn = page.getByRole('button', { name: /^cancel$/i }).or(page.getByRole('link', { name: /^cancel$/i }));

    // Validation (generic)
    this.requiredMsg = page.getByText(/required|can't be blank|please fill/i);
  }

  async waitForLoaded() {
    await this.page.waitForURL(/user-stories\/create/i, { timeout: 20000 });

    // Either heading appears OR title field appears (some pages don’t have heading)
    await Promise.race([
      this.heading.first().waitFor({ state: 'visible', timeout: 20000 }).catch(() => {}),
      this.title.first().waitFor({ state: 'visible', timeout: 20000 }).catch(() => {}),
    ]);

    // Hard requirement: title must exist for creation flow
    await expect(this.title.first()).toBeVisible({ timeout: 20000 });
  }

  async fillManualForm({ title, asA, iWant, soThat } = {}) {
    if (title) await this.title.first().fill(title);
    if (asA) await this.asA.first().fill(asA);
    if (iWant) await this.iWant.first().fill(iWant);
    if (soThat) await this.soThat.first().fill(soThat);
  }

  async submit() {
    await this.submitBtn.click();
  }

  async cancel() {
    await this.cancelBtn.click();
  }

  async expectRequiredValidation() {
    await expect(this.requiredMsg).toBeVisible({ timeout: 15000 });
  }
}

module.exports = UserStoryCreatePage;
