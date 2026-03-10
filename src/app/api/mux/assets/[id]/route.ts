import { NextResponse } from "next/server";
import { getMuxClient } from "@/lib/mux/client";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const mux = getMuxClient();
    const asset = await mux.video.assets.retrieve(id);

    return NextResponse.json({
      id: asset.id,
      status: asset.status,
      duration: asset.duration,
      created_at: asset.created_at,
      playback_ids: asset.playback_ids,
      passthrough: asset.passthrough,
      aspect_ratio: asset.aspect_ratio,
    });
  } catch (err) {
    console.error("Mux get asset error:", err);
    return NextResponse.json(
      { error: "Failed to get asset" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const mux = getMuxClient();
    await mux.video.assets.delete(id);

    return NextResponse.json({ deleted: true });
  } catch (err) {
    console.error("Mux delete asset error:", err);
    return NextResponse.json(
      { error: "Failed to delete asset" },
      { status: 500 }
    );
  }
}
