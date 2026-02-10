// pages/AiUserStoriesPanel.js
const { expect } = require('@playwright/test');

class AiUserStoriesPanel {
  constructor(page) {
    this.page = page;

    // Scope everything to main to avoid navbar strict-mode collisions
    this.main = page.locator('main');

    // Preview page headings (your snapshot shows these)
    this.previewH2 = page.getByRole('heading', { name: /ai generated user stories/i }); // h2
    this.reviewH3 = page.getByRole('heading', { name: /review and select user stories/i }); // h3

    // Results (checkbox list cards)
    this.checkboxes = this.main.locator('input[type="checkbox"]');
    this.storyCards = this.main.locator(':scope >> div').filter({
      has: this.main.getByRole('heading', { level: 3 }),
    });

    // More stable story item locator: each card has a level-3 heading
    this.resultItems = this.main.getByRole('heading', { level: 3 }).filter({
      hasText: /.{3,}/,
    });

    // Token summary area in main (from snapshot: "Available Tokens:" etc.)
    this.tokenSummary = this.main.getByText(/available tokens:\s*\d+/i);
    this.costLine = this.main.getByText(/each user story costs\s*5\s*tokens/i);

    // Buttons on preview page
    this.selectAllBtn = this.main.getByRole('button', { name: /select all available/i });
    this.deselectAllBtn = this.main.getByRole('button', { name: /deselect all/i });
    this.saveBtn = this.main.getByRole('button', { name: /save/i });
    this.cancelLink = page.getByRole('link', { name: /cancel|back to epic/i }).first();

    // Possible empty state
    this.emptyState = this.main.getByText(/no (user )?stories|nothing to show|empty/i);

    // Loading indicator (best-effort)
    this.loading = this.main.getByText(/generating|loading|please wait/i).or(
      this.main.locator('[aria-busy="true"], [data-loading="true"], .spinner, .loading')
    );
  }

  async waitForShown() {
    // Wait for either preview headings OR token summary OR list content.
    // Use expect().toBeVisible with .first() to avoid strict mode.
    await expect(
      this.previewH2.first().or(this.reviewH3.first()).or(this.tokenSummary.first())
    ).toBeVisible({ timeout: 30000 });

    // If there is a loader, give it a chance to disappear (don’t fail if it doesn’t exist).
    if (await this.loading.first().isVisible().catch(() => false)) {
      await this.loading.first().waitFor({ state: 'hidden', timeout: 30000 }).catch(() => {});
    }

    // Now wait until ANY meaningful content appears.
    // IMPORTANT: don't use Promise.race with rejecting promises.
    await this._waitUntilAnyVisible(
      [
        this.checkboxes.first(),
        this.resultItems.first(),
        this.emptyState.first(),
        this.costLine.first(),
      ],
      30000
    );
  }

  async _waitUntilAnyVisible(locators, timeoutMs) {
    const start = Date.now();
    while (Date.now() - start < timeoutMs) {
      for (const loc of locators) {
        const ok = await loc.isVisible().catch(() => false);
        if (ok) return;
      }
      await this.page.waitForTimeout(250);
    }
    throw new Error(`AI panel did not show results/empty state within ${timeoutMs}ms`);
  }

  async hasSelectableItems() {
    // checkboxes exist and at least one is visible
    const count = await this.checkboxes.count();
    if (!count) return false;
    return await this.checkboxes.first().isVisible().catch(() => false);
  }

  async selectFirstN(n = 1) {
    await this.waitForShown();
    const total = await this.checkboxes.count();
    const take = Math.min(n, total);
    for (let i = 0; i < take; i++) {
      const cb = this.checkboxes.nth(i);
      await cb.scrollIntoViewIfNeeded();
      // click checkbox reliably
      await cb.check({ force: true }).catch(async () => {
        await cb.click({ force: true });
      });
    }
  }

  async deselectAll() {
    await this.waitForShown();
    if (await this.deselectAllBtn.isVisible().catch(() => false)) {
      await this.deselectAllBtn.click();
    } else {
      // fallback: uncheck all visible checkboxes
      const total = await this.checkboxes.count();
      for (let i = 0; i < total; i++) {
        const cb = this.checkboxes.nth(i);
        if (await cb.isChecked().catch(() => false)) {
          await cb.uncheck({ force: true }).catch(async () => cb.click({ force: true }));
        }
      }
    }
  }

  async readTokenNumbers() {
    // From snapshot: "Available Tokens: 300 | Selected: 2 (10 tokens) | Remaining: 290"
    await this.waitForShown();
    const txt = await this.main.getByText(/available tokens:/i).first().innerText();

    const available = this._numAfter(txt, /available tokens:\s*(\d+)/i);
    const selectedStories = this._numAfter(txt, /selected:\s*(\d+)/i);
    const selectedTokens = this._numAfter(txt, /\((\d+)\s*tokens?\)/i);
    const remaining = this._numAfter(txt, /remaining:\s*(\d+)/i);

    return { available, selectedStories, selectedTokens, remaining };
  }

  _numAfter(text, re) {
    const m = text.match(re);
    return m ? Number(m[1]) : null;
  }

  async clickSaveIfPresent() {
    await this.waitForShown();
    if (await this.saveBtn.isVisible().catch(() => false)) {
      await this.saveBtn.click();
    }
  }

  async backToEpic() {
    if (await this.cancelLink.isVisible().catch(() => false)) {
      await this.cancelLink.click();
    }
  }
}

module.exports = AiUserStoriesPanel;
