import { test, expect } from '@playwright/test';

const BASE_URL = 'https://cinetrack-automation.ai.studio';

test.describe('Movie Review Form & Submission', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(BASE_URL);
    // Login with demo account
    await page.getByTestId('demo-user-login-btn').click();
    await expect(page.getByTestId('overview-dashboard-view')).toBeVisible();
    
    // Navigate to Write Review page
    await page.getByTestId('nav-tab-write-review').click();
    await expect(page.getByTestId('movie-review-form')).toBeVisible();
  });

  test.describe('Form Field Validation', () => {
    test('requires movie title input before submission', async ({ page }) => {
      // Leave movie title empty
      await page.getByTestId('movie-title-input').clear();
      await page.getByTestId('review-text-input').fill('Great movie!');
      await page.getByTestId('star-rating-5').click();

      await page.getByTestId('submit-review-btn').click();

      await expect(page.getByTestId('review-form-error')).toBeVisible();
      await expect(page.getByTestId('review-form-error')).toContainText('movie title is required');
    });

    test('enforces maximum character limit for review text', async ({ page }) => {
      await page.getByTestId('movie-title-input').fill('Inception');
      
      const reviewInput = page.getByTestId('review-text-input');
      const maxChars = 1000;
      const longText = 'a'.repeat(maxChars + 100);

      await reviewInput.fill(longText);

      // Verify character count display shows max limit
      const charCount = page.getByTestId('review-character-count');
      await expect(charCount).toContainText(maxChars);
    });

    test('displays live character count for review text', async ({ page }) => {
      const reviewInput = page.getByTestId('review-text-input');
      const charCount = page.getByTestId('review-character-count');

      await expect(charCount).toContainText('0');

      const reviewText = 'This is a great film!';
      await reviewInput.fill(reviewText);

      await expect(charCount).toContainText(reviewText.length.toString());
    });
  });

  test.describe('Star Rating Selection', () => {
    test('allows selection of 1-star rating', async ({ page }) => {
      await page.getByTestId('movie-title-input').fill('Bad Movie');
      await page.getByTestId('star-rating-1').click();

      const selectedStar = page.getByTestId('star-rating-1');
      await expect(selectedStar).toHaveAttribute('aria-pressed', 'true');
    });

    test('allows selection of 5-star rating', async ({ page }) => {
      await page.getByTestId('movie-title-input').fill('Amazing Movie');
      await page.getByTestId('star-rating-5').click();

      const selectedStar = page.getByTestId('star-rating-5');
      await expect(selectedStar).toHaveAttribute('aria-pressed', 'true');
    });

    test('allows changing star rating selection', async ({ page }) => {
      await page.getByTestId('movie-title-input').fill('Test Movie');
      await page.getByTestId('star-rating-3').click();
      await expect(page.getByTestId('star-rating-3')).toHaveAttribute('aria-pressed', 'true');

      // Change to 5 stars
      await page.getByTestId('star-rating-5').click();
      await expect(page.getByTestId('star-rating-5')).toHaveAttribute('aria-pressed', 'true');
      await expect(page.getByTestId('star-rating-3')).toHaveAttribute('aria-pressed', 'false');
    });

    test('displays rating value when hovering over stars', async ({ page }) => {
      const starRating3 = page.getByTestId('star-rating-3');
      await starRating3.hover();

      const ratingDisplay = page.getByTestId('rating-display');
      await expect(ratingDisplay).toContainText('3');
    });

    test('requires star rating before submission', async ({ page }) => {
      await page.getByTestId('movie-title-input').fill('Test Movie');
      await page.getByTestId('review-text-input').fill('Great film!');

      // Don't select any rating
      await page.getByTestId('submit-review-btn').click();

      await expect(page.getByTestId('review-form-error')).toBeVisible();
      await expect(page.getByTestId('review-form-error')).toContainText('rating is required');
    });
  });

  test.describe('Review Submission', () => {
    test('submits valid 5-star review successfully', async ({ page }) => {
      const movieTitle = `Interstellar ${Date.now()}`;
      const reviewText = 'Absolutely mind-bending and visually stunning. A masterpiece of cinema!';

      await page.getByTestId('movie-title-input').fill(movieTitle);
      await page.getByTestId('star-rating-5').click();
      await page.getByTestId('review-text-input').fill(reviewText);

      await page.getByTestId('submit-review-btn').click();

      // Verify toast notification appears
      await expect(page.getByTestId('push-toast-container')).toBeVisible();
      await expect(page.getByTestId('push-toast-container')).toContainText('review was submitted');

      // Verify redirect to reviews feed
      await expect(page.getByTestId('movie-reviews-feed')).toBeVisible();

      // Verify the review appears in the feed
      await expect(page.getByText(movieTitle)).toBeVisible();
    });

    test('submits valid 1-star review successfully', async ({ page }) => {
      const movieTitle = `Bad Movie ${Date.now()}`;
      const reviewText = 'Disappointing and poorly executed.';

      await page.getByTestId('movie-title-input').fill(movieTitle);
      await page.getByTestId('star-rating-1').click();
      await page.getByTestId('review-text-input').fill(reviewText);

      await page.getByTestId('submit-review-btn').click();

      await expect(page.getByTestId('push-toast-container')).toBeVisible();
      await expect(page.getByTestId('movie-reviews-feed')).toBeVisible();
      await expect(page.getByText(movieTitle)).toBeVisible();
    });

    test('submits review with watch date selection', async ({ page }) => {
      const movieTitle = `Watched Movie ${Date.now()}`;
      await page.getByTestId('movie-title-input').fill(movieTitle);
      await page.getByTestId('star-rating-4').click();
      await page.getByTestId('review-text-input').fill('Good film!');

      // Select watch date if available
      const watchDateInput = page.getByTestId('review-watch-date-input');
      if (await watchDateInput.isVisible()) {
        await watchDateInput.fill('2024-08-14');
      }

      await page.getByTestId('submit-review-btn').click();

      await expect(page.getByTestId('push-toast-container')).toBeVisible();
      await expect(page.getByTestId('movie-reviews-feed')).toBeVisible();
    });

    test('toggles recommendation checkbox before submission', async ({ page }) => {
      await page.getByTestId('movie-title-input').fill(`Test Movie ${Date.now()}`);
      await page.getByTestId('star-rating-5').click();
      await page.getByTestId('review-text-input').fill('Highly recommended!');

      const recommendCheckbox = page.getByTestId('recommend-checkbox');
      await recommendCheckbox.check();

      await expect(recommendCheckbox).toBeChecked();

      await page.getByTestId('submit-review-btn').click();

      await expect(page.getByTestId('push-toast-container')).toBeVisible();
    });

    test('adds genre/mood tags to review', async ({ page }) => {
      await page.getByTestId('movie-title-input').fill(`Tagged Movie ${Date.now()}`);
      await page.getByTestId('star-rating-4').click();
      await page.getByTestId('review-text-input').fill('Great movie with amazing tags!');

      // Select genre tags
      const genreTagOptions = page.getByTestId('genre-tag-option');
      const tagCount = await genreTagOptions.count();

      if (tagCount > 0) {
        await genreTagOptions.first().click();
      }

      await page.getByTestId('submit-review-btn').click();

      await expect(page.getByTestId('push-toast-container')).toBeVisible();
    });

    test('increments user review count after successful submission', async ({ page }) => {
      // Get initial review count from profile
      await page.getByTestId('nav-tab-profile').click();
      const initialCountText = await page.getByTestId('stat-total-reviews').textContent();
      const initialCount = parseInt(initialCountText?.match(/\d+/)?.[0] || '0');

      // Go back to write review
      await page.getByTestId('nav-tab-write-review').click();

      const movieTitle = `Count Test ${Date.now()}`;
      await page.getByTestId('movie-title-input').fill(movieTitle);
      await page.getByTestId('star-rating-3').click();
      await page.getByTestId('review-text-input').fill('Test review');
      await page.getByTestId('submit-review-btn').click();

      // Verify redirect to feed
      await expect(page.getByTestId('movie-reviews-feed')).toBeVisible();

      // Go to profile to verify count increased
      await page.getByTestId('nav-tab-profile').click();
      const updatedCountText = await page.getByTestId('stat-total-reviews').textContent();
      const updatedCount = parseInt(updatedCountText?.match(/\d+/)?.[0] || '0');

      expect(updatedCount).toBe(initialCount + 1);
    });
  });

  test.describe('Form Reset & Cancel', () => {
    test('clears form when cancel button is clicked', async ({ page }) => {
      const movieTitle = `Movie ${Date.now()}`;
      await page.getByTestId('movie-title-input').fill(movieTitle);
      await page.getByTestId('star-rating-5').click();
      await page.getByTestId('review-text-input').fill('Great film');

      await page.getByTestId('cancel-review-btn').click();

      // Form should be cleared
      await expect(page.getByTestId('movie-title-input')).toHaveValue('');
      await expect(page.getByTestId('review-text-input')).toHaveValue('');
    });

    test('clears form after successful submission', async ({ page }) => {
      await page.getByTestId('movie-title-input').fill(`Movie ${Date.now()}`);
      await page.getByTestId('star-rating-3').click();
      await page.getByTestId('review-text-input').fill('Good film');

      await page.getByTestId('submit-review-btn').click();

      await expect(page.getByTestId('push-toast-container')).toBeVisible();

      // Navigate back to write review
      await page.getByTestId('nav-tab-write-review').click();

      // Form should be cleared for new review
      await expect(page.getByTestId('movie-title-input')).toHaveValue('');
      await expect(page.getByTestId('review-text-input')).toHaveValue('');
    });
  });

  test.describe('Form Accessibility', () => {
    test('has accessible labels for all form inputs', async ({ page }) => {
      await expect(page.getByLabel('Movie Title')).toBeVisible();
      await expect(page.getByLabel('Your Review')).toBeVisible();
      await expect(page.getByLabel(/rating|stars/i)).toBeVisible();
    });

    test('shows required field indicators', async ({ page }) => {
      const movieTitleInput = page.getByTestId('movie-title-input');
      await expect(movieTitleInput).toHaveAttribute('required', '');
    });
  });
});
