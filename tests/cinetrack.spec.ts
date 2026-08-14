import { test, expect } from '@playwright/test';

const DEMO_EMAIL = 'alex.rivera@example.com';
const DEMO_PASSWORD = 'demo1234';

test.describe('CineTrack login page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3000');
    await expect(page.getByTestId('landing-login-page')).toBeVisible();
    await expect(page.getByTestId('login-form')).toBeVisible();
  });

  test('logs in successfully with the demo credentials', async ({ page }) => {
    await page.getByTestId('login-email-input').fill(DEMO_EMAIL);
    await page.getByTestId('login-password-input').fill(DEMO_PASSWORD);

    await page.getByTestId('login-submit-button').click();

    await expect(page.getByTestId('overview-dashboard-view')).toBeVisible();
    await expect(page.getByTestId('hero-greeting-title')).toContainText('Welcome back, Alex Rivera');
  });

  test('allows the quick demo sign-in action', async ({ page }) => {
    await page.getByTestId('demo-user-login-btn').click();

    await expect(page.getByTestId('overview-dashboard-view')).toBeVisible();
    await expect(page.getByTestId('hero-greeting-title')).toContainText('Welcome back, Alex Rivera');
  });

  test('displays an error when invalid credentials are entered', async ({ page }) => {
    await page.getByTestId('login-email-input').fill('wrong.user@example.com');
    await page.getByTestId('login-password-input').fill('wrongpass');

    await page.getByTestId('login-submit-button').click();

    await expect(page.getByTestId('login-error-banner')).toBeVisible();
    await expect(page.getByTestId('login-error-banner')).toContainText('User not found');
  });
});
