import { NextResponse } from "next/server";
import { getMuxClient, MUX_ASSET_TTL_MS } from "@/lib/mux/client";

/**
 * Cron endpoint: deletes Mux assets older than 30 days.
 * Configured in vercel.json to run daily.
 */
export async function GET(request: Request) {
  // Verify cron secret to prevent unauthorized calls
  const authHeader = request.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;

  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const mux = getMuxClient();
    const assets = await mux.video.assets.list();
    const cutoff = Date.now() - MUX_ASSET_TTL_MS;
    let deleted = 0;

    for await (const asset of assets) {
      // Check created_at timestamp (Unix epoch string)
      const createdMs = Number(asset.created_at) * 1000;
      if (createdMs < cutoff) {
        try {
          await mux.video.assets.delete(asset.id);
          deleted++;
        } catch (err) {
          console.error(`Failed to delete asset ${asset.id}:`, err);
        }
      }
    }

    return NextResponse.json({
      message: `Cleanup complete. Deleted ${deleted} expired asset(s).`,
      deleted,
    });
  } catch (err) {
    console.error("Mux cleanup error:", err);
    return NextResponse.json(
      { error: "Cleanup failed" },
      { status: 500 }
    );
  }
}
