import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { playlistAPI } from "../utils/apiClient";
import { FiArrowLeft } from "react-icons/fi";

interface Playlist {
  id: number;
  user_id: string;
  name: string;
  description?: string;
  is_public: boolean;
}

export default function EditPlaylist() {
  const { id } = useParams<{ id: string }>();
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  const [playlist, setPlaylist] = useState<Playlist | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form state
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isPublic, setIsPublic] = useState(true);

  useEffect(() => {
    if (authLoading) return;

    const fetchPlaylist = async () => {
      try {
        const data = await playlistAPI.getPlaylistById(Number(id));

        // Redirect if not the owner
        if (!user || user.uid !== data.user_id) {
          navigate(`/playlists/${id}`);
          return;
        }

        setPlaylist(data);
        setName(data.name);
        setDescription(data.description ?? "");
        setIsPublic(data.is_public);
      } catch (e: any) {
        setError(e.message || "Failed to load playlist");
      } finally {
        setLoading(false);
      }
    };

    fetchPlaylist();
  }, [id, user, navigate]);

  const handleSave = async () => {
    if (!playlist || !name.trim()) return;
    setSaving(true);
    setError(null);
    try {
      await playlistAPI.updatePlaylist(
        playlist.id,
        name.trim(),
        description.trim() || undefined,
        isPublic,
      );
      navigate(`/playlists/${playlist.id}`);
    } catch (e: any) {
      setError(e.message || "Failed to save changes");
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-xl mx-auto p-6">
        <div className="h-8 bg-gray-800 rounded w-1/3 mb-8 animate-pulse" />
        <div className="flex flex-col gap-4">
          <div className="h-10 bg-gray-800 rounded animate-pulse" />
          <div className="h-24 bg-gray-800 rounded animate-pulse" />
          <div className="h-6 bg-gray-800 rounded w-1/4 animate-pulse" />
        </div>
      </div>
    );
  }

  if (error && !playlist) {
    return (
      <div className="max-w-xl mx-auto p-6">
        <div className="p-4 bg-red-500/10 border border-red-500 rounded-lg text-red-500">
          {error}
        </div>
      </div>
    );
  }

  if (!playlist) return null;

  return (
    <div className="max-w-xl mx-auto p-6">
      {/* Back link */}
      <Link
        to={`/playlists/${playlist.id}`}
        className="flex items-center gap-2 text-gray-400 hover:text-white text-sm mb-6 transition-colors w-fit"
      >
        <FiArrowLeft size={15} />
        Back to playlist
      </Link>

      <h1 className="text-3xl font-bold mb-8">Edit Playlist</h1>

      <div className="flex flex-col gap-5">
        {/* Name */}
        <div className="flex flex-col gap-2">
          <label className="text-sm text-gray-400">Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Playlist name"
            className="bg-gray-800 border border-gray-700 focus:border-indigo-500 rounded-lg px-4 py-2.5 text-white text-sm outline-none transition-colors"
          />
        </div>

        {/* Description */}
        <div className="flex flex-col gap-2">
          <label className="text-sm text-gray-400">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Optional description"
            rows={4}
            className="bg-gray-800 border border-gray-700 focus:border-indigo-500 rounded-lg px-4 py-2.5 text-white text-sm outline-none transition-colors resize-none"
          />
        </div>

        {/* Visibility */}
        <label className="flex items-center gap-3 cursor-pointer w-fit">
          <input
            type="checkbox"
            checked={isPublic}
            onChange={(e) => setIsPublic(e.target.checked)}
            className="w-4 h-4 accent-indigo-500"
          />
          <span className="text-sm text-gray-300">Make playlist public</span>
        </label>

        {/* Error */}
        {error && <p className="text-red-400 text-sm">{error}</p>}

        {/* Actions */}
        <div className="flex gap-3 pt-2">
          <button
            onClick={handleSave}
            disabled={saving || !name.trim()}
            className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 rounded-lg text-sm font-semibold transition-colors"
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
          <Link
            to={`/playlists/${playlist.id}`}
            className="flex-1 py-2.5 bg-gray-800 hover:bg-gray-700 rounded-lg text-sm text-center transition-colors"
          >
            Cancel
          </Link>
        </div>
      </div>
    </div>
  );
}
