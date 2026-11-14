"use client";

import { useEffect, useState } from "react";
import { daysLeft, toCampaign, type CampaignPage } from "@/data/content/campaigns";
import { supabase, supabaseConfigured } from "@/services/supabase";

/** Campaigns already loaded in this visit, so going from the list into a campaign does not wait again. */
let cache: CampaignPage[] | null = null;

/**
 * Published campaigns from the admin panel (table campaigns). `null` while loading.
 * `initial` are the campaigns the server already rendered into the page: they are shown at once and refreshed in the browser.
 * When the database cannot be reached the last good list is kept (or an empty one).
 */
export function useCampaigns(initial?: CampaignPage[]): CampaignPage[] | null {
  const [list, setList] = useState<CampaignPage[] | null>(initial ?? cache ?? (supabaseConfigured && supabase ? null : []));
  useEffect(() => {
    if (!supabaseConfigured || !supabase) return;
    let alive = true;
    supabase
      .from("campaigns")
      .select("*")
      .eq("published", true)
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: false })
      .then(({ data, error }) => {
        const fresh = error || !data ? null : (data as Record<string, unknown>[]).map(toCampaign).filter((c) => c.slug && c.title);
        if (fresh) cache = fresh;
        if (alive) setList(fresh ?? cache ?? initial ?? []);
      });
    return () => {
      alive = false;
    };
  }, [initial]);
  return list;
}

/**
 * Days left to give, worked out in the visitor's browser only (so the server page and the browser never disagree about "today").
 * null = no deadline, or not known yet.
 */
export function useDaysLeft(endDate: string | null): number | null {
  const [days, setDays] = useState<number | null>(null);
  useEffect(() => setDays(daysLeft(endDate)), [endDate]);
  return days;
}
