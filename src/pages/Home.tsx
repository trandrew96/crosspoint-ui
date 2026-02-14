import React from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { FaStar } from "react-icons/fa";
import { GameCard } from "../components/GameCard";

// Define the shape of your game data based on what your API returns
interface Game {
  id: string | number;
  name: string;
  rating: number;
  cover: { id: number; url: string } | null;
  summary: string;
  platforms: Array<{ id: number; name: string }>;
  genres: Array<{ id: number; name: string }>;
  game_type: number;
  version_parent?: number;
}

interface PopularGamesResponse {
  results: Game[];
  count: number;
  page: number;
  total_pages: number;
  has_more: boolean;
}

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

// Extract fetch function for reusability
const fetchPopularGames = async (
  page: number,
): Promise<PopularGamesResponse> => {
  const response = await fetch(`${API_BASE_URL}/games/popular?page=${page}`);

  if (!response.ok) {
    throw new Error(`Error: ${response.status} ${response.statusText}`);
  }

  return response.json();
};

const Home: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  // Get current page from URL, default to 1
  const currentPage = parseInt(searchParams.get("page") || "1", 10);

  // Use TanStack Query for data fetching and caching
  const { data, isLoading, error } = useQuery({
    queryKey: ["popularGames", currentPage], // Cache key includes page number
    queryFn: () => fetchPopularGames(currentPage),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const handleNextPage = () => {
    if (data?.has_more) {
      setSearchParams({ page: (currentPage + 1).toString() });
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setSearchParams({ page: (currentPage - 1).toString() });
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <>
      <header className="text-center">
        <div className="flex items-center justify-center gap-2 mb-4">
          <FaStar className="inline mr-2 text-yellow-white" />
          <h1 className="text-4xl font-bold m-0 drop-shadow-md">
            Most Popular Games
          </h1>
          <FaStar className="inline mr-2 text-yellow-white" />
        </div>
      </header>

      {isLoading && (
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-3 md:grid-cols-6 gap-4 my-5 px-5">
            {Array.from({ length: 54 }).map((_, index) => (
              <div
                key={index}
                className="relative rounded-lg overflow-hidden bg-gray-800"
              >
                <div className="w-full h-64 animate-pulse bg-gradient-to-r from-gray-700 via-gray-600 to-gray-700" />
              </div>
            ))}
          </div>
        </div>
      )}

      {error && (
        <div className="my-8 text-red-500">
          <p>
            Error:{" "}
            {error instanceof Error ? error.message : "An error occurred"}
          </p>
        </div>
      )}

      {!isLoading && data && data.results.length > 0 && (
        <>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-4 my-5">
            {data.results.map((item: Game) => (
              <div
                key={item.id}
                className="group relative transition-all duration-300 ease-out"
              >
                <GameCard to={`/games/${item.id}`}>
                  <img
                    className="object-cover rounded-lg
     transition-all duration-300 ease-out
     group-hover:brightness-110"
                    src={item.cover?.url}
                    alt={item.name}
                    width={200}
                  />
                </GameCard>
              </div>
            ))}
          </div>

          {/* Bottom pagination controls */}
          <div className="flex justify-center gap-2 my-8">
            {currentPage > 1 && (
              <button
                onClick={handlePreviousPage}
                disabled={currentPage === 1}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  currentPage === 1
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-blue-600 text-white hover:bg-blue-700"
                }`}
              >
                Previous
              </button>
            )}

            <span className="px-4 py-2 flex items-center">
              Page {currentPage}
            </span>
            <button
              onClick={handleNextPage}
              disabled={!data.has_more}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                !data.has_more
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-blue-600 text-white hover:bg-blue-700"
              }`}
            >
              Next
            </button>
          </div>
        </>
      )}
    </>
  );
};

export default Home;
