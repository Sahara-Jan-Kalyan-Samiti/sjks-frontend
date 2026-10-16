import Skeleton, { SectionSkeleton } from "@/components/ui/Skeleton";

/** Shown while a page is loading: a banner and a row of cards, so the layout does not jump when the real page arrives. */
export default function Loading() {
  return (
    <div role="status" aria-busy="true" aria-label="Loading">
      <Skeleton className="h-64 rounded-none" />
      <SectionSkeleton />
    </div>
  );
}
