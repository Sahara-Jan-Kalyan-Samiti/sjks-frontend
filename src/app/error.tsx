"use client";

import Link from "next/link";
import { useEffect } from "react";

/** Shown inside the site frame when a page fails while loading or rendering. */
export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <section className="container-site py-24 text-center" role="alert">
      <p className="eyebrow">Error</p>
      <h1 className="h2 mt-2">Something went wrong</h1>
      <p className="mt-3 text-ink/70">We could not load this page. Please try again.</p>
      <div className="mt-6 flex justify-center gap-3">
        <button type="button" onClick={reset} className="btn btn-brand">
          Try again
        </button>
        <Link href="/" className="btn">
          Back to Home
        </Link>
      </div>
    </section>
  );
}
