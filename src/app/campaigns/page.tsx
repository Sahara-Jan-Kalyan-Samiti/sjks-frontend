import { fetchPublishedCampaigns } from "@/services/campaigns";
import { pageMetadata } from "@/lib/seo";
import Campaigns from "@/features/campaigns/Campaigns";

export const metadata = pageMetadata("/campaigns");
/** New campaigns and changed amounts from the admin panel show within a minute without a new build. */
export const revalidate = 60;

export default async function CampaignsPage() {
  const campaigns = await fetchPublishedCampaigns();
  return <Campaigns initialCampaigns={campaigns ?? undefined} />;
}
