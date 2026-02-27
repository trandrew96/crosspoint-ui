// src/hooks/useExploreGames.ts
import { useQueries } from "@tanstack/react-query";
import { gameAPI } from "../utils/apiClient";

interface Game {
  id: number;
  name: string;
  cover?: {
    url?: string;
  };
  first_release_date?: number;
  rating?: number;
  genres?: Array<{ name: string }>;
  platforms?: Array<{ name: string }>;
}

interface ExploreData {
  upcoming: Game[];
  trending: Game[];
  recent: Game[];
  mostAnticipated: Game[];
  hiddenGems: Game[];
}

interface UseExploreGamesReturn {
  data: ExploreData;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

/**
 * Custom hook to fetch all explore page game categories with caching
 */
export function useExploreGames(limit: number = 20): UseExploreGamesReturn {
  const queries = useQueries({
    queries: [
      {
        queryKey: ["explore", "upcoming", limit],
        queryFn: () => gameAPI.getUpcomingGames(limit),
        staleTime: 1000 * 60 * 5, // 5 minutes
        gcTime: 1000 * 60 * 30, // 30 minutes (formerly cacheTime)
      },
      {
        queryKey: ["explore", "trending", limit],
        queryFn: () => gameAPI.getTrendingGames(limit),
        staleTime: 1000 * 60 * 5,
        gcTime: 1000 * 60 * 30,
      },
      {
        queryKey: ["explore", "recent", limit],
        queryFn: () => gameAPI.getRecentGames(limit),
        staleTime: 1000 * 60 * 5,
        gcTime: 1000 * 60 * 30,
      },
      {
        queryKey: ["explore", "mostAnticipated", limit],
        queryFn: () => gameAPI.getMostAnticipated(limit),
        staleTime: 1000 * 60 * 10,
        gcTime: 1000 * 60 * 60,
      },
      {
        queryKey: ["explore", "hiddenGems", limit],
        queryFn: () => gameAPI.getHiddenGems(limit),
        staleTime: 1000 * 60 * 10,
        gcTime: 1000 * 60 * 60,
      },
    ],
  });

  // Extract data from all queries
  const [
    upcomingQuery,
    trendingQuery,
    recentQuery,
    anticipatedQuery,
    hiddenGemsQuery,
  ] = queries;

  // Check if any query is loading
  const loading = queries.some((query) => query.isLoading);

  // Collect all errors
  const errors = queries
    .filter((query) => query.error)
    .map((query) => query.error?.message)
    .join(", ");

  const error = errors || null;

  // Refetch all queries
  const refetch = () => {
    queries.forEach((query) => query.refetch());
  };

  return {
    data: {
      upcoming: upcomingQuery.data || [],
      trending: trendingQuery.data || [],
      recent: recentQuery.data || [],
      mostAnticipated: anticipatedQuery.data || [],
      hiddenGems: hiddenGemsQuery.data || [],
    },
    loading,
    error,
    refetch,
  };
}
