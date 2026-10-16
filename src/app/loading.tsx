/** Shown while a page is loading. */
export default function Loading() {
  return (
    <section className="container-site py-24 text-center" role="status" aria-live="polite">
      <p className="text-ink/60">Loading…</p>
    </section>
  );
}
