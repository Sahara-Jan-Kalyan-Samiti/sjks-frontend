"use client";

import { usePathname } from "next/navigation";
import { env } from "@/lib/env";

/** The public address of the current page (canonical site address + path), for "copy link" and share buttons. Safe to render on the server. */
export function useShareUrl(): string {
  return `${env.siteUrl}${usePathname()}`;
}
