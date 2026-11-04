import { pageMetadata } from "@/lib/seo";
import Policies from "@/features/legal/Policies";

export const metadata = pageMetadata("/policies");

export default function PoliciesPage() {
  return <Policies />;
}
