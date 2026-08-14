import { test, expect } from '@playwright/test';

const DEMO_EMAIL = 'alex.rivera@example.com';
const DEMO_PASSWORD = 'demo1234';

test.describe('CineTrack login page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
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

  test('uses native browser validation when the email is empty', async ({ page }) => {
    const emailInput = page.getByTestId('login-email-input');
    await page.getByTestId('login-password-input').fill(DEMO_PASSWORD);
    await expect(emailInput).toHaveAttribute('required', '');

    await page.getByTestId('login-submit-button').click();

    await expect(page.getByTestId('overview-dashboard-view')).toHaveCount(0);
    await expect(page.getByTestId('login-error-banner')).toHaveCount(0);
  });

  test('shows a validation error when the email does not exist', async ({ page }) => {
    await page.getByTestId('login-email-input').fill('missing.user@example.com');
    await page.getByTestId('login-password-input').fill('any-password');
    await page.getByTestId('login-submit-button').click();

    await expect(page.getByTestId('login-error-banner')).toBeVisible();
    await expect(page.getByTestId('login-error-banner')).toContainText('User not found with this email');
  });

  test('accepts case-insensitive and whitespace-padded email input', async ({ page }) => {
    await page.getByTestId('login-email-input').fill(`  ${DEMO_EMAIL.toUpperCase()}  `);
    await page.getByTestId('login-password-input').fill(DEMO_PASSWORD);
    await page.getByTestId('login-submit-button').click();

    await expect(page.getByTestId('overview-dashboard-view')).toBeVisible();
    await expect(page.getByTestId('hero-greeting-title')).toContainText('Welcome back, Alex Rivera');
  });

  test('keeps the password field masked and the remember-me checkbox toggles', async ({ page }) => {
    const passwordInput = page.getByTestId('login-password-input');
    const rememberMe = page.getByTestId('login-remember-me-checkbox');

    await passwordInput.fill(DEMO_PASSWORD);
    await expect(passwordInput).toHaveAttribute('type', 'password');

    await expect(rememberMe).toBeChecked();
    await rememberMe.uncheck();
    await expect(rememberMe).not.toBeChecked();
  });

  test('fills the demo email when the helper link is used', async ({ page }) => {
    await page.getByTestId('forgot-password-link').click();

    await expect(page.getByTestId('login-email-input')).toHaveValue(DEMO_EMAIL);
  });

  test('shows the demo account details in the landing page', async ({ page }) => {
    await expect(page.getByText('alex.rivera@example.com / demo1234')).toBeVisible();
    await expect(page.getByTestId('demo-user-login-btn')).toContainText('1-Click Demo Sign In');
  });
});
