import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { reviewAPI } from "../utils/apiClient";
import { gameAPI } from "../utils/apiClient";

interface Game {
  id: number;
  name: string;
  cover?: { url: string };
}

interface Review {
  id: number;
  game_id: number;
  rating: number;
  review_text: string;
  created_at: string;
  updated_at: string;
}

const CreateReview = () => {
  const { gameId } = useParams<{ gameId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [game, setGame] = useState<Game | null>(null);
  const [rating, setRating] = useState<number>(5);
  const [reviewText, setReviewText] = useState("");
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true); // NEW: Track initial page load
  const [error, setError] = useState<string | null>(null);

  // Track if we're editing an existing review
  const [existingReview, setExistingReview] = useState<Review | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  // Redirect if not logged in
  useEffect(() => {
    if (!user) {
      navigate("/signin");
    }
  }, [user, navigate]);

  // Fetch game details and check for existing review
  useEffect(() => {
    const fetchData = async () => {
      if (!gameId) return;

      setInitialLoading(true); // Start loading

      try {
        // Fetch game details
        const gameData = await gameAPI.getGameById(gameId);
        setGame(gameData);

        // Check if user already has a review for this game
        try {
          const myReviewsData = await reviewAPI.getMyReviews();
          const existingReviewForGame = myReviewsData.reviews.find(
            (review: Review) => review.game_id === parseInt(gameId),
          );

          if (existingReviewForGame) {
            // Pre-fill form with existing review
            setExistingReview(existingReviewForGame);
            setIsEditing(true);
            setRating(existingReviewForGame.rating);
            setReviewText(existingReviewForGame.review_text || "");
          }
        } catch (reviewErr) {
          // If review fetch fails, just continue with create mode
          console.log("No existing review found");
        }
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to load game details");
      } finally {
        setInitialLoading(false); // Stop loading
      }
    };

    fetchData();
  }, [gameId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!gameId) return;

    setLoading(true);
    setError(null);

    try {
      if (isEditing && existingReview) {
        // Update existing review
        await reviewAPI.updateReview(existingReview.id, rating, reviewText);
      } else {
        // Create new review
        await reviewAPI.createReview(parseInt(gameId), rating, reviewText);
      }
      navigate("/my-reviews");
    } catch (err: any) {
      setError(
        err.message || `Failed to ${isEditing ? "update" : "create"} review`,
      );
    } finally {
      setLoading(false);
    }
  };

  // Skeleton Loading State
  if (initialLoading) {
    return (
      <div className="max-w-2xl mx-auto p-6 animate-pulse">
        {/* Title Skeleton */}
        <div className="h-9 bg-gray-800 rounded w-64 mb-8"></div>

        {/* Game Info Skeleton */}
        <div className="flex gap-4 bg-gray-800 rounded-lg p-4 mb-6">
          <div className="w-24 h-32 bg-gray-700 rounded"></div>
          <div className="flex-1 space-y-3">
            <div className="h-6 bg-gray-700 rounded w-3/4"></div>
            <div className="h-4 bg-gray-700 rounded w-1/3"></div>
          </div>
        </div>

        {/* Form Skeleton */}
        <div className="space-y-6">
          {/* Rating Slider Skeleton */}
          <div>
            <div className="h-4 bg-gray-800 rounded w-24 mb-2"></div>
            <div className="h-2 bg-gray-700 rounded w-full"></div>
            <div className="flex justify-between mt-1">
              <div className="h-3 bg-gray-800 rounded w-4"></div>
              <div className="h-3 bg-gray-800 rounded w-4"></div>
              <div className="h-3 bg-gray-800 rounded w-4"></div>
            </div>
          </div>

          {/* Textarea Skeleton */}
          <div>
            <div className="h-4 bg-gray-800 rounded w-32 mb-2"></div>
            <div className="h-48 bg-gray-700 rounded"></div>
          </div>

          {/* Buttons Skeleton */}
          <div className="flex gap-3">
            <div className="flex-1 h-12 bg-gray-700 rounded-lg"></div>
            <div className="h-12 w-24 bg-gray-700 rounded-lg"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!game) {
    return <div className="max-w-2xl mx-auto py-6">Loading...</div>;
  }

  return (
    <div className="max-w-2xl mx-auto py-6">
      <h1 className="text-3xl font-bold mb-8">
        {isEditing ? "Edit Your Review" : "Write a Review"}
      </h1>

      {/* Game Info */}
      <div className="flex gap-4 bg-gray-800 rounded-lg p-4 mb-6">
        {game.cover?.url && (
          <img
            src={game.cover.url}
            alt={game.name}
            className="w-24 h-32 object-cover rounded"
          />
        )}
        <div>
          <h2 className="text-xl font-semibold">{game.name}</h2>
          <p className="text-gray-400 text-sm mt-1">Game ID: {game.id}</p>
          {isEditing && (
            <p className="text-indigo-400 text-sm mt-2">
              Editing your existing review
            </p>
          )}
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-6 p-4 bg-red-500/10 border border-red-500 rounded-lg text-red-500">
          {error}
        </div>
      )}

      {/* Review Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Rating */}
        <div>
          <label className="block text-sm font-medium mb-2">
            Rating: {rating}/10
          </label>
          <input
            type="range"
            min="0"
            max="10"
            step="0.5" // Changed from "1" to "0.5"
            value={rating}
            onChange={(e) => setRating(parseFloat(e.target.value))} // Changed from parseInt to parseFloat
            className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-indigo-600"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>0</span>
            <span>5</span>
            <span>10</span>
          </div>
        </div>

        {/* Review Text */}
        <div>
          <label className="block text-sm font-medium mb-2">
            Your Review (Optional)
          </label>
          <textarea
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
            placeholder="Share your thoughts about this game..."
            rows={8}
            className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
          />
          <p className="text-xs text-gray-400 mt-1">
            {reviewText.length} characters
          </p>
        </div>

        {/* Buttons */}
        <div className="flex gap-3">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
          >
            {loading
              ? isEditing
                ? "Updating..."
                : "Submitting..."
              : isEditing
                ? "Update Review"
                : "Submit Review"}
          </button>
          <button
            type="button"
            onClick={() => navigate(`/games/${gameId}`)}
            className="px-6 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateReview;
