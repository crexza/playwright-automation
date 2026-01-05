const fs = require('fs');
const path = require('path');

class TestDataHelper {
  static loadJsonData(filename) {
    const filePath = path.join(__dirname, '../test-data', filename);
    const rawData = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(rawData);
  }

  static getValidUser(userType = 'standard') {
    const users = this.loadJsonData('users.json');
    return users.validUsers[userType];
  }

  static getInvalidUsers() {
    const users = this.loadJsonData('users.json');
    return users.invalidUsers;
  }

  static getLockedUser() {
    const users = this.loadJsonData('users.json');
    return users.lockedUser;
  }

  static getProducts() {
    const products = this.loadJsonData('products.json');
    return products.testProducts;
  }

  static getRandomProduct() {
    const products = this.getProducts();
    return products[Math.floor(Math.random() * products.length)];
  }

  static getProductByName(name) {
    const products = this.getProducts();
    return products.find(p => p.name === name);
  }
}

module.exports = TestDataHelper;