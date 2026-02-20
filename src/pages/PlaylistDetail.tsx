import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { playlistAPI } from "../utils/apiClient";
import { FiEdit, FiTrash2, FiLock, FiGlobe, FiX } from "react-icons/fi";

interface PlaylistGame {
  game_id: number;
  name?: string;
  cover?: { url: string };
  order: number;
  added_at: string;
}

interface Playlist {
  id: number;
  user_id: string;
  name: string;
  description?: string;
  is_public: boolean;
  created_at: string;
  games: PlaylistGame[];
}

export default function PlaylistDetail() {
  const { id } = useParams<{ id: string }>();
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  const [playlist, setPlaylist] = useState<Playlist | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [removingGameId, setRemovingGameId] = useState<number | null>(null);

  const isOwner = user && playlist && user.uid === playlist.user_id;

  useEffect(() => {
    if (authLoading) return; // wait until Firebase has resolved the user

    const fetchPlaylist = async () => {
      try {
        const data = await playlistAPI.getPlaylistById(Number(id));
        setPlaylist(data);
      } catch (e: any) {
        setError(e.message || "Failed to load playlist");
      } finally {
        setLoading(false);
      }
    };

    fetchPlaylist();
  }, [id, authLoading]);

  const handleDeletePlaylist = async () => {
    if (!playlist) return;
    setDeleting(true);
    try {
      await playlistAPI.deletePlaylist(playlist.id);
      navigate("/my-playlists");
    } catch (e: any) {
      setError(e.message);
      setDeleting(false);
    }
  };

  const handleRemoveGame = async (gameId: number) => {
    if (!playlist) return;
    setRemovingGameId(gameId);
    try {
      await playlistAPI.removeGameFromPlaylist(playlist.id, gameId);
      setPlaylist((prev) =>
        prev
          ? { ...prev, games: prev.games.filter((g) => g.game_id !== gameId) }
          : prev,
      );
    } catch (e: any) {
      setError(e.message);
    } finally {
      setRemovingGameId(null);
    }
  };

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto p-6">
        <div className="h-8 bg-gray-800 rounded w-1/3 mb-4 animate-pulse" />
        <div className="h-4 bg-gray-800 rounded w-1/2 mb-8 animate-pulse" />
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="aspect-[3/4] bg-gray-800 rounded-lg mb-2" />
              <div className="h-3 bg-gray-800 rounded w-3/4" />
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

  if (!playlist) return null;

  return (
    <div className="max-w-5xl mx-auto p-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-2">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-3xl font-bold">{playlist.name}</h1>
            <span className="text-gray-500">
              {playlist.is_public ? (
                <FiGlobe size={16} title="Public" />
              ) : (
                <FiLock size={16} title="Private" />
              )}
            </span>
          </div>
          {playlist.description && (
            <p className="text-gray-400 mt-1">{playlist.description}</p>
          )}
          <p className="text-gray-500 text-sm mt-2">
            {playlist.games.length}{" "}
            {playlist.games.length === 1 ? "game" : "games"}
          </p>
        </div>

        {/* Owner actions */}
        {isOwner && (
          <div className="flex items-center gap-2 shrink-0">
            <Link
              to={`/playlists/${playlist.id}/edit`}
              className="flex items-center gap-2 px-3 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-sm transition-colors"
            >
              <FiEdit size={15} />
              Edit
            </Link>
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="flex items-center gap-2 px-3 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg text-sm transition-colors"
            >
              <FiTrash2 size={15} />
              Delete
            </button>
          </div>
        )}
      </div>

      {/* Games grid */}
      {playlist.games.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-gray-400 text-lg">
            No games in this playlist yet.
          </p>
          {isOwner && (
            <p className="text-gray-500 text-sm mt-2">
              Browse games and use the + button to add them here.
            </p>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5 mt-8">
          {playlist.games.map((game) => (
            <div key={game.game_id} className="relative group">
              <Link to={`/games/${game.game_id}`}>
                {game.cover?.url ? (
                  <img
                    src={game.cover.url}
                    alt={game.name}
                    className="w-full aspect-[3/4] object-cover rounded-lg"
                  />
                ) : (
                  <div className="w-full aspect-[3/4] bg-gray-800 rounded-lg flex items-center justify-center text-gray-500 text-xs">
                    No cover
                  </div>
                )}
                <p className="text-sm mt-2 text-gray-300 truncate">
                  {game.name}
                </p>
              </Link>

              {/* Remove button — owner only */}
              {isOwner && (
                <button
                  onClick={() => handleRemoveGame(game.game_id)}
                  disabled={removingGameId === game.game_id}
                  className="absolute top-2 right-2 p-1.5 bg-black/70 hover:bg-red-500/80 text-white rounded-full opacity-0 group-hover:opacity-100 transition-all"
                  title="Remove from playlist"
                >
                  {removingGameId === game.game_id ? (
                    <span className="block w-3 h-3 border-2 border-white/50 border-t-white rounded-full animate-spin" />
                  ) : (
                    <FiX size={13} />
                  )}
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Delete confirmation modal */}
      {showDeleteConfirm && (
        <div
          className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
          onClick={() => setShowDeleteConfirm(false)}
        >
          <div
            className="bg-gray-900 rounded-xl p-6 max-w-sm w-full shadow-xl border border-gray-700"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-lg font-semibold mb-2">Delete Playlist</h2>
            <p className="text-gray-400 text-sm mb-6">
              Are you sure you want to delete{" "}
              <span className="text-white font-medium">"{playlist.name}"</span>?
              This cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={handleDeletePlaylist}
                disabled={deleting}
                className="flex-1 py-2 bg-red-600 hover:bg-red-700 disabled:opacity-50 rounded-lg text-sm font-semibold transition-colors"
              >
                {deleting ? "Deleting..." : "Delete"}
              </button>
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-sm transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
