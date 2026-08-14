import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import {
  Film,
  Moon,
  Sun,
  Bell,
  User,
  PlusCircle,
  LogOut,
  LogIn,
  UserPlus,
  Terminal,
  Clapperboard,
  LayoutDashboard
} from 'lucide-react';
import { NotificationCenter } from './NotificationCenter';

export const Navbar: React.FC = () => {
  const {
    currentUser,
    isAuthenticated,
    activeTab,
    setActiveTab,
    isDarkMode,
    toggleDarkMode,
    unreadNotificationCount,
    logout,
    setIsAuthModalOpen,
    setAuthMode,
  } = useApp();

  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  // Close menus on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setIsNotifOpen(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-zinc-200 dark:border-zinc-800 bg-white/90 dark:bg-zinc-950/90 backdrop-blur-md transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand Logo & Name */}
        <div className="flex items-center gap-6">
          <button
            id="brand-logo-btn"
            data-testid="brand-logo-btn"
            onClick={() => setActiveTab('dashboard')}
            className="flex items-center gap-2.5 group text-left focus:outline-none"
          >
            <div className="w-10 h-10 rounded-xl bg-indigo-600 dark:bg-indigo-500 text-white flex items-center justify-center shadow-md shadow-indigo-600/20 group-hover:scale-105 transition-transform">
              <Film className="w-5 h-5" />
            </div>
            <div>
              <span className="font-bold text-lg tracking-tight text-zinc-900 dark:text-zinc-100 flex items-center gap-1.5">
                CineTrack
                <span className="text-[10px] px-1.5 py-0.5 rounded-full font-semibold uppercase tracking-wider bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
                  App
                </span>
              </span>
              <p className="text-[11px] text-zinc-500 dark:text-zinc-400 -mt-0.5">
                Reviews & Profile Suite
              </p>
            </div>
          </button>

          {/* Navigation Links Desktop */}
          <nav id="desktop-nav" data-testid="desktop-nav" className="hidden md:flex items-center gap-1">
            <button
              id="nav-tab-dashboard"
              data-testid="nav-tab-dashboard"
              onClick={() => setActiveTab('dashboard')}
              className={`px-3 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                activeTab === 'dashboard'
                  ? 'bg-zinc-100 text-indigo-600 dark:bg-zinc-800 dark:text-indigo-400'
                  : 'text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 hover:bg-zinc-50 dark:hover:bg-zinc-850'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              Dashboard
            </button>

            <button
              id="nav-tab-reviews"
              data-testid="nav-tab-reviews"
              onClick={() => setActiveTab('reviews')}
              className={`px-3 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                activeTab === 'reviews'
                  ? 'bg-zinc-100 text-indigo-600 dark:bg-zinc-800 dark:text-indigo-400'
                  : 'text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 hover:bg-zinc-50 dark:hover:bg-zinc-850'
              }`}
            >
              <Clapperboard className="w-4 h-4" />
              Movie Reviews
            </button>

            <button
              id="nav-tab-write-review"
              data-testid="nav-tab-write-review"
              onClick={() => setActiveTab('write-review')}
              className={`px-3 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                activeTab === 'write-review'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/50'
              }`}
            >
              <PlusCircle className="w-4 h-4" />
              Write Review
            </button>

            {isAuthenticated && (
              <button
                id="nav-tab-profile"
                data-testid="nav-tab-profile"
                onClick={() => setActiveTab('profile')}
                className={`px-3 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                  activeTab === 'profile'
                    ? 'bg-zinc-100 text-indigo-600 dark:bg-zinc-800 dark:text-indigo-400'
                    : 'text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 hover:bg-zinc-50 dark:hover:bg-zinc-850'
                }`}
              >
                <User className="w-4 h-4" />
                Profile
              </button>
            )}

            <button
              id="nav-tab-test-suite"
              data-testid="nav-tab-test-suite"
              onClick={() => setActiveTab('test-suite')}
              className={`px-3 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                activeTab === 'test-suite'
                  ? 'bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-300'
                  : 'text-zinc-500 hover:text-amber-700 dark:text-zinc-400 dark:hover:text-amber-400 hover:bg-amber-50/50 dark:hover:bg-amber-950/30'
              }`}
            >
              <Terminal className="w-3.5 h-3.5" />
              Test Automation Hub
            </button>
          </nav>
        </div>

        {/* Right Header Action Items */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Dark Mode Toggle */}
          <button
            id="theme-toggle-button"
            data-testid="theme-toggle-button"
            data-theme={isDarkMode ? 'dark' : 'light'}
            onClick={toggleDarkMode}
            aria-label={`Switch to ${isDarkMode ? 'light' : 'dark'} mode`}
            title={`Switch to ${isDarkMode ? 'light' : 'dark'} mode`}
            className="p-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
          >
            {isDarkMode ? (
              <Sun id="sun-icon" data-testid="sun-icon" className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon id="moon-icon" data-testid="moon-icon" className="w-4 h-4 text-indigo-600" />
            )}
          </button>

          {/* Real-Time Push Notification Bell */}
          <div className="relative" ref={notifRef}>
            <button
              id="notification-bell-button"
              data-testid="notification-bell-button"
              onClick={() => setIsNotifOpen(!isNotifOpen)}
              aria-label="View notifications"
              className="p-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors relative"
            >
              <Bell className="w-4 h-4" />
              {unreadNotificationCount > 0 && (
                <span
                  id="notification-badge"
                  data-testid="notification-badge"
                  className="absolute -top-1 -right-1 px-1.5 py-0.5 text-[10px] font-bold bg-rose-500 text-white rounded-full min-w-[18px] text-center shadow-sm animate-pulse"
                >
                  {unreadNotificationCount}
                </span>
              )}
            </button>

            <NotificationCenter isOpen={isNotifOpen} onClose={() => setIsNotifOpen(false)} />
          </div>

          {/* User Profile / Auth State Controls */}
          {isAuthenticated && currentUser ? (
            <div className="relative" ref={userMenuRef}>
              <button
                id="user-profile-menu-button"
                data-testid="user-profile-menu-button"
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center gap-2 p-1.5 sm:px-3 sm:py-1.5 rounded-xl border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
              >
                <img
                  id="nav-user-avatar"
                  data-testid="nav-user-avatar"
                  src={currentUser.avatarUrl}
                  alt={currentUser.name}
                  className="w-7 h-7 rounded-lg object-cover border border-zinc-200 dark:border-zinc-700"
                />
                <span
                  id="nav-user-name"
                  data-testid="nav-user-name"
                  className="hidden sm:inline text-xs font-semibold text-zinc-900 dark:text-zinc-100 max-w-[100px] truncate"
                >
                  {currentUser.name}
                </span>
              </button>

              {/* User Dropdown */}
              {isUserMenuOpen && (
                <div
                  id="user-dropdown-menu"
                  data-testid="user-dropdown-menu"
                  className="absolute right-0 top-full mt-2 w-56 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-xl shadow-zinc-950/20 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150"
                >
                  <div className="px-4 py-2 border-b border-zinc-100 dark:border-zinc-800">
                    <p className="text-xs font-semibold text-zinc-900 dark:text-zinc-100 truncate">
                      {currentUser.name}
                    </p>
                    <p className="text-[11px] text-zinc-500 dark:text-zinc-400 truncate">
                      {currentUser.email}
                    </p>
                  </div>

                  <button
                    id="dropdown-profile-btn"
                    data-testid="dropdown-profile-btn"
                    onClick={() => {
                      setActiveTab('profile');
                      setIsUserMenuOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 text-xs text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 flex items-center gap-2"
                  >
                    <User className="w-3.5 h-3.5" />
                    View & Edit Profile
                  </button>

                  <button
                    id="dropdown-write-review-btn"
                    data-testid="dropdown-write-review-btn"
                    onClick={() => {
                      setActiveTab('write-review');
                      setIsUserMenuOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 text-xs text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 flex items-center gap-2"
                  >
                    <PlusCircle className="w-3.5 h-3.5" />
                    Write a Movie Review
                  </button>

                  <div className="my-1 border-t border-zinc-100 dark:border-zinc-800" />

                  <button
                    id="logout-button"
                    data-testid="logout-button"
                    onClick={() => {
                      logout();
                      setIsUserMenuOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 text-xs text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 flex items-center gap-2 font-medium"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button
                id="header-login-btn"
                data-testid="header-login-btn"
                onClick={() => {
                  setAuthMode('login');
                  setIsAuthModalOpen(true);
                }}
                className="px-3 py-1.5 text-xs font-semibold text-zinc-700 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-xl transition-colors flex items-center gap-1"
              >
                <LogIn className="w-3.5 h-3.5" />
                Sign In
              </button>
              <button
                id="header-signup-btn"
                data-testid="header-signup-btn"
                onClick={() => {
                  setAuthMode('signup');
                  setIsAuthModalOpen(true);
                }}
                className="px-3 py-1.5 text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-sm transition-colors flex items-center gap-1"
              >
                <UserPlus className="w-3.5 h-3.5" />
                Sign Up
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Tab Bar */}
      <div className="md:hidden flex border-t border-zinc-200 dark:border-zinc-800 px-2 py-1.5 gap-1 overflow-x-auto bg-zinc-50/80 dark:bg-zinc-900/80">
        <button
          id="mobile-tab-dashboard"
          data-testid="mobile-tab-dashboard"
          onClick={() => setActiveTab('dashboard')}
          className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-medium text-center whitespace-nowrap ${
            activeTab === 'dashboard'
              ? 'bg-white dark:bg-zinc-800 text-indigo-600 dark:text-indigo-400 font-semibold shadow-xs'
              : 'text-zinc-600 dark:text-zinc-400'
          }`}
        >
          Dashboard
        </button>
        <button
          id="mobile-tab-reviews"
          data-testid="mobile-tab-reviews"
          onClick={() => setActiveTab('reviews')}
          className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-medium text-center whitespace-nowrap ${
            activeTab === 'reviews'
              ? 'bg-white dark:bg-zinc-800 text-indigo-600 dark:text-indigo-400 font-semibold shadow-xs'
              : 'text-zinc-600 dark:text-zinc-400'
          }`}
        >
          Reviews
        </button>
        <button
          id="mobile-tab-write-review"
          data-testid="mobile-tab-write-review"
          onClick={() => setActiveTab('write-review')}
          className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-medium text-center whitespace-nowrap ${
            activeTab === 'write-review'
              ? 'bg-indigo-600 text-white font-semibold'
              : 'text-indigo-600 dark:text-indigo-400'
          }`}
        >
          + Review
        </button>
        {isAuthenticated && (
          <button
            id="mobile-tab-profile"
            data-testid="mobile-tab-profile"
            onClick={() => setActiveTab('profile')}
            className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-medium text-center whitespace-nowrap ${
              activeTab === 'profile'
                ? 'bg-white dark:bg-zinc-800 text-indigo-600 dark:text-indigo-400 font-semibold shadow-xs'
                : 'text-zinc-600 dark:text-zinc-400'
            }`}
          >
            Profile
          </button>
        )}
        <button
          id="mobile-tab-test-suite"
          data-testid="mobile-tab-test-suite"
          onClick={() => setActiveTab('test-suite')}
          className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-medium text-center whitespace-nowrap ${
            activeTab === 'test-suite'
              ? 'bg-amber-100 dark:bg-amber-950 text-amber-900 dark:text-amber-300 font-semibold'
              : 'text-amber-700 dark:text-amber-400'
          }`}
        >
          Automation
        </button>
      </div>
    </header>
  );
};
