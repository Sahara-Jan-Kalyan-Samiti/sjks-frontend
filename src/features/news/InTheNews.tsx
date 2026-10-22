"use client";

import { useEffect, useState } from "react";
import { pressReports, type PressClipping } from "@/data/content/inTheNews";
import { site } from "@/config/site";
import { useLang } from "@/i18n/LangContext";
import PageHero from "@/components/layout/PageHero";
import Reveal from "@/components/ui/Reveal";
import { fmtDate } from "@/utils/date";

type Clip = PressClipping & { image: string };

/** The clippings column is as wide as it needs for its pictures; the text takes the rest. Class names are written out in full for Tailwind. */
const LAYOUT = ["", "lg:grid-cols-[minmax(0,1fr)_280px]", "lg:grid-cols-[minmax(0,1fr)_440px]", "lg:grid-cols-[minmax(0,1fr)_600px]"];
const CLIP_COLS = ["", "grid-cols-1", "grid-cols-2", "grid-cols-2 sm:grid-cols-3"];

export default function InTheNews() {
  const { t } = useLang();
  const [open, setOpen] = useState<Clip | null>(null);
  const reports = pressReports;

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(null);
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <PageHero
        eyebrow={t("Press Coverage")}
        title={`${t("In the News")} · मीडिया में सहारा`}
        text="From tribal villages in Rehli to a municipal hospital in Mumbai, newspapers across Madhya Pradesh and Maharashtra have reported on Sahara’s work. Select any clipping to read the original report."
      />

      <section className="bg-brand-light/50 py-12 md:py-16">
        <div className="container-site">
          <div className="space-y-6">
            {reports.map((r, i) => {
              const clips = r.clippings.filter((c): c is Clip => !!c.image);
              return (
                <Reveal key={r.id} delay={i * 60}>
                  <article className="overflow-hidden rounded-2xl border border-ink/10 bg-white shadow-sm transition duration-300 hover:border-brand/40 hover:shadow-xl">
                    <div className={`grid gap-6 p-5 sm:p-7 ${LAYOUT[Math.min(clips.length, 3)]}`}>
                      <div>
                        <p className="flex flex-wrap items-center gap-x-3 gap-y-1">
                          <span className="rounded-full bg-brand/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-brand">
                            {r.kicker}
                          </span>
                          <time dateTime={r.date} className="text-xs font-medium text-ink/55">
                            {fmtDate(r.date)}
                          </time>
                        </p>
                        <h2 className="mt-3 font-serif text-xl font-bold leading-snug text-ink sm:text-2xl">{r.title}</h2>
                        <p className="mt-2 border-l-4 border-brand/40 pl-3 text-sm font-medium leading-relaxed text-brand-dark" lang="hi">
                          {r.headlineLocal}
                        </p>
                        <p className="mt-4 leading-relaxed text-ink/70">{r.summary}</p>
                        <p className="mt-4 text-sm text-ink/60">
                          <span className="font-semibold text-ink/80">Covered by:</span> {r.coveredBy}
                        </p>
                      </div>

                      {clips.length > 0 && (
                        <div className={`grid content-start gap-3 ${CLIP_COLS[Math.min(clips.length, 3)]}`}>
                          {clips.map((c) => (
                            <button
                              key={c.image}
                              type="button"
                              onClick={() => setOpen(c)}
                              aria-label={`Open: ${c.alt}`}
                              className="group overflow-hidden rounded-xl border border-ink/10 bg-brand-light/60 text-left transition hover:border-brand/40 hover:shadow-md"
                            >
                              <span className="block h-64 overflow-hidden bg-white">
                                <img
                                  src={`/assets/images/${c.image}`}
                                  alt={c.alt}
                                  loading="lazy"
                                  decoding="async"
                                  className="h-full w-full object-cover object-top transition duration-500 group-hover:scale-[1.03]"
                                />
                              </span>
                              <span className="flex flex-col gap-0.5 px-3 py-2 text-xs">
                                <span className="font-semibold text-ink">{c.paper}</span>
                                <span className="text-ink/55">{c.date}</span>
                              </span>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </article>
                </Reveal>
              );
            })}
            {reports.length === 0 && <p className="py-16 text-center text-ink/60">No reports in this section yet.</p>}
          </div>

          <p className="mt-10 text-center text-sm text-ink/60">
            Media enquiries:{" "}
            <a href={`mailto:${site.email}`} className="font-semibold text-brand">
              {site.email}
            </a>{" "}
            · {site.phone}
            <br />
            <span className="text-xs">Clippings reproduced for reference; copyright rests with the respective publications.</span>
          </p>
        </div>
      </section>

      {open && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={open.alt}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/85 p-4"
        >
          <button
            type="button"
            tabIndex={-1}
            aria-hidden="true"
            onClick={() => setOpen(null)}
            className="absolute inset-0 cursor-default"
          />
          <button
            type="button"
            aria-label="Close"
            onClick={() => setOpen(null)}
            className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/15 text-2xl text-white hover:bg-white/30"
          >
            ×
          </button>
          <figure className="relative max-h-full max-w-4xl overflow-auto">
            <img src={`/assets/images/${open.image}`} alt={open.alt} className="mx-auto max-h-[85vh] w-auto rounded-lg bg-white" />
            <figcaption className="mt-2 text-center text-sm text-white/85">
              {open.paper} · {open.date}
            </figcaption>
          </figure>
        </div>
      )}
    </>
  );
}
