import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Terminal,
  RotateCcw,
  Sparkles,
  Copy,
  Check,
  Code2,
  FileJson,
  Layers,
  Send
} from 'lucide-react';

export const TestAutomationGuide: React.FC = () => {
  const {
    resetToDefaultFixtures,
    seedRandomReview,
    triggerPushNotification,
    currentUser,
    logout,
    login,
    isDarkMode,
    toggleDarkMode,
    reviews,
    notifications,
  } = useApp();

  const [copiedSection, setCopiedSection] = useState<string | null>(null);
  const [activeCodeTab, setActiveCodeTab] = useState<'playwright' | 'cypress' | 'selenium'>('playwright');
  const [jsonExported, setJsonExported] = useState<string | null>(null);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(id);
    setTimeout(() => setCopiedSection(null), 2000);
  };

  const handleExportState = () => {
    const state = {
      currentUser,
      reviewsCount: reviews.length,
      reviews,
      notificationsCount: notifications.length,
      notifications,
      isDarkMode,
    };
    const jsonStr = JSON.stringify(state, null, 2);
    setJsonExported(jsonStr);
    copyToClipboard(jsonStr, 'json-state');
  };

  const playwrightSample = `// tests/cinetrack.spec.ts
import { test, expect } from '@playwright/test';

test.describe('CineTrack Core Automation Test Suite', () => {
  test.beforeEach(async ({ page }) => {
    // App opens directly on the Landing / Login page
    await page.goto('http://localhost:3000');
  });

  test('TC01: Verify dark mode toggle on landing page', async ({ page }) => {
    const themeBtn = page.locator('#theme-toggle-button');
    await expect(themeBtn).toBeVisible();
    
    // Toggle theme to dark
    await themeBtn.click();
    await expect(page.locator('html')).toHaveClass(/dark/);
    
    // Toggle back to light
    await themeBtn.click();
  });

  test('TC02: Log in with credentials or demo button from landing page', async ({ page }) => {
    // Verify landing page login form is visible
    await expect(page.locator('#login-form')).toBeVisible();
    
    // Method A: Fill credentials
    await page.fill('#login-email-input', 'alex.rivera@example.com');
    await page.fill('#login-password-input', 'demo1234');
    await page.click('#login-submit-button');

    // Or Method B: Use 1-Click Demo Login
    // await page.click('#demo-user-login-btn');

    // Verify authenticated dashboard is reached
    await expect(page.locator('#overview-dashboard-view')).toBeVisible();
    await expect(page.locator('#nav-user-name')).toContainText('Alex Rivera');
  });

  test('TC03: Write and publish 5-star movie review', async ({ page }) => {
    // Log in first
    await page.click('#demo-user-login-btn');
    
    // Navigate to Write Review tab
    await page.click('#nav-tab-write-review');
    
    // Fill self-inputted movie title and 5-star rating
    await page.fill('#movie-title-input', 'Inception Test');
    await page.click('#star-rating-5');
    await page.fill('#review-text-input', 'Phenomenal screenplay and mind-bending practical effects.');
    await page.click('#submit-review-btn');
    
    // Verify toast notification & review in feed
    await expect(page.locator('#push-toast-container')).toBeVisible();
    await page.click('#nav-tab-reviews');
    await expect(page.locator('text=Inception Test')).toBeVisible();
  });

  test('TC04: Edit profile information and save', async ({ page }) => {
    await page.click('#demo-user-login-btn');
    await page.click('#nav-tab-profile');
    await page.click('#edit-profile-button');
    
    // Update bio
    await page.fill('#edit-bio-input', 'Updated bio from automated Playwright test runner.');
    await page.click('#save-profile-btn');
    
    await expect(page.locator('#profile-bio-display')).toContainText('Updated bio from automated Playwright test runner.');
  });

  test('TC05: Verify real-time push notification dispatch', async ({ page }) => {
    await page.click('#demo-user-login-btn');
    await page.click('#notification-bell-button');
    await page.click('#toggle-simulate-push-form');
    await page.fill('#test-push-title-input', 'Automated Test Notification');
    await page.fill('#test-push-body-input', 'Verifying push reception assertion.');
    await page.click('#dispatch-test-push-btn');
    
    await expect(page.locator('#push-toast-container')).toContainText('Automated Test Notification');
  });
});`;

  const cypressSample = `// cypress/e2e/cinetrack.cy.ts
describe('CineTrack Automation Suite', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000');
  });

  it('verifies landing page and logs in with demo account', () => {
    cy.get('#login-form').should('be.visible');
    cy.get('#demo-user-login-btn').click();
    cy.get('#overview-dashboard-view').should('be.visible');
  });

  it('submits a movie review with 1-5 star rating', () => {
    cy.get('#demo-user-login-btn').click();
    cy.get('#nav-tab-write-review').click();
    cy.get('#movie-title-input').type('Dune Test');
    cy.get('#star-rating-4').click();
    cy.get('#review-text-input').type('Masterpiece sound design and cinematography.');
    cy.get('#submit-review-btn').click();
    cy.get('#push-toast-container').should('be.visible');
  });

  it('edits user profile data', () => {
    cy.get('#demo-user-login-btn').click();
    cy.get('#nav-tab-profile').click();
    cy.get('#edit-profile-button').click();
    cy.get('#edit-name-input').clear().type('Alex Rivera Automation');
    cy.get('#save-profile-btn').click();
    cy.get('#profile-name-display').should('contain', 'Alex Rivera Automation');
  });
});`;

  return (
    <div id="test-automation-hub" data-testid="test-automation-hub" className="space-y-6 max-w-5xl mx-auto">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-amber-500/10 via-amber-600/10 to-orange-500/10 dark:from-amber-950/40 dark:via-amber-900/30 dark:to-zinc-900 border border-amber-200 dark:border-amber-900/60 rounded-3xl p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-amber-500 text-white rounded-2xl shadow-md shadow-amber-500/20">
              <Terminal className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
                Visual Studio Code Test Automation Hub
              </h2>
              <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-0.5">
                Standardized IDs, data-testids, fixture triggers, and ready-to-use runner snippets.
              </p>
            </div>
          </div>

          {/* Quick Action Fixture Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              id="btn-test-reset-fixtures"
              data-testid="btn-test-reset-fixtures"
              onClick={resetToDefaultFixtures}
              className="px-3.5 py-2 text-xs font-semibold bg-white dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 border border-zinc-300 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-750 rounded-xl transition-colors flex items-center gap-1.5 shadow-xs"
            >
              <RotateCcw className="w-3.5 h-3.5 text-amber-500" />
              Reset State Baseline
            </button>

            <button
              id="btn-test-seed-reviews"
              data-testid="btn-test-seed-reviews"
              onClick={seedRandomReview}
              className="px-3.5 py-2 text-xs font-semibold bg-amber-500 hover:bg-amber-600 text-white rounded-xl transition-colors flex items-center gap-1.5 shadow-sm"
            >
              <Sparkles className="w-3.5 h-3.5" />
              + Seed Random Review
            </button>
          </div>
        </div>
      </div>

      {/* Interactive Control Deck */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Test Auth Switcher */}
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5 shadow-xs">
          <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
            <Layers className="w-4 h-4 text-indigo-500" />
            Auth State Switcher
          </h3>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
            Current: {currentUser ? `Signed in as ${currentUser.name}` : 'Signed out'}
          </p>
          <div className="mt-3 flex gap-2">
            {currentUser ? (
              <button
                id="btn-test-logout"
                data-testid="btn-test-logout"
                onClick={logout}
                className="flex-1 py-1.5 px-3 bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 rounded-xl text-xs font-semibold hover:bg-rose-100"
              >
                Trigger Sign Out
              </button>
            ) : (
              <button
                id="btn-test-login-demo"
                data-testid="btn-test-login-demo"
                onClick={() => login('alex.rivera@example.com')}
                className="flex-1 py-1.5 px-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold"
              >
                Log In Demo User
              </button>
            )}
          </div>
        </div>

        {/* Real-time Push Dispatcher */}
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5 shadow-xs">
          <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
            <Send className="w-4 h-4 text-emerald-500" />
            Fire Push Notification
          </h3>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
            Instantly tests toast & in-app notification dispatch.
          </p>
          <div className="mt-3">
            <button
              id="btn-test-fire-push"
              data-testid="btn-test-fire-push"
              onClick={() => triggerPushNotification('Automation Notification', `Test fired at ${new Date().toLocaleTimeString()}`, 'system')}
              className="w-full py-1.5 px-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold transition-colors"
            >
              Trigger Real-Time Push
            </button>
          </div>
        </div>

        {/* State Export */}
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5 shadow-xs">
          <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
            <FileJson className="w-4 h-4 text-amber-500" />
            State Inspector
          </h3>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
            Export current localStorage & memory state as JSON.
          </p>
          <div className="mt-3">
            <button
              id="btn-test-export-json"
              data-testid="btn-test-export-json"
              onClick={handleExportState}
              className="w-full py-1.5 px-3 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-200 rounded-xl text-xs font-semibold transition-colors flex items-center justify-center gap-1.5"
            >
              {copiedSection === 'json-state' ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
              {copiedSection === 'json-state' ? 'State Copied to Clipboard!' : 'Copy State JSON'}
            </button>
          </div>
        </div>
      </div>

      {/* Locator Cheat-Sheet Table */}
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 shadow-xs">
        <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100 mb-4 flex items-center gap-2">
          <Code2 className="w-5 h-5 text-indigo-500" />
          Standardized Test Locators & Selectors Table
        </h3>

        <div className="overflow-x-auto">
          <table id="test-locators-table" data-testid="test-locators-table" className="w-full text-left text-xs">
            <thead className="bg-zinc-50 dark:bg-zinc-800/60 text-zinc-500 dark:text-zinc-400 font-semibold border-b border-zinc-200 dark:border-zinc-700">
              <tr>
                <th className="py-2.5 px-3">Feature Domain</th>
                <th className="py-2.5 px-3">Element ID (#id)</th>
                <th className="py-2.5 px-3">Test ID (data-testid)</th>
                <th className="py-2.5 px-3">Purpose / Expected Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800 font-mono text-[11px]">
              <tr>
                <td className="py-2.5 px-3 font-sans font-medium text-zinc-900 dark:text-zinc-100">Theme</td>
                <td className="py-2.5 px-3 text-indigo-600 dark:text-indigo-400">#theme-toggle-button</td>
                <td className="py-2.5 px-3 text-zinc-600 dark:text-zinc-400">theme-toggle-button</td>
                <td className="py-2.5 px-3 font-sans text-zinc-600 dark:text-zinc-300">Toggles Dark / Light mode class on &lt;html&gt;</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 font-sans font-medium text-zinc-900 dark:text-zinc-100">Movie Review</td>
                <td className="py-2.5 px-3 text-indigo-600 dark:text-indigo-400">#movie-title-input</td>
                <td className="py-2.5 px-3 text-zinc-600 dark:text-zinc-400">movie-title-input</td>
                <td className="py-2.5 px-3 font-sans text-zinc-600 dark:text-zinc-300">Text input for self-inputted movie title</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 font-sans font-medium text-zinc-900 dark:text-zinc-100">Movie Review</td>
                <td className="py-2.5 px-3 text-indigo-600 dark:text-indigo-400">#star-rating-1 .. #star-rating-5</td>
                <td className="py-2.5 px-3 text-zinc-600 dark:text-zinc-400">star-rating-1 .. 5</td>
                <td className="py-2.5 px-3 font-sans text-zinc-600 dark:text-zinc-300">Interactive 1 to 5 star rating selectors</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 font-sans font-medium text-zinc-900 dark:text-zinc-100">Movie Review</td>
                <td className="py-2.5 px-3 text-indigo-600 dark:text-indigo-400">#review-text-input</td>
                <td className="py-2.5 px-3 text-zinc-600 dark:text-zinc-400">review-text-input</td>
                <td className="py-2.5 px-3 font-sans text-zinc-600 dark:text-zinc-300">Textarea for review commentary</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 font-sans font-medium text-zinc-900 dark:text-zinc-100">Movie Review</td>
                <td className="py-2.5 px-3 text-indigo-600 dark:text-indigo-400">#submit-review-btn</td>
                <td className="py-2.5 px-3 text-zinc-600 dark:text-zinc-400">submit-review-btn</td>
                <td className="py-2.5 px-3 font-sans text-zinc-600 dark:text-zinc-300">Submits review and triggers push toast</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 font-sans font-medium text-zinc-900 dark:text-zinc-100">User Profile</td>
                <td className="py-2.5 px-3 text-indigo-600 dark:text-indigo-400">#edit-profile-button</td>
                <td className="py-2.5 px-3 text-zinc-600 dark:text-zinc-400">edit-profile-button</td>
                <td className="py-2.5 px-3 font-sans text-zinc-600 dark:text-zinc-300">Opens profile edit modal dialog</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 font-sans font-medium text-zinc-900 dark:text-zinc-100">User Profile</td>
                <td className="py-2.5 px-3 text-indigo-600 dark:text-indigo-400">#edit-name-input / #save-profile-btn</td>
                <td className="py-2.5 px-3 text-zinc-600 dark:text-zinc-400">edit-name-input / save-profile-btn</td>
                <td className="py-2.5 px-3 font-sans text-zinc-600 dark:text-zinc-300">Updates profile data & persists changes</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 font-sans font-medium text-zinc-900 dark:text-zinc-100">Push Alerts</td>
                <td className="py-2.5 px-3 text-indigo-600 dark:text-indigo-400">#notification-bell-button</td>
                <td className="py-2.5 px-3 text-zinc-600 dark:text-zinc-400">notification-bell-button</td>
                <td className="py-2.5 px-3 font-sans text-zinc-600 dark:text-zinc-300">Opens notification center & unread badge</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 font-sans font-medium text-zinc-900 dark:text-zinc-100">Push Alerts</td>
                <td className="py-2.5 px-3 text-indigo-600 dark:text-indigo-400">#push-toast-container</td>
                <td className="py-2.5 px-3 text-zinc-600 dark:text-zinc-400">push-toast-container</td>
                <td className="py-2.5 px-3 font-sans text-zinc-600 dark:text-zinc-300">Real-time push notification toaster banner</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 font-sans font-medium text-zinc-900 dark:text-zinc-100">Auth Flow</td>
                <td className="py-2.5 px-3 text-indigo-600 dark:text-indigo-400">#login-email-input / #login-password-input</td>
                <td className="py-2.5 px-3 text-zinc-600 dark:text-zinc-400">login-email-input / login-password-input</td>
                <td className="py-2.5 px-3 font-sans text-zinc-600 dark:text-zinc-300">Login form inputs & validation</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Copy-Paste Ready Automation Code */}
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-zinc-100 dark:border-zinc-800">
          <div>
            <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
              Ready-to-Run Test Automation Template
            </h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              Copy and paste directly into your VS Code test directory.
            </p>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setActiveCodeTab('playwright')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${
                activeCodeTab === 'playwright'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300'
              }`}
            >
              Playwright (TS)
            </button>
            <button
              onClick={() => setActiveCodeTab('cypress')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${
                activeCodeTab === 'cypress'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300'
              }`}
            >
              Cypress (TS)
            </button>
          </div>
        </div>

        <div className="mt-4 relative">
          <button
            onClick={() => copyToClipboard(activeCodeTab === 'playwright' ? playwrightSample : cypressSample, 'code-sample')}
            className="absolute top-3 right-3 px-3 py-1.5 bg-zinc-800 text-zinc-200 hover:bg-zinc-700 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors z-10"
          >
            {copiedSection === 'code-sample' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            {copiedSection === 'code-sample' ? 'Copied!' : 'Copy Code'}
          </button>
          <pre className="p-4 rounded-xl bg-zinc-950 text-zinc-200 text-xs font-mono overflow-x-auto max-h-96 leading-relaxed">
            <code>{activeCodeTab === 'playwright' ? playwrightSample : cypressSample}</code>
          </pre>
        </div>
      </div>
    </div>
  );
};
