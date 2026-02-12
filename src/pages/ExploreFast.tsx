import { useEffect, useState } from "react";
import Nav from "../components/Nav";
import { Link, useSearchParams } from "react-router-dom";
import Footer from "../components/Footer";

// Define the shape of your game data based on what your API returns
interface Game {
  id: string | number;
  name: string;
  rating: number;
  cover: { id: number; url: string } | null;
  summary: string;
  platforms: Array<{ id: number; name: string }>;
  genres: Array<{ id: number; name: string }>;
  game_type: number; // New field for game type (e.g., "main_game", "dlc", etc.)
  version_parent?: number; // New field for version parent (if applicable)
}

// This matches your FastAPI response structure
interface SearchResponse {
  results: Game[];
  // Add other fields your API returns, such as:
  // total?: number;
  // page?: number;
  // pageSize?: number;
}

// You can also create a type for the API response if it's wrapped
interface SearchResponse {
  results: Game[];
  // or just Game[] depending on your API structure
}

const GameSearch: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Update this to match your FastAPI server URL
  const API_BASE_URL = "http://localhost:8000";

  const searchGames = async (gameName: string) => {
    if (!gameName.trim()) {
      setError("Please enter a game name");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `${API_BASE_URL}/search/games/${encodeURIComponent(gameName)}`,
      );

      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }

      const data: SearchResponse = await response.json();
      console.log("API response:", data);

      const filteredGames = data.results
        .filter((game) => game.cover?.url != null)
        .filter((game) => game.game_type === 0)
        .filter((game) => game.rating != null)
        .filter((game) => game.version_parent == null);

      setGames(filteredGames);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      setGames([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    searchGames(searchTerm);
  };

  return (
    <div>
      <div className="mb-4">
        <Nav />
      </div>
      <main>
        <h1>Game Search</h1>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search for a game..."
            disabled={loading}
          />
          <button type="submit" disabled={loading}>
            {loading ? "Searching..." : "Search"}
          </button>
        </form>

        {error && <div style={{ color: "red" }}>{error}</div>}

        {loading && <div>Loading...</div>}

        {!loading && games.length > 0 && (
          <main className="max-w-7xl mx-auto text-center">
            <h2>Results ({games.length})</h2>
            <ul>
              {games.map((game) => (
                <li key={game.id}>
                  {game.name}, {game.game_type}, {game.rating}
                </li>
              ))}
            </ul>
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
          </main>
        )}

        {!loading && games.length === 0 && !error && searchTerm && (
          <div>No games found</div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default GameSearch;
