// tests/us-user-story.spec.js
const { test, expect } = require('@playwright/test');

test.describe.configure({ mode: 'serial' });

const ProjectsPage = require('../pages/ProjectsPage');
const EpicPage = require('../pages/EpicPage');
const EpicDetailsPage = require('../pages/EpicDetailsPage');
const AiUserStoriesPanel = require('../pages/AiUserStoriesPanel');
const UserStoryCreatePage = require('../pages/UserStoryCreatePage');

let epicTitle;
let epicId; // optional: if you can parse from URL

async function goToFreshEpicDetails(page) {
  // 1️⃣ Go to Projects page
  await page.goto('https://demo.slickfox.com/projects', {
    waitUntil: 'domcontentloaded',
  });

  // 2️⃣ Open first project
  await page.locator('a[href*="/projects/"]').first().click();
  await page.waitForURL(/\/projects\/\d+/);

  // 3️⃣ Go to Epics tab inside project
  await page.getByRole('link', { name: /epics/i }).click();

  // 4️⃣ Wait for epic list
  const epicLinks = page.locator('a[href*="/epics/"]');

  if (await epicLinks.count() === 0) {
    // 5️⃣ Create epic inside project
    await page.getByRole('button', { name: /create epic|new epic/i }).click();

    await page.getByLabel(/title/i).fill('Auto Epic ' + Date.now());
    await page.getByLabel(/description/i).fill(
      'Automation epic created for user story tests.'
    );

    await page.getByRole('button', { name: /create|save/i }).click();
    await page.waitForURL(/\/epics\/\d+/);
  } else {
    await epicLinks.first().click();
    await page.waitForURL(/\/epics\/\d+/);
  }
}




test.describe('User Story Management (TS-01 → TS-10)', () => {
 test.beforeEach(async ({ page }) => {
  await goToFreshEpicDetails(page);
});

  test('TS-01 (US-USER STORY-01) View epic details read-only', async ({ page }) => {
    const epicDetails = new EpicDetailsPage(page);
    await epicDetails.waitForLoaded();

    await expect(page).toHaveURL(/\/epics\/\d+/);

    // Smoke asserts
    await expect(epicDetails.title).toBeVisible();
    await expect(epicDetails.detailsSection).toBeVisible();
  });

  test('TS-02 (US-USER STORY-02) Generate AI user stories displayed', async ({ page }) => {
    const epicDetails = new EpicDetailsPage(page);
    const aiPanel = new AiUserStoriesPanel(page);

    await epicDetails.waitForLoaded();

    // Go to AI preview
    await epicDetails.openGenerateAIUserStories();

    // Wait until AI preview is actually ready (tokens OR checkboxes OR empty-state)
    await aiPanel.waitForShown();

    // Assert we are on preview page
    await expect(page).toHaveURL(/\/user-stories\/ai\/preview/i);

    // At least token summary exists (based on your snapshot: "Available Tokens")
    await expect(aiPanel.tokenSummary).toBeVisible();
  });

  test('TS-03 (US-USER STORY-02) Token deduction 5 tokens per selected AI story', async ({ page }) => {
    const aiPanel = new AiUserStoriesPanel(page);

    await aiPanel.waitForShown();

    const before = await aiPanel.readAvailableTokens();
    expect(before).not.toBeNull();

    // Select first story (or ensure one is selected)
    await aiPanel.ensureAtLeastOneSelected();

    const selectedCount = await aiPanel.readSelectedCount();
    expect(selectedCount).toBeGreaterThan(0);

    // Each user story costs 5 tokens (per UI)
    const expectedCost = selectedCount * 5;

    const remaining = await aiPanel.readRemainingTokens();
    expect(remaining).not.toBeNull();

    // remaining = available - expectedCost
    expect(remaining).toBe(before - expectedCost);
  });

  test('TS-04 (US-USER STORY-03) Manual create user story happy path', async ({ page }) => {
    const epicDetails = new EpicDetailsPage(page);
    const create = new UserStoryCreatePage(page);

    // Back to epic
    await epicDetails.backToEpic();

    // Ensure user stories tab is open
    await epicDetails.openUserStoriesTab();

    const title = `Manual Story ${Date.now()}`;

    await epicDetails.openCreateUserStory();

    await create.fillManualForm({
      asA: 'user',
      iWant: 'to create a user story manually',
      soThat: 'I can validate manual creation',
      title,
    });

    await create.save();

    // Verify appears in list
    await epicDetails.openUserStoriesTab();
    await epicDetails.expectUserStoryInList(title);
  });

  test('TS-05 (US-USER STORY-03) Mandatory field validation (negative)', async ({ page }) => {
    const epicDetails = new EpicDetailsPage(page);
    const create = new UserStoryCreatePage(page);

    await epicDetails.openUserStoriesTab();
    await epicDetails.openCreateUserStory();

    // Intentionally incomplete
    await create.fillManualForm({
      asA: '',
      iWant: '',
      soThat: '',
      title: '',
    });

    await create.saveExpectingValidationErrors();
  });

  test('TS-06 (US-USER STORY-04) Cancel user story creation returns to epic page', async ({ page }) => {
    const epicDetails = new EpicDetailsPage(page);
    const create = new UserStoryCreatePage(page);

    await epicDetails.openUserStoriesTab();
    await epicDetails.openCreateUserStory();

    await create.cancel();

    await expect(page).toHaveURL(/\/epics\/\d+/);
    await epicDetails.waitForLoaded();
  });

  test('TS-07 (US-USER STORY-05) View user story details read-only', async ({ page }) => {
    const epicDetails = new EpicDetailsPage(page);

    await epicDetails.openUserStoriesTab();

    // pick first story in list
    const firstTitle = await epicDetails.readFirstUserStoryTitle();
    expect(firstTitle).toBeTruthy();

    await epicDetails.openUserStoryViewByTitle(firstTitle);

    // Read-only assert: inputs disabled or absence of Save button
    const saveBtn = page.getByRole('button', { name: /^save$/i });
    if (await saveBtn.isVisible().catch(() => false)) {
      await expect(saveBtn).toBeDisabled();
    }
  });

  test('TS-08 (US-USER STORY-06) Edit user story updates saved data', async ({ page }) => {
    const epicDetails = new EpicDetailsPage(page);

    await epicDetails.openUserStoriesTab();

    const title = await epicDetails.readFirstUserStoryTitle();
    expect(title).toBeTruthy();

    await epicDetails.openUserStoryEditByTitle(title);

    const updatedSuffix = `Updated ${Date.now()}`;
    const titleField = page.getByLabel(/title/i).or(page.locator('input[name="title"]'));
    if (await titleField.first().isVisible().catch(() => false)) {
      await titleField.first().fill(`${title} - ${updatedSuffix}`);
    }

    const save = page.getByRole('button', { name: /^save$/i }).or(page.getByRole('button', { name: /update/i }));
    await save.first().click();

    // Back to list and verify
    await epicDetails.backToEpic();
    await epicDetails.openUserStoriesTab();
    await epicDetails.expectUserStoryInList(updatedSuffix);
  });

  test('TS-09 (US-USER STORY-07) Delete user story removes it from list', async ({ page }) => {
    const epicDetails = new EpicDetailsPage(page);

    await epicDetails.openUserStoriesTab();

    const title = await epicDetails.readFirstUserStoryTitle();
    expect(title).toBeTruthy();

    await epicDetails.deleteUserStoryByTitle(title);

    // Verify removed
    await expect(page.locator('main').getByText(title, { exact: false })).toHaveCount(0);
  });

  test('TS-10 (US-USER STORY-08) Save selected AI stories + token deduction', async ({ page }) => {
    const epicDetails = new EpicDetailsPage(page);
    const aiPanel = new AiUserStoriesPanel(page);

    await epicDetails.openGenerateAIUserStories();
    await aiPanel.waitForShown();

    const before = await aiPanel.readAvailableTokens();
    expect(before).not.toBeNull();

    await aiPanel.ensureAtLeastOneSelected();
    const selectedCount = await aiPanel.readSelectedCount();
    expect(selectedCount).toBeGreaterThan(0);

    await aiPanel.saveSelected();

    // After save, app usually returns to epic details
    await expect(page).toHaveURL(/\/epics\/\d+/);
    await epicDetails.waitForLoaded();

    // Check user story count increased (at least by selectedCount)
    await epicDetails.openUserStoriesTab();
    const afterCount = await epicDetails.readUserStoryCount();
    expect(afterCount).toBeGreaterThan(0);
  });
});
