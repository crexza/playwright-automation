// pages/ProfilePage.js
class ProfilePage {
  constructor(page) {
    this.page = page;

    /* =======================
       PROFILE INFORMATION (US-ACC-08)
    ======================== */
    this.profileInfoHeading =
  page.getByRole('heading', { name: /profile information/i });

this.profileInfoSection =
  this.profileInfoHeading.locator('..').locator('..');


    this.nameInput =
      this.profileInfoSection.getByRole('textbox', { name: /^name$/i });

    this.emailInput =
      this.profileInfoSection.getByRole('textbox', { name: /^email$/i });

    this.orgNameInput =
      this.profileInfoSection.getByRole('textbox', {
        name: /organization name/i,
      });

    // hidden file input exists in DOM
    this.photoFileInput = page.locator('input#photo[type="file"]');

    this.profileInfoSaveButton =
      this.profileInfoSection.getByRole('button', { name: /^save$/i });

   // ===== US-ACC-09: Update Password =====

this.updatePasswordForm = page.locator('form', {
  has: page.locator('#current_password'),
});

// Inputs (scoped to that form so they never collide)
this.currentPasswordInput = this.updatePasswordForm.locator('#current_password');
this.newPasswordInput = this.updatePasswordForm.locator('#password');
this.confirmNewPasswordInput = this.updatePasswordForm.locator('#password_confirmation');

// Save button inside the same form (NOW unique)
this.updatePasswordSaveButton = this.updatePasswordForm.getByRole('button', {
  name: /^save$/i,
});


    /* =======================
       BROWSER SESSIONS (US-ACC-10)
    ======================== */
    this.browserSessionsSection = page
      .locator('main')
      .locator('div')
      .filter({
        has: page.getByRole('heading', { name: /browser sessions/i }),
      });

    this.logoutOtherSessionsButton =
      this.browserSessionsSection.getByRole('button', {
        name: /log out other browser sessions/i,
      });

    // modal shown after clicking logout other sessions
    this.logoutSessionsModal = page.getByRole('dialog');

    this.modalPasswordInput =
      this.logoutSessionsModal.getByRole('textbox', {
        name: /^password$/i,
      });

    this.confirmLogoutOtherSessionsButton =
      this.logoutSessionsModal.getByRole('button', {
        name: /log out other browser sessions/i,
      });

    /* =======================
       DELETE ACCOUNT (US-ACC-11)
    ======================== */
    this.deleteAccountSection = page
      .locator('main')
      .locator('div')
      .filter({
        has: page.getByRole('heading', { name: /delete account/i }),
      });

    this.deleteAccountButton =
      this.deleteAccountSection.getByRole('button', {
        name: /delete account/i,
      });

    this.deleteAccountModal = page.getByRole('dialog');

    this.deleteAccountPasswordInput =
      this.deleteAccountModal.getByRole('textbox', {
        name: /^password$/i,
      });

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
    if (name !== undefined) await this.nameInput.fill(name);
    if (email !== undefined) await this.emailInput.fill(email);
    if (orgName !== undefined) await this.orgNameInput.fill(orgName);
  }

  async uploadPhoto(filePath) {
    await this.photoFileInput.setInputFiles(filePath);
  }

  async saveProfileInfo() {
    await this.profileInfoSaveButton.click();
  }

  /* =======================
     US-ACC-09
  ======================== */
  async updatePassword(currentPassword, newPassword) {
  // wait instead of expect
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
    await this.modalPasswordInput.fill(password);
    await this.confirmLogoutOtherSessionsButton.click();
  }

  /* =======================
     US-ACC-11
  ======================== */
  async deleteAccount(password) {
    await this.deleteAccountButton.click();
    await this.deleteAccountModal.waitFor({ state: 'visible' });
    await this.deleteAccountPasswordInput.fill(password);
    await this.confirmDeleteAccountButton.click();
  }
}

module.exports = ProfilePage;
