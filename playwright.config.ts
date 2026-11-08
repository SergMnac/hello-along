import { defineConfig } from '@playwright/test';
export default defineConfig({
  testDir: './tests/browser',
  use: { baseURL: 'http://127.0.0.1:4173', channel: 'msedge', trace: 'retain-on-failure' },
  webServer: { command: 'npm run dev', url: 'http://127.0.0.1:4173', reuseExistingServer: false, timeout: 120_000 },
  reporter: [['list'], ['json', { outputFile: 'artifacts/web-eng-008/browser-results.json' }]],
});
