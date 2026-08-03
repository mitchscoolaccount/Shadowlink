"use client";

import { useState } from "react";
import { useCurrentUser } from "@/lib/UserContext";
import { createClient } from "@/lib/supabase/client";

type PongLobbyRow = {
  id: number;
  room_code: string;
  host_nickname: string;
  guest_nickname: string | null;
  status: "waiting" | "playing" | "ended";
};

export default function PongLobby({
  onLobbyReady,
}: {
  onLobbyReady: (lobby: PongLobbyRow) => void;
}) {
  const { nickname } = useCurrentUser();
  const [joinCode, setJoinCode] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleCreate() {
    setBusy(true);
    setError(null);
    const supabase = createClient();
    const { data, error } = await supabase.rpc("create_pong_lobby");
    setBusy(false);
    if (error) {
      setError(error.message);
      return;
    }
    onLobbyReady(data as PongLobbyRow);
  }

  async function handleJoin() {
    if (!joinCode.trim()) return;
    setBusy(true);
    setError(null);
    const supabase = createClient();
    const { data, error } = await supabase.rpc("join_pong_lobby", {
      p_room_code: joinCode.trim().toUpperCase(),
    });
    setBusy(false);
    if (error) {
      setError(error.message);
      return;
    }
    onLobbyReady(data as PongLobbyRow);
  }

  return (
    <div className="mx-auto max-w-md rounded-2xl border border-bg-input bg-bg-panel p-6 shadow-[0_0_24px_var(--border-glow)]">
      <h2 className="text-gradient-accent mb-1 text-2xl font-bold">Pong</h2>
      <p className="mb-6 text-sm text-white/60">
        Playing as <span className="text-white/90">{nickname}</span>
      </p>

      <button
        onClick={handleCreate}
        disabled={busy}
        className="mb-4 w-full rounded-xl bg-[var(--accent)] px-4 py-3 font-semibold text-black transition hover:opacity-90 disabled:opacity-50"
      >
        Create Lobby
      </button>

      <div className="mb-4 flex items-center gap-3 text-xs uppercase tracking-wide text-white/40">
        <div className="h-px flex-1 bg-bg-input" />
        or join with a code
        <div className="h-px flex-1 bg-bg-input" />
      </div>

      <div className="flex gap-2">
        <input
          value={joinCode}
          onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
          maxLength={5}
          placeholder="ROOM CODE"
          className="w-full rounded-xl border border-bg-input bg-black/30 px-4 py-3 text-center tracking-[0.3em] text-white placeholder:tracking-normal placeholder:text-white/30 focus:border-[var(--accent)] focus:outline-none"
        />
        <button
          onClick={handleJoin}
          disabled={busy || !joinCode.trim()}
          className="shrink-0 rounded-xl border border-bg-input px-5 py-3 font-semibold text-white transition hover:border-[var(--accent)] disabled:opacity-50"
        >
          Join
        </button>
      </div>

      {error && (
        <p className="mt-4 text-center text-sm text-red-400">{error}</p>
      )}
    </div>
  );
}
