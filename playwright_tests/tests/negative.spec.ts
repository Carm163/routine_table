import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/login.page';
import { TablePage } from '../pages/table.page';

test('should not accept period_days = 0', async ({ page }) => {
  const login = new LoginPage(page);
  const table = new TablePage(page);

  await login.goto();
  await login.login('user2', '1991sam');
  await expect(page).toHaveURL(/.*\/table\/$/);

  await table.addTask('Bad task', '2025-12-01', '0');

  // Ожидаем, что форма вернула ошибку (например, валидация формы)
  // Предполагаем, что при невалидных данных страница перезагрузится и покажет сообщение об ошибке
  await expect(page.locator('#id_period_days_error')).toBeVisible({
    timeout: 5000,
  });

  // Проверяем текст конкретного сообщения
  await expect(
    page.locator('#id_period_days_error >> text=Периодичность должна быть целым числом >= 1'),
  ).toBeVisible();
});
