import { createClient } from "@supabase/supabase-js";
import type { BlogPost } from "@/data/content/blog";
import { env } from "@/lib/env";

export const BLOG_COLUMNS = "id, slug, title, category, author, excerpt, body, cover_url, photo_url, photo_caption, published_on";

/**
 * Published blog posts from the admin panel (table blog_posts), newest first.
 * Runs on the server so each post can have its own title, description and share image, and so its text is in the HTML.
 * Returns null when the database is not configured or cannot be reached; the browser then loads the posts (or uses the built-in one).
 */
export async function fetchPublishedPosts(): Promise<BlogPost[] | null> {
  if (!env.supabaseUrl || !env.supabaseKey) return null;
  try {
    const db = createClient(env.supabaseUrl, env.supabaseKey, { auth: { persistSession: false, autoRefreshToken: false } });
    const { data, error } = await db
      .from("blog_posts")
      .select(BLOG_COLUMNS)
      .eq("published", true)
      .order("published_on", { ascending: false })
      .order("id", { ascending: false });
    return error || !data ? null : (data as BlogPost[]);
  } catch {
    return null;
  }
}
