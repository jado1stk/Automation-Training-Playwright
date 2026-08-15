# CI/CD Pipeline Quick Start Guide

## Overview

The CineTrack project now includes an automated CI/CD pipeline using GitHub Actions that runs comprehensive E2E tests on every push and pull request.

## What's Included

### 1. GitHub Actions Workflow
**File**: `.github/workflows/e2e-tests.yml`

The workflow automatically:
- Runs E2E tests on push to `main` or `develop` branches
- Runs E2E tests on pull requests
- Runs daily scheduled tests against the AI Studio environment
- Tests across 3 browsers (Chromium, Firefox, WebKit)
- Publishes test results and artifacts
- Posts status updates to PRs

### 2. Updated Playwright Configuration
**File**: `playwright.config.ts`

Enhanced configuration supports:
- **Multiple environments**: Local dev and AI Studio production
- **Environment variables**: `BASE_URL`, `HEADED`, `CI`
- **Multi-browser testing**: Chromium, Firefox, WebKit
- **Multiple reporters**: HTML, JSON, JUnit XML
- **Artifact capture**: Screenshots, videos, traces
- **Flexible execution**: Local, CI, headed, and headless modes

### 3. Comprehensive Test Suite
**Files**: 
- `tests/profile.spec.ts` - Profile management (9 tests)
- `tests/reviews-form.spec.ts` - Review submission (17 tests)
- `tests/reviews-feed.spec.ts` - Feed interactions (29 tests)
- `tests/notifications.spec.ts` - Notifications (28 tests)
- `tests/theme.spec.ts` - Theme switching (27 tests)
- `tests/fixtures.spec.ts` - Test fixtures (20 tests)

**Total**: 130+ test cases covering all major features

## Quick Start

### 1. Push Your Code to GitHub

Make sure your repository is pushed to GitHub:

```bash
git remote add origin https://github.com/YOUR_USERNAME/AutomationPracticing.git
git branch -M main
git push -u origin main
```

### 2. Enable GitHub Actions

1. Go to your repository on GitHub
2. Click **Settings** → **Actions** → **General**
3. Ensure "Allow all actions and reusable workflows" is selected
4. Click **Save**

### 3. Run Tests Locally (Before Committing)

```bash
# Install dependencies
npm install

# Run all tests (local dev server)
npm test

# Or run against AI Studio
BASE_URL=https://cinetrack-automation.ai.studio npm test

# Run specific test file
npx playwright test profile.spec.ts

# Run in headed mode to watch browser
HEADED=true npx playwright test
```

### 4. View Workflow Results

After pushing, tests will run automatically:

1. Go to your GitHub repository
2. Click **Actions** tab
3. Click on the workflow run
4. View test results and download artifacts

## Common Commands

### Run Tests Locally
```bash
# All tests
npm test

# Specific file
npx playwright test profile.spec.ts

# Specific test
npx playwright test -g "displays user profile"

# In headed mode
HEADED=true npm test

# Against AI Studio
BASE_URL=https://cinetrack-automation.ai.studio npm test

# Debug mode
npx playwright test --debug
```

### View Reports
```bash
# HTML report
npx playwright show-report

# Open test results
open playwright-report/index.html
```

## Workflow Triggers

### Push Trigger
Runs when you push commits to `main` or `develop`:
```bash
git commit -m "Add new feature"
git push origin main
```

### Pull Request Trigger
Runs automatically when you create a PR to `main` or `develop`

### Scheduled Trigger
Runs daily at **2 AM UTC** testing against the AI Studio environment
- Helps catch environment-specific issues
- Alerts if production environment has problems

## Understanding Workflow Jobs

### 1. `test` Job
- Runs Playwright tests on 3 browsers
- Uploads test reports and artifacts
- Fails if any test fails (blocking PR merge)

### 2. `test-summary` Job
- Downloads all test artifacts
- Publishes results as GitHub check
- Runs only after `test` job completes

### 3. `notify` Job
- Posts results to PR comments
- Checks final test status
- Alerts developers of failures

## Viewing Test Results

### In GitHub UI

**After workflow completes:**

1. Go to **Actions** tab
2. Click on the workflow run
3. View summary or individual job details
4. Download artifacts

**Test artifacts include:**
- HTML report (interactive)
- JSON results
- JUnit XML (for CI integration)
- Screenshots of failures
- Videos of failed tests

### HTML Report (Recommended)

```bash
# Download artifact from GitHub, then:
unzip artifact.zip
open playwright-report/index.html
```

The HTML report shows:
- ✅ Passed tests
- ❌ Failed tests with screenshots
- ⏱️ Execution times
- 📊 Statistics by browser/test file
- 🎬 Video playback of failures

## Debugging Failed Tests

### 1. Check Workflow Logs
- Go to **Actions** → **Workflow Run**
- Click **job name** to see detailed output
- Look for error messages and stack traces

### 2. Download Artifacts
- Go to workflow run details
- Scroll to "Artifacts" section
- Download test results and screenshots

### 3. Run Locally with Same Configuration
```bash
# Run same test that failed in CI
npx playwright test profile.spec.ts -g "specific test name"

# Run in headed mode to watch
HEADED=true npx playwright test profile.spec.ts -g "specific test name"

# Enable debug mode
npx playwright test --debug
```

### 4. Check Screenshots/Videos
Failed tests automatically capture:
- Screenshots: `test-results/output/`
- Videos: `test-results/output/` (failed tests only)

## Configuration Details

### Browser Matrix
The workflow tests on:
- **Chromium** - Primary browser
- **Firefox** - Compatibility
- **WebKit** - Safari compatibility

### Node Versions
Currently tests on:
- **Node.js 18.x** (LTS)

To add more versions, edit workflow:
```yaml
strategy:
  matrix:
    node-version: [16.x, 18.x, 20.x]  # Add versions
```

### Retry Strategy
- **Local**: No retries (fail fast for development)
- **CI**: 2 retries (account for flaky tests)
- **Timeout**: 30 minutes per job

## Customizing the Workflow

### Change Test Timeout
Edit `.github/workflows/e2e-tests.yml`:
```yaml
timeout-minutes: 60  # Change from 30
```

### Add Another Environment
Edit `.github/workflows/e2e-tests.yml`:
```yaml
- name: Run E2E tests - Staging
  if: github.event_name == 'schedule'
  run: npx playwright test
  env:
    BASE_URL: https://cinetrack-staging.ai.studio
```

### Add Slack Notifications
1. Create Slack webhook
2. Add step to workflow:
```yaml
- name: Notify Slack
  uses: slackapi/slack-github-action@v1
  with:
    payload: |
      {
        "text": "Tests ${{ job.status }}"
      }
```

### Add Report Upload to Cloud
After `Upload test report` step, add:
```yaml
- name: Upload to S3
  uses: jakejarvis/s3-sync-action@master
  with:
    args: --acl public-read --follow-symlinks --delete
    AWS_S3_BUCKET: ${{ secrets.AWS_S3_BUCKET }}
    AWS_ACCESS_KEY_ID: ${{ secrets.AWS_ACCESS_KEY_ID }}
    AWS_SECRET_ACCESS_KEY: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
```

## Monitoring & Alerts

### GitHub Status Checks
- Blocks PR merge if tests fail
- Shows status with ✅ or ❌
- Click for detailed results

### Badge (Add to README)
```markdown
![Tests](https://github.com/YOUR_USERNAME/AutomationPracticing/workflows/Playwright%20Tests%20-%20CineTrack/badge.svg)
```

### Email Notifications
GitHub automatically emails on:
- Workflow failures
- Failed CI check
- Scheduled test failures

### Setup: Go to repository Settings → Notifications

## Best Practices

1. **Commit Small Changes**
   - Smaller commits = easier to debug if tests fail
   - Run tests locally before pushing

2. **Branch Strategy**
   - Create feature branches for new work
   - Use PR for code review before merge
   - Tests run automatically on PR

3. **Monitor CI Health**
   - Check Actions tab regularly
   - Fix failing tests promptly
   - Don't merge failing tests to main

4. **Keep Tests Updated**
   - Update tests when app changes
   - Remove flaky tests or debug them
   - Add tests for new features

5. **Optimize CI Performance**
   - Parallel execution where possible (already configured)
   - Disable unnecessary reporters
   - Use retries strategically

## Troubleshooting

### Workflow Won't Start
- ✅ Check that GitHub Actions is enabled in Settings
- ✅ Verify workflow file syntax
- ✅ Check branch name matches trigger (main/develop)

### All Tests Fail in CI but Pass Locally
- ✅ Check `BASE_URL` environment variable
- ✅ Verify app is deployed to the URL
- ✅ Check for CI-specific environment issues
- ✅ Test against AI Studio: `BASE_URL=https://cinetrack-automation.ai.studio`

### Tests Timeout in CI
- ✅ Increase timeout in playwright.config.ts
- ✅ Reduce parallel workers (already set to 1)
- ✅ Check if app is slow to respond
- ✅ Add explicit waits in slow tests

### Artifacts Not Uploading
- ✅ Check available storage quota
- ✅ Verify workflow has write permissions
- ✅ Check artifact path is correct

### Email Notifications Disabled
- Go to repository **Settings** → **Notifications**
- Enable desired notification types
- Check GitHub account notification settings

## Next Steps

1. **Push code to GitHub**
   ```bash
   git push origin main
   ```

2. **Watch first workflow run**
   - Go to Actions tab
   - Click on workflow run
   - Monitor execution

3. **Review test results**
   - Download HTML report
   - Check for any failures
   - Fix issues if needed

4. **Set up monitoring**
   - Add badge to README
   - Configure Slack notifications (optional)
   - Set up email alerts

5. **Integrate with other tools**
   - Add to code coverage tools
   - Connect to project management
   - Integrate with deployment pipeline

## Resources

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Playwright CI Guide](https://playwright.dev/docs/ci)
- [Playwright Debugging](https://playwright.dev/docs/debug)
- [CineTrack Test Suite Documentation](./TEST_CASES.md)

## Support

For issues or questions:
1. Check workflow logs in GitHub Actions
2. Review error messages and screenshots
3. Run tests locally for reproduction
4. Consult Playwright documentation
5. Check test file comments for specific test details
