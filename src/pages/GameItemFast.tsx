import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Nav from "../components/Nav";
import Footer from "../components/Footer";
import LikeButtonSimplified from "../components/LikeButtonSimplified";
import { WEBSITE_CONFIG } from "../utils/websiteConfig";

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

interface Website {
  id: number;
  url: string;
  type: number;
}

interface InvolvedCompany {
  id: number;
  company?: {
    id: number;
    name?: string;
  };
  developer?: boolean;
  publisher?: boolean;
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
  game_type?: number;
  involved_companies?: InvolvedCompany[];
  [key: string]: any;
}

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

function GameById() {
  const [game, setGame] = useState<Game | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const API_ENDPOINT = API_BASE_URL + "/games/" + useParams().id;

  // Fetch game data when component mounts or when gameId changes
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
  }, []);

  // Update title based on game name
  useEffect(() => {
    if (game?.name) {
      document.title = `${game.name} - CrossPoint`;
    }
  }, [game?.name]);

  // Helper function to format release date
  const formatReleaseDate = (timestamp: number | undefined): string => {
    if (!timestamp) return "Unknown";

    const date = new Date(timestamp * 1000);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Helper function to filter and sort websites
  const getWebsitesByCategory = (category: "social" | "store") => {
    return (
      game?.websites?.filter((website: Website) => {
        const config = WEBSITE_CONFIG[website.type];
        return config && config.category === category;
      }) || []
    );
  };

  return (
    <>
      <Nav />

      {!loading && !error && game && (
        <main className="max-w-7xl mx-auto mt-10 px-10">
          <section className="flex gap-5 max-w-7xl mx-auto mt-4 bg-slate-800 p-5 rounded-lg">
            <img
              className="h-64 object-cover rounded-lg"
              src={game?.cover?.url}
              alt={game?.name}
              width={200}
            />
            <div>
              <h1 className="text-4xl font-bold">{game.name}</h1>
              <div className="flex flex-col gap-2 mt-2">
                <span>
                  {game?.involved_companies &&
                  game.involved_companies.length > 0 ? (
                    <span>
                      {game.involved_companies
                        .filter((company) => company.developer)
                        .map((company) => company.company?.name)
                        .join(", ")}
                    </span>
                  ) : (
                    <span>Unknown Developer</span>
                  )}{" "}
                  • Initial Release:{" "}
                  {formatReleaseDate(game?.first_release_date)}
                </span>
                <span>
                  Rating: {game?.rating ? game.rating.toFixed(1) : "N/A"}
                </span>
                <span>
                  Aggregated Rating:{" "}
                  {game?.aggregated_rating
                    ? game.aggregated_rating.toFixed(1)
                    : "N/A"}
                </span>
                <span>
                  {game?.platforms?.map((platform) => platform.name).join(", ")}
                </span>
                <LikeButtonSimplified gameId={game?.id?.toString() || ""} />
              </div>
            </div>
          </section>

          <section className="grid grid-cols-6 bg-slate-800 rounded-lg mt-5 gap-4 p-5">
            <h2 className="col-span-6 text-xl font-bold">Screenshots</h2>
            {game?.screenshots?.map((screenshot: Screenshot, index: number) => (
              <img
                key={index}
                className="h-32 object-cover mx-auto"
                src={screenshot.url}
                alt={`Screenshot ${index + 1}`}
              />
            ))}
          </section>

          <section className="p-5 bg-slate-800 rounded-lg mt-5">
            <h2 className="text-2xl font-bold mb-5">Storyline</h2>
            <p> {game?.storyline || game?.summary}</p>
          </section>
          <section className="p-5 bg-slate-800 rounded-lg mt-5">
            <div className="grid grid-cols-2 max-w-xl ">
              <div>
                <h2 className="text-xl font-bold">Platforms</h2>
                <ul>
                  {game?.platforms?.map((platform) => (
                    <li key={platform?.name}>{platform?.name}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h2 className="text-xl font-bold">Genres</h2>
                <ul>
                  {game?.genres?.map((platform) => (
                    <li key={platform?.name}>{platform?.name}</li>
                  ))}
                </ul>
              </div>
            </div>
          </section>

          {getWebsitesByCategory("social").length > 0 &&
            getWebsitesByCategory("store").length > 0 && (
              <>
                <section className="p-5 bg-slate-800 rounded-lg mt-5">
                  <h2 className="text-2xl font-bold mb-2">Socials</h2>
                  <div className="flex gap-4 flex-wrap">
                    {getWebsitesByCategory("social").map((website: Website) => {
                      const config = WEBSITE_CONFIG[website.type];
                      if (!config) return null; // Skip if no config
                      const Icon = config.icon;
                      return (
                        <a
                          key={website.id}
                          href={website.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors"
                          title={config.label}
                        >
                          <Icon size={24} />
                          <span>{config.label}</span>
                        </a>
                      );
                    })}
                  </div>

                  {getWebsitesByCategory("store").length > 0 && (
                    <>
                      <h2 className="text-2xl font-bold mb-2 mt-5">Stores</h2>
                      <div className="flex gap-4 flex-wrap">
                        {getWebsitesByCategory("store").map(
                          (website: Website) => {
                            const config = WEBSITE_CONFIG[website.type];
                            if (!config) return null; // Skip if no config
                            const Icon = config.icon;
                            return (
                              <a
                                key={website.id}
                                href={website.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors"
                                title={config.label}
                              >
                                <Icon size={24} />
                                <span>{config.label}</span>
                              </a>
                            );
                          },
                        )}
                      </div>
                    </>
                  )}

                  {/* <ul>
              {game?.websites?.map((website: Website) => (
                <li key={website.id}>
                  <a
                    href={website.url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {website.url}
                  </a>
                </li>
              ))}
            </ul> */}
                </section>
              </>
            )}

          {/* <div className="w-20">
            <pre>{JSON.stringify(game, null, 2)}</pre>
          </div> */}
        </main>
      )}

      <Footer />
    </>
  );
}

export default GameById;
