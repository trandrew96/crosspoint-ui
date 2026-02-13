import React, { useEffect, useState } from "react";
import { gameAPI } from "../utils/apiClient";
import { auth } from "../config/firebase";
import { onAuthStateChanged } from "firebase/auth";
import type { User } from "firebase/auth";

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
  const [user, setUser] = useState<User | null>(null);
  const [isLiked, setIsLiked] = useState<boolean>(initialLiked);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [showTooltip, setShowTooltip] = useState<boolean>(false);

  // Listen for auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    // Only check liked status if user is logged in
    if (!user) {
      return;
    }

    const checkLikedStatus = async () => {
      if (!gameId) return;

      setIsLoading(true);
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
  }, [gameId, user]);

  const handleToggleLike = async (): Promise<void> => {
    if (!user) return;

    setIsLoading(true);
    setError(null);

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
      {/* Wrapper div to handle hover events */}
      <div
        onMouseEnter={() => !user && setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        className="relative inline-block"
      >
        <button
          onClick={handleToggleLike}
          disabled={!user || isLoading}
          className={`px-5 py-2 rounded-lg transition-all ${
            !user
              ? "bg-gray-500 cursor-not-allowed opacity-60"
              : isLiked
                ? "bg-red-500 hover:bg-red-600"
                : "bg-blue-500 hover:bg-blue-600"
          } text-white disabled:opacity-60 disabled:cursor-not-allowed`}
        >
          {isLoading ? "Loading..." : isLiked ? "❤️ Liked" : "🤍 Like"}
        </button>

        {/* Tooltip for non-logged-in users */}
        {showTooltip && !user && (
          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg whitespace-nowrap shadow-lg z-10">
            Sign in to like games
            {/* Tooltip arrow */}
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
          </div>
        )}
      </div>

      {error && <div className="text-red-500 text-sm mt-2">{error}</div>}
    </div>
  );
};

export default LikeButtonSimplified;
