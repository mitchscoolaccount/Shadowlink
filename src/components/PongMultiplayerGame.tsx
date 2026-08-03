"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useCurrentUser } from "@/lib/UserContext";
import { createClient } from "@/lib/supabase/client";
import type { RealtimeChannel } from "@supabase/supabase-js";

type PongLobbyRow = {
  id: number;
  room_code: string;
  host_nickname: string;
  guest_nickname: string | null;
  status: "waiting" | "playing" | "ended";
};

// Logical playfield size - the canvas is drawn at this resolution and
// scaled to fit its container via CSS, so gameplay math never has to
// care about the viewer's actual screen size.
const W = 800;
const H = 450;
const PADDLE_W = 12;
const PADDLE_H = 90;
const PADDLE_MARGIN = 24;
const PADDLE_SPEED = 6.5;
const BALL_R = 8;
const WIN_SCORE = 7;
const COUNTDOWN_MS = 1500;

type Phase = "waiting" | "countdown" | "playing" | "ended";

type StateMsg = {
  hostY: number;
  guestY: number;
  ballX: number;
  ballY: number;
  hostScore: number;
  guestScore: number;
  phase: Phase;
  winner: "host" | "guest" | null;
};

type Result = { hostScore: number; guestScore: number; winner: "host" | "guest" | null };

function randomBallVelocity() {
  const angle = (Math.random() * 0.5 - 0.25) * Math.PI; // +-45deg
  const dir = Math.random() < 0.5 ? -1 : 1;
  const speed = 5.5;
  return { vx: Math.cos(angle) * speed * dir, vy: Math.sin(angle) * speed };
}

function freshSim(phase: Phase): StateMsg {
  return {
    hostY: H / 2 - PADDLE_H / 2,
    guestY: H / 2 - PADDLE_H / 2,
    ballX: W / 2,
    ballY: H / 2,
    hostScore: 0,
    guestScore: 0,
    phase,
    winner: null,
  };
}

export default function PongMultiplayerGame({
  lobby,
  onExit,
}: {
  lobby: PongLobbyRow;
  onExit: () => void;
}) {
  const user = useCurrentUser();
  const isHost = user.nickname === lobby.host_nickname;

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const channelRef = useRef<RealtimeChannel | null>(null);
  const keysRef = useRef({ up: false, down: false });
  const rafRef = useRef<number | null>(null);
  const matchStartedRef = useRef(false);

  const [phase, setPhase] = useState<Phase>("waiting");
  const phaseRef = useRef<Phase>("waiting");
  const [result, setResult] = useState<Result>({ hostScore: 0, guestScore: 0, winner: null });

  const setPhaseBoth = useCallback((p: Phase) => {
    phaseRef.current = p;
    setPhase(p);
  }, []);

  // Host-authoritative simulation state. Guests never mutate this
  // directly - they only ever read the latest broadcast into it for
  // rendering, except for their own paddle (predicted locally so input
  // feels instant instead of round-tripping through the host first).
  const simRef = useRef<StateMsg>(freshSim("waiting"));
  const ballVelRef = useRef(randomBallVelocity());
  const localGuestYRef = useRef(H / 2 - PADDLE_H / 2);

  const startCountdown = useCallback(() => {
    setPhaseBoth("countdown");
    setTimeout(() => {
      ballVelRef.current = randomBallVelocity();
      simRef.current = { ...freshSim("playing") };
      setPhaseBoth("playing");
    }, COUNTDOWN_MS);
  }, [setPhaseBoth]);

  // ------------------------------------------------------------
  // Channel setup: presence tells us when both players are in the
  // room, broadcast carries paddle input (guest -> host) and full
  // game state (host -> guest), same pattern as Shadow Crew.
  // ------------------------------------------------------------
  useEffect(() => {
    const supabase = createClient();
    const channel = supabase.channel(`pong-${lobby.room_code}`, {
      config: { presence: { key: user.nickname } },
    });
    channelRef.current = channel;

    channel
      .on("presence", { event: "sync" }, () => {
        const state = channel.presenceState();
        const count = Object.keys(state).length;
        if (isHost && count >= 2 && !matchStartedRef.current && phaseRef.current === "waiting") {
          matchStartedRef.current = true;
          startCountdown();
        }
      })
      .on("broadcast", { event: "paddle" }, ({ payload }) => {
        if (isHost) {
          simRef.current.guestY = payload.y;
        }
      })
      .on("broadcast", { event: "state" }, ({ payload }) => {
        if (!isHost) {
          const msg = payload as StateMsg;
          simRef.current = { ...msg, guestY: localGuestYRef.current };
          setPhaseBoth(msg.phase);
          if (msg.phase === "ended") {
            setResult({ hostScore: msg.hostScore, guestScore: msg.guestScore, winner: msg.winner });
          }
        }
      })
      .on("broadcast", { event: "rematch" }, () => {
        if (!isHost) setPhaseBoth("countdown");
      })
      .subscribe(async (status) => {
        if (status === "SUBSCRIBED") {
          await channel.track({ nickname: user.nickname });
        }
      });

    return () => {
      channel.unsubscribe();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lobby.room_code]);

  // ------------------------------------------------------------
  // Keyboard input
  // ------------------------------------------------------------
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (["ArrowUp", "w", "W"].includes(e.key)) keysRef.current.up = true;
      if (["ArrowDown", "s", "S"].includes(e.key)) keysRef.current.down = true;
    }
    function onKeyUp(e: KeyboardEvent) {
      if (["ArrowUp", "w", "W"].includes(e.key)) keysRef.current.up = false;
      if (["ArrowDown", "s", "S"].includes(e.key)) keysRef.current.down = false;
    }
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
    };
  }, []);

  // ------------------------------------------------------------
  // Guest: move own paddle locally + broadcast position to host.
  // ------------------------------------------------------------
  const guestTick = useCallback(() => {
    const { up, down } = keysRef.current;
    let y = localGuestYRef.current;
    if (up) y -= PADDLE_SPEED;
    if (down) y += PADDLE_SPEED;
    y = Math.max(0, Math.min(H - PADDLE_H, y));
    localGuestYRef.current = y;
    simRef.current.guestY = y;
    channelRef.current?.send({
      type: "broadcast",
      event: "paddle",
      payload: { y },
    });
  }, []);

  // ------------------------------------------------------------
  // Host: full physics loop + state broadcast.
  // ------------------------------------------------------------
  const hostTick = useCallback(() => {
    const sim = simRef.current;
    if (sim.phase !== "playing") return;

    const { up, down } = keysRef.current;
    if (up) sim.hostY -= PADDLE_SPEED;
    if (down) sim.hostY += PADDLE_SPEED;
    sim.hostY = Math.max(0, Math.min(H - PADDLE_H, sim.hostY));

    sim.ballX += ballVelRef.current.vx;
    sim.ballY += ballVelRef.current.vy;

    if (sim.ballY - BALL_R < 0 || sim.ballY + BALL_R > H) {
      ballVelRef.current.vy *= -1;
      sim.ballY = Math.max(BALL_R, Math.min(H - BALL_R, sim.ballY));
    }

    // Host paddle (left)
    const hostX = PADDLE_MARGIN;
    if (
      ballVelRef.current.vx < 0 &&
      sim.ballX - BALL_R <= hostX + PADDLE_W &&
      sim.ballX - BALL_R >= hostX &&
      sim.ballY >= sim.hostY &&
      sim.ballY <= sim.hostY + PADDLE_H
    ) {
      ballVelRef.current.vx *= -1.05;
      const rel = (sim.ballY - (sim.hostY + PADDLE_H / 2)) / (PADDLE_H / 2);
      ballVelRef.current.vy = rel * 5.5;
    }

    // Guest paddle (right)
    const guestX = W - PADDLE_MARGIN - PADDLE_W;
    if (
      ballVelRef.current.vx > 0 &&
      sim.ballX + BALL_R >= guestX &&
      sim.ballX + BALL_R <= guestX + PADDLE_W &&
      sim.ballY >= sim.guestY &&
      sim.ballY <= sim.guestY + PADDLE_H
    ) {
      ballVelRef.current.vx *= -1.05;
      const rel = (sim.ballY - (sim.guestY + PADDLE_H / 2)) / (PADDLE_H / 2);
      ballVelRef.current.vy = rel * 5.5;
    }

    // Scoring
    if (sim.ballX < -BALL_R) {
      sim.guestScore += 1;
      ballVelRef.current = randomBallVelocity();
      sim.ballX = W / 2;
      sim.ballY = H / 2;
    } else if (sim.ballX > W + BALL_R) {
      sim.hostScore += 1;
      ballVelRef.current = randomBallVelocity();
      sim.ballX = W / 2;
      sim.ballY = H / 2;
    }

    if (sim.hostScore >= WIN_SCORE || sim.guestScore >= WIN_SCORE) {
      sim.phase = "ended";
      sim.winner = sim.hostScore >= WIN_SCORE ? "host" : "guest";
      setPhaseBoth("ended");
      setResult({ hostScore: sim.hostScore, guestScore: sim.guestScore, winner: sim.winner });
    }

    channelRef.current?.send({
      type: "broadcast",
      event: "state",
      payload: sim,
    });
  }, [setPhaseBoth]);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const sim = simRef.current;

    ctx.fillStyle = "#0a0a12";
    ctx.fillRect(0, 0, W, H);

    ctx.strokeStyle = "rgba(255,255,255,0.15)";
    ctx.setLineDash([8, 10]);
    ctx.beginPath();
    ctx.moveTo(W / 2, 0);
    ctx.lineTo(W / 2, H);
    ctx.stroke();
    ctx.setLineDash([]);

    ctx.fillStyle = "#fff";
    ctx.fillRect(PADDLE_MARGIN, sim.hostY, PADDLE_W, PADDLE_H);
    ctx.fillRect(W - PADDLE_MARGIN - PADDLE_W, sim.guestY, PADDLE_W, PADDLE_H);

    if (sim.phase === "playing") {
      ctx.beginPath();
      ctx.arc(sim.ballX, sim.ballY, BALL_R, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.font = "bold 42px sans-serif";
    ctx.textAlign = "center";
    ctx.fillStyle = "rgba(255,255,255,0.85)";
    ctx.fillText(String(sim.hostScore), W / 2 - 60, 56);
    ctx.fillText(String(sim.guestScore), W / 2 + 60, 56);
  }, []);

  // Main animation loop.
  useEffect(() => {
    function loop() {
      if (isHost) hostTick();
      else guestTick();
      draw();
      rafRef.current = requestAnimationFrame(loop);
    }
    rafRef.current = requestAnimationFrame(loop);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [isHost, hostTick, guestTick, draw]);

  async function handleExit() {
    const supabase = createClient();
    await supabase.rpc("leave_pong_lobby", { p_lobby_id: lobby.id });
    onExit();
  }

  function handleRematch() {
    if (!isHost) return;
    simRef.current = freshSim("countdown");
    channelRef.current?.send({ type: "broadcast", event: "rematch", payload: {} });
    setResult({ hostScore: 0, guestScore: 0, winner: null });
    startCountdown();
  }

  const you = isHost ? result.hostScore : result.guestScore;
  const opponent = isHost ? result.guestScore : result.hostScore;
  const youWon = result.winner === (isHost ? "host" : "guest");

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-3 flex items-center justify-between">
        <div className="text-sm text-white/60">
          Room <span className="font-mono text-white">{lobby.room_code}</span>
        </div>
        <button
          onClick={handleExit}
          className="rounded-lg border border-bg-input px-3 py-1.5 text-sm text-white/70 transition hover:border-red-400 hover:text-red-300"
        >
          Leave
        </button>
      </div>

      <div className="relative overflow-hidden rounded-2xl border border-bg-input bg-bg-panel shadow-[0_0_24px_var(--border-glow)]">
        <canvas
          ref={canvasRef}
          width={W}
          height={H}
          className="w-full"
          style={{ aspectRatio: `${W} / ${H}` }}
        />

        {phase === "waiting" && (
          <Overlay>
            <p className="text-lg font-semibold text-white">Waiting for opponent...</p>
            <p className="mt-1 text-sm text-white/60">
              Share the room code <span className="font-mono text-white">{lobby.room_code}</span>
            </p>
          </Overlay>
        )}

        {phase === "countdown" && (
          <Overlay>
            <p className="text-2xl font-bold text-gradient-accent">Get ready...</p>
          </Overlay>
        )}

        {phase === "ended" && (
          <Overlay>
            <p className={`text-2xl font-bold ${youWon ? "text-green-400" : "text-red-400"}`}>
              {youWon ? "You Win!" : "You Lose"}
            </p>
            <p className="mt-1 text-sm text-white/60">
              {you} - {opponent}
            </p>
            {isHost ? (
              <button
                onClick={handleRematch}
                className="mt-4 rounded-xl bg-[var(--accent)] px-5 py-2 font-semibold text-black transition hover:opacity-90"
              >
                Rematch
              </button>
            ) : (
              <p className="mt-4 text-sm text-white/50">Waiting for host to start a rematch...</p>
            )}
          </Overlay>
        )}
      </div>

      <p className="mt-3 text-center text-xs text-white/40">
        Arrow keys or W / S to move your paddle
      </p>
    </div>
  );
}

function Overlay({ children }: { children: React.ReactNode }) {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/70 text-center">
      {children}
    </div>
  );
}
