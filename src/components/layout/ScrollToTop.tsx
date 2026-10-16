"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/** Scrolls to the section a link points to ("/projects#upcoming") with a gentle slide-in for that section. */
function showHashTarget(): boolean {
  const id = decodeURIComponent(window.location.hash.slice(1));
  const el = id ? document.getElementById(id) : null;
  if (!el) return false;
  el.scrollIntoView();
  el.classList.remove("section-enter");
  void el.offsetWidth; // restart the animation
  el.classList.add("section-enter");
  const done = (e: AnimationEvent) => {
    if (e.target === el) {
      el.classList.remove("section-enter");
      el.removeEventListener("animationend", done);
    }
  };
  el.addEventListener("animationend", done);
  return true;
}

/**
 * After every page change: to the linked section if the address has one, otherwise back to the top.
 * Links to a section of the page you are already on are caught too (Next.js does not report a hash-only change).
 */
export default function ScrollToTop() {
  const pathname = usePathname();

  useEffect(() => {
    if (window.location.hash) {
      const timer = window.setTimeout(showHashTarget, 50);
      return () => window.clearTimeout(timer);
    }
    window.scrollTo(0, 0);
  }, [pathname]);

  useEffect(() => {
    const later = () => window.setTimeout(showHashTarget, 60);
    const onClick = (e: MouseEvent) => {
      const link = (e.target as Element | null)?.closest?.("a");
      if (link && link.hash && link.pathname === window.location.pathname) later();
    };
    document.addEventListener("click", onClick);
    window.addEventListener("hashchange", later);
    return () => {
      document.removeEventListener("click", onClick);
      window.removeEventListener("hashchange", later);
    };
  }, []);

  return null;
}
