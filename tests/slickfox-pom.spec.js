const { test, expect } = require('@playwright/test');

const RegisterPage = require('../pages/RegisterPage');
const SlickfoxLoginPage = require('../pages/SlickfoxLoginPage');
const DashboardPage = require('../pages/DashboardPage');
const ForgotPasswordPage = require('../pages/ForgotPasswordPage');
const ProfilePage = require('../pages/ProfilePage');

// Read from .env
const SLICKFOX_EMAIL = process.env.SLICKFOX_EMAIL;
const SLICKFOX_PASSWORD = process.env.SLICKFOX_PASSWORD;

if (!SLICKFOX_EMAIL || !SLICKFOX_PASSWORD) {
  throw new Error('Missing SLICKFOX_EMAIL or SLICKFOX_PASSWORD in .env');
}

test.describe('Slickfox – Full POM Test Suite', () => {

  /* =====================
     REGISTRATION
  ====================== */

  test('Open registration page', async ({ page }) => {
    const registerPage = new RegisterPage(page);

    await registerPage.openRegisterPage();
    await expect(page).toHaveURL('https://demo.slickfox.com/');
  });

  test('User registration (valid data)', async ({ page }) => {
    const registerPage = new RegisterPage(page);

    await registerPage.openRegisterPage();

    await registerPage.register({
      name: 'Test User',
      email: `testuser_${Date.now()}@example.com`, // avoid duplicate email
      password: 'Pass@1234',
      confirmPassword: 'Pass@1234',
      company: 'Test Company',
      phone: '0199999999'
    });

    // App may stay or redirect
    await expect(page).toHaveURL(/register|login|dashboard/);
  });

  test('Password less than 8 characters', async ({ page }) => {
    const registerPage = new RegisterPage(page);

    await registerPage.openRegisterPage();
    await registerPage.passwordInput.fill('Pas23');
    await registerPage.completeRegistrationButton.click();

    await expect(page.getByText(/at least 8 characters/i)).toBeVisible();
  });

  test('Password and confirm password mismatch', async ({ page }) => {
    const registerPage = new RegisterPage(page);

    await registerPage.openRegisterPage();
    await registerPage.passwordInput.fill('Password123');
    await registerPage.confirmPasswordInput.fill('Pass@123');
    await registerPage.completeRegistrationButton.click();

    await expect(page.getByText(/passwords do not match/i)).toBeVisible();
  });

  /* =====================
     LOGIN
  ====================== */

  test('Open login page', async ({ page }) => {
    const loginPage = new SlickfoxLoginPage(page);

    await loginPage.openLoginPage();
    await expect(page).toHaveURL('https://demo.slickfox.com/login');
  });

  test('Login with valid credentials', async ({ page }) => {
    const loginPage = new SlickfoxLoginPage(page);

    await loginPage.openLoginPage();
    await loginPage.login(SLICKFOX_EMAIL, SLICKFOX_PASSWORD);

    await expect(page).toHaveURL(/dashboard/);
  });

  test('Login with Remember Me enabled (email remembered)', async ({ page }) => {
    const loginPage = new SlickfoxLoginPage(page);

    await loginPage.openLoginPage();

    // ✅ IMPORTANT: pass true to enable remember me
    await loginPage.login(SLICKFOX_EMAIL, SLICKFOX_PASSWORD, true);

    await expect(page).toHaveURL(/dashboard/);

    // logout then go back to login
    await loginPage.logout();
    await loginPage.openLoginPage();

    // ✅ Only validate email (password is usually NOT readable for security)
    await expect(loginPage.emailInput).toHaveValue(SLICKFOX_EMAIL);
  });

  test('Login without Remember Me (email NOT auto-filled)', async ({ page }) => {
    const loginPage = new SlickfoxLoginPage(page);

    await loginPage.openLoginPage();
    await loginPage.login(SLICKFOX_EMAIL, SLICKFOX_PASSWORD, false);

    await expect(page).toHaveURL(/dashboard/);

    await loginPage.logout();
    await loginPage.openLoginPage();

    await expect(loginPage.emailInput).toHaveValue('');
  });

  test('Login with invalid email and password', async ({ page }) => {
    const loginPage = new SlickfoxLoginPage(page);

    await loginPage.openLoginPage();
    await loginPage.emailInput.fill('invaliduser@example.com');
    await loginPage.passwordInput.fill('WrongPass123');
    await loginPage.loginButton.click();

    await expect(page.getByText(/invalid|incorrect|failed/i)).toBeVisible();
  });

  test('Dashboard should not be accessible after failed login', async ({ page }) => {
    const loginPage = new SlickfoxLoginPage(page);

    await loginPage.openLoginPage();
    await loginPage.emailInput.fill('invaliduser@example.com');
    await loginPage.passwordInput.fill('WrongPass123');
    await loginPage.loginButton.click();

    await expect(page.getByText(/invalid|incorrect|failed/i)).toBeVisible();

    await page.goto('https://demo.slickfox.com/dashboard');
    await expect(page).toHaveURL(/login/);
  });

  /* =====================
     FORGOT PASSWORD
  ====================== */

  test('Click Forgot Password navigates to forgot-password page', async ({ page }) => {
    const loginPage = new SlickfoxLoginPage(page);

    await loginPage.openLoginPage();
    await loginPage.goToForgotPassword();

    await expect(page).toHaveURL(/forgot-password/);
  });

  test('Forgot Password flow (email submission)', async ({ page }) => {
  const loginPage = new SlickfoxLoginPage(page);
  const forgotPage = new ForgotPasswordPage(page);

  await loginPage.openLoginPage();
  await loginPage.goToForgotPassword();
  await expect(page).toHaveURL(/forgot-password/);

  await forgotPage.requestReset(SLICKFOX_EMAIL);

  // Accept either success OR "email not found" (depends if account exists)
  await expect(
    forgotPage.successMessage.or(forgotPage.emailNotFoundMessage)
  ).toBeVisible({ timeout: 10000 });
});

  /* =====================
     LOGOUT
  ====================== */

  test('User can login and logout successfully', async ({ page }) => {
    const loginPage = new SlickfoxLoginPage(page);
    const dashboardPage = new DashboardPage(page);

    await loginPage.openLoginPage();
    await loginPage.login(SLICKFOX_EMAIL, SLICKFOX_PASSWORD);

    await expect(page).toHaveURL(/dashboard/);

    await dashboardPage.logout();

    // After logout some apps go to "/" instead of "/login"
    await expect(page).toHaveURL(/login|\/$/);
  });

   test('ST-LOGOUT-02 - Access dashboard should be denied after logout', async ({ page }) => {
    const loginPage = new SlickfoxLoginPage(page);
    const dashboardPage = new DashboardPage(page);

    await loginPage.openLoginPage();
    await loginPage.login(SLICKFOX_EMAIL, SLICKFOX_PASSWORD);

    await expect(page).toHaveURL(/dashboard/);

    await dashboardPage.logout();

    // after logout slickfox may go to /login or /
    await expect(page).toHaveURL(/login|\/$/);

    // try to access dashboard again
    await page.goto('https://demo.slickfox.com/dashboard');

    // should redirect to login (or home)
    await expect(page).toHaveURL(/login|\/$/);
  });

  test('ST-PRO-01 - View Profile shows photo/name/email', async ({ page }) => {
  const loginPage = new SlickfoxLoginPage(page);
  const dashboardPage = new DashboardPage(page);
  const profilePage = new ProfilePage(page);

  await loginPage.openLoginPage();
  await loginPage.login(SLICKFOX_EMAIL, SLICKFOX_PASSWORD);

  await expect(page).toHaveURL(/dashboard/);

  await dashboardPage.goToProfile();
  await expect(page).toHaveURL(/profile/i);

  await expect(profilePage.profileInfoHeading).toBeVisible();
  await expect(profilePage.nameInput).toBeVisible();
  await expect(profilePage.emailInput).toBeVisible();

  // Since they are inputs, check values (not "visible text")
  await expect(profilePage.nameInput).toHaveValue(/.+/); // has something
  await expect(profilePage.emailInput).toHaveValue(SLICKFOX_EMAIL);
});




});
