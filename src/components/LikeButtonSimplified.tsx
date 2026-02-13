import React, { useEffect, useState } from "react";
import { gameAPI } from "../utils/apiClient";

interface LikeButtonSimplifiedProps {
  gameId: number;
  initialLiked?: boolean;
  onLikeChange?: (isLiked: boolean) => void;
}

const LikeButtonSimplified: React.FC<LikeButtonSimplifiedProps> = ({
  gameId,
  initialLiked = false,
  onLikeChange,
}) => {
  const [isLiked, setIsLiked] = useState<boolean>(initialLiked);
  const [isLoading, setIsLoading] = useState<boolean>(true); // Start with true
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check if the game is already liked when the component mounts
    const checkLikedStatus = async () => {
      if (!gameId) return; // Guard clause

      try {
        const response = await gameAPI.checkGameLiked(gameId);
        setIsLiked(response.liked);
        setError(null);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to check like status";
        setError(errorMessage);
        console.error("Error checking like status:", err);
      } finally {
        setIsLoading(false);
      }
    };

    checkLikedStatus();
  }, [gameId]);

  const handleToggleLike = async (): Promise<void> => {
    setIsLoading(true);
    setError(null);

    // Optimistic update
    const previousLikedState = isLiked;
    setIsLiked(!isLiked);

    try {
      if (previousLikedState) {
        await gameAPI.unlikeGame(gameId);
        onLikeChange?.(false);
      } else {
        await gameAPI.likeGame(gameId);
        onLikeChange?.(true);
      }
    } catch (err) {
      // Revert on error
      setIsLiked(previousLikedState);

      const errorMessage =
        err instanceof Error ? err.message : "An unknown error occurred";
      console.error("Error toggling like:", err);
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <button
        onClick={handleToggleLike}
        disabled={isLoading}
        className={`px-5 py-2 rounded-lg transition-all ${
          isLiked
            ? "bg-red-500 hover:bg-red-600"
            : "bg-blue-500 hover:bg-blue-600"
        } text-white disabled:opacity-60 disabled:cursor-not-allowed`}
      >
        {isLoading ? "Loading..." : isLiked ? "❤️ Liked" : "🤍 Like"}
      </button>

      {error && <div className="text-red-500 text-sm mt-2">{error}</div>}
    </div>
  );
};

export default LikeButtonSimplified;
