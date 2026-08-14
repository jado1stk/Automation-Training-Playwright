import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { UserProfile, MovieReview, AppNotification, ActiveTab, AuthMode } from '../types';
import { INITIAL_DEMO_USER, INITIAL_REVIEWS, INITIAL_NOTIFICATIONS } from '../data/seedData';

interface ToastPushNotification {
  id: string;
  title: string;
  message: string;
  type: AppNotification['type'];
  timestamp: Date;
}

interface AppContextType {
  currentUser: UserProfile | null;
  isAuthenticated: boolean;
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  authMode: AuthMode;
  setAuthMode: (mode: AuthMode) => void;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
  
  // Auth methods
  login: (email: string, password?: string) => { success: boolean; error?: string };
  signup: (userData: Partial<UserProfile>, password?: string) => { success: boolean; error?: string };
  logout: () => void;
  updateProfile: (updatedData: Partial<UserProfile>) => { success: boolean; error?: string };
  
  // Reviews methods
  reviews: MovieReview[];
  addReview: (review: Omit<MovieReview, 'id' | 'userId' | 'authorName' | 'authorAvatar' | 'createdAt' | 'likesCount' | 'isLiked'>) => void;
  updateReview: (id: string, updated: Partial<MovieReview>) => void;
  deleteReview: (id: string) => void;
  toggleLikeReview: (id: string) => void;
  
  // Notifications
  notifications: AppNotification[];
  unreadNotificationCount: number;
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;
  clearAllNotifications: () => void;
  triggerPushNotification: (title: string, message: string, type?: AppNotification['type']) => void;
  activeToasts: ToastPushNotification[];
  dismissToast: (id: string) => void;
  requestBrowserNotificationPermission: () => Promise<NotificationPermission | null>;
  browserNotificationPermission: NotificationPermission | 'unsupported';
  
  // Dark mode
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  
  // Test Automation Helpers
  resetToDefaultFixtures: () => void;
  seedRandomReview: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// Web Audio synthesizer chime for push notification
const playNotificationSound = () => {
  try {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.type = 'sine';
    osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
    osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.12); // A5
    
    gain.gain.setValueAtTime(0.15, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    
    osc.start();
    osc.stop(ctx.currentTime + 0.35);
  } catch {
    // AudioContext blocked or not supported
  }
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Theme state
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem('cinetrack_theme');
    if (saved) return saved === 'dark';
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  // Current User & Auth
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem('cinetrack_current_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return null;
      }
    }
    return null; // Start unauthenticated so Landing Login page is shown first
  });

  const [registeredUsers, setRegisteredUsers] = useState<UserProfile[]>(() => {
    const saved = localStorage.getItem('cinetrack_all_users');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return [INITIAL_DEMO_USER];
      }
    }
    return [INITIAL_DEMO_USER];
  });

  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [authMode, setAuthMode] = useState<AuthMode>('login');
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);

  // Reviews
  const [reviews, setReviews] = useState<MovieReview[]>(() => {
    const saved = localStorage.getItem('cinetrack_reviews');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return INITIAL_REVIEWS;
      }
    }
    return INITIAL_REVIEWS;
  });

  // Notifications
  const [notifications, setNotifications] = useState<AppNotification[]>(() => {
    const saved = localStorage.getItem('cinetrack_notifications');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return INITIAL_NOTIFICATIONS;
      }
    }
    return INITIAL_NOTIFICATIONS;
  });

  const [activeToasts, setActiveToasts] = useState<ToastPushNotification[]>([]);
  const [browserNotificationPermission, setBrowserNotificationPermission] = useState<NotificationPermission | 'unsupported'>(() => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      return Notification.permission;
    }
    return 'unsupported';
  });

  // Apply dark mode to document
  useEffect(() => {
    const root = document.documentElement;
    if (isDarkMode) {
      root.classList.add('dark');
      localStorage.setItem('cinetrack_theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('cinetrack_theme', 'light');
    }
  }, [isDarkMode]);

  // Sync state to localStorage
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('cinetrack_current_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('cinetrack_current_user');
    }
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('cinetrack_all_users', JSON.stringify(registeredUsers));
  }, [registeredUsers]);

  useEffect(() => {
    localStorage.setItem('cinetrack_reviews', JSON.stringify(reviews));
  }, [reviews]);

  useEffect(() => {
    localStorage.setItem('cinetrack_notifications', JSON.stringify(notifications));
  }, [notifications]);

  const toggleDarkMode = useCallback(() => {
    setIsDarkMode((prev) => !prev);
  }, []);

  const dismissToast = useCallback((id: string) => {
    setActiveToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // Dispatch Push Notification (In-App Toast + Web Notification + Sound + Notification Center Log)
  const triggerPushNotification = useCallback((title: string, message: string, type: AppNotification['type'] = 'custom_push') => {
    const newId = 'notif_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6);
    
    // 1. Add to in-app notification center
    const newNotification: AppNotification = {
      id: newId,
      userId: currentUser?.id || 'guest',
      title,
      message,
      type,
      read: false,
      timestamp: 'Just now',
    };
    
    setNotifications((prev) => [newNotification, ...prev]);

    // 2. Play sound if user enabled
    if (currentUser?.notificationPreferences?.soundEnabled !== false) {
      playNotificationSound();
    }

    // 3. Show In-App real-time Push Toast banner
    const newToast: ToastPushNotification = {
      id: newId,
      title,
      message,
      type,
      timestamp: new Date(),
    };
    setActiveToasts((prev) => [newToast, ...prev.slice(0, 3)]);

    // Auto-dismiss after 5 seconds
    setTimeout(() => {
      dismissToast(newId);
    }, 5000);

    // 4. Fire Web Notification API if permitted
    try {
      if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
        new Notification(title, {
          body: message,
          icon: '/favicon.ico',
        });
      }
    } catch {
      // Ignore if iframe blocks native Notification
    }
  }, [currentUser, dismissToast]);

  const requestBrowserNotificationPermission = useCallback(async () => {
    if (typeof window === 'undefined' || !('Notification' in window)) {
      return 'unsupported';
    }
    try {
      const permission = await Notification.requestPermission();
      setBrowserNotificationPermission(permission);
      if (permission === 'granted') {
        triggerPushNotification('Push Notifications Activated', 'You will receive real-time updates and review interactions.');
      }
      return permission;
    } catch {
      return null;
    }
  }, [triggerPushNotification]);

  // Auth Functions
  const login = useCallback((email: string, _password?: string) => {
    const trimmedEmail = email.trim().toLowerCase();
    if (!trimmedEmail) {
      return { success: false, error: 'Please enter your email or username' };
    }

    const found = registeredUsers.find(
      (u) => u.email.toLowerCase() === trimmedEmail || u.username.toLowerCase() === trimmedEmail
    );

    if (found) {
      setCurrentUser(found);
      setIsAuthModalOpen(false);
      triggerPushNotification('Welcome back!', `Signed in as ${found.name}`, 'system');
      return { success: true };
    }

    // If not found, create or return demo
    if (trimmedEmail.includes('demo') || trimmedEmail === 'alex.rivera@example.com' || trimmedEmail === 'alex_cinema') {
      setCurrentUser(INITIAL_DEMO_USER);
      setIsAuthModalOpen(false);
      triggerPushNotification('Welcome back!', `Signed in as ${INITIAL_DEMO_USER.name}`, 'system');
      return { success: true };
    }

    return { success: false, error: 'User not found with this email. Please check your credentials or sign up.' };
  }, [registeredUsers, triggerPushNotification]);

  const signup = useCallback((userData: Partial<UserProfile>, _password?: string) => {
    if (!userData.name || !userData.email) {
      return { success: false, error: 'Name and email are required' };
    }

    const emailExists = registeredUsers.some((u) => u.email.toLowerCase() === userData.email!.trim().toLowerCase());
    if (emailExists) {
      return { success: false, error: 'An account with this email already exists' };
    }

    const newUser: UserProfile = {
      id: 'user_' + Date.now(),
      name: userData.name.trim(),
      username: userData.username?.trim() || userData.email.split('@')[0],
      email: userData.email.trim(),
      bio: userData.bio?.trim() || 'Movie enthusiast exploring new cinematic stories.',
      location: userData.location?.trim() || 'Worldwide',
      avatarUrl: userData.avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80',
      favoriteGenres: userData.favoriteGenres && userData.favoriteGenres.length > 0 ? userData.favoriteGenres : ['Drama', 'Sci-Fi'],
      joinedDate: new Date().toISOString().split('T')[0],
      website: userData.website || '',
      notificationPreferences: {
        browserPush: true,
        soundEnabled: true,
        reviewLikes: true,
        systemAlerts: true,
      },
    };

    setRegisteredUsers((prev) => [...prev, newUser]);
    setCurrentUser(newUser);
    setIsAuthModalOpen(false);
    triggerPushNotification('Account Created!', `Welcome to CineTrack, ${newUser.name}!`, 'system');
    return { success: true };
  }, [registeredUsers, triggerPushNotification]);

  const logout = useCallback(() => {
    setCurrentUser(null);
    triggerPushNotification('Logged Out', 'You have been safely signed out.', 'system');
  }, [triggerPushNotification]);

  const updateProfile = useCallback((updatedData: Partial<UserProfile>) => {
    if (!currentUser) return { success: false, error: 'No user is currently signed in' };

    const updated: UserProfile = {
      ...currentUser,
      ...updatedData,
    };

    setCurrentUser(updated);
    setRegisteredUsers((prev) => prev.map((u) => (u.id === currentUser.id ? updated : u)));
    
    // Also update authorName on existing reviews authored by this user
    setReviews((prev) =>
      prev.map((rev) =>
        rev.userId === currentUser.id
          ? { ...rev, authorName: updated.name, authorAvatar: updated.avatarUrl }
          : rev
      )
    );

    triggerPushNotification('Profile Updated', 'Your profile details have been saved successfully.', 'profile_update');
    return { success: true };
  }, [currentUser, triggerPushNotification]);

  // Review Operations
  const addReview = useCallback((reviewData: Omit<MovieReview, 'id' | 'userId' | 'authorName' | 'authorAvatar' | 'createdAt' | 'likesCount' | 'isLiked'>) => {
    const authorName = currentUser ? currentUser.name : 'Anonymous Guest';
    const authorAvatar = currentUser ? currentUser.avatarUrl : 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80';
    const userId = currentUser ? currentUser.id : 'guest_' + Date.now();

    const newReview: MovieReview = {
      id: 'rev_' + Date.now(),
      userId,
      authorName,
      authorAvatar,
      movieTitle: reviewData.movieTitle.trim(),
      rating: Math.max(1, Math.min(5, Math.round(reviewData.rating))),
      reviewText: reviewData.reviewText.trim(),
      watchDate: reviewData.watchDate || new Date().toISOString().split('T')[0],
      createdAt: new Date().toISOString(),
      tags: reviewData.tags || [],
      recommends: reviewData.recommends ?? true,
      likesCount: 0,
      isLiked: false,
    };

    setReviews((prev) => [newReview, ...prev]);
    triggerPushNotification('Review Published!', `Your review for "${newReview.movieTitle}" (${newReview.rating}★) is live.`, 'new_review');
    setActiveTab('reviews');
  }, [currentUser, triggerPushNotification]);

  const updateReview = useCallback((id: string, updated: Partial<MovieReview>) => {
    setReviews((prev) =>
      prev.map((r) => {
        if (r.id === id) {
          return {
            ...r,
            ...updated,
            rating: updated.rating ? Math.max(1, Math.min(5, updated.rating)) : r.rating,
          };
        }
        return r;
      })
    );
    triggerPushNotification('Review Updated', 'Your edits have been saved.', 'system');
  }, [triggerPushNotification]);

  const deleteReview = useCallback((id: string) => {
    const target = reviews.find((r) => r.id === id);
    setReviews((prev) => prev.filter((r) => r.id !== id));
    if (target) {
      triggerPushNotification('Review Deleted', `Review for "${target.movieTitle}" was removed.`, 'system');
    }
  }, [reviews, triggerPushNotification]);

  const toggleLikeReview = useCallback((id: string) => {
    setReviews((prev) =>
      prev.map((r) => {
        if (r.id === id) {
          const isLikedNow = !r.isLiked;
          const newLikes = isLikedNow ? r.likesCount + 1 : Math.max(0, r.likesCount - 1);
          if (isLikedNow && r.userId === currentUser?.id) {
            triggerPushNotification('New Like!', `Someone appreciated your review for "${r.movieTitle}".`, 'review_like');
          }
          return { ...r, isLiked: isLikedNow, likesCount: newLikes };
        }
        return r;
      })
    );
  }, [currentUser, triggerPushNotification]);

  // Notifications Operations
  const markNotificationAsRead = useCallback((id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  }, []);

  const markAllNotificationsAsRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }, []);

  const clearAllNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  // Automation Test Helper Fixtures
  const resetToDefaultFixtures = useCallback(() => {
    setCurrentUser(null);
    setRegisteredUsers([INITIAL_DEMO_USER]);
    setReviews(INITIAL_REVIEWS);
    setNotifications(INITIAL_NOTIFICATIONS);
    setActiveToasts([]);
    localStorage.removeItem('cinetrack_current_user');
    triggerPushNotification('State Reset Complete', 'All profiles, reviews, and test fixtures were reset to initial landing state.', 'system');
  }, [triggerPushNotification]);

  const seedRandomReview = useCallback(() => {
    const movieSamples = [
      { title: 'Blade Runner 2049', rating: 5, tags: ['Cyberpunk', 'Sci-Fi'], text: 'A visual and sonic masterwork that expands the lore with profound existential weight.' },
      { title: 'Oppenheimer', rating: 5, tags: ['Drama', 'Biography'], text: 'Electrifying biographical thriller with relentless momentum and masterclass editing.' },
      { title: 'Everything Everywhere All at Once', rating: 5, tags: ['Sci-Fi', 'Comedy'], text: 'A dizzying, deeply moving multiverse odyssey about family and empathy.' },
      { title: 'The Batman', rating: 4, tags: ['Action', 'Crime'], text: 'Atmospheric neo-noir take with fantastic sound design and gritty Gotham aesthetic.' },
      { title: 'Whiplash', rating: 5, tags: ['Drama', 'Music'], text: 'Unforgiving tension and powerhouse performances. The final drum solo is legendary.' },
      { title: 'Spider-Man: Across the Spider-Verse', rating: 5, tags: ['Animation', 'Action'], text: 'A visual triumph pushing the boundaries of animation artistry.' }
    ];
    const picked = movieSamples[Math.floor(Math.random() * movieSamples.length)];
    addReview({
      movieTitle: picked.title,
      rating: picked.rating,
      reviewText: picked.text,
      watchDate: new Date().toISOString().split('T')[0],
      tags: picked.tags,
      recommends: true,
    });
  }, [addReview]);

  const unreadNotificationCount = notifications.filter((n) => !n.read).length;

  return (
    <AppContext.Provider
      value={{
        currentUser,
        isAuthenticated: !!currentUser,
        activeTab,
        setActiveTab,
        authMode,
        setAuthMode,
        isAuthModalOpen,
        setIsAuthModalOpen,
        login,
        signup,
        logout,
        updateProfile,
        reviews,
        addReview,
        updateReview,
        deleteReview,
        toggleLikeReview,
        notifications,
        unreadNotificationCount,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        clearAllNotifications,
        triggerPushNotification,
        activeToasts,
        dismissToast,
        requestBrowserNotificationPermission,
        browserNotificationPermission,
        isDarkMode,
        toggleDarkMode,
        resetToDefaultFixtures,
        seedRandomReview,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
