import { pageMetadata } from "@/lib/seo";
import Donate from "@/features/support/Donate";

export const metadata = pageMetadata("/donate");

export default function DonatePage() {
  return <Donate />;
}
