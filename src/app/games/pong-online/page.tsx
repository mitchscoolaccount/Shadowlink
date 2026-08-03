"use client";

import { useState } from "react";
import PongLobby from "@/components/PongLobby";
import PongMultiplayerGame from "@/components/PongMultiplayerGame";

type PongLobbyRow = {
  id: number;
  room_code: string;
  host_nickname: string;
  guest_nickname: string | null;
  status: "waiting" | "playing" | "ended";
};

export default function PongOnlinePage() {
  const [lobby, setLobby] = useState<PongLobbyRow | null>(null);

  return (
    <div className="px-4 py-8">
      {lobby ? (
        <PongMultiplayerGame lobby={lobby} onExit={() => setLobby(null)} />
      ) : (
        <PongLobby onLobbyReady={setLobby} />
      )}
    </div>
  );
}
