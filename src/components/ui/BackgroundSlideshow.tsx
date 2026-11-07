"use client";

import { useEffect, useRef, useState } from "react";

interface Props {
  /** Image paths in display order (see src/data/slideshows.ts). */
  images: string[];
  /** Time each image stays on screen, in ms. */
  interval?: number;
  /** Time the first image stays before cycling starts, in ms. If omitted, uses `interval`. */
  initialInterval?: number;
  /** Time the `fallback` image stays on screen before the first slide comes in, in ms. */
  startDelay?: number;
  /** Crossfade length, in ms. */
  duration?: number;
  /** Optional image shown underneath while the slides load (keeps the original look, no blank flash). */
  fallback?: string;
  /** A smaller picture of the `fallback` for phones (same scene, cropped to what a phone shows), so the first photo downloads quickly. */
  fallbackMobile?: string;
  /** Classes for the wrapper (it fills its parent by default). */
  className?: string;
  /** Classes for each <img>, e.g. an object-position. */
  imgClassName?: string;
  /** Extra classes for single images, keyed by image path (e.g. a different object-position per photo). */
  imgClassNames?: Record<string, string>;
  /** "fade" = crossfade (default). "shift" = the old photo slides out to the left while the next slides in from the right. */
  effect?: "fade" | "shift";
  /** Optional overlay classes drawn above the images (e.g. a blue gradient). */
  overlayClassName?: string;
}

/** Pause between two photo downloads, in ms. */
const LOAD_GAP = 2500;

/** Loads one image; resolves to its path, or null if the file is missing. */
const load = (src: string) =>
  new Promise<string | null>((resolve) => {
    const img = new Image();
    img.onload = () => resolve(src);
    img.onerror = () => resolve(null);
    img.src = src;
  });

/**
 * Background slideshow with a smooth crossfade (or a sideways shift). Fills its positioned parent and never changes its size,
 * so text on top stays still. Missing files are skipped; motion stops for visitors who prefer reduced motion.
 */
export default function BackgroundSlideshow({
  images,
  interval = 5000,
  initialInterval,
  startDelay = 0,
  duration = 1200,
  fallback,
  fallbackMobile,
  className = "",
  imgClassName = "",
  imgClassNames = {},
  effect = "fade",
  overlayClassName
}: Props) {
  const [slides, setSlides] = useState<string[]>([]);
  // index = slide fading in / on screen (-1 before the first one appears); prev = slide still showing underneath it
  const [{ index, prev }, setPos] = useState({ index: -1, prev: -1 });
  const [hasStartedCycle, setHasStartedCycle] = useState(false);
  const mountedAt = useRef(performance.now());
  const key = images.join("|");

  // load the images one by one (each is fully loaded before it is added, so a slide is never shown half-loaded).
  // When a `fallback` photo is shown first (the home page hero), the slides start loading a few seconds after the page has loaded, so five
  // more photos do not compete with that first photo for the connection (it is the largest thing on screen and decides how fast the page feels).
  useEffect(() => {
    let alive = true;
    let started = false;
    setPos({ index: -1, prev: -1 });
    const start = () => {
      if (started) return;
      started = true;
      // one photo at a time, with a pause between: the cycle shows a photo every few seconds, so there is no need to download them all
      // at once (that would use up a phone's connection and processor while the page is still becoming usable)
      (async () => {
        const found: string[] = [];
        for (const src of images) {
          if (!alive) return;
          const ok = await load(src);
          if (!alive) return;
          if (ok) {
            found.push(ok);
            setSlides([...found]);
          }
          await new Promise((r) => window.setTimeout(r, LOAD_GAP));
        }
      })();
    };
    let cleanup = () => {};
    if (fallback) {
      let timer = 0;
      const onLoad = () => {
        timer = window.setTimeout(start, 3000);
      };
      if (document.readyState === "complete") onLoad();
      else window.addEventListener("load", onLoad, { once: true });
      const failsafe = window.setTimeout(start, 7000); // never wait forever if something on the page hangs
      cleanup = () => {
        window.removeEventListener("load", onLoad);
        window.clearTimeout(timer);
        window.clearTimeout(failsafe);
      };
    } else start();
    return () => {
      alive = false;
      cleanup();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  // first slide fades in one frame after it is mounted (or once `startDelay` has passed since the page opened)
  useEffect(() => {
    if (!slides.length) return;
    let raf = 0;
    // "shift": nothing is underneath except the fallback, which slides out by itself
    const show = () => {
      raf = requestAnimationFrame(() =>
        requestAnimationFrame(() => setPos({ index: 0, prev: effect === "shift" ? -1 : slides.length - 1 }))
      );
    };
    const timer = window.setTimeout(show, Math.max(0, startDelay - (performance.now() - mountedAt.current)));
    return () => {
      window.clearTimeout(timer);
      cancelAnimationFrame(raf);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slides.length > 0]);

  // advance every `interval` ms (not for visitors who prefer reduced motion)
  useEffect(() => {
    if (slides.length < 2 || index < 0) return;
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;

    // If initialInterval is set, use it for the first transition, then switch to regular interval
    if (initialInterval && index === 0 && !hasStartedCycle) {
      const id = window.setTimeout(() => {
        setPos((p) => ({ prev: p.index, index: (p.index + 1) % slides.length }));
        setHasStartedCycle(true);
      }, initialInterval);
      return () => window.clearTimeout(id);
    }

    // Regular cycling with the standard interval
    const id = window.setInterval(() => setPos((p) => ({ prev: p.index, index: (p.index + 1) % slides.length })), interval);
    return () => window.clearInterval(id);
  }, [slides.length, interval, initialInterval, index, hasStartedCycle]);

  // once the fade has finished, the slide underneath can be hidden
  useEffect(() => {
    if (prev < 0) return;
    const id = window.setTimeout(() => setPos((p) => ({ ...p, prev: -1 })), duration + 100);
    return () => window.clearTimeout(id);
  }, [prev, index, duration]);

  return (
    <div
      aria-hidden="true"
      className={`bg-slideshow ${effect === "shift" ? "is-shift" : ""} ${className}`}
      style={{ ["--slide-fade" as string]: `${duration}ms` }}
    >
      {fallback && (
        // preload the first photo (the largest thing on screen) as soon as the HTML is read, instead of when the <img> is reached
        <>
          {fallbackMobile ? (
            <>
              <link rel="preload" as="image" href={fallbackMobile} media="(max-width: 767px)" fetchPriority="high" />
              <link rel="preload" as="image" href={fallback} media="(min-width: 768px)" fetchPriority="high" />
            </>
          ) : (
            <link rel="preload" as="image" href={fallback} fetchPriority="high" />
          )}
        </>
      )}
      {fallback && (
        <picture>
          {fallbackMobile && <source media="(max-width: 767px)" srcSet={fallbackMobile} />}
          <img
            src={fallback}
            alt=""
            fetchPriority="high"
            decoding="sync"
            className={`bg-slide ${effect === "shift" && index >= 0 ? "is-prev" : "is-base"} ${imgClassName} ${imgClassNames[fallback] ?? ""}`}
          />
        </picture>
      )}
      {slides.map((src, i) => (
        <img
          key={src}
          src={src}
          alt=""
          decoding="async"
          className={`bg-slide ${imgClassName} ${imgClassNames[src] ?? ""} ${i === index ? "is-active" : i === prev ? "is-prev" : ""}`}
        />
      ))}
      {overlayClassName && <div className={`bg-slide-overlay ${overlayClassName}`} />}
    </div>
  );
}
