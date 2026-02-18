import { useState } from "react";
import { playlistAPI } from "../utils/apiClient";

type ResultState = { data: any; error: string | null };

const defaultResult: ResultState = { data: null, error: null };

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div
      style={{
        background: "#111",
        border: "1px solid #222",
        borderRadius: "8px",
        padding: "20px",
        display: "flex",
        flexDirection: "column",
        gap: "12px",
      }}
    >
      <h2
        style={{
          margin: 0,
          fontSize: "13px",
          fontWeight: 600,
          color: "#888",
          textTransform: "uppercase",
          letterSpacing: "0.08em",
        }}
      >
        {title}
      </h2>
      {children}
    </div>
  );
}

function Input({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
      <label style={{ fontSize: "12px", color: "#666" }}>{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        style={{
          background: "#1a1a1a",
          border: "1px solid #2a2a2a",
          borderRadius: "6px",
          padding: "8px 12px",
          color: "#fff",
          fontSize: "14px",
          outline: "none",
        }}
      />
    </div>
  );
}

function Checkbox({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <label
      style={{
        display: "flex",
        alignItems: "center",
        gap: "8px",
        fontSize: "14px",
        color: "#ccc",
        cursor: "pointer",
      }}
    >
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
      />
      {label}
    </label>
  );
}

function Button({
  onClick,
  children,
  variant = "primary",
}: {
  onClick: () => void;
  children: React.ReactNode;
  variant?: "primary" | "danger";
}) {
  return (
    <button
      onClick={onClick}
      style={{
        background: variant === "danger" ? "#3a1a1a" : "#1a2a1a",
        border: `1px solid ${variant === "danger" ? "#5a2a2a" : "#2a4a2a"}`,
        borderRadius: "6px",
        padding: "8px 16px",
        color: variant === "danger" ? "#ff6b6b" : "#6bff9e",
        fontSize: "13px",
        fontWeight: 600,
        cursor: "pointer",
        alignSelf: "flex-start",
      }}
    >
      {children}
    </button>
  );
}

function Result({ result }: { result: ResultState }) {
  if (!result.data && !result.error) return null;
  return (
    <pre
      style={{
        background: "#0a0a0a",
        border: `1px solid ${result.error ? "#5a2a2a" : "#1a2a1a"}`,
        borderRadius: "6px",
        padding: "12px",
        fontSize: "12px",
        color: result.error ? "#ff6b6b" : "#6bff9e",
        overflow: "auto",
        maxHeight: "200px",
        margin: 0,
        whiteSpace: "pre-wrap",
        wordBreak: "break-word",
      }}
    >
      {result.error ?? JSON.stringify(result.data, null, 2)}
    </pre>
  );
}

async function run(
  fn: () => Promise<any>,
  setResult: (r: ResultState) => void,
) {
  try {
    const data = await fn();
    setResult({ data, error: null });
  } catch (e: any) {
    setResult({ data: null, error: e.message });
  }
}

export default function PlaylistTestPage() {
  // Create
  const [createName, setCreateName] = useState("");
  const [createDesc, setCreateDesc] = useState("");
  const [createPublic, setCreatePublic] = useState(true);
  const [createResult, setCreateResult] = useState<ResultState>(defaultResult);

  // Get my playlists
  const [myPlaylistsResult, setMyPlaylistsResult] =
    useState<ResultState>(defaultResult);

  // Get by ID
  const [getIdInput, setGetIdInput] = useState("");
  const [getResult, setGetResult] = useState<ResultState>(defaultResult);

  // Update
  const [updateId, setUpdateId] = useState("");
  const [updateName, setUpdateName] = useState("");
  const [updateDesc, setUpdateDesc] = useState("");
  const [updatePublic, setUpdatePublic] = useState(true);
  const [updateResult, setUpdateResult] = useState<ResultState>(defaultResult);

  // Delete
  const [deleteId, setDeleteId] = useState("");
  const [deleteResult, setDeleteResult] = useState<ResultState>(defaultResult);

  // Add game
  const [addPlaylistId, setAddPlaylistId] = useState("");
  const [addGameId, setAddGameId] = useState("");
  const [addResult, setAddResult] = useState<ResultState>(defaultResult);

  // Remove game
  const [removePlaylistId, setRemovePlaylistId] = useState("");
  const [removeGameId, setRemoveGameId] = useState("");
  const [removeResult, setRemoveResult] = useState<ResultState>(defaultResult);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0d0d0d",
        color: "#fff",
        fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
        padding: "40px 24px",
      }}
    >
      <div
        style={{
          maxWidth: "720px",
          margin: "0 auto",
          display: "flex",
          flexDirection: "column",
          gap: "32px",
        }}
      >
        {/* Header */}
        <div>
          <h1
            style={{
              margin: 0,
              fontSize: "22px",
              fontWeight: 700,
              color: "#fff",
            }}
          >
            Playlist API Tester
          </h1>
          <p style={{ margin: "6px 0 0", fontSize: "13px", color: "#555" }}>
            Make sure you're logged in before running authenticated endpoints.
          </p>
        </div>

        {/* Create */}
        <Section title="POST /playlists — Create Playlist">
          <Input
            label="Name"
            value={createName}
            onChange={setCreateName}
            placeholder="My Playlist"
          />
          <Input
            label="Description"
            value={createDesc}
            onChange={setCreateDesc}
            placeholder="Optional description"
          />
          <Checkbox
            label="Public"
            checked={createPublic}
            onChange={setCreatePublic}
          />
          <Button
            onClick={() =>
              run(
                () =>
                  playlistAPI.createPlaylist(
                    createName,
                    createDesc || undefined,
                    createPublic,
                  ),
                setCreateResult,
              )
            }
          >
            Create Playlist
          </Button>
          <Result result={createResult} />
        </Section>

        {/* Get my playlists */}
        <Section title="GET /users/me/playlists — My Playlists">
          <Button
            onClick={() =>
              run(() => playlistAPI.getMyPlaylists(), setMyPlaylistsResult)
            }
          >
            Fetch My Playlists
          </Button>
          <Result result={myPlaylistsResult} />
        </Section>

        {/* Get by ID */}
        <Section title="GET /playlists/:id — Get Playlist">
          <Input
            label="Playlist ID"
            value={getIdInput}
            onChange={setGetIdInput}
            placeholder="1"
            type="number"
          />
          <Button
            onClick={() =>
              run(
                () => playlistAPI.getPlaylistById(Number(getIdInput)),
                setGetResult,
              )
            }
          >
            Fetch Playlist
          </Button>
          <Result result={getResult} />
        </Section>

        {/* Update */}
        <Section title="PUT /playlists/:id — Update Playlist">
          <Input
            label="Playlist ID"
            value={updateId}
            onChange={setUpdateId}
            placeholder="1"
            type="number"
          />
          <Input
            label="New Name"
            value={updateName}
            onChange={setUpdateName}
            placeholder="Leave blank to skip"
          />
          <Input
            label="New Description"
            value={updateDesc}
            onChange={setUpdateDesc}
            placeholder="Leave blank to skip"
          />
          <Checkbox
            label="Public"
            checked={updatePublic}
            onChange={setUpdatePublic}
          />
          <Button
            onClick={() =>
              run(
                () =>
                  playlistAPI.updatePlaylist(
                    Number(updateId),
                    updateName || undefined,
                    updateDesc || undefined,
                    updatePublic,
                  ),
                setUpdateResult,
              )
            }
          >
            Update Playlist
          </Button>
          <Result result={updateResult} />
        </Section>

        {/* Delete */}
        <Section title="DELETE /playlists/:id — Delete Playlist">
          <Input
            label="Playlist ID"
            value={deleteId}
            onChange={setDeleteId}
            placeholder="1"
            type="number"
          />
          <Button
            variant="danger"
            onClick={() =>
              run(
                () => playlistAPI.deletePlaylist(Number(deleteId)),
                setDeleteResult,
              )
            }
          >
            Delete Playlist
          </Button>
          <Result result={deleteResult} />
        </Section>

        {/* Add game */}
        <Section title="POST /playlists/:id/games — Add Game">
          <Input
            label="Playlist ID"
            value={addPlaylistId}
            onChange={setAddPlaylistId}
            placeholder="1"
            type="number"
          />
          <Input
            label="Game ID"
            value={addGameId}
            onChange={setAddGameId}
            placeholder="123"
            type="number"
          />
          <Button
            onClick={() =>
              run(
                () =>
                  playlistAPI.addGameToPlaylist(
                    Number(addPlaylistId),
                    Number(addGameId),
                  ),
                setAddResult,
              )
            }
          >
            Add Game
          </Button>
          <Result result={addResult} />
        </Section>

        {/* Remove game */}
        <Section title="DELETE /playlists/:id/games/:game_id — Remove Game">
          <Input
            label="Playlist ID"
            value={removePlaylistId}
            onChange={setRemovePlaylistId}
            placeholder="1"
            type="number"
          />
          <Input
            label="Game ID"
            value={removeGameId}
            onChange={setRemoveGameId}
            placeholder="123"
            type="number"
          />
          <Button
            variant="danger"
            onClick={() =>
              run(
                () =>
                  playlistAPI.removeGameFromPlaylist(
                    Number(removePlaylistId),
                    Number(removeGameId),
                  ),
                setRemoveResult,
              )
            }
          >
            Remove Game
          </Button>
          <Result result={removeResult} />
        </Section>
      </div>
    </div>
  );
}
