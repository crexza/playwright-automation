// tests/us-epic.spec.js
const { test } = require('@playwright/test');
const ProjectsPage = require('../pages/ProjectsPage');
const EpicPage = require('../pages/EpicPage');

test.describe('Epic Management (US-EPIC-01 → US-EPIC-05)', () => {
  let projects;
  let epic;

  test.beforeEach(async ({ page }) => {
    projects = new ProjectsPage(page);
    epic = new EpicPage(page);

    await projects.gotoProjects();
    await projects.openProjectEpic(); // already working in your setup
  });

  test('US-EPIC-01 - Navigate to Epic page from project list', async () => {
    await epic.expectOnEpicList();
  });

  test('US-EPIC-02 - Open Create New Epic', async () => {
    await epic.openCreateEpic();
  });

  test('US-EPIC-03 - Create Epic Manually', async () => {
    await epic.openCreateEpic();

    await epic.createEpicManually({
      title: `Manual Epic ${Date.now()}`,
      description: 'This is a manual epic description (>= 10 chars).',
      priority: 'High',
    });
  });

  test('US-EPIC-04 - Create Epic using AI', async () => {
    await epic.openCreateEpic();
    await epic.createEpicUsingAI();
  });

  test('US-EPIC-05 - Cancel Epic Creation', async () => {
    await epic.openCreateEpic();
    await epic.cancelEpicCreation();
  });
});
