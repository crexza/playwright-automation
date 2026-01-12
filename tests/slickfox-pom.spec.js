const { test, expect } = require('@playwright/test');
const RegisterPage = require('../pages/RegisterPage');
const SlickfoxLoginPage = require('../pages/SlickfoxLoginPage');
const ResetPasswordPage = require('../pages/ResetPasswordPage');


test.describe('Slickfox – Full POM Test Suite', () => {

  test('Open registration page', async ({ page }) => {
    const registerPage = new RegisterPage(page);

    await registerPage.openRegisterPage();

    await expect(page).toHaveURL('https://demo.slickfox.com/register');
  });

  test('User registration (valid data)', async ({ page }) => {
    const registerPage = new RegisterPage(page);

    await registerPage.openRegisterPage();

    await registerPage.register({
      name: 'test user',
      email: 'testuser123@example.com',
      password: 'Pass@123',
      confirmPassword: 'Pass@123',
      company: 'comp test',
      phone: '0199999999'
    });

    // Registration usually stays on register or shows success
    await expect(page).toHaveURL(/register/);
  });

  test('Password less than 8 characters', async ({ page }) => {
    const registerPage = new RegisterPage(page);

    await registerPage.openRegisterPage();

    await registerPage.passwordInput.fill('Pas23');
    await registerPage.completeRegistrationButton.click();

    await expect(
      registerPage.page.getByText('Password must be at least 8 characters')
    ).toBeVisible();
  });

  test('Password and confirm password mismatch', async ({ page }) => {
    const registerPage = new RegisterPage(page);

    await registerPage.openRegisterPage();

    await registerPage.passwordInput.fill('Passwor23');
    await registerPage.confirmPasswordInput.fill('Pass@123');
    await registerPage.completeRegistrationButton.click();

    await expect(
      registerPage.page.getByText('Passwords do not match')
    ).toBeVisible();
  });

  test('Open login page', async ({ page }) => {
    const loginPage = new SlickfoxLoginPage(page);

    await loginPage.openLoginPage();

    await expect(page).toHaveURL('https://demo.slickfox.com/login');
  });

  test('Login with valid credentials', async ({ page }) => {
    const loginPage = new SlickfoxLoginPage(page);

    await loginPage.goto('/login');
    await loginPage.login('caressa2004@gmail.com', 'Crexza04');

    await expect(page).toHaveURL('https://demo.slickfox.com/dashboard');
  });

  test('Login with Remember Me enabled (auto-filled after logout)', async ({ page }) => {
  const loginPage = new SlickfoxLoginPage(page);

  // Login with Remember Me
  await loginPage.openLoginPage();
  await loginPage.login(
    'caressa2004@gmail.com',
    'Crexza04',
    true // Remember Me ON
  );

  //Logout
  await loginPage.logout();
  // Click Log In again
  await loginPage.loginLink.click();
  // Observe fields auto-filled
  await expect(loginPage.emailInput).toHaveValue('caressa2004@gmail.com');
  await expect(loginPage.passwordInput).not.toHaveValue(''); // browser may mask but still filled
});

  test('Login without Remember Me (fields NOT auto-filled)', async ({ page }) => {
  const loginPage = new SlickfoxLoginPage(page);

  // Login without Remember Me
  await loginPage.openLoginPage();
  await loginPage.login(
    'caressa2004@gmail.com',
    'Crexza04',
    false // Remember Me OFF
  );

  // Logout
  await loginPage.logout();
  // Click Log In again
  await loginPage.loginLink.click();
  // Observe fields empty
  await expect(loginPage.emailInput).toHaveValue('');
  await expect(loginPage.passwordInput).toHaveValue('');
});

  test('Login with invalid email and password', async ({ page }) => {
    const loginPage = new SlickfoxLoginPage(page);

    //Open login page
    await loginPage.openLoginPage();

    // Enter invalid credentials
    await loginPage.emailInput.fill('invaliduser@example.com');
    await loginPage.passwordInput.fill('WrongPass123');

    //  Click Sign In
    await loginPage.loginButton.click();

    //Expect error message to appear
    const errorLocator = page.getByText(/invalid|incorrect|failed/i);
    await expect(errorLocator).toBeVisible({ timeout: 5000 });


  });

  test('Dashboard should not be accessible after failed login', async ({ page }) => {
    const loginPage = new SlickfoxLoginPage(page);

    //Open login page
    await loginPage.openLoginPage();

    //Enter invalid credentials
    await loginPage.emailInput.fill('invaliduser@example.com');
    await loginPage.passwordInput.fill('WrongPass123');

    //Click Sign In
    await loginPage.loginButton.click();

    //  Ensure login failed
    const errorLocator = page.getByText(/invalid|incorrect|failed/i);
    await expect(errorLocator).toBeVisible({ timeout: 5000 });

    // Try accessing dashboard directly
    await page.goto('https://demo.slickfox.com/dashboard');

    //Should be redirected back to login
    await expect(page).toHaveURL(/login/);

    //  Ensure the dashboard content is not visible
    await expect(page.getByRole('heading', { name: /dashboard/i })).not.toBeVisible();
  });

  test('User registration with valid data', async ({ page }) => {
    const registerPage = new RegisterPage(page);

    // Open registration page
    await registerPage.openRegisterPage();

    //  Fill all required fields
    await registerPage.register({
      name: 'Test User',
      email: 'testuser123@example.com',
      password: 'Pass@1234',
      confirmPassword: 'Pass@1234',
      company: 'Test Company',
      phone: '0123456789'
    });

    //  Observe outcomes

    // Option 1: Check URL redirect to login or dashboard
    await expect(page).toHaveURL(/login|dashboard/);

    // Option 2: Check confirmation message visible (if app shows it)
    const confirmationMessage = await registerPage.getErrorByText(/success|registered/i);
    if (await confirmationMessage.count() > 0) {
      await expect(confirmationMessage).toBeVisible();
    }
     });

  test('Click Forgot Password navigates to forgot-password page', async ({ page }) => {
    const loginPage = new SlickfoxLoginPage(page);

    // Open login page
    await loginPage.openLoginPage();

    //  Enter email
    await loginPage.emailInput.fill('testuser123@example.com');

    //  Click "Forgot Password"
    const forgotPasswordLink = page.getByRole('link', { name: /forgot password/i });
    await forgotPasswordLink.click();

    //  Should navigate to /forgot-password
    await expect(page).toHaveURL('https://demo.slickfox.com/forgot-password');
  });

  test('Forgot Password flow', async ({ page }) => {
  const loginPage = new SlickfoxLoginPage(page);

  // Open site & go to login
  await loginPage.openLoginPage();

  // Go to Forgot Password
  await loginPage.goToForgotPassword();
  await expect(page).toHaveURL(/forgot-password/);

  // Request password reset (VALID EMAIL)
  await loginPage.requestPasswordReset('caressa2004@gmail.com');

  // Verify reset email confirmation message
  await expect(
    page.getByText(/we have emailed your password reset link/i)
  ).toBeVisible();

  // UI automation stops here (email token required)
});












});
