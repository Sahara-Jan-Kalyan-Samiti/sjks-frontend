"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

/**
 * Renders `children` only once the placeholder is close to the screen (default: 400px before it). Until then nothing below it runs:
 * no component code, no animations, no style/layout work. Use it for heavy sections far down a page. `className` should give the
 * placeholder roughly the height of the real content so the page does not jump.
 */
export default function LazyMount({
  children,
  className = "",
  margin = 400
}: {
  children: ReactNode;
  className?: string;
  margin?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [show, setShow] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el || show) return;
    if (typeof IntersectionObserver === "undefined") {
      setShow(true);
      return;
    }
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setShow(true);
          io.disconnect();
        }
      },
      { rootMargin: `${margin}px 0px` }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [show, margin]);
  if (show) return <>{children}</>;
  return <div ref={ref} aria-hidden="true" className={className} />;
}
