const { test, expect } = require('@playwright/test');
const RegisterPage = require('../pages/RegisterPage');
const SlickfoxLoginPage = require('../pages/SlickfoxLoginPage');

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

  // 1–6 Login with Remember Me
  await loginPage.openLoginPage();
  await loginPage.login(
    'caressa2004@gmail.com',
    'Crexza04',
    true // Remember Me ON
  );

  // 7–8 Logout
  await loginPage.logout();

  // 9 Click Log In again
  await loginPage.loginLink.click();

  // 10 Observe fields auto-filled
  await expect(loginPage.emailInput).toHaveValue('caressa2004@gmail.com');
  await expect(loginPage.passwordInput).not.toHaveValue(''); // browser may mask but still filled
});

test('Login without Remember Me (fields NOT auto-filled)', async ({ page }) => {
  const loginPage = new SlickfoxLoginPage(page);

  // 1–5 Login without Remember Me
  await loginPage.openLoginPage();
  await loginPage.login(
    'caressa2004@gmail.com',
    'Crexza04',
    false // Remember Me OFF
  );

  // 6–7 Logout
  await loginPage.logout();

  // 8 Click Log In again
  await loginPage.loginLink.click();

  // 9 Observe fields empty
  await expect(loginPage.emailInput).toHaveValue('');
  await expect(loginPage.passwordInput).toHaveValue('');
});

test('Login with invalid email and password', async ({ page }) => {
    const loginPage = new SlickfoxLoginPage(page);

    // 1–2: Open login page
    await loginPage.openLoginPage();

    // 3–4: Enter invalid credentials
    await loginPage.emailInput.fill('invaliduser@example.com');
    await loginPage.passwordInput.fill('WrongPass123');

    // 5: Click Sign In
    await loginPage.loginButton.click();

    // ✅ Assertion: Expect error message to appear
    const errorLocator = page.getByText(/invalid|incorrect|failed/i);
    await expect(errorLocator).toBeVisible({ timeout: 5000 });

    // Optionally, ensure we are still on the login page
    await expect(page).toHaveURL(/login/);
  });

test('Dashboard should not be accessible after failed login', async ({ page }) => {
    const loginPage = new SlickfoxLoginPage(page);

    // Step 1–2: Open login page
    await loginPage.openLoginPage();

    // Step 3–4: Enter invalid credentials
    await loginPage.emailInput.fill('invaliduser@example.com');
    await loginPage.passwordInput.fill('WrongPass123');

    // Step 5: Click Sign In
    await loginPage.loginButton.click();

    // Optional: Ensure login failed
    const errorLocator = page.getByText(/invalid|incorrect|failed/i);
    await expect(errorLocator).toBeVisible({ timeout: 5000 });

    // Step 6: Try accessing dashboard directly
    await page.goto('https://demo.slickfox.com/dashboard');

    // ✅ Assertion: Should be redirected back to login
    await expect(page).toHaveURL(/login/);

    // Optional: Ensure the dashboard content is not visible
    await expect(page.getByRole('heading', { name: /dashboard/i })).not.toBeVisible();
  });

test('User registration with valid data', async ({ page }) => {
    const registerPage = new RegisterPage(page);

    // Step 1–2: Open registration page
    await registerPage.openRegisterPage();

    // Step 3: Fill all required fields
    await registerPage.register({
      name: 'Test User',
      email: 'testuser123@example.com',
      password: 'Pass@1234',
      confirmPassword: 'Pass@1234',
      company: 'Test Company',
      phone: '0123456789'
    });

    // Step 4–5: Observe outcomes

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

    // 1–2: Open login page
    await loginPage.openLoginPage();

    // 3: Enter email
    await loginPage.emailInput.fill('testuser123@example.com');

    // 4: Click "Forgot Password"
    const forgotPasswordLink = page.getByRole('link', { name: /forgot password/i });
    await forgotPasswordLink.click();

    // Assertion: Should navigate to /forgot-password
    await expect(page).toHaveURL('https://demo.slickfox.com/forgot-password');


 

  
  });





});
