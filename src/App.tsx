import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { PushToast } from './components/PushToast';
import { AuthModal } from './components/AuthModal';
import { OverviewDashboard } from './components/OverviewDashboard';
import { MovieReviewsList } from './components/MovieReviewsList';
import { MovieReviewForm } from './components/MovieReviewForm';
import { ProfileDashboard } from './components/ProfileDashboard';
import { TestAutomationGuide } from './components/TestAutomationGuide';

const MainAppContent: React.FC = () => {
  const { activeTab, setActiveTab } = useApp();

  return (
    <div className="min-h-screen flex flex-col bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 transition-colors">
      {/* Top Navigation */}
      <Navbar />

      {/* Main Viewport */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'dashboard' && <OverviewDashboard />}
        {activeTab === 'reviews' && <MovieReviewsList />}
        {activeTab === 'write-review' && (
          <MovieReviewForm onSuccess={() => setActiveTab('reviews')} />
        )}
        {activeTab === 'profile' && <ProfileDashboard />}
        {activeTab === 'test-suite' && <TestAutomationGuide />}
      </main>

      {/* Global Real-Time Push Toast Layer */}
      <PushToast />

      {/* Global Auth Modal */}
      <AuthModal />

      {/* Minimal Footer */}
      <footer className="border-t border-zinc-200 dark:border-zinc-800 bg-white/50 dark:bg-zinc-900/50 py-6 text-xs text-zinc-500 dark:text-zinc-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-zinc-700 dark:text-zinc-300">CineTrack</span>
            <span>•</span>
            <span>Movie Reviews, Profile Dashboard & Automated Testing Suite</span>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setActiveTab('test-suite')}
              className="text-indigo-600 dark:text-indigo-400 hover:underline font-medium"
            >
              Test Automation Locators
            </button>
            <span>•</span>
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="hover:underline"
            >
              Back to Top
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainAppContent />
    </AppProvider>
  );
}
