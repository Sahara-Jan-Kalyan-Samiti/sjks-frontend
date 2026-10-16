"use client";

import { useEffect, type ReactNode } from "react";
import { LangProvider } from "@/i18n/LangContext";
import { watchJustify } from "@/utils/justify";

/** Everything the whole site needs once: the English / Hindi switch and the justified-text watcher. */
export default function AppProviders({ children }: { children: ReactNode }) {
  useEffect(() => watchJustify(), []);
  return <LangProvider>{children}</LangProvider>;
}
