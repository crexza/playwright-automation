// tests/us-proj-01-02-projects.spec.js
const { test, expect } = require('@playwright/test');

const SlickfoxLoginPage = require('../pages/SlickfoxLoginPage');
const DashboardPage = require('../pages/DashboardPage');
const ProjectsPage = require('../pages/ProjectsPage');

const SLICKFOX_EMAIL = process.env.SLICKFOX_EMAIL;
const SLICKFOX_PASSWORD = process.env.SLICKFOX_PASSWORD;

test.describe('Projects (US-PROJ-01/02)', () => {
  test.beforeEach(async ({ page }) => {
    if (!SLICKFOX_EMAIL || !SLICKFOX_PASSWORD) {
      throw new Error('Missing SLICKFOX_EMAIL or SLICKFOX_PASSWORD in .env');
    }

    const login = new SlickfoxLoginPage(page);
    await login.openLoginPage();
    await login.login(SLICKFOX_EMAIL, SLICKFOX_PASSWORD);

    // keep this flexible: some apps land on /dashboard, some /projects
    await expect(page).toHaveURL(/dashboard|projects/i);
  });

  test('US-PROJ-01 - Create new project (happy path)', async ({ page }) => {
    const dash = new DashboardPage(page);
    const projects = new ProjectsPage(page);

    // Go to Projects (via nav)
    await projects.gotoProjects();

    // Open Create Project form
    await projects.openCreateProject();

    const projectName = `Auto Project ${Date.now()}`;
    await projects.fillCreateProjectForm({
      name: projectName,
      description: 'Created by Playwright',
      status: 'Active',
      teams: [], // optional (leave empty → tenant owner only)
    });

    await projects.submitCreateProject();

    // Expected: return to list + show newly created project
    await expect(page).toHaveURL(/\/projects/i);
    await projects.expectProjectInList(projectName);
  });

  test('US-PROJ-01 (Negative) - Project Name is required', async ({ page }) => {
    const projects = new ProjectsPage(page);

    await projects.gotoProjects();
    await projects.openCreateProject();

    // leave name empty
    await projects.fillCreateProjectForm({
      name: '',
      description: 'Should fail',
      status: 'Active',
    });

    await projects.submitCreateProject();

    // Expected: validation error and still on create form (or not redirected)
    await projects.expectNameRequiredError();
    await expect(page).not.toHaveURL(/\/projects$/i); // not back to list
  });

  test('US-PROJ-02 - Cancel create new project does not save', async ({ page }) => {
    const projects = new ProjectsPage(page);

    await projects.gotoProjects();
    await projects.openCreateProject();

    const projectName = `Should Not Exist ${Date.now()}`;
    await projects.fillCreateProjectForm({
      name: projectName,
      description: 'Cancel flow',
      status: 'Active',
    });

    await projects.cancelCreateProject();

    // Expected: back to list and project NOT created
    await expect(page).toHaveURL(/\/projects/i);
    await projects.expectProjectNotInList(projectName);
  });
});
