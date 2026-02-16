// pages/AiUserStoriesPanel.js
const { expect } = require('@playwright/test');

class AiUserStoriesPanel {
  constructor(page) {
    this.page = page;
    this.main = page.locator('main');

    // Token summary line in your snapshot:
    // "Available Tokens: 300 | Selected: 2 (10 tokens) | Remaining: 290"
    this.tokenSummary = this.main.getByText(/available tokens|remaining|selected:/i).first();

    // DO NOT use broad /token|credit/i (it matches nav "Slickfox Tokens")
    this.checkboxes = this.main.locator('input[type="checkbox"]');

    // Buttons
    this.selectAll = this.main.getByRole('button', { name: /select all/i });
    this.deselectAll = this.main.getByRole('button', { name: /deselect all/i });

    // Save button (your snapshot had "Saving..." too)
    this.saveBtn = this.main.getByRole('button', { name: /^save/i }).or(this.main.getByRole('button', { name: /saving/i }));
  }

  async waitForShown() {
    // Make sure we are on AI preview page
    await expect(this.page).toHaveURL(/\/user-stories\/ai\/preview/i, { timeout: 20000 });

    // Wait until ANY meaningful state appears:
    // - token summary (preferred)
    // - checkboxes visible (stories loaded)
    // - empty-state message visible
    await Promise.race([
      this.tokenSummary.waitFor({ state: 'visible', timeout: 20000 }),
      this.checkboxes.first().waitFor({ state: 'visible', timeout: 20000 }),
      this.main.getByText(/no user stories|nothing to show|no results/i).first().waitFor({ state: 'visible', timeout: 20000 }),
    ]);
  }

  _readNumber(pattern) {
    return this.tokenSummary
      .innerText()
      .then((t) => {
        const m = t.match(pattern);
        return m ? Number(m[1]) : null;
      })
      .catch(() => null);
  }

  async readAvailableTokens() {
    // "Available Tokens: 300"
    return await this._readNumber(/Available Tokens:\s*(\d+)/i);
  }

  async readRemainingTokens() {
    // "Remaining: 290"
    return await this._readNumber(/Remaining:\s*(\d+)/i);
  }

  async readSelectedCount() {
    // "Selected: 2 (10 tokens)"
    const txt = await this.tokenSummary.innerText().catch(() => '');
    const m = txt.match(/Selected:\s*(\d+)/i);
    return m ? Number(m[1]) : 0;
  }

  async ensureAtLeastOneSelected() {
    // If none selected, click first checkbox
    const checked = await this.main.locator('input[type="checkbox"]:checked').count().catch(() => 0);
    if (checked > 0) return;

    await this.checkboxes.first().waitFor({ state: 'visible', timeout: 20000 });
    await this.checkboxes.first().check({ force: true }).catch(async () => {
      await this.checkboxes.first().click({ force: true });
    });

    // Wait for selected count to update
    await expect.poll(async () => this.readSelectedCount()).toBeGreaterThan(0);
  }

  async saveSelected() {
    await this.saveBtn.first().waitFor({ state: 'visible', timeout: 20000 });
    await this.saveBtn.first().click();

    // Often becomes disabled "Saving..." then navigates back to epic
    await this.page.waitForURL(/\/epics\/\d+/, { timeout: 30000 });
  }
}

module.exports = AiUserStoriesPanel;
