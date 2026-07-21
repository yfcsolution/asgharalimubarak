import { NextResponse } from "next/server";

import { probeWordPressApi } from "@/lib/wordpress-api";

export const dynamic = "force-dynamic";

export async function GET() {
  const health = await probeWordPressApi();

  return NextResponse.json(health, {
    headers: {
      "Cache-Control": "no-store",
    },
  });
}
