import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { reviewAPI } from "../utils/apiClient";
import ReviewCardSkeleton from "../components/skeletons/ReviewCardSkeleton";
import { FiEdit } from "react-icons/fi"; // Import edit icon

interface Review {
  id: number;
  game_id: number;
  game_name: string;
  cover?: { url: string };
  rating: number;
  review_text: string;
  created_at: string;
  updated_at: string;
}

const MyReviews = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      navigate("/signin");
      return;
    }

    const fetchReviews = async () => {
      try {
        const data = await reviewAPI.getMyReviews();
        console.log(data.reviews);
        setReviews(data.reviews);
      } catch (err: any) {
        setError(err.message || "Failed to load reviews");
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [user, navigate]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-8">My Reviews</h1>

        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <ReviewCardSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="p-4 bg-red-500/10 border border-red-500 rounded-lg text-red-500">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">My Reviews</h1>

      {reviews.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-400 mb-4">
            You haven't written any reviews yet.
          </p>
          <Link
            to="/search"
            className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 inline-block"
          >
            Find Games to Review
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => (
            <div
              key={review.id}
              className="bg-gray-800 rounded-lg p-6 hover:bg-gray-750 transition-colors"
            >
              <div className="flex gap-4">
                {/* Game Cover */}
                {review.cover?.url && (
                  <Link to={`/games/${review.game_id}`}>
                    <img
                      src={review.cover.url}
                      alt={review.game_name}
                      className="w-20 h-28 object-cover rounded"
                    />
                  </Link>
                )}

                {/* Review Content */}
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <Link
                        to={`/games/${review.game_id}`}
                        className="text-xl font-semibold hover:text-indigo-400"
                      >
                        {review.game_name}
                      </Link>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-2xl font-bold text-indigo-500">
                          {review.rating}/10
                        </span>
                        <span className="text-xs text-gray-500">
                          {new Date(review.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>

                    {/* Edit Button */}
                    <Link
                      to={`/games/${review.game_id}/review`}
                      className="flex items-center gap-2 px-3 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors text-sm"
                    >
                      <FiEdit size={16} />
                      <span>Edit</span>
                    </Link>
                  </div>

                  {review.review_text && (
                    <p className="text-gray-300 mt-3 whitespace-pre-wrap">
                      {review.review_text}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyReviews;
