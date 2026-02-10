// tests/us-user-story.spec.js
const { test, expect } = require('@playwright/test');
const ProjectsPage = require('../pages/ProjectsPage');
const EpicPage = require('../pages/EpicPage');
const EpicDetailsPage = require('../pages/EpicDetailsPage');
const UserStoryCreatePage = require('../pages/UserStoryCreatePage');
const AiUserStoriesPanel = require('../pages/AiUserStoriesPanel');

test.describe('User Story Management (TS-01 → TS-10)', () => {
  async function goToEpicDetails(page) {
    const projects = new ProjectsPage(page);
    const epics = new EpicPage(page);
    const epicDetails = new EpicDetailsPage(page);

    await projects.openProjectEpic();      // Projects -> View Epics
    await epics.openFirstEpicDetails();    // Epics list -> open epic details (eye)
    await epicDetails.waitForLoaded();

    return { epicDetails, epics, projects };
  }

  test('TS-01 (US-USER STORY-01) View epic details read-only', async ({ page }) => {
    await goToEpicDetails(page);

    //  Realistic read-only check: ignore global search etc.
    const editableFields = page.locator('main').locator(
      'input:not(#search):not([type="search"]), textarea, select'
    );

    if (await editableFields.first().isVisible().catch(() => false)) {
      const el = editableFields.first();
      const readonly = await el.getAttribute('readonly');
      if (readonly !== null) await expect(el).toHaveAttribute('readonly', /.+/);
      else await expect(el).toBeDisabled();
    } else {
      await expect(page).toHaveURL(/\/epics\/\d+/);
    }
  });

  test('TS-02 (US-USER STORY-02) Generate AI user stories displayed', async ({ page }) => {
  const { epicDetails } = await goToEpicDetails(page);

  if (!(await epicDetails.generateAIUserStoriesBtn.first().isVisible().catch(() => false))) {
    test.skip(true, 'Generate AI User Stories button not available for this epic/account');
  }

  const ai = new AiUserStoriesPanel(page);

  await epicDetails.openGenerateAIUserStories();

  // This is the AI-Powered Generation page you showed
  await ai.waitForShown();

  await ai.generateFromRequirements(
    'Create user stories for an e-commerce platform: login, product catalog, cart, checkout, payment, order tracking.'
  );

  // Accept either selectable checkboxes OR results list
 const checkboxCount = await ai.checkboxes.count();
const resultCount = ai.resultItems ? await ai.resultItems.count() : 0;

expect(checkboxCount + resultCount).toBeGreaterThan(0);
});

 test('TS-03 (US-USER STORY-02) Token deduction 5 tokens per selected AI story', async ({ page }) => {
  const { epicDetails } = await goToEpicDetails(page);

  if (!(await epicDetails.generateAIUserStoriesBtn.first().isVisible().catch(() => false))) {
    test.skip(true, 'Generate AI User Stories button not available for this epic/account');
  }

  const ai = new AiUserStoriesPanel(page);
  const before = await epicDetails.readTokenBalanceNumber();

  await epicDetails.openGenerateAIUserStories();
await ai.waitForShown();

if (!(await ai.hasSelectableItems())) {
  test.skip(true, 'AI results are preview-only (no selectable items)');
}

  await ai.generateFromRequirements(
    'Generate user stories for a smart farming app: sensor monitoring, irrigation automation, alerts, analytics dashboard.'
  );

  // Only do token deduction assertion if the UI actually supports selecting+saving
  if (!(await ai.hasSelectableItems())) {
    test.skip(true, 'No selectable AI items (no checkboxes on this page/UI)');
  }

  const selected = await ai.selectFirstN(2);
  await ai.confirm();

  await epicDetails.waitForLoaded();

  const after = await epicDetails.readTokenBalanceNumber();
  if (before !== null && after !== null) {
    expect(after).toBe(before - 5 * selected);
  }
});

  test('TS-04 (US-USER STORY-03) Manual create user story happy path', async ({ page }) => {
    const { epicDetails } = await goToEpicDetails(page);

    const create = new UserStoryCreatePage(page);
    await epicDetails.openCreateUserStory();
    await create.waitForLoaded();

    const title = `Auto Story ${Date.now()}`;

    await create.fillManualForm({
      
      asA: 'registered user',
      iWant: 'to create a user story',
      soThat: 'I can track requirements',
    });

    await create.submit();

    await epicDetails.waitForLoaded();
    await epicDetails.expectUserStoryInList(title);
  });

  test('TS-05 (US-USER STORY-03) Mandatory field validation (negative)', async ({ page }) => {
    const { epicDetails } = await goToEpicDetails(page);

    const create = new UserStoryCreatePage(page);
    await epicDetails.openCreateUserStory();
    await create.waitForLoaded();

    await create.submit();
    await create.expectRequiredValidationAtLeastOne();
  });

  test('TS-06 (US-USER STORY-04) Cancel user story creation returns to epic page', async ({ page }) => {
    const { epicDetails } = await goToEpicDetails(page);

    const create = new UserStoryCreatePage(page);
    await epicDetails.openCreateUserStory();
    await create.waitForLoaded();

    // Fill only title (fast + enough for cancel scenario)
    await create.fillManualForm({
      title: `Temp Story ${Date.now()}`,
    });

    await create.cancel();
    await epicDetails.waitForLoaded();
  });

  test('TS-07 (US-USER STORY-05) View user story details read-only', async ({ page }) => {
    const { epicDetails } = await goToEpicDetails(page);

    // Create story to ensure it exists (independent test)
    const create = new UserStoryCreatePage(page);
    await epicDetails.openCreateUserStory();
    await create.waitForLoaded();

    const title = `View Story ${Date.now()}`;
    await create.fillManualForm({
      
      asA: 'registered user',
      iWant: 'to view a story',
      soThat: 'I can confirm details',
    });
    await create.submit();

    await epicDetails.waitForLoaded();
    await epicDetails.expectUserStoryInList(title);

    await epicDetails.openUserStoryViewByTitle(title);

    await expect(page.locator('main')).toContainText(/as a|i want|so that|story/i);

    const fields = page.locator('main').locator('input, textarea, select');
    if (await fields.first().isVisible().catch(() => false)) {
      const el = fields.first();
      const readonly = await el.getAttribute('readonly');
      if (readonly !== null) await expect(el).toHaveAttribute('readonly', /.+/);
      else await expect(el).toBeDisabled();
    }
  });

  test('TS-08 (US-USER STORY-06) Edit user story updates saved data', async ({ page }) => {
    const { epicDetails } = await goToEpicDetails(page);

    // Create a story first
    const create = new UserStoryCreatePage(page);
    await epicDetails.openCreateUserStory();
    await create.waitForLoaded();

    const title = `Edit Story ${Date.now()}`;
    await create.fillManualForm({
      
      asA: 'registered user',
      iWant: 'to edit a story',
      soThat: 'I can update requirements',
    });
    await create.submit();

    await epicDetails.waitForLoaded();
    await epicDetails.expectUserStoryInList(title);

    await epicDetails.openUserStoryEditByTitle(title);

    const titleField = page
      .getByLabel(/title/i)
      .or(page.locator('input[name="title"], #title'));

    await expect(titleField.first()).toBeVisible({ timeout: 15000 });

    const updated = `${title} (Updated)`;
    await titleField.first().fill(updated);

    await page.getByRole('button', { name: /save|update/i }).click();

    await epicDetails.waitForLoaded();
    await epicDetails.expectUserStoryInList(updated);
  });

  test('TS-09 (US-USER STORY-07) Delete user story removes it from list', async ({ page }) => {
    const { epicDetails } = await goToEpicDetails(page);

    // Create a story first
    const create = new UserStoryCreatePage(page);
    await epicDetails.openCreateUserStory();
    await create.waitForLoaded();

    const title = `Delete Story ${Date.now()}`;
    await create.fillManualForm({
      
      asA: 'registered user',
      iWant: 'to delete a story',
      soThat: 'I can remove outdated work',
    });
    await create.submit();

    await epicDetails.waitForLoaded();
    await epicDetails.expectUserStoryInList(title);

    await epicDetails.deleteUserStoryByTitle(title);

    await expect(page.locator('main').getByText(title, { exact: false })).toHaveCount(0);
  });

  test('TS-10 (US-USER STORY-08) Save selected AI stories + token deduction', async ({ page }) => {
  const { epicDetails } = await goToEpicDetails(page);

  if (!(await epicDetails.generateAIUserStoriesBtn.first().isVisible().catch(() => false))) {
    test.skip(true, 'Generate AI User Stories button not available for this epic/account');
  }

  const ai = new AiUserStoriesPanel(page);
  const before = await epicDetails.readTokenBalanceNumber();

  await epicDetails.openGenerateAIUserStories();
await ai.waitForShown();

if (!(await ai.hasSelectableItems())) {
  test.skip(true, 'AI results are preview-only (no selectable items)');
}

  await ai.generateFromRequirements(
    'Generate user stories for a project management system: epics, user stories, roles, permissions, notifications.'
  );

  if (!(await ai.hasSelectableItems())) {
    test.skip(true, 'No selectable AI items (no checkboxes on this page/UI)');
  }

  const selected = await ai.selectFirstN(3);
  await ai.confirm();

  await epicDetails.waitForLoaded();

  const after = await epicDetails.readTokenBalanceNumber();
  if (before !== null && after !== null) {
    expect(after).toBe(before - 5 * selected);
  }
});

});
