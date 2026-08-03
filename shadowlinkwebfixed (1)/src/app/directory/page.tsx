"use client";

import { useState } from "react";
import AppShell from "@/components/AppShell";
import { DIRECTORY_USERS } from "@/lib/appData";

export default function DirectoryPage() {
  const [spinning, setSpinning] = useState(false);

  function refresh() {
    setSpinning(true);
    setTimeout(() => setSpinning(false), 500);
  }

  return (
    <AppShell>
      <div className="bg-ambient flex-1 overflow-y-auto p-6 sm:p-10">
        <div className="mx-auto max-w-4xl">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h1 className="text-gradient-accent text-3xl font-black tracking-tight">👥 USER DIRECTORY</h1>
              <p className="mt-1 text-xs font-bold uppercase tracking-widest text-text-muted">
                {DIRECTORY_USERS.length} registered {DIRECTORY_USERS.length === 1 ? "user" : "users"}
              </p>
            </div>
            <button
              onClick={refresh}
              className="rounded-full border border-accent bg-bg-input px-4 py-2 text-xs font-bold text-accent transition-all duration-200 hover:scale-105 hover:bg-accent/10 sm:text-sm"
            >
              <span className={spinning ? "inline-block animate-spin-slow" : "inline-block"}>🔄</span> REFRESH LIST
            </button>
          </div>

          <div className="animate-fade-in-up overflow-hidden rounded-2xl border border-bg-input bg-bg-panel shadow-[0_0_40px_-24px_var(--border-glow)]">
            <div className="flex items-center justify-between border-b border-bg-panel bg-bg-input px-6 py-3 text-[10px] font-bold uppercase tracking-widest text-accent sm:text-xs">
              <span>Username</span>
              <div className="flex items-center gap-6">
                <span>ShadowCredits</span>
                <span>Subscribers</span>
                <span>Status</span>
              </div>
            </div>
            {DIRECTORY_USERS.map((u, i) => {
              let label = `👤 ${u.nickname}`;
              let color = "text-text-main";
              if (u.role === "owner") {
                label = `👑 ${u.nickname.toUpperCase()} (OWNER)`;
                color = "text-accent";
              } else if (u.role === "admin") {
                label = `🛡️ ${u.nickname} (ADMIN)`;
                color = "text-gold";
              }
              return (
                <div
                  key={u.nickname}
                  style={{ animationDelay: `${Math.min(i, 12) * 25}ms` }}
                  className="animate-fade-in flex items-center justify-between border-b border-bg-input px-6 py-3 transition-colors last:border-b-0 hover:bg-white/[0.03]"
                >
                  <span className={`text-sm font-bold ${color}`}>{label}</span>
                  <div className="flex items-center gap-6">
                    <span className="flex items-center gap-1 rounded-full border border-gold/30 bg-gold/10 px-2.5 py-1 text-xs font-bold text-gold">
                      💳 {u.credits.toLocaleString()}
                    </span>
                    <span className="flex items-center gap-1 rounded-full border border-accent/30 bg-accent/10 px-2.5 py-1 text-xs font-bold text-accent">
                      🔔 {u.subscribers.toLocaleString()}
                    </span>
                    <span className={`flex items-center gap-1.5 text-xs font-bold ${u.online ? "text-green" : "text-text-muted"}`}>
                      <span className={`inline-block h-1.5 w-1.5 rounded-full ${u.online ? "animate-pulse-glow bg-green" : "bg-text-muted"}`} />
                      {u.online ? "ONLINE" : "OFFLINE"}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </AppShell>
  );
}
