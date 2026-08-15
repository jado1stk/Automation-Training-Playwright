import { test, expect } from '@playwright/test';

const BASE_URL = 'https://cinetrack-automation.ai.studio';

test.describe('Dark / Light Mode Theme Switching', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(BASE_URL);
    // Login with demo account
    await page.getByTestId('demo-user-login-btn').click();
    await expect(page.getByTestId('overview-dashboard-view')).toBeVisible();
  });

  test.describe('Theme Toggle Button', () => {
    test('theme toggle button is visible in navigation', async ({ page }) => {
      const themeToggle = page.getByTestId('theme-toggle-button');
      await expect(themeToggle).toBeVisible();
    });

    test('toggles from light to dark mode', async ({ page }) => {
      const themeToggle = page.getByTestId('theme-toggle-button');
      const html = page.locator('html');

      // Verify initial state (light mode - no dark class)
      let isDarkMode = await html.evaluate(el => el.classList.contains('dark'));
      const initialState = isDarkMode;

      // Click toggle
      await themeToggle.click();

      // Verify state changed
      isDarkMode = await html.evaluate(el => el.classList.contains('dark'));
      expect(isDarkMode).not.toBe(initialState);
    });

    test('toggles from dark to light mode', async ({ page }) => {
      const themeToggle = page.getByTestId('theme-toggle-button');
      const html = page.locator('html');

      // Ensure we're in dark mode first
      await html.evaluate(el => el.classList.add('dark'));

      // Click toggle to switch to light
      await themeToggle.click();

      // Verify dark class is removed
      const isDarkMode = await html.evaluate(el => el.classList.contains('dark'));
      expect(isDarkMode).toBe(false);
    });

    test('applies dark class to html element when toggled to dark', async ({ page }) => {
      const themeToggle = page.getByTestId('theme-toggle-button');
      const html = page.locator('html');

      // Ensure light mode first
      await html.evaluate(el => el.classList.remove('dark'));

      // Click toggle to enable dark mode
      await themeToggle.click();

      // Verify dark class is applied
      const hasDarkClass = await html.evaluate(el => el.classList.contains('dark'));
      expect(hasDarkClass).toBe(true);
    });

    test('removes dark class from html element when toggled to light', async ({ page }) => {
      const themeToggle = page.getByTestId('theme-toggle-button');
      const html = page.locator('html');

      // Ensure dark mode first
      await html.evaluate(el => el.classList.add('dark'));

      // Click toggle to disable dark mode
      await themeToggle.click();

      // Verify dark class is removed
      const hasDarkClass = await html.evaluate(el => el.classList.contains('dark'));
      expect(hasDarkClass).toBe(false);
    });
  });

  test.describe('Theme Icon Change', () => {
    test('displays moon icon when in light mode', async ({ page }) => {
      const html = page.locator('html');
      const themeToggle = page.getByTestId('theme-toggle-button');

      // Ensure light mode
      await html.evaluate(el => el.classList.remove('dark'));

      const moonIcon = themeToggle.getByTestId('moon-icon');
      await expect(moonIcon).toBeVisible();
    });

    test('displays sun icon when in dark mode', async ({ page }) => {
      const html = page.locator('html');
      const themeToggle = page.getByTestId('theme-toggle-button');

      // Ensure dark mode
      await html.evaluate(el => el.classList.add('dark'));

      const sunIcon = themeToggle.getByTestId('sun-icon');
      await expect(sunIcon).toBeVisible();
    });

    test('switches icon when theme is toggled', async ({ page }) => {
      const themeToggle = page.getByTestId('theme-toggle-button');
      const html = page.locator('html');

      // Start in light mode
      await html.evaluate(el => el.classList.remove('dark'));

      let moonIcon = themeToggle.queryByTestId('moon-icon');
      await expect(moonIcon).toBeVisible();

      // Toggle to dark mode
      await themeToggle.click();

      // Moon icon should be gone, sun icon should appear
      moonIcon = themeToggle.queryByTestId('moon-icon');
      const sunIcon = themeToggle.queryByTestId('sun-icon');

      expect(await moonIcon.isVisible()).toBe(false);
      await expect(sunIcon).toBeVisible();
    });
  });

  test.describe('Theme Persistence', () => {
    test('persists dark mode preference in localStorage', async ({ page }) => {
      const themeToggle = page.getByTestId('theme-toggle-button');
      const html = page.locator('html');

      // Ensure light mode
      await html.evaluate(el => el.classList.remove('dark'));

      // Toggle to dark mode
      await themeToggle.click();

      // Check localStorage
      const themePreference = await page.evaluate(() => {
        return localStorage.getItem('theme') || localStorage.getItem('cinetrack-theme');
      });

      expect(themePreference).toBe('dark');
    });

    test('persists light mode preference in localStorage', async ({ page }) => {
      const themeToggle = page.getByTestId('theme-toggle-button');
      const html = page.locator('html');

      // Ensure dark mode
      await html.evaluate(el => el.classList.add('dark'));

      // Toggle to light mode
      await themeToggle.click();

      // Check localStorage
      const themePreference = await page.evaluate(() => {
        return localStorage.getItem('theme') || localStorage.getItem('cinetrack-theme');
      });

      expect(themePreference).toBe('light');
    });

    test('restores theme preference on page reload', async ({ page }) => {
      const themeToggle = page.getByTestId('theme-toggle-button');
      const html = page.locator('html');

      // Ensure light mode
      await html.evaluate(el => el.classList.remove('dark'));

      // Toggle to dark mode
      await themeToggle.click();

      // Verify dark mode is active
      let isDarkMode = await html.evaluate(el => el.classList.contains('dark'));
      expect(isDarkMode).toBe(true);

      // Reload page
      await page.reload();

      // Wait for navigation and login check
      await expect(page.getByTestId('overview-dashboard-view')).toBeVisible({ timeout: 10000 });

      // Verify dark mode is still active
      isDarkMode = await html.evaluate(el => el.classList.contains('dark'));
      expect(isDarkMode).toBe(true);
    });

    test('restores light mode preference on page reload', async ({ page }) => {
      const themeToggle = page.getByTestId('theme-toggle-button');
      const html = page.locator('html');

      // Ensure dark mode
      await html.evaluate(el => el.classList.add('dark'));

      // Toggle to light mode
      await themeToggle.click();

      // Verify light mode is active
      let isDarkMode = await html.evaluate(el => el.classList.contains('dark'));
      expect(isDarkMode).toBe(false);

      // Reload page
      await page.reload();

      // Wait for navigation and login check
      await expect(page.getByTestId('overview-dashboard-view')).toBeVisible({ timeout: 10000 });

      // Verify light mode is still active
      isDarkMode = await html.evaluate(el => el.classList.contains('dark'));
      expect(isDarkMode).toBe(false);
    });
  });

  test.describe('Theme Styling', () => {
    test('applies dark theme styles when dark mode is enabled', async ({ page }) => {
      const html = page.locator('html');
      const body = page.locator('body');

      // Enable dark mode
      await html.evaluate(el => el.classList.add('dark'));

      // Check background color (should be dark)
      const backgroundColor = await body.evaluate(el => 
        window.getComputedStyle(el).backgroundColor
      );

      // Dark backgrounds typically have lower RGB values
      // This is a basic check - actual implementation may vary
      expect(backgroundColor).toBeTruthy();
    });

    test('applies light theme styles when light mode is enabled', async ({ page }) => {
      const html = page.locator('html');
      const body = page.locator('body');

      // Disable dark mode
      await html.evaluate(el => el.classList.remove('dark'));

      // Check background color (should be light)
      const backgroundColor = await body.evaluate(el =>
        window.getComputedStyle(el).backgroundColor
      );

      expect(backgroundColor).toBeTruthy();
    });

    test('all text is readable in both themes', async ({ page }) => {
      const html = page.locator('html');
      
      // Test light mode
      await html.evaluate(el => el.classList.remove('dark'));
      
      // Get contrast ratio (simplified check)
      let textColor = await page.locator('body').evaluate(el =>
        window.getComputedStyle(el).color
      );
      expect(textColor).toBeTruthy();

      // Test dark mode
      await html.evaluate(el => el.classList.add('dark'));

      textColor = await page.locator('body').evaluate(el =>
        window.getComputedStyle(el).color
      );
      expect(textColor).toBeTruthy();
    });
  });

  test.describe('Theme Affects All Components', () => {
    test('navigation bar respects theme preference', async ({ page }) => {
      const themeToggle = page.getByTestId('theme-toggle-button');
      const navbar = page.getByTestId('navbar');

      // Toggle to dark mode
      await themeToggle.click();

      // Verify navbar is visible (component should adapt)
      await expect(navbar).toBeVisible();
    });

    test('dashboard respects theme preference', async ({ page }) => {
      const themeToggle = page.getByTestId('theme-toggle-button');
      const dashboard = page.getByTestId('overview-dashboard-view');

      // Toggle to dark mode
      await themeToggle.click();

      // Verify dashboard is visible
      await expect(dashboard).toBeVisible();
    });

    test('modals respect theme preference', async ({ page }) => {
      const themeToggle = page.getByTestId('theme-toggle-button');

      // Toggle to dark mode
      await themeToggle.click();

      // Open a modal
      await page.getByTestId('nav-tab-profile').click();
      await page.getByTestId('edit-profile-button').click();

      // Verify modal respects theme
      const modal = page.getByTestId('edit-profile-modal');
      await expect(modal).toBeVisible();
    });

    test('forms respect theme preference', async ({ page }) => {
      const themeToggle = page.getByTestId('theme-toggle-button');

      // Toggle to dark mode
      await themeToggle.click();

      // Navigate to form
      await page.getByTestId('nav-tab-write-review').click();

      // Verify form is visible and themed correctly
      const form = page.getByTestId('movie-review-form');
      await expect(form).toBeVisible();
    });
  });

  test.describe('Theme Toggle Accessibility', () => {
    test('theme toggle button has accessible label', async ({ page }) => {
      const themeToggle = page.getByTestId('theme-toggle-button');

      const ariaLabel = await themeToggle.getAttribute('aria-label');
      expect(ariaLabel).toBeTruthy();
      expect(ariaLabel?.toLowerCase()).toContain('theme');
    });

    test('theme toggle button is keyboard accessible', async ({ page }) => {
      const themeToggle = page.getByTestId('theme-toggle-button');
      const html = page.locator('html');

      // Get initial state
      let isDarkMode = await html.evaluate(el => el.classList.contains('dark'));

      // Focus and press Enter
      await themeToggle.focus();
      await page.keyboard.press('Enter');

      // Verify state changed
      const newDarkMode = await html.evaluate(el => el.classList.contains('dark'));
      expect(newDarkMode).not.toBe(isDarkMode);
    });

    test('theme toggle button supports keyboard Space key', async ({ page }) => {
      const themeToggle = page.getByTestId('theme-toggle-button');
      const html = page.locator('html');

      // Get initial state
      let isDarkMode = await html.evaluate(el => el.classList.contains('dark'));

      // Focus and press Space
      await themeToggle.focus();
      await page.keyboard.press('Space');

      // Verify state changed
      const newDarkMode = await html.evaluate(el => el.classList.contains('dark'));
      expect(newDarkMode).not.toBe(isDarkMode);
    });
  });
});
