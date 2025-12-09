import { Page, Locator } from '@playwright/test';

export class LoginPage {
  readonly page: Page;
  readonly username: Locator;
  readonly password: Locator;
  readonly submitBtn: Locator;
  readonly error: Locator;

  constructor(page: Page) {
    this.page = page;
    this.username = page.locator('input[name="username"]');
    this.password = page.locator('input[name="password"]');
    this.submitBtn = page.locator('button[type="submit"]');
    this.error = page.locator('.error'); // селектор ошибки в шаблоне
  }

  async goto() {
    await this.page.goto('/');
  }

  async login(username: string, password: string) {
    await this.username.fill(username);
    await this.password.fill(password);
    await this.submitBtn.click();
  }
}
