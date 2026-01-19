// pages/ProfilePage.js
class ProfilePage {
  constructor(page) {
    this.page = page;

    // ✅ Profile Information form (contains the photo upload input)
    this.profileForm = page.locator('form').filter({
      has: page.locator('input#photo[type="file"]'),
    });

    this.profileInfoHeading = page.getByRole('heading', { name: /profile information/i });

    this.nameInput = this.profileForm.getByRole('textbox', { name: /^name$/i });
    this.emailInput = this.profileForm.getByRole('textbox', { name: /^email$/i });
    this.orgNameInput = this.profileForm.getByRole('textbox', { name: /organization name/i });

    this.photoFileInput = this.profileForm.locator('input#photo[type="file"]');

    // ✅ now only 1 Save
    this.profileSaveButton = this.profileForm.getByRole('button', { name: /^save$/i });

    // ✅ keep it scoped too (won’t match nav “Profile”, etc.)
    this.photoErrorMessage = this.profileForm.getByText(
      /must be.*(jpeg|jpg|png)|invalid.*(image|photo)|file.*type|2\s*mb|too.*large/i
    );
  }

  async expectLoaded() {
    await this.profileInfoHeading.waitFor();
  }

  async updateProfileInfo({ name, email, orgName } = {}) {
    if (name !== undefined) await this.nameInput.fill(name);
    if (email !== undefined) await this.emailInput.fill(email);
    if (orgName !== undefined) await this.orgNameInput.fill(orgName);
  }

  async uploadPhoto(filePath) {
    await this.photoFileInput.setInputFiles(filePath);
  }

  async saveProfile() {
    await this.profileSaveButton.click();
  }
}

module.exports = ProfilePage;
