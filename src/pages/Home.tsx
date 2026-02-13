import React from "react";
import Nav from "../components/Nav";
import Footer from "../components/Footer";
import { Link, useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

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
    <div className="font-inter box-border">
      <Nav />

      <main className="text-center">
        <header className="mb-6">
          <h1 className="text-2xl m-0">Most Popular Games</h1>

          {isLoading && (
            <div className="my-8">
              <p>Loading games...</p>
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
            <main className="max-w-7xl mx-auto text-center">
              <div className="grid grid-cols-3 md:grid-cols-6 gap-4 my-5 px-5 md:px-0">
                {data.results.map((item: Game) => (
                  <div
                    key={item.id}
                    className="group relative transition-all duration-300 ease-out"
                  >
                    <Link to={`/games/${item.id}`}>
                      {/* Outer Glow */}
                      <div
                        className="absolute -inset-2 rounded-xl opacity-0 
                     group-hover:opacity-100
                     transition-opacity duration-300
                     bg-gradient-to-r 
                     from-indigo-500 via-purple-500 to-pink-500
                     blur-lg"
                      />

                      {/* Border Ring (separate layer) */}
                      <div
                        className="absolute inset-0 rounded-xl 
                     opacity-0 group-hover:opacity-100
                     transition-opacity duration-300
                     bg-gradient-to-r 
                     from-indigo-500 via-purple-500 to-pink-500"
                      />

                      {/* Card Content (ALWAYS visible) */}
                      <div className="relative rounded-lg overflow-hidden bg-gray-900">
                        <img
                          className="w-full h-64 object-cover rounded-lg
                       transition-all duration-300 ease-out
                       group-hover:brightness-110"
                          src={item.cover?.url}
                          alt={item.name}
                          width={200}
                        />
                      </div>
                    </Link>
                  </div>
                ))}
              </div>

              {/* Bottom pagination controls */}
              <div className="flex justify-center gap-2 my-8">
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
            </main>
          )}
        </header>
      </main>

      <Footer />
    </div>
  );
};

export default Home;
