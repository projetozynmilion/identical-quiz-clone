import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";

type SettingsMap = Record<string, any>;

let cache: SettingsMap | null = null;
const listeners = new Set<(s: SettingsMap) => void>();

async function load() {
  const { data } = await supabase.from("site_settings").select("key,value");
  const map: SettingsMap = {};
  (data || []).forEach((r: any) => { map[r.key] = r.value; });
  cache = map;
  listeners.forEach((l) => l(map));
  return map;
}

export function useSiteSettings() {
  const [settings, setSettings] = useState<SettingsMap>(cache || {});
  useEffect(() => {
    listeners.add(setSettings);
    if (!cache) void load();
    return () => { listeners.delete(setSettings); };
  }, []);
  const refresh = useCallback(() => load(), []);
  const get = useCallback(
    (key: string, fallback?: string): string => {
      const v = settings?.[key];
      if (v && typeof v === "object" && typeof v.url === "string" && v.url) return v.url;
      if (typeof v === "string" && v) return v;
      return fallback || "";
    },
    [settings],
  );
  return { settings, get, refresh };
}

export async function setSiteSetting(key: string, value: any) {
  const { error } = await supabase.from("site_settings").upsert({ key, value });
  if (error) throw error;
  await load();
}
