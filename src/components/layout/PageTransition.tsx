"use client";

import { usePathname } from "next/navigation";
import { useRef, type ReactNode } from "react";

/**
 * Gives every page CHANGE the gentle slide-in (the wrapper is created anew for each address).
 * The first page a visitor opens is not animated: a fade-in over the whole page would hold back the first paint of the banner photo.
 */
export default function PageTransition({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const first = useRef(pathname);
  const navigated = useRef(false);
  if (pathname !== first.current) navigated.current = true;
  return (
    <div key={pathname} className={navigated.current ? "page-enter" : undefined}>
      {children}
    </div>
  );
}
