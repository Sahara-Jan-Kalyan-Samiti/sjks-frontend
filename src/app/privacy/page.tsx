import { pageMetadata } from "@/lib/seo";
import Legal from "@/features/legal/Legal";

export const metadata = pageMetadata("/privacy");

export default function PrivacyPage() {
  return <Legal kind="privacy" />;
}
