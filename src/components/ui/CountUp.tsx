"use client";

import { useEffect, useRef } from "react";
import { useInView } from "@/hooks/useInView";
import type { Stat } from "@/data/content/content";

const fmt = (n: number) => n.toLocaleString("en-IN");

/**
 * Counts from 0 to the stat value when scrolled into view. Text-only stats are shown as-is.
 * Each frame writes the number straight into the text node: React renders "0" once and is not asked to redraw ~100 times per counter.
 * React keeps comparing against the "0" it rendered, so it never overwrites the number shown.
 */
export default function CountUp({ stat }: { stat: Stat }) {
  const [ref, seen] = useInView<HTMLSpanElement>(0.4);
  const num = useRef<HTMLSpanElement>(null);
  const target = stat.value ?? 0;
  useEffect(() => {
    const text = num.current?.firstChild;
    if (!seen || stat.value === undefined || stat.plain || !(text instanceof Text)) return;
    const show = (n: number) => {
      text.nodeValue = fmt(n);
    };
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      show(target);
      return;
    }
    const start = performance.now(),
      dur = 1600;
    let raf = 0;
    const tick = (t: number) => {
      const p = Math.min((t - start) / dur, 1);
      show(Math.round(target * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [seen, target, stat.value, stat.plain]);

  if (stat.value === undefined) return <span ref={ref}>{stat.text}</span>;
  if (stat.plain)
    return (
      <span ref={ref}>
        {stat.value}
        {stat.suffix}
      </span>
    );
  return (
    <span ref={ref}>
      <span ref={num}>{fmt(0)}</span>
      {stat.suffix}
    </span>
  );
}
