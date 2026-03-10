import { NextResponse } from "next/server";
import { getMuxClient } from "@/lib/mux/client";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const origin = request.headers.get("origin") || "*";

    const mux = getMuxClient();
    const upload = await mux.video.uploads.create({
      cors_origin: origin,
      timeout: 3600,
      new_asset_settings: {
        playback_policies: ["public"],
        video_quality: "basic",
        passthrough: JSON.stringify({
          uploaded_at: Date.now(),
          filename: body.filename || "untitled",
        }),
      },
    });

    return NextResponse.json({
      id: upload.id,
      url: upload.url,
    });
  } catch (err) {
    console.error("Mux upload create error:", err);
    return NextResponse.json(
      { error: "Failed to create upload" },
      { status: 500 }
    );
  }
}
