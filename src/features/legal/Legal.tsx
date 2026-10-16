"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { legalDocs, type LegalKind } from "@/data/content/legal";
import { usePageText } from "@/hooks/usePageText";
import PageHero from "@/components/layout/PageHero";

const kinds: [LegalKind, string][] = [
  ["privacy", "/privacy"],
  ["terms", "/terms"],
  ["dpdp", "/dpdp"]
];

function Tick() {
  return (
    <span aria-hidden="true" className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand/10 text-brand">
      <svg viewBox="0 0 24 24" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
        <path d="M5 12.5l4.5 4.5L19 7.5" />
      </svg>
    </span>
  );
}

/** Privacy Policy, Terms of Use and DPDP Compliance Notice. The wording comes from the admin panel (Website Pages), or src/data/content/legal.ts. */
export default function Legal({ kind }: { kind: LegalKind }) {
  const c = usePageText();
  const doc = legalDocs[kind];
  const title = c(`legal.${kind}.title`);

  // the section being read is highlighted in the contents list: the last section whose heading has passed under the site header
  const [active, setActive] = useState(0);
  useEffect(() => {
    const onScroll = () => {
      let now = 0;
      doc.sections.forEach((_, i) => {
        const el = document.getElementById(`section-${i + 1}`);
        if (el && el.getBoundingClientRect().top <= 200) now = i;
      });
      // at the very end of the page the last section counts as the one being read, even if it cannot reach the top
      if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4) now = doc.sections.length - 1;
      setActive(now);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [doc]);
  const go = (i: number) =>
    document
      .getElementById(`section-${i + 1}`)
      ?.scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block: "start" });

  return (
    <>
      <PageHero eyebrow="Legal" title={title} />
      <section className="bg-[#f6f9fc] py-12 text-ink/80 md:py-16">
        <div className="container-site">
          {/* small screens: a scrolling row of section buttons that stays under the site header */}
          <nav
            aria-label={title}
            className="no-scrollbar sticky top-16 z-10 -mx-4 mb-6 flex gap-2 overflow-x-auto bg-[#f6f9fc]/95 px-4 py-3 backdrop-blur sm:top-[72px] lg:hidden"
          >
            {doc.sections.map((_, i) => (
              <button
                key={i}
                type="button"
                aria-current={i === active ? "true" : undefined}
                onClick={() => go(i)}
                className={`shrink-0 whitespace-nowrap rounded-full border px-4 py-2 text-sm font-medium transition ${i === active ? "border-brand bg-brand text-white" : "border-ink/10 bg-white text-ink"}`}
              >
                {c(`legal.${kind}.s${i + 1}.title`)}
              </button>
            ))}
          </nav>

          <div className="grid gap-8 lg:grid-cols-[17rem_minmax(0,1fr)] lg:gap-10 xl:grid-cols-[19rem_minmax(0,1fr)]">
            {/* large screens: contents list beside the text */}
            <aside className="hidden lg:block">
              <div className="sticky top-[96px] rounded-3xl border border-ink/10 bg-white p-5 shadow-sm">
                <p className="px-2 text-xs font-bold uppercase tracking-widest text-brand">On this page</p>
                <nav aria-label={title} className="mt-3 flex flex-col gap-1">
                  {doc.sections.map((_, i) => (
                    <button
                      key={i}
                      type="button"
                      aria-current={i === active ? "true" : undefined}
                      onClick={() => go(i)}
                      className={`flex items-center gap-3 rounded-xl px-2 py-2 text-left text-sm font-medium transition ${i === active ? "bg-brand text-white shadow" : "text-ink/80 hover:bg-brand-light hover:text-brand-dark"}`}
                    >
                      <span
                        className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold ${i === active ? "bg-white text-brand" : "bg-brand/10 text-brand"}`}
                      >
                        {i + 1}
                      </span>
                      {c(`legal.${kind}.s${i + 1}.title`)}
                    </button>
                  ))}
                </nav>
              </div>
            </aside>

            <div className="min-w-0">
              {doc.intro && (
                <div className="relative overflow-hidden rounded-3xl border border-brand/15 bg-gradient-to-br from-[#eaf3fd] to-white p-6 shadow-sm md:p-8">
                  <span aria-hidden="true" className="absolute inset-y-0 left-0 w-1.5 bg-gradient-to-b from-brand to-sky-400" />
                  <p className="text-base leading-relaxed text-ink/85 md:text-lg">{c(`legal.${kind}.intro`)}</p>
                </div>
              )}

              {doc.sections.map((s, i) => (
                <article
                  key={i}
                  id={`section-${i + 1}`}
                  className={`scroll-mt-40 rounded-3xl border bg-white p-6 shadow-sm transition-colors md:p-8 ${doc.intro || i > 0 ? "mt-5" : ""} ${i === active ? "border-brand/30" : "border-ink/10"}`}
                >
                  <h2 className="flex items-center gap-4 font-serif text-xl font-bold text-ink md:text-2xl">
                    <span
                      aria-hidden="true"
                      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-brand to-sky-500 font-sans text-base text-white shadow-md"
                    >
                      {i + 1}
                    </span>
                    {c(`legal.${kind}.s${i + 1}.title`)}
                  </h2>
                  <div className="mt-4 space-y-3 md:pl-14">
                    {s.p.map((_, j) => {
                      const text = c(`legal.${kind}.s${i + 1}.p${j + 1}`);
                      const bullet = /^-\s+/.test(text);
                      return bullet ? (
                        <p key={j} className="flex items-start gap-3 leading-relaxed">
                          <Tick />
                          <span>{text.replace(/^-\s+/, "")}</span>
                        </p>
                      ) : (
                        <p key={j} className="leading-relaxed">
                          {text}
                        </p>
                      );
                    })}
                  </div>
                </article>
              ))}

              <div className="mt-5 flex flex-col gap-5 rounded-3xl bg-brand-dark p-6 text-white md:flex-row md:items-center md:justify-between md:p-8">
                <div>
                  <p className="text-lg font-semibold">Questions about this page?</p>
                  <p className="mt-1 text-sm text-white/75">Write to us and we will be glad to help.</p>
                </div>
                <Link href="/contact" className="btn shrink-0 bg-white text-brand-dark">
                  Contact us <span aria-hidden="true">→</span>
                </Link>
              </div>

              <p className="mt-8 text-sm text-ink/60">Last updated: {c(`legal.${kind}.updated`)}.</p>
              <p className="mt-4 flex flex-wrap gap-3">
                {kinds
                  .filter(([k]) => k !== kind)
                  .map(([k, to]) => (
                    <Link key={k} href={to} className="btn border-2 border-brand !px-4 !py-2 text-brand">
                      {c(`legal.${k}.title`)} <span aria-hidden="true">→</span>
                    </Link>
                  ))}
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
