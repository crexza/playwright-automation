const { test, expect } = require('@playwright/test');

const SlickfoxLoginPage = require('../pages/SlickfoxLoginPage');
const DashboardPage = require('../pages/DashboardPage');
const ProfilePage = require('../pages/ProfilePage');

const ACC09_EMAIL = process.env.SLICKFOX_ACC09_EMAIL;
const ACC09_PASS = process.env.SLICKFOX_ACC09_PASS;
const ACC09_NEW_PASS = process.env.SLICKFOX_ACC09_NEW_PASS;

const ACC10_EMAIL = process.env.SLICKFOX_ACC10_EMAIL;
const ACC10_PASS = process.env.SLICKFOX_ACC10_PASS;

if (!ACC09_EMAIL || !ACC09_PASS || !ACC09_NEW_PASS || !ACC10_EMAIL || !ACC10_PASS) {
  throw new Error('Missing Slickfox security credentials in .env');
}

const SLICKFOX_EMAIL = process.env.SLICKFOX_EMAIL;
const SLICKFOX_PASSWORD = process.env.SLICKFOX_PASSWORD;

if (!SLICKFOX_EMAIL || !SLICKFOX_PASSWORD) {
  throw new Error('Missing SLICKFOX_EMAIL or SLICKFOX_PASSWORD in .env');
}

test.describe('Slickfox Profile Security (US-ACC-09/10/11)', () => {

  test('US-ACC-09 - Update Password then login with new password (and revert)', async ({ page, browser }) => {
  const loginPage = new SlickfoxLoginPage(page);
  const dashboardPage = new DashboardPage(page);
  const profilePage = new ProfilePage(page);

  // Login with ACC09
  await loginPage.openLoginPage();
  await loginPage.login(ACC09_EMAIL, ACC09_PASS);

  await dashboardPage.goToProfile();
  await profilePage.updatePassword(ACC09_PASS, ACC09_NEW_PASS);

  await dashboardPage.logout();

  // Fresh context → login with NEW password
  const context2 = await browser.newContext();
  const page2 = await context2.newPage();
  const login2 = new SlickfoxLoginPage(page2);

  await login2.openLoginPage();
  await login2.login(ACC09_EMAIL, ACC09_NEW_PASS);

  // Revert password
  const dash2 = new DashboardPage(page2);
  const profile2 = new ProfilePage(page2);

  await dash2.goToProfile();
  await profile2.updatePassword(ACC09_NEW_PASS, ACC09_PASS);

  await context2.close();
});


  test('US-ACC-10 - Log Out Other Sessions', async ({ page, browser }) => {
  const loginA = new SlickfoxLoginPage(page);
  const dashA = new DashboardPage(page);
  const profileA = new ProfilePage(page);

  // Session A (SLICKFOX account)
  await loginA.openLoginPage();
  await loginA.login(SLICKFOX_EMAIL, SLICKFOX_PASSWORD);

  // Session B
  const contextB = await browser.newContext();
  const pageB = await contextB.newPage();
  const loginB = new SlickfoxLoginPage(pageB);

  await loginB.openLoginPage();
  await loginB.login(SLICKFOX_EMAIL, SLICKFOX_PASSWORD);

  // Logout other sessions from A
  await dashA.goToProfile();
  await profileA.logoutOtherSessions(SLICKFOX_PASSWORD);

  // Session B: security actions should be blocked
  await pageB.goto('https://demo.slickfox.com/profile');

  await expect(
    pageB.getByRole('heading', { name: /browser sessions/i })
  ).not.toBeVisible();

  await contextB.close();
});


  test('US-ACC-11 - Delete Account (DISABLED)', async ({ page }) => {
    console.log('RUN_DESTRUCTIVE =', JSON.stringify(process.env.RUN_DESTRUCTIVE));
 test.skip(
  process.env.RUN_DESTRUCTIVE?.trim() !== 'true',
  'Destructive test disabled'
);


  const loginPage = new SlickfoxLoginPage(page);
  const dash = new DashboardPage(page);
  const profile = new ProfilePage(page);

  // lanykiki account
  await loginPage.openLoginPage();
  await loginPage.login(ACC10_EMAIL, ACC10_PASS);

  await dash.goToProfile();
  await profile.expectLoaded();
  await profile.deleteAccount(ACC10_PASS);

  await expect(page).toHaveURL(/login|\/$/);
});

});
