import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { playlistAPI } from "../utils/apiClient";
import { FiArrowLeft } from "react-icons/fi";

export default function CreatePlaylist() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isPublic, setIsPublic] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCreate = async () => {
    if (!name.trim()) return;
    setSaving(true);
    setError(null);
    try {
      const result = await playlistAPI.createPlaylist(
        name.trim(),
        description.trim() || undefined,
        isPublic,
      );
      navigate(`/playlists/${result.playlist.id}`);
    } catch (e: any) {
      setError(e.message || "Failed to create playlist");
      setSaving(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6">
      {/* Back link */}
      <Link
        to="/my-playlists"
        className="flex items-center gap-2 text-gray-400 hover:text-white text-sm mb-6 transition-colors w-fit"
      >
        <FiArrowLeft size={15} />
        Back to playlists
      </Link>

      <h1 className="text-3xl font-bold mb-8">Create Playlist</h1>

      <div className="flex flex-col gap-5">
        {/* Name */}
        <div className="flex flex-col gap-2">
          <label className="text-sm text-gray-400">
            Name <span className="text-red-400">*</span>
          </label>
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
            onClick={handleCreate}
            disabled={saving || !name.trim()}
            className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 rounded-lg text-sm font-semibold transition-colors"
          >
            {saving ? "Creating..." : "Create Playlist"}
          </button>
          <Link
            to="/my-playlists"
            className="flex-1 py-2.5 bg-gray-800 hover:bg-gray-700 rounded-lg text-sm text-center transition-colors"
          >
            Cancel
          </Link>
        </div>
      </div>
    </div>
  );
}
