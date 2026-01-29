// pages/EpicPage.js
const { expect } = require('@playwright/test');

class EpicPage {
  constructor(page) {
    this.page = page;

    /* =======================
       EPIC LIST PAGE
    ======================= */

    // Unique heading (not "No epics found")
    this.epicListHeading = page.getByRole('heading', { name: /^epics$/i });

    this.createEpicAction = page
      .getByRole('link', { name: /create new epic/i })
      .or(page.getByRole('button', { name: /create new epic/i }));

    /* =======================
       CREATE EPIC PAGE
    ======================= */

    this.createEpicHeading = page.getByRole('heading', {
      name: /create new epic|create epic/i,
    });

    this.createEpicButton = page.getByRole('button', {
      name: /^create epic$/i,
    });

    this.cancelAction = page
      .getByRole('link', { name: /^cancel$/i })
      .or(page.getByRole('button', { name: /^cancel$/i }));

    this.aiToggle = page
      .getByRole('checkbox', { name: /ai/i })
      .or(page.getByRole('switch', { name: /ai/i }));

    this.epicTitleInput = page.getByRole('textbox', { name: /epic title/i });
    this.descriptionInput = page.getByRole('textbox', { name: /description/i });
    this.prioritySelect = page.getByRole('combobox', { name: /priority/i });

    /* =======================
       EPIC DETAILS PAGE
    ======================= */

    this.editEpicLink = page.getByRole('link', { name: /edit epic/i });

    /* =======================
       PROJECT DETAILS PAGE
    ======================= */

    this.projectDetailsHeading = page.getByRole('heading', {
      name: /project details/i,
    });
  }

  /* =======================
     ASSERTIONS
  ======================= */

  async expectOnEpicList() {
    await expect(this.epicListHeading).toBeVisible({ timeout: 15000 });
  }

  async expectOnCreateEpicPage() {
    await expect(this.createEpicButton).toBeVisible({ timeout: 15000 });
  }

  async expectOnEpicDetailsPage() {
    await expect(this.editEpicLink).toBeVisible({ timeout: 15000 });
  }

  async expectOnProjectDetailsPage() {
    await expect(this.projectDetailsHeading).toBeVisible({ timeout: 15000 });
  }

  /* =======================
     ACTIONS
  ======================= */

  async openCreateEpic() {
    await this.expectOnEpicList();
    await this.createEpicAction.click();
    await this.expectOnCreateEpicPage();
  }

  async createEpicManually({ title, description, priority }) {
    if (await this.aiToggle.count()) {
      if (await this.aiToggle.isChecked()) {
        await this.aiToggle.click();
      }
    }

    await this.epicTitleInput.fill(title);
    await this.descriptionInput.fill(description);

    if (priority) {
      await this.prioritySelect.selectOption({ label: priority });
    }

    await this.createEpicButton.click();
    await this.expectOnEpicDetailsPage();
  }

  async createEpicUsingAI() {
    if (await this.aiToggle.count()) {
      if (!(await this.aiToggle.isChecked())) {
        await this.aiToggle.click();
      }
    }

    await this.createEpicButton.click();

    // AI stays on Create Epic page
    await this.expectOnCreateEpicPage();
  }

  async cancelEpicCreation() {
    await this.cancelAction.click();
    await this.expectOnProjectDetailsPage();
  }
}

module.exports = EpicPage;
