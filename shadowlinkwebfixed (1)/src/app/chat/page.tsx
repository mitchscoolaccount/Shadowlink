"use client";

import { useState } from "react";
import AppShell from "@/components/AppShell";
import { CURRENT_USER, INITIAL_MESSAGES, type RoomMessage } from "@/lib/appData";

const PALETTE = ["#00f0ff", "#f472b6", "#facc15", "#4ade80", "#a78bfa", "#fb923c"];

function colorForName(name: string) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return PALETTE[Math.abs(hash) % PALETTE.length];
}

export default function ChatPage() {
  const [messages, setMessages] = useState<RoomMessage[]>(INITIAL_MESSAGES);
  const [draft, setDraft] = useState("");

  function sendMessage() {
    const text = draft.trim();
    if (!text) return;
    setMessages((prev) => [
      ...prev,
      {
        id: prev.length ? prev[prev.length - 1].id + 1 : 1,
        sender: CURRENT_USER.nickname,
        text,
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        color: colorForName(CURRENT_USER.nickname),
      },
    ]);
    setDraft("");
  }

  return (
    <AppShell>
      <div className="bg-cyber-grid relative flex min-h-0 min-w-0 flex-1 flex-col bg-gradient-to-b from-bg-main to-bg-nav p-6">
        <header className="animate-fade-in-up mb-5 flex items-center justify-between rounded-2xl border border-bg-input bg-bg-panel px-6 py-4 shadow-[0_0_25px_-12px_var(--border-glow)]">
          <div>
            <h1 className="text-lg font-bold tracking-tight">
              <span className="bg-gradient-to-r from-accent to-green bg-clip-text text-transparent"># Global</span>
            </h1>
            <p className="text-xs text-text-muted">Signed in as {CURRENT_USER.nickname} · OWNER</p>
          </div>
          <button className="rounded-full border border-green px-4 py-2 text-xs font-bold text-green transition-all duration-200 hover:scale-105 hover:bg-green/10">
            INVITE USER
          </button>
        </header>

        <div className="flex-1 space-y-3 overflow-y-auto pr-2">
          {messages.map((m) => (
            <div key={m.id} className="animate-fade-in-up flex items-start gap-3 rounded-lg">
              <div
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-black text-bg-nav"
                style={{ backgroundColor: m.color }}
              >
                {m.sender.slice(0, 1).toUpperCase()}
              </div>
              <div className="flex max-w-[720px] flex-col items-start">
                <div className="mb-1 flex items-center gap-2 px-1 text-xs">
                  <span className="font-bold" style={{ color: m.color }}>
                    {m.sender}
                  </span>
                  <span className="text-text-muted">{m.time}</span>
                </div>
                <div
                  className={`rounded-2xl px-4 py-2.5 text-sm ${
                    m.sender === CURRENT_USER.nickname
                      ? "border border-accent/30 bg-bg-panel shadow-[0_0_18px_-10px_var(--border-glow)]"
                      : "bg-bubble-other"
                  }`}
                >
                  {m.text}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-2">
          <div className="flex items-end gap-3 rounded-2xl border border-accent bg-bg-panel px-5 py-3 shadow-[0_0_25px_-12px_var(--border-glow)] transition-shadow duration-300 focus-within:shadow-[0_0_35px_-8px_var(--border-glow)]">
            <button className="shrink-0 rounded-full border border-bg-input p-2 text-base transition-all duration-200 hover:scale-110 hover:border-accent hover:bg-bg-input">
              📎
            </button>
            <textarea
              rows={1}
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  sendMessage();
                }
              }}
              placeholder="Type a message...  ·  Shift+Enter for a new line"
              className="max-h-40 flex-1 resize-none bg-transparent text-sm outline-none placeholder:text-text-muted"
            />
            <button
              onClick={sendMessage}
              className="shrink-0 rounded-full bg-accent-hover px-5 py-2 text-sm font-bold text-bg-nav shadow-[0_0_20px_-6px_var(--accent)] transition-all duration-200 hover:scale-105 hover:bg-accent"
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
