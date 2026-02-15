import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import LikeButtonSimplified from "../components/LikeButtonSimplified";
import { PlatformIcons } from "../components/PlatformIcons";
import { WEBSITE_CONFIG } from "../utils/websiteConfig";
import { gameAPI, reviewAPI } from "../utils/apiClient";
import { useAuth } from "../context/AuthContext";
import { FaSteam } from "react-icons/fa";
import { SiIgdb } from "react-icons/si";
import { FiEdit } from "react-icons/fi";

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
      {loading && (
        <div className="animate-fade-in">
          {/* Top Section */}
          <section className="flex gap-5 bg-slate-800/75 p-5 rounded-lg">
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
          <section className="grid grid-cols-6 bg-slate-800/75 rounded-lg mt-5 gap-4 p-5">
            <div className="col-span-6 h-6 w-40 rounded mb-4" />
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-32 rounded" />
            ))}
          </section>

          {/* Story Section */}
          <section className="p-5 bg-slate-800/75 rounded-lg mt-5 space-y-4">
            <div className="h-6 w-48 rounded" />
            <div className="h-4 w-full rounded" />
            <div className="h-4 w-5/6 rounded" />
            <div className="h-4 w-2/3 rounded" />
          </section>

          {/* Platforms / Genres */}
          <section className="p-5 bg-slate-800/75 rounded-lg mt-5 grid grid-cols-2 gap-6">
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
        </div>
      )}

      {!loading && !error && game && (
        <>
          {/* Hero section */}
          <section className="flex flex-col lg:flex-row gap-5 max-w-7xl mx-auto mt-4 bg-slate-800/75 p-5 rounded-lg drop-shadow-md lg:justify-between">
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

                  <PlatformIcons
                    platforms={game?.platforms || []}
                    size={32}
                    className="flex-wrap"
                  />
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
                  <div className="relative pb-[56.25%] h-0 overflow-hidden rounded-lg">
                    <iframe
                      className="absolute top-0 left-0 w-full h-full"
                      src={`https://www.youtube.com/embed/${game.videos[0].video_id}`}
                      title={game.videos[0].name || "Game Trailer"}
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    ></iframe>
                  </div>
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
          <section className="p-5 bg-slate-800/75 rounded-lg mt-5 drop-shadow-md">
            <h2 className="text-2xl font-semibold tracking-tight mb-2">
              Storyline
            </h2>
            <p> {game?.storyline || game?.summary}</p>
          </section>

          {/* Screenshots */}
          <section className="grid grid-cols-6 bg-slate-800/75 rounded-lg mt-5 gap-4 p-5 drop-shadow-md">
            <h2 className="col-span-6 text-2xl font-semibold tracking-tight mb-2">
              Screenshots
            </h2>
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

          {/* Videos */}
          <section className="grid grid-cols-6 bg-slate-800/75 rounded-lg mt-5 gap-4 p-5 drop-shadow-md">
            <h2 className="col-span-6 text-2xl font-semibold tracking-tight mb-2">
              Youtube Videos
            </h2>
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

          {/* Reviews Section */}
          {game?.first_release_date &&
            game?.first_release_date <= Math.floor(Date.now() / 1000) && (
              <section className="p-5 bg-slate-800/75 rounded-lg mt-5 drop-shadow-md">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-2xl font-semibold tracking-tight">
                    User Reviews {reviews.length > 0 && `(${reviews.length})`}
                  </h2>

                  {/* Action button - changes based on user state */}
                  {!user ? (
                    <Link
                      to="/signin"
                      className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                    >
                      Sign in to Review
                    </Link>
                  ) : userReview ? (
                    <Link
                      to={`/games/${game.id}/review`}
                      className="flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-md transition-colors"
                    >
                      <FiEdit size={16} />
                      Edit Your Review
                    </Link>
                  ) : (
                    <Link
                      to={`/games/${game.id}/review`}
                      className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                    >
                      Leave a Review
                    </Link>
                  )}
                </div>

                {reviewsLoading ? (
                  // Loading skeleton - grid layout
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 animate-pulse">
                    {[1, 2, 3].map((i) => (
                      <div
                        key={i}
                        className="border border-gray-700 rounded-lg p-4"
                      >
                        <div className="flex items-start gap-3">
                          <div className="w-12 h-12 bg-gray-700 rounded-full"></div>
                          <div className="flex-1 space-y-2">
                            <div className="h-4 bg-gray-700 rounded w-1/2"></div>
                            <div className="h-3 bg-gray-700 rounded w-full"></div>
                            <div className="h-3 bg-gray-700 rounded w-5/6"></div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : reviews.length === 0 ? (
                  // No reviews yet
                  <div className="text-center py-12 border-t border-gray-700">
                    <p className="text-gray-400 mb-3">
                      No reviews yet. Be the first!
                    </p>
                    {user && (
                      <Link
                        to={`/games/${game.id}/review`}
                        className="inline-block px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                      >
                        Write the First Review
                      </Link>
                    )}
                  </div>
                ) : (
                  // Display reviews - grid layout
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {/* User's own review first (if exists) */}
                    {userReview && (
                      <div className="border-2 border-indigo-500/30 bg-indigo-500/5 rounded-lg p-4">
                        <div className="flex items-start justify-between gap-3 mb-2">
                          <div className="flex items-center gap-2">
                            <div className="w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                              You
                            </div>
                            <div>
                              <p className="font-semibold text-indigo-400 text-sm">
                                Your Review
                              </p>
                              <p className="text-xs text-gray-500">
                                {new Date(
                                  userReview.created_at,
                                ).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className="text-2xl font-bold text-indigo-400 mb-2">
                          {userReview.rating}/10
                        </div>
                        {userReview.review_text && (
                          <p className="text-gray-300 text-sm whitespace-pre-wrap line-clamp-4">
                            {userReview.review_text}
                          </p>
                        )}
                      </div>
                    )}

                    {/* Other users' reviews */}
                    {reviews
                      .filter((review) => review.user_id !== user?.uid)
                      .map((review) => (
                        <div
                          key={review.id}
                          className="border border-gray-700 rounded-lg p-4 hover:border-gray-600 transition-colors"
                        >
                          <div className="flex items-start justify-between gap-3 mb-2">
                            <div className="flex items-center gap-2">
                              <div className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center text-white font-bold text-sm">
                                {review.user_id.slice(0, 2).toUpperCase()}
                              </div>
                              <div>
                                <p className="font-semibold text-sm">
                                  Anonymous User
                                </p>
                                <p className="text-xs text-gray-500">
                                  {new Date(
                                    review.created_at,
                                  ).toLocaleDateString()}
                                </p>
                              </div>
                            </div>
                          </div>
                          <div className="text-2xl font-bold text-gray-300 mb-2">
                            {review.rating}/10
                          </div>
                          {review.review_text && (
                            <p className="text-gray-300 text-sm whitespace-pre-wrap line-clamp-4">
                              {review.review_text}
                            </p>
                          )}
                        </div>
                      ))}
                  </div>
                )}
              </section>
            )}

          {/* Socials & Stores Section */}
          <section className="p-5 bg-slate-800/75 rounded-lg mt-5">
            <div className="grid grid-cols-3 gap-6">
              {getWebsitesByCategory("social").length > 0 &&
                getWebsitesByCategory("store").length > 0 && (
                  <section>
                    <h2 className="text-xl font-semibold tracking-tight mb-2">
                      Socials
                    </h2>
                    <div className="flex gap-4 flex-wrap mb-5">
                      {getWebsitesByCategory("social").map(
                        (website: Website) => {
                          const config = WEBSITE_CONFIG[website.type];
                          if (!config) return null;
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

                    {getWebsitesByCategory("store").length > 0 && (
                      <>
                        <h2 className="text-xl font-semibold tracking-tight mb-2">
                          Stores
                        </h2>
                        <div className="flex gap-4 flex-wrap">
                          {getWebsitesByCategory("store").map(
                            (website: Website) => {
                              const config = WEBSITE_CONFIG[website.type];
                              if (!config) return null;
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
                )}
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
            </div>
          </section>
        </>
      )}
    </>
  );
}

export default GameById;
