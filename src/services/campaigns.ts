import { createClient } from "@supabase/supabase-js";
import { toCampaign, type CampaignPage } from "@/data/content/campaigns";
import { env } from "@/lib/env";

/**
 * Published campaigns from the admin panel (table campaigns), in the order set there.
 * Runs on the server so each campaign page has its own title, description and share image, and its text is in the HTML.
 * "*" on purpose: the newer columns do not exist until the latest migration is applied, and the page must work before that.
 * Returns null when the database is not configured or cannot be reached; the browser then loads the campaigns itself.
 */
export async function fetchPublishedCampaigns(): Promise<CampaignPage[] | null> {
  if (!env.supabaseUrl || !env.supabaseKey) return null;
  try {
    const db = createClient(env.supabaseUrl, env.supabaseKey, { auth: { persistSession: false, autoRefreshToken: false } });
    const { data, error } = await db
      .from("campaigns")
      .select("*")
      .eq("published", true)
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: false });
    return error || !data ? null : (data as Record<string, unknown>[]).map(toCampaign).filter((c) => c.slug && c.title);
  } catch {
    return null;
  }
}
