import { Link } from "react-router-dom";

interface PlaylistGame {
  game_id: number;
  cover?: { url: string };
  name?: string;
}

interface PlaylistCardProps {
  id: number;
  name: string;
  description?: string;
  is_public: boolean;
  games: PlaylistGame[];
}

export default function PlaylistCard({
  id,
  name,
  description,
  is_public,
  games,
}: PlaylistCardProps) {
  const coverGames = games.slice(0, 4);
  const gameCount = games.length;

  return (
    <Link
      to={`/playlists/${id}`}
      className="block bg-gray-800 hover:bg-gray-750 rounded-xl overflow-hidden transition-colors border border-gray-700 hover:border-gray-600"
    >
      {/* Cover mosaic */}
      <div className="w-full aspect-video bg-gray-700 grid grid-cols-2 grid-rows-2 overflow-hidden">
        {coverGames.length === 0 ? (
          <div className="col-span-2 row-span-2 flex items-center justify-center text-gray-500 text-sm">
            No games yet
          </div>
        ) : coverGames.length === 1 ? (
          <img
            src={coverGames[0].cover?.url}
            alt={coverGames[0].name}
            className="col-span-2 row-span-2 w-full h-full object-cover"
          />
        ) : (
          coverGames.map((game, i) => (
            <div key={i} className="overflow-hidden">
              {game.cover?.url ? (
                <img
                  src={game.cover.url}
                  alt={game.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gray-600" />
              )}
            </div>
          ))
        )}
      </div>

      {/* Info */}
      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold text-white truncate">{name}</h3>
          <span
            className={`text-xs px-2 py-0.5 rounded-full shrink-0 ${
              is_public
                ? "bg-green-500/20 text-green-400"
                : "bg-gray-600 text-gray-400"
            }`}
          >
            {is_public ? "Public" : "Private"}
          </span>
        </div>
        {description && (
          <p className="text-gray-400 text-sm mt-1 line-clamp-2">
            {description}
          </p>
        )}
        <p className="text-gray-500 text-xs mt-2">
          {gameCount} {gameCount === 1 ? "game" : "games"}
        </p>
      </div>
    </Link>
  );
}
