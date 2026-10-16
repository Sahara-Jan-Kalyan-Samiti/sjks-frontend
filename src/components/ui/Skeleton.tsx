/** A grey pulsing block shown in place of content that is still loading. Give it the size of the real content to avoid the page jumping. */
export default function Skeleton({ className = "" }: { className?: string }) {
  return <div aria-hidden="true" className={`animate-pulse rounded-xl bg-ink/10 ${className}`} />;
}

/** A heading line plus a row of cards: the usual shape of a section. */
export function SectionSkeleton({ cards = 3, className = "" }: { cards?: number; className?: string }) {
  return (
    <div className={`container-site py-12 ${className}`} role="status" aria-busy="true" aria-label="Loading">
      <Skeleton className="mx-auto h-8 w-1/3" />
      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: cards }, (_, i) => (
          <Skeleton key={i} className="h-56" />
        ))}
      </div>
    </div>
  );
}
