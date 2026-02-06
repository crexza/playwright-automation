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

    _rowByTitle(title) {
    const container = this.page.locator('main');
    // find something containing the title, then go to nearest row/card container
    return container.getByText(title, { exact: false }).first().locator('..');
  }

  async openUserStoryEditByTitle(title) {
    const row = this._rowByTitle(title);

    const editBtn = row
      .getByRole('button', { name: /edit/i })
      .or(row.getByRole('link', { name: /edit/i }))
      .or(row.locator('[aria-label*="edit" i], [title*="edit" i]'));

    await editBtn.first().waitFor({ state: 'visible', timeout: 15000 });
    await editBtn.first().click();

    await this.page.waitForURL(/user-stories\/\d+\/edit|edit/i, { timeout: 15000 });
  }

  async deleteUserStoryByTitle(title) {
    const row = this._rowByTitle(title);

    const deleteBtn = row
      .getByRole('button', { name: /delete|remove/i })
      .or(row.getByRole('link', { name: /delete|remove/i }))
      .or(row.locator('[aria-label*="delete" i], [title*="delete" i]'));

    await deleteBtn.first().waitFor({ state: 'visible', timeout: 15000 });
    await deleteBtn.first().click();

    // confirm dialog/modal (support multiple UI styles)
    const confirm = this.page
      .getByRole('button', { name: /confirm|yes|delete/i })
      .or(this.page.getByRole('button', { name: /^ok$/i }));

    if (await confirm.first().isVisible().catch(() => false)) {
      await confirm.first().click();
    }

    // wait until title disappears from list
    await expect(this.page.locator('main').getByText(title, { exact: false })).toHaveCount(0, { timeout: 15000 });
  }

}

module.exports = DashboardPage;
