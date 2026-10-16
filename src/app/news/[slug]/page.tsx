import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { posts } from "@/data/content/news";
import { buildMetadata } from "@/lib/seo";
import NewsDetail from "@/features/news/NewsDetail";

type Props = { params: { slug: string } };
const find = (slug: string) => posts.find((p) => p.slug === slug);

export const generateStaticParams = () => posts.map((p) => ({ slug: p.slug }));

export function generateMetadata({ params }: Props): Metadata {
  const post = find(params.slug);
  if (!post) return { title: "Page not found", robots: { index: false } };
  return buildMetadata({ title: post.title, description: post.excerpt, path: `/news/${post.slug}`, image: `/assets/images/${post.image}`, type: "article" });
}

export default function NewsPostPage({ params }: Props) {
  if (!find(params.slug)) notFound();
  return <NewsDetail slug={params.slug} />;
}
