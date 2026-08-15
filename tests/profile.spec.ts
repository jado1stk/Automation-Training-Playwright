import { test, expect } from '@playwright/test';

const DEMO_EMAIL = 'alex.rivera@example.com';
const DEMO_PASSWORD = 'demo1234';
const BASE_URL = 'https://cinetrack-automation.ai.studio';

test.describe('User Profile Management', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(BASE_URL);
    // Login with demo account
    await page.getByTestId('demo-user-login-btn').click();
    await expect(page.getByTestId('overview-dashboard-view')).toBeVisible();
  });

  test.describe('Profile Display', () => {
    test('displays user profile with all identity details', async ({ page }) => {
      await page.getByTestId('nav-tab-profile').click();
      await expect(page.getByTestId('profile-dashboard-view')).toBeVisible();

      // Verify all identity elements are displayed
      await expect(page.getByTestId('profile-name-display')).toBeVisible();
      await expect(page.getByTestId('profile-username-display')).toBeVisible();
      await expect(page.getByTestId('profile-email-display')).toBeVisible();
      await expect(page.getByTestId('profile-avatar')).toBeVisible();
    });

    test('displays user profile statistics', async ({ page }) => {
      await page.getByTestId('nav-tab-profile').click();
      await expect(page.getByTestId('profile-dashboard-view')).toBeVisible();

      // Verify statistics cards are displayed
      await expect(page.getByTestId('stat-total-reviews')).toBeVisible();
      await expect(page.getByTestId('stat-average-rating')).toBeVisible();
      await expect(page.getByTestId('stat-recommendation-rate')).toBeVisible();
      await expect(page.getByTestId('stat-likes-received')).toBeVisible();
    });

    test('displays favorite genre badges on profile', async ({ page }) => {
      await page.getByTestId('nav-tab-profile').click();
      
      // Verify genre badges container exists
      const genreContainer = page.getByTestId('profile-genres-container');
      await expect(genreContainer).toBeVisible();
      
      // Verify at least one genre badge is displayed
      const genreBadges = page.getByTestId('genre-badge');
      await expect(genreBadges).not.toHaveCount(0);
    });
  });

  test.describe('Profile Editing', () => {
    test('opens edit profile modal when edit button is clicked', async ({ page }) => {
      await page.getByTestId('nav-tab-profile').click();
      await page.getByTestId('edit-profile-button').click();

      await expect(page.getByTestId('edit-profile-modal')).toBeVisible();
      await expect(page.getByTestId('edit-bio-input')).toBeVisible();
      await expect(page.getByTestId('save-profile-btn')).toBeVisible();
    });

    test('updates profile bio and persists changes', async ({ page }) => {
      await page.getByTestId('nav-tab-profile').click();
      await page.getByTestId('edit-profile-button').click();

      const newBio = 'Updated cinephile bio for automated testing.';
      const bioInput = page.getByTestId('edit-bio-input');
      await bioInput.clear();
      await bioInput.fill(newBio);

      await page.getByTestId('save-profile-btn').click();

      // Verify modal closes
      await expect(page.getByTestId('edit-profile-modal')).not.toBeVisible();

      // Verify bio is updated in the profile display
      await expect(page.getByTestId('profile-bio-display')).toContainText(newBio);

      // Verify toast notification appears
      await expect(page.getByTestId('push-toast-container')).toBeVisible();
      await expect(page.getByTestId('push-toast-container')).toContainText('Profile updated');
    });

    test('updates full name in profile', async ({ page }) => {
      await page.getByTestId('nav-tab-profile').click();
      await page.getByTestId('edit-profile-button').click();

      const newName = 'Alex Rivera Updated';
      await page.getByTestId('edit-name-input').clear();
      await page.getByTestId('edit-name-input').fill(newName);

      await page.getByTestId('save-profile-btn').click();

      await expect(page.getByTestId('profile-name-display')).toContainText(newName);
    });

    test('updates location in profile', async ({ page }) => {
      await page.getByTestId('nav-tab-profile').click();
      await page.getByTestId('edit-profile-button').click();

      const newLocation = 'San Francisco, CA';
      await page.getByTestId('edit-location-input').clear();
      await page.getByTestId('edit-location-input').fill(newLocation);

      await page.getByTestId('save-profile-btn').click();

      await expect(page.getByTestId('profile-location-display')).toContainText(newLocation);
    });

    test('updates website URL in profile', async ({ page }) => {
      await page.getByTestId('nav-tab-profile').click();
      await page.getByTestId('edit-profile-button').click();

      const newWebsite = 'https://example.com';
      await page.getByTestId('edit-website-input').clear();
      await page.getByTestId('edit-website-input').fill(newWebsite);

      await page.getByTestId('save-profile-btn').click();

      await expect(page.getByTestId('profile-website-display')).toContainText('example.com');
    });

    test('can toggle favorite genres in edit modal', async ({ page }) => {
      await page.getByTestId('nav-tab-profile').click();
      await page.getByTestId('edit-profile-button').click();

      // Get initial state of genre pills
      const genrePills = page.getByTestId('genre-pill');
      const initialCount = await genrePills.count();

      // Click first genre pill to toggle
      await genrePills.first().click();

      // Save changes
      await page.getByTestId('save-profile-btn').click();

      // Verify changes are persisted
      await expect(page.getByTestId('push-toast-container')).toBeVisible();
    });

    test('can toggle notification preferences', async ({ page }) => {
      await page.getByTestId('nav-tab-profile').click();
      await page.getByTestId('edit-profile-button').click();

      const pushNotificationToggle = page.getByTestId('edit-notification-push-toggle');
      const initialState = await pushNotificationToggle.isChecked();

      await pushNotificationToggle.click();

      // Verify toggle state changed
      const newState = await pushNotificationToggle.isChecked();
      expect(newState).not.toBe(initialState);

      await page.getByTestId('save-profile-btn').click();
      await expect(page.getByTestId('push-toast-container')).toBeVisible();
    });

    test('displays error when invalid website URL is entered', async ({ page }) => {
      await page.getByTestId('nav-tab-profile').click();
      await page.getByTestId('edit-profile-button').click();

      await page.getByTestId('edit-website-input').clear();
      await page.getByTestId('edit-website-input').fill('not-a-valid-url');

      await page.getByTestId('save-profile-btn').click();

      await expect(page.getByTestId('profile-form-error')).toBeVisible();
      await expect(page.getByTestId('profile-form-error')).toContainText('valid URL');
    });

    test('closes edit modal when cancel button is clicked', async ({ page }) => {
      await page.getByTestId('nav-tab-profile').click();
      await page.getByTestId('edit-profile-button').click();

      await page.getByTestId('cancel-profile-btn').click();

      await expect(page.getByTestId('edit-profile-modal')).not.toBeVisible();
    });
  });

  test.describe('Avatar Selection', () => {
    test('allows selection of different avatar options', async ({ page }) => {
      await page.getByTestId('nav-tab-profile').click();
      await page.getByTestId('edit-profile-button').click();

      const avatarPickers = page.getByTestId('avatar-picker-option');
      const count = await avatarPickers.count();

      expect(count).toBeGreaterThan(0);

      // Select a different avatar
      await avatarPickers.nth(1).click();

      await page.getByTestId('save-profile-btn').click();

      // Verify avatar was updated
      await expect(page.getByTestId('profile-avatar')).toBeVisible();
    });
  });
});
