import { NextResponse } from "next/server";
import { getMuxClient } from "@/lib/mux/client";

export async function GET() {
  try {
    const mux = getMuxClient();
    const assets = await mux.video.assets.list();

    const items = [];
    for await (const asset of assets) {
      items.push({
        id: asset.id,
        status: asset.status,
        duration: asset.duration,
        created_at: asset.created_at,
        playback_ids: asset.playback_ids,
        passthrough: asset.passthrough,
        aspect_ratio: asset.aspect_ratio,
      });
    }

    return NextResponse.json({ assets: items });
  } catch (err) {
    console.error("Mux list assets error:", err);
    return NextResponse.json(
      { error: "Failed to list assets" },
      { status: 500 }
    );
  }
}
