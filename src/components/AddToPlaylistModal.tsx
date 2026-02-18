import { useState, useEffect } from "react";
import { FiX, FiCheck, FiPlus } from "react-icons/fi";
import { playlistAPI } from "../utils/apiClient";

interface PlaylistEntry {
  game_id: number;
}

interface Playlist {
  id: number;
  name: string;
  games: PlaylistEntry[];
}

interface AddToPlaylistModalProps {
  gameId: number;
  onClose: () => void;
}

export default function AddToPlaylistModal({
  gameId,
  onClose,
}: AddToPlaylistModalProps) {
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [addedIds, setAddedIds] = useState<Set<number>>(new Set());

  // Create new playlist form
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newName, setNewName] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [newIsPublic, setNewIsPublic] = useState(true);
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    const fetchPlaylists = async () => {
      try {
        const data = await playlistAPI.getMyPlaylists();
        setPlaylists(data.playlists);

        // Pre-mark playlists that already contain this game
        const alreadyIn = new Set<number>(
          data.playlists
            .filter((p: Playlist) =>
              p.games.some((e: PlaylistEntry) => e.game_id === gameId),
            )
            .map((p: Playlist) => p.id),
        );
        setAddedIds(alreadyIn);
      } catch (e: any) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPlaylists();
  }, [gameId]);

  const handleAddToPlaylist = async (playlistId: number) => {
    if (addedIds.has(playlistId)) return;
    try {
      await playlistAPI.addGameToPlaylist(playlistId, gameId);
      setAddedIds((prev) => new Set(prev).add(playlistId));
    } catch (e: any) {
      setError(e.message);
    }
  };

  const handleCreateAndAdd = async () => {
    if (!newName.trim()) return;
    setCreating(true);
    try {
      const result = await playlistAPI.createPlaylist(
        newName,
        newDesc || undefined,
        newIsPublic,
      );
      const newPlaylist = result.playlist;
      await playlistAPI.addGameToPlaylist(newPlaylist.id, gameId);
      setPlaylists((prev) => [
        { ...newPlaylist, games: [{ game_id: gameId }] },
        ...prev,
      ]);
      setAddedIds((prev) => new Set(prev).add(newPlaylist.id));
      setShowCreateForm(false);
      setNewName("");
      setNewDesc("");
      setNewIsPublic(true);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setCreating(false);
    }
  };

  return (
    // Backdrop
    <div
      className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      {/* Modal */}
      <div
        className="bg-gray-900 rounded-xl w-full max-w-md max-h-[80vh] flex flex-col shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-center p-5 border-b border-gray-700">
          <h2 className="text-lg font-semibold">Add to Playlist</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <FiX size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="overflow-y-auto flex-1 p-4 flex flex-col gap-2">
          {error && <p className="text-red-400 text-sm text-center">{error}</p>}

          {loading ? (
            <div className="flex flex-col gap-2">
              {Array.from({ length: 3 }).map((_, i) => (
                <div
                  key={i}
                  className="h-14 bg-gray-800 rounded-lg animate-pulse"
                />
              ))}
            </div>
          ) : playlists.length === 0 && !showCreateForm ? (
            <p className="text-gray-400 text-sm text-center py-4">
              You have no playlists yet. Create one below!
            </p>
          ) : (
            playlists.map((playlist) => {
              const isAdded = addedIds.has(playlist.id);
              return (
                <button
                  key={playlist.id}
                  onClick={() => handleAddToPlaylist(playlist.id)}
                  className={`flex items-center justify-between w-full px-4 py-3 rounded-lg transition-colors text-left ${
                    isAdded
                      ? "bg-indigo-600/20 border border-indigo-500/50 cursor-default"
                      : "bg-gray-800 hover:bg-gray-700 border border-transparent"
                  }`}
                >
                  <div>
                    <p className="font-medium text-sm">{playlist.name}</p>
                    <p className="text-xs text-gray-400">
                      {playlist.games.length} games
                    </p>
                  </div>
                  {isAdded && <FiCheck className="text-indigo-400" size={18} />}
                </button>
              );
            })
          )}

          {/* Create new playlist form */}
          {showCreateForm && (
            <div className="flex flex-col gap-3 mt-2 p-4 bg-gray-800 rounded-lg border border-gray-700">
              <input
                type="text"
                placeholder="Playlist name"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                className="bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-sm outline-none focus:border-indigo-500"
              />
              <input
                type="text"
                placeholder="Description (optional)"
                value={newDesc}
                onChange={(e) => setNewDesc(e.target.value)}
                className="bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-sm outline-none focus:border-indigo-500"
              />
              <label className="flex items-center gap-2 text-sm text-gray-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={newIsPublic}
                  onChange={(e) => setNewIsPublic(e.target.checked)}
                />
                Public
              </label>
              <div className="flex gap-2">
                <button
                  onClick={handleCreateAndAdd}
                  disabled={creating || !newName.trim()}
                  className="flex-1 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 rounded-lg text-sm font-semibold transition-colors"
                >
                  {creating ? "Creating..." : "Create & Add"}
                </button>
                <button
                  onClick={() => setShowCreateForm(false)}
                  className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-sm transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        {!showCreateForm && (
          <div className="p-4 border-t border-gray-700">
            <button
              onClick={() => setShowCreateForm(true)}
              className="flex items-center justify-center gap-2 w-full py-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-sm font-medium transition-colors"
            >
              <FiPlus size={16} />
              New Playlist
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
