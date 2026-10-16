"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

/** Gives every page change the gentle slide-in (the wrapper is created anew for each address). */
export default function PageTransition({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  return (
    <div key={pathname} className="page-enter">
      {children}
    </div>
  );
}
