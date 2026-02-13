import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Nav from "../components/Nav";
import Footer from "../components/Footer";
import LikeButtonSimplified from "../components/LikeButtonSimplified";
import { WEBSITE_CONFIG } from "../utils/websiteConfig";
import { gameAPI } from "../utils/apiClient";

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

interface Video {
  name?: string;
  video_id?: string;
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
  videos?: Video[];
  [key: string]: any;
}

function GameById() {
  const { id } = useParams();
  const [game, setGame] = useState<Game | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch game data when component mounts or when id changes
  useEffect(() => {
    const fetchGame = async () => {
      setLoading(true);
      setError(null);

      try {
        const data = await gameAPI.getGameById(id || "");
        console.log("API response:", data);
        setGame(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
        setGame(null);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      console.log("Fetching game with ID:", id);
      fetchGame();
    }
  }, [id]);

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

      {loading && (
        <main className="max-w-7xl mx-auto mt-10 px-10 animate-fade-in">
          {/* Top Section */}
          <section className="flex gap-5 bg-slate-800 p-5 rounded-lg">
            {/* Dark Cover Placeholder */}
            <div className="h-64 w-[200px] rounded-lg" />

            <div className="flex-1 space-y-4">
              <div className="h-8 w-1/2 rounded" />
              <div className="h-4 w-1/3 rounded" />
              <div className="h-4 w-1/4 rounded" />
              <div className="h-4 w-1/2 rounded" />
              <div className="h-8 w-32 rounded mt-4" />
            </div>
          </section>

          {/* Screenshots Section */}
          <section className="grid grid-cols-6 bg-slate-800 rounded-lg mt-5 gap-4 p-5">
            <div className="col-span-6 h-6 w-40 rounded mb-4" />
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-32 rounded" />
            ))}
          </section>

          {/* Story Section */}
          <section className="p-5 bg-slate-800 rounded-lg mt-5 space-y-4">
            <div className="h-6 w-48 rounded" />
            <div className="h-4 w-full rounded" />
            <div className="h-4 w-5/6 rounded" />
            <div className="h-4 w-2/3 rounded" />
          </section>

          {/* Platforms / Genres */}
          <section className="p-5 bg-slate-800 rounded-lg mt-5 grid grid-cols-2 gap-6">
            <div className="space-y-3">
              <div className="h-5 w-32 rounded" />
              <div className="h-4 w-24 rounded" />
              <div className="h-4 w-20 rounded" />
            </div>
            <div className="space-y-3">
              <div className="h-5 w-32 rounded" />
              <div className="h-4 w-24 rounded" />
              <div className="h-4 w-20 rounded" />
            </div>
          </section>
        </main>
      )}

      {!loading && !error && game && (
        <main className="max-w-7xl mx-auto mt-10 px-10">
          <section className="flex gap-5 max-w-7xl mx-auto mt-4 bg-slate-800 p-5 rounded-lg drop-shadow-md">
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
                <LikeButtonSimplified gameId={game?.id || 0} />
              </div>
            </div>
          </section>

          <section className="grid grid-cols-6 bg-slate-800 rounded-lg mt-5 gap-4 p-5 drop-shadow-md">
            <h2 className="col-span-6 text-xl font-bold">Screenshots</h2>
            {game?.screenshots?.map((screenshot: Screenshot, index: number) => (
              <a
                href={screenshot.url?.replace("t_thumb", "t_1080p")}
                target="_blank"
                rel="noopener noreferrer"
                key={index}
              >
                <img
                  key={index}
                  className="h-32 object-cover mx-auto rounded-lg border-2 border-slate-700 hover:border-slate-500 transition-colors"
                  src={screenshot.url?.replace("t_thumb", "t_cover_big")}
                  alt={`Screenshot ${index + 1}`}
                />
              </a>
            ))}
          </section>

          <section className="grid grid-cols-6 bg-slate-800 rounded-lg mt-5 gap-4 p-5 drop-shadow-md">
            <h2 className="col-span-6 text-xl font-bold">Youtube Videos</h2>
            {game?.videos?.map((video: any, index: number) => (
              <a
                href={`https://www.youtube.com/watch?v=${video.video_id}`}
                target="_blank"
                rel="noopener noreferrer"
                key={index}
              >
                <div>
                  <img
                    className="h-32 object-cover mx-auto rounded-lg border-2 border-slate-700 hover:border-slate-500 transition-colors"
                    src={`https://img.youtube.com/vi/${video.video_id}/0.jpg`}
                    alt={video.name || `Video ${index + 1}`}
                  />
                  <p className="text-center mt-2">{video.name}</p>
                </div>
              </a>
            ))}
          </section>

          <section className="p-5 bg-slate-800 rounded-lg mt-5 drop-shadow-md">
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
                <section className="p-5 bg-slate-800 rounded-lg mt-5 drop-shadow-md">
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
