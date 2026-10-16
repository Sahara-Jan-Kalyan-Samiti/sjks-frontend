import { fetchPublishedPosts } from "@/services/blog";
import { pageMetadata } from "@/lib/seo";
import Blog from "@/views/blog/Blog";

export const metadata = pageMetadata("/blog");
/** New posts from the admin panel show within a minute without a new build. */
export const revalidate = 60;

export default async function BlogPage() {
  const posts = await fetchPublishedPosts();
  return <Blog initialPosts={posts ?? undefined} />;
}
