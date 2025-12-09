import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  timeout: 30_000,
  expect: { timeout: 5000 },
  reporter: [['list'], ['html', { open: 'never' }]],
  use: {
    headless: true, // в CI: true, при локальной отладке ставь false
    viewport: { width: 1280, height: 800 },
    actionTimeout: 5_000,
    baseURL: process.env.BASE_URL || 'http://localhost:8000', // или http://localhost (в зависимости от nginx)
    ignoreHTTPSErrors: true,
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  projects: [
    { name: 'chromium', use: { browserName: 'chromium' } },
    // можно добавить firefox/webkit при необходимости
  ],
});
