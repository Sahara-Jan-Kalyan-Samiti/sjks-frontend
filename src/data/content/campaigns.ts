import { safeUrl } from "@/data/content/blog";

/**
 * Fundraising campaigns. They are written in the admin panel (Programmes -> Campaigns) and read from the table campaigns
 * (supabase/migrations/20250211000000_campaign_pages.sql). The newer columns may not exist in a database that has not had that
 * migration yet, so every field is read defensively and a missing one is simply empty.
 */
export interface CampaignPhoto {
  url: string;
  caption: string;
}
export interface CampaignDocument {
  url: string;
  name: string;
}
export interface CampaignUpdate {
  /** YYYY-MM-DD */
  date: string;
  title: string;
  text: string;
}
export interface CampaignPage {
  id?: number;
  slug: string;
  title: string;
  /** the short text on the card */
  description: string;
  cause: string;
  goal: number;
  /** the amount raised so far, as typed by an admin */
  raised: number;
  /** the full story: blank line between paragraphs, "## " heading, "> " highlighted quote (same as a blog post) */
  story: string;
  cover: string | null;
  gallery: CampaignPhoto[];
  documents: CampaignDocument[];
  updates: CampaignUpdate[];
  location: string;
  /** who or what the money helps, e.g. "120 cows" */
  beneficiaries: string;
  /** last day to give (YYYY-MM-DD), or null for no deadline */
  endDate: string | null;
}

const text = (v: unknown) => (typeof v === "string" ? v.trim() : "");
const amount = (v: unknown) => {
  const n = Number(v);
  return Number.isFinite(n) && n > 0 ? n : 0;
};
const rows = (v: unknown): Record<string, unknown>[] =>
  Array.isArray(v) ? v.filter((x): x is Record<string, unknown> => !!x && typeof x === "object" && !Array.isArray(x)) : [];
const day = (v: unknown) => (typeof v === "string" && /^\d{4}-\d{2}-\d{2}/.test(v) ? v.slice(0, 10) : null);

/** A row of the campaigns table as the website uses it. */
export function toCampaign(row: Record<string, unknown>): CampaignPage {
  return {
    id: typeof row.id === "number" ? row.id : undefined,
    slug: text(row.slug),
    title: text(row.title),
    description: text(row.description),
    cause: text(row.cause),
    goal: amount(row.goal_amount),
    raised: amount(row.raised_offset),
    story: typeof row.story === "string" ? row.story : "",
    cover: safeUrl(text(row.cover_url) || null),
    gallery: rows(row.gallery).flatMap((g) => {
      const url = safeUrl(text(g.url) || null);
      return url ? [{ url, caption: text(g.caption) }] : [];
    }),
    documents: rows(row.documents).flatMap((d) => {
      const url = safeUrl(text(d.url) || null);
      return url ? [{ url, name: text(d.name) || "Document" }] : [];
    }),
    updates: rows(row.updates)
      .flatMap((u) => {
        const date = day(u.date);
        return date && (text(u.title) || text(u.text)) ? [{ date, title: text(u.title), text: text(u.text) }] : [];
      })
      .sort((a, b) => b.date.localeCompare(a.date)),
    location: text(row.location),
    beneficiaries: text(row.beneficiaries),
    endDate: day(row.end_date)
  };
}

/** What is raised, what is still needed (always calculated: goal minus raised) and how far along the campaign is. */
export function campaignStats(c: Pick<CampaignPage, "goal" | "raised">) {
  const goal = Math.max(0, c.goal);
  const raised = Math.max(0, c.raised);
  return {
    goal,
    raised,
    left: Math.max(0, goal - raised),
    pct: goal > 0 ? Math.min(100, Math.round((raised / goal) * 100)) : 0,
    reached: goal > 0 && raised >= goal
  };
}

/** Whole days from today to the last day to give: 0 = the last day is today, negative = the campaign has ended, null = no deadline. */
export function daysLeft(endDate: string | null, now = new Date()): number | null {
  if (!endDate) return null;
  const end = new Date(`${endDate}T00:00:00`);
  if (Number.isNaN(end.getTime())) return null;
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  return Math.round((end.getTime() - today.getTime()) / 86_400_000);
}

export const rupees = (n: number) => "₹" + n.toLocaleString("en-IN");
/** The donation page opens on the campaign's cause (the same address the Home page cards use). */
export const donateLink = (c: Pick<CampaignPage, "cause" | "title">) => `/donate?cause=${encodeURIComponent(c.cause || c.title)}`;
