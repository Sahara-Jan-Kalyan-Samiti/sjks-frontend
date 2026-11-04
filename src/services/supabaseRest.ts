import { env } from "@/lib/env";

/**
 * Read-only access to published rows, straight over the Supabase REST API (PostgREST) with fetch.
 * The site header, page texts and live data only ever read a few public tables, and the full Supabase client (auth, realtime,
 * storage: about 50 KB) was downloaded on every page for that. Row Level Security decides what the publishable key may read,
 * exactly as with the client. Pages that log in or write keep using ./supabase.
 */
const url = env.supabaseUrl.replace(/\/$/, "");
const key = env.supabaseKey;

/** Same meaning as `supabaseConfigured` in ./supabase, but without pulling the Supabase client into the page. */
export const supabaseConfigured = Boolean(url && key);

/** New-format keys (sb_publishable_…, sb_secret_…) are not JWTs and go only in the apikey header (same rule as supabase-js). */
const isNewApiKey = (k: string) => k.startsWith("sb_publishable_") || k.startsWith("sb_secret_");

export function restHeaders(apiKey = key): Record<string, string> {
  return isNewApiKey(apiKey) ? { apikey: apiKey } : { apikey: apiKey, Authorization: `Bearer ${apiKey}` };
}

/**
 * Address of a REST query. `params` are PostgREST query parameters, for example
 * `{ select: "id, title", published: "eq.true", order: "sort_order,created_at.desc" }`.
 */
export function restUrl(table: string, params: Record<string, string>, base = url): string {
  return `${base}/rest/v1/${encodeURIComponent(table)}?${new URLSearchParams(params)}`;
}

/** Public address of a file in a public storage bucket (same as supabase.storage.from(bucket).getPublicUrl(path)). */
export function publicStorageUrl(bucket: string, path: string, base = url): string {
  return encodeURI(`${base}/storage/v1/object/public/${bucket}/${path.replace(/^\/+/, "")}`);
}

/** The first query waits until the browser is idle: the first screen does not need these rows (they only replace built-in defaults). */
let idle: Promise<void> | null = null;
const whenIdle = () =>
  (idle ??= new Promise<void>((resolve) => {
    if (typeof window.requestIdleCallback === "function") window.requestIdleCallback(() => resolve(), { timeout: 2500 });
    else window.setTimeout(resolve, 1500);
  }));

export type RestResult<T> = { data: T[]; error: null } | { data: null; error: Error };

/** Rows of `table` matching `params`. Never throws: a missing configuration, network error or error status comes back as `error`. */
export async function restSelect<T>(table: string, params: Record<string, string>): Promise<RestResult<T>> {
  if (!supabaseConfigured || typeof window === "undefined") return { data: null, error: new Error("Supabase is not configured") };
  await whenIdle();
  try {
    const res = await fetch(restUrl(table, params), { headers: restHeaders(), cache: "no-store" });
    if (!res.ok) return { data: null, error: new Error(`${table}: HTTP ${res.status}`) };
    const data = (await res.json()) as unknown;
    return Array.isArray(data) ? { data: data as T[], error: null } : { data: null, error: new Error(`${table}: unexpected answer`) };
  } catch (e) {
    return { data: null, error: e instanceof Error ? e : new Error(String(e)) };
  }
}
