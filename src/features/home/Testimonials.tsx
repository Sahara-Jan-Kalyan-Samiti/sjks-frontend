"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { testimonials, type Testimonial } from "@/data/content/content";
import { useLiveData } from "@/hooks/useLiveData";
import { useLang } from "@/i18n/LangContext";
import CountUp from "@/components/ui/CountUp";
import Reveal from "@/components/ui/Reveal";

/**
 * Testimonials section (layout after the "Bravio - Testimonials Section" design):
 *  1. label pill + headline + one-line intro
 *  2. two large feature cards, each with a big figure, a short quote and the speaker
 *  3. a sliding row of smaller quote cards with back / next arrows
 *  4. a summary bar with two buttons
 * No photos: every speaker gets a round letter badge, a name line and a programme line.
 * Content comes from src/data/content.ts -> testimonials (first two = feature cards, rest = slider).
 */

function Speaker({ item }: { item: Testimonial }) {
  return (
    <figcaption className="flex items-center gap-3 border-t border-ink/10 pt-5">
      <span
        aria-hidden="true"
        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-brand to-sky-500 text-base font-semibold text-white ring-4 ring-white shadow-md"
      >
        {item.initial}
      </span>
      <span className="min-w-0 text-left">
        <strong className="block text-sm font-semibold leading-snug text-ink">{item.name}</strong>
        <span className="block text-xs leading-snug text-ink/65">{item.program}</span>
      </span>
    </figcaption>
  );
}

/** programme photo banner with a gradient and the programme name on it */
function Photo({ src, label, tall = false }: { src: string; label: string; tall?: boolean }) {
  const { t } = useLang();
  return (
    <div className={`relative w-full overflow-hidden ${tall ? "h-48 sm:h-56" : "h-40 sm:h-44"}`}>
      <img src={src} alt="" loading="lazy" className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
      <span aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-ink/70 via-ink/10 to-transparent" />
      <span className="absolute bottom-3 left-4 inline-flex items-center gap-2 rounded-full bg-white/95 px-3 py-1 text-xs font-semibold text-brand-dark shadow">
        <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-brand" />
        {t(label)}
      </span>
    </div>
  );
}

function QuoteMark({ className = "" }: { className?: string }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 32 32" fill="currentColor" className={className}>
      <path d="M13 6C7.5 8 4 12.5 4 19v7h9v-9H8.5c.2-3 2-5.2 5-6.6L13 6zm15 0c-5.500 2-9 6.500-9 13v7h9v-9h-4.500c.2-3 2-5.200 5-6.600L28 6z" />
    </svg>
  );
}

function Chevron({ dir }: { dir: "left" | "right" }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      width="18"
      height="18"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d={dir === "left" ? "M15 5l-7 7 7 7" : "M9 5l7 7-7 7"} />
    </svg>
  );
}

export default function Testimonials() {
  const { t } = useLang();
  const { stats } = useLiveData();
  const features = testimonials.slice(0, 2);
  const slides = testimonials.slice(2);
  const total = stats.find((s) => s.label.startsWith("Direct"));

  // slider state: arrows are disabled at either end and hidden if everything already fits
  const track = useRef<HTMLDivElement>(null);
  const [edge, setEdge] = useState({ start: true, end: false, overflow: true });
  const measure = useCallback(() => {
    const el = track.current;
    if (!el) return;
    setEdge({
      start: el.scrollLeft <= 4,
      end: el.scrollLeft + el.clientWidth >= el.scrollWidth - 4,
      overflow: el.scrollWidth > el.clientWidth + 4
    });
  }, []);
  useEffect(() => {
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [measure]);
  const slide = (dir: 1 | -1) => {
    const el = track.current;
    if (!el) return;
    const card = el.firstElementChild as HTMLElement | null;
    const step = card ? card.offsetWidth + 20 : el.clientWidth;
    const calm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    el.scrollBy({ left: dir * step, behavior: calm ? "auto" : "smooth" });
  };

  return (
    <section id="testimonials" className="relative overflow-hidden bg-white py-16 md:py-24" aria-labelledby="testimonials-title">
      <div className="container-site relative">
        <Reveal className="mx-auto max-w-3xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-ink/10 bg-white px-4 py-1.5 text-sm font-medium text-ink/80 shadow-sm">
            <span aria-hidden="true" className="h-2 w-2 rounded-full bg-brand" />
            {t("Testimonials")}
          </span>
          <h2
            id="testimonials-title"
            className="mt-4 text-[1.7rem] font-semibold sm:text-3xl leading-tight tracking-tight text-ink md:text-5xl md:leading-[1.1]"
          >
            {t("Stories of Hope, Empowerment & Transformation")}
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-base text-ink/65 md:text-lg">
            {t("Hear from the families and communities our programmes have reached.")}
          </p>
        </Reveal>

        {/* two large feature cards */}
        <Reveal className="mt-10 grid gap-5 md:mt-16 md:grid-cols-2">
          {features.map((f) => {
            const stat = f.statLabel ? stats.find((s) => s.label === f.statLabel) : undefined;
            return (
              <figure
                key={f.name}
                className="group relative flex flex-col justify-between gap-8 overflow-hidden rounded-[28px] border border-brand/10 bg-gradient-to-br from-[#eef4fb] via-[#f3f6fa] to-white pb-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl sm:gap-8 sm:pb-7 md:pb-9"
              >
                {f.image && <Photo src={f.image} label={f.program} tall />}
                <div className="relative px-6 sm:px-7 md:px-10">
                  {stat && (
                    <>
                      <p className="text-5xl font-semibold leading-none tracking-tight text-brand sm:text-6xl md:text-7xl">
                        <CountUp stat={stat} />
                      </p>
                      <p className="mt-3 inline-block rounded-full bg-brand/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-brand">
                        {t(stat.label)}
                      </p>
                    </>
                  )}
                  <blockquote className="mt-6 font-quote text-lg italic sm:mt-8 leading-relaxed text-ink/85 md:text-xl">
                    “{f.quote}”
                  </blockquote>
                </div>
                <div className="px-6 sm:px-7 md:px-10">
                  <Speaker item={f} />
                </div>
              </figure>
            );
          })}
        </Reveal>

        {/* sliding row of smaller cards */}
        <div className="mt-5">
          <div
            ref={track}
            onScroll={measure}
            role="region"
            aria-label={t("More testimonials")}
            tabIndex={0}
            className="no-scrollbar flex snap-x snap-mandatory gap-5 overflow-x-auto scroll-smooth"
          >
            {slides.map((s) => (
              <figure
                key={s.name}
                className="group relative flex shrink-0 basis-full snap-start flex-col justify-between gap-5 overflow-hidden rounded-3xl border border-ink/10 bg-white pb-6 shadow-sm transition duration-300 hover:border-brand/30 hover:shadow-lg md:basis-[calc(50%-10px)]"
              >
                {s.image && <Photo src={s.image} label={s.program} />}
                <div className="px-6 sm:px-7">
                  <QuoteMark className="h-8 w-8 text-brand/30" />
                  <blockquote className="mt-3 font-quote text-base italic leading-relaxed text-ink/85 md:text-lg">“{s.quote}”</blockquote>
                </div>
                <div className="px-6 sm:px-7">
                  <Speaker item={s} />
                </div>
              </figure>
            ))}
          </div>
          {edge.overflow && (
            <div className="mt-5 flex justify-center gap-3">
              <button
                type="button"
                aria-label="Previous testimonial"
                disabled={edge.start}
                onClick={() => slide(-1)}
                className="flex h-11 w-11 items-center justify-center rounded-full border border-ink/15 bg-white text-ink hover:bg-brand-light disabled:cursor-not-allowed disabled:opacity-35"
              >
                <Chevron dir="left" />
              </button>
              <button
                type="button"
                aria-label="Next testimonial"
                disabled={edge.end}
                onClick={() => slide(1)}
                className="flex h-11 w-11 items-center justify-center rounded-full border border-ink/15 bg-white text-ink hover:bg-brand-light disabled:cursor-not-allowed disabled:opacity-35"
              >
                <Chevron dir="right" />
              </button>
            </div>
          )}
        </div>

        {/* summary banner */}
        <div className="relative mt-10 overflow-hidden rounded-[28px] bg-gradient-to-br from-[#0a2f5c] via-[#0b4f9c] to-[#1479d1] px-6 py-8 text-white shadow-[0_24px_60px_-30px_rgba(11,79,156,.7)] md:px-10 md:py-9">
          <span aria-hidden="true" className="pointer-events-none absolute -right-16 -top-20 h-64 w-64 rounded-full bg-white/10" />
          <span aria-hidden="true" className="pointer-events-none absolute -bottom-24 left-1/3 h-56 w-56 rounded-full bg-sky-300/10" />
          <div className="relative flex flex-col items-center justify-between gap-7 text-center lg:flex-row lg:text-left">
            <div className="flex flex-col items-center gap-4 sm:flex-row sm:gap-5">
              <span
                aria-hidden="true"
                className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-white/15 ring-1 ring-white/30"
              >
                <svg
                  viewBox="0 0 24 24"
                  className="h-8 w-8"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.7"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="9" cy="8" r="3" />
                  <path d="M3 19c0-3 2.7-5 6-5s6 2 6 5" />
                  <path d="M16 5.2a3 3 0 010 5.6M17.5 14.3c2 .6 3.5 2.3 3.5 4.7" />
                </svg>
              </span>
              <div>
                {total && (
                  <strong className="block text-4xl font-bold leading-none tracking-tight md:text-5xl">
                    <CountUp stat={total} />
                  </strong>
                )}
                <span className="mt-2 block max-w-sm text-sm text-white/80 md:text-base">{t("people reached through our programmes")}</span>
              </div>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/news"
                className="inline-flex items-center justify-center rounded-full border border-white/40 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                {t("Read more stories")}
              </Link>
              <Link
                href="/donate"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-brand-dark shadow-lg transition hover:-translate-y-0.5 hover:bg-brand-light"
              >
                <svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4 text-rose-500" fill="currentColor">
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                </svg>
                {t("Support our work")}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
