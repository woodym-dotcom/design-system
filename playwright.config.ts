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
    // -c points serve at our committed config which disables cleanUrls. Without
    // it, serve 301-redirects `/iframe.html?id=X` → `/iframe` and DROPS the query
    // string, so Storybook loads with no story selected → every snapshot becomes
    // the "No Preview" error screen.
    command: 'pnpm exec serve storybook-static -l 6006 --no-clipboard -c ../visual-tests/serve.json',
    url: 'http://localhost:6006',
    reuseExistingServer: !process.env.CI,
    timeout: 30000,
  },
});
