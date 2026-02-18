import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { playlistAPI } from "../utils/apiClient";
import PlaylistCard from "../components/PlaylistCard";
import { FiPlus } from "react-icons/fi";

interface PlaylistGame {
  game_id: number;
  cover?: { url: string };
  name?: string;
}

interface Playlist {
  id: number;
  name: string;
  description?: string;
  is_public: boolean;
  games: PlaylistGame[];
}

export default function MyPlaylists() {
  const { user } = useAuth();
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPlaylists = async () => {
      try {
        const data = await playlistAPI.getMyPlaylists();
        setPlaylists(data.playlists);
      } catch (e: any) {
        setError(e.message || "Failed to load playlists");
      } finally {
        setLoading(false);
      }
    };

    fetchPlaylists();
  }, []);

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-8">My Playlists</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="bg-gray-800 rounded-xl overflow-hidden animate-pulse"
            >
              <div className="aspect-video bg-gray-700" />
              <div className="p-4 flex flex-col gap-2">
                <div className="h-4 bg-gray-700 rounded w-2/3" />
                <div className="h-3 bg-gray-700 rounded w-1/3" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-5xl mx-auto p-6">
        <div className="p-4 bg-red-500/10 border border-red-500 rounded-lg text-red-500">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">My Playlists</h1>
        <Link
          to="/playlists/create"
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-lg text-sm font-semibold transition-colors"
        >
          <FiPlus size={16} />
          New Playlist
        </Link>
      </div>

      {/* Empty state */}
      {playlists.length === 0 ? (
        <div className="text-center py-20 flex flex-col items-center gap-4">
          <p className="text-gray-400 text-lg">
            You haven't created any playlists yet.
          </p>
          <Link
            to="/playlists/create"
            className="flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 rounded-lg font-semibold transition-colors"
          >
            <FiPlus size={18} />
            Create your first playlist
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {playlists.map((playlist) => (
            <PlaylistCard
              key={playlist.id}
              id={playlist.id}
              name={playlist.name}
              description={playlist.description}
              is_public={playlist.is_public}
              games={playlist.games}
            />
          ))}
        </div>
      )}
    </div>
  );
}
