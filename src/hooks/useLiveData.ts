import { useEffect, useState } from "react";
import { stats as defaultStats, statFromText, type Stat } from "@/data/content/content";
import { defaultMedicalFundings, type MedicalFunding } from "@/data/content/medicalFunding";
import { defaultMemberOrganizations, type MemberOrganization } from "@/data/content/memberOrganizations";
import { useSavedPageText } from "./usePageText";
import { publicStorageUrl, restSelect, supabaseConfigured } from "@/services/supabaseRest";
import { env } from "@/lib/env";

export interface Campaign {
  id: string;
  title: string;
  text: string;
  goal: number;
  raised: number;
  cause?: string;
  sample?: boolean;
}
export interface EventItem {
  id: string;
  title: string;
  date: string;
  time?: string;
  place: string;
  text: string;
  images?: string[];
  sample?: boolean;
}
interface Live {
  stats: Stat[];
  campaigns: Campaign[];
  events: EventItem[];
}

/** Base URL of the admin server. Empty = same address as the site (dev proxy / single-server deploy). */
export const API_BASE = env.apiUrl;
const URL_ = env.liveDataUrl;
let cache: Live | null = null;

/** Today as YYYY-MM-DD in the visitor's own time zone (not UTC), so an event dated today stays "upcoming" all day. */
export const todayLocal = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
};

/** Sample entries are shown while developing but hidden on the published site. */
const visible = <T extends { sample?: boolean }>(list: T[] = []) => (env.isDev ? list : list.filter((x) => !x.sample));

/** Events published in the admin panel. Tries the site's own server first (self-hosted deployments), then Supabase. */
async function fetchAdminEvents(): Promise<EventItem[]> {
  try {
    const r = await fetch(`${API_BASE}/api/public/events`, { cache: "no-store" });
    if (r.ok) {
      const list = (await r.json()) as EventItem[];
      if (Array.isArray(list) && list.length) return list;
    }
  } catch {
    /* server not running: fall through to Supabase */
  }
  if (!supabaseConfigured) return [];
  try {
    const { data } = await restSelect<{
      id: number | string;
      title: string;
      event_date: string;
      event_time: string | null;
      place: string | null;
      description: string | null;
      event_images: { storage_path: string; position: number }[] | null;
    }>("events", {
      select: "id,title,event_date,event_time,place,description,event_images(storage_path,position)",
      published: "eq.true",
      order: "event_date"
    });
    if (!data) return [];
    return data.map((e) => ({
      id: String(e.id),
      title: e.title,
      date: e.event_date,
      time: e.event_time || undefined,
      place: e.place || "",
      text: e.description || "",
      images: (e.event_images || [])
        .sort((a, b) => a.position - b.position)
        .map((img) => publicStorageUrl("event-images", img.storage_path))
    }));
  } catch {
    return [];
  }
}
/**
 * Campaigns published in the admin panel (Programmes -> Campaigns), in the order set there.
 * null = the database could not be reached, so the caller falls back to the file; [] = none published (the section stays hidden).
 */
async function fetchAdminCampaigns(): Promise<Campaign[] | null> {
  if (!supabaseConfigured) return null;
  try {
    const { data } = await restSelect<{
      id: number | string;
      title: string;
      description: string | null;
      cause: string | null;
      goal_amount: number | string;
      raised_offset: number | string;
    }>("campaigns", {
      select: "id,title,description,cause,goal_amount,raised_offset",
      published: "eq.true",
      order: "sort_order,created_at.desc"
    });
    if (!data) return null;
    return data.map((c) => ({
      id: String(c.id),
      title: c.title,
      text: c.description || "",
      goal: Number(c.goal_amount),
      raised: Number(c.raised_offset),
      cause: c.cause || undefined
    }));
  } catch {
    return null;
  }
}
async function fetchFile(): Promise<Partial<Live>> {
  try {
    const r = await fetch(URL_, { cache: "no-store" });
    return r.ok ? await r.json() : {};
  } catch {
    return {};
  }
}
/** The two sources are independent: if live.json fails, admin events still show (and the other way round). */
async function loadAll(): Promise<Live> {
  const [j, extra, adminCampaigns] = await Promise.all([fetchFile(), fetchAdminEvents(), fetchAdminCampaigns()]);
  return {
    stats: Array.isArray(j.stats) && j.stats.length ? j.stats : defaultStats,
    // the admin panel decides; the file only fills in when the database cannot be reached
    campaigns: adminCampaigns ?? visible<Campaign>(j.campaigns),
    events: [...visible<EventItem>(j.events), ...extra]
  };
}

/** Several components on a page ask for the live data at the same moment; they share one request instead of sending one each. */
let inflight: Promise<Live> | null = null;
function loadShared(): Promise<Live> {
  inflight ??= loadAll().finally(() => {
    inflight = null;
  });
  return inflight;
}

/** Runs `fn` now, whenever the tab becomes visible again, and every minute, so admin changes appear without a manual reload. */
function useRefresh(fn: () => void) {
  useEffect(() => {
    fn();
    const onShow = () => {
      if (document.visibilityState === "visible") fn();
    };
    document.addEventListener("visibilitychange", onShow);
    window.addEventListener("focus", onShow);
    const timer = window.setInterval(onShow, 60_000);
    return () => {
      document.removeEventListener("visibilitychange", onShow);
      window.removeEventListener("focus", onShow);
      window.clearInterval(timer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}

/**
 * Loads stats, campaigns and events from live.json (or VITE_LIVE_DATA_URL) plus events published in the admin panel.
 * A number typed in the admin panel (Website Pages -> Home: Impact Numbers) replaces the one from the file, by position;
 * `label` stays the original so lookups by label keep working (the wording shown comes from the saved page text).
 */
export function useLiveData(): Live & { loaded: boolean } {
  const [data, setData] = useState<Live>(cache ?? { stats: defaultStats, campaigns: [], events: [] });
  const [loaded, setLoaded] = useState(!!cache);
  const saved = useSavedPageText();
  useRefresh(() => {
    loadShared()
      .then((next) => {
        cache = next;
        setData(next);
        setLoaded(true);
      })
      .catch(() => setLoaded(true));
  });
  const stats = data.stats.map((s, i) => {
    const typed = saved[`home.impact.${i + 1}.value`];
    return typed ? statFromText(typed, s) : s;
  });
  return { ...data, stats, loaded };
}

/** Hospitals and medical facilities funded, as published in the admin panel (Medical Funding): largest amount first. */
async function fetchMedicalFundings(): Promise<MedicalFunding[] | null> {
  if (!supabaseConfigured) return null;
  try {
    const { data } = await restSelect<Omit<MedicalFunding, "id" | "amount"> & { id: number | string; amount: number | string }>(
      "medical_fundings",
      { select: "id,kind,name,location,purpose,amount,period", published: "eq.true", order: "amount.desc,name" }
    );
    if (!data) return null;
    return data.map((r) => ({ ...r, id: String(r.id), amount: Number(r.amount) || 0 }));
  } catch {
    return null;
  }
}
/** The published funding list. Until the database answers (or if it cannot be read) the list in src/data/medicalFunding.ts is shown. */
export function useMedicalFundings(): MedicalFunding[] {
  const [list, setList] = useState<MedicalFunding[]>(defaultMedicalFundings);
  useRefresh(() => {
    fetchMedicalFundings()
      .then((rows) => {
        if (rows) setList(rows);
      })
      .catch(() => {
        /* keep what is shown */
      });
  });
  return list;
}

/** Member organisations approved and published in the admin panel (Member Organizations), in the order set there. */
async function fetchMemberOrganizations(): Promise<MemberOrganization[] | null> {
  if (!supabaseConfigured) return null;
  try {
    const { data } = await restSelect<Omit<MemberOrganization, "id"> & { id: number | string }>("member_organizations", {
      select: "id,name,location,description",
      published: "eq.true",
      status: "eq.approved",
      order: "sort_order,id"
    });
    if (!data) return null;
    return data.map((r) => ({ ...r, id: String(r.id) }));
  } catch {
    return null;
  }
}
/** The published member organisations. Until the database answers (or if it cannot be read) the list in src/data/memberOrganizations.ts is shown. */
export function useMemberOrganizations(): MemberOrganization[] {
  const [list, setList] = useState<MemberOrganization[]>(defaultMemberOrganizations);
  useRefresh(() => {
    fetchMemberOrganizations()
      .then((rows) => {
        if (rows) setList(rows);
      })
      .catch(() => {
        /* keep what is shown */
      });
  });
  return list;
}

export interface AdminProject {
  id: string;
  name: string;
  area?: string;
  location?: string;
  description?: string;
  status: string;
  beneficiaries: number;
  /** photo uploaded in the admin panel */ image_url?: string;
}
/** Projects added in the admin panel and marked "show on website". Tries the site's own server first, then Supabase. */
async function fetchAdminProjects(): Promise<AdminProject[]> {
  try {
    const r = await fetch(`${API_BASE}/api/public/projects`, { cache: "no-store" });
    if (r.ok) {
      const list = await r.json();
      if (Array.isArray(list) && list.length) return list;
    }
  } catch {
    /* server not running: fall through to Supabase */
  }
  if (!supabaseConfigured) return [];
  try {
    const { data } = await restSelect<AdminProject & { id: number | string }>("projects", {
      select: "*",
      published: "eq.true",
      order: "created_at.desc"
    });
    if (!data) return [];
    return data.map((p) => ({
      ...p,
      id: String(p.id),
      area: p.area || undefined,
      location: p.location || undefined,
      description: p.description || undefined,
      image_url: p.image_url || undefined
    }));
  } catch {
    return [];
  }
}
/** Projects added in the admin panel and marked "show on website". Empty list if neither source is reachable. */
export function useAdminProjects(): AdminProject[] {
  const [list, setList] = useState<AdminProject[]>([]);
  useRefresh(() => {
    fetchAdminProjects()
      .then(setList)
      .catch(() => {
        /* keep what is shown */
      });
  });
  return list;
}
