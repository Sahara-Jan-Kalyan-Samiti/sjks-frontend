"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { legalDocs, type LegalKind } from "@/data/content/legal";
import { usePageText } from "@/hooks/usePageText";
import PageHero from "@/components/layout/PageHero";

const kinds: [LegalKind, string][] = [
  ["privacy", "/privacy"],
  ["terms", "/terms"],
  ["dpdp", "/dpdp"],
  ["refund", "/refund-policy"]
];

/** Privacy Policy, Terms of Use, DPDP Compliance Notice and Cancellation & Refund Policy. The wording comes from the admin panel (Website Pages), or src/data/content/legal.ts. */
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

  const body = "text-base leading-[1.9] text-ink/80 md:text-[1.0625rem]";

  return (
    <>
      <PageHero eyebrow="Legal" title={title} />
      <section className="bg-white py-10 text-ink/80 md:py-16">
        <div className="container-site">
          {/* small screens: a scrolling row of section buttons that stays under the site header */}
          <nav
            aria-label={title}
            className="no-scrollbar sticky top-16 z-10 -mx-4 mb-6 flex gap-2 overflow-x-auto border-b border-ink/10 bg-white/95 px-4 py-3 backdrop-blur sm:top-[72px] lg:hidden"
          >
            {doc.sections.map((_, i) => (
              <button
                key={i}
                type="button"
                aria-current={i === active ? "true" : undefined}
                onClick={() => go(i)}
                className={`shrink-0 whitespace-nowrap rounded-full border px-4 py-2 text-sm font-medium transition ${i === active ? "border-brand bg-brand text-white" : "border-ink/15 bg-white text-ink/80"}`}
              >
                {c(`legal.${kind}.s${i + 1}.title`)}
              </button>
            ))}
          </nav>

          <div className="grid gap-10 lg:grid-cols-[15rem_minmax(0,1fr)] lg:gap-16 xl:grid-cols-[17rem_minmax(0,1fr)]">
            {/* large screens: contents list beside the text */}
            <aside className="hidden lg:block">
              <div className="sticky top-[104px]">
                <p className="text-xs font-bold uppercase tracking-widest text-ink/55">On this page</p>
                <nav aria-label={title} className="mt-4 flex flex-col border-l border-ink/10">
                  {doc.sections.map((_, i) => (
                    <button
                      key={i}
                      type="button"
                      aria-current={i === active ? "true" : undefined}
                      onClick={() => go(i)}
                      className={`-ml-px border-l-2 py-2 pl-4 pr-2 text-left text-sm leading-snug transition ${i === active ? "border-brand font-semibold text-brand-dark" : "border-transparent text-ink/65 hover:border-ink/30 hover:text-ink"}`}
                    >
                      {c(`legal.${kind}.s${i + 1}.title`)}
                    </button>
                  ))}
                </nav>
              </div>
            </aside>

            <article className="min-w-0 max-w-3xl">
              <p className="text-sm text-ink/60">Last updated: {c(`legal.${kind}.updated`)}.</p>
              {doc.intro && (
                <p className="mt-4 border-b border-ink/10 pb-9 text-lg leading-[1.85] text-ink/90 md:text-xl md:leading-[1.8]">
                  {c(`legal.${kind}.intro`)}
                </p>
              )}

              <div className="divide-y divide-ink/10">
                {doc.sections.map((s, i) => (
                  <section key={i} id={`section-${i + 1}`} className="scroll-mt-32 py-9 first:pt-9">
                    <h2 className="flex items-baseline gap-3 text-xl font-bold leading-snug text-ink md:text-2xl">
                      <span aria-hidden="true" className="text-base font-semibold tabular-nums text-brand md:text-lg">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      {c(`legal.${kind}.s${i + 1}.title`)}
                    </h2>
                    <div className="mt-4 space-y-4">
                      {s.p.map((_, j) => {
                        const text = c(`legal.${kind}.s${i + 1}.p${j + 1}`);
                        const bullet = /^-\s+/.test(text);
                        return bullet ? (
                          <p key={j} className={`flex items-start gap-3 ${body}`}>
                            <span aria-hidden="true" className="mt-[0.85em] h-1.5 w-1.5 shrink-0 rounded-full bg-brand" />
                            <span>{text.replace(/^-\s+/, "")}</span>
                          </p>
                        ) : (
                          <p key={j} className={body}>
                            {text}
                          </p>
                        );
                      })}
                    </div>
                  </section>
                ))}
              </div>

              <div className="mt-4 flex flex-col gap-4 rounded-2xl border border-ink/10 bg-slate-50 p-6 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="font-semibold text-ink">Questions about this page?</p>
                  <p className="mt-1 text-sm text-ink/65">Write to us and we will be glad to help.</p>
                </div>
                <Link href="/contact" className="btn btn-brand shrink-0">
                  Contact us <span aria-hidden="true">→</span>
                </Link>
              </div>

              <p className="mt-8 flex flex-wrap gap-x-6 gap-y-2 border-t border-ink/10 pt-6 text-sm font-semibold">
                {kinds
                  .filter(([k]) => k !== kind)
                  .map(([k, to]) => (
                    <Link key={k} href={to} className="text-brand-dark hover:text-brand">
                      {c(`legal.${k}.title`)} <span aria-hidden="true">→</span>
                    </Link>
                  ))}
              </p>
            </article>
          </div>
        </div>
      </section>
    </>
  );
}
