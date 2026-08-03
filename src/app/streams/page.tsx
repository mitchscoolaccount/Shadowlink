"use client";

import { useState } from "react";
import AppShell from "@/components/AppShell";
import { LIVE_STREAMS } from "@/lib/appData";

export default function StreamsPage() {
  const [toast, setToast] = useState(false);

  function startStreaming() {
    setToast(true);
    setTimeout(() => setToast(false), 2200);
  }

  return (
    <AppShell>
      <div className="bg-ambient relative flex-1 overflow-y-auto p-6 sm:p-10">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-gradient-accent text-3xl font-black tracking-tight">📡 SHADOWSTREAM</h1>
            <p className="mt-1 text-xs font-bold uppercase tracking-widest text-text-muted">
              {LIVE_STREAMS.length} live {LIVE_STREAMS.length === 1 ? "stream" : "streams"} right now
            </p>
          </div>
          <button
            onClick={startStreaming}
            className="rounded-full bg-accent px-5 py-2.5 text-sm font-bold text-bg-nav shadow-[0_0_20px_-6px_var(--accent)] transition-all duration-200 hover:scale-105 hover:bg-accent-hover"
          >
            ▶️ START STREAMING
          </button>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {LIVE_STREAMS.map((s, i) => (
            <div
              key={s.nickname}
              style={{ animationDelay: `${Math.min(i, 12) * 40}ms` }}
              className="card-hover animate-fade-in-up overflow-hidden rounded-2xl border border-bg-input bg-bg-panel"
            >
              <div className="relative flex aspect-video items-center justify-center overflow-hidden bg-gradient-to-br from-bg-input to-bg-panel-soft text-4xl">
                <span>{s.viaScreen ? "🖥️" : "📷"}</span>
                <span className="absolute right-2.5 top-2.5 flex items-center gap-1 rounded-full bg-red px-2 py-0.5 text-[10px] font-bold text-text-main shadow-[0_0_12px_-2px_var(--red)]">
                  <span className="inline-block h-1.5 w-1.5 rounded-full bg-text-main animate-pulse-glow" />
                  LIVE · {s.duration}
                </span>
              </div>
              <div className="p-4">
                <span className="truncate text-sm font-bold text-text-main">{s.nickname}</span>
                <p className="mt-0.5 truncate text-xs text-text-muted">{s.title}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {toast && (
        <div className="animate-fade-in-up fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-full border border-accent bg-bg-panel px-5 py-2.5 text-sm font-bold text-text-main shadow-[0_0_30px_-10px_var(--accent)]">
          Starting stream...
        </div>
      )}
    </AppShell>
  );
}
