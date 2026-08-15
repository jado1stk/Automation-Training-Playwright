# CineTrack E2E Test Suite

Comprehensive Playwright end-to-end (E2E) test suite for the CineTrack application. This suite covers all major features excluding login tests (which are in `login.spec.ts`).

## Test Files Overview

### 1. **profile.spec.ts** - User Profile Management
Tests for viewing and editing user profiles, including:
- **Profile Display**: Verify all user identity details and statistics are visible
- **Profile Editing**: Update full name, bio, location, website URL
- **Favorite Genres**: Toggle and save genre preferences
- **Notification Preferences**: Enable/disable notifications
- **Avatar Selection**: Change user avatar from preset options

**Key Test Cases:**
- Display user profile with all identity details
- Display user profile statistics
- Display favorite genre badges
- Open and close edit profile modal
- Update bio and persist changes
- Update full name, location, and website
- Toggle favorite genres
- Toggle notification preferences
- Select different avatars

### 2. **reviews-form.spec.ts** - Movie Review Submission
Tests for submitting movie reviews with various ratings and details:
- **Form Validation**: Required fields, character limits
- **Star Rating**: Select 1-5 stars and change ratings
- **Review Submission**: Submit reviews with all optional fields
- **Form Reset**: Clear form after submission
- **Accessibility**: Verify accessible labels and required attributes

**Key Test Cases:**
- Require movie title input
- Enforce character limit for review text
- Display live character count
- Select 1-5 star ratings
- Change star rating selection
- Display rating value on hover
- Submit valid reviews successfully
- Submit review with watch date
- Toggle recommendation checkbox
- Add genre/mood tags
- Increment user review count
- Clear form on cancel/submit

### 3. **reviews-feed.spec.ts** - Search, Filter & Interactions
Tests for browsing, searching, filtering, and interacting with reviews:
- **Search Functionality**: Real-time search by title, author, or content
- **Rating Filters**: Filter by 1-5 star ratings
- **Genre Filtering**: Filter by genre tags and recommendation status
- **Sorting Options**: Sort by newest, highest/lowest rated, most liked
- **Like Button**: Increment likes and toggle active state
- **Review Editing**: Edit and delete reviews
- **Pagination**: Load more reviews on scroll

**Key Test Cases:**
- Filter reviews by movie title
- Filter by author name and review content
- Clear search results
- Display no results message
- Case-insensitive search
- Filter by 5-star, 4-star, 1-star ratings
- Clear filters with All Ratings button
- Apply active styling to filters
- Filter by genre tags
- Filter by recommendation status
- Sort by newest, highest/lowest rated, most liked
- Increment like counter
- Toggle like button active state
- Change heart icon color on like
- Allow liking multiple reviews
- Display complete review information
- Edit review and save changes
- Show confirmation modal before deleting
- Delete review after confirming
- Cancel delete operation
- Load more reviews on scroll

### 4. **notifications.spec.ts** - Push Notifications & Notification Center
Tests for real-time notifications and the notification center:
- **Push Toasts**: Display notifications on actions (profile update, review submission)
- **Toast Details**: Verify title, message, timestamp, and type icon
- **Auto-dismiss**: Verify toasts auto-dismiss after 5 seconds
- **Manual Dismiss**: Close toasts manually
- **Notification Center**: View notification history, mark as read, clear all
- **Test Dispatcher**: Fire test notifications manually

**Key Test Cases:**
- Display push toast on profile update
- Display push toast on review submission
- Display toast with correct type icon
- Display toast with title and message
- Display toast with timestamp
- Auto-dismiss toast after 5 seconds
- Manually dismiss toast
- Play audio chime when sound enabled
- Open notification center
- Display unread badge count
- Display chronological notification list
- Mark notification as read
- Mark all notifications as read
- Clear all notifications
- Display notification with title and message
- Close notification center on outside click
- Fire test notification via dispatcher
- Notification appears in center after dispatch
- Increment badge counter on test push
- Display review notification type
- Display profile notification type

### 5. **theme.spec.ts** - Dark/Light Mode Theme Switching
Tests for theme switching and preference persistence:
- **Theme Toggle**: Switch between light and dark modes
- **Theme Icon**: Verify moon/sun icons change appropriately
- **Persistence**: Save and restore theme preference
- **Component Theming**: Verify all components respect theme
- **Accessibility**: Keyboard navigation and accessible labels

**Key Test Cases:**
- Theme toggle button is visible
- Toggle from light to dark mode
- Toggle from dark to light mode
- Apply dark class on dark mode
- Remove dark class on light mode
- Display moon icon in light mode
- Display sun icon in dark mode
- Switch icon when theme toggles
- Persist dark mode in localStorage
- Persist light mode in localStorage
- Restore theme on page reload
- Apply dark theme styles
- Apply light theme styles
- All text is readable in both themes
- Navigation respects theme preference
- Dashboard respects theme preference
- Modals respect theme preference
- Forms respect theme preference
- Theme toggle has accessible label
- Keyboard accessible (Enter and Space keys)

### 6. **fixtures.spec.ts** - Test Automation Fixtures & Management
Tests for test automation utilities and state management:
- **Reset State**: Restore app to baseline clean state
- **Seed Reviews**: Inject mock review data for testing
- **Export State**: Export current application state as JSON
- **Fixture Accessibility**: Verify all fixture buttons are accessible

**Key Test Cases:**
- Reset fixtures button is visible
- Reset application to baseline state
- Clear current session after reset
- Reset reviews to initial defaults
- Reset notifications to initial defaults
- Dispatch state reset notification
- Seed reviews button is visible
- Inject mock review data
- Seed multiple times adds reviews progressively
- Seeded reviews have valid data structure
- Seeded reviews appear with correct rating
- Export JSON button is visible
- Export state as JSON
- Exported JSON contains user data
- Exported JSON contains reviews data
- Exported JSON is structured correctly
- Show confirmation toast after export
- All fixture buttons have accessible labels
- Fixture buttons are keyboard accessible
- Test automation hub displays content
- Navigate away and return to hub
- State persists in localStorage after reset
- State updates reflect in localStorage after seed

## Running Tests

### Prerequisites
```bash
npm install
npx playwright install
```

### Run All Tests Locally
```bash
npm test
# or
npx playwright test
```

### Run Tests Against AI Studio
```bash
BASE_URL=https://cinetrack-automation.ai.studio npx playwright test
```

### Run Specific Test File
```bash
# Profile tests only
npx playwright test profile.spec.ts

# Reviews feed tests only
npx playwright test reviews-feed.spec.ts
```

### Run Tests in Headed Mode
```bash
HEADED=true npx playwright test
```

### Run with Specific Browser
```bash
# Chromium only
npx playwright test --project=chromium

# Firefox only
npx playwright test --project=firefox

# Safari only
npx playwright test --project=webkit
```

### Run Single Test
```bash
npx playwright test profile.spec.ts -g "displays user profile"
```

### Debug Mode
```bash
HEADED=true npx playwright test --debug
```

### View HTML Report
```bash
npx playwright show-report
```

## Environment Variables

- `BASE_URL`: Set the base URL for tests (default: `http://localhost:3001`)
  - Local: `BASE_URL=http://localhost:3001`
  - AI Studio: `BASE_URL=https://cinetrack-automation.ai.studio`

- `HEADED`: Run tests in headed mode (default: `false`)
  - `HEADED=true` to see browser window during tests

- `CI`: Set by CI/CD systems automatically

## CI/CD Pipeline (GitHub Actions)

The workflow (`.github/workflows/e2e-tests.yml`) automatically runs tests on:
- **Push** to `main` or `develop` branches
- **Pull requests** to `main` or `develop` branches
- **Scheduled** daily at 2 AM UTC (tests against AI Studio)

### Workflow Features:
- ✅ Runs on Node.js 18.x
- ✅ Tests on Chromium, Firefox, and WebKit browsers
- ✅ Automatic retry (2x) on CI failures
- ✅ Uploads HTML and JSON test reports
- ✅ Publishes test results as GitHub check
- ✅ Posts test status to PR comments
- ✅ Retains artifacts for 30 days

### View CI Results:
1. Go to **Actions** tab in GitHub
2. Click on the workflow run
3. Download artifacts or view test reports

## Test Structure & Patterns

### Common Test Setup
```typescript
test.beforeEach(async ({ page }) => {
  await page.goto(BASE_URL);
  // Login with demo account
  await page.getByTestId('demo-user-login-btn').click();
  await expect(page.getByTestId('overview-dashboard-view')).toBeVisible();
});
```

### Test Organization
Each test file is organized by `test.describe()` blocks:
- Logical grouping of related tests
- Clear test intentions
- Easy to locate and run specific test suites

### Test ID Naming Convention
All tests use `data-testid` attributes following the pattern:
- Component name + action (e.g., `edit-profile-button`)
- Snake_case for multi-word IDs (e.g., `push-toast-container`)
- Consistent naming matches app implementation

### Assertions & Expectations
Common assertion patterns:
```typescript
// Visibility
await expect(element).toBeVisible();
await expect(element).not.toBeVisible();

// Text content
await expect(element).toContainText('expected text');

// Attributes
await expect(element).toHaveAttribute('aria-label', 'label');
await expect(element).toHaveClass('active');

// Value
await expect(element).toHaveValue('input value');
```

## Debugging Failed Tests

### View Screenshots
Failed tests automatically save screenshots to `test-results/output/`

### View Videos
Videos of failed tests are saved (helps understand what went wrong)

### Debug Mode
```bash
HEADED=true npx playwright test --debug
```
Step through each test line-by-line in the Playwright Inspector

### View Trace
```bash
npx playwright show-trace test-results/trace.zip
```

## Best Practices

1. **Isolate Tests**: Each test should be independent and not rely on others
2. **Use Data Attributes**: Rely on `data-testid` rather than CSS selectors
3. **Add Waits**: Use `waitForTimeout()` or `waitForNavigation()` when needed
4. **Clear Assertions**: Use specific assertions (e.g., `toContainText()` not generic checks)
5. **Error Messages**: Add context to assertions for easier debugging
6. **Test Fixtures**: Use `beforeEach()` to set up common test state

## Maintenance

### Adding New Tests
1. Identify which spec file the test belongs to
2. Add test to appropriate `describe` block
3. Follow existing naming and assertion patterns
4. Ensure test is independent and can run in any order
5. Run tests locally before committing

### Updating Tests
- When app UI changes, update `data-testid` selectors
- When functionality changes, update assertions
- Keep test descriptions clear and up-to-date

### Handling Flaky Tests
- Add explicit waits: `await page.waitForTimeout(500)`
- Use more reliable selectors (prefer `getByTestId`)
- Verify element visibility before interaction
- Add retries for CI environment: `test.setTimeout(60000)`

## Reports & Artifacts

### Local Reports
- **HTML Report**: `playwright-report/index.html`
- **Test Results JSON**: `test-results/results.json`
- **Screenshots**: `test-results/output/`
- **Videos**: `test-results/output/` (failed tests only)

### CI Artifacts
- Artifacts stored for 30 days
- Downloaded from GitHub Actions workflow
- Accessible via pull request checks

## Troubleshooting

### Tests Timeout
```bash
# Increase timeout in playwright.config.ts or CLI
npx playwright test --timeout 60000
```

### Login Issues
Ensure demo credentials are correct and user exists in test environment:
- Email: `alex.rivera@example.com`
- Password: `demo1234`

### Network Issues (AI Studio)
```bash
# Add network diagnostics
npx playwright test --reporter=json > results.json
```

### Browser Issues
```bash
# Update Playwright
npm install -D @playwright/test@latest
npx playwright install
```

## Resources

- [Playwright Documentation](https://playwright.dev/)
- [Playwright Best Practices](https://playwright.dev/docs/best-practices)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- CineTrack Requirements: See `requirements-and-automation.md`

## Contributing

When adding new features to CineTrack:
1. Add corresponding E2E tests
2. Use existing test patterns
3. Follow `data-testid` naming conventions
4. Ensure tests pass locally and in CI
5. Update this README if test structure changes
