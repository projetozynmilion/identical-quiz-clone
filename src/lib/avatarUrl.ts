import { supabase } from "@/integrations/supabase/client";

const TTL = 60 * 60; // 1h
const cache = new Map<string, { url: string; exp: number }>();

/**
 * Resolves an avatar value to a usable <img src>.
 * - If empty: returns null
 * - If starts with http(s) or data:: returns as-is (legacy URLs)
 * - Otherwise treats it as a storage path inside the "avatars" bucket
 *   and returns a signed URL (cached for 1h).
 */
export async function resolveAvatarUrl(value: string | null | undefined): Promise<string | null> {
  if (!value) return null;
  if (/^(https?:|data:)/i.test(value)) return value;
  const now = Date.now();
  const hit = cache.get(value);
  if (hit && hit.exp > now + 60_000) return hit.url;
  const { data } = await supabase.storage.from("avatars").createSignedUrl(value, TTL);
  if (!data?.signedUrl) return null;
  cache.set(value, { url: data.signedUrl, exp: now + TTL * 1000 });
  return data.signedUrl;
}

export function bustAvatarCache(value?: string | null) {
  if (!value) { cache.clear(); return; }
  cache.delete(value);
}
