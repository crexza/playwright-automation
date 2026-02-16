// pages/ProjectsPage.js
const { expect } = require('@playwright/test');

class ProjectsPage {
  constructor(page) {
    this.page = page;

    this.main = page.locator('main');
    this.projectsHeading = page.getByRole('heading', { name: /projects/i });

    // Cards/rows
    this.projectCards = this.main.locator('a,button').filter({ hasText: /project/i }).or(this.main.locator('tr'));
  }

  async gotoProjects() {
    const base = process.env.BASE_URL || 'https://demo.slickfox.com';

    // Always use absolute URL to avoid baseURL config dependency
    await this.page.goto(`${base}/projects`, { waitUntil: 'domcontentloaded' });
    await expect(this.page).toHaveURL(/\/projects/i, { timeout: 20000 });

    // “Projects” heading may or may not exist; don’t hard-fail on it
    await this.projectsHeading.first().waitFor({ state: 'visible', timeout: 15000 }).catch(() => {});
  }

  async openProjectEpic({ projectName, epicName, epicId } = {}) {
    await this.gotoProjects();

    // If you already know epicId, go straight there (fast + stable)
    if (epicId) {
      const base = process.env.BASE_URL || 'https://demo.slickfox.com';
      await this.page.goto(`${base}/epics/${epicId}`, { waitUntil: 'domcontentloaded' });
      await expect(this.page).toHaveURL(new RegExp(`/epics/${epicId}`), { timeout: 20000 });
      return;
    }

    // Otherwise click project by name (best effort)
    if (projectName) {
      const projectLink = this.main.getByRole('link', { name: new RegExp(projectName, 'i') })
        .or(this.main.getByRole('button', { name: new RegExp(projectName, 'i') }));
      await projectLink.first().click();
      await this.page.waitForLoadState('domcontentloaded');
    }

    // Then open epic by name
    if (epicName) {
      const epicLink = this.main.getByRole('link', { name: new RegExp(epicName, 'i') })
        .or(this.main.getByRole('button', { name: new RegExp(epicName, 'i') }))
        .or(this.main.getByText(new RegExp(epicName, 'i')).first());
      await epicLink.first().click();
      await this.page.waitForLoadState('domcontentloaded');
      return;
    }

    // Fallback: click first visible epic-like link
    const firstEpic = this.main.getByRole('link', { name: /epic|ep-/i })
      .or(this.main.getByRole('button', { name: /epic|ep-/i }))
      .first();
    await firstEpic.click();
    await this.page.waitForLoadState('domcontentloaded');
  }
}

module.exports = ProjectsPage;
