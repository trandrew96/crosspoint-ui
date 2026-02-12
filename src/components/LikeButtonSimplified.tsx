import React, { useState } from "react";
import { gameAPI } from "../utils/apiClient";

interface LikeButtonSimplifiedProps {
  gameId: string;
  initialLiked?: boolean;
  onLikeChange?: (isLiked: boolean) => void;
}

const LikeButtonSimplified: React.FC<LikeButtonSimplifiedProps> = ({
  gameId,
  initialLiked = false,
  onLikeChange,
}) => {
  const [isLiked, setIsLiked] = useState<boolean>(initialLiked);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleToggleLike = async (): Promise<void> => {
    setIsLoading(true);
    setError(null);

    try {
      if (isLiked) {
        await gameAPI.unlikeGame(gameId);
        setIsLiked(false);
        onLikeChange?.(false);
      } else {
        await gameAPI.likeGame(gameId);
        setIsLiked(true);
        onLikeChange?.(true);
      }
    } catch (err) {
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
        style={{
          padding: "10px 20px",
          backgroundColor: isLiked ? "#e74c3c" : "#3498db",
          color: "white",
          border: "none",
          borderRadius: "5px",
          cursor: isLoading ? "not-allowed" : "pointer",
          opacity: isLoading ? 0.6 : 1,
        }}
      >
        {isLoading ? "Loading..." : isLiked ? "❤️ Liked" : "🤍 Like"}
      </button>

      {error && (
        <div style={{ color: "red", marginTop: "10px" }}>Error: {error}</div>
      )}
    </div>
  );
};

export default LikeButtonSimplified;
