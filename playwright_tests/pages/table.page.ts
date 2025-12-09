import { Page, Locator, expect } from '@playwright/test';
import { addDays, parseISO } from 'date-fns';

export class TablePage {
  readonly page: Page;
  readonly table: Locator;
  readonly taskInput: Locator;
  readonly doneDateInput: Locator;
  readonly periodInput: Locator;
  readonly addButton: Locator;
  readonly rows: Locator;

  constructor(page: Page) {
    this.page = page;
    this.table = page.locator('table');
    this.taskInput = page.locator('input[name="task"]');
    this.doneDateInput = page.locator('input[name="done_date"]');
    this.periodInput = page.locator('input[name="period_days"]');
    this.addButton = page.locator('#btn-add');
    this.rows = page.locator('table tbody tr');
  }

  async goto() {
    await this.page.goto('/table/');
  }

  async addTask(task: string, doneDate: string, period: string) {
    await this.taskInput.fill(task);
    await this.doneDateInput.fill(doneDate); // формат YYYY-MM-DD
    await this.periodInput.fill(period);
    await this.addButton.click();
    await this.page.waitForLoadState('networkidle');
  }

  // Получаем первую строку с задачей по имени
  rowByTask(task: string) {
    return this.rows.filter({ hasText: task }).first();
  }

  // Проверка даты с регуляркой
  async expectNextDate(rowTask: string, doneDate: string, periodDays: number) {
    const row = this.rowByTask(rowTask);
    const cell = row.locator('td').nth(3); // 4-й столбец — next_date

    // вычисляем дату следующего выполнения
    const done = parseISO(doneDate);
    const nextDate = addDays(done, periodDays);

    const day = String(nextDate.getDate()).padStart(2, '0'); // "08"
    const year = nextDate.getFullYear();

    // Регулярка: день + любой текст + год
    const regex = new RegExp(`${day}\\s+.*${year} г\\.`, 'i');

    await expect(cell).toHaveText(regex);
  }
}
