// src/hooks/useGameLike.ts
// Custom hook for managing game like state and actions

import { useState, useCallback } from "react";
import { gameAPI } from "../utils/apiClient";

interface UseGameLikeResult {
  isLiked: boolean;
  isLoading: boolean;
  error: string | null;
  toggleLike: () => Promise<void>;
  like: () => Promise<void>;
  unlike: () => Promise<void>;
}

/**
 * Custom hook for managing game like functionality
 *
 * @param gameId - The ID of the game
 * @param initialLiked - Initial liked state (default: false)
 * @returns Object with like state and actions
 */
export const useGameLike = (
  gameId: string,
  initialLiked: boolean = false,
): UseGameLikeResult => {
  const [isLiked, setIsLiked] = useState<boolean>(initialLiked);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const like = useCallback(async (): Promise<void> => {
    if (isLiked) return; // Already liked

    setIsLoading(true);
    setError(null);

    try {
      await gameAPI.likeGame(gameId);
      setIsLiked(true);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to like game";
      setError(errorMessage);
      throw err; // Re-throw so caller can handle if needed
    } finally {
      setIsLoading(false);
    }
  }, [gameId, isLiked]);

  const unlike = useCallback(async (): Promise<void> => {
    if (!isLiked) return; // Already unliked

    setIsLoading(true);
    setError(null);

    try {
      await gameAPI.unlikeGame(gameId);
      setIsLiked(false);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to unlike game";
      setError(errorMessage);
      throw err; // Re-throw so caller can handle if needed
    } finally {
      setIsLoading(false);
    }
  }, [gameId, isLiked]);

  const toggleLike = useCallback(async (): Promise<void> => {
    if (isLiked) {
      await unlike();
    } else {
      await like();
    }
  }, [isLiked, like, unlike]);

  return {
    isLiked,
    isLoading,
    error,
    toggleLike,
    like,
    unlike,
  };
};
