// pages/ProfilePage.js
class ProfilePage {
  constructor(page) {
    this.page = page;

    /* =======================
       PROFILE INFORMATION (US-ACC-08)
       Anchor: Name textbox → parent form
    ======================== */

    this.profileInfoForm = page
      .getByRole('textbox', { name: /^name$/i })
      .locator('xpath=ancestor::form[1]');

    this.profileInfoHeading = page.getByRole('heading', {
      name: /profile information/i,
    });

    this.nameInput =
      this.profileInfoForm.getByRole('textbox', { name: /^name$/i });

    this.emailInput =
      this.profileInfoForm.getByRole('textbox', { name: /^email$/i });

    this.orgNameInput =
      this.profileInfoForm.getByRole('textbox', { name: /organization name/i });

    this.photoFileInput =
      this.profileInfoForm.locator('input[type="file"]');

    this.profileInfoSaveButton =
      this.profileInfoForm.getByRole('button', { name: /^save$/i });

    this.photoErrorMessage = this.profileInfoForm
  .locator('p, span')
  .filter({ hasText: /invalid|jpeg|png|jpg|file/i });


    /* =======================
       UPDATE PASSWORD (US-ACC-09)
       Anchor: #current_password (unique)
    ======================== */

    this.updatePasswordForm = page.locator('form', {
      has: page.locator('#current_password'),
    });

    this.currentPasswordInput = page.locator('#current_password');
    this.newPasswordInput = page.locator('#password');
    this.confirmNewPasswordInput = page.locator('#password_confirmation');

    this.updatePasswordSaveButton =
      this.updatePasswordForm.getByRole('button', { name: /^save$/i });

    /* =======================
       BROWSER SESSIONS (US-ACC-10)
    ======================== */

    this.browserSessionsSection = page.locator('div', {
      has: page.getByRole('heading', { name: /browser sessions/i }),
    });

    this.logoutOtherSessionsButton =
      this.browserSessionsSection.getByRole('button', {
        name: /log out other browser sessions/i,
      });

    this.logoutSessionsModal = page.getByRole('dialog');

    this.modalPasswordInput =
      this.logoutSessionsModal.getByRole('textbox', { name: /^password$/i });

    this.confirmLogoutOtherSessionsButton =
      this.logoutSessionsModal.getByRole('button', {
        name: /log out other browser sessions/i,
      });

    /* =======================
       DELETE ACCOUNT (US-ACC-11)
    ======================== */

    this.deleteAccountSection = page.locator('div', {
      has: page.getByRole('heading', { name: /delete account/i }),
    });

    this.deleteAccountButton =
      this.deleteAccountSection.getByRole('button', {
        name: /delete account/i,
      });

    this.deleteAccountModal = page.getByRole('dialog');

    this.deleteAccountPasswordInput =
      this.deleteAccountModal.getByRole('textbox', { name: /^password$/i });

    this.confirmDeleteAccountButton =
      this.deleteAccountModal.getByRole('button', {
        name: /delete account/i,
      });
  }

  /* =======================
     COMMON
  ======================== */
  async expectLoaded() {
    await this.profileInfoHeading.waitFor({ state: 'visible' });
  }

  /* =======================
     US-ACC-08
  ======================== */
  async updateProfileInfo({ name, email, orgName } = {}) {
    if (name !== undefined) await this.nameInput.fill(String(name));
    if (email !== undefined) await this.emailInput.fill(String(email));
    if (orgName !== undefined) await this.orgNameInput.fill(String(orgName));
  }

  async uploadPhoto(filePath) {
    await this.photoFileInput.setInputFiles(filePath);
  }

  async saveProfile() {
    await this.profileInfoSaveButton.click();
  }

  /* =======================
     US-ACC-09
  ======================== */
  async updatePassword(currentPassword, newPassword) {
    await this.currentPasswordInput.waitFor({ state: 'visible' });
    await this.currentPasswordInput.fill(String(currentPassword));
    await this.newPasswordInput.fill(String(newPassword));
    await this.confirmNewPasswordInput.fill(String(newPassword));
    await this.updatePasswordSaveButton.click();
  }

  /* =======================
     US-ACC-10
  ======================== */
  async logoutOtherSessions(password) {
    await this.logoutOtherSessionsButton.click();
    await this.logoutSessionsModal.waitFor({ state: 'visible' });
    await this.modalPasswordInput.fill(String(password));
    await this.confirmLogoutOtherSessionsButton.click();
  }

  /* =======================
     US-ACC-11
  ======================== */
  async deleteAccount(password) {
    await this.deleteAccountButton.click();
    await this.deleteAccountModal.waitFor({ state: 'visible' });
    await this.deleteAccountPasswordInput.fill(String(password));
    await this.confirmDeleteAccountButton.click();
  }
}

module.exports = ProfilePage;
