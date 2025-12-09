import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/login.page';
import { TablePage } from '../pages/table.page';
import { format } from 'date-fns';

test('Добавление задачи', async ({ page, baseURL }) => {
  const login = new LoginPage(page);
  const table = new TablePage(page);

  // Переменные для проверки
  const username = 'user2';
  const password = '1991sam';

  // пример: done_date = 2025-12-01, period = 7 -> next_date = 2025-12-08
  const doneDate = '2025-12-01';
  const period = '7';
  const expectedNextDate = '08 Декабрь 2025 г.'; // отображается в шаблоне
  // Запускаем
  await login.goto();
  await login.login(username, password);
  await expect(page).toHaveURL(/.*\/table\/$/);

  // Добавляем задачу
  await table.addTask('Тестовая задача', doneDate, period);

  // Находим строку с нашей задачей
  const row = page.locator('table tbody tr').filter({ hasText: 'Тестовая задача' }).first();
  await expect(row).toBeVisible();

  // Проверяем отображение next_date (в формате d F Y г.)
  const nextDateCell = row.locator('td').nth(3); // 0-task,1-done_date,2-period,3-next_date,4-days_left
  await expect(nextDateCell).toHaveText(expectedNextDate);

  // Проверим days_left: вычислим сегодня в тесте и проверим соответствие
  // note: сервер вычисляет days_left = next_date - localdate(server)
  // Если тесты выполняются локально и сервер в тех же час.зонах, можно вычислить:
});
