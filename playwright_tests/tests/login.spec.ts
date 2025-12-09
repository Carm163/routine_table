import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/login.page';
import { TablePage } from '../pages/table.page';

test.describe('Удачная авторизация', () => {
  test('should login and redirect to table', async ({ page }) => {
    const login = new LoginPage(page);
    const table = new TablePage(page);

    await login.goto();
    await login.login('user2', '1991sam');

    // ожидаем, что редирект на /table/
    await expect(page).toHaveURL(/.*\/table\/$/);

    // таблица видна
    await expect(table.table).toBeVisible();
  });
});
