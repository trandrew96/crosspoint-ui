import { Link } from "react-router-dom";
import { FiEdit } from "react-icons/fi";
import type { User } from "firebase/auth"; // Import Firebase User type

interface GameReview {
  id: number;
  user_id: string;
  game_id: number;
  rating: number;
  review_text: string;
  created_at: string;
  updated_at: string;
}

interface GameReviewSectionProps {
  gameId: number;
  reviews: GameReview[];
  userReview: GameReview | null;
  reviewsLoading: boolean;
  user: User | null; // Use Firebase User type
}

export default function GameReviewSection({
  gameId,
  reviews,
  userReview,
  reviewsLoading,
  user,
}: GameReviewSectionProps) {
  return (
    <section className="p-5 md:bg-slate-800/75 rounded-sm mt-5 drop-shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold tracking-tight">
          User Reviews {reviews.length > 0 && `(${reviews.length})`}
        </h2>

        {/* Action button - changes based on user state */}
        {!user ? (
          <Link
            to="/signin"
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
          >
            Sign in to Review
          </Link>
        ) : userReview ? (
          <Link
            to={`/games/${gameId}/review`}
            className="flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-md transition-colors"
          >
            <FiEdit size={16} />
            Edit Your Review
          </Link>
        ) : (
          <></>
        )}
      </div>

      {reviewsLoading ? (
        // Loading skeleton - grid layout
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 animate-pulse">
          {[1, 2, 3].map((i) => (
            <div key={i} className="border border-gray-700 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <div className="w-12 h-12 bg-gray-700 rounded-full"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-700 rounded w-1/2"></div>
                  <div className="h-3 bg-gray-700 rounded w-full"></div>
                  <div className="h-3 bg-gray-700 rounded w-5/6"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : reviews.length === 0 ? (
        // No reviews yet
        <div className="text-center py-12 border-t border-gray-700">
          <p className="text-gray-400 mb-3">No reviews yet. Be the first!</p>
          {user && (
            <Link
              to={`/games/${gameId}/review`}
              className="inline-block px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
            >
              Write the First Review
            </Link>
          )}
        </div>
      ) : (
        // Display reviews - grid layout
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* User's own review first (if exists) */}
          {userReview && (
            <div className="border-2 border-indigo-500/30 bg-indigo-500/5 rounded-lg p-4">
              <div className="flex items-start justify-between gap-3 mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                    You
                  </div>
                  <div>
                    <p className="font-semibold text-indigo-400 text-sm">
                      Your Review
                    </p>
                    <p className="text-xs text-gray-500">
                      {new Date(userReview.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
              <div className="text-2xl font-bold text-indigo-400 mb-2">
                {userReview.rating}/10
              </div>
              {userReview.review_text && (
                <p className="text-gray-300 text-sm whitespace-pre-wrap line-clamp-4">
                  {userReview.review_text}
                </p>
              )}
            </div>
          )}

          {/* Other users' reviews */}
          {reviews
            .filter((review) => review.user_id !== user?.uid)
            .map((review) => (
              <div
                key={review.id}
                className="border border-gray-700 rounded-lg p-4 hover:border-gray-600 transition-colors"
              >
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center text-white font-bold text-sm">
                      {review.user_id.slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-semibold text-sm">Anonymous User</p>
                      <p className="text-xs text-gray-500">
                        {new Date(review.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="text-2xl font-bold text-gray-300 mb-2">
                  {review.rating}/10
                </div>
                {review.review_text && (
                  <p className="text-gray-300 text-sm whitespace-pre-wrap line-clamp-4">
                    {review.review_text}
                  </p>
                )}
              </div>
            ))}
        </div>
      )}
      <aside className="flex justify-center w-full py-5">
        {!userReview && !(reviews.length == 0) && (
          <Link
            to={`/games/${gameId}/review`}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
          >
            Leave a Review
          </Link>
        )}
      </aside>
    </section>
  );
}
