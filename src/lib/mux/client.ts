import Mux from "@mux/mux-node";

let muxClient: Mux | null = null;

export function getMuxClient(): Mux {
  if (muxClient) return muxClient;

  const tokenId = process.env.MUX_TOKEN_ID;
  const tokenSecret = process.env.MUX_TOKEN_SECRET;

  if (!tokenId || !tokenSecret) {
    throw new Error("MUX_TOKEN_ID and MUX_TOKEN_SECRET must be set");
  }

  muxClient = new Mux({ tokenId, tokenSecret });
  return muxClient;
}

/** Assets older than this (in ms) are auto-deleted */
export const MUX_ASSET_TTL_MS = 30 * 24 * 60 * 60 * 1000; // 30 days
