import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { fetchPublishedCampaigns } from "@/services/campaigns";
import { buildMetadata } from "@/lib/seo";
import CampaignDetail from "@/features/campaigns/CampaignDetail";

type Props = { params: { slug: string } };
const FALLBACK = "A fundraising campaign of Sahara Jan Kalyan Samiti: its goal, what has been raised and what is still needed.";
/** New campaigns and changed amounts from the admin panel show within a minute without a new build. */
export const revalidate = 60;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const campaign = (await fetchPublishedCampaigns())?.find((c) => c.slug === params.slug);
  // when the database cannot be reached the page still opens: the browser loads the campaign itself
  if (!campaign) return buildMetadata({ title: "Fundraising Campaigns", description: FALLBACK, path: `/campaigns/${params.slug}` });
  return buildMetadata({
    title: campaign.title,
    description: campaign.description || FALLBACK,
    path: `/campaigns/${campaign.slug}`,
    image: campaign.cover ?? undefined
  });
}

export default async function CampaignPage({ params }: Props) {
  const campaigns = await fetchPublishedCampaigns();
  // a missing campaign is a 404 only when the list really loaded; if the database is unreachable the browser decides
  if (campaigns && !campaigns.some((c) => c.slug === params.slug)) notFound();
  return <CampaignDetail slug={params.slug} initialCampaigns={campaigns ?? undefined} />;
}
