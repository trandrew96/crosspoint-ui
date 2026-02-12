import { useEffect, useState } from "react";
import Nav from "../components/Nav";
import { Link, useSearchParams } from "react-router-dom";
import Footer from "../components/Footer";

interface GameData {
  games: Array<{
    id: number;
    name: string;
    rating: number;
    coverUrl: string;
    summary: string;
  }>;
  hasMore: boolean;
}

function Explore() {
  const [inputValue, setInputValue] = useState(""); // What's typed in the search bar
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get("q") || "";
  const initialPageSize = searchParams.get("pageSize") || "50";
  const [query, setQuery] = useState(initialQuery);
  const [results, setResults] = useState<GameData | null>(null);
  const [hasSearched, setHasSearched] = useState(!!initialQuery);
  const [pageSize, setPageSize] = useState(
    initialPageSize ? parseInt(initialPageSize) : 50,
  );

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch only if there's an initial query from the URL (e.g., user hit Back)
    if (initialQuery) {
      fetch(
        // `http://localhost:8080/api/games/search?query=${query}&page=1&pageSize=${pageSize}`
        `http://localhost:8000/search/games/${query}?page=1&pageSize=${pageSize}`,
      )
        .then((res) => res.json())
        .then((data) => setResults(data))
        .catch((err) => console.error("Fetch failed:", err));
    }
  }, []); // Run only once on mount

  // const handleSearch = async (e) => {
  //   e.preventDefault();
  //   if (!query.trim()) return;

  //   setSearchParams({ q: query, pageSize: pageSize.toString() }); // Updates URL: /games?q=zelda
  //   setHasSearched(true);
  //   setHasSearched(true);

  //   try {
  //     const res = await fetch(
  //       `http://localhost:8080/api/games/search?query=${query}&page=1&pageSize=${pageSize}`
  //     );
  //     const data = await res.json();
  //     setResults(data);
  //   } catch (err) {
  //     console.error("Fetch failed:", err);
  //   }
  // };

  useEffect(() => {
    if (query) {
      setPageSize(50);
    }
  }, [query]);

  // Fetch data when pageSize or query changes
  useEffect(() => {
    if (query) {
      // Only fetch if there's an actual search query
      fetchGames(query, pageSize);
    }
  }, [pageSize, query]);

  const fetchGames = async (query: string, pageSize: number) => {
    if (!query.trim()) return;

    setSearchParams({ q: query, pageSize: pageSize.toString() }); // Updates URL: /games?q=zelda
    setHasSearched(true);
    setHasSearched(true);

    try {
      const res = await fetch(
        // `http://localhost:8080/api/games/search?query=${query}&page=1&pageSize=${pageSize}`,
        `http://localhost:8000/search/games/${query}?page=1&pageSize=${pageSize}`,
      );
      const data = await res.json();
      console.log(data);
      setResults(data);
    } catch (err) {
      console.error("Fetch failed:", err);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setQuery(inputValue); // This triggers the useEffect chain
  };

  return (
    <div>
      <div className="mb-4">
        <Nav />
      </div>

      <main className="max-w-7xl mx-auto text-center">
        <div>{pageSize}</div>

        {/* New Search Bar */}
        <form onSubmit={handleSubmit}>
          <div className="relative text-gray-600 relative mx-auto w-80 rounded-full bg-white flex pr-4">
            <input
              type="search"
              name="serch"
              placeholder="Search"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              // value={query}
              // onChange={(e) => setQuery(e.target.value)}
              className="h-10 px-5 pr-10 w-80 overflow-hidden text-sm focus:outline-none"
            />
            {/* <button type="submit">Search</button> */}
            <button
              type="submit"
              className="bg-slate-200 w-8 h-8 rounded-full flex justify-center items-center absolute right-1 top-1 hover:bg-slate-300"
            >
              <svg
                className="h-4 w-4 fill-current"
                xmlns="http://www.w3.org/2000/svg"
                // xmlns:xlink="http://www.w3.org/1999/xlink"
                version="1.1"
                id="Capa_1"
                x="0px"
                y="0px"
                viewBox="0 0 56.966 56.966"
                // style="enable-background:new 0 0 56.966 56.966;"
                // xml:space="preserve"
                width="512px"
                height="512px"
              >
                <path d="M55.146,51.887L41.588,37.786c3.486-4.144,5.396-9.358,5.396-14.786c0-12.682-10.318-23-23-23s-23,10.318-23,23  s10.318,23,23,23c4.761,0,9.298-1.436,13.177-4.162l13.661,14.208c0.571,0.593,1.339,0.92,2.162,0.92  c0.779,0,1.518-0.297,2.079-0.837C56.255,54.982,56.293,53.08,55.146,51.887z M23.984,6c9.374,0,17,7.626,17,17s-7.626,17-17,17  s-17-7.626-17-17S14.61,6,23.984,6z" />
              </svg>
            </button>
          </div>
        </form>

        {hasSearched && results?.games.length === 0 && <p>No results found.</p>}

        {results && results.games.length > 0 ? (
          <>
            <main className="max-w-7xl mx-auto text-center">
              <div className="grid grid-cols-3 md:grid-cols-6 gap-4 my-5">
                {results &&
                  results.games
                    .filter((game) => game.coverUrl != null)
                    .map((item: any, index: number) => (
                      <div
                        className="rounded-lg shadow-lg transition-transform duration-300 ease-in-out hover:scale-105"
                        key={index}
                      >
                        <Link to={`/games/${item.id}`}>
                          <img
                            className="w-full h-64 object-cover rounded-lg"
                            src={item.coverUrl}
                            alt={item.name}
                            width={200}
                          />
                        </Link>
                      </div>
                    ))}
              </div>
              <div>
                {results.hasMore && (
                  <button
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                    onClick={(e) => {
                      setPageSize(pageSize + 50);
                      // handleSearch(e);
                    }}
                  >
                    Load More
                  </button>
                )}
              </div>
            </main>
          </>
        ) : null}
        <Footer />
      </main>
    </div>
  );
}

export default Explore;
