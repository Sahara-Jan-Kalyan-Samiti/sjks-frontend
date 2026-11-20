"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useLang } from "@/i18n/LangContext";
import { supabase, supabaseConfigured } from "@/services/supabase";
import { defaultAnnualReports, type AnnualReport } from "@/data/content/annualReports";
import PageHero from "@/components/layout/PageHero";
import Reveal from "@/components/ui/Reveal";

/** The first four-digit year in a box name ("2004-05", "2004-2005", "FY 2026" ...); 0 when the name has none. */
const startYear = (fy: string) => Number(fy.match(/\d{4}/)?.[0]) || 0;
/** A soft accent for each card, in turn by the card's year (a card keeps its colour whichever way the list is sorted). */
const accents = [
  { band: "bg-sky-50", tile: "bg-sky-500", chip: "text-sky-700 ring-sky-200", year: "text-sky-700" },
  { band: "bg-emerald-50", tile: "bg-emerald-500", chip: "text-emerald-700 ring-emerald-200", year: "text-emerald-700" },
  { band: "bg-violet-50", tile: "bg-violet-500", chip: "text-violet-700 ring-violet-200", year: "text-violet-700" },
  { band: "bg-orange-50", tile: "bg-orange-500", chip: "text-orange-700 ring-orange-200", year: "text-orange-700" }
];
const accentOf = (fy: string) => accents[(startYear(fy) || [...fy].reduce((n, ch) => n + ch.charCodeAt(0), 0)) % accents.length];
/** Only a file of this website or an https link is ever opened. */
const safeUrl = (u?: string | null) => (u && /^(\/(?!\/)|https:\/\/)/.test(u) ? u : null);
/** Download link: files in the storage bucket need "?download" to be saved instead of opened. */
const downloadUrl = (u: string) => (u.startsWith("https://") ? `${u}${u.includes("?") ? "&" : "?"}download=` : u);

/** Years from the admin panel (table annual_reports). Falls back to the list in src/data/annualReports.ts. */
function useAnnualReports(): AnnualReport[] {
  const [list, setList] = useState<AnnualReport[]>(defaultAnnualReports);
  useEffect(() => {
    if (!supabaseConfigured || !supabase) return;
    let alive = true;
    supabase
      .from("annual_reports")
      .select("fy, title, description, file_url")
      .eq("published", true)
      .then(({ data, error }) => {
        if (alive && !error && data && data.length) setList(data);
      });
    return () => {
      alive = false;
    };
  }, []);
  return list;
}

function YearBox({ r }: { r: AnnualReport }) {
  const { t } = useLang();
  const url = safeUrl(r.file_url);
  const label = r.title || r.fy;
  const ac = accentOf(r.fy);
  return (
    // every year is the same card with a soft coloured header; a year without a PDF is only quieter (grey, "pending", no buttons)
    <article
      className={`group flex h-full flex-col overflow-hidden rounded-2xl border bg-white transition duration-200 ${url ? "border-ink/10 shadow-sm hover:-translate-y-1 hover:border-brand/40 hover:shadow-[0_18px_40px_-22px_rgba(11,61,122,.5)]" : "border-dashed border-ink/15 bg-slate-50/70"}`}
    >
      <div className={`flex items-center justify-between gap-3 px-5 py-4 ${url ? ac.band : "bg-slate-100/70"}`}>
        <span
          aria-hidden="true"
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl shadow-sm ${url ? `${ac.tile} text-white` : "bg-white text-ink/35 ring-1 ring-ink/10"}`}
        >
          <svg
            viewBox="0 0 24 24"
            className="h-6 w-6"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z" />
            <path d="M14 3v5h5M9 13h6M9 17h4" />
          </svg>
        </span>
        <span
          className={`rounded-full bg-white px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider ring-1 ${url ? ac.chip : "text-ink/45 ring-ink/10"}`}
        >
          {url ? "PDF" : t("Pending")}
        </span>
      </div>
      <div className="flex flex-1 flex-col p-5">
        <p
          className={`break-words font-serif text-2xl font-extrabold leading-none tracking-tight max-md:!mx-0 max-md:!text-left ${url ? ac.year : "text-ink/70"}`}
        >
          {r.fy}
        </p>
        <h3 className="mt-2 text-sm font-semibold leading-snug text-ink/75 max-md:!mx-0 max-md:!text-left">{label}</h3>
        {r.description && <p className="mt-1 text-xs leading-relaxed text-ink/55 max-md:!mx-0 max-md:!text-left">{r.description}</p>}
        <div className="mt-auto pt-5">
          {url ? (
            <div className="grid grid-cols-2 gap-2">
              <a
                href={url}
                target="_blank"
                rel="noreferrer"
                aria-label={`${t("View")} ${label}`}
                className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-brand px-3 py-2 text-sm font-semibold text-white transition hover:bg-brand-dark focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
              >
                <svg
                  aria-hidden="true"
                  viewBox="0 0 24 24"
                  className="h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
                {t("View")}
              </a>
              <a
                href={downloadUrl(url)}
                download
                aria-label={`${t("Download")} ${label}`}
                className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-brand/30 bg-white px-3 py-2 text-sm font-semibold text-brand-dark transition hover:border-brand hover:bg-brand-light focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
              >
                <svg
                  aria-hidden="true"
                  viewBox="0 0 24 24"
                  className="h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12 4v11m0 0-4-4m4 4 4-4M5 20h14" />
                </svg>
                {t("Download")}
              </a>
            </div>
          ) : (
            <div className="rounded-lg bg-white px-3 py-2.5 text-center ring-1 ring-ink/10">
              <p className="text-xs font-medium text-ink/50">{t("Report not uploaded yet")}</p>
              <Link href="/transparency#request" className="mt-0.5 inline-block text-xs font-semibold text-brand hover:underline">
                {t("Request a copy")} →
              </Link>
            </div>
          )}
        </div>
      </div>
    </article>
  );
}

export default function AnnualReports() {
  const { t } = useLang();
  const all = useAnnualReports();
  const [newestFirst, setNewestFirst] = useState(false);
  const [onlyAvailable, setOnlyAvailable] = useState(false);
  const available = all.filter((r) => safeUrl(r.file_url)).length;
  const list = useMemo(
    () =>
      all
        .filter((r) => !onlyAvailable || safeUrl(r.file_url))
        // by year; boxes whose name has no year come after the dated ones, in name order
        .sort((a, b) => ((startYear(a.fy) || 9999) - (startYear(b.fy) || 9999) || a.fy.localeCompare(b.fy)) * (newestFirst ? -1 : 1)),
    [all, newestFirst, onlyAvailable]
  );
  const years = all.map((r) => startYear(r.fy)).filter(Boolean);
  const first = Math.min(9999, ...years),
    last = Math.max(0, ...years);
  const seg = (on: boolean) =>
    `rounded-lg px-4 py-2 text-sm font-semibold transition ${on ? "bg-brand text-white shadow-sm" : "text-ink/70 hover:text-ink"}`;
  // the newest year that has a report online
  const latest = all.filter((r) => safeUrl(r.file_url)).sort((a, b) => startYear(b.fy) - startYear(a.fy))[0]?.fy ?? "–";

  return (
    <>
      <PageHero
        eyebrow={t("Transparency & Reports")}
        title={t("Annual Reports")}
        text={t("Two decades of work, accounted for year by year.")}
      />

      <section className="relative isolate overflow-hidden bg-gradient-to-b from-[#f3f8fe] via-white to-[#eef5fd] py-12 md:py-16">
        <div aria-hidden="true" className="pointer-events-none absolute -left-32 top-10 -z-10 h-80 w-80 rounded-full bg-sky/20 blur-3xl" />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-32 bottom-10 -z-10 h-96 w-96 rounded-full bg-brand/10 blur-3xl"
        />
        <div className="container-site">
          <div className="max-w-4xl">
            <p className="eyebrow">{t("Annual Reports")}</p>
            <h2 className="h2 mt-2">{t("Transparent reporting of our work and impact")}</h2>
          </div>

          {/* three figures about the archive */}
          <ul className="mt-7 grid gap-3 sm:grid-cols-3">
            {[
              {
                n: String(all.length),
                l: t("financial years"),
                d: first < 9999 ? `${first} – ${last + 1}` : "",
                icon: "M8 3v3M16 3v3M4 9h16M5 5h14a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1z"
              },
              {
                n: String(available),
                l: t("reports online"),
                d: "PDF",
                icon: "M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8zM14 3v5h5M9 14l2 2 4-4"
              },
              { n: latest, l: t("Latest report"), d: "", icon: "M12 7v5l3 2M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0z" }
            ].map((x) => (
              <li key={x.l} className="flex items-center gap-4 rounded-2xl border border-ink/10 bg-white px-5 py-4 shadow-sm">
                <span aria-hidden="true" className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-brand/10 text-brand">
                  <svg
                    viewBox="0 0 24 24"
                    className="h-6 w-6"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d={x.icon} />
                  </svg>
                </span>
                <div className="min-w-0 max-md:text-left">
                  <p className="text-2xl font-extrabold leading-none tabular-nums text-brand-dark">{x.n}</p>
                  <p className="mt-1 text-xs font-semibold uppercase tracking-wider text-ink/55">
                    {x.l}
                    {x.d ? <span className="font-medium normal-case tracking-normal text-ink/45"> · {x.d}</span> : null}
                  </p>
                </div>
              </li>
            ))}
          </ul>

          {/* filter and sort */}
          <div className="mt-7 flex flex-wrap items-center justify-between gap-3" role="group" aria-label="Show and sort">
            <div className="inline-flex rounded-xl bg-white p-1 shadow-sm ring-1 ring-ink/10">
              <button type="button" className={seg(!onlyAvailable)} aria-pressed={!onlyAvailable} onClick={() => setOnlyAvailable(false)}>
                {t("All years")}
              </button>
              <button type="button" className={seg(onlyAvailable)} aria-pressed={onlyAvailable} onClick={() => setOnlyAvailable(true)}>
                {t("Available reports")}
              </button>
            </div>
            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-ink shadow-sm ring-1 ring-ink/10 transition hover:ring-brand/50"
              onClick={() => setNewestFirst((v) => !v)}
            >
              <span aria-hidden="true">{newestFirst ? "↓" : "↑"}</span> {newestFirst ? t("Newest first") : t("Oldest first")}
            </button>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {list.map((r, i) => (
              <Reveal key={r.fy} delay={Math.min(i, 8) * 60} className="h-full">
                <YearBox r={r} />
              </Reveal>
            ))}
          </div>

          <p className="mt-10 rounded-2xl bg-white p-5 text-sm text-ink/70 shadow-sm ring-1 ring-ink/5">
            {t("Need a report that is not online yet, an audit report or a registration certificate?")}{" "}
            <Link href="/transparency#request" className="font-semibold text-brand hover:underline">
              {t("Request documents")} →
            </Link>
          </p>
        </div>
      </section>
    </>
  );
}
