class DashboardPage {
  constructor(page) {
    this.page = page;

    // User menu button (user avatar / name)
    this.userMenuButton = page.getByRole('button', {
      name: /caressa lopez/i
    });

    // Logout is a BUTTON, not a menuitem
    this.logoutButton = page.getByRole('button', {
      name: /log out/i
    });
  }

  async logout() {
    await this.userMenuButton.click();

    // Ensure menu is open before clicking logout
    await this.logoutButton.waitFor({ state: 'visible' });
    await this.logoutButton.click();
  }
}

module.exports = DashboardPage;
