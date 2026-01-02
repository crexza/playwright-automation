class SlickfoxBasePage {
  constructor(page) {
    this.page = page;
    this.baseUrl = 'https://demo.slickfox.com';
  }

  async goto(path = '') {
    await this.page.goto(`${this.baseUrl}${path}`);
  }
}

module.exports = SlickfoxBasePage;
