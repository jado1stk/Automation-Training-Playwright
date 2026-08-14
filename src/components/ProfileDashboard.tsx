import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { AVAILABLE_GENRES } from '../data/seedData';
import {
  User,
  Mail,
  MapPin,
  Globe,
  Calendar,
  Edit,
  Star,
  Film,
  Heart,
  Check,
  X,
  Sparkles,
  Shield,
  BellRing,
  Volume2
} from 'lucide-react';

const AVATAR_PRESETS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=200&auto=format&fit=crop&q=80',
];

export const ProfileDashboard: React.FC = () => {
  const {
    currentUser,
    updateProfile,
    reviews,
    setActiveTab,
    setIsAuthModalOpen,
    setAuthMode,
  } = useApp();

  const [isEditing, setIsEditing] = useState(false);

  // Edit form states
  const [name, setName] = useState(currentUser?.name || '');
  const [email, setEmail] = useState(currentUser?.email || '');
  const [username, setUsername] = useState(currentUser?.username || '');
  const [bio, setBio] = useState(currentUser?.bio || '');
  const [location, setLocation] = useState(currentUser?.location || '');
  const [website, setWebsite] = useState(currentUser?.website || '');
  const [avatarUrl, setAvatarUrl] = useState(currentUser?.avatarUrl || '');
  const [selectedGenres, setSelectedGenres] = useState<string[]>(
    currentUser?.favoriteGenres || []
  );
  const [browserPushPref, setBrowserPushPref] = useState(
    currentUser?.notificationPreferences?.browserPush ?? true
  );
  const [soundPref, setSoundPref] = useState(
    currentUser?.notificationPreferences?.soundEnabled ?? true
  );
  const [editError, setEditError] = useState<string | null>(null);

  if (!currentUser) {
    return (
      <div
        id="unauthenticated-profile-state"
        data-testid="unauthenticated-profile-state"
        className="max-w-md mx-auto my-12 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-8 text-center shadow-lg"
      >
        <User className="w-12 h-12 mx-auto text-indigo-600 dark:text-indigo-400 mb-3" />
        <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
          Sign In to Access Your Profile
        </h2>
        <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 mb-6">
          View your stats, customize your profile data, and manage your authored reviews.
        </p>
        <div className="flex gap-2">
          <button
            id="profile-login-trigger-btn"
            data-testid="profile-login-trigger-btn"
            onClick={() => {
              setAuthMode('login');
              setIsAuthModalOpen(true);
            }}
            className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold"
          >
            Sign In
          </button>
          <button
            id="profile-signup-trigger-btn"
            data-testid="profile-signup-trigger-btn"
            onClick={() => {
              setAuthMode('signup');
              setIsAuthModalOpen(true);
            }}
            className="flex-1 py-2.5 bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 rounded-xl text-xs font-semibold"
          >
            Create Account
          </button>
        </div>
      </div>
    );
  }

  // Calculate User Stats
  const userReviews = reviews.filter((r) => r.userId === currentUser.id);
  const totalReviews = userReviews.length;
  const avgRating =
    totalReviews > 0
      ? (userReviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews).toFixed(1)
      : '0.0';
  const totalLikes = userReviews.reduce((sum, r) => sum + r.likesCount, 0);
  const recommendedPercent =
    totalReviews > 0
      ? Math.round(
          (userReviews.filter((r) => r.recommends).length / totalReviews) * 100
        )
      : 0;

  const handleOpenEdit = () => {
    setName(currentUser.name);
    setEmail(currentUser.email);
    setUsername(currentUser.username);
    setBio(currentUser.bio);
    setLocation(currentUser.location);
    setWebsite(currentUser.website || '');
    setAvatarUrl(currentUser.avatarUrl);
    setSelectedGenres(currentUser.favoriteGenres || []);
    setBrowserPushPref(currentUser.notificationPreferences?.browserPush ?? true);
    setSoundPref(currentUser.notificationPreferences?.soundEnabled ?? true);
    setEditError(null);
    setIsEditing(true);
  };

  const handleGenreToggle = (genre: string) => {
    if (selectedGenres.includes(genre)) {
      setSelectedGenres(selectedGenres.filter((g) => g !== genre));
    } else {
      setSelectedGenres([...selectedGenres, genre]);
    }
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setEditError(null);

    if (!name.trim()) {
      setEditError('Name cannot be empty.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setEditError('Valid email address is required.');
      return;
    }

    const res = updateProfile({
      name: name.trim(),
      email: email.trim(),
      username: username.trim() || email.split('@')[0],
      bio: bio.trim(),
      location: location.trim(),
      website: website.trim(),
      avatarUrl: avatarUrl.trim(),
      favoriteGenres: selectedGenres,
      notificationPreferences: {
        ...currentUser.notificationPreferences,
        browserPush: browserPushPref,
        soundEnabled: soundPref,
      },
    });

    if (res.success) {
      setIsEditing(false);
    } else {
      setEditError(res.error || 'Failed to update profile.');
    }
  };

  return (
    <div id="profile-dashboard-view" data-testid="profile-dashboard-view" className="space-y-6 max-w-5xl mx-auto">
      {/* Profile Header Card */}
      <div
        id="profile-header-card"
        data-testid="profile-header-card"
        className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-sm relative overflow-hidden"
      >
        {/* Background accent wave */}
        <div className="absolute top-0 right-0 left-0 h-28 bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10 dark:from-indigo-950/40 dark:via-purple-950/30 dark:to-zinc-900 -z-0" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-end justify-between gap-6 pt-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
            <div className="relative group">
              <img
                id="profile-avatar-img"
                data-testid="profile-avatar-img"
                src={currentUser.avatarUrl}
                alt={currentUser.name}
                className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl object-cover border-4 border-white dark:border-zinc-900 shadow-md shadow-zinc-950/10"
              />
              <div className="absolute -bottom-1 -right-1 p-1.5 bg-indigo-600 text-white rounded-lg shadow-sm">
                <Shield className="w-3.5 h-3.5" />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-3 flex-wrap">
                <h1
                  id="profile-name-display"
                  data-testid="profile-name-display"
                  className="text-2xl sm:text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-100"
                >
                  {currentUser.name}
                </h1>
                <span
                  id="profile-username-display"
                  data-testid="profile-username-display"
                  className="text-xs font-semibold px-2.5 py-1 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300"
                >
                  @{currentUser.username}
                </span>
              </div>

              <p
                id="profile-bio-display"
                data-testid="profile-bio-display"
                className="text-sm text-zinc-600 dark:text-zinc-300 max-w-xl leading-relaxed pt-1"
              >
                {currentUser.bio || 'No bio provided yet.'}
              </p>

              {/* Meta details list */}
              <div className="flex flex-wrap items-center gap-4 text-xs text-zinc-500 dark:text-zinc-400 pt-2">
                <div id="profile-email-display" data-testid="profile-email-display" className="flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-zinc-400" />
                  <span>{currentUser.email}</span>
                </div>

                <div id="profile-location-display" data-testid="profile-location-display" className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-zinc-400" />
                  <span>{currentUser.location || 'Not specified'}</span>
                </div>

                {currentUser.website && (
                  <div id="profile-website-display" data-testid="profile-website-display" className="flex items-center gap-1.5">
                    <Globe className="w-3.5 h-3.5 text-zinc-400" />
                    <a
                      href={currentUser.website}
                      target="_blank"
                      rel="noreferrer"
                      className="text-indigo-600 dark:text-indigo-400 hover:underline"
                    >
                      {currentUser.website.replace(/^https?:\/\//, '')}
                    </a>
                  </div>
                )}

                <div id="profile-joined-display" data-testid="profile-joined-display" className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-zinc-400" />
                  <span>Joined {currentUser.joinedDate}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Edit Profile Action Button */}
          <button
            id="edit-profile-button"
            data-testid="edit-profile-button"
            onClick={handleOpenEdit}
            className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-md shadow-indigo-600/20 transition-all flex items-center gap-2 shrink-0"
          >
            <Edit className="w-4 h-4" />
            Edit Profile Data
          </button>
        </div>

        {/* Favorite Genres Chips */}
        <div className="mt-6 pt-5 border-t border-zinc-100 dark:border-zinc-800 flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 mr-1">
            Favorite Genres:
          </span>
          <div id="profile-genres-display" data-testid="profile-genres-display" className="flex flex-wrap gap-1.5">
            {currentUser.favoriteGenres && currentUser.favoriteGenres.length > 0 ? (
              currentUser.favoriteGenres.map((genre) => (
                <span
                  key={genre}
                  id={`profile-genre-tag-${genre.toLowerCase()}`}
                  data-testid="profile-genre-tag"
                  className="px-2.5 py-1 text-xs font-medium bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 rounded-lg border border-indigo-100 dark:border-indigo-900/40"
                >
                  {genre}
                </span>
              ))
            ) : (
              <span className="text-xs text-zinc-400 italic">No genres selected</span>
            )}
          </div>
        </div>
      </div>

      {/* User Statistics Row */}
      <div id="profile-stats-grid" data-testid="profile-stats-grid" className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-4 shadow-sm">
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-xs font-medium">Reviews Written</span>
            <Film className="w-4 h-4 text-indigo-500" />
          </div>
          <p
            id="stat-total-reviews"
            data-testid="stat-total-reviews"
            className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 mt-2"
          >
            {totalReviews}
          </p>
          <span className="text-[11px] text-zinc-500 dark:text-zinc-400">Published reviews</span>
        </div>

        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-4 shadow-sm">
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-xs font-medium">Avg Star Rating</span>
            <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
          </div>
          <p
            id="stat-avg-rating"
            data-testid="stat-avg-rating"
            className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 mt-2"
          >
            {avgRating} <span className="text-sm font-normal text-zinc-400">/ 5★</span>
          </p>
          <span className="text-[11px] text-zinc-500 dark:text-zinc-400">Across your logs</span>
        </div>

        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-4 shadow-sm">
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-xs font-medium">Approval Rate</span>
            <Sparkles className="w-4 h-4 text-emerald-500" />
          </div>
          <p
            id="stat-recommended-rate"
            data-testid="stat-recommended-rate"
            className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 mt-2"
          >
            {recommendedPercent}%
          </p>
          <span className="text-[11px] text-zinc-500 dark:text-zinc-400">Recommended films</span>
        </div>

        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-4 shadow-sm">
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-xs font-medium">Likes Received</span>
            <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />
          </div>
          <p
            id="stat-total-likes"
            data-testid="stat-total-likes"
            className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 mt-2"
          >
            {totalLikes}
          </p>
          <span className="text-[11px] text-zinc-500 dark:text-zinc-400">Community claps</span>
        </div>
      </div>

      {/* User's Authored Reviews Section */}
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 shadow-sm">
        <div className="flex items-center justify-between pb-4 border-b border-zinc-100 dark:border-zinc-800">
          <div>
            <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
              Your Authored Movie Reviews
            </h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              Manage and view the films you've rated.
            </p>
          </div>
          <button
            id="profile-write-new-review-btn"
            data-testid="profile-write-new-review-btn"
            onClick={() => setActiveTab('write-review')}
            className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold transition-colors"
          >
            + New Review
          </button>
        </div>

        <div className="mt-4 space-y-3">
          {userReviews.length === 0 ? (
            <div className="py-8 text-center text-zinc-400">
              <Film className="w-8 h-8 mx-auto mb-2 opacity-40" />
              <p className="text-xs">You haven't written any movie reviews yet.</p>
            </div>
          ) : (
            userReviews.map((rev) => (
              <div
                key={rev.id}
                id={`profile-review-row-${rev.id}`}
                data-testid="profile-review-row"
                className="p-3.5 bg-zinc-50 dark:bg-zinc-800/50 rounded-xl border border-zinc-200 dark:border-zinc-700/60 flex items-center justify-between gap-3"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 truncate">
                      {rev.movieTitle}
                    </h4>
                    <span className="text-xs font-bold text-amber-500 flex items-center gap-0.5">
                      <Star className="w-3.5 h-3.5 fill-amber-400" />
                      {rev.rating}.0
                    </span>
                  </div>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 truncate mt-0.5">
                    {rev.reviewText}
                  </p>
                </div>

                <button
                  onClick={() => setActiveTab('reviews')}
                  className="px-2.5 py-1 text-xs text-indigo-600 dark:text-indigo-400 hover:underline whitespace-nowrap"
                >
                  View in Feed
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Edit Profile Modal */}
      {isEditing && (
        <div
          id="edit-profile-modal"
          data-testid="edit-profile-modal"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/60 backdrop-blur-xs animate-in fade-in duration-150"
        >
          <div className="w-full max-w-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-2xl overflow-y-auto max-h-[90vh] p-6">
            <div className="flex items-center justify-between pb-4 border-b border-zinc-100 dark:border-zinc-800">
              <div>
                <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
                  Edit Profile Information
                </h3>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                  All fields are updated in real-time.
                </p>
              </div>
              <button
                id="close-profile-modal-btn"
                data-testid="close-profile-modal-btn"
                onClick={() => setIsEditing(false)}
                className="p-1 rounded-lg text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {editError && (
              <div
                id="edit-profile-error"
                data-testid="edit-profile-error"
                className="mt-4 p-3 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 rounded-xl text-xs text-rose-700 dark:text-rose-300"
              >
                {editError}
              </div>
            )}

            <form id="edit-profile-form" data-testid="edit-profile-form" onSubmit={handleSaveProfile} className="mt-4 space-y-4">
              {/* Avatar Picker / URL */}
              <div className="space-y-2">
                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                  Profile Avatar
                </label>
                <div className="flex items-center gap-3">
                  <img
                    src={avatarUrl || currentUser.avatarUrl}
                    alt="Preview"
                    className="w-14 h-14 rounded-xl object-cover border border-zinc-300 dark:border-zinc-700"
                  />
                  <div className="flex-1 space-y-1">
                    <input
                      id="edit-avatar-url-input"
                      data-testid="edit-avatar-url-input"
                      type="url"
                      value={avatarUrl}
                      onChange={(e) => setAvatarUrl(e.target.value)}
                      placeholder="Paste image URL..."
                      className="w-full px-3 py-1.5 text-xs rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100"
                    />
                    <div className="flex gap-1.5 pt-1">
                      {AVATAR_PRESETS.map((preset, idx) => (
                        <button
                          key={idx}
                          type="button"
                          id={`preset-avatar-${idx}`}
                          data-testid="preset-avatar-btn"
                          onClick={() => setAvatarUrl(preset)}
                          className="w-6 h-6 rounded-md overflow-hidden border border-zinc-300 dark:border-zinc-700 hover:scale-110 transition-transform"
                        >
                          <img src={preset} alt={`Preset ${idx}`} className="w-full h-full object-cover" />
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Full Name & Username */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label
                    htmlFor="edit-name-input"
                    className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1"
                  >
                    Full Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    id="edit-name-input"
                    data-testid="edit-name-input"
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3 py-2 text-sm rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label
                    htmlFor="edit-username-input"
                    className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1"
                  >
                    Username
                  </label>
                  <input
                    id="edit-username-input"
                    data-testid="edit-username-input"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full px-3 py-2 text-sm rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              {/* Email & Location */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label
                    htmlFor="edit-email-input"
                    className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1"
                  >
                    Email Address <span className="text-rose-500">*</span>
                  </label>
                  <input
                    id="edit-email-input"
                    data-testid="edit-email-input"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3 py-2 text-sm rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label
                    htmlFor="edit-location-input"
                    className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1"
                  >
                    Location
                  </label>
                  <input
                    id="edit-location-input"
                    data-testid="edit-location-input"
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="City, Country"
                    className="w-full px-3 py-2 text-sm rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              {/* Website */}
              <div>
                <label
                  htmlFor="edit-website-input"
                  className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1"
                >
                  Personal Website / Link
                </label>
                <input
                  id="edit-website-input"
                  data-testid="edit-website-input"
                  type="url"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                  placeholder="https://mywebsite.com"
                  className="w-full px-3 py-2 text-sm rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              {/* Bio */}
              <div>
                <label
                  htmlFor="edit-bio-input"
                  className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1"
                >
                  Bio / About You
                </label>
                <textarea
                  id="edit-bio-input"
                  data-testid="edit-bio-input"
                  rows={3}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Tell others about your cinematic taste..."
                  className="w-full px-3 py-2 text-sm rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              {/* Favorite Genres */}
              <div>
                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">
                  Favorite Genres (Select all that apply)
                </label>
                <div id="edit-genres-container" data-testid="edit-genres-container" className="flex flex-wrap gap-1.5">
                  {AVAILABLE_GENRES.map((genre) => {
                    const isSelected = selectedGenres.includes(genre);
                    return (
                      <button
                        type="button"
                        key={genre}
                        id={`edit-genre-btn-${genre.toLowerCase()}`}
                        data-testid="edit-genre-btn"
                        onClick={() => handleGenreToggle(genre)}
                        className={`text-xs px-2.5 py-1 rounded-lg font-medium transition-colors ${
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

              {/* Notification Preferences */}
              <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800 space-y-2">
                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                  Notification Preferences
                </label>
                <div className="flex flex-col sm:flex-row gap-3">
                  <label className="flex items-center gap-2 text-xs text-zinc-600 dark:text-zinc-300 cursor-pointer">
                    <input
                      id="edit-pref-push-checkbox"
                      data-testid="edit-pref-push-checkbox"
                      type="checkbox"
                      checked={browserPushPref}
                      onChange={(e) => setBrowserPushPref(e.target.checked)}
                      className="w-4 h-4 rounded text-indigo-600"
                    />
                    <BellRing className="w-3.5 h-3.5 text-zinc-400" />
                    <span>Real-time Push Alerts</span>
                  </label>

                  <label className="flex items-center gap-2 text-xs text-zinc-600 dark:text-zinc-300 cursor-pointer">
                    <input
                      id="edit-pref-sound-checkbox"
                      data-testid="edit-pref-sound-checkbox"
                      type="checkbox"
                      checked={soundPref}
                      onChange={(e) => setSoundPref(e.target.checked)}
                      className="w-4 h-4 rounded text-indigo-600"
                    />
                    <Volume2 className="w-3.5 h-3.5 text-zinc-400" />
                    <span>Audio Chime on Notification</span>
                  </label>
                </div>
              </div>

              {/* Modal Actions */}
              <div className="flex items-center justify-end gap-2 pt-4 border-t border-zinc-100 dark:border-zinc-800">
                <button
                  type="button"
                  id="cancel-profile-btn"
                  data-testid="cancel-profile-btn"
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 text-xs font-semibold text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  id="save-profile-btn"
                  data-testid="save-profile-btn"
                  className="px-5 py-2 text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-sm flex items-center gap-1.5"
                >
                  <Check className="w-3.5 h-3.5" />
                  Save Profile Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
