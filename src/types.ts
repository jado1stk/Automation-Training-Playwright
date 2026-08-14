export interface UserProfile {
  id: string;
  name: string;
  username: string;
  email: string;
  bio: string;
  location: string;
  avatarUrl: string;
  favoriteGenres: string[];
  joinedDate: string;
  website?: string;
  notificationPreferences: {
    browserPush: boolean;
    soundEnabled: boolean;
    reviewLikes: boolean;
    systemAlerts: boolean;
  };
}

export interface MovieReview {
  id: string;
  userId: string;
  authorName: string;
  authorAvatar: string;
  movieTitle: string;
  rating: number; // 1 to 5
  reviewText: string;
  watchDate: string;
  createdAt: string;
  tags: string[];
  recommends: boolean;
  likesCount: number;
  isLiked?: boolean;
}

export interface AppNotification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'review_like' | 'system' | 'new_review' | 'profile_update' | 'custom_push';
  read: boolean;
  timestamp: string;
  targetId?: string;
}

export type ActiveTab = 'dashboard' | 'reviews' | 'write-review' | 'profile' | 'test-suite';

export type AuthMode = 'login' | 'signup';
