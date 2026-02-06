// pages/AiUserStoriesPanel.js  (keep file name if your test imports it)
const { expect } = require('@playwright/test');

class AiUserStoriesPanel {
  constructor(page) {
    this.page = page;

    // Your screenshot shows this heading
    this.heading = page.getByRole('heading', { name: /ai-powered generation/i });

    // The required textarea in your screenshot
    this.requirements = page
      .getByLabel(/describe your requirements/i)
      .or(page.getByRole('textbox', { name: /describe your requirements/i }))
      .or(page.locator('textarea').first());

    // Toggle "Enabled" (shown top right)
    this.enabledToggle = page.getByRole('switch', { name: /enabled/i });

    // Generate button varies by page, keep broad
    this.generateBtn = page
      .getByRole('button', { name: /generate/i })
      .or(page.getByRole('button', { name: /create|run|submit/i }));

    // Results: may appear as table/cards/list (keep broad)
    this.resultItems = page.locator('main').locator('tr, li, [data-testid*="generated" i], .card, .rounded');

    // If there ARE checkboxes later (some pages do)
    this.checkboxes = page.getByRole('checkbox').or(page.locator('input[type="checkbox"]'));

    // Save/confirm after selecting (optional)
    this.confirmBtn = page
      .getByRole('button', { name: /save selected|confirm|save|add selected|create/i })
      .or(page.getByRole('button', { name: /^save$/i }));
  }

  async waitForShown() {
    await expect(this.heading).toBeVisible({ timeout: 20000 });
  }

  async ensureEnabled() {
    if (await this.enabledToggle.isVisible().catch(() => false)) {
      const checked = await this.enabledToggle.isChecked().catch(() => true);
      if (!checked) await this.enabledToggle.click();
    }
  }

  async generateFromRequirements(text) {
    await this.waitForShown();
    await this.ensureEnabled();

    await expect(this.requirements).toBeVisible({ timeout: 20000 });
    await this.requirements.fill(text);

    await this.generateBtn.click();

    // Wait for *something* that indicates generation happened
    await Promise.race([
      this.checkboxes.first().waitFor({ state: 'visible', timeout: 30000 }).catch(() => {}),
      this.resultItems.first().waitFor({ state: 'visible', timeout: 30000 }).catch(() => {}),
      this.page.waitForTimeout(2000),
    ]);
  }

  async hasSelectableItems() {
    return (await this.checkboxes.count()) > 0;
  }

  async selectFirstN(n = 1) {
    const total = await this.checkboxes.count();
    const count = Math.min(n, total);
    for (let i = 0; i < count; i++) {
      await this.checkboxes.nth(i).check({ force: true });
    }
    return count;
  }

  async confirm() {
    if (await this.confirmBtn.first().isVisible().catch(() => false)) {
      await this.confirmBtn.first().click();
    }
  }
}

module.exports = AiUserStoriesPanel;
