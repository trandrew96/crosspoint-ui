// src/utils/apiClient.ts
// Reusable API client that automatically includes Firebase token

import { getAuth } from "firebase/auth";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

/**
 * Options for authenticated fetch requests
 */
interface FetchOptions extends RequestInit {
  headers?: Record<string, string>;
}

/**
 * API Response types
 */
interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
}

interface LikeGameResponse {
  success: boolean;
  message: string;
  user_id: string;
  game_id: string;
}

interface ApiError {
  detail: string;
}

/**
 * Make an authenticated API request with Firebase token
 */
async function authenticatedFetch<T = any>(
  endpoint: string,
  options: FetchOptions = {},
): Promise<T> {
  // Get the current user
  const auth = getAuth();
  const user = auth.currentUser;

  if (!user) {
    throw new Error("User must be authenticated");
  }

  // Get the Firebase ID token
  const token = await user.getIdToken();

  // Merge headers with authorization token
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...options.headers,
    Authorization: `Bearer ${token}`,
  };

  // Make the fetch request
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  // Handle errors
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}) as ApiError);
    throw new Error(
      (errorData as ApiError).detail ||
        `Request failed with status ${response.status}`,
    );
  }

  // Return the JSON response
  return response.json();
}

/**
 * API methods for game likes
 */
export const gameAPI = {
  /**
   * Like a game
   */
  likeGame: async (gameId: string): Promise<LikeGameResponse> => {
    return authenticatedFetch<LikeGameResponse>("/games/like", {
      method: "POST",
      body: JSON.stringify({ game_id: gameId }),
    });
  },

  /**
   * Unlike a game
   */
  unlikeGame: async (gameId: string): Promise<LikeGameResponse> => {
    return authenticatedFetch<LikeGameResponse>("/games/like", {
      method: "DELETE",
      body: JSON.stringify({ game_id: gameId }),
    });
  },

  // You can add more methods here as needed
  // /**
  //  * Get all liked games for the current user
  //  */
  // getLikedGames: async (): Promise<string[]> => {
  //   return authenticatedFetch<string[]>('/games/liked', {
  //     method: 'GET',
  //   });
  // },
};

export default authenticatedFetch;
