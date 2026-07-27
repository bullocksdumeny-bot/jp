import { NextResponse } from "next/server";

import { getDailyDiagnosis } from "@/lib/daily-analysis";

export const runtime = "nodejs";

export async function GET() {
  try {
    return NextResponse.json(await getDailyDiagnosis());
  } catch (error) {
    console.error("Failed to create daily diagnosis", error);
    return NextResponse.json(
      { error: "今日诊断暂时不可用，请稍后重试" },
      { status: 502 },
    );
  }
}
