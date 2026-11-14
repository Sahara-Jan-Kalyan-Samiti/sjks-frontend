"use client";

import { useInView } from "@/hooks/useInView";
import { useLang } from "@/i18n/LangContext";
import type { CampaignPage } from "@/data/content/campaigns";

/** Progress bar that fills when it scrolls into view (instantly when the visitor prefers less motion). */
export function ProgressBar({ pct, label, tall = false }: { pct: number; label: string; tall?: boolean }) {
  const [ref, seen] = useInView<HTMLDivElement>(0.3);
  return (
    <div ref={ref} className="relative">
      <div
        className={`overflow-hidden rounded-full bg-brand-light shadow-inner ${tall ? "h-4" : "h-3"}`}
        role="progressbar"
        aria-valuenow={pct}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={label}
      >
        <div
          className="h-full rounded-full bg-gradient-to-r from-brand to-sky-400 transition-[width] duration-[1400ms] ease-out motion-reduce:transition-none"
          style={{ width: seen ? `${pct}%` : "0%" }}
        />
      </div>
      {[25, 50, 75].map((m) => (
        <span key={m} aria-hidden="true" className={`absolute top-0 w-px bg-white/80 ${tall ? "h-4" : "h-3"}`} style={{ left: `${m}%` }} />
      ))}
    </div>
  );
}

/** Photos of the people the campaigns help, used where a campaign has no cover photo of its own and on the campaign pages. */
export const heartPhotos = [
  "/assets/images/home/hero-slide-02.jpg",
  "/assets/images/home/hero-slide-05.jpg",
  "/assets/images/home/hero-slide-04.jpg"
];
/** The same campaign always gets the same photo. */
export const pickPhoto = (seed: string) => heartPhotos[[...seed].reduce((sum, ch) => sum + ch.charCodeAt(0), 0) % heartPhotos.length];

/** The campaign's cover photo, or one of the photos above when it has none. */
export function CampaignCover({ c, className = "" }: { c: Pick<CampaignPage, "cover" | "title">; className?: string }) {
  return (
    <img
      src={c.cover || pickPhoto(c.title)}
      alt=""
      loading="lazy"
      decoding="async"
      className={`h-full w-full object-cover ${c.cover ? "" : "object-[center_30%]"} ${className}`}
    />
  );
}

/** "Goal reached" or "Ended", shown on a card or at the top of a campaign. Nothing while the campaign is simply running. */
export function StatusPill({ reached, days, className = "" }: { reached: boolean; days: number | null; className?: string }) {
  const { t } = useLang();
  const ended = days !== null && days < 0;
  if (!reached && !ended) return null;
  return (
    <span
      className={`rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-wider shadow ${reached ? "bg-emerald-500 text-white" : "bg-amber-100 text-amber-800"} ${className}`}
    >
      {reached ? t("Goal reached") : t("Campaign ended")}
    </span>
  );
}

/** "12 days left", "Last day" or "Ended"; null when there is no deadline (or it is not known yet). */
export function useDaysText(days: number | null): string | null {
  const { t } = useLang();
  if (days === null) return null;
  if (days < 0) return t("Campaign ended");
  if (days === 0) return t("Last day to give");
  return `${days} ${days === 1 ? t("day left") : t("days left")}`;
}

export const PinIcon = () => (
  <svg
    aria-hidden="true"
    viewBox="0 0 24 24"
    className="h-4 w-4 shrink-0"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M12 21s-7-6.2-7-11a7 7 0 0114 0c0 4.8-7 11-7 11z" />
    <circle cx="12" cy="10" r="2.5" />
  </svg>
);
