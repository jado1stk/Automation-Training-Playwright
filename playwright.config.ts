import { defineConfig, devices } from '@playwright/test';

/**
 * Configuration can be overridden with environment variables:
 * - BASE_URL: The base URL for tests (default: http://localhost:3001)
 * - HEADED: Set to 'true' to run tests in headed mode (default: headless)
 * 
 * Examples:
 * - Local testing: npx playwright test
 * - AI Studio testing: BASE_URL=https://cinetrack-automation.ai.studio npx playwright test
 * - Headed mode: HEADED=true npx playwright test
 */

const baseURL = process.env.BASE_URL || 'http://localhost:3001';
const headless = !process.env.HEADED || process.env.HEADED !== 'true';

export default defineConfig({
  testDir: './tests',
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : 1,
  
  timeout: 30000,
  expect: {
    timeout: 10000,
  },

  use: {
    baseURL: baseURL,
    headless: headless,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
  ],

  webServer: process.env.BASE_URL ? undefined : {
    command: 'npm run dev',
    url: 'http://localhost:3001',
    reuseExistingServer: !process.env.CI,
    timeout: 120000,
  },

  reporter: [
    ['html'],
    ['json', { outputFile: 'test-results/results.json' }],
    ['junit', { outputFile: 'test-results/junit.xml' }],
    ['list'],
  ],

  outputDir: 'test-results/output',
});
