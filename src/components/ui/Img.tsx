"use client";

import { useEffect, useRef, useState } from "react";
interface Props {
  file: string;
  alt: string;
  className?: string;
  eager?: boolean;
  /** Far down a page: the file is requested only when the picture is within ~300px of the screen (the browser's own lazy loading starts much earlier on slow connections and competes with the first screen). */
  defer?: boolean;
}
/** Loads /assets/images/<file>. If the file is missing, shows a labelled placeholder. */
export default function Img({ file, alt, className = "", eager, defer }: Props) {
  const [failed, setFailed] = useState(false);
  const [near, setNear] = useState(!defer);
  const ref = useRef<HTMLImageElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (near || !el) return;
    if (typeof IntersectionObserver === "undefined") {
      setNear(true);
      return;
    }
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setNear(true);
          io.disconnect();
        }
      },
      { rootMargin: "300px 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [near]);
  if (failed) {
    return (
      <div
        role="img"
        aria-label={alt}
        className={`flex items-center justify-center bg-gradient-to-br from-brand to-brand-dark p-3 text-center text-xs text-white/80 ${className}`}
      >
        Add image: {file}
      </div>
    );
  }
  return (
    <>
      <img
        ref={ref}
        src={near ? `/assets/images/${file}` : undefined}
        alt={alt}
        loading={eager ? "eager" : "lazy"}
        decoding="async"
        onError={() => setFailed(true)}
        className={`object-cover ${className}`}
      />
      {/* a deferred picture has no address until the page's code runs: this copy is for visitors and crawlers without JavaScript */}
      {defer && (
        <noscript>
          <img src={`/assets/images/${file}`} alt={alt} loading="lazy" className={`object-cover ${className}`} />
        </noscript>
      )}
    </>
  );
}
