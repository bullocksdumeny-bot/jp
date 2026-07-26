import { NextResponse } from "next/server";

import { checkHealth } from "@/lib/health";
import { unauthorized } from "@/lib/session";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const denied = await unauthorized();
  if (denied) return denied;

  const health = await checkHealth();
  return NextResponse.json(health, { status: health.ok ? 200 : 503 });
}
