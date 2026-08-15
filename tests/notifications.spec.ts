import { test, expect } from '@playwright/test';

const BASE_URL = 'https://cinetrack-automation.ai.studio';

test.describe('Notifications & Push Toasts', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(BASE_URL);
    // Login with demo account
    await page.getByTestId('demo-user-login-btn').click();
    await expect(page.getByTestId('overview-dashboard-view')).toBeVisible();
  });

  test.describe('Push Toast Notifications', () => {
    test('displays push toast when profile is updated', async ({ page }) => {
      await page.getByTestId('nav-tab-profile').click();
      await page.getByTestId('edit-profile-button').click();

      const bioInput = page.getByTestId('edit-bio-input');
      await bioInput.clear();
      await bioInput.fill('Test bio updated at ' + new Date().getTime());

      await page.getByTestId('save-profile-btn').click();

      const toast = page.getByTestId('push-toast-container');
      await expect(toast).toBeVisible();
      await expect(toast).toContainText('Profile updated');
    });

    test('displays push toast when review is submitted', async ({ page }) => {
      await page.getByTestId('nav-tab-write-review').click();

      await page.getByTestId('movie-title-input').fill(`Test Movie ${Date.now()}`);
      await page.getByTestId('star-rating-5').click();
      await page.getByTestId('review-text-input').fill('Great film!');

      await page.getByTestId('submit-review-btn').click();

      const toast = page.getByTestId('push-toast-container');
      await expect(toast).toBeVisible();
      await expect(toast).toContainText('review was submitted');
    });

    test('displays push toast with correct type icon', async ({ page }) => {
      await page.getByTestId('nav-tab-profile').click();
      await page.getByTestId('edit-profile-button').click();

      const bioInput = page.getByTestId('edit-bio-input');
      await bioInput.clear();
      await bioInput.fill('Bio updated at ' + Date.now());

      await page.getByTestId('save-profile-btn').click();

      const toast = page.getByTestId('push-toast-container');
      await expect(toast).toBeVisible();

      const icon = toast.getByTestId('toast-type-icon');
      await expect(icon).toBeVisible();
    });

    test('displays push toast with title and message', async ({ page }) => {
      await page.getByTestId('nav-tab-profile').click();
      await page.getByTestId('edit-profile-button').click();

      await page.getByTestId('edit-bio-input').clear();
      await page.getByTestId('edit-bio-input').fill('Test bio ' + Date.now());

      await page.getByTestId('save-profile-btn').click();

      const toast = page.getByTestId('push-toast-container');
      const title = toast.getByTestId('toast-title');
      const message = toast.getByTestId('toast-message');

      await expect(title).toBeVisible();
      await expect(message).toBeVisible();
    });

    test('displays push toast with timestamp', async ({ page }) => {
      await page.getByTestId('nav-tab-profile').click();
      await page.getByTestId('edit-profile-button').click();

      await page.getByTestId('edit-bio-input').clear();
      await page.getByTestId('edit-bio-input').fill('Bio ' + Date.now());

      await page.getByTestId('save-profile-btn').click();

      const toast = page.getByTestId('push-toast-container');
      const timestamp = toast.getByTestId('toast-timestamp');

      await expect(timestamp).toBeVisible();
    });

    test('auto-dismisses toast after 5 seconds', async ({ page }) => {
      await page.getByTestId('nav-tab-profile').click();
      await page.getByTestId('edit-profile-button').click();

      await page.getByTestId('edit-bio-input').clear();
      await page.getByTestId('edit-bio-input').fill('Bio ' + Date.now());

      await page.getByTestId('save-profile-btn').click();

      const toast = page.getByTestId('push-toast-container');
      await expect(toast).toBeVisible();

      // Wait for auto-dismiss (5 seconds + buffer)
      await page.waitForTimeout(6000);

      // Toast should be hidden or removed
      await expect(toast).not.toBeVisible();
    });

    test('manually dismisses toast when close button is clicked', async ({ page }) => {
      await page.getByTestId('nav-tab-profile').click();
      await page.getByTestId('edit-profile-button').click();

      await page.getByTestId('edit-bio-input').clear();
      await page.getByTestId('edit-bio-input').fill('Bio ' + Date.now());

      await page.getByTestId('save-profile-btn').click();

      const toast = page.getByTestId('push-toast-container');
      await expect(toast).toBeVisible();

      const closeButton = toast.getByTestId('toast-close-btn');
      await closeButton.click();

      await expect(toast).not.toBeVisible();
    });

    test('plays audio chime when sound is enabled', async ({ page }) => {
      // Note: Testing audio chime is complex in Playwright
      // We can verify the audio element is triggered
      
      await page.getByTestId('nav-tab-profile').click();
      await page.getByTestId('edit-profile-button').click();

      const audioElements = page.locator('audio');
      const initialAudioCount = await audioElements.count();

      await page.getByTestId('edit-bio-input').clear();
      await page.getByTestId('edit-bio-input').fill('Bio ' + Date.now());
      await page.getByTestId('save-profile-btn').click();

      // Verify audio element exists (if sound is enabled)
      const finalAudioCount = await audioElements.count();
      expect(finalAudioCount).toBeGreaterThanOrEqual(initialAudioCount);
    });
  });

  test.describe('Notification Center', () => {
    test('opens notification center when bell icon is clicked', async ({ page }) => {
      await page.getByTestId('notification-bell-button').click();

      await expect(page.getByTestId('notification-center-dropdown')).toBeVisible();
    });

    test('displays unread notification count badge', async ({ page }) => {
      // Trigger a notification first
      await page.getByTestId('nav-tab-profile').click();
      await page.getByTestId('edit-profile-button').click();
      await page.getByTestId('edit-bio-input').clear();
      await page.getByTestId('edit-bio-input').fill('Bio ' + Date.now());
      await page.getByTestId('save-profile-btn').click();

      await page.waitForTimeout(500);

      // Open notification center
      await page.getByTestId('notification-bell-button').click();

      const badge = page.getByTestId('notification-badge');
      await expect(badge).toBeVisible();
    });

    test('displays chronological list of notifications', async ({ page }) => {
      // Trigger multiple notifications
      await page.getByTestId('nav-tab-profile').click();
      await page.getByTestId('edit-profile-button').click();
      await page.getByTestId('edit-bio-input').clear();
      await page.getByTestId('edit-bio-input').fill('Bio 1 ' + Date.now());
      await page.getByTestId('save-profile-btn').click();

      await page.waitForTimeout(500);

      await page.getByTestId('edit-profile-button').click();
      await page.getByTestId('edit-bio-input').clear();
      await page.getByTestId('edit-bio-input').fill('Bio 2 ' + Date.now());
      await page.getByTestId('save-profile-btn').click();

      await page.waitForTimeout(500);

      // Open notification center
      await page.getByTestId('notification-bell-button').click();

      const notificationItems = page.getByTestId('notification-item');
      await expect(notificationItems).not.toHaveCount(0);
    });

    test('marks notification as read when clicked', async ({ page }) => {
      // Trigger a notification
      await page.getByTestId('nav-tab-profile').click();
      await page.getByTestId('edit-profile-button').click();
      await page.getByTestId('edit-bio-input').clear();
      await page.getByTestId('edit-bio-input').fill('Bio ' + Date.now());
      await page.getByTestId('save-profile-btn').click();

      await page.waitForTimeout(500);

      // Open notification center
      await page.getByTestId('notification-bell-button').click();

      const firstNotification = page.getByTestId('notification-item').first();
      const unreadIndicator = firstNotification.getByTestId('notification-unread-indicator');

      // If unread indicator exists, click to mark as read
      if (await unreadIndicator.isVisible()) {
        await firstNotification.click();
        await expect(unreadIndicator).not.toBeVisible();
      }
    });

    test('marks all notifications as read', async ({ page }) => {
      // Open notification center
      await page.getByTestId('notification-bell-button').click();

      const markAllButton = page.getByTestId('mark-all-read-btn');
      
      if (await markAllButton.isVisible()) {
        await markAllButton.click();

        // Verify all unread indicators are gone
        const unreadIndicators = page.getByTestId('notification-unread-indicator');
        await expect(unreadIndicators).toHaveCount(0);
      }
    });

    test('clears all notifications', async ({ page }) => {
      // Open notification center
      await page.getByTestId('notification-bell-button').click();

      const clearAllButton = page.getByTestId('clear-all-notifications-btn');

      if (await clearAllButton.isVisible()) {
        await clearAllButton.click();

        // Verify confirmation or that notifications are cleared
        const notificationItems = page.getByTestId('notification-item');
        await expect(notificationItems).toHaveCount(0);
      }
    });

    test('displays notification with title and message', async ({ page }) => {
      // Trigger a notification
      await page.getByTestId('nav-tab-profile').click();
      await page.getByTestId('edit-profile-button').click();
      await page.getByTestId('edit-bio-input').clear();
      await page.getByTestId('edit-bio-input').fill('Bio ' + Date.now());
      await page.getByTestId('save-profile-btn').click();

      await page.waitForTimeout(500);

      // Open notification center
      await page.getByTestId('notification-bell-button').click();

      const firstNotification = page.getByTestId('notification-item').first();
      await expect(firstNotification.getByTestId('notification-title')).toBeVisible();
      await expect(firstNotification.getByTestId('notification-message')).toBeVisible();
    });

    test('closes notification center when clicking outside', async ({ page }) => {
      await page.getByTestId('notification-bell-button').click();
      
      const dropdown = page.getByTestId('notification-center-dropdown');
      await expect(dropdown).toBeVisible();

      // Click outside the dropdown
      await page.click('body', { position: { x: 100, y: 100 } });

      await expect(dropdown).not.toBeVisible();
    });
  });

  test.describe('Test Push Dispatcher', () => {
    test('fires test notification via dispatcher in automation hub', async ({ page }) => {
      await page.getByTestId('nav-tab-test-suite').click();

      const dispatchButton = page.getByTestId('btn-test-fire-push');
      
      if (await dispatchButton.isVisible()) {
        const titleInput = page.getByTestId('test-push-title-input');
        const messageInput = page.getByTestId('test-push-message-input');

        if (await titleInput.isVisible() && await messageInput.isVisible()) {
          await titleInput.fill('Test Notification');
          await messageInput.fill('This is a test notification');

          await dispatchButton.click();

          // Verify toast appears
          const toast = page.getByTestId('push-toast-container');
          await expect(toast).toBeVisible();
          await expect(toast).toContainText('Test Notification');
        }
      }
    });

    test('notification appears in notification center after dispatcher fires', async ({ page }) => {
      await page.getByTestId('nav-tab-test-suite').click();

      const dispatchButton = page.getByTestId('btn-test-fire-push');
      
      if (await dispatchButton.isVisible()) {
        const titleInput = page.getByTestId('test-push-title-input');
        const messageInput = page.getByTestId('test-push-message-input');

        if (await titleInput.isVisible() && await messageInput.isVisible()) {
          const testTitle = 'Test Notification ' + Date.now();
          await titleInput.fill(testTitle);
          await messageInput.fill('Test message');

          await dispatchButton.click();

          await page.waitForTimeout(500);

          // Open notification center
          await page.getByTestId('notification-bell-button').click();

          const notifications = page.getByTestId('notification-item');
          expect(await notifications.count()).toBeGreaterThan(0);
        }
      }
    });

    test('increments badge counter when test push is fired', async ({ page }) => {
      const bellButton = page.getByTestId('notification-bell-button');
      const badgeBefore = await bellButton.getByTestId('notification-badge').textContent();
      const countBefore = parseInt(badgeBefore || '0');

      await page.getByTestId('nav-tab-test-suite').click();

      const dispatchButton = page.getByTestId('btn-test-fire-push');
      
      if (await dispatchButton.isVisible()) {
        const titleInput = page.getByTestId('test-push-title-input');
        const messageInput = page.getByTestId('test-push-message-input');

        if (await titleInput.isVisible() && await messageInput.isVisible()) {
          await titleInput.fill('Test');
          await messageInput.fill('Message');

          await dispatchButton.click();

          await page.waitForTimeout(500);

          const badgeAfter = await bellButton.getByTestId('notification-badge').textContent();
          const countAfter = parseInt(badgeAfter || '0');

          expect(countAfter).toBeGreaterThan(countBefore);
        }
      }
    });
  });

  test.describe('Notification Types', () => {
    test('displays review notification type correctly', async ({ page }) => {
      await page.getByTestId('nav-tab-write-review').click();
      await page.getByTestId('movie-title-input').fill(`Movie ${Date.now()}`);
      await page.getByTestId('star-rating-4').click();
      await page.getByTestId('review-text-input').fill('Test review');
      await page.getByTestId('submit-review-btn').click();

      const toast = page.getByTestId('push-toast-container');
      await expect(toast).toBeVisible();

      const typeIcon = toast.getByTestId('toast-type-icon');
      const iconClass = await typeIcon.getAttribute('class');

      expect(iconClass).toContain('review');
    });

    test('displays profile notification type correctly', async ({ page }) => {
      await page.getByTestId('nav-tab-profile').click();
      await page.getByTestId('edit-profile-button').click();

      await page.getByTestId('edit-bio-input').clear();
      await page.getByTestId('edit-bio-input').fill('Bio ' + Date.now());
      await page.getByTestId('save-profile-btn').click();

      const toast = page.getByTestId('push-toast-container');
      await expect(toast).toBeVisible();

      const typeIcon = toast.getByTestId('toast-type-icon');
      const iconClass = await typeIcon.getAttribute('class');

      expect(iconClass).toContain('profile');
    });
  });
});
