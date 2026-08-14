import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { MovieReview } from '../types';
import {
  Star,
  Search,
  SlidersHorizontal,
  Heart,
  Edit3,
  Trash2,
  ThumbsUp,
  ThumbsDown,
  Calendar,
  Sparkles,
  X,
  Check
} from 'lucide-react';

export const MovieReviewsList: React.FC = () => {
  const {
    reviews,
    updateReview,
    deleteReview,
    toggleLikeReview,
    currentUser,
    setActiveTab,
    seedRandomReview,
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [ratingFilter, setRatingFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'rating' | 'likes'>('newest');

  // Edit Review Modal state
  const [editingReview, setEditingReview] = useState<MovieReview | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editRating, setEditRating] = useState(5);
  const [editReviewText, setEditReviewText] = useState('');
  const [editRecommends, setEditRecommends] = useState(true);

  // Delete confirm dialog
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const filteredReviews = useMemo(() => {
    return reviews
      .filter((r) => {
        const matchesSearch =
          r.movieTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
          r.reviewText.toLowerCase().includes(searchQuery.toLowerCase()) ||
          r.authorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          r.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));

        const matchesRating =
          ratingFilter === 'all' ? true : r.rating === parseInt(ratingFilter, 10);

        return matchesSearch && matchesRating;
      })
      .sort((a, b) => {
        if (sortBy === 'rating') {
          return b.rating - a.rating;
        }
        if (sortBy === 'likes') {
          return b.likesCount - a.likesCount;
        }
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
  }, [reviews, searchQuery, ratingFilter, sortBy]);

  const handleStartEdit = (review: MovieReview) => {
    setEditingReview(review);
    setEditTitle(review.movieTitle);
    setEditRating(review.rating);
    setEditReviewText(review.reviewText);
    setEditRecommends(review.recommends);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingReview) return;
    updateReview(editingReview.id, {
      movieTitle: editTitle.trim(),
      rating: editRating,
      reviewText: editReviewText.trim(),
      recommends: editRecommends,
    });
    setEditingReview(null);
  };

  const renderStars = (ratingNum: number) => {
    return (
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-4 h-4 ${
              star <= ratingNum
                ? 'text-amber-400 fill-amber-400'
                : 'text-zinc-300 dark:text-zinc-700'
            }`}
          />
        ))}
        <span className="ml-1.5 text-xs font-bold text-zinc-700 dark:text-zinc-300">
          {ratingNum}.0
        </span>
      </div>
    );
  };

  return (
    <div id="movie-reviews-view" data-testid="movie-reviews-view" className="space-y-6 max-w-5xl mx-auto">
      {/* Search, Filter & Action Toolbar */}
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-4 shadow-sm flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Search Bar */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            id="search-reviews-input"
            data-testid="search-reviews-input"
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search movie title, tags, text..."
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800/80 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto justify-between md:justify-end">
          {/* Rating Filter */}
          <div className="flex items-center gap-1.5">
            <SlidersHorizontal className="w-3.5 h-3.5 text-zinc-400" />
            <select
              id="rating-filter-select"
              data-testid="rating-filter-select"
              value={ratingFilter}
              onChange={(e) => setRatingFilter(e.target.value)}
              className="text-xs px-2.5 py-2 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            >
              <option value="all">All Ratings (1-5★)</option>
              <option value="5">5 Stars only</option>
              <option value="4">4 Stars only</option>
              <option value="3">3 Stars only</option>
              <option value="2">2 Stars only</option>
              <option value="1">1 Star only</option>
            </select>
          </div>

          {/* Sort By */}
          <select
            id="sort-reviews-select"
            data-testid="sort-reviews-select"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'newest' | 'rating' | 'likes')}
            className="text-xs px-2.5 py-2 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          >
            <option value="newest">Sort: Newest First</option>
            <option value="rating">Sort: Highest Rating</option>
            <option value="likes">Sort: Most Liked</option>
          </select>

          {/* Quick Seed Review Button for automated test convenience */}
          <button
            id="quick-seed-review-btn"
            data-testid="quick-seed-review-btn"
            onClick={seedRandomReview}
            title="Add a sample review fixture"
            className="px-3 py-2 text-xs font-semibold bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 rounded-xl transition-colors flex items-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            + Sample Review
          </button>
        </div>
      </div>

      {/* Reviews Grid */}
      <div id="reviews-list-container" data-testid="reviews-list-container" className="space-y-4">
        {filteredReviews.length === 0 ? (
          <div
            id="empty-reviews-state"
            data-testid="empty-reviews-state"
            className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-12 text-center"
          >
            <Star className="w-12 h-12 mx-auto text-zinc-300 dark:text-zinc-700 mb-3" />
            <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
              No movie reviews found
            </h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 max-w-sm mx-auto">
              {searchQuery || ratingFilter !== 'all'
                ? 'Try adjusting your search query or rating filter criteria.'
                : 'Be the first to review a movie! Share your rating and verdict with the community.'}
            </p>
            <button
              id="empty-state-write-btn"
              data-testid="empty-state-write-btn"
              onClick={() => setActiveTab('write-review')}
              className="mt-4 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold transition-colors"
            >
              Write First Review
            </button>
          </div>
        ) : (
          filteredReviews.map((review) => {
            const isAuthor = currentUser?.id === review.userId;
            return (
              <article
                key={review.id}
                id={`review-card-${review.id}`}
                data-testid="review-card"
                className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5 sm:p-6 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden"
              >
                {/* Header: Title + Stars + Recommend Badge */}
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 pb-3 border-b border-zinc-100 dark:border-zinc-800/80">
                  <div>
                    <div className="flex items-center gap-2.5 flex-wrap">
                      <h3
                        id={`movie-title-header-${review.id}`}
                        data-testid="review-movie-title"
                        className="text-lg font-bold text-zinc-900 dark:text-zinc-100"
                      >
                        {review.movieTitle}
                      </h3>
                      {review.recommends ? (
                        <span
                          id={`badge-recommend-${review.id}`}
                          data-testid="badge-recommend-yes"
                          className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 flex items-center gap-1"
                        >
                          <ThumbsUp className="w-3 h-3" />
                          Recommended
                        </span>
                      ) : (
                        <span
                          id={`badge-not-recommend-${review.id}`}
                          data-testid="badge-recommend-no"
                          className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 dark:bg-rose-950/60 text-rose-800 dark:text-rose-300 flex items-center gap-1"
                        >
                          <ThumbsDown className="w-3 h-3" />
                          Not Recommended
                        </span>
                      )}
                    </div>

                    <div
                      id={`star-display-${review.id}`}
                      data-testid="review-star-rating"
                      data-rating={review.rating}
                      className="mt-1"
                    >
                      {renderStars(review.rating)}
                    </div>
                  </div>

                  {/* Author Meta */}
                  <div className="flex items-center gap-2.5">
                    <img
                      src={review.authorAvatar}
                      alt={review.authorName}
                      className="w-8 h-8 rounded-full object-cover border border-zinc-200 dark:border-zinc-700"
                    />
                    <div className="text-right sm:text-left">
                      <p
                        id={`review-author-${review.id}`}
                        data-testid="review-author-name"
                        className="text-xs font-semibold text-zinc-800 dark:text-zinc-200"
                      >
                        {review.authorName}
                      </p>
                      <p className="text-[10px] text-zinc-400 dark:text-zinc-500 flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {review.watchDate || new Date(review.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Review Body */}
                <p
                  id={`review-body-text-${review.id}`}
                  data-testid="review-body-text"
                  className="mt-3 text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed whitespace-pre-wrap"
                >
                  {review.reviewText}
                </p>

                {/* Tags */}
                {review.tags && review.tags.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {review.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-[11px] px-2 py-0.5 bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 rounded-md font-medium"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}

                {/* Action Bar: Like, Edit, Delete */}
                <div className="mt-4 pt-3 border-t border-zinc-100 dark:border-zinc-800/80 flex items-center justify-between">
                  <button
                    id={`like-review-btn-${review.id}`}
                    data-testid="like-review-btn"
                    onClick={() => toggleLikeReview(review.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                      review.isLiked
                        ? 'bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400'
                        : 'bg-zinc-100 dark:bg-zinc-800/80 text-zinc-600 dark:text-zinc-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50/50'
                    }`}
                  >
                    <Heart
                      className={`w-3.5 h-3.5 ${
                        review.isLiked ? 'fill-rose-600 text-rose-600' : ''
                      }`}
                    />
                    <span id={`like-count-${review.id}`} data-testid="like-count">
                      {review.likesCount}
                    </span>
                  </button>

                  {/* Author Controls */}
                  <div className="flex items-center gap-2">
                    <button
                      id={`edit-review-btn-${review.id}`}
                      data-testid="edit-review-btn"
                      onClick={() => handleStartEdit(review)}
                      className="px-2.5 py-1.5 text-xs text-zinc-600 dark:text-zinc-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors flex items-center gap-1"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>Edit</span>
                    </button>

                    <button
                      id={`delete-review-btn-${review.id}`}
                      data-testid="delete-review-btn"
                      onClick={() => setDeleteConfirmId(review.id)}
                      className="px-2.5 py-1.5 text-xs text-zinc-400 hover:text-rose-600 dark:text-zinc-500 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition-colors flex items-center gap-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              </article>
            );
          })
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div
          id="delete-confirm-modal"
          data-testid="delete-confirm-modal"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/50 backdrop-blur-xs"
        >
          <div className="w-full max-w-sm bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 shadow-2xl">
            <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
              Delete Movie Review?
            </h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-2">
              Are you sure you want to delete this review? This action cannot be undone.
            </p>
            <div className="mt-6 flex items-center justify-end gap-2">
              <button
                id="cancel-delete-btn"
                data-testid="cancel-delete-btn"
                onClick={() => setDeleteConfirmId(null)}
                className="px-3 py-2 text-xs font-semibold text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-xl"
              >
                Cancel
              </button>
              <button
                id="confirm-delete-btn"
                data-testid="confirm-delete-btn"
                onClick={() => {
                  deleteReview(deleteConfirmId);
                  setDeleteConfirmId(null);
                }}
                className="px-4 py-2 text-xs font-semibold bg-rose-600 hover:bg-rose-700 text-white rounded-xl"
              >
                Yes, Delete Review
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Review Modal */}
      {editingReview && (
        <div
          id="edit-review-modal"
          data-testid="edit-review-modal"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/60 backdrop-blur-xs"
        >
          <div className="w-full max-w-lg bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 shadow-2xl overflow-y-auto max-h-[90vh]">
            <div className="flex items-center justify-between pb-4 border-b border-zinc-100 dark:border-zinc-800">
              <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
                Edit Movie Review
              </h3>
              <button
                id="close-edit-review-btn"
                data-testid="close-edit-review-btn"
                onClick={() => setEditingReview(null)}
                className="p-1 rounded-lg text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-4 mt-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                  Movie Title
                </label>
                <input
                  id="edit-movie-title-input"
                  data-testid="edit-movie-title-input"
                  type="text"
                  required
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                  Star Rating (1 to 5)
                </label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <button
                      type="button"
                      key={s}
                      id={`edit-star-btn-${s}`}
                      data-testid={`edit-star-btn-${s}`}
                      onClick={() => setEditRating(s)}
                      className="p-1"
                    >
                      <Star
                        className={`w-6 h-6 ${
                          s <= editRating
                            ? 'text-amber-400 fill-amber-400'
                            : 'text-zinc-300 dark:text-zinc-700'
                        }`}
                      />
                    </button>
                  ))}
                  <span className="text-xs font-bold text-zinc-700 dark:text-zinc-300 ml-2">
                    {editRating} / 5 Stars
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                  Review Text
                </label>
                <textarea
                  id="edit-review-text-input"
                  data-testid="edit-review-text-input"
                  required
                  rows={4}
                  value={editReviewText}
                  onChange={(e) => setEditReviewText(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                  Recommendation
                </label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    id="edit-recommend-yes"
                    data-testid="edit-recommend-yes"
                    onClick={() => setEditRecommends(true)}
                    className={`flex-1 py-1.5 rounded-lg text-xs font-semibold ${
                      editRecommends
                        ? 'bg-emerald-600 text-white'
                        : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400'
                    }`}
                  >
                    Recommend
                  </button>
                  <button
                    type="button"
                    id="edit-recommend-no"
                    data-testid="edit-recommend-no"
                    onClick={() => setEditRecommends(false)}
                    className={`flex-1 py-1.5 rounded-lg text-xs font-semibold ${
                      !editRecommends
                        ? 'bg-rose-600 text-white'
                        : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400'
                    }`}
                  >
                    Do Not Recommend
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-zinc-100 dark:border-zinc-800">
                <button
                  type="button"
                  id="cancel-edit-review-btn"
                  data-testid="cancel-edit-review-btn"
                  onClick={() => setEditingReview(null)}
                  className="px-4 py-2 text-xs font-semibold text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  id="save-edit-review-btn"
                  data-testid="save-edit-review-btn"
                  className="px-4 py-2 text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl flex items-center gap-1.5"
                >
                  <Check className="w-3.5 h-3.5" />
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
