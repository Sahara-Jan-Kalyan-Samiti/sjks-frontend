import { Suspense } from "react";
import { pageMetadata } from "@/lib/seo";
import Donate from "@/views/support/Donate";

export const metadata = pageMetadata("/donate");

export default function DonatePage() {
  return (
    <Suspense fallback={null}>
      <Donate />
    </Suspense>
  );
}
