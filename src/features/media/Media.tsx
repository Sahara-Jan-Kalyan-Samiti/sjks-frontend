"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { supabase, supabaseConfigured } from "@/services/supabase";
import { usePageText } from "@/hooks/usePageText";
import { useLang } from "@/i18n/LangContext";
import { site } from "@/config/site";
import { posts } from "@/data/content/news";
import Gallery, { type Photo } from "@/components/sections/Gallery";
import PageHero from "@/components/layout/PageHero";
import { mediaImages } from "@/data/content/slideshows";
import { galleryPhotos } from "@/data/content/galleryPhotos";
import { fmtDate } from "@/utils/date";
/** Published photos from the admin panel (table gallery_photos): uploads first (newest first), then the photos that came with the website.
 *  Empty while loading, or when Supabase is not set up / not reachable. */
function useGalleryPhotos(): Photo[] {
  const [list, setList] = useState<Photo[]>([]);
  useEffect(() => {
    if (!supabaseConfigured || !supabase) return;
    let alive = true;
    supabase
      .from("gallery_photos")
      .select("image_url, caption, category")
      .eq("published", true)
      .order("created_at", { ascending: false })
      .order("id", { ascending: false })
      .then(({ data, error }) => {
        if (alive && !error && data) setList(data.map((p) => ({ file: p.image_url, alt: p.caption || p.category, cat: p.category })));
      });
    return () => {
      alive = false;
    };
  }, []);
  return list;
}
interface Video {
  youtube_id: string;
  title: string;
  description?: string;
  /** chosen in the admin panel as the large tile */ featured?: boolean;
}
const videoFrame = "aspect-video overflow-hidden rounded-2xl border bg-black shadow";

/** Published videos from the admin panel (table gallery_videos). Empty while loading, or when Supabase is not set up / not reachable. */
function useGalleryVideos(): Video[] {
  const [videos, setVideos] = useState<Video[]>([]);
  useEffect(() => {
    if (!supabaseConfigured || !supabase) return;
    let alive = true;
    // "*" rather than a column list, so the gallery keeps working if the description column has not been added yet
    supabase
      .from("gallery_videos")
      .select("*")
      .eq("published", true)
      .order("created_at")
      .order("id")
      .then(({ data, error }) => {
        if (alive && !error && data) setVideos(data as Video[]);
      });
    return () => {
      alive = false;
    };
  }, []);
  return videos;
}

/** One small video: its YouTube thumbnail with a play button; the player itself only loads when it is clicked. */
function VideoCard({ v }: { v: Video }) {
  const [playing, setPlaying] = useState(false);
  const label = v.title || "Sahara Jan Kalyan Samiti video";
  return (
    <figure>
      <div className={`group relative ${videoFrame} transition duration-300 hover:-translate-y-1 hover:shadow-xl`}>
        {playing ? (
          <iframe
            title={label}
            src={`https://www.youtube-nocookie.com/embed/${v.youtube_id}?autoplay=1&rel=0`}
            allowFullScreen
            className="h-full w-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          />
        ) : (
          <button type="button" onClick={() => setPlaying(true)} aria-label={`Play video: ${label}`} className="block h-full w-full">
            <img
              src={`https://i.ytimg.com/vi/${v.youtube_id}/hqdefault.jpg`}
              alt=""
              loading="lazy"
              decoding="async"
              className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
            />
            <span aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent" />
            <span
              aria-hidden="true"
              className="absolute left-1/2 top-1/2 flex h-14 w-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-[#ff0000] text-white shadow-lg transition duration-300 group-hover:scale-110"
            >
              <svg viewBox="0 0 24 24" className="ml-0.5 h-6 w-6" fill="currentColor">
                <path d="M8 5v14l11-7z" />
              </svg>
            </span>
          </button>
        )}
      </div>
      {(v.title || v.description) && (
        <figcaption className="mt-2.5">
          {v.title && <span className="block font-semibold leading-snug text-ink">{v.title}</span>}
          {v.description && (
            <span className="justified mt-1 block whitespace-pre-line text-sm leading-relaxed text-ink/70">{v.description}</span>
          )}
        </figcaption>
      )}
    </figure>
  );
}

/** YouTube thumbnail: the large one when the video has it, otherwise the standard one (YouTube answers a missing large one with a tiny grey picture). */
function VideoThumb({ id, className }: { id: string; className: string }) {
  const [small, setSmall] = useState(false);
  return (
    <img
      src={`https://i.ytimg.com/vi/${id}/${small ? "hqdefault" : "maxresdefault"}.jpg`}
      alt=""
      loading="lazy"
      decoding="async"
      className={className}
      onLoad={(e) => {
        if (!small && e.currentTarget.naturalWidth <= 120) setSmall(true);
      }}
      onError={() => setSmall(true)}
    />
  );
}

/** Two or more videos: the same bento grid as the photo gallery (tiles ticked Large video in the admin panel are big). A tile opens the video in a full-screen player. */
function VideoGrid({ videos }: { videos: Video[] }) {
  const [open, setOpen] = useState<number | null>(null);
  const step = useCallback((d: number) => setOpen((i) => (i === null ? i : (i + d + videos.length) % videos.length)), [videos.length]);
  useEffect(() => {
    if (open === null) return;
    const key = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(null);
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    };
    document.addEventListener("keydown", key);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", key);
      document.body.style.overflow = prev;
    };
  }, [open, step]);
  const cur = open !== null ? videos[open] : null;
  const name = (v: Video) => v.title || "Sahara Jan Kalyan Samiti video";
  return (
    <>
      <div className="mt-6 grid auto-rows-[150px] grid-flow-dense grid-cols-2 gap-3 sm:auto-rows-[190px] md:grid-cols-3 md:gap-4 lg:auto-rows-[220px] lg:grid-cols-4">
        {videos.map((v, i) => {
          // only tiles ticked "Large video" in the admin panel are big; nothing is large by default
          const big = !!v.featured;
          const wide = false;
          return (
            <button
              key={v.youtube_id}
              type="button"
              onClick={() => setOpen(i)}
              aria-label={`Play video: ${name(v)}`}
              className={`group relative block overflow-hidden rounded-2xl bg-black shadow-sm ring-1 ring-ink/5 transition duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-brand/20 ${big ? "col-span-2 row-span-2" : ""} ${wide ? "md:col-span-2" : ""}`}
            >
              <VideoThumb
                id={v.youtube_id}
                className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-110"
              />
              <span aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-[#061a36]/90 via-[#061a36]/15 to-transparent" />
              <span
                aria-hidden="true"
                className={`absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-[#ff0000] text-white shadow-lg transition duration-300 group-hover:scale-110 ${big ? "h-16 w-16" : "h-11 w-11"}`}
              >
                <svg viewBox="0 0 24 24" className={`ml-0.5 ${big ? "h-7 w-7" : "h-5 w-5"}`} fill="currentColor">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </span>
              {v.title && (
                <span
                  className={`absolute inset-x-0 bottom-0 line-clamp-2 p-3 text-left font-semibold leading-snug text-white ${big ? "text-base sm:p-4 sm:text-lg" : "text-xs sm:text-sm"}`}
                >
                  {v.title}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {cur && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={name(cur)}
          className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-[#030d1e]/95 p-4 backdrop-blur-sm"
          onClick={() => setOpen(null)}
        >
          <button
            type="button"
            aria-label="Close"
            onClick={() => setOpen(null)}
            className="absolute right-4 top-4 z-10 h-11 w-11 rounded-full bg-white/10 text-2xl text-white transition hover:bg-white/25"
          >
            ×
          </button>
          <button
            type="button"
            aria-label="Previous video"
            onClick={(e) => {
              e.stopPropagation();
              step(-1);
            }}
            className="absolute left-3 top-1/2 z-10 hidden h-12 w-12 -translate-y-1/2 rounded-full bg-white/10 text-2xl text-white transition hover:bg-white/25 sm:block"
          >
            ‹
          </button>
          <figure className="my-auto w-full max-w-4xl sm:px-14" onClick={(e) => e.stopPropagation()}>
            <div className="aspect-video overflow-hidden rounded-2xl bg-black shadow-2xl ring-1 ring-white/15">
              <iframe
                key={cur.youtube_id}
                title={name(cur)}
                src={`https://www.youtube-nocookie.com/embed/${cur.youtube_id}?autoplay=1&rel=0`}
                allowFullScreen
                className="h-full w-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              />
            </div>
            <figcaption className="mt-4 text-center text-white">
              {cur.title && <p className="font-semibold sm:text-lg">{cur.title}</p>}
              {cur.description && (
                <p className="mx-auto mt-2 max-h-28 max-w-2xl overflow-y-auto whitespace-pre-line text-sm leading-relaxed text-white/80">
                  {cur.description}
                </p>
              )}
              <p className="mt-2 text-xs text-white/50">
                {(open ?? 0) + 1} / {videos.length}
              </p>
            </figcaption>
          </figure>
          <button
            type="button"
            aria-label="Next video"
            onClick={(e) => {
              e.stopPropagation();
              step(1);
            }}
            className="absolute right-3 top-1/2 z-10 hidden h-12 w-12 -translate-y-1/2 rounded-full bg-white/10 text-2xl text-white transition hover:bg-white/25 sm:block"
          >
            ›
          </button>
        </div>
      )}
    </>
  );
}

export default function Media() {
  const { t } = useLang();
  const c = usePageText();
  const videos = useGalleryVideos();
  const added = useGalleryPhotos();
  const uploads = `https://www.youtube.com/embed/videoseries?list=${site.youtubeChannelId.replace(/^UC/, "UU")}`;
  return (
    <>
      <PageHero images={mediaImages} eyebrow={t("Media & Gallery")} title={c("media.hero.title")} text={c("media.hero.text")} />
      <section id="photo-gallery" className="container-site py-16">
        <h2 className="h2">{c("media.photos.title")}</h2>
        {/* the list kept in the admin panel (Media & Gallery -> Photos); the built-in list below is only used until that has loaded or if it cannot be reached */}
        <Gallery photos={added.length ? added : galleryPhotos} />
      </section>
      <section id="video-gallery" className="bg-slate-50 py-16">
        <div className="container-site">
          <h2 className="h2">{c("media.videos.title")}</h2>
          <p className="mt-2 max-w-2xl text-ink/70">
            Watch our work in the field: stories, events and messages from the communities we serve.
          </p>
          {/* Videos added in the admin panel (Media & Gallery -> Videos), oldest first. Two or more: a bento grid like the photo gallery,
              large only where ticked in the admin. Exactly one: a single card with its description. Until any are added (or if the database cannot be
              reached) the channel's latest uploads are shown in one small player. */}
          {videos.length > 1 ? (
            <VideoGrid videos={videos} />
          ) : (
            <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {videos.length === 1 ? (
                <VideoCard v={videos[0]} />
              ) : (
                <div className={videoFrame}>
                  <iframe
                    title="Sahara Jan Kalyan Samiti YouTube videos"
                    src={uploads}
                    loading="lazy"
                    allowFullScreen
                    className="h-full w-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  />
                </div>
              )}
            </div>
          )}
          <div className="mt-5 flex flex-wrap gap-3">
            <a className="btn btn-brand" href={site.social.youtube} target="_blank" rel="noreferrer">
              ▶ {t("Watch on YouTube")}
            </a>
          </div>
        </div>
      </section>
      <section id="press-news" className="container-site py-16">
        <div className="flex flex-wrap items-end justify-between gap-3 border-b border-ink/10 pb-4">
          <h2 className="h2">{c("media.press.title")}</h2>
          <Link
            href="/news"
            className="group inline-flex items-center gap-1.5 rounded-full border border-brand/30 px-4 py-1.5 text-sm font-semibold text-brand transition hover:bg-brand hover:text-white"
          >
            {t("Latest News")}{" "}
            <span aria-hidden="true" className="transition-transform group-hover:translate-x-1">
              →
            </span>
          </Link>
        </div>
        <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((p) => (
            <Link
              key={p.slug}
              href={`/news/${p.slug}`}
              className="group relative flex flex-col overflow-hidden rounded-2xl border border-ink/10 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-brand/40 hover:shadow-xl"
            >
              <span
                aria-hidden="true"
                className="absolute inset-x-0 top-0 h-1 origin-left scale-x-0 bg-gradient-to-r from-brand to-sky-400 transition-transform duration-300 group-hover:scale-x-100"
              />
              <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-brand/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-brand-dark">
                <svg
                  aria-hidden="true"
                  viewBox="0 0 24 24"
                  className="h-3.5 w-3.5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="3.5" y="5" width="17" height="15" rx="2" />
                  <path d="M8 3v4M16 3v4M3.5 10h17" />
                </svg>
                {fmtDate(p.date)}
              </span>
              <h3 className="mt-4 font-serif text-lg font-bold leading-snug text-ink transition-colors group-hover:text-brand-dark">
                {p.title}
              </h3>
              <p className="mb-5 mt-2 line-clamp-3 text-left text-sm leading-relaxed text-ink/65">{p.excerpt}</p>
              <span className="mt-auto flex items-center gap-1.5 border-t border-ink/10 pt-4 text-sm font-semibold text-brand">
                Read story{" "}
                <span aria-hidden="true" className="transition-transform group-hover:translate-x-1">
                  →
                </span>
              </span>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
