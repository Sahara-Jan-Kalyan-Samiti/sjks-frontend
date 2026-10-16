import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { safeUrl } from "@/data/content/blog";
import { fetchPublishedPosts } from "@/services/blog";
import { buildMetadata } from "@/lib/seo";
import BlogDetail from "@/features/blog/BlogDetail";

type Props = { params: { slug: string } };
const FALLBACK = "Stories, voices and lessons from the communities Sahara Jan Kalyan Samiti works with.";
/** New posts from the admin panel show within a minute without a new build. */
export const revalidate = 60;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = (await fetchPublishedPosts())?.find((p) => p.slug === params.slug);
  // when the database cannot be reached the page still opens: the browser loads the post itself
  if (!post) return buildMetadata({ title: "Blog", description: FALLBACK, path: `/blog/${params.slug}` });
  return buildMetadata({ title: post.title, description: post.excerpt || FALLBACK, path: `/blog/${post.slug}`, image: safeUrl(post.cover_url) ?? undefined, type: "article" });
}

export default async function BlogPostPage({ params }: Props) {
  const posts = await fetchPublishedPosts();
  // a missing post is a 404 only when the list really loaded; if the database is unreachable the browser decides
  if (posts && !posts.some((p) => p.slug === params.slug)) notFound();
  return <BlogDetail slug={params.slug} initialPosts={posts ?? undefined} />;
}
