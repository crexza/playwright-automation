require('dotenv').config();

class ConfigHelper {
  static getBaseUrl() {
    return process.env.BASE_URL || 'https://www.saucedemo.com';
  }

  static getStandardUser() {
    return {
      username: process.env.STANDARD_USER || 'standard_user',
      password: process.env.STANDARD_PASSWORD || 'secret_sauce'
    };
  }

  static isHeadless() {
    return process.env.HEADLESS === 'true';
  }

  static getTimeout() {
    return parseInt(process.env.TIMEOUT) || 30000;
  }

  static getRetries() {
    return parseInt(process.env.RETRIES) || 0;
  }

  static getBrowser() {
    return process.env.BROWSER || 'chromium';
  }
}

module.exports = ConfigHelper;