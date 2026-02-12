import React, { useEffect, useState } from "react";
import Nav from "../components/Nav";
import Footer from "../components/Footer";
import { Link, useSearchParams } from "react-router-dom";

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

const Home: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState<boolean>(false);

  // Get current page from URL, default to 1
  const currentPage = parseInt(searchParams.get("page") || "1", 10);

  const searchPopularGames = async (page: number) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `${API_BASE_URL}/games/popular?page=${page}`,
      );

      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }

      const data: PopularGamesResponse = await response.json();
      console.log("API response:", data);

      setGames(data.results);
      setHasMore(data.has_more);

      console.log("Games:", data.results);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      setGames([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Fetch games whenever the page parameter changes
    searchPopularGames(currentPage);
  }, [currentPage]);

  const handleNextPage = () => {
    if (hasMore) {
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

          {loading && (
            <div className="my-8">
              <p>Loading games...</p>
            </div>
          )}

          {error && (
            <div className="my-8 text-red-500">
              <p>Error: {error}</p>
            </div>
          )}

          {!loading && games.length > 0 && (
            <main className="max-w-7xl mx-auto text-center">
              <div className="flex justify-between items-center my-4">
                {/* Pagination controls */}
                {/* <div className="flex gap-2">
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
                  <button
                    onClick={handleNextPage}
                    disabled={!hasMore}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      !hasMore
                        ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                        : "bg-blue-600 text-white hover:bg-blue-700"
                    }`}
                  >
                    Next
                  </button>
                </div> */}
              </div>

              <div className="grid grid-cols-3 md:grid-cols-6 gap-4 my-5">
                {games.map((item: any, index: number) => (
                  <div
                    className="rounded-lg shadow-lg transition-transform duration-300 ease-in-out hover:scale-105"
                    key={index}
                  >
                    <Link to={`/games/${item.id}`}>
                      <img
                        className="w-full h-64 object-cover rounded-lg"
                        src={item.cover.url}
                        alt={item.name}
                        width={200}
                      />
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
                  disabled={!hasMore}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    !hasMore
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
