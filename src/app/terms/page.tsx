import { pageMetadata } from "@/lib/seo";
import Legal from "@/features/legal/Legal";

export const metadata = pageMetadata("/terms");

export default function TermsPage() {
  return <Legal kind="terms" />;
}
