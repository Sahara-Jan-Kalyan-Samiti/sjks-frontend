"use client";

import { useState } from "react";
import Link from "next/link";
import { posts } from "@/data/content/news";
import { useLang } from "@/i18n/LangContext";
import { useShareUrl } from "@/hooks/useShareUrl";
import Img from "@/components/ui/Img";
import PageHero from "@/components/layout/PageHero";
import NotFound from "@/views/NotFound";
import { fmtDate } from "@/utils/date";
import DonateButton from "@/components/ui/DonateButton";

export default function NewsDetail({ slug }: { slug: string }) {
  const { t } = useLang();
  const [copied, setCopied] = useState(false);
  const url = useShareUrl();
  const p = posts.find((x) => x.slug === slug);
  if (!p) return <NotFound />;
  const copy = async () => { try { await navigator.clipboard.writeText(url); setCopied(true); setTimeout(() => setCopied(false), 1500); } catch { /* ignore */ } };
  return (
    <>
      <PageHero eyebrow={fmtDate(p.date)} title={p.title} />
      <article className="container-site max-w-3xl py-14">
        <figure>
          <Img file={p.image} alt={p.title} className="h-auto w-full rounded-3xl border border-ink/10 shadow-sm" />
          {p.source && <figcaption className="mt-2 text-center text-xs font-medium text-ink/55">{p.source}</figcaption>}
        </figure>
        <div className="mt-8 space-y-5 text-base leading-relaxed text-ink/80 sm:text-lg">{p.body.map((b, i) => <p key={i}>{b}</p>)}</div>
        {p.more?.map((m) => (
          <figure key={m.image} className="mt-8">
            <Img file={m.image} alt={`${p.title} (${m.source})`} className="h-auto w-full rounded-3xl border border-ink/10 shadow-sm" />
            <figcaption className="mt-2 text-center text-xs font-medium text-ink/55">{m.source}</figcaption>
          </figure>
        ))}
        <div className="mt-8 flex flex-wrap items-center gap-3 border-t pt-6 text-sm">
          <span className="font-semibold">{t("Share")}:</span>
          <a className="rounded-full bg-[#25D366] px-4 py-2 font-semibold text-white" target="_blank" rel="noreferrer" href={`https://wa.me/?text=${encodeURIComponent(p.title + " " + url)}`}>WhatsApp</a>
          <a className="rounded-full bg-[#1877F2] px-4 py-2 font-semibold text-white" target="_blank" rel="noreferrer" href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`}>Facebook</a>
          <button type="button" onClick={copy} className="rounded-full border px-4 py-2 font-semibold">{copied ? "Copied ✓" : t("Copy link")}</button>
        </div>
        <div className="mt-8 flex flex-wrap gap-3"><DonateButton to="/donate">{t("Donate Now")}</DonateButton><Link href="/news" className="btn btn-brand">← {t("Back to all stories")}</Link></div>
      </article>
    </>
  );
}
