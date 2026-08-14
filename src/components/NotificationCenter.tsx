import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Bell, CheckCheck, Trash2, Send, ShieldCheck, Sparkles, Volume2 } from 'lucide-react';
import { AppNotification } from '../types';

interface NotificationCenterProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NotificationCenter: React.FC<NotificationCenterProps> = ({ isOpen, onClose }) => {
  const {
    notifications,
    unreadNotificationCount,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    clearAllNotifications,
    triggerPushNotification,
    requestBrowserNotificationPermission,
    browserNotificationPermission,
  } = useApp();

  const [testPushTitle, setTestPushTitle] = useState('Movie Alert!');
  const [testPushBody, setTestPushBody] = useState('Your favorite director just announced a new sci-fi project.');
  const [testPushType, setTestPushType] = useState<AppNotification['type']>('system');
  const [showSimulateForm, setShowSimulateForm] = useState(false);

  if (!isOpen) return null;

  const handleSendTestPush = (e: React.FormEvent) => {
    e.preventDefault();
    if (!testPushTitle.trim() || !testPushBody.trim()) return;
    triggerPushNotification(testPushTitle.trim(), testPushBody.trim(), testPushType);
    setTestPushTitle('Movie Alert!');
    setTestPushBody('A friend liked your recent 5-star movie review.');
    setShowSimulateForm(false);
  };

  return (
    <div
      id="notification-center-drawer"
      data-testid="notification-center-drawer"
      className="absolute right-0 top-full mt-2 w-96 max-w-[calc(100vw-2rem)] bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-2xl shadow-zinc-950/20 z-50 overflow-hidden flex flex-col max-h-[85vh] animate-in fade-in slide-in-from-top-2 duration-150"
    >
      {/* Header */}
      <div className="p-4 border-b border-zinc-100 dark:border-zinc-800 flex items-center justify-between bg-zinc-50/70 dark:bg-zinc-900/80">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 rounded-lg">
            <Bell className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-semibold text-sm text-zinc-900 dark:text-zinc-100">
              Notifications
            </h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              {unreadNotificationCount > 0
                ? `${unreadNotificationCount} unread alert${unreadNotificationCount > 1 ? 's' : ''}`
                : 'All caught up!'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1">
          {unreadNotificationCount > 0 && (
            <button
              id="mark-all-read-btn"
              data-testid="mark-all-read-btn"
              onClick={markAllNotificationsAsRead}
              title="Mark all as read"
              className="p-1.5 text-xs text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 rounded-lg transition-colors flex items-center gap-1"
            >
              <CheckCheck className="w-4 h-4" />
            </button>
          )}
          {notifications.length > 0 && (
            <button
              id="clear-all-notifs-btn"
              data-testid="clear-all-notifs-btn"
              onClick={clearAllNotifications}
              title="Clear all notifications"
              className="p-1.5 text-xs text-zinc-400 hover:text-rose-600 dark:text-zinc-500 dark:hover:text-rose-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Browser Permission Banner */}
      {browserNotificationPermission !== 'granted' && browserNotificationPermission !== 'unsupported' && (
        <div
          id="browser-permission-banner"
          data-testid="browser-permission-banner"
          className="p-3 bg-amber-50 dark:bg-amber-950/40 border-b border-amber-200 dark:border-amber-900/50 flex items-center justify-between gap-3 text-xs"
        >
          <div className="flex items-center gap-2 text-amber-800 dark:text-amber-300">
            <ShieldCheck className="w-4 h-4 shrink-0" />
            <span>Enable real-time browser push notifications</span>
          </div>
          <button
            id="enable-browser-push-btn"
            data-testid="enable-browser-push-btn"
            onClick={requestBrowserNotificationPermission}
            className="px-2.5 py-1 bg-amber-600 hover:bg-amber-700 text-white rounded-md font-medium text-xs whitespace-nowrap transition-colors"
          >
            Allow
          </button>
        </div>
      )}

      {/* Trigger Real-Time Notification Simulator (Crucial for Automation Test Suites) */}
      <div className="p-3 bg-indigo-50/50 dark:bg-indigo-950/30 border-b border-indigo-100 dark:border-indigo-950 flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-indigo-900 dark:text-indigo-300 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
            Push Dispatcher for Automated Testing
          </span>
          <button
            id="toggle-simulate-push-form"
            data-testid="toggle-simulate-push-form"
            onClick={() => setShowSimulateForm(!showSimulateForm)}
            className="text-xs text-indigo-600 dark:text-indigo-400 underline font-medium hover:text-indigo-800"
          >
            {showSimulateForm ? 'Hide Form' : 'Send Push'}
          </button>
        </div>

        {showSimulateForm ? (
          <form onSubmit={handleSendTestPush} className="flex flex-col gap-2 pt-1">
            <input
              id="test-push-title-input"
              data-testid="test-push-title-input"
              type="text"
              value={testPushTitle}
              onChange={(e) => setTestPushTitle(e.target.value)}
              placeholder="Notification Title..."
              className="text-xs px-2.5 py-1.5 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              required
            />
            <input
              id="test-push-body-input"
              data-testid="test-push-body-input"
              type="text"
              value={testPushBody}
              onChange={(e) => setTestPushBody(e.target.value)}
              placeholder="Notification Message / Body..."
              className="text-xs px-2.5 py-1.5 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              required
            />
            <div className="flex gap-2">
              <select
                id="test-push-type-select"
                data-testid="test-push-type-select"
                value={testPushType}
                onChange={(e) => setTestPushType(e.target.value as AppNotification['type'])}
                className="text-xs px-2 py-1 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100"
              >
                <option value="review_like">Review Like</option>
                <option value="new_review">New Review</option>
                <option value="system">System Alert</option>
                <option value="profile_update">Profile Update</option>
                <option value="custom_push">Custom Push</option>
              </select>
              <button
                id="dispatch-test-push-btn"
                data-testid="dispatch-test-push-btn"
                type="submit"
                className="flex-1 px-3 py-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium text-xs flex items-center justify-center gap-1 transition-colors"
              >
                <Send className="w-3 h-3" />
                Dispatch Push
              </button>
            </div>
          </form>
        ) : (
          <div className="flex gap-2">
            <button
              id="quick-push-like-btn"
              data-testid="quick-push-like-btn"
              onClick={() => triggerPushNotification('New Review Reaction', 'A cinephile loved your review of Oppenheimer!', 'review_like')}
              className="flex-1 py-1 px-2 text-[11px] bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-700 font-medium transition-colors"
            >
              + Quick Like Alert
            </button>
            <button
              id="quick-push-system-btn"
              data-testid="quick-push-system-btn"
              onClick={() => triggerPushNotification('System Notice', 'Test automation hook verified at ' + new Date().toLocaleTimeString(), 'system')}
              className="flex-1 py-1 px-2 text-[11px] bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-700 font-medium transition-colors"
            >
              + Quick System Alert
            </button>
          </div>
        )}
      </div>

      {/* Notifications List */}
      <div
        id="notification-items-list"
        data-testid="notification-items-list"
        className="flex-1 overflow-y-auto divide-y divide-zinc-100 dark:divide-zinc-800/60 p-1"
      >
        {notifications.length === 0 ? (
          <div className="p-8 text-center text-zinc-400 dark:text-zinc-500">
            <Bell className="w-8 h-8 mx-auto mb-2 opacity-30" />
            <p className="text-sm font-medium">No notifications yet</p>
            <p className="text-xs mt-0.5">Push notifications and review activity will appear here</p>
          </div>
        ) : (
          notifications.map((notif) => (
            <div
              key={notif.id}
              id={`notification-item-${notif.id}`}
              data-testid="notification-item"
              data-read={notif.read ? 'true' : 'false'}
              onClick={() => markNotificationAsRead(notif.id)}
              className={`p-3 rounded-xl transition-colors cursor-pointer flex items-start gap-3 relative ${
                notif.read
                  ? 'hover:bg-zinc-50 dark:hover:bg-zinc-800/40 opacity-75'
                  : 'bg-indigo-50/40 dark:bg-indigo-950/20 hover:bg-indigo-50/80 dark:hover:bg-indigo-950/40'
              }`}
            >
              {!notif.read && (
                <div
                  id={`unread-indicator-${notif.id}`}
                  data-testid="unread-indicator"
                  className="w-2 h-2 rounded-full bg-indigo-600 dark:bg-indigo-400 mt-1.5 shrink-0"
                />
              )}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2 mb-0.5">
                  <h4 className="text-xs font-semibold text-zinc-900 dark:text-zinc-100 truncate">
                    {notif.title}
                  </h4>
                  <span className="text-[10px] text-zinc-400 dark:text-zinc-500 whitespace-nowrap">
                    {notif.timestamp}
                  </span>
                </div>
                <p className="text-xs text-zinc-600 dark:text-zinc-300 leading-snug">
                  {notif.message}
                </p>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Footer */}
      <div className="p-2.5 border-t border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/60 flex items-center justify-between text-xs text-zinc-500 dark:text-zinc-400">
        <span className="flex items-center gap-1 text-[11px]">
          <Volume2 className="w-3 h-3 text-zinc-400" />
          Sound effects active
        </span>
        <button
          id="close-notifications-btn"
          data-testid="close-notifications-btn"
          onClick={onClose}
          className="text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:underline"
        >
          Close
        </button>
      </div>
    </div>
  );
};
