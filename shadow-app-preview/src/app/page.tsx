"use client";

import Link from "next/link";
import HubBackgroundEffects from "@/components/HubBackgroundEffects";
import { FAKE_BALANCE, FAKE_USER } from "@/lib/fakeData";

interface HubCard {
  href?: string;
  icon: string;
  title: string;
  description: string;
  badge: string;
  badgeTone: "accent" | "muted";
  disabled?: boolean;
}

const CARDS: HubCard[] = [
  { icon: "🎮", title: "Gaming", description: "Play, compete, and climb the ranks.", badge: "NOT IN PREVIEW", badgeTone: "muted", disabled: true },
  { href: "/chat", icon: "🔗", title: "Shadowlink", description: "Chat, DMs, the directory, and more.", badge: "FULL APP", badgeTone: "accent" },
  { icon: "💎", title: "Store", description: "Browse rewards and upgrades.", badge: "COMING SOON", badgeTone: "muted", disabled: true },
  { href: "/streams", icon: "📡", title: "Stream", description: "Watch live community content.", badge: "LIVE", badgeTone: "accent" },
  { icon: "⚙️", title: "Settings", description: "Profile, theme, and notifications.", badge: "NOT IN PREVIEW", badgeTone: "muted", disabled: true },
];

export default function ShadowHubPreview() {
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
              Welcome back, <span style={{ color: "var(--accent)" }}>{FAKE_USER.nickname}</span> · {FAKE_USER.role.toUpperCase()}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div
              title="Preview only"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-bg-panel/60 text-lg text-text-muted backdrop-blur-sm"
            >
              👤
            </div>
            <div
              title="Preview only"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-bg-panel/60 text-lg text-text-muted backdrop-blur-sm"
            >
              ⏻
            </div>
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
            {FAKE_BALANCE.toLocaleString()} <span className="text-2xl font-black text-accent">credits</span>
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

            if (card.disabled) {
              return (
                <div key={card.title} className={`${className} cursor-not-allowed opacity-70`} style={style}>
                  {inner}
                </div>
              );
            }

            return (
              <Link key={card.title} href={card.href!} className={className} style={style}>
                {inner}
              </Link>
            );
          })}
        </div>

        <p className="animate-fade-in-up mt-10 text-center text-xs text-text-muted" style={{ animationDelay: "450ms" }}>
          UI preview only - every user, message, and stream on this site is fabricated. Nothing is stored or sent anywhere.
        </p>
      </div>
    </div>
  );
}
