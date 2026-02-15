import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import LikeButtonSimplified from "../components/LikeButtonSimplified";
import { WEBSITE_CONFIG } from "../utils/websiteConfig";
import { gameAPI, reviewAPI } from "../utils/apiClient";
import { useAuth } from "../context/AuthContext";
import { FaSteam } from "react-icons/fa";
import { SiIgdb } from "react-icons/si";
import ScreenshotGallery from "../components/ui/ScreenshotGallery";
import GameByIdSkeleton from "../components/skeletons/GameByIdSkeleton";
import GameSection from "../components/game/GameSection";
import GameVideoGallery from "../components/game/GameVideoGallery";
import GameReviewSection from "../components/reviews/GameReviewSection";

interface Cover {
  url?: string;
}

interface Genre {
  name?: string;
}

interface Platform {
  id: number;
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
  screenshots?: Screenshot[];
  websites?: Website[];
  steam_negative_reviews?: number;
  steam_positive_reviews?: number;
  steam_review_score?: number;
  [key: string]: any;
}

interface GameReview {
  id: number;
  user_id: string;
  game_id: number;
  rating: number;
  review_text: string;
  created_at: string;
  updated_at: string;
}

function GameById() {
  const { id } = useParams();
  const { user } = useAuth();
  const [game, setGame] = useState<Game | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [reviews, setReviews] = useState<GameReview[]>([]);
  const [userReview, setUserReview] = useState<GameReview | null>(null);
  const [reviewsLoading, setReviewsLoading] = useState(false);

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

  // Fetch reviews
  useEffect(() => {
    const fetchReviews = async () => {
      if (!id) return;

      setReviewsLoading(true);
      try {
        const data = await reviewAPI.getGameReviews(parseInt(id));
        setReviews(data.reviews || []);

        // Check if current user has reviewed this game
        if (user) {
          const myReview = data.reviews?.find(
            (review: GameReview) => review.user_id === user.uid,
          );
          setUserReview(myReview || null);
        }
      } catch (err) {
        console.error("Error fetching reviews:", err);
      } finally {
        setReviewsLoading(false);
      }
    };

    fetchReviews();
  }, [id, user]);

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

  // Check if game has ratings
  const hasRatings = game?.steam_review_score || game?.rating;

  return (
    <>
      {loading && <GameByIdSkeleton />}

      {!loading && !error && game && (
        <>
          {/* Hero section */}
          <section className="p-5 flex flex-col lg:flex-row gap-5 max-w-7xl mx-auto mt-4 md:bg-slate-800/75 rounded-sm drop-shadow-md lg:justify-between">
            {/* Row 1 on mobile: Cover + Info */}
            <div className="flex flex-row gap-3 sm:gap-5">
              {/* Cover Image - on right on mobile, left on desktop */}
              <div className="shrink-0 order-2 sm:order-1">
                <img
                  className="h-32 w-24 sm:h-64 sm:w-full object-cover rounded-lg"
                  src={game?.cover?.url}
                  alt={game?.name}
                  width={200}
                />
              </div>

              {/* Game Info - on left on mobile, right on desktop */}
              <div className="flex-1 sm:flex-none sm:max-w-md order-1 sm:order-2">
                <h1 className="text-2xl sm:text-4xl font-semibold tracking-tight mb-2">
                  {game.name}
                </h1>
                <div className="flex flex-col gap-2 mt-2 text-sm sm:text-base">
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
                  )}
                  <span>
                    Initial Release:{" "}
                    {formatReleaseDate(game?.first_release_date)}
                  </span>
                  <span>
                    {game?.platforms && game.platforms.length > 0 ? (
                      <>
                        {game.platforms
                          .map((platform) => platform.name)
                          .join(", ")}
                      </>
                    ) : (
                      <>N/A</>
                    )}
                  </span>
                  {/* <PlatformIcons
                    platforms={game?.platforms || []}
                    size={32}
                    className="flex-wrap"
                  /> */}
                  <LikeButtonSimplified gameId={game?.id || 0} />
                </div>
              </div>
            </div>

            {/* Row 2 on mobile: Ratings OR Video */}
            {hasRatings ? (
              <section className="flex items-center justify-center lg:justify-end gap-10 lg:mx-auto">
                {game.steam_review_score && (
                  <div className="text-center">
                    <div className="rounded-full bg-slate-500 w-18 h-18 flex items-center justify-center text-2xl font-bold text-white mb-2">
                      {game.steam_review_score?.toFixed(1)}
                    </div>
                    <div className="flex items-center justify-center">
                      <FaSteam size={32} className="inline-block mr-1" />
                    </div>
                  </div>
                )}

                <div className="text-center">
                  <div className="rounded-full bg-slate-500 w-18 h-18 flex items-center justify-center text-2xl font-bold text-white mb-2">
                    {game?.rating ? game.rating.toFixed(1) : "N/A"}
                  </div>
                  <div className="flex items-center justify-center">
                    <SiIgdb size={32} className="inline-block mr-1" />
                  </div>
                </div>
              </section>
            ) : game?.videos && game.videos.length > 0 ? (
              <section className="flex items-center justify-center lg:justify-end lg:mx-auto lg:min-w-[400px]">
                <div className="w-full">
                  <a
                    href={`https://www.youtube.com/watch?v=${game.videos[0].video_id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block relative group"
                  >
                    <div className="relative pb-[56.25%] h-0 overflow-hidden rounded-lg">
                      <img
                        src={`https://img.youtube.com/vi/${game.videos[0].video_id}/maxresdefault.jpg`}
                        alt={game.videos[0].name || "Game Trailer"}
                        className="absolute top-0 left-0 w-full h-full object-cover"
                        onError={(e) => {
                          // Fallback to hqdefault if maxresdefault doesn't exist
                          if (game.videos?.[0]?.video_id) {
                            e.currentTarget.src = `https://img.youtube.com/vi/${game.videos[0].video_id}/hqdefault.jpg`;
                          }
                        }}
                      />
                      {/* Play button overlay */}
                      <div className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/50 transition-colors">
                        <div className="w-24 h-16 bg-red-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                          <svg
                            className="w-8 h-8 text-white ml-1"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path d="M8 5v14l11-7z" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </a>
                  <p className="text-center text-sm text-gray-400 mt-2">
                    {game.videos[0].name || "Trailer"}
                  </p>
                </div>
              </section>
            ) : (
              <section className="flex items-center justify-center lg:justify-end gap-10 lg:mx-auto">
                <h2>Ratings TBA</h2>
              </section>
            )}
          </section>

          {/* Storyline */}
          <GameSection title="Storyline">
            <p>{game?.storyline || game?.summary || ""}</p>
          </GameSection>

          {/* Screenshots */}
          <GameSection title="Screenshots">
            <ScreenshotGallery screenshots={game?.screenshots || []} />
          </GameSection>

          {/* Videos */}
          <GameSection title="Youtube Videos">
            <GameVideoGallery videos={game?.videos || []} />
          </GameSection>

          {/* Reviews Section (Hidden if game hasn't released yet) */}
          {game?.first_release_date &&
            game?.first_release_date <= Math.floor(Date.now() / 1000) && (
              <GameReviewSection
                gameId={game.id || 0}
                reviews={reviews}
                userReview={userReview}
                reviewsLoading={reviewsLoading}
                user={user}
              />
            )}

          {/* Socials & Stores Section */}
          <section className="p-5 md:bg-slate-800/75 rounded-sm mt-5">
            <div className="flex flex-col md:grid grid-cols-3 gap-6">
              <div>
                <h2 className="text-xl font-semibold tracking-tight mb-2">
                  Platforms
                </h2>
                <ul>
                  {game?.platforms?.map((platform) => (
                    <li key={platform?.name}>{platform?.name}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h2 className="text-xl font-semibold tracking-tight mb-2">
                  Genres
                </h2>
                <ul>
                  {game?.genres?.map((platform) => (
                    <li key={platform?.name}>{platform?.name}</li>
                  ))}
                </ul>
              </div>
              {getWebsitesByCategory("social").length > 0 &&
                getWebsitesByCategory("store").length > 0 && (
                  <section>
                    <h2 className="text-xl font-semibold tracking-tight mb-2">
                      Socials
                    </h2>
                    <div className="grid grid-cols-4 gap-8 flex-wrap max-w-50 mb-5">
                      {getWebsitesByCategory("social").map(
                        (website: Website) => {
                          const config = WEBSITE_CONFIG[website.type];
                          if (!config) return null;
                          const Icon = config.icon;
                          return (
                            <a
                              key={website.url}
                              href={website.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center"
                              title={config.label}
                            >
                              <Icon size={24} />
                              {/* <span>{config.label}</span> */}
                            </a>
                          );
                        },
                      )}
                    </div>

                    {getWebsitesByCategory("store").length > 0 && (
                      <>
                        <h2 className="text-xl font-semibold tracking-tight mb-2">
                          Stores
                        </h2>
                        <div className="flex gap-8 flex-wrap">
                          {getWebsitesByCategory("store").map(
                            (website: Website) => {
                              const config = WEBSITE_CONFIG[website.type];
                              if (!config) return null;
                              const Icon = config.icon;
                              return (
                                <a
                                  key={website.url}
                                  href={website.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex items-center"
                                  title={config.label}
                                >
                                  <Icon size={24} />
                                  {/* <span>{config.label}</span> */}
                                </a>
                              );
                            },
                          )}
                        </div>
                      </>
                    )}
                  </section>
                )}
            </div>
          </section>
        </>
      )}
    </>
  );
}

export default GameById;
