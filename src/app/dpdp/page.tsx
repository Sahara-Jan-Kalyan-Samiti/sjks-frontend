import { pageMetadata } from "@/lib/seo";
import Legal from "@/views/legal/Legal";

export const metadata = pageMetadata("/dpdp");

export default function DpdpPage() {
  return <Legal kind="dpdp" />;
}
