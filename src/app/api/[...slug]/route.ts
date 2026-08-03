import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Catch-all for every path under /api/* that isn't otherwise defined -
// there are no real API routes in this app, so anything landing here is
// someone (or something automated) probing for one. Logs the request
// (IP, location, method, path, user agent, referer) to a dedicated
// Supabase table via the service role key - server-side only, never
// exposed to the browser - then returns a plain 404 so it doesn't
// reveal it's being watched. No real app data lives here; this exists
// purely to see who's poking at it.
//
// Location comes from Vercel's own edge network, which stamps every
// request with x-vercel-ip-* headers before it ever reaches this
// function - no external geolocation API or extra dependency needed.
// These headers are only present on an actual Vercel deployment
// (production or preview), never in local dev.
async function logAndReject(req: NextRequest) {
  try {
    const url = process.env.SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (url && key) {
      const supabase = createClient(url, key);
      const ip =
        req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
        req.headers.get("x-real-ip") ??
        "unknown";
      const rawCity = req.headers.get("x-vercel-ip-city");
      await supabase.from("access_attempts").insert({
        ip,
        method: req.method,
        path: req.nextUrl.pathname,
        user_agent: req.headers.get("user-agent"),
        referer: req.headers.get("referer"),
        country: req.headers.get("x-vercel-ip-country"),
        region: req.headers.get("x-vercel-ip-country-region"),
        city: rawCity ? decodeURIComponent(rawCity) : null,
        latitude: req.headers.get("x-vercel-ip-latitude"),
        longitude: req.headers.get("x-vercel-ip-longitude"),
      });
    }
  } catch {
    // Never let logging itself break the response - a failed insert
    // (e.g. env vars not set yet) should still return a normal 404.
  }
  return NextResponse.json({ error: "Not found" }, { status: 404 });
}

export async function GET(req: NextRequest) {
  return logAndReject(req);
}
export async function POST(req: NextRequest) {
  return logAndReject(req);
}
export async function PUT(req: NextRequest) {
  return logAndReject(req);
}
export async function DELETE(req: NextRequest) {
  return logAndReject(req);
}
export async function PATCH(req: NextRequest) {
  return logAndReject(req);
}
