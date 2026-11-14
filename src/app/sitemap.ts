import type { MetadataRoute } from "next";
import { pageSeo } from "@/config/seo";
import { projects } from "@/data/content/content";
import { posts as news } from "@/data/content/news";
import { env } from "@/lib/env";
import { fetchPublishedPosts } from "@/services/blog";
import { fetchPublishedCampaigns } from "@/services/campaigns";

export const revalidate = 3600;

/** Every public address of the website, for search engines (/sitemap.xml). */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const url = (path: string) => `${env.siteUrl}${path === "/" ? "" : path}`;
  const blog = (await fetchPublishedPosts()) ?? [];
  const campaigns = (await fetchPublishedCampaigns()) ?? [];
  return [
    ...Object.keys(pageSeo).map((path) => ({ url: url(path), changeFrequency: "monthly" as const, priority: path === "/" ? 1 : 0.7 })),
    ...projects.map((p) => ({ url: url(`/projects/${p.slug}`), changeFrequency: "monthly" as const, priority: 0.7 })),
    ...news.map((p) => ({ url: url(`/news/${p.slug}`), lastModified: p.date, changeFrequency: "yearly" as const, priority: 0.6 })),
    ...blog.map((p) => ({ url: url(`/blog/${p.slug}`), lastModified: p.published_on, changeFrequency: "yearly" as const, priority: 0.6 })),
    ...campaigns.map((c) => ({ url: url(`/campaigns/${c.slug}`), changeFrequency: "weekly" as const, priority: 0.8 }))
  ];
}
