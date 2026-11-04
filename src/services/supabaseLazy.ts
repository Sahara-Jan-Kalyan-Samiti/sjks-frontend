import type { SupabaseClient } from "@supabase/supabase-js";
import { env } from "@/lib/env";

/** Same meaning as `supabaseConfigured` in ./supabase, but without pulling the Supabase code into the page. */
export const supabaseConfigured = Boolean(env.supabaseUrl && env.supabaseKey);

let client: Promise<SupabaseClient | null> | null = null;

/**
 * The Supabase client, loaded on demand. The Supabase code is large and the first screen does not need it (the live texts, events and
 * ticker only replace built-in defaults), so it is downloaded once the browser is idle instead of during the first load.
 * Resolves to null when Supabase is not configured. Pages that need the client straight away can keep importing ./supabase.
 */
export function getSupabase(): Promise<SupabaseClient | null> {
  if (!supabaseConfigured || typeof window === "undefined") return Promise.resolve(null);
  client ??= new Promise<void>((resolve) => {
    if (typeof window.requestIdleCallback === "function") window.requestIdleCallback(() => resolve(), { timeout: 2500 });
    else window.setTimeout(resolve, 1500);
  }).then(() => import("./supabase").then((m) => m.supabase));
  return client;
}
