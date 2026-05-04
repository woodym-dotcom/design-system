import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './visual-tests',
  snapshotDir: './visual-tests/snapshots',
  updateSnapshots: 'missing',
  use: {
    baseURL: 'http://localhost:6006',
    ...devices['Desktop Chrome'],
  },
  webServer: {
    command: 'pnpm exec serve storybook-static -l 6006 --no-clipboard',
    url: 'http://localhost:6006',
    reuseExistingServer: false,
    timeout: 30000,
  },
});
