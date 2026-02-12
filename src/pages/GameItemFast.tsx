import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Nav from "../components/Nav";
import Footer from "../components/Footer";
import LikeButtonSimplified from "../components/LikeButtonSimplified";

interface Cover {
  url?: string;
}

interface Genre {
  name?: string;
}

interface Platform {
  name?: string;
}

interface Screenshot {
  url?: string;
  id?: number;
}

interface Game {
  id?: number;
  name?: string;
  summary?: string;
  cover?: Cover;
  first_release_date?: number;
  rating?: number;
  rating_count?: number;
  aggregated_rating?: number;
  aggregated_rating_count?: number;
  genres?: Genre[];
  platforms?: Platform[];
  game_type?: number; // New field for game type (e.g., "main_game", "dlc", etc.)
  // Add other fields as needed
  [key: string]: any;
}

const API_BASE_URL = "http://localhost:8000"; // TODO: move to .env

function GameById() {
  const [game, setGame] = useState<Game | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const API_ENDPOINT = API_BASE_URL + "/games/" + useParams().id;

  useEffect(() => {
    const fetchGame = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(API_ENDPOINT);

        if (!response.ok) {
          if (response.status === 404) {
            throw new Error(`Game with ID ${useParams()} not found`);
          }
          throw new Error(`Error: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        console.log("API response:", data);
        setGame(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
        setGame(null);
      } finally {
        setLoading(false);
      }
    };

    fetchGame();
  }, []); // Re-fetch when gameId changes

  return (
    <>
      <Nav />

      <LikeButtonSimplified gameId={game?.id?.toString() || ""} />

      {!loading && !error && game && (
        <main className="max-w-7xl mx-auto text-center mt-10">
          <img
            className="h-64 object-cover rounded-lg mx-auto"
            src={game?.cover?.url}
            alt={game?.name}
            width={200}
          />
          <h1 className="text-2xl font-bold">{game?.name}</h1>
          <p> {game?.storyline || game?.summary}</p>
          <div className="grid grid-cols-2 max-w-xl mx-auto gap-10">
            <div>
              <h2 className="text-xl font-bold mt-10">Platforms</h2>
              <ul>
                {game?.platforms?.map((platform) => (
                  <li key={platform?.name}>{platform?.name}</li>
                ))}
              </ul>
            </div>
            <div>
              <h2 className="text-xl font-bold mt-10">Genres</h2>
              <ul>
                {game?.genres?.map((platform) => (
                  <li key={platform?.name}>{platform?.name}</li>
                ))}
              </ul>
            </div>
          </div>
          <section className="grid grid-cols-6">
            {game?.screenshots?.map((screenshot: Screenshot, index: number) => (
              <img
                key={index}
                className="h-32 object-cover mx-auto"
                src={screenshot.url}
                alt={`Screenshot ${index + 1}`}
              />
            ))}
          </section>
          <div className="w-20">
            <pre>{JSON.stringify(game, null, 2)}</pre>
          </div>
        </main>
      )}

      <Footer />
    </>
  );
}

export default GameById;
