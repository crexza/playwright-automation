// pages/DashboardPage.js
class DashboardPage {
  constructor(page) {
    this.page = page;

    // ✅ picks the user button (it contains an img with accessible name)
    this.userMenuButton = page.locator('nav')
      .getByRole('button')
      .filter({ has: page.getByRole('img', { name: /.+/ }) })
      .first();

    this.profileLink = page.getByRole('link', { name: /^profile$/i });
    this.logoutButton = page.getByRole('button', { name: /^log out$/i }); // snapshot shows button
  }

  async openUserMenu() {
    await this.userMenuButton.click();
  }

  async goToProfile() {
    await this.openUserMenu();
    await this.profileLink.click();
  }

  async logout() {
    await this.openUserMenu();
    await this.logoutButton.click();
  }
}

module.exports = DashboardPage;
