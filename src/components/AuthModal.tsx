import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { AVAILABLE_GENRES } from '../data/seedData';
import { LogIn, UserPlus, X, KeyRound, Mail, User, Sparkles, CheckCircle2, AlertCircle } from 'lucide-react';

export const AuthModal: React.FC = () => {
  const {
    isAuthModalOpen,
    setIsAuthModalOpen,
    authMode,
    setAuthMode,
    login,
    signup,
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

  if (!isAuthModalOpen) return null;

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    if (!loginEmail.trim()) {
      setLoginError('Email address is required.');
      return;
    }
    const result = login(loginEmail, loginPassword);
    if (!result.success) {
      setLoginError(result.error || 'Authentication failed. Please check credentials.');
    }
  };

  const handleQuickDemoLogin = () => {
    setLoginError(null);
    login('alex.rivera@example.com', 'demo1234');
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
      setSignupError('Password must be at least 4 characters long.');
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
      setSignupError(result.error || 'Account creation failed.');
    }
  };

  return (
    <div
      id="auth-modal-backdrop"
      data-testid="auth-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/60 backdrop-blur-sm animate-in fade-in duration-150"
    >
      <div
        id="auth-modal-container"
        data-testid="auth-modal-container"
        className="w-full max-w-md bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-2xl shadow-zinc-950/30 overflow-hidden relative flex flex-col max-h-[90vh]"
      >
        {/* Close Button */}
        <button
          id="auth-modal-close-btn"
          data-testid="auth-modal-close-btn"
          onClick={() => setIsAuthModalOpen(false)}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors z-10"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Tab Headers: Login vs Sign Up */}
        <div className="flex border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50/80 dark:bg-zinc-900/80 p-1.5 gap-1">
          <button
            id="auth-tab-login"
            data-testid="auth-tab-login"
            onClick={() => {
              setAuthMode('login');
              setLoginError(null);
            }}
            className={`flex-1 py-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors ${
              authMode === 'login'
                ? 'bg-white dark:bg-zinc-800 text-indigo-600 dark:text-indigo-400 shadow-xs'
                : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
            }`}
          >
            <LogIn className="w-3.5 h-3.5" />
            Sign In
          </button>
          <button
            id="auth-tab-signup"
            data-testid="auth-tab-signup"
            onClick={() => {
              setAuthMode('signup');
              setSignupError(null);
            }}
            className={`flex-1 py-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors ${
              authMode === 'signup'
                ? 'bg-white dark:bg-zinc-800 text-indigo-600 dark:text-indigo-400 shadow-xs'
                : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
            }`}
          >
            <UserPlus className="w-3.5 h-3.5" />
            Create Account
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto">
          {authMode === 'login' ? (
            /* ================= LOGIN FORM ================= */
            <form id="login-form" data-testid="login-form" onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
                  Welcome back
                </h3>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                  Sign in to manage your movie reviews and profile.
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

              {/* Demo Account Quick-Fill for Automation Testing */}
              <div className="p-3 bg-indigo-50/60 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/50 rounded-xl flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0" />
                  <div className="text-[11px] text-indigo-900 dark:text-indigo-300">
                    <span className="font-semibold block">Automation Preset</span>
                    alex.rivera@example.com
                  </div>
                </div>
                <button
                  type="button"
                  id="demo-user-login-btn"
                  data-testid="demo-user-login-btn"
                  onClick={handleQuickDemoLogin}
                  className="px-2.5 py-1 text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors whitespace-nowrap shadow-xs"
                >
                  1-Click Demo Login
                </button>
              </div>

              {/* Email Input */}
              <div className="space-y-1">
                <label
                  htmlFor="login-email-input"
                  className="block text-xs font-medium text-zinc-700 dark:text-zinc-300"
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
                    placeholder="e.g. alex.rivera@example.com"
                    className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              {/* Password Input */}
              <div className="space-y-1">
                <label
                  htmlFor="login-password-input"
                  className="block text-xs font-medium text-zinc-700 dark:text-zinc-300"
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
                    className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              {/* Remember me & Forgot Password */}
              <div className="flex items-center justify-between text-xs">
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
                  onClick={() => alert('For test automation: use demo account credentials (alex.rivera@example.com).')}
                  className="text-indigo-600 dark:text-indigo-400 hover:underline"
                >
                  Forgot password?
                </button>
              </div>

              {/* Submit Button */}
              <button
                id="login-submit-button"
                data-testid="login-submit-button"
                type="submit"
                className="w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold text-sm shadow-md shadow-indigo-600/20 transition-colors flex items-center justify-center gap-2"
              >
                <LogIn className="w-4 h-4" />
                Sign In to Dashboard
              </button>

              <p className="text-center text-xs text-zinc-500 dark:text-zinc-400 pt-2">
                Don't have an account?{' '}
                <button
                  type="button"
                  id="switch-to-signup-btn"
                  data-testid="switch-to-signup-btn"
                  onClick={() => setAuthMode('signup')}
                  className="text-indigo-600 dark:text-indigo-400 font-semibold hover:underline"
                >
                  Create one now
                </button>
              </p>
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
                  className="block text-xs font-medium text-zinc-700 dark:text-zinc-300"
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
                    placeholder="e.g. Jordan Miller"
                    className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              {/* Email */}
              <div className="space-y-1">
                <label
                  htmlFor="signup-email-input"
                  className="block text-xs font-medium text-zinc-700 dark:text-zinc-300"
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
                  className="block text-xs font-medium text-zinc-700 dark:text-zinc-300"
                >
                  Username
                </label>
                <input
                  id="signup-username-input"
                  data-testid="signup-username-input"
                  type="text"
                  value={signupUsername}
                  onChange={(e) => setSignupUsername(e.target.value)}
                  placeholder="jordan_films"
                  className="w-full px-3 py-2 text-sm rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              {/* Passwords */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div className="space-y-1">
                  <label
                    htmlFor="signup-password-input"
                    className="block text-xs font-medium text-zinc-700 dark:text-zinc-300"
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
                    className="block text-xs font-medium text-zinc-700 dark:text-zinc-300"
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
                <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300">
                  Favorite Genres (Select 1 or more)
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
                <span>I agree to CineTrack Terms & Privacy Policy</span>
              </label>

              {/* Submit */}
              <button
                id="signup-submit-button"
                data-testid="signup-submit-button"
                type="submit"
                className="w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold text-sm shadow-md shadow-indigo-600/20 transition-colors flex items-center justify-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4" />
                Complete Registration
              </button>

              <p className="text-center text-xs text-zinc-500 dark:text-zinc-400 pt-1">
                Already registered?{' '}
                <button
                  type="button"
                  id="switch-to-login-btn"
                  data-testid="switch-to-login-btn"
                  onClick={() => setAuthMode('login')}
                  className="text-indigo-600 dark:text-indigo-400 font-semibold hover:underline"
                >
                  Sign in here
                </button>
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
