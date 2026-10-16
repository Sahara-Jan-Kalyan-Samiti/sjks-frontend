"use client";

import { useEffect, useState } from "react";
import { defaultPosts, type BlogPost } from "@/data/content/blog";
import { BLOG_COLUMNS } from "@/services/blog";
import { supabase, supabaseConfigured } from "@/services/supabase";

/** Posts already loaded in this visit, so going from the Blog page into a post does not wait again. */
let cache: BlogPost[] | null = null;

/**
 * Published posts from the admin panel (table blog_posts), newest first. `posts` is null while loading.
 * `initial` are the posts the server already rendered into the page: they are shown at once and refreshed in the browser.
 * Falls back to the post in src/data/content/blog.ts only when the database cannot be reached.
 */
export function useBlogPosts(initial?: BlogPost[]): BlogPost[] | null {
  const [posts, setPosts] = useState<BlogPost[] | null>(initial ?? cache ?? (supabaseConfigured && supabase ? null : defaultPosts));
  useEffect(() => {
    if (!supabaseConfigured || !supabase) return;
    let alive = true;
    supabase
      .from("blog_posts")
      .select(BLOG_COLUMNS)
      .eq("published", true)
      .order("published_on", { ascending: false })
      .order("id", { ascending: false })
      .then(({ data, error }) => {
        const next = error || !data ? (cache ?? initial ?? defaultPosts) : (data as BlogPost[]);
        if (!error && data) cache = data as BlogPost[];
        if (alive) setPosts(next);
      });
    return () => {
      alive = false;
    };
  }, [initial]);
  return posts;
}
