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

});
