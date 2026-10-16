import { useEffect, useState } from "react";
import { supabase, supabaseConfigured } from "@/services/supabase";
import { fallbackProgrammes, type DonorData } from "@/data/content/donorTransparency";

interface ProgrammeRow { id: number; name: string; period: string; place: string; summary: string; received: number | string }
interface ItemRow { programme_id: number; kind: string; title: string; detail: string; amount: number | string | null; extra: string; file_url: string | null; sort_order: number; id: number }

/**
 * The published programmes of the Donor Transparency page, kept in the admin panel.
 * `loading` until the answer is in; if the database cannot be reached (or is not set up) the built-in example is used instead.
 */
export function useDonorProgrammes(): { list: DonorData[]; loading: boolean } {
  const [state, setState] = useState<{ list: DonorData[]; loading: boolean }>({ list: [], loading: true });
  useEffect(() => {
    if (!supabaseConfigured || !supabase) { setState({ list: fallbackProgrammes, loading: false }); return; }
    let alive = true;
    (async () => {
      const progs = await supabase.from("donor_programmes").select("*").eq("published", true).order("sort_order").order("created_at", { ascending: false });
      if (progs.error || !progs.data) throw progs.error;
      const ids = (progs.data as ProgrammeRow[]).map((p) => p.id);
      const items = ids.length ? await supabase.from("donor_items").select("*").in("programme_id", ids).order("sort_order").order("id") : { data: [], error: null };
      if (items.error || !items.data) throw items.error;
      const all = items.data as ItemRow[];
      const list: DonorData[] = (progs.data as ProgrammeRow[]).map((p) => {
        const of = (k: string) => all.filter((i) => i.programme_id === p.id && i.kind === k);
        return {
          id: p.id, name: p.name, period: p.period, place: p.place, summary: p.summary, received: Number(p.received),
          spending: of("spending").map((i) => ({ label: i.title, detail: i.detail, amount: Number(i.amount || 0) })),
          outcomes: of("outcome").map((i) => ({ value: Number(i.amount || 0), label: i.title, detail: i.detail })),
          proofs: of("proof").map((i) => ({ title: i.title, kind: i.extra, detail: i.detail, file: i.file_url || undefined })),
          photos: of("photo").filter((i) => i.file_url).map((i) => ({ file: i.file_url as string, alt: i.title })),
          dates: of("date").map((i) => ({ date: i.extra, title: i.title, detail: i.detail }))
        };
      });
      if (alive) setState({ list, loading: false });
    })().catch(() => { if (alive) setState({ list: fallbackProgrammes, loading: false }); });
    return () => { alive = false; };
  }, []);
  return state;
}
