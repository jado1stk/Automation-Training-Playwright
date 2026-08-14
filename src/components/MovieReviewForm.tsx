import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { AVAILABLE_GENRES } from '../data/seedData';
import { Star, Film, Calendar, ThumbsUp, ThumbsDown, CheckCircle2, RotateCcw, Sparkles } from 'lucide-react';

interface MovieReviewFormProps {
  onSuccess?: () => void;
}

export const MovieReviewForm: React.FC<MovieReviewFormProps> = ({ onSuccess }) => {
  const { addReview, currentUser } = useApp();

  const [movieTitle, setMovieTitle] = useState('');
  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [reviewText, setReviewText] = useState('');
  const [watchDate, setWatchDate] = useState<string>(() => new Date().toISOString().split('T')[0]);
  const [recommends, setRecommends] = useState<boolean>(true);
  const [selectedTags, setSelectedTags] = useState<string[]>(['Sci-Fi']);
  const [customTag, setCustomTag] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const getRatingLabel = (val: number) => {
    switch (val) {
      case 1:
        return '1 / 5 - Poor';
      case 2:
        return '2 / 5 - Fair';
      case 3:
        return '3 / 5 - Good';
      case 4:
        return '4 / 5 - Very Good';
      case 5:
        return '5 / 5 - Masterpiece';
      default:
        return `${val} / 5 Stars`;
    }
  };

  const handleTagToggle = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((t) => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const handleAddCustomTag = (e: React.KeyboardEvent | React.MouseEvent) => {
    if ('key' in e && e.key !== 'Enter') return;
    e.preventDefault();
    if (!customTag.trim()) return;
    if (!selectedTags.includes(customTag.trim())) {
      setSelectedTags([...selectedTags, customTag.trim()]);
    }
    setCustomTag('');
  };

  const handleReset = () => {
    setMovieTitle('');
    setRating(5);
    setReviewText('');
    setWatchDate(new Date().toISOString().split('T')[0]);
    setRecommends(true);
    setSelectedTags(['Sci-Fi']);
    setErrorMessage(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!movieTitle.trim()) {
      setErrorMessage('Movie title is required.');
      return;
    }

    if (!reviewText.trim()) {
      setErrorMessage('Please write at least a sentence for your review.');
      return;
    }

    addReview({
      movieTitle: movieTitle.trim(),
      rating,
      reviewText: reviewText.trim(),
      watchDate,
      tags: selectedTags,
      recommends,
    });

    setIsSubmitted(true);
    handleReset();
    if (onSuccess) {
      onSuccess();
    }
  };

  return (
    <div
      id="movie-review-form-card"
      data-testid="movie-review-form-card"
      className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 sm:p-8 shadow-xl shadow-zinc-950/5 max-w-3xl mx-auto"
    >
      {/* Header */}
      <div className="flex items-center justify-between gap-4 pb-6 border-b border-zinc-100 dark:border-zinc-800">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 bg-indigo-50 dark:bg-indigo-950/70 text-indigo-600 dark:text-indigo-400 rounded-xl">
              <Film className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
              Log a Movie Review
            </h2>
          </div>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
            Write your thoughts, set your 1 to 5 star rating, and share your verdict.
          </p>
        </div>

        {currentUser && (
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-zinc-50 dark:bg-zinc-800/60 rounded-xl border border-zinc-200 dark:border-zinc-700/60 text-xs">
            <span className="text-zinc-400">Reviewing as:</span>
            <span className="font-semibold text-zinc-800 dark:text-zinc-200 truncate max-w-[120px]">
              {currentUser.name}
            </span>
          </div>
        )}
      </div>

      {errorMessage && (
        <div
          id="review-error-message"
          data-testid="review-error-message"
          className="mt-4 p-3 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 rounded-xl text-xs text-rose-700 dark:text-rose-300"
        >
          {errorMessage}
        </div>
      )}

      {isSubmitted && (
        <div
          id="review-success-message"
          data-testid="review-success-message"
          className="mt-4 p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/50 rounded-xl text-xs text-emerald-700 dark:text-emerald-300 flex items-center gap-2"
        >
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>Review submitted and logged successfully!</span>
        </div>
      )}

      <form id="movie-review-form" data-testid="movie-review-form" onSubmit={handleSubmit} className="mt-6 space-y-6">
        {/* Movie Title (Self-Inputted, no search database needed) */}
        <div className="space-y-1.5">
          <label
            htmlFor="movie-title-input"
            className="block text-sm font-semibold text-zinc-800 dark:text-zinc-200"
          >
            Movie Name / Title <span className="text-rose-500">*</span>
          </label>
          <div className="relative">
            <input
              id="movie-title-input"
              data-testid="movie-title-input"
              type="text"
              required
              value={movieTitle}
              onChange={(e) => setMovieTitle(e.target.value)}
              placeholder="e.g. Interstellar, The Godfather, Spirited Away, Dune..."
              className="w-full px-4 py-3 text-sm rounded-xl border border-zinc-300 dark:border-zinc-700 bg-zinc-50/50 dark:bg-zinc-800/60 text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white dark:focus:bg-zinc-800 transition-all font-medium"
            />
          </div>
          <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
            Type any film name directly without requiring an external catalog search.
          </p>
        </div>

        {/* 1 to 5 Star Rating Counter */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label
              id="star-rating-label"
              data-testid="star-rating-label"
              className="block text-sm font-semibold text-zinc-800 dark:text-zinc-200"
            >
              Star Rating (1 to 5 Stars) <span className="text-rose-500">*</span>
            </label>
            <span
              id="rating-value-badge"
              data-testid="rating-value-badge"
              className="px-2.5 py-1 text-xs font-bold rounded-lg bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-900/40"
            >
              {getRatingLabel(hoverRating || rating)}
            </span>
          </div>

          <div
            id="star-counter-container"
            data-testid="star-counter-container"
            className="flex items-center gap-2 p-3 bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200 dark:border-zinc-700/60 rounded-xl"
          >
            {[1, 2, 3, 4, 5].map((starNum) => {
              const isActive = (hoverRating || rating) >= starNum;
              return (
                <button
                  type="button"
                  key={starNum}
                  id={`star-rating-${starNum}`}
                  data-testid={`star-rating-${starNum}`}
                  data-value={starNum}
                  onClick={() => setRating(starNum)}
                  onMouseEnter={() => setHoverRating(starNum)}
                  onMouseLeave={() => setHoverRating(null)}
                  aria-label={`Rate ${starNum} out of 5 stars`}
                  className="p-1.5 rounded-lg hover:scale-110 active:scale-95 transition-transform focus:outline-none focus:ring-2 focus:ring-amber-400"
                >
                  <Star
                    className={`w-8 h-8 transition-colors ${
                      isActive
                        ? 'text-amber-400 fill-amber-400 drop-shadow-sm'
                        : 'text-zinc-300 dark:text-zinc-600'
                    }`}
                  />
                </button>
              );
            })}

            <div className="ml-auto flex items-center gap-1.5 border-l border-zinc-200 dark:border-zinc-700 pl-4">
              <span className="text-xs text-zinc-500 dark:text-zinc-400">Value:</span>
              <input
                id="rating-number-input"
                data-testid="rating-number-input"
                type="number"
                min="1"
                max="5"
                value={rating}
                onChange={(e) => setRating(Math.max(1, Math.min(5, parseInt(e.target.value) || 1)))}
                className="w-12 px-2 py-1 text-center text-xs font-bold rounded-md border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>
          </div>
        </div>

        {/* Review Text */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label
              htmlFor="review-text-input"
              className="block text-sm font-semibold text-zinc-800 dark:text-zinc-200"
            >
              Your Written Review <span className="text-rose-500">*</span>
            </label>
            <span
              id="review-char-counter"
              data-testid="review-char-counter"
              className="text-[11px] text-zinc-400"
            >
              {reviewText.length} characters
            </span>
          </div>
          <textarea
            id="review-text-input"
            data-testid="review-text-input"
            required
            rows={4}
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
            placeholder="What made this film memorable? Discuss the performances, direction, screenplay, musical score, or cinematography..."
            className="w-full px-4 py-3 text-sm rounded-xl border border-zinc-300 dark:border-zinc-700 bg-zinc-50/50 dark:bg-zinc-800/60 text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white dark:focus:bg-zinc-800 transition-all leading-relaxed"
          />
        </div>

        {/* Watch Date & Recommendation Toggle */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Watch Date */}
          <div className="space-y-1.5">
            <label
              htmlFor="watch-date-input"
              className="block text-xs font-semibold text-zinc-750 dark:text-zinc-300"
            >
              Watch Date
            </label>
            <div className="relative">
              <Calendar className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                id="watch-date-input"
                data-testid="watch-date-input"
                type="date"
                value={watchDate}
                onChange={(e) => setWatchDate(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          {/* Recommendation */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-zinc-750 dark:text-zinc-300">
              Would you recommend this movie?
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                id="recommend-toggle-yes"
                data-testid="recommend-toggle-yes"
                onClick={() => setRecommends(true)}
                className={`py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors ${
                  recommends
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700'
                }`}
              >
                <ThumbsUp className="w-3.5 h-3.5" />
                Yes, Recommend
              </button>
              <button
                type="button"
                id="recommend-toggle-no"
                data-testid="recommend-toggle-no"
                onClick={() => setRecommends(false)}
                className={`py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors ${
                  !recommends
                    ? 'bg-rose-600 text-white shadow-xs'
                    : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700'
                }`}
              >
                <ThumbsDown className="w-3.5 h-3.5" />
                No, Skip It
              </button>
            </div>
          </div>
        </div>

        {/* Tags Selection */}
        <div className="space-y-2">
          <label className="block text-xs font-semibold text-zinc-750 dark:text-zinc-300">
            Movie Genres & Mood Tags
          </label>
          <div id="review-tags-container" data-testid="review-tags-container" className="flex flex-wrap gap-1.5">
            {AVAILABLE_GENRES.slice(0, 10).map((genre) => {
              const isSelected = selectedTags.includes(genre);
              return (
                <button
                  type="button"
                  key={genre}
                  id={`tag-btn-${genre.toLowerCase()}`}
                  data-testid="tag-pill-btn"
                  onClick={() => handleTagToggle(genre)}
                  className={`text-xs px-2.5 py-1 rounded-full font-medium transition-colors ${
                    isSelected
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700'
                  }`}
                >
                  {genre}
                </button>
              );
            })}
          </div>

          <div className="flex gap-2 pt-1">
            <input
              id="custom-tag-input"
              data-testid="custom-tag-input"
              type="text"
              value={customTag}
              onChange={(e) => setCustomTag(e.target.value)}
              onKeyDown={handleAddCustomTag}
              placeholder="Add custom tag (e.g. Masterpiece, IMAX, Plot Twist)..."
              className="flex-1 px-3 py-1.5 text-xs rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
            <button
              type="button"
              id="add-custom-tag-btn"
              data-testid="add-custom-tag-btn"
              onClick={handleAddCustomTag}
              className="px-3 py-1.5 text-xs font-medium bg-zinc-200 dark:bg-zinc-700 hover:bg-zinc-300 dark:hover:bg-zinc-600 text-zinc-800 dark:text-zinc-200 rounded-xl transition-colors"
            >
              + Add Tag
            </button>
          </div>
        </div>

        {/* Form Action Buttons */}
        <div className="flex items-center justify-between gap-3 pt-4 border-t border-zinc-100 dark:border-zinc-800">
          <button
            type="button"
            id="reset-review-form-btn"
            data-testid="reset-review-form-btn"
            onClick={handleReset}
            className="px-4 py-2.5 text-xs font-semibold text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-xl transition-colors flex items-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset Form
          </button>

          <button
            type="submit"
            id="submit-review-btn"
            data-testid="submit-review-btn"
            className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold text-sm shadow-md shadow-indigo-600/20 transition-all flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4" />
            Publish Movie Review
          </button>
        </div>
      </form>
    </div>
  );
};
