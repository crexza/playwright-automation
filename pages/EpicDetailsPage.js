// pages/EpicDetailsPage.js
const { expect } = require('@playwright/test');

class EpicDetailsPage {
  constructor(page) {
    this.page = page;

    this.title = page.locator('main').getByText(/AP\d+-EP-\d+|EP-\d+|Manual Epic|Epic/i).first();
    this.detailsSection = page.locator('main').getByText(/details|status|priority/i).first();

    this.heading = page.getByRole('heading', { name: /epic details|epic detail/i }).or(
      page.getByRole('heading', { name: /AP\d+-EP-\d+|epic/i })
    );

    this.userStoriesTab = page.getByRole('tab', { name: /user stories/i }).or(
      page.getByRole('button', { name: /user stories/i })
    );

    this.userStoriesCount = page.getByText(/^User Stories$/i).locator('..'); // label container often holds count nearby

    this.createUserStoryBtn = page
      .getByRole('button', { name: /create user story|new user story/i })
      .or(page.getByRole('link', { name: /create user story|new user story/i }));

    this.generateAIUserStoriesBtn = page
      .getByRole('button', { name: /generate ai user stor(y|ies)/i })
      .or(page.getByRole('link', { name: /generate ai user stor(y|ies)/i }));

    this.backToEpicLink = page.getByRole('link', { name: /back to epic/i }).or(page.getByText(/back to epic/i));
  }

  async waitForLoaded() {
    await expect(this.page).toHaveURL(/\/epics\/\d+/, { timeout: 20000 });

    // Some pages don't have "Epic Details" heading, so check for anything stable:
    await Promise.race([
      this.heading.first().waitFor({ state: 'visible', timeout: 20000 }).catch(() => {}),
      this.page.locator('main').getByText(/summary|details|status|priority/i).first().waitFor({ state: 'visible', timeout: 20000 }),
    ]);
  }

  async openUserStoriesTab() {
    // Some UI uses tabs, some uses section. Click if visible.
    if (await this.userStoriesTab.first().isVisible().catch(() => false)) {
      await this.userStoriesTab.first().click();
    }
    // Wait for list/table area to exist
    await this.page.locator('main').waitFor({ state: 'visible', timeout: 20000 });
  }

  async readUserStoryCount() {
    // From your snapshot there is "User Stories 5" style.
    // Grab "User Stories" block and extract number from nearby text.
    const mainText = await this.page.locator('main').innerText().catch(() => '');
    const m = mainText.match(/User Stories\s+(\d+)/i);
    return m ? Number(m[1]) : 0;
  }

  async openCreateUserStory() {
    await this.openUserStoriesTab();
    await this.createUserStoryBtn.first().waitFor({ state: 'visible', timeout: 20000 });
    await this.createUserStoryBtn.first().click();
    await this.page.waitForURL(/user-stories\/create/i, { timeout: 20000 });
  }

  async openGenerateAIUserStories() {
    // Must be on epic details
    await this.waitForLoaded();

    // Ensure epic is empty. If not empty, AI may refuse navigation.
    const count = await this.readUserStoryCount();
    if (count > 0) {
      throw new Error(
        `This epic already has ${count} user stories. AI preview will not open on reused/polluted epics. Create a fresh epic with 0 user stories for TS-02+.`
      );
    }

    await this.generateAIUserStoriesBtn.first().waitFor({ state: 'visible', timeout: 20000 });

    // Click and wait for either:
    // - URL becomes preview
    // - OR preview banner/heading appears
    // - OR we remain on epic page (fail with snapshot)
    await Promise.all([
      this.generateAIUserStoriesBtn.first().click(),
      // do not wait "load" only; this app sometimes does soft navigation
      this.page.waitForTimeout(500),
    ]);

    const navigated = await this.page
      .waitForURL(/\/user-stories\/ai\/preview/i, { timeout: 20000 })
      .then(() => true)
      .catch(() => false);

    if (navigated) return;

    // Fallback: sometimes URL changes slowly; check for preview banner content
    const previewHeading = this.page.getByRole('heading', { name: /ai generated user stories/i });
    const reviewHeading = this.page.getByRole('heading', { name: /review and select user stories/i });

    const hasPreviewUI = await previewHeading.first().isVisible().catch(() => false) ||
      await reviewHeading.first().isVisible().catch(() => false);

    if (hasPreviewUI) return;

    // If still on epic page, throw with diagnostics
    const url = this.page.url();
    const text = await this.page.locator('body').innerText().catch(() => '');
    throw new Error(
      `Generate AI did not navigate to preview page.\nURL=${url}\n` +
      `Body includes: ${text.slice(0, 500)}...`
    );
  }

  async backToEpic() {
    if (await this.backToEpicLink.first().isVisible().catch(() => false)) {
      await this.backToEpicLink.first().click();
    } else {
      // If already on epic page, do nothing
      const isEpic = /\/epics\/\d+/.test(this.page.url());
      if (!isEpic) {
        await this.page.goBack({ waitUntil: 'domcontentloaded' }).catch(() => {});
      }
    }
    await this.waitForLoaded();
  }

  async expectUserStoryInList(title) {
    await expect(this.page.locator('main').getByText(title, { exact: false })).toBeVisible({ timeout: 20000 });
  }

  _rowByTitle(title) {
    const main = this.page.locator('main');
    return main.getByText(title, { exact: false }).first().locator('..');
  }

  async readFirstUserStoryTitle() {
    await this.openUserStoriesTab();
    // Heuristic: user story cards often have headings
    const h = this.page.locator('main h3, main h4').first();
    if (await h.isVisible().catch(() => false)) {
      const t = (await h.innerText().catch(() => '')).trim();
      return t || null;
    }
    return null;
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

    const confirm = this.page
      .getByRole('button', { name: /confirm|yes|delete/i })
      .or(this.page.getByText(/^confirm$/i));

    if (await confirm.first().isVisible().catch(() => false)) {
      await confirm.first().click();
    }
  }
}

module.exports = EpicDetailsPage;
