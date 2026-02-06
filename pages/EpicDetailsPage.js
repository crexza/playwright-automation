// pages/EpicDetailsPage.js
const { expect } = require('@playwright/test');

class EpicDetailsPage {
  constructor(page) {
    this.page = page;

    this.heading = page.getByRole('heading', { name: /epic details|epic detail/i });

    this.createUserStoryBtn = page
      .getByRole('button', { name: /create user story/i })
      .or(page.getByRole('link', { name: /create user story/i }));

    this.generateAIUserStoriesBtn = page
      .getByRole('button', { name: /generate ai user stor(y|ies)/i })
      .or(page.getByRole('link', { name: /generate ai user stor(y|ies)/i }));

    this.tokenBalance = page.getByText(/tokens?\s*:\s*\d+/i);
  }

  async waitForLoaded() {
    await Promise.race([
      this.heading.waitFor({ state: 'visible', timeout: 20000 }).catch(() => {}),
      this.page.waitForURL(/\/epics\/\d+/, { timeout: 20000 }),
    ]);
  }

  async openCreateUserStory() {
    await this.createUserStoryBtn.first().waitFor({ state: 'visible', timeout: 20000 });
    await this.createUserStoryBtn.first().click();

    // IMPORTANT: your real URL is /user-stories/create?epic_id=...
    await this.page.waitForURL(/user-stories\/create/i, { timeout: 20000 });
  }

  async openGenerateAIUserStories() {
    await this.generateAIUserStoriesBtn.first().waitFor({ state: 'visible', timeout: 20000 });
    await this.generateAIUserStoriesBtn.first().click();
  }

  async expectUserStoryInList(title) {
    await expect(this.page.locator('main').getByText(title, { exact: false })).toBeVisible({
      timeout: 20000,
    });
  }

  async readTokenBalanceNumber() {
    if (!(await this.tokenBalance.first().isVisible().catch(() => false))) return null;
    const txt = await this.tokenBalance.first().innerText();
    const m = txt.match(/(\d+)/);
    return m ? Number(m[1]) : null;
  }

  _rowByTitle(title) {
    // Find a container row/card containing the title
    const main = this.page.locator('main');
    return main.getByText(title, { exact: false }).first().locator('..');
  }

  async openUserStoryViewByTitle(title) {
    const row = this._rowByTitle(title);

    const viewBtn = row
      .getByRole('button', { name: /view|details/i })
      .or(row.getByRole('link', { name: /view|details/i }))
      .or(row.locator('[aria-label*="view" i], [title*="view" i]'))
      .or(row.locator('a:has(svg), button:has(svg)'));

    await viewBtn.first().click();
    await this.page.waitForURL(/user-stories|story/i, { timeout: 20000 });
  }

  async openUserStoryEditByTitle(title) {
    const row = this._rowByTitle(title);

    const editBtn = row
      .getByRole('button', { name: /edit/i })
      .or(row.getByRole('link', { name: /edit/i }))
      .or(row.locator('[aria-label*="edit" i], [title*="edit" i]'))
      .or(row.locator('a:has(svg), button:has(svg)'));

    await editBtn.first().click();
    await this.page.waitForURL(/edit|user-stories/i, { timeout: 20000 });
  }

  async deleteUserStoryByTitle(title) {
    const row = this._rowByTitle(title);

    const deleteBtn = row
      .getByRole('button', { name: /delete/i })
      .or(row.locator('[aria-label*="delete" i], [title*="delete" i]'));

    await deleteBtn.first().click();

    // Confirm modal (common patterns)
    const confirm = this.page
      .getByRole('button', { name: /confirm|yes|delete/i })
      .or(this.page.getByText(/^confirm$/i));

    if (await confirm.first().isVisible().catch(() => false)) {
      await confirm.first().click();
    }
  }
}

module.exports = EpicDetailsPage;
