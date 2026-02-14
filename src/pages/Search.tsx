import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { gameAPI } from "../utils/apiClient";

interface Game {
  id: number;
  name: string;
  rating: number;
  cover?: { url: string };
  summary: string;
}

function ExploreFast() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get("q") || "";
  const initialPageSize = searchParams.get("pageSize") || "50";

  const [inputValue, setInputValue] = useState(initialQuery);
  const [query, setQuery] = useState(initialQuery);
  const [pageSize, setPageSize] = useState(parseInt(initialPageSize));

  // React Query - cache search results
  const { data, isLoading, error } = useQuery({
    queryKey: ["gameSearch", query, pageSize],
    queryFn: () => gameAPI.searchGames(query, pageSize),
    enabled: query.length > 0, // Only fetch if there's a search query
    staleTime: 10 * 60 * 1000, // 10 minutes
  });

  // Update URL when query or pageSize changes
  useEffect(() => {
    if (query) {
      setSearchParams({ q: query, pageSize: pageSize.toString() });
    }
  }, [query, pageSize, setSearchParams]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    setQuery(inputValue);
    setPageSize(50); // Reset page size on new search
  };

  const handleLoadMore = () => {
    setPageSize(pageSize + 50);
  };

  const hasSearched = query.length > 0;

  return (
    <div>
      <>
        {/* Search Bar */}
        <form onSubmit={handleSubmit}>
          <div className="relative text-gray-600 relative mx-auto w-80 rounded-full bg-white flex pr-4">
            <input
              type="search"
              name="search"
              placeholder="Search"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="h-10 px-5 pr-10 w-80 overflow-hidden text-sm focus:outline-none"
            />
            <button
              type="submit"
              className="bg-slate-200 w-8 h-8 rounded-full flex justify-center items-center absolute right-1 top-1 hover:bg-slate-300"
            >
              <svg
                className="h-4 w-4 fill-current"
                xmlns="http://www.w3.org/2000/svg"
                version="1.1"
                id="Capa_1"
                x="0px"
                y="0px"
                viewBox="0 0 56.966 56.966"
                width="512px"
                height="512px"
              >
                <path d="M55.146,51.887L41.588,37.786c3.486-4.144,5.396-9.358,5.396-14.786c0-12.682-10.318-23-23-23s-23,10.318-23,23  s10.318,23,23,23c4.761,0,9.298-1.436,13.177-4.162l13.661,14.208c0.571,0.593,1.339,0.92,2.162,0.92  c0.779,0,1.518-0.297,2.079-0.837C56.255,54.982,56.293,53.08,55.146,51.887z M23.984,6c9.374,0,17,7.626,17,17s-7.626,17-17,17  s-17-7.626-17-17S14.61,6,23.984,6z" />
              </svg>
            </button>
          </div>
        </form>

        {/* Loading State */}
        {isLoading && (
          <div className="my-8">
            <p>Searching...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="my-8 text-red-500">
            <p>
              Error: {error instanceof Error ? error.message : "Search failed"}
            </p>
          </div>
        )}

        {/* No Results */}
        {hasSearched && data && data.results.length === 0 && (
          <p className="my-8">No results found.</p>
        )}

        {/* Results */}
        {data && data.results.length > 0 && (
          <main className="max-w-7xl mx-auto text-center">
            <div className="grid grid-cols-3 md:grid-cols-6 gap-4 my-5">
              {data.results
                .filter((game: Game) => game.cover?.url)
                .map((game: Game) => (
                  <div
                    className="rounded-lg shadow-lg transition-transform duration-300 ease-in-out hover:scale-105"
                    key={game.id}
                  >
                    <Link to={`/games/${game.id}`}>
                      <img
                        className="w-full h-64 object-cover rounded-lg"
                        src={game.cover?.url}
                        alt={game.name}
                        width={200}
                      />
                    </Link>
                  </div>
                ))}
            </div>

            {/* Load More Button */}
            {data.count > data.results.length && (
              <div className="my-8">
                <button
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                  onClick={handleLoadMore}
                  disabled={isLoading}
                >
                  {isLoading ? "Loading..." : "Load More"}
                </button>
              </div>
            )}
          </main>
        )}
      </>
    </div>
  );
}

export default ExploreFast;
