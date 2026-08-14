import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { AVAILABLE_GENRES } from '../data/seedData';
import {
  Film,
  LogIn,
  UserPlus,
  KeyRound,
  Mail,
  User,
  Sparkles,
  Star,
  CheckCircle2,
  AlertCircle,
  Moon,
  Sun,
  ShieldCheck,
  Clapperboard,
  Terminal,
  ArrowRight
} from 'lucide-react';

export const LandingLoginPage: React.FC = () => {
  const {
    login,
    signup,
    authMode,
    setAuthMode,
    isDarkMode,
    toggleDarkMode,
    setActiveTab,
  } = useApp();

  // Login form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [loginError, setLoginError] = useState<string | null>(null);

  // Sign up form state
  const [signupName, setSignupName] = useState('');
  const [signupUsername, setSignupUsername] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupConfirmPassword, setSignupConfirmPassword] = useState('');
  const [selectedGenres, setSelectedGenres] = useState<string[]>(['Sci-Fi', 'Drama']);
  const [agreeTerms, setAgreeTerms] = useState(true);
  const [signupError, setSignupError] = useState<string | null>(null);

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    if (!loginEmail.trim()) {
      setLoginError('Please enter your email address or username.');
      return;
    }
    const result = login(loginEmail, loginPassword);
    if (!result.success) {
      setLoginError(result.error || 'Authentication failed. Please check your credentials.');
    } else {
      setActiveTab('dashboard');
    }
  };

  const handleQuickDemoLogin = () => {
    setLoginError(null);
    const result = login('alex.rivera@example.com', 'demo1234');
    if (result.success) {
      setActiveTab('dashboard');
    }
  };

  const handleGenreToggle = (genre: string) => {
    if (selectedGenres.includes(genre)) {
      setSelectedGenres(selectedGenres.filter((g) => g !== genre));
    } else {
      setSelectedGenres([...selectedGenres, genre]);
    }
  };

  const handleSignupSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSignupError(null);

    if (!signupName.trim()) {
      setSignupError('Full name is required.');
      return;
    }
    if (!signupEmail.trim() || !signupEmail.includes('@')) {
      setSignupError('A valid email address is required.');
      return;
    }
    if (signupPassword.length < 4) {
      setSignupError('Password must be at least 4 characters.');
      return;
    }
    if (signupPassword !== signupConfirmPassword) {
      setSignupError('Passwords do not match.');
      return;
    }
    if (!agreeTerms) {
      setSignupError('Please accept the Terms of Service to proceed.');
      return;
    }

    const result = signup(
      {
        name: signupName,
        username: signupUsername || signupEmail.split('@')[0],
        email: signupEmail,
        favoriteGenres: selectedGenres,
      },
      signupPassword
    );

    if (!result.success) {
      setSignupError(result.error || 'Registration failed.');
    } else {
      setActiveTab('dashboard');
    }
  };

  return (
    <div id="landing-login-page" data-testid="landing-login-page" className="min-h-screen flex flex-col justify-between bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 transition-colors">
      {/* Top Header Bar */}
      <header className="w-full border-b border-zinc-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md px-4 sm:px-8 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-indigo-600 dark:bg-indigo-500 text-white flex items-center justify-center shadow-md shadow-indigo-600/20">
            <Film className="w-5 h-5" />
          </div>
          <div>
            <span className="font-extrabold text-base tracking-tight text-zinc-900 dark:text-zinc-100 flex items-center gap-1.5">
              CineTrack
              <span className="text-[10px] px-1.5 py-0.5 rounded-full font-bold uppercase tracking-wider bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
                Portal
              </span>
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          {/* Dark Mode Toggle */}
          <button
            id="theme-toggle-button"
            data-testid="theme-toggle-button"
            data-theme={isDarkMode ? 'dark' : 'light'}
            onClick={toggleDarkMode}
            aria-label={`Switch to ${isDarkMode ? 'light' : 'dark'} mode`}
            title={`Switch to ${isDarkMode ? 'light' : 'dark'} mode`}
            className="p-2 rounded-xl border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
          >
            {isDarkMode ? (
              <Sun id="sun-icon" data-testid="sun-icon" className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon id="moon-icon" data-testid="moon-icon" className="w-4 h-4 text-indigo-600" />
            )}
          </button>

          {/* Test Automation Hub Shortcut */}
          <button
            id="landing-automation-btn"
            data-testid="landing-automation-btn"
            onClick={() => setActiveTab('test-suite')}
            className="px-3 py-1.5 text-xs font-semibold bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-900/60 rounded-xl hover:bg-amber-100 transition-colors flex items-center gap-1.5"
          >
            <Terminal className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
            <span className="hidden sm:inline">Automation</span> Hub
          </button>
        </div>
      </header>

      {/* Main Landing & Authentication Container */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-12">
        {/* Left Column: Brand & Feature Highlights */}
        <div className="w-full lg:w-1/2 space-y-6 text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800/80 text-xs font-bold text-indigo-700 dark:text-indigo-300">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Movie Reviews & Profile Hub</span>
          </div>

          <div className="space-y-3">
            <h1
              id="landing-hero-title"
              data-testid="landing-hero-title"
              className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-zinc-900 dark:text-zinc-100 leading-tight"
            >
              Sign in to rate films & log movie reviews.
            </h1>
            <p className="text-sm sm:text-base text-zinc-600 dark:text-zinc-400 leading-relaxed max-w-lg">
              Rate movies from 1 to 5 stars, record rich commentary, update profile preferences, and run automated Visual Studio Code test suites.
            </p>
          </div>

          {/* Key Capabilities */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <div className="p-3.5 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 shadow-xs flex items-start gap-3">
              <div className="p-2 bg-amber-50 dark:bg-amber-950/60 text-amber-500 rounded-xl">
                <Star className="w-4 h-4 fill-amber-400" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-zinc-900 dark:text-zinc-100">1 to 5 Star Counter</h4>
                <p className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-0.5">Interactive star ratings & self-inputted titles.</p>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 shadow-xs flex items-start gap-3">
              <div className="p-2 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 rounded-xl">
                <User className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-zinc-900 dark:text-zinc-100">User Profile Data</h4>
                <p className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-0.5">Edit bio, avatar, genres, and notifications.</p>
              </div>
            </div>
          </div>

          {/* Quick Demo Credentials Box for Automation Testing */}
          <div
            id="landing-demo-account-box"
            data-testid="landing-demo-account-box"
            className="p-4 rounded-2xl bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10 dark:from-indigo-950/40 dark:via-purple-950/30 dark:to-zinc-900 border border-indigo-200 dark:border-indigo-900/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
          >
            <div className="space-y-0.5">
              <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-900 dark:text-indigo-200">
                <ShieldCheck className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                <span>Test Automation Demo Account</span>
              </div>
              <p className="text-[11px] text-zinc-600 dark:text-zinc-400 font-mono">
                alex.rivera@example.com / demo1234
              </p>
            </div>

            <button
              id="demo-user-login-btn"
              data-testid="demo-user-login-btn"
              type="button"
              onClick={handleQuickDemoLogin}
              className="px-3.5 py-2 text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-sm transition-transform active:scale-95 whitespace-nowrap flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              1-Click Demo Sign In
            </button>
          </div>
        </div>

        {/* Right Column: Authentication Card (Login & Sign Up) */}
        <div className="w-full lg:w-1/2 max-w-md">
          <div
            id="landing-auth-card"
            data-testid="landing-auth-card"
            className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl shadow-xl shadow-zinc-950/10 dark:shadow-zinc-950/40 overflow-hidden"
          >
            {/* Tab Headers: Login vs Sign Up */}
            <div className="flex border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50/80 dark:bg-zinc-900/80 p-2 gap-1.5">
              <button
                id="auth-tab-login"
                data-testid="auth-tab-login"
                onClick={() => {
                  setAuthMode('login');
                  setLoginError(null);
                }}
                className={`flex-1 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors ${
                  authMode === 'login'
                    ? 'bg-white dark:bg-zinc-800 text-indigo-600 dark:text-indigo-400 shadow-xs'
                    : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
                }`}
              >
                <LogIn className="w-4 h-4" />
                Sign In
              </button>
              <button
                id="auth-tab-signup"
                data-testid="auth-tab-signup"
                onClick={() => {
                  setAuthMode('signup');
                  setSignupError(null);
                }}
                className={`flex-1 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors ${
                  authMode === 'signup'
                    ? 'bg-white dark:bg-zinc-800 text-indigo-600 dark:text-indigo-400 shadow-xs'
                    : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
                }`}
              >
                <UserPlus className="w-4 h-4" />
                Create Account
              </button>
            </div>

            {/* Form Container */}
            <div className="p-6 sm:p-7">
              {authMode === 'login' ? (
                /* ================= LOGIN FORM ================= */
                <form id="login-form" data-testid="login-form" onSubmit={handleLoginSubmit} className="space-y-4">
                  <div>
                    <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
                      Sign in to your account
                    </h3>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                      Access your personal movie log and ratings.
                    </p>
                  </div>

                  {loginError && (
                    <div
                      id="login-error-banner"
                      data-testid="login-error-banner"
                      className="p-3 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 rounded-xl text-xs text-rose-700 dark:text-rose-300 flex items-start gap-2"
                    >
                      <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                      <span>{loginError}</span>
                    </div>
                  )}

                  {/* Email Input */}
                  <div className="space-y-1">
                    <label
                      htmlFor="login-email-input"
                      className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300"
                    >
                      Email or Username
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        id="login-email-input"
                        data-testid="login-email-input"
                        type="text"
                        required
                        value={loginEmail}
                        onChange={(e) => setLoginEmail(e.target.value)}
                        placeholder="alex.rivera@example.com"
                        className="w-full pl-9 pr-3 py-2.5 text-sm rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                  </div>

                  {/* Password Input */}
                  <div className="space-y-1">
                    <label
                      htmlFor="login-password-input"
                      className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300"
                    >
                      Password
                    </label>
                    <div className="relative">
                      <KeyRound className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        id="login-password-input"
                        data-testid="login-password-input"
                        type="password"
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full pl-9 pr-3 py-2.5 text-sm rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                  </div>

                  {/* Remember me & Forgot Password */}
                  <div className="flex items-center justify-between text-xs pt-1">
                    <label className="flex items-center gap-2 text-zinc-600 dark:text-zinc-400 cursor-pointer">
                      <input
                        id="login-remember-me-checkbox"
                        data-testid="login-remember-me-checkbox"
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500"
                      />
                      <span>Remember me</span>
                    </label>
                    <button
                      type="button"
                      id="forgot-password-link"
                      data-testid="forgot-password-link"
                      onClick={() => setLoginEmail('alex.rivera@example.com')}
                      className="text-indigo-600 dark:text-indigo-400 hover:underline font-medium"
                    >
                      Use Demo User
                    </button>
                  </div>

                  {/* Submit Button */}
                  <button
                    id="login-submit-button"
                    data-testid="login-submit-button"
                    type="submit"
                    className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-sm shadow-md shadow-indigo-600/20 transition-all flex items-center justify-center gap-2"
                  >
                    <LogIn className="w-4 h-4" />
                    Sign In to CineTrack
                  </button>

                  <div className="pt-2 text-center text-xs text-zinc-500 dark:text-zinc-400">
                    Don't have an account yet?{' '}
                    <button
                      type="button"
                      id="switch-to-signup-btn"
                      data-testid="switch-to-signup-btn"
                      onClick={() => setAuthMode('signup')}
                      className="text-indigo-600 dark:text-indigo-400 font-bold hover:underline"
                    >
                      Create Account
                    </button>
                  </div>
                </form>
              ) : (
                /* ================= SIGN UP FORM ================= */
                <form id="signup-form" data-testid="signup-form" onSubmit={handleSignupSubmit} className="space-y-3.5">
                  <div>
                    <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
                      Create CineTrack Account
                    </h3>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                      Join the film community and keep your reviews organized.
                    </p>
                  </div>

                  {signupError && (
                    <div
                      id="signup-error-banner"
                      data-testid="signup-error-banner"
                      className="p-3 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 rounded-xl text-xs text-rose-700 dark:text-rose-300 flex items-start gap-2"
                    >
                      <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                      <span>{signupError}</span>
                    </div>
                  )}

                  {/* Full Name */}
                  <div className="space-y-1">
                    <label
                      htmlFor="signup-name-input"
                      className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300"
                    >
                      Full Name <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        id="signup-name-input"
                        data-testid="signup-name-input"
                        type="text"
                        required
                        value={signupName}
                        onChange={(e) => setSignupName(e.target.value)}
                        placeholder="Jordan Miller"
                        className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div className="space-y-1">
                    <label
                      htmlFor="signup-email-input"
                      className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300"
                    >
                      Email Address <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        id="signup-email-input"
                        data-testid="signup-email-input"
                        type="email"
                        required
                        value={signupEmail}
                        onChange={(e) => setSignupEmail(e.target.value)}
                        placeholder="jordan@example.com"
                        className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                  </div>

                  {/* Username */}
                  <div className="space-y-1">
                    <label
                      htmlFor="signup-username-input"
                      className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300"
                    >
                      Username
                    </label>
                    <input
                      id="signup-username-input"
                      data-testid="signup-username-input"
                      type="text"
                      value={signupUsername}
                      onChange={(e) => setSignupUsername(e.target.value)}
                      placeholder="jordan_cinema"
                      className="w-full px-3 py-2 text-sm rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  {/* Passwords */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <label
                        htmlFor="signup-password-input"
                        className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300"
                      >
                        Password <span className="text-rose-500">*</span>
                      </label>
                      <input
                        id="signup-password-input"
                        data-testid="signup-password-input"
                        type="password"
                        required
                        value={signupPassword}
                        onChange={(e) => setSignupPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full px-3 py-2 text-sm rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>

                    <div className="space-y-1">
                      <label
                        htmlFor="signup-confirm-password-input"
                        className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300"
                      >
                        Confirm Password
                      </label>
                      <input
                        id="signup-confirm-password-input"
                        data-testid="signup-confirm-password-input"
                        type="password"
                        required
                        value={signupConfirmPassword}
                        onChange={(e) => setSignupConfirmPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full px-3 py-2 text-sm rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                  </div>

                  {/* Favorite Genres Selection */}
                  <div className="space-y-1.5 pt-1">
                    <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                      Favorite Genres
                    </label>
                    <div id="signup-genre-pills" data-testid="signup-genre-pills" className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto p-1">
                      {AVAILABLE_GENRES.slice(0, 10).map((genre) => {
                        const isSelected = selectedGenres.includes(genre);
                        return (
                          <button
                            type="button"
                            key={genre}
                            id={`signup-genre-${genre.toLowerCase()}`}
                            data-testid="signup-genre-btn"
                            data-selected={isSelected ? 'true' : 'false'}
                            onClick={() => handleGenreToggle(genre)}
                            className={`text-xs px-2.5 py-1 rounded-full font-medium transition-colors ${
                              isSelected
                                ? 'bg-indigo-600 text-white'
                                : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700'
                            }`}
                          >
                            {genre}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Terms Checkbox */}
                  <label className="flex items-center gap-2 text-xs text-zinc-600 dark:text-zinc-400 cursor-pointer pt-1">
                    <input
                      id="signup-terms-checkbox"
                      data-testid="signup-terms-checkbox"
                      type="checkbox"
                      checked={agreeTerms}
                      onChange={(e) => setAgreeTerms(e.target.checked)}
                      className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500"
                    />
                    <span>I agree to the CineTrack Terms & Privacy</span>
                  </label>

                  {/* Submit */}
                  <button
                    id="signup-submit-button"
                    data-testid="signup-submit-button"
                    type="submit"
                    className="w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-sm shadow-md shadow-indigo-600/20 transition-colors flex items-center justify-center gap-2"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    Complete Registration
                  </button>

                  <div className="text-center text-xs text-zinc-500 dark:text-zinc-400 pt-1">
                    Already registered?{' '}
                    <button
                      type="button"
                      id="switch-to-login-btn"
                      data-testid="switch-to-login-btn"
                      onClick={() => setAuthMode('login')}
                      className="text-indigo-600 dark:text-indigo-400 font-bold hover:underline"
                    >
                      Sign in here
                    </button>
                  </div>
                </form>
              )}
            </div>

            {/* Guest / Automation footer strip */}
            <div className="px-6 py-3 bg-zinc-50 dark:bg-zinc-850/60 border-t border-zinc-200 dark:border-zinc-800 flex items-center justify-between text-xs text-zinc-500 dark:text-zinc-400">
              <span>Looking to test without logging in?</span>
              <button
                id="guest-browse-reviews-btn"
                data-testid="guest-browse-reviews-btn"
                onClick={() => setActiveTab('reviews')}
                className="text-indigo-600 dark:text-indigo-400 font-semibold hover:underline flex items-center gap-1"
              >
                Browse Public Reviews
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Minimal Footer */}
      <footer className="w-full border-t border-zinc-200 dark:border-zinc-800 py-4 px-4 text-center text-xs text-zinc-500 dark:text-zinc-400">
        <span>CineTrack • Movie Reviews & Profile Automation Suite</span>
      </footer>
    </div>
  );
};
