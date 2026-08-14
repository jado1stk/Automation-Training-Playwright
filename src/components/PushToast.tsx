import React from 'react';
import { useApp } from '../context/AppContext';
import { Bell, Heart, Film, Sparkles, X, Info } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';

export const PushToast: React.FC = () => {
  const { activeToasts, dismissToast } = useApp();

  const getIcon = (type: string) => {
    switch (type) {
      case 'review_like':
        return <Heart className="w-5 h-5 text-rose-500 fill-rose-500" />;
      case 'new_review':
        return <Film className="w-5 h-5 text-amber-500" />;
      case 'profile_update':
        return <Sparkles className="w-5 h-5 text-emerald-500" />;
      case 'system':
        return <Info className="w-5 h-5 text-indigo-500" />;
      default:
        return <Bell className="w-5 h-5 text-indigo-500" />;
    }
  };

  return (
    <div
      id="push-toast-container"
      data-testid="push-toast-container"
      aria-live="polite"
      className="fixed bottom-5 right-5 z-50 flex flex-col gap-3 max-w-sm w-full pointer-events-none"
    >
      <AnimatePresence>
        {activeToasts.map((toast) => (
          <motion.div
            key={toast.id}
            id={`push-toast-${toast.id}`}
            data-testid="push-toast-item"
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 15, scale: 0.95 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
            className="pointer-events-auto bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100 rounded-xl p-4 shadow-xl shadow-zinc-950/10 flex items-start gap-3 backdrop-blur-md relative overflow-hidden"
          >
            {/* Ambient accent bar */}
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-indigo-600 dark:bg-indigo-500" />
            
            <div className="p-2 bg-zinc-100 dark:bg-zinc-800 rounded-lg shrink-0 mt-0.5">
              {getIcon(toast.type)}
            </div>

            <div className="flex-1 min-w-0 pr-2">
              <div className="flex items-center gap-2 mb-0.5">
                <span className="text-xs font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                  Real-time Alert
                </span>
                <span className="text-[11px] text-zinc-400 dark:text-zinc-500">
                  Just now
                </span>
              </div>
              <h4
                id={`push-toast-title-${toast.id}`}
                data-testid="push-toast-title"
                className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 leading-tight"
              >
                {toast.title}
              </h4>
              <p
                id={`push-toast-msg-${toast.id}`}
                data-testid="push-toast-message"
                className="text-xs text-zinc-600 dark:text-zinc-300 mt-1 leading-relaxed line-clamp-2"
              >
                {toast.message}
              </p>
            </div>

            <button
              id={`dismiss-toast-btn-${toast.id}`}
              data-testid="dismiss-toast-btn"
              onClick={() => dismissToast(toast.id)}
              aria-label="Dismiss notification"
              className="p-1 rounded-md text-zinc-400 hover:text-zinc-700 dark:text-zinc-500 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};
