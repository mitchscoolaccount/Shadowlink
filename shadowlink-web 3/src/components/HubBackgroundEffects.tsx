"use client";

import { useEffect, useState } from "react";

// ShadowHub is the very first thing anyone sees after signing in, so it
// gets the same "alive" background treatment as the pre-launch countdown
// screen (CountdownClient.tsx's OrbField/SparkField/ScanlineSweep) - a
// deliberately separate copy rather than a shared import, so this can be
// tuned independently without touching that already-shipped, unrelated
// screen. All three respect the existing Settings > Appearance controls
// for free: the .animate-* keyframes they use already back off under
// prefers-reduced-motion / Reduce Motion (see globals.css), and
// .bg-ambient already disables itself under Background Effects off.

const SPARK_COUNT = 10;
const SPARKS = Array.from({ length: SPARK_COUNT }, (_, i) => ({
  id: i,
  left: `${5 + Math.random() * 90}%`,
  dx: `${(Math.random() - 0.5) * 90}px`,
  duration: `${8 + Math.random() * 7}s`,
  delay: `${Math.random() * -14}s`,
  size: 2 + Math.random() * 4,
}));

// Random per-viewer values would mismatch between server and client
// render and trigger a hydration warning - rendered only once mounted
// client-side, same fix as CountdownClient's SparkField.
function SparkField() {
  const [mounted, setMounted] = useState(false);
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  return (
    <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
      {SPARKS.map((s) => (
        <span
          key={s.id}
          className="animate-spark-drift absolute bottom-0 rounded-full bg-accent"
          style={{
            width: s.size,
            height: s.size,
            boxShadow: "0 0 6px 1px var(--accent)",
            ["--left" as string]: s.left,
            ["--dx" as string]: s.dx,
            ["--duration" as string]: s.duration,
            ["--delay" as string]: s.delay,
          }}
        />
      ))}
    </div>
  );
}

const ORBS = [
  { left: "12%", top: "8%", color: "var(--accent)", x1: "0px", y1: "0px", x2: "50px", y2: "70px", duration: "18s", delay: "0s" },
  { left: "82%", top: "18%", color: "var(--purple)", x1: "0px", y1: "0px", x2: "-60px", y2: "40px", duration: "22s", delay: "-7s" },
  { left: "70%", top: "78%", color: "var(--gold)", x1: "0px", y1: "0px", x2: "-30px", y2: "-60px", duration: "20s", delay: "-13s" },
  { left: "22%", top: "82%", color: "var(--purple)", x1: "0px", y1: "0px", x2: "40px", y2: "-40px", duration: "24s", delay: "-4s" },
];

function OrbField() {
  return (
    <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
      {ORBS.map((o, i) => (
        <div
          key={i}
          className="animate-orb-drift absolute h-72 w-72 rounded-full opacity-[0.16] blur-3xl"
          style={{
            left: o.left,
            top: o.top,
            background: o.color,
            ["--x1" as string]: o.x1,
            ["--y1" as string]: o.y1,
            ["--x2" as string]: o.x2,
            ["--y2" as string]: o.y2,
            ["--duration" as string]: o.duration,
            ["--delay" as string]: o.delay,
          }}
        />
      ))}
    </div>
  );
}

function ScanlineSweep() {
  return (
    <div
      className="animate-scanline pointer-events-none absolute inset-x-0 top-0 z-0 h-32 opacity-[0.05]"
      style={{ background: "linear-gradient(to bottom, transparent, var(--accent), transparent)" }}
    />
  );
}

export default function HubBackgroundEffects() {
  return (
    <>
      <OrbField />
      <SparkField />
      <ScanlineSweep />
    </>
  );
}
