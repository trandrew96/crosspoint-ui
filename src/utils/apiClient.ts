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
 * API methods for game-related actions
 */
export const gameAPI = {
  searchGames: async (query: string, limit: number = 50): Promise<any> => {
    const response = await fetch(
      `${API_BASE_URL}/search/games?q=${encodeURIComponent(query)}&limit=${limit}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
    if (!response.ok) {
      throw new Error(`Search failed: ${response.statusText}`);
    }
    return response.json();
  },

  /**
   * Get game details by ID (PUBLIC - no auth required)
   */
  getGameById: async (gameId: string): Promise<any> => {
    const response = await fetch(`${API_BASE_URL}/games/${gameId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch game: ${response.statusText}`);
    }

    return response.json();
  },

  /**
   * Like a game
   */
  likeGame: async (gameId: number): Promise<LikeGameResponse> => {
    return authenticatedFetch<LikeGameResponse>(`/users/me/likes/${gameId}`, {
      method: "POST",
      body: JSON.stringify({ game_id: gameId }),
    });
  },

  /**
   * Unlike a game
   */
  unlikeGame: async (gameId: number): Promise<LikeGameResponse> => {
    return authenticatedFetch<LikeGameResponse>(`/users/me/likes/${gameId}`, {
      method: "DELETE",
      body: JSON.stringify({ game_id: gameId }),
    });
  },

  /**
   * Check if a game is liked by the current user
   */
  checkGameLiked: async (gameId: number): Promise<{ liked: boolean }> => {
    return authenticatedFetch<{ liked: boolean }>(`/users/me/likes/${gameId}`, {
      method: "GET",
    });
  },

  /**
   * Get all liked games for the current user
   */
  getLikedGames: async (): Promise<any> => {
    return authenticatedFetch("/users/me/likes", {
      method: "GET",
    });
  },

  // Explore page endpoints (PUBLIC - no auth required)

  /**
   * Get upcoming game releases
   */
  getUpcomingGames: async (limit: number = 20): Promise<any> => {
    const response = await fetch(
      `${API_BASE_URL}/explore/upcoming?limit=${limit}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch upcoming games: ${response.statusText}`);
    }

    return response.json();
  },

  /**
   * Get trending games
   */
  getTrendingGames: async (limit: number = 20): Promise<any> => {
    const response = await fetch(
      `${API_BASE_URL}/explore/trending?limit=${limit}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch trending games: ${response.statusText}`);
    }

    return response.json();
  },

  /**
   * Get top rated games
   */
  getTopRatedGames: async (limit: number = 20): Promise<any> => {
    const response = await fetch(
      `${API_BASE_URL}/explore/top-rated?limit=${limit}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

    if (!response.ok) {
      throw new Error(
        `Failed to fetch top rated games: ${response.statusText}`,
      );
    }

    return response.json();
  },

  /**
   * Get recently released games
   */
  getRecentGames: async (limit: number = 20): Promise<any> => {
    const response = await fetch(
      `${API_BASE_URL}/explore/recent?limit=${limit}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch recent games: ${response.statusText}`);
    }

    return response.json();
  },

  /**
   * Get most anticipated games (highest hype count)
   */
  getMostAnticipated: async (limit: number = 20): Promise<any> => {
    const response = await fetch(
      `${API_BASE_URL}/explore/most-anticipated?limit=${limit}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

    if (!response.ok) {
      throw new Error(
        `Failed to fetch most anticipated games: ${response.statusText}`,
      );
    }

    return response.json();
  },

  /**
   * Get hidden gem games (high rating, low rating count)
   */
  getHiddenGems: async (limit: number = 20): Promise<any> => {
    const response = await fetch(
      `${API_BASE_URL}/explore/hidden-gems?limit=${limit}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch hidden gems: ${response.statusText}`);
    }

    return response.json();
  },
};

// ADD REVIEW API METHODS HERE
export const reviewAPI = {
  /**
   * Create a review
   */
  createReview: async (gameId: number, rating: number, reviewText: string) => {
    return authenticatedFetch("/users/me/reviews", {
      method: "POST",
      body: JSON.stringify({
        game_id: gameId,
        rating,
        review_text: reviewText,
      }),
    });
  },

  /**
   * Get all my reviews
   */
  getMyReviews: async () => {
    return authenticatedFetch("/users/me/reviews", {
      method: "GET",
    });
  },

  /**
   * Get reviews for a specific game (PUBLIC)
   */
  getGameReviews: async (gameId: number) => {
    const response = await fetch(`${API_BASE_URL}/games/${gameId}/reviews`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch game reviews");
    }

    return response.json();
  },

  /**
   * Update a review
   */
  updateReview: async (
    reviewId: number,
    rating?: number,
    reviewText?: string,
  ) => {
    return authenticatedFetch(`/users/me/reviews/${reviewId}`, {
      method: "PUT",
      body: JSON.stringify({
        rating,
        review_text: reviewText,
      }),
    });
  },

  /**
   * Delete a review
   */
  deleteReview: async (reviewId: number) => {
    return authenticatedFetch(`/users/me/reviews/${reviewId}`, {
      method: "DELETE",
    });
  },
};

export const playlistAPI = {
  /**
   * Create a playlist
   */
  createPlaylist: async (
    name: string,
    description?: string,
    isPublic: boolean = true,
  ) => {
    return authenticatedFetch("/playlists", {
      method: "POST",
      body: JSON.stringify({ name, description, is_public: isPublic }),
    });
  },

  /**
   * Get all playlists for the current user
   */
  getMyPlaylists: async () => {
    return authenticatedFetch("/users/me/playlists", {
      method: "GET",
    });
  },

  /**
   * Get a single playlist by ID (public playlists don't require auth,
   * but we send the token anyway in case it's private)
   */
  getPlaylistById: async (playlistId: number) => {
    return authenticatedFetch(`/playlists/${playlistId}`, {
      method: "GET",
    });
  },

  /**
   * Update a playlist
   */
  updatePlaylist: async (
    playlistId: number,
    name?: string,
    description?: string,
    isPublic?: boolean,
  ) => {
    return authenticatedFetch(`/playlists/${playlistId}`, {
      method: "PUT",
      body: JSON.stringify({ name, description, is_public: isPublic }),
    });
  },

  /**
   * Delete a playlist
   */
  deletePlaylist: async (playlistId: number) => {
    return authenticatedFetch(`/playlists/${playlistId}`, {
      method: "DELETE",
    });
  },

  /**
   * Add a game to a playlist
   */
  addGameToPlaylist: async (playlistId: number, gameId: number) => {
    return authenticatedFetch(`/playlists/${playlistId}/games`, {
      method: "POST",
      body: JSON.stringify({ game_id: gameId }),
    });
  },

  /**
   * Remove a game from a playlist
   */
  removeGameFromPlaylist: async (playlistId: number, gameId: number) => {
    return authenticatedFetch(`/playlists/${playlistId}/games/${gameId}`, {
      method: "DELETE",
    });
  },
};

export default authenticatedFetch;
