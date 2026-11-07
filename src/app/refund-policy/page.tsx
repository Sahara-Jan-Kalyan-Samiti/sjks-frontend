import { pageMetadata } from "@/lib/seo";
import Legal from "@/features/legal/Legal";

export const metadata = pageMetadata("/refund-policy");

export default function RefundPolicyPage() {
  return <Legal kind="refund" />;
}
