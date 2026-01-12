class WaitHelper {
  static async waitForElement(page, selector, timeout = 5000) {
    try {
      await page.waitForSelector(selector, { 
        state: 'visible', 
        timeout 
      });
      return true;
    } catch (error) {
      console.error(`Element ${selector} not found within ${timeout}ms`);
      return false;
    }
  }

  static async waitForNavigation(page, timeout = 30000) {
    try {
      await page.waitForLoadState('networkidle', { timeout });
      return true;
    } catch (error) {
      console.error('Page navigation timeout');
      return false;
    }
  }

  static async retryAction(action, maxRetries = 3, delayMs = 1000) {
    for (let i = 0; i < maxRetries; i++) {
      try {
        await action();
        return true;
      } catch (error) {
        console.log(`Attempt ${i + 1} failed: ${error.message}`);
        if (i < maxRetries - 1) {
          await this.sleep(delayMs);
        }
      }
    }
    throw new Error(`Action failed after ${maxRetries} attempts`);
  }

  static async sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  static async waitForTextChange(page, selector, expectedText, timeout = 5000) {
    const endTime = Date.now() + timeout;
    
    while (Date.now() < endTime) {
      const currentText = await page.locator(selector).textContent();
      if (currentText === expectedText) {
        return true;
      }
      await this.sleep(100);
    }
    return false;
  }
}

module.exports = WaitHelper;