"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CURRENT_USER } from "@/lib/appData";

const NAV_ITEMS = [
  { href: "/chat", icon: "💬", label: "Chat" },
  { href: "/directory", icon: "👥", label: "Directory" },
  { href: "/streams", icon: "📡", label: "Streams" },
];

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="flex h-screen w-full overflow-hidden bg-bg-main">
      <nav className="relative flex w-[64px] shrink-0 flex-col items-center border-r border-white/5 bg-gradient-to-b from-bg-nav via-bg-nav to-bg-panel py-4 sm:w-[90px] sm:py-8">
        <div
          className="pointer-events-none absolute inset-y-0 right-0 w-px bg-gradient-to-b from-transparent via-accent/40 to-transparent"
          aria-hidden="true"
        />

        <Link
          href="/"
          title="Back to ShadowHub"
          className="animate-float mb-5 text-xl text-accent drop-shadow-[0_0_10px_var(--accent)] transition-transform hover:scale-110 sm:mb-7 sm:text-2xl"
        >
          ⚡
        </Link>

        <Link
          href="/"
          className="group relative mb-5 flex h-[42px] w-[42px] items-center justify-center rounded-full border-2 border-accent bg-bg-input text-lg shadow-[0_0_16px_-6px_var(--accent)] transition-all duration-200 hover:scale-110 hover:shadow-[0_0_22px_-4px_var(--accent)] sm:mb-6 sm:h-[54px] sm:w-[54px] sm:text-xl"
          title={`${CURRENT_USER.nickname} · Back to ShadowHub`}
        >
          👤
        </Link>

        <div className="flex flex-col items-center gap-2 sm:gap-2.5">
          {NAV_ITEMS.map((item) => {
            const active = pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                title={item.label}
                className={`relative flex h-[42px] w-[42px] items-center justify-center rounded-xl text-lg transition-all duration-200 hover:scale-110 hover:bg-white/5 sm:h-[54px] sm:w-[54px] sm:text-2xl ${
                  active ? "bg-accent/10 text-accent shadow-[0_0_18px_-6px_var(--accent)]" : "text-text-main/90"
                }`}
              >
                {active && (
                  <span
                    className="absolute left-[-13px] hidden h-5 w-1 rounded-full bg-accent shadow-[0_0_8px_var(--accent)] sm:block"
                    aria-hidden="true"
                  />
                )}
                {item.icon}
              </Link>
            );
          })}
        </div>

        <Link
          href="/"
          title="Sign out"
          className="mt-auto flex h-[36px] w-[36px] items-center justify-center rounded-xl text-lg text-text-muted transition-all duration-200 hover:scale-110 hover:bg-white/5 sm:h-[44px] sm:w-[44px] sm:text-xl"
        >
          ⏻
        </Link>
      </nav>

      <main className="flex min-h-0 min-w-0 flex-1 flex-col">{children}</main>
    </div>
  );
}
