import React from 'react';
import { useApp } from '../context/AppContext';
import {
  Film,
  Star,
  PlusCircle,
  TrendingUp,
  Sparkles,
  Heart,
  ArrowRight,
  ShieldCheck,
  Moon,
  Sun,
  Bell
} from 'lucide-react';

export const OverviewDashboard: React.FC = () => {
  const {
    currentUser,
    reviews,
    setActiveTab,
    setIsAuthModalOpen,
    setAuthMode,
    isDarkMode,
    toggleDarkMode,
    triggerPushNotification,
  } = useApp();

  const totalReviews = reviews.length;
  const fiveStarReviews = reviews.filter((r) => r.rating === 5).length;
  const recentReviews = reviews.slice(0, 3);

  return (
    <div id="overview-dashboard-view" data-testid="overview-dashboard-view" className="space-y-8 max-w-6xl mx-auto">
      {/* Welcome Banner */}
      <section
        id="dashboard-hero-banner"
        data-testid="dashboard-hero-banner"
        className="relative overflow-hidden bg-gradient-to-br from-indigo-900 via-indigo-800 to-zinc-900 rounded-3xl p-6 sm:p-10 text-white shadow-xl shadow-indigo-950/20"
      >
        {/* Glow orbs */}
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 -mb-16 w-48 h-48 bg-purple-500/20 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="max-w-2xl space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs font-semibold text-indigo-200">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Movie Reviews & Profile Hub</span>
            </div>

            <h1
              id="hero-greeting-title"
              data-testid="hero-greeting-title"
              className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight"
            >
              {currentUser ? `Welcome back, ${currentUser.name}!` : 'Track Films & Write 1-5 Star Reviews'}
            </h1>

            <p className="text-sm text-indigo-100/80 leading-relaxed max-w-xl">
              Rate movies from 1 to 5 stars, update your user profile data in real-time, toggle dark mode, and verify all flows with automated test suites.
            </p>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              id="hero-write-review-btn"
              data-testid="hero-write-review-btn"
              onClick={() => setActiveTab('write-review')}
              className="px-5 py-2.5 bg-white hover:bg-zinc-100 text-indigo-900 rounded-xl font-bold text-xs shadow-lg transition-transform active:scale-95 flex items-center gap-2"
            >
              <PlusCircle className="w-4 h-4 text-indigo-600" />
              Log Movie Review
            </button>

            {currentUser ? (
              <button
                id="hero-view-profile-btn"
                data-testid="hero-view-profile-btn"
                onClick={() => setActiveTab('profile')}
                className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-xl font-semibold text-xs transition-colors flex items-center gap-1.5"
              >
                View Profile
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                id="hero-signin-btn"
                data-testid="hero-signin-btn"
                onClick={() => {
                  setAuthMode('login');
                  setIsAuthModalOpen(true);
                }}
                className="px-4 py-2.5 bg-indigo-500 hover:bg-indigo-400 text-white rounded-xl font-semibold text-xs transition-colors"
              >
                Sign In
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Quick Status Highlights */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Reviews */}
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5 shadow-xs">
          <div className="flex items-center justify-between text-zinc-500">
            <span className="text-xs font-semibold uppercase tracking-wider">Total Reviews</span>
            <div className="p-2 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 rounded-lg">
              <Film className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span id="overview-stat-total-reviews" data-testid="overview-stat-total-reviews" className="text-3xl font-extrabold text-zinc-900 dark:text-zinc-100">
              {totalReviews}
            </span>
            <span className="text-xs text-zinc-500">films logged</span>
          </div>
        </div>

        {/* 5-Star Masterpieces */}
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5 shadow-xs">
          <div className="flex items-center justify-between text-zinc-500">
            <span className="text-xs font-semibold uppercase tracking-wider">5-Star Masterpieces</span>
            <div className="p-2 bg-amber-50 dark:bg-amber-950/60 text-amber-500 rounded-lg">
              <Star className="w-4 h-4 fill-amber-400" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span id="overview-stat-five-stars" data-testid="overview-stat-five-stars" className="text-3xl font-extrabold text-zinc-900 dark:text-zinc-100">
              {fiveStarReviews}
            </span>
            <span className="text-xs text-zinc-500">top ratings</span>
          </div>
        </div>

        {/* Theme State Card */}
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-zinc-500">
            <span className="text-xs font-semibold uppercase tracking-wider">Theme Mode</span>
            <div className="p-2 bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 rounded-lg">
              {isDarkMode ? <Moon className="w-4 h-4 text-indigo-400" /> : <Sun className="w-4 h-4 text-amber-500" />}
            </div>
          </div>
          <div className="mt-3 flex items-center justify-between">
            <span id="overview-theme-label" data-testid="overview-theme-label" className="text-sm font-bold text-zinc-900 dark:text-zinc-100 capitalize">
              {isDarkMode ? 'Dark Mode Active' : 'Light Mode Active'}
            </span>
            <button
              onClick={toggleDarkMode}
              className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold hover:underline"
            >
              Toggle
            </button>
          </div>
        </div>

        {/* Push Notification Tester */}
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-zinc-500">
            <span className="text-xs font-semibold uppercase tracking-wider">Push Dispatcher</span>
            <div className="p-2 bg-rose-50 dark:bg-rose-950/60 text-rose-600 rounded-lg">
              <Bell className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <button
              id="overview-test-push-btn"
              data-testid="overview-test-push-btn"
              onClick={() => triggerPushNotification('CineTrack Instant Alert', 'Real-time push notification test received successfully!', 'system')}
              className="w-full py-1.5 px-3 bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/60 dark:hover:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 rounded-lg text-xs font-semibold transition-colors"
            >
              Fire Test Push
            </button>
          </div>
        </div>
      </section>

      {/* Recent Reviews Preview */}
      <section className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-xs">
        <div className="flex items-center justify-between pb-4 border-b border-zinc-100 dark:border-zinc-800">
          <div>
            <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
              Latest Movie Reviews
            </h2>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              Recent ratings and reviews submitted by users.
            </p>
          </div>
          <button
            id="view-all-reviews-btn"
            data-testid="view-all-reviews-btn"
            onClick={() => setActiveTab('reviews')}
            className="px-3.5 py-1.5 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 rounded-xl transition-colors flex items-center gap-1"
          >
            View All Reviews ({reviews.length})
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          {recentReviews.map((review) => (
            <div
              key={review.id}
              id={`overview-review-card-${review.id}`}
              data-testid="overview-review-card"
              className="p-5 rounded-2xl bg-zinc-50/70 dark:bg-zinc-800/40 border border-zinc-200/80 dark:border-zinc-700/60 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 line-clamp-1">
                    {review.movieTitle}
                  </h3>
                  <div className="flex items-center gap-0.5 text-amber-500 shrink-0">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    <span className="text-xs font-bold">{review.rating}.0</span>
                  </div>
                </div>

                <p className="text-xs text-zinc-600 dark:text-zinc-300 mt-2 line-clamp-3 leading-relaxed">
                  {review.reviewText}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-zinc-200/60 dark:border-zinc-700/40 flex items-center justify-between text-[11px] text-zinc-500 dark:text-zinc-400">
                <span>By {review.authorName}</span>
                <span className="flex items-center gap-1 text-rose-500">
                  <Heart className="w-3 h-3 fill-rose-500" />
                  {review.likesCount}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
