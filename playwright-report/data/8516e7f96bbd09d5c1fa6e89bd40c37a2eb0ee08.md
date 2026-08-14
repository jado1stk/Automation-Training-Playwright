# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: cinetrack.spec.ts >> CineTrack smoke automation suite >> TC04: writes and publishes a movie review
- Location: tests\cinetrack.spec.ts:34:3

# Error details

```
Test timeout of 30000ms exceeded.
```

```
Error: locator.waitFor: Test timeout of 30000ms exceeded.
Call log:
  - waiting for locator('#header-login-btn') to be visible

```

# Page snapshot

```yaml
- generic [ref=e3]:
  - banner [ref=e4]:
    - generic [ref=e5]:
      - generic [ref=e6]:
        - button "CineTrack App Reviews & Profile Suite" [ref=e7]:
          - generic [ref=e11]:
            - generic [ref=e12]:
              - text: CineTrack
              - generic [ref=e13]: App
            - paragraph [ref=e14]: Reviews & Profile Suite
        - navigation [ref=e15]:
          - button "Dashboard" [ref=e16]
          - button "Movie Reviews" [ref=e22]
          - button "Write Review" [ref=e28]
          - button "Profile" [ref=e31]
          - button "Test Automation Hub" [ref=e35]
      - generic [ref=e38]:
        - button "Switch to dark mode" [ref=e39]
        - button "View notifications" [ref=e43]:
          - generic [ref=e47]: "1"
        - button "Alex Rivera Alex Rivera" [ref=e49]:
          - img "Alex Rivera" [ref=e50]
          - generic [ref=e51]: Alex Rivera
  - main [ref=e52]:
    - generic [ref=e53]:
      - generic [ref=e55]:
        - generic [ref=e56]:
          - generic [ref=e57]: Movie Reviews & Profile Hub
          - heading "Welcome back, Alex Rivera!" [level=1] [ref=e62]
          - paragraph [ref=e63]: Rate movies from 1 to 5 stars, update your user profile data in real-time, toggle dark mode, and verify all flows with automated test suites.
        - generic [ref=e64]:
          - button "Log Movie Review" [ref=e65]
          - button "View Profile" [ref=e68]
      - generic [ref=e71]:
        - generic [ref=e72]:
          - generic [ref=e73]: Total Reviews
          - generic [ref=e78]:
            - generic [ref=e79]: "4"
            - generic [ref=e80]: films logged
        - generic [ref=e81]:
          - generic [ref=e82]: 5-Star Masterpieces
          - generic [ref=e87]:
            - generic [ref=e88]: "2"
            - generic [ref=e89]: top ratings
        - generic [ref=e90]:
          - generic [ref=e91]: Theme Mode
          - generic [ref=e100]:
            - generic [ref=e101]: Light Mode Active
            - button "Toggle" [ref=e102]
        - generic [ref=e103]:
          - generic [ref=e104]: Push Dispatcher
          - button "Fire Test Push" [ref=e111]
      - generic [ref=e112]:
        - generic [ref=e113]:
          - generic [ref=e114]:
            - heading "Latest Movie Reviews" [level=2] [ref=e115]
            - paragraph [ref=e116]: Recent ratings and reviews submitted by users.
          - button "View All Reviews (4)" [ref=e117]
        - generic [ref=e120]:
          - generic [ref=e121]:
            - generic [ref=e122]:
              - generic [ref=e123]:
                - heading "Interstellar" [level=3] [ref=e124]
                - generic [ref=e125]: "5.0"
              - paragraph [ref=e129]: An absolute masterpiece of emotional storytelling coupled with breathtaking scientific concepts and Hans Zimmers iconic score. The docking sequence alone is worth the 5 stars.
            - generic [ref=e130]:
              - generic [ref=e131]: By Alex Rivera
              - generic [ref=e132]: "24"
          - generic [ref=e135]:
            - generic [ref=e136]:
              - generic [ref=e137]:
                - 'heading "Dune: Part Two" [level=3] [ref=e138]'
                - generic [ref=e139]: "5.0"
              - paragraph [ref=e143]: Stunning cinematography, heavy bass design, and incredible pacing for such an expansive epic. Denis Villeneuve delivered on all fronts.
            - generic [ref=e144]:
              - generic [ref=e145]: By Alex Rivera
              - generic [ref=e146]: "19"
          - generic [ref=e149]:
            - generic [ref=e150]:
              - generic [ref=e151]:
                - heading "Inception" [level=3] [ref=e152]
                - generic [ref=e153]: "4.0"
              - paragraph [ref=e157]: Clever premise with brilliant execution. Pacing holds up remarkably well even on multiple rewatches.
            - generic [ref=e158]:
              - generic [ref=e159]: By Marcus Vance
              - generic [ref=e160]: "12"
  - contentinfo [ref=e163]:
    - generic [ref=e164]:
      - generic [ref=e165]:
        - generic [ref=e166]: CineTrack
        - generic [ref=e167]: •
        - generic [ref=e168]: Movie Reviews, Profile Dashboard & Automated Testing Suite
      - generic [ref=e169]:
        - button "Test Automation Locators" [ref=e170]
        - generic [ref=e171]: •
        - button "Back to Top" [ref=e172]
```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | 
  3  | test.describe('CineTrack smoke automation suite', () => {
  4  |   test.beforeEach(async ({ page }) => {
  5  |     await page.goto('/');
  6  |   });
  7  | 
  8  |   test('TC01: loads the app and shows the main navigation', async ({ page }) => {
  9  |     await expect(page).toHaveTitle(/My Google AI Studio App/i);
  10 |     await expect(page.locator('#brand-logo-btn')).toBeVisible();
  11 |     await expect(page.locator('#nav-tab-dashboard')).toBeVisible();
  12 |     await expect(page.locator('#nav-tab-reviews')).toBeVisible();
  13 |     await expect(page.locator('#nav-tab-write-review')).toBeVisible();
  14 |   });
  15 | 
  16 |   test('TC02: toggles dark mode', async ({ page }) => {
  17 |     const toggle = page.locator('#theme-toggle-button');
  18 |     await expect(toggle).toBeVisible();
  19 |     await toggle.click();
  20 |     await expect(page.locator('html')).toHaveClass(/dark/);
  21 |     await toggle.click();
  22 |     await expect(page.locator('html')).not.toHaveClass(/dark/);
  23 |   });
  24 | 
  25 |   test('TC03: logs in with the demo account', async ({ page }) => {
  26 |     await page.locator('#header-login-btn').waitFor({ state: 'visible' });
  27 |     await page.locator('#header-login-btn').click();
  28 |     await page.locator('#demo-user-login-btn').waitFor({ state: 'visible' });
  29 |     await page.locator('#demo-user-login-btn').click();
  30 | 
  31 |     await expect(page.locator('#nav-user-name')).toContainText('Alex Rivera');
  32 |   });
  33 | 
  34 |   test('TC04: writes and publishes a movie review', async ({ page }) => {
> 35 |     await page.locator('#header-login-btn').waitFor({ state: 'visible' });
     |                                             ^ Error: locator.waitFor: Test timeout of 30000ms exceeded.
  36 |     await page.locator('#header-login-btn').click();
  37 |     await page.locator('#demo-user-login-btn').waitFor({ state: 'visible' });
  38 |     await page.locator('#demo-user-login-btn').click();
  39 |     await page.locator('#nav-tab-write-review').click();
  40 | 
  41 |     await page.locator('#movie-title-input').fill('Inception Playwright');
  42 |     await page.locator('#star-rating-5').click();
  43 |     await page.locator('#review-text-input').fill('A sharp, layered sci-fi film with incredible world-building and tension.');
  44 |     await page.locator('#submit-review-btn').click();
  45 | 
  46 |     await expect(page.locator('#push-toast-container')).toContainText('Review submitted');
  47 |     await page.locator('#nav-tab-reviews').click();
  48 |     await expect(page.locator('text=Inception Playwright')).toBeVisible();
  49 |   });
  50 | 
  51 |   test('TC05: updates profile info', async ({ page }) => {
  52 |     await page.locator('#header-login-btn').waitFor({ state: 'visible' });
  53 |     await page.locator('#header-login-btn').click();
  54 |     await page.locator('#demo-user-login-btn').waitFor({ state: 'visible' });
  55 |     await page.locator('#demo-user-login-btn').click();
  56 |     await page.locator('#nav-tab-profile').click();
  57 |     await page.locator('#edit-profile-button').click();
  58 | 
  59 |     await page.locator('#edit-bio-input').fill('Automation QA engineer testing app workflows.');
  60 |     await page.locator('#save-profile-btn').click();
  61 | 
  62 |     await expect(page.locator('#profile-bio-display')).toContainText('Automation QA engineer testing app workflows.');
  63 |   });
  64 | 
  65 |   test('TC06: triggers a push notification', async ({ page }) => {
  66 |     await page.locator('#notification-bell-button').click();
  67 |     await page.locator('#toggle-simulate-push-form').click();
  68 |     await page.locator('#test-push-title-input').fill('Automation Alert');
  69 |     await page.locator('#test-push-body-input').fill('Playwright smoke test notification.');
  70 |     await page.locator('#dispatch-test-push-btn').click();
  71 | 
  72 |     await expect(page.locator('#push-toast-container')).toContainText('Automation Alert');
  73 |   });
  74 | });
  75 | 
```