"use client";

import Link from "next/link";
import { useState } from "react";
import HubBackgroundEffects from "@/components/HubBackgroundEffects";
import { CREDIT_BALANCE, CURRENT_USER } from "@/lib/appData";

interface HubCard {
  href?: string;
  icon: string;
  title: string;
  description: string;
  badge: string;
  badgeTone: "accent" | "muted";
  onComingSoon?: boolean;
}

const CARDS: HubCard[] = [
  { icon: "🎮", title: "Gaming", description: "Play, compete, and climb the ranks.", badge: "3 GAMES", badgeTone: "accent", onComingSoon: true },
  { href: "/chat", icon: "🔗", title: "Shadowlink", description: "Chat, DMs, the directory, and more.", badge: "FULL APP", badgeTone: "accent" },
  { icon: "💎", title: "Store", description: "Browse rewards and upgrades.", badge: "COMING SOON", badgeTone: "muted", onComingSoon: true },
  { href: "/streams", icon: "📡", title: "Stream", description: "Watch live community content.", badge: "LIVE", badgeTone: "accent" },
  { icon: "⚙️", title: "Settings", description: "Profile, theme, and notifications.", badge: "ACCOUNT", badgeTone: "muted", onComingSoon: true },
];

export default function ShadowHubPage() {
  const [toast, setToast] = useState<string | null>(null);

  function showToast(message: string) {
    setToast(message);
    setTimeout(() => setToast((prev) => (prev === message ? null : prev)), 2600);
  }

  return (
    <div className="bg-ambient relative min-h-screen flex-1 overflow-hidden">
      <HubBackgroundEffects />

      <div className="relative z-10 mx-auto max-w-6xl px-6 py-10 sm:px-10 sm:py-14">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="animate-fade-in-up">
            <h1 className="text-gradient-accent text-4xl font-black tracking-tight drop-shadow-[0_0_35px_rgba(0,240,255,0.25)] sm:text-6xl">
              shadow hub
            </h1>
            <p className="mt-2 text-sm font-bold text-text-muted">
              Welcome back, <span style={{ color: "var(--accent)" }}>{CURRENT_USER.nickname}</span> · {CURRENT_USER.role.toUpperCase()}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              title="Settings"
              onClick={() => showToast("Settings")}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-bg-panel/60 text-lg text-text-muted backdrop-blur-sm transition-all duration-200 hover:scale-110 hover:border-accent/50 hover:text-accent"
            >
              👤
            </button>
            <Link
              href="/"
              title="Sign out"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-bg-panel/60 text-lg text-text-muted backdrop-blur-sm transition-all duration-200 hover:scale-110 hover:border-red/50 hover:bg-red/10 hover:text-red"
            >
              ⏻
            </Link>
          </div>
        </div>

        <div
          className="animate-fade-in-up mt-8 inline-flex flex-col rounded-2xl border border-bg-input bg-bg-panel/80 px-6 py-4 shadow-[0_0_40px_-16px_var(--accent)] backdrop-blur-md"
          style={{ animationDelay: "80ms" }}
        >
          <span className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-text-muted">
            <span className="text-accent">✦</span> Balance
          </span>
          <span className="mt-1 text-4xl font-black text-text-main">
            {CREDIT_BALANCE.toLocaleString()} <span className="text-2xl font-black text-accent">credits</span>
          </span>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {CARDS.map((card, i) => {
            const inner = (
              <>
                <div className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-br from-accent/0 via-accent/0 to-accent/0 opacity-0 transition-opacity duration-300 group-hover:from-accent/5 group-hover:via-transparent group-hover:to-purple/10 group-hover:opacity-100" />
                <div className="relative flex items-start justify-between">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-accent/10 text-3xl shadow-[0_0_20px_-8px_var(--accent)] transition-transform duration-300 group-hover:scale-110">
                    {card.icon}
                  </div>
                  <span
                    className={`rounded-full px-2.5 py-1 text-[10px] font-black uppercase tracking-widest ${
                      card.badgeTone === "accent" ? "bg-accent/15 text-accent" : "bg-white/5 text-text-muted"
                    }`}
                  >
                    {card.badge}
                  </span>
                </div>
                <h2 className="relative mt-6 text-xl font-black text-text-main">{card.title}</h2>
                <p className="relative mt-1.5 text-sm text-text-muted">{card.description}</p>
                <span className="relative mt-6 flex h-8 w-8 items-center justify-center rounded-full border border-accent/40 text-accent transition-transform duration-200 group-hover:translate-x-1">
                  →
                </span>
              </>
            );

            const className =
              "group animate-fade-in-up relative flex flex-col overflow-hidden rounded-2xl border border-bg-input bg-bg-panel/90 p-6 shadow-[0_0_30px_-20px_var(--border-glow)] backdrop-blur-sm transition-all duration-200 hover:-translate-y-1 hover:border-accent hover:shadow-[0_0_45px_-14px_var(--accent)]";
            const style = { animationDelay: `${150 + i * 60}ms` };

            if (card.onComingSoon) {
              return (
                <button key={card.title} onClick={() => showToast(card.title)} className={`${className} text-left`} style={style}>
                  {inner}
                </button>
              );
            }

            return (
              <Link key={card.title} href={card.href!} className={className} style={style}>
                {inner}
              </Link>
            );
          })}
        </div>
      </div>

      {toast && (
        <div className="animate-fade-in-up fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-full border border-accent bg-bg-panel px-5 py-2.5 text-sm font-bold text-text-main shadow-[0_0_30px_-10px_var(--accent)]">
          {toast}
        </div>
      )}
    </div>
  );
}
