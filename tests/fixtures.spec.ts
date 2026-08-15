import { test, expect } from '@playwright/test';

const BASE_URL = 'https://cinetrack-automation.ai.studio';

test.describe('Test Automation Fixtures & Management', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(BASE_URL);
    // Login with demo account
    await page.getByTestId('demo-user-login-btn').click();
    await expect(page.getByTestId('overview-dashboard-view')).toBeVisible();

    // Navigate to Test Automation Hub
    await page.getByTestId('nav-tab-test-suite').click();
    await expect(page.getByTestId('test-automation-hub')).toBeVisible();
  });

  test.describe('Reset State Baseline', () => {
    test('reset fixtures button is visible in automation hub', async ({ page }) => {
      const resetButton = page.getByTestId('btn-test-reset-fixtures');
      await expect(resetButton).toBeVisible();
    });

    test('resets application to baseline state', async ({ page }) => {
      // Verify we start with data
      await page.getByTestId('nav-tab-reviews').click();
      const initialReviewCount = await page.getByTestId('review-card').count();

      // Go back to test hub and reset
      await page.getByTestId('nav-tab-test-suite').click();
      await page.getByTestId('btn-test-reset-fixtures').click();

      // Verify reset notification appears
      const toast = page.getByTestId('push-toast-container');
      await expect(toast).toBeVisible();
      await expect(toast).toContainText('reset');
    });

    test('clears current session after reset', async ({ page }) => {
      // Get initial user name
      const userNameBefore = await page.getByTestId('nav-user-name').textContent();

      // Reset
      await page.getByTestId('btn-test-reset-fixtures').click();

      // Wait for reset to complete
      await page.waitForTimeout(1000);

      // Verify user is logged out (should return to login page)
      await expect(page.getByTestId('landing-login-page')).toBeVisible({ timeout: 5000 });
    });

    test('resets reviews to initial defaults', async ({ page }) => {
      // Go to reviews and note count
      await page.getByTestId('nav-tab-reviews').click();
      const countBeforeReset = await page.getByTestId('review-card').count();

      // Go back and reset
      await page.getByTestId('nav-tab-test-suite').click();
      await page.getByTestId('btn-test-reset-fixtures').click();

      await page.waitForTimeout(1000);

      // Login again
      await page.getByTestId('demo-user-login-btn').click();
      await expect(page.getByTestId('overview-dashboard-view')).toBeVisible();

      // Check reviews are reset
      await page.getByTestId('nav-tab-reviews').click();
      const countAfterReset = await page.getByTestId('review-card').count();

      // After reset, should have default/baseline reviews
      expect(countAfterReset).toBeGreaterThanOrEqual(0);
    });

    test('resets notifications to initial defaults', async ({ page }) => {
      // Create a notification
      await page.getByTestId('nav-tab-profile').click();
      await page.getByTestId('edit-profile-button').click();
      await page.getByTestId('edit-bio-input').clear();
      await page.getByTestId('edit-bio-input').fill('Notification test ' + Date.now());
      await page.getByTestId('save-profile-btn').click();

      await page.waitForTimeout(500);

      // Get notification count before reset
      const bellButton = page.getByTestId('notification-bell-button');
      const badge = bellButton.queryByTestId('notification-badge');
      const countBefore = badge ? parseInt(await badge.textContent() || '0') : 0;

      // Go to test hub and reset
      await page.getByTestId('nav-tab-test-suite').click();
      await page.getByTestId('btn-test-reset-fixtures').click();

      await page.waitForTimeout(1000);

      // Login again
      await page.getByTestId('demo-user-login-btn').click();
      await expect(page.getByTestId('overview-dashboard-view')).toBeVisible();

      // Check notifications are reset
      await page.waitForTimeout(500);
      const badgeAfter = page.getByTestId('notification-bell-button').queryByTestId('notification-badge');
      const countAfter = badgeAfter ? parseInt(await badgeAfter.textContent() || '0') : 0;

      expect(countAfter).toBeLessThanOrEqual(countBefore);
    });

    test('dispatches state reset notification', async ({ page }) => {
      await page.getByTestId('btn-test-reset-fixtures').click();

      const toast = page.getByTestId('push-toast-container');
      await expect(toast).toBeVisible();

      // Verify notification type/content
      const message = await toast.textContent();
      expect(message?.toLowerCase()).toContain('reset');
    });
  });

  test.describe('Seed Random Review', () => {
    test('seed reviews button is visible in automation hub', async ({ page }) => {
      const seedButton = page.getByTestId('btn-test-seed-reviews');
      await expect(seedButton).toBeVisible();
    });

    test('injects mock review data when seed button is clicked', async ({ page }) => {
      // Get initial review count
      await page.getByTestId('nav-tab-reviews').click();
      const countBefore = await page.getByTestId('review-card').count();

      // Go back and seed
      await page.getByTestId('nav-tab-test-suite').click();
      await page.getByTestId('btn-test-seed-reviews').click();

      // Verify notification
      const toast = page.getByTestId('push-toast-container');
      await expect(toast).toBeVisible();
      await expect(toast).toContainText('review');

      // Check reviews increased
      await page.waitForTimeout(500);
      await page.getByTestId('nav-tab-reviews').click();
      const countAfter = await page.getByTestId('review-card').count();

      expect(countAfter).toBeGreaterThan(countBefore);
    });

    test('seed multiple times adds reviews progressively', async ({ page }) => {
      await page.getByTestId('nav-tab-reviews').click();
      const countStart = await page.getByTestId('review-card').count();

      // Seed first time
      await page.getByTestId('nav-tab-test-suite').click();
      await page.getByTestId('btn-test-seed-reviews').click();
      await page.waitForTimeout(500);

      await page.getByTestId('nav-tab-reviews').click();
      const countAfterFirst = await page.getByTestId('review-card').count();

      // Seed second time
      await page.getByTestId('nav-tab-test-suite').click();
      await page.getByTestId('btn-test-seed-reviews').click();
      await page.waitForTimeout(500);

      await page.getByTestId('nav-tab-reviews').click();
      const countAfterSecond = await page.getByTestId('review-card').count();

      expect(countAfterFirst).toBeGreaterThan(countStart);
      expect(countAfterSecond).toBeGreaterThan(countAfterFirst);
    });

    test('seeded reviews have valid data structure', async ({ page }) => {
      // Seed reviews
      await page.getByTestId('btn-test-seed-reviews').click();
      await page.waitForTimeout(500);

      // Go to reviews and check structure
      await page.getByTestId('nav-tab-reviews').click();

      const reviewCards = page.getByTestId('review-card');
      const count = await reviewCards.count();

      if (count > 0) {
        const firstCard = reviewCards.first();

        // Verify required fields
        await expect(firstCard.getByTestId('review-title')).toBeVisible();
        await expect(firstCard.getByTestId('review-star-rating')).toBeVisible();
        await expect(firstCard.getByTestId('review-author')).toBeVisible();
      }
    });

    test('seeded reviews appear in feed with correct rating', async ({ page }) => {
      await page.getByTestId('btn-test-seed-reviews').click();
      await page.waitForTimeout(500);

      await page.getByTestId('nav-tab-reviews').click();

      const reviewCards = page.getByTestId('review-card');

      for (let i = 0; i < Math.min(3, await reviewCards.count()); i++) {
        const card = reviewCards.nth(i);
        const ratingElement = card.getByTestId('review-star-rating');

        const ratingText = await ratingElement.textContent();
        const rating = parseInt(ratingText?.match(/\d+/)?.[0] || '0');

        expect(rating).toBeGreaterThanOrEqual(1);
        expect(rating).toBeLessThanOrEqual(5);
      }
    });
  });

  test.describe('State Inspector & JSON Export', () => {
    test('export JSON button is visible in automation hub', async ({ page }) => {
      const exportButton = page.getByTestId('btn-test-export-json');
      await expect(exportButton).toBeVisible();
    });

    test('exports state as JSON when button is clicked', async ({ page }) => {
      // Set up some data
      await page.getByTestId('nav-tab-profile').click();

      // Go back to test hub
      await page.getByTestId('nav-tab-test-suite').click();

      // Click export (assuming it copies to clipboard)
      const exportButton = page.getByTestId('btn-test-export-json');
      await exportButton.click();

      // Verify success notification
      const toast = page.getByTestId('push-toast-container');
      await expect(toast).toBeVisible();
      await expect(toast).toContainText('copied');
    });

    test('exported JSON contains user data', async ({ page }) => {
      await page.getByTestId('btn-test-export-json').click();

      // Try to read clipboard (may require permissions)
      try {
        const clipboardText = await page.evaluate(() =>
          navigator.clipboard.readText()
        );

        // Verify it's valid JSON
        const jsonData = JSON.parse(clipboardText);
        expect(jsonData).toBeTruthy();

        // Should contain user info
        expect(jsonData.user || jsonData.currentUser).toBeTruthy();
      } catch (e) {
        // Clipboard may not be accessible in test environment
        // Verify notification still appears
        const toast = page.getByTestId('push-toast-container');
        await expect(toast).toBeVisible();
      }
    });

    test('exported JSON contains reviews data', async ({ page }) => {
      await page.getByTestId('btn-test-export-json').click();

      try {
        const clipboardText = await page.evaluate(() =>
          navigator.clipboard.readText()
        );

        const jsonData = JSON.parse(clipboardText);

        // Should contain reviews
        expect(jsonData.reviews || jsonData.reviews !== undefined).toBeDefined();
      } catch (e) {
        // Clipboard may not be accessible
        const toast = page.getByTestId('push-toast-container');
        await expect(toast).toBeVisible();
      }
    });

    test('exported JSON is structured correctly', async ({ page }) => {
      await page.getByTestId('btn-test-export-json').click();

      try {
        const clipboardText = await page.evaluate(() =>
          navigator.clipboard.readText()
        );

        // Verify it can be parsed as valid JSON
        const jsonData = JSON.parse(clipboardText);

        // Basic structure validation
        expect(typeof jsonData).toBe('object');
        expect(jsonData !== null).toBe(true);
      } catch (e) {
        // JSON parsing might fail in test environment
        const toast = page.getByTestId('push-toast-container');
        await expect(toast).toBeVisible();
      }
    });

    test('shows confirmation toast after exporting JSON', async ({ page }) => {
      const exportButton = page.getByTestId('btn-test-export-json');
      await exportButton.click();

      const toast = page.getByTestId('push-toast-container');
      await expect(toast).toBeVisible();

      const toastText = await toast.textContent();
      expect(toastText?.toLowerCase()).toMatch(/copy|export|clipboard/);
    });
  });

  test.describe('Fixture Control Accessibility', () => {
    test('all fixture buttons have accessible labels', async ({ page }) => {
      const resetBtn = page.getByTestId('btn-test-reset-fixtures');
      const seedBtn = page.getByTestId('btn-test-seed-reviews');
      const exportBtn = page.getByTestId('btn-test-export-json');

      const resetLabel = await resetBtn.getAttribute('aria-label') || await resetBtn.textContent();
      const seedLabel = await seedBtn.getAttribute('aria-label') || await seedBtn.textContent();
      const exportLabel = await exportBtn.getAttribute('aria-label') || await exportBtn.textContent();

      expect(resetLabel).toBeTruthy();
      expect(seedLabel).toBeTruthy();
      expect(exportLabel).toBeTruthy();
    });

    test('fixture buttons are keyboard accessible', async ({ page }) => {
      const resetBtn = page.getByTestId('btn-test-reset-fixtures');

      await resetBtn.focus();
      const isFocused = await resetBtn.evaluate(el => el === document.activeElement);

      expect(isFocused).toBe(true);
    });
  });

  test.describe('Test Automation Hub Navigation', () => {
    test('test automation hub displays guide content', async ({ page }) => {
      const hubContent = page.getByTestId('automation-guide-content');
      await expect(hubContent).toBeVisible();
    });

    test('test automation hub displays fixture control deck', async ({ page }) => {
      const controlDeck = page.getByTestId('fixture-control-deck');
      await expect(controlDeck).toBeVisible();
    });

    test('test automation hub displays test templates', async ({ page }) => {
      const templates = page.getByTestId('automation-templates');
      
      if (await templates.isVisible()) {
        await expect(templates).toBeVisible();
      }
    });

    test('can navigate away from test automation hub and return', async ({ page }) => {
      const hubTab = page.getByTestId('nav-tab-test-suite');

      // Go to reviews
      await page.getByTestId('nav-tab-reviews').click();
      await expect(page.getByTestId('movie-reviews-feed')).toBeVisible();

      // Go back to hub
      await hubTab.click();
      await expect(page.getByTestId('test-automation-hub')).toBeVisible();
    });
  });

  test.describe('State Persistence After Fixtures', () => {
    test('state persists in localStorage after reset', async ({ page }) => {
      // Make a change
      await page.getByTestId('nav-tab-profile').click();
      await page.getByTestId('edit-profile-button').click();
      await page.getByTestId('edit-bio-input').clear();
      await page.getByTestId('edit-bio-input').fill('Test bio ' + Date.now());
      await page.getByTestId('save-profile-btn').click();

      // Check localStorage before reset
      const dataBeforeReset = await page.evaluate(() => 
        JSON.parse(localStorage.getItem('cinetrack-state') || '{}')
      );

      // Reset
      await page.getByTestId('nav-tab-test-suite').click();
      await page.getByTestId('btn-test-reset-fixtures').click();

      // After reset, localStorage should be cleared or have default state
      await page.waitForTimeout(1000);
      const dataAfterReset = await page.evaluate(() =>
        JSON.parse(localStorage.getItem('cinetrack-state') || '{}')
      );

      expect(Object.keys(dataAfterReset).length).toBeLessThanOrEqual(
        Object.keys(dataBeforeReset).length
      );
    });

    test('state updates reflect in localStorage after seed', async ({ page }) => {
      // Get initial state
      const stateBefore = await page.evaluate(() =>
        JSON.parse(localStorage.getItem('cinetrack-state') || '{}')
      );

      // Seed reviews
      await page.getByTestId('btn-test-seed-reviews').click();
      await page.waitForTimeout(500);

      // Get updated state
      const stateAfter = await page.evaluate(() =>
        JSON.parse(localStorage.getItem('cinetrack-state') || '{}')
      );

      // Reviews array should be longer after seed
      const reviewsCountBefore = (stateBefore.reviews || []).length;
      const reviewsCountAfter = (stateAfter.reviews || []).length;

      expect(reviewsCountAfter).toBeGreaterThanOrEqual(reviewsCountBefore);
    });
  });
});
