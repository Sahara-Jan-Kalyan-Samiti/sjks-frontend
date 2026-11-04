import { pageMetadata } from "@/lib/seo";
import PartnerWithUs from "@/features/membership/PartnerWithUs";

export const metadata = pageMetadata("/partner-with-us");

export default function PartnerWithUsPage() {
  return <PartnerWithUs />;
}
