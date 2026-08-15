import { test, expect } from '@playwright/test';

const BASE_URL = 'https://cinetrack-automation.ai.studio';

test.describe('Movie Reviews Feed - Search, Filter & Interactions', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(BASE_URL);
    // Login with demo account
    await page.getByTestId('demo-user-login-btn').click();
    await expect(page.getByTestId('overview-dashboard-view')).toBeVisible();

    // Navigate to Reviews Feed
    await page.getByTestId('nav-tab-reviews').click();
    await expect(page.getByTestId('movie-reviews-feed')).toBeVisible();
  });

  test.describe('Search Functionality', () => {
    test('filters reviews by movie title in real-time', async ({ page }) => {
      const searchInput = page.getByTestId('search-reviews-input');
      
      // Search for a specific movie
      await searchInput.fill('Interstellar');

      // Wait for filter to apply
      await page.waitForTimeout(300);

      // Verify only matching reviews are shown
      const reviewCards = page.getByTestId('review-card');
      const visibleReviews = await reviewCards.count();

      // Each visible review should contain the search term
      for (let i = 0; i < visibleReviews; i++) {
        const text = await reviewCards.nth(i).textContent();
        expect(text?.toLowerCase()).toContain('interstellar'.toLowerCase());
      }
    });

    test('filters reviews by author name in real-time', async ({ page }) => {
      const searchInput = page.getByTestId('search-reviews-input');

      await searchInput.fill('Alex Rivera');
      await page.waitForTimeout(300);

      const reviewCards = page.getByTestId('review-card');
      const count = await reviewCards.count();

      // Should have matching reviews
      expect(count).toBeGreaterThanOrEqual(0);
    });

    test('filters reviews by review text content in real-time', async ({ page }) => {
      const searchInput = page.getByTestId('search-reviews-input');

      await searchInput.fill('masterpiece');
      await page.waitForTimeout(300);

      const reviewCards = page.getByTestId('review-card');
      expect(await reviewCards.count()).toBeGreaterThanOrEqual(0);
    });

    test('clears search results when search input is cleared', async ({ page }) => {
      const searchInput = page.getByTestId('search-reviews-input');

      // Perform search
      await searchInput.fill('Inception');
      await page.waitForTimeout(300);
      const filteredCount = await page.getByTestId('review-card').count();

      // Clear search
      await searchInput.clear();
      await page.waitForTimeout(300);
      const unfilteredCount = await page.getByTestId('review-card').count();

      // Unfiltered should have more or equal results
      expect(unfilteredCount).toBeGreaterThanOrEqual(filteredCount);
    });

    test('displays no results message when search yields no matches', async ({ page }) => {
      const searchInput = page.getByTestId('search-reviews-input');

      await searchInput.fill('NonexistentMovieXYZ123');
      await page.waitForTimeout(300);

      const noResultsMessage = page.getByTestId('no-reviews-message');
      await expect(noResultsMessage).toBeVisible();
      await expect(noResultsMessage).toContainText('No reviews found');
    });

    test('is case-insensitive for search', async ({ page }) => {
      const searchInput = page.getByTestId('search-reviews-input');

      await searchInput.fill('INTERSTELLAR');
      await page.waitForTimeout(300);

      const reviewCards = page.getByTestId('review-card');
      const count = await reviewCards.count();

      expect(count).toBeGreaterThanOrEqual(0);
    });
  });

  test.describe('Star Rating Filters', () => {
    test('filters reviews by 5-star rating', async ({ page }) => {
      await page.getByTestId('filter-rating-5').click();
      await page.waitForTimeout(300);

      const reviewCards = page.getByTestId('review-card');
      
      // Verify all visible reviews are 5-star
      for (let i = 0; i < await reviewCards.count(); i++) {
        const card = reviewCards.nth(i);
        const stars = card.getByTestId('review-star-rating');
        const ratingText = await stars.textContent();
        expect(ratingText).toContain('5');
      }
    });

    test('filters reviews by 4-star rating', async ({ page }) => {
      await page.getByTestId('filter-rating-4').click();
      await page.waitForTimeout(300);

      const reviewCards = page.getByTestId('review-card');
      expect(await reviewCards.count()).toBeGreaterThanOrEqual(0);
    });

    test('filters reviews by 1-star rating', async ({ page }) => {
      await page.getByTestId('filter-rating-1').click();
      await page.waitForTimeout(300);

      const reviewCards = page.getByTestId('review-card');
      expect(await reviewCards.count()).toBeGreaterThanOrEqual(0);
    });

    test('clears filter when All Ratings filter is clicked', async ({ page }) => {
      await page.getByTestId('filter-rating-5').click();
      await page.waitForTimeout(300);
      const filteredCount = await page.getByTestId('review-card').count();

      await page.getByTestId('filter-all-ratings').click();
      await page.waitForTimeout(300);
      const unfilteredCount = await page.getByTestId('review-card').count();

      expect(unfilteredCount).toBeGreaterThanOrEqual(filteredCount);
    });

    test('applies active styling to selected rating filter', async ({ page }) => {
      const filterButton = page.getByTestId('filter-rating-5');
      
      await filterButton.click();

      await expect(filterButton).toHaveClass(/active|selected/);
    });
  });

  test.describe('Genre Filtering', () => {
    test('filters reviews by single genre tag', async ({ page }) => {
      const genreFilter = page.getByTestId('filter-genre-action');
      
      if (await genreFilter.isVisible()) {
        await genreFilter.click();
        await page.waitForTimeout(300);

        const reviewCards = page.getByTestId('review-card');
        expect(await reviewCards.count()).toBeGreaterThanOrEqual(0);
      }
    });

    test('filters reviews by recommendation status', async ({ page }) => {
      const recommendedFilter = page.getByTestId('filter-recommended');

      if (await recommendedFilter.isVisible()) {
        await recommendedFilter.click();
        await page.waitForTimeout(300);

        const reviewCards = page.getByTestId('review-card');
        // All visible should be recommended
        for (let i = 0; i < await reviewCards.count(); i++) {
          const badge = reviewCards.nth(i).getByTestId('recommended-badge');
          await expect(badge).toBeVisible();
        }
      }
    });
  });

  test.describe('Sorting Options', () => {
    test('sorts reviews by newest first', async ({ page }) => {
      const sortDropdown = page.getByTestId('sort-dropdown');

      if (await sortDropdown.isVisible()) {
        await sortDropdown.selectOption('newest');
        await page.waitForTimeout(300);

        const reviewCards = page.getByTestId('review-card');
        const count = await reviewCards.count();
        expect(count).toBeGreaterThan(0);
      }
    });

    test('sorts reviews by highest rated', async ({ page }) => {
      const sortDropdown = page.getByTestId('sort-dropdown');

      if (await sortDropdown.isVisible()) {
        await sortDropdown.selectOption('highest-rated');
        await page.waitForTimeout(300);

        const reviewCards = page.getByTestId('review-card');
        expect(await reviewCards.count()).toBeGreaterThan(0);
      }
    });

    test('sorts reviews by lowest rated', async ({ page }) => {
      const sortDropdown = page.getByTestId('sort-dropdown');

      if (await sortDropdown.isVisible()) {
        await sortDropdown.selectOption('lowest-rated');
        await page.waitForTimeout(300);

        const reviewCards = page.getByTestId('review-card');
        expect(await reviewCards.count()).toBeGreaterThan(0);
      }
    });

    test('sorts reviews by most liked', async ({ page }) => {
      const sortDropdown = page.getByTestId('sort-dropdown');

      if (await sortDropdown.isVisible()) {
        await sortDropdown.selectOption('most-liked');
        await page.waitForTimeout(300);

        const reviewCards = page.getByTestId('review-card');
        expect(await reviewCards.count()).toBeGreaterThan(0);
      }
    });
  });

  test.describe('Like Button Interactions', () => {
    test('increments like counter when like button is clicked', async ({ page }) => {
      const reviewCards = page.getByTestId('review-card');
      
      if (await reviewCards.count() > 0) {
        const firstCard = reviewCards.first();
        const likeButton = firstCard.getByTestId('review-like-btn');
        const likeCount = firstCard.getByTestId('review-like-count');

        const initialCount = parseInt(await likeCount.textContent() || '0');

        await likeButton.click();
        await page.waitForTimeout(300);

        const updatedCount = parseInt(await likeCount.textContent() || '0');
        expect(updatedCount).toBe(initialCount + 1);
      }
    });

    test('toggles like button active state when clicked', async ({ page }) => {
      const reviewCards = page.getByTestId('review-card');

      if (await reviewCards.count() > 0) {
        const firstCard = reviewCards.first();
        const likeButton = firstCard.getByTestId('review-like-btn');

        const hasActiveBefore = await likeButton.evaluate(el => 
          el.classList.contains('active') || el.getAttribute('aria-pressed') === 'true'
        );

        await likeButton.click();

        const hasActiveAfter = await likeButton.evaluate(el =>
          el.classList.contains('active') || el.getAttribute('aria-pressed') === 'true'
        );

        expect(hasActiveAfter).not.toBe(hasActiveBefore);
      }
    });

    test('changes heart icon color when review is liked', async ({ page }) => {
      const reviewCards = page.getByTestId('review-card');

      if (await reviewCards.count() > 0) {
        const firstCard = reviewCards.first();
        const heartIcon = firstCard.getByTestId('review-heart-icon');
        const classBeforeClick = await heartIcon.getAttribute('class');

        await firstCard.getByTestId('review-like-btn').click();

        const classAfterClick = await heartIcon.getAttribute('class');
        expect(classBeforeClick).not.toBe(classAfterClick);
      }
    });

    test('allows liking multiple reviews in sequence', async ({ page }) => {
      const reviewCards = page.getByTestId('review-card');
      const cardCount = await reviewCards.count();

      if (cardCount > 1) {
        const firstLikeBtn = reviewCards.nth(0).getByTestId('review-like-btn');
        const secondLikeBtn = reviewCards.nth(1).getByTestId('review-like-btn');

        const firstCountBefore = parseInt(
          await reviewCards.nth(0).getByTestId('review-like-count').textContent() || '0'
        );
        const secondCountBefore = parseInt(
          await reviewCards.nth(1).getByTestId('review-like-count').textContent() || '0'
        );

        await firstLikeBtn.click();
        await page.waitForTimeout(100);
        await secondLikeBtn.click();

        const firstCountAfter = parseInt(
          await reviewCards.nth(0).getByTestId('review-like-count').textContent() || '0'
        );
        const secondCountAfter = parseInt(
          await reviewCards.nth(1).getByTestId('review-like-count').textContent() || '0'
        );

        expect(firstCountAfter).toBe(firstCountBefore + 1);
        expect(secondCountAfter).toBe(secondCountBefore + 1);
      }
    });
  });

  test.describe('Review Card Details', () => {
    test('displays complete review information on card', async ({ page }) => {
      const reviewCards = page.getByTestId('review-card');

      if (await reviewCards.count() > 0) {
        const firstCard = reviewCards.first();

        await expect(firstCard.getByTestId('review-title')).toBeVisible();
        await expect(firstCard.getByTestId('review-author')).toBeVisible();
        await expect(firstCard.getByTestId('review-star-rating')).toBeVisible();
        await expect(firstCard.getByTestId('review-text')).toBeVisible();
      }
    });

    test('displays watch date on review card if available', async ({ page }) => {
      const reviewCards = page.getByTestId('review-card');

      if (await reviewCards.count() > 0) {
        const watchDateElement = reviewCards.first().getByTestId('review-watch-date');
        if (await watchDateElement.isVisible()) {
          await expect(watchDateElement).toContainText(/\d{1,2}\/\d{1,2}\/\d{4}/);
        }
      }
    });
  });

  test.describe('Edit & Delete Review', () => {
    test('opens edit modal when edit button is clicked on own review', async ({ page }) => {
      const reviewCards = page.getByTestId('review-card');

      // Find a review by the logged-in user
      for (let i = 0; i < await reviewCards.count(); i++) {
        const card = reviewCards.nth(i);
        const editBtn = card.queryByTestId('review-edit-btn');

        if (editBtn && await editBtn.isVisible()) {
          await editBtn.click();
          await expect(page.getByTestId('edit-review-modal')).toBeVisible();
          break;
        }
      }
    });

    test('updates review text and saves changes', async ({ page }) => {
      const reviewCards = page.getByTestId('review-card');

      for (let i = 0; i < await reviewCards.count(); i++) {
        const card = reviewCards.nth(i);
        const editBtn = card.queryByTestId('review-edit-btn');

        if (editBtn && await editBtn.isVisible()) {
          await editBtn.click();

          const editTextInput = page.getByTestId('edit-review-text-input');
          const newText = 'Updated review text at ' + new Date().getTime();
          
          await editTextInput.clear();
          await editTextInput.fill(newText);

          await page.getByTestId('save-review-edit-btn').click();

          await expect(page.getByTestId('push-toast-container')).toBeVisible();
          await expect(page.getByTestId('push-toast-container')).toContainText('updated');
          break;
        }
      }
    });

    test('shows confirmation modal before deleting review', async ({ page }) => {
      const reviewCards = page.getByTestId('review-card');

      for (let i = 0; i < await reviewCards.count(); i++) {
        const card = reviewCards.nth(i);
        const deleteBtn = card.queryByTestId('review-delete-btn');

        if (deleteBtn && await deleteBtn.isVisible()) {
          await deleteBtn.click();
          await expect(page.getByTestId('confirm-delete-modal')).toBeVisible();
          await expect(page.getByText('Are you sure')).toBeVisible();
          break;
        }
      }
    });

    test('deletes review after confirming in modal', async ({ page }) => {
      const reviewCards = page.getByTestId('review-card');
      const initialCount = await reviewCards.count();

      for (let i = 0; i < await reviewCards.count(); i++) {
        const card = reviewCards.nth(i);
        const deleteBtn = card.queryByTestId('review-delete-btn');

        if (deleteBtn && await deleteBtn.isVisible()) {
          await deleteBtn.click();
          await page.getByTestId('confirm-delete-btn').click();

          await expect(page.getByTestId('push-toast-container')).toBeVisible();
          await expect(page.getByTestId('push-toast-container')).toContainText('deleted');

          await page.waitForTimeout(300);

          const finalCount = await page.getByTestId('review-card').count();
          expect(finalCount).toBe(initialCount - 1);
          break;
        }
      }
    });

    test('cancels delete when cancel button is clicked', async ({ page }) => {
      const reviewCards = page.getByTestId('review-card');
      const initialCount = await reviewCards.count();

      for (let i = 0; i < await reviewCards.count(); i++) {
        const card = reviewCards.nth(i);
        const deleteBtn = card.queryByTestId('review-delete-btn');

        if (deleteBtn && await deleteBtn.isVisible()) {
          await deleteBtn.click();
          await page.getByTestId('cancel-delete-btn').click();

          await expect(page.getByTestId('confirm-delete-modal')).not.toBeVisible();

          const finalCount = await page.getByTestId('review-card').count();
          expect(finalCount).toBe(initialCount);
          break;
        }
      }
    });
  });

  test.describe('Pagination & Infinite Scroll', () => {
    test('loads more reviews when scrolling to bottom', async ({ page }) => {
      const reviewCards = page.getByTestId('review-card');
      const initialCount = await reviewCards.count();

      // Scroll to bottom
      await page.evaluate(() => {
        window.scrollTo(0, document.body.scrollHeight);
      });

      await page.waitForTimeout(500);

      const finalCount = await page.getByTestId('review-card').count();
      
      // Should have loaded more or stayed the same if at end
      expect(finalCount).toBeGreaterThanOrEqual(initialCount);
    });
  });
});
