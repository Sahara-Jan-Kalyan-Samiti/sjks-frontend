import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

/** For uptime checks and the Cloud Run health probe: answers 200 while the server is running. */
export function GET() {
  return NextResponse.json({ status: "ok", time: new Date().toISOString() }, { headers: { "Cache-Control": "no-store" } });
}
