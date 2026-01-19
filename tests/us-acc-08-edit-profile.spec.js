// tests/us-acc-08-edit-profile.spec.js
const { test, expect } = require('@playwright/test');
const path = require('path');

const SlickfoxLoginPage = require('../pages/SlickfoxLoginPage');
const DashboardPage = require('../pages/DashboardPage');
const ProfilePage = require('../pages/ProfilePage');

const SLICKFOX_EMAIL = process.env.SLICKFOX_EMAIL;
const SLICKFOX_PASSWORD = process.env.SLICKFOX_PASSWORD;

test('US-ACC-08 - Update personal info and photo', async ({ page }) => {
  const loginPage = new SlickfoxLoginPage(page);
  const dashboardPage = new DashboardPage(page);
  const profilePage = new ProfilePage(page);

  await loginPage.openLoginPage();
  await loginPage.login(SLICKFOX_EMAIL, SLICKFOX_PASSWORD);
  await expect(page).toHaveURL(/dashboard/);

  await dashboardPage.goToProfile();
  await expect(page).toHaveURL(/profile/i);
  await profilePage.expectLoaded();

  const newName = `Caressa ${Date.now()}`;
  const newOrg = `Org ${Date.now()}`;

  await profilePage.updateProfileInfo({ name: newName, orgName: newOrg });

  // Upload valid photo (jpeg/jpg/png, <=2MB)
  const photoPath = path.resolve(__dirname, '../test-data/profile-photo.png');
  await profilePage.uploadPhoto(photoPath);

  await profilePage.saveProfile();

  // Verify saved values are still there
  await expect(profilePage.nameInput).toHaveValue(newName);
  await expect(profilePage.orgNameInput).toHaveValue(newOrg);
});

test('US-ACC-08 (Negative) - Upload invalid photo shows validation error', async ({ page }) => {
  const loginPage = new SlickfoxLoginPage(page);
  const dashboardPage = new DashboardPage(page);
  const profilePage = new ProfilePage(page);

  await loginPage.openLoginPage();
  await loginPage.login(process.env.SLICKFOX_EMAIL, process.env.SLICKFOX_PASSWORD);
  await expect(page).toHaveURL(/dashboard/);

  await dashboardPage.goToProfile();
  await expect(page).toHaveURL(/profile/i);
  await profilePage.expectLoaded();

    const invalidFile = path.resolve(__dirname, '../test-data/invalid-photo.txt');
  await profilePage.uploadPhoto(invalidFile);

  // ✅ trigger validation
  await profilePage.saveProfile();

  // ✅ now assert a single, scoped error element
  await expect(profilePage.photoErrorMessage).toBeVisible({ timeout: 10000 });
});