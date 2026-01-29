// pages/ProjectsPage.js
const { expect } = require('@playwright/test');

class ProjectsPage {
  constructor(page) {
    this.page = page;

    /* =======================
       NAVIGATION
    ======================== */
    this.projectsNav = page.getByRole('link', { name: /^projects$/i });

    /* =======================
       PROJECT LIST PAGE
    ======================== */
    this.createNewProjectAction = page
      .getByRole('button', {
        name: /create new project|new project|create project/i,
      })
      .or(
        page.getByRole('link', {
          name: /create new project|new project|create project/i,
        })
      );

    // Main content area (used for list assertions)
    this.mainContent = page.locator('main');

    /* =======================
       🔹 EPIC (FROM PROJECT LIST)
    ======================== */
    this.viewEpicAction = this.mainContent
      .getByRole('link', { name: /view epic/i })
      .or(this.mainContent.getByRole('button', { name: /view epic/i }));

    /* =======================
       CREATE PROJECT PAGE
    ======================== */
    this.createProjectHeading = page.getByRole('heading', {
      name: /create new project|create project/i,
    });

    this.projectNameInput = page.getByRole('textbox', {
      name: /project name/i,
    });

    this.descriptionInput = page.getByRole('textbox', {
      name: /^description$/i,
    });

    this.statusSelect = page.getByRole('combobox', {
      name: /status/i,
    });

    this.createProjectButton = page.getByRole('button', {
      name: /^create project$/i,
    });

    this.cancelLink = page.getByRole('link', { name: /^cancel$/i });

    /* =======================
       VALIDATION
    ======================== */
    this.nameRequiredError = page.getByText(
      /project name|name.*required|required|field is required|can't be blank/i
    );
  }

  /* =======================
     NAVIGATION HELPERS
  ======================== */
 // pages/ProjectsPage.js
async gotoProjects() {
  await this.page.goto('/projects', { waitUntil: 'domcontentloaded' });
  await this.page.waitForURL(/\/projects/i);
}


  async openCreateProject() {
    await this.gotoProjects();

    await this.createNewProjectAction.first().waitFor({ state: 'visible' });
    await this.createNewProjectAction.first().click();

    await this.createProjectHeading.waitFor({ state: 'visible' });
  }

  /* =======================
     🔹 PROJECT → EPIC
  ======================== */
  async openProjectEpic() {
    await this.gotoProjects();

    await this.viewEpicAction.first().waitFor({ state: 'visible' });
    await this.viewEpicAction.first().click();

    // Epic page URL + heading signal
    await this.page.waitForURL(/epic/i);
  }

  /* =======================
     CREATE PROJECT ACTIONS
  ======================== */
  async fillCreateProjectForm({ name, description, status, teams } = {}) {
    if (name !== undefined) {
      await this.projectNameInput.fill(String(name));
    }

    if (description !== undefined) {
      await this.descriptionInput.fill(String(description));
    }

    if (status !== undefined) {
      await this.statusSelect.selectOption({ label: status });
    }

    // Teams optional → intentionally skipped
  }

  async submitCreateProject() {
    await this.createProjectButton.click();

    // success OR validation failure
    await Promise.race([
      this.page.waitForURL(/\/projects/i, { timeout: 15000 }),
      this.createProjectHeading.waitFor({ state: 'visible', timeout: 15000 }),
    ]);
  }

  async cancelCreateProject() {
    await this.cancelLink.click();
    await this.page.waitForURL(/\/projects/i);
  }

  /* =======================
     ASSERTIONS
  ======================== */
  async expectProjectInList(projectName) {
    if (!/\/projects/i.test(this.page.url())) {
      await this.gotoProjects();
    }

    await expect(
      this.mainContent.getByText(projectName, { exact: false })
    ).toBeVisible({ timeout: 15000 });
  }

  async expectProjectNotInList(projectName) {
    if (!/\/projects/i.test(this.page.url())) {
      await this.gotoProjects();
    }

    await expect(
      this.mainContent.getByText(projectName, { exact: false })
    ).toHaveCount(0);
  }

  async expectNameRequiredError() {
    const ariaInvalid = this.projectNameInput.locator(
      '[aria-invalid="true"]'
    );

    await expect(
      this.nameRequiredError.or(ariaInvalid)
    ).toBeVisible({ timeout: 10000 });
  }
}

module.exports = ProjectsPage;
