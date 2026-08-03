import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// TEMPORARY DEBUG VERSION - includes the real error (if any) in the
// response body and Vercel's function logs, so we can see exactly why
// an insert might be failing. Revert to the quiet version once logging
// is confirmed working - a real visitor should never see error details.
async function logAndReject(req: NextRequest) {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    return NextResponse.json({ error: "Not found", debug: "SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY is not set" }, { status: 404 });
  }

  try {
    const supabase = createClient(url, key);
    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
      req.headers.get("x-real-ip") ??
      "unknown";
    const rawCity = req.headers.get("x-vercel-ip-city");
    const { error } = await supabase.from("access_attempts").insert({
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
    if (error) {
      console.error("[honeypot] insert failed:", error);
      return NextResponse.json({ error: "Not found", debug: error.message }, { status: 404 });
    }
    return NextResponse.json({ error: "Not found", debug: "logged ok" }, { status: 404 });
  } catch (err) {
    console.error("[honeypot] unexpected error:", err);
    return NextResponse.json({ error: "Not found", debug: String(err) }, { status: 404 });
  }
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
