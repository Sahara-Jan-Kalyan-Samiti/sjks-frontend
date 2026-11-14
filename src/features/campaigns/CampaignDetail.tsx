"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useCampaigns, useDaysLeft } from "@/hooks/useCampaigns";
import { useShareUrl } from "@/hooks/useShareUrl";
import { useLang } from "@/i18n/LangContext";
import { blogBlocks, blogDate } from "@/data/content/blog";
import { campaignStats, donateLink, rupees, type CampaignPage, type CampaignPhoto } from "@/data/content/campaigns";
import { site } from "@/config/site";
import PageHero from "@/components/layout/PageHero";
import DonateButton from "@/components/ui/DonateButton";
import Reveal from "@/components/ui/Reveal";
import NotFound from "@/features/NotFound";
import { CampaignCard } from "./Campaigns";
import { PinIcon, pickPhoto, ProgressBar, StatusPill, useDaysText } from "./shared";

const card = "rounded-3xl border border-ink/10 bg-white p-6 shadow-[0_18px_40px_-30px_rgba(11,61,122,.45)] sm:p-8";
const h2 = "flex items-center gap-3 font-serif text-xl font-bold text-ink sm:text-2xl";

function SectionTitle({ children }: { children: string }) {
  return (
    <h2 className={h2}>
      <span aria-hidden="true" className="h-6 w-1.5 rounded-full bg-gradient-to-b from-brand to-sky-400" />
      {children}
    </h2>
  );
}

/** Photos of a campaign: a grid of thumbnails, each opening a full-size view with captions and arrow keys. */
function Gallery({ photos }: { photos: CampaignPhoto[] }) {
  const { t } = useLang();
  const [open, setOpen] = useState<number | null>(null);
  const opener = useRef<HTMLButtonElement | null>(null);
  const close = () => {
    setOpen(null);
    const el = opener.current;
    requestAnimationFrame(() => el?.focus());
  };
  return (
    <>
      <ul className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
        {photos.map((p, i) => (
          <li key={p.url + i} className={i === 0 && photos.length > 2 ? "col-span-2 row-span-2" : ""}>
            <button
              type="button"
              onClick={(e) => {
                opener.current = e.currentTarget;
                setOpen(i);
              }}
              aria-label={`${t("Open photo")} ${i + 1} / ${photos.length}${p.caption ? `: ${p.caption}` : ""}`}
              className="group block h-full w-full overflow-hidden rounded-2xl bg-brand-light"
            >
              <img
                src={p.url}
                alt={p.caption}
                loading="lazy"
                decoding="async"
                className={`w-full object-cover transition duration-500 group-hover:scale-105 motion-reduce:transition-none motion-reduce:group-hover:scale-100 ${i === 0 && photos.length > 2 ? "h-full min-h-[14rem]" : "aspect-[4/3]"}`}
              />
            </button>
          </li>
        ))}
      </ul>
      {open !== null && <Lightbox photos={photos} index={open} onIndex={setOpen} onClose={close} />}
    </>
  );
}

function Lightbox({
  photos,
  index,
  onIndex,
  onClose
}: {
  photos: CampaignPhoto[];
  index: number;
  onIndex: (i: number) => void;
  onClose: () => void;
}) {
  const { t } = useLang();
  const box = useRef<HTMLDivElement>(null);
  const n = photos.length;
  const p = photos[index];
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    box.current?.querySelector<HTMLButtonElement>("button:not([aria-hidden])")?.focus();
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      else if (e.key === "ArrowLeft") onIndex((index - 1 + n) % n);
      else if (e.key === "ArrowRight") onIndex((index + 1) % n);
      else if (e.key === "Tab" && box.current) {
        // keep the focus inside the viewer
        const items = [...box.current.querySelectorAll<HTMLButtonElement>("button:not([aria-hidden])")];
        const first = items[0],
          last = items[items.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [index, n, onClose, onIndex]);
  const nav =
    "absolute top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/15 text-2xl text-white backdrop-blur transition hover:bg-white/30 focus-visible:outline focus-visible:outline-2 focus-visible:outline-white";
  return (
    <div
      ref={box}
      role="dialog"
      aria-modal="true"
      aria-label={t("Photos")}
      className="fixed inset-0 z-[70] flex items-center justify-center bg-[#061a36]/90 p-4 backdrop-blur-sm"
    >
      {/* a click outside the photo closes the viewer; the Close button is the keyboard way to do it */}
      <button type="button" tabIndex={-1} aria-hidden="true" onClick={onClose} className="absolute inset-0 cursor-default" />
      <button
        type="button"
        onClick={onClose}
        aria-label={t("Close")}
        className="absolute right-4 top-4 flex h-11 w-11 items-center justify-center rounded-full bg-white/15 text-xl text-white backdrop-blur transition hover:bg-white/30 focus-visible:outline focus-visible:outline-2 focus-visible:outline-white"
      >
        ✕
      </button>
      {n > 1 && (
        <>
          <button
            type="button"
            onClick={() => onIndex((index - 1 + n) % n)}
            aria-label={t("Previous photo")}
            className={`${nav} left-3 sm:left-6`}
          >
            ‹
          </button>
          <button
            type="button"
            onClick={() => onIndex((index + 1) % n)}
            aria-label={t("Next photo")}
            className={`${nav} right-3 sm:right-6`}
          >
            ›
          </button>
        </>
      )}
      <figure className="flex max-h-full max-w-5xl flex-col items-center px-12 sm:px-16">
        <img src={p.url} alt={p.caption} className="max-h-[78vh] w-auto max-w-full rounded-xl object-contain shadow-2xl" />
        <figcaption className="mt-3 text-center text-sm text-white/85" aria-live="polite">
          {p.caption && <span className="block">{p.caption}</span>}
          <span className="text-white/60">
            {index + 1} / {n}
          </span>
        </figcaption>
      </figure>
    </div>
  );
}

function Updates({ c }: { c: CampaignPage }) {
  return (
    <ol className="mt-6 space-y-0 border-l-2 border-brand/20 pl-6">
      {c.updates.map((u, i) => (
        <li key={u.date + i} className="relative pb-8 last:pb-0">
          <span
            aria-hidden="true"
            className="absolute -left-[33px] top-1.5 h-4 w-4 rounded-full border-4 border-white bg-brand shadow ring-2 ring-brand/30"
          />
          <time dateTime={u.date} className="text-xs font-semibold uppercase tracking-wider text-brand-dark">
            {blogDate(u.date)}
          </time>
          {u.title && <h3 className="mt-1 font-serif text-lg font-bold leading-snug text-ink">{u.title}</h3>}
          {u.text && <p className="mt-1.5 whitespace-pre-line leading-relaxed text-ink/75">{u.text}</p>}
        </li>
      ))}
    </ol>
  );
}

function Documents({ c }: { c: CampaignPage }) {
  const { t } = useLang();
  return (
    <ul className="mt-6 grid gap-3 sm:grid-cols-2">
      {c.documents.map((d, i) => (
        <li key={d.url + i} className="flex items-center gap-4 rounded-2xl border border-ink/10 bg-[#f6f9fc] p-4">
          <span aria-hidden="true" className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-rose-50 text-rose-600">
            <svg
              viewBox="0 0 24 24"
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.7"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M7 3h8l4 4v14H7z" />
              <path d="M14 3v5h5M10 14h6M10 17.5h4" />
            </svg>
          </span>
          <div className="min-w-0 flex-1">
            <p className="break-words font-semibold leading-snug text-ink">{d.name}</p>
            <p className="mt-0.5 text-xs font-semibold uppercase tracking-wider text-ink/55">PDF</p>
          </div>
          <div className="flex shrink-0 flex-col gap-1.5 text-sm font-semibold sm:flex-row">
            <a
              href={d.url}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full bg-white px-3.5 py-1.5 text-brand-dark ring-1 ring-brand/25 transition hover:bg-brand-light"
            >
              {t("Open")}
            </a>
            <a
              href={d.url}
              download
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full bg-brand px-3.5 py-1.5 text-white transition hover:bg-brand-dark"
            >
              {t("Download")}
            </a>
          </div>
        </li>
      ))}
    </ul>
  );
}

const shield = <path d="M12 3 5 6v5c0 4.5 3 8 7 10 4-2 7-5.5 7-10V6l-7-3Zm-3 9 2 2 4-4" />;
const receipt = (
  <>
    <path d="M7 3h8l4 4v14H7z" />
    <path d="M14 3v5h5M10 13h6M10 17h6" />
  </>
);
const badge = (
  <>
    <circle cx="12" cy="9" r="5" />
    <path d="m9 13.5-1.5 7L12 18l4.5 2.5-1.5-7" />
  </>
);

/** The money box: raised, goal, still needed (goal minus raised), deadline, Donate, share and trust notes. */
function FundraiserCard({ c, days, daysText, url }: { c: CampaignPage; days: number | null; daysText: string | null; url: string }) {
  const { t } = useLang();
  const s = campaignStats(c);
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* ignore */
    }
  };
  const ended = days !== null && days < 0;
  return (
    <div className="overflow-hidden rounded-3xl border border-ink/10 bg-white shadow-[0_24px_60px_-28px_rgba(11,61,122,.55)]">
      <div className="h-1.5 bg-gradient-to-r from-brand via-sky-400 to-brand-dark" aria-hidden="true" />
      <div className="p-6 sm:p-7">
        {(s.reached || ended) && (
          <p
            role="status"
            className={`mb-5 rounded-2xl px-4 py-3 text-sm font-semibold leading-snug ${s.reached ? "bg-emerald-50 text-emerald-800" : "bg-amber-50 text-amber-800"}`}
          >
            {s.reached
              ? t("Goal reached. Thank you to everyone who gave!")
              : t("This campaign has ended. You can still support our other work.")}
          </p>
        )}
        <p className="text-xs font-semibold uppercase tracking-wider text-ink/65">{t("Raised so far")}</p>
        <p className="num-gradient mt-1 text-4xl font-extrabold tabular-nums leading-none sm:text-[2.6rem]">{rupees(s.raised)}</p>
        <div className="mt-5">
          <ProgressBar pct={s.pct} label={`${c.title}: ${s.pct}%`} tall />
          <p className="mt-2 flex justify-between text-xs font-semibold text-ink/65">
            <span>
              {s.pct}% {t("funded")}
            </span>
            {daysText && <span className={ended ? "text-amber-700" : "text-brand-dark"}>{daysText}</span>}
          </p>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-3 text-sm">
          <div className="rounded-xl bg-brand-light/60 px-3 py-2.5">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-ink/65">{t("Goal")}</p>
            <p className="mt-0.5 text-base font-bold tabular-nums text-brand-dark">{rupees(s.goal)}</p>
          </div>
          <div className="rounded-xl bg-ink/[.04] px-3 py-2.5">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-ink/65">{t("Still needed")}</p>
            <p className="mt-0.5 text-base font-bold tabular-nums text-ink">{rupees(s.left)}</p>
          </div>
        </div>

        <DonateButton to={donateLink(c)} size="lg" full className="mt-6">
          {t("Donate to this campaign")}
        </DonateButton>

        <div className="mt-5 flex flex-wrap items-center gap-2 border-t border-ink/10 pt-5 text-sm">
          <span className="mr-1 font-semibold text-ink/70">{t("Share")}:</span>
          <a
            className="rounded-full bg-[#25D366] px-3.5 py-1.5 font-semibold text-white transition hover:-translate-y-0.5 hover:shadow-md motion-reduce:transition-none"
            target="_blank"
            rel="noreferrer"
            href={`https://wa.me/?text=${encodeURIComponent(c.title + " " + url)}`}
          >
            WhatsApp
          </a>
          <a
            className="rounded-full bg-[#1877F2] px-3.5 py-1.5 font-semibold text-white transition hover:-translate-y-0.5 hover:shadow-md motion-reduce:transition-none"
            target="_blank"
            rel="noreferrer"
            href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`}
          >
            Facebook
          </a>
          <button
            type="button"
            onClick={copy}
            className="rounded-full border border-ink/15 px-3.5 py-1.5 font-semibold transition hover:border-brand hover:text-brand"
          >
            {copied ? "Copied ✓" : t("Copy link")}
          </button>
        </div>
      </div>

      <ul className="space-y-3 border-t border-ink/10 bg-[#f6f9fc] p-6 text-sm text-ink/75 sm:px-7">
        {[
          { icon: shield, text: t("Secure online payment through Razorpay") },
          { icon: receipt, text: t("80G receipt when you give your PAN") },
          { icon: badge, text: `${site.name} · ${site.taxNotice}` }
        ].map((x) => (
          <li key={x.text} className="flex items-start gap-3">
            <span
              aria-hidden="true"
              className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand/10 text-brand"
            >
              <svg
                viewBox="0 0 24 24"
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                {x.icon}
              </svg>
            </span>
            <span className="leading-snug">{x.text}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function CampaignDetail({ slug, initialCampaigns }: { slug: string; initialCampaigns?: CampaignPage[] }) {
  const { t } = useLang();
  const list = useCampaigns(initialCampaigns);
  const url = useShareUrl();
  const c = list?.find((x) => x.slug === slug);
  const days = useDaysLeft(c?.endDate ?? null);
  const daysText = useDaysText(days);
  // the phone bar steps aside when the footer comes into view, so it never covers the footer
  const [footerSeen, setFooterSeen] = useState(false);
  useEffect(() => {
    const footer = document.querySelector("footer");
    if (!footer || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(([e]) => setFooterSeen(e.isIntersecting));
    io.observe(footer);
    return () => io.disconnect();
  }, [c?.slug]);
  if (!list)
    return (
      <p role="status" className="container-site py-24 text-center text-ink/65">
        {t("Loading…")}
      </p>
    );
  if (!c) return <NotFound />;

  const s = campaignStats(c);
  const blocks = blogBlocks(c.story || c.description);
  const more = list.filter((x) => x.slug !== c.slug).slice(0, 3);
  const details: [string, string][] = [
    ...(c.location ? ([["Location", c.location]] as [string, string][]) : []),
    ...(c.beneficiaries ? ([["Who it helps", c.beneficiaries]] as [string, string][]) : []),
    ...(c.endDate ? ([["Last day to give", blogDate(c.endDate)]] as [string, string][]) : []),
    ["Organised by", site.name]
  ];

  return (
    <>
      <PageHero
        eyebrow={`${t("Fundraiser")}${c.cause ? ` · ${t(c.cause)}` : ""}`}
        title={c.title}
        text={c.description || undefined}
        images={[c.cover || pickPhoto(c.title)]}
      />

      <section className="bg-gradient-to-b from-[#f3f8fe] via-white to-[#eef5fd] pb-28 pt-8 lg:pb-16">
        <div className="container-site">
          <div className="flex flex-wrap items-center justify-between gap-3 text-sm">
            <Link href="/campaigns" className="font-semibold text-brand-dark hover:text-brand">
              ← {t("All campaigns")}
            </Link>
            <div className="flex flex-wrap items-center gap-3 text-ink/70">
              {c.location && (
                <span className="inline-flex items-center gap-1.5">
                  <PinIcon />
                  {c.location}
                </span>
              )}
              <StatusPill reached={s.reached} days={days} />
            </div>
          </div>

          <div className="mt-6 grid gap-8 lg:grid-cols-[minmax(0,1fr)_23.5rem] lg:gap-10 xl:grid-cols-[minmax(0,1fr)_25rem]">
            <aside className="order-first lg:order-none lg:col-start-2 lg:row-start-1 lg:-mt-36">
              <div className="lg:sticky lg:top-24">
                <FundraiserCard c={c} days={days} daysText={daysText} url={url} />
              </div>
            </aside>

            <div className="min-w-0 space-y-6 lg:col-start-1 lg:row-start-1">
              <Reveal>
                <article className={card}>
                  <SectionTitle>{t("About this campaign")}</SectionTitle>
                  <div className="mt-5 max-w-[44rem] text-[1.0625rem] leading-[1.85] text-ink/85">
                    {blocks.map((b, i) =>
                      b.kind === "h" ? (
                        <h3
                          key={i}
                          className="mb-3 mt-9 border-l-4 border-brand pl-4 text-left font-serif text-lg font-bold leading-snug text-ink first:mt-0 sm:text-xl"
                        >
                          {b.text}
                        </h3>
                      ) : b.kind === "quote" ? (
                        <blockquote
                          key={i}
                          className="my-7 rounded-2xl border border-brand/15 bg-gradient-to-br from-brand-light to-white px-6 py-6 text-left font-quote text-lg italic leading-relaxed text-brand-dark sm:px-8 sm:text-xl"
                        >
                          {b.text}
                        </blockquote>
                      ) : (
                        <p key={i} className="mt-4 whitespace-pre-line text-left first:mt-0">
                          {b.text}
                        </p>
                      )
                    )}
                  </div>
                </article>
              </Reveal>

              {c.gallery.length > 0 && (
                <Reveal>
                  <section className={card} aria-labelledby="campaign-photos">
                    <h2 id="campaign-photos" className={h2}>
                      <span aria-hidden="true" className="h-6 w-1.5 rounded-full bg-gradient-to-b from-brand to-sky-400" />
                      {t("Photos")}
                    </h2>
                    <Gallery photos={c.gallery} />
                  </section>
                </Reveal>
              )}

              {c.updates.length > 0 && (
                <Reveal>
                  <section className={card}>
                    <SectionTitle>{t("Updates from the field")}</SectionTitle>
                    <Updates c={c} />
                  </section>
                </Reveal>
              )}

              {c.documents.length > 0 && (
                <Reveal>
                  <section className={card}>
                    <SectionTitle>{t("Documents")}</SectionTitle>
                    <p className="mt-2 text-sm text-ink/65">{t("Estimates, reports and approvals related to this campaign.")}</p>
                    <Documents c={c} />
                  </section>
                </Reveal>
              )}

              <Reveal>
                <section className={card}>
                  <SectionTitle>{t("Campaign details")}</SectionTitle>
                  <dl className="mt-5 grid gap-x-8 gap-y-4 sm:grid-cols-2">
                    {details.map(([k, v]) => (
                      <div key={k} className="border-b border-ink/10 pb-3">
                        <dt className="text-xs font-semibold uppercase tracking-wider text-ink/60">{t(k)}</dt>
                        <dd className="mt-1 font-medium text-ink">{v}</dd>
                      </div>
                    ))}
                  </dl>
                </section>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {more.length > 0 && (
        <section className="bg-gradient-to-b from-[#eef5fd] to-white py-12 md:py-16">
          <div className="container-site">
            <div className="flex flex-wrap items-end justify-between gap-3">
              <h2 className="h2">{t("More campaigns")}</h2>
              <Link href="/campaigns" className="text-sm font-semibold text-brand-dark hover:text-brand">
                {t("See all campaigns")} →
              </Link>
            </div>
            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {more.map((x) => (
                <CampaignCard key={x.slug} c={x} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* phones: the progress and the Donate button stay at the bottom of the screen */}
      <div
        className={`fixed inset-x-0 bottom-0 z-30 border-t border-ink/10 bg-white/95 shadow-[0_-10px_30px_-12px_rgba(11,61,122,.35)] backdrop-blur transition-transform duration-300 motion-reduce:transition-none lg:hidden ${footerSeen ? "translate-y-full" : ""}`}
      >
        <div aria-hidden="true" className="h-1 bg-brand-light">
          <div className="h-full bg-gradient-to-r from-brand to-sky-400" style={{ width: `${s.pct}%` }} />
        </div>
        <div className="flex items-center justify-between gap-3 py-3 pl-4 pr-20">
          <p className="min-w-0 leading-tight">
            <span className="block truncate text-base font-extrabold tabular-nums text-brand-dark">{rupees(s.raised)}</span>
            <span className="text-[11px] font-semibold text-ink/65">
              {s.pct}% {t("funded")} · {rupees(s.left)} {t("Still needed")}
            </span>
          </p>
          <DonateButton to={donateLink(c)} size="sm" className="shrink-0">
            {t("Donate")}
          </DonateButton>
        </div>
      </div>
    </>
  );
}
