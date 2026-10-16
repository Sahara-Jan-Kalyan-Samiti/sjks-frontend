"use client";

import { useState } from "react";
import Link from "next/link";
import { useLang } from "@/i18n/LangContext";
import { useDonorProgrammes } from "@/hooks/useDonorProgrammes";
import PageHero from "@/components/layout/PageHero";
import Reveal from "@/components/ui/Reveal";
import CountUp from "@/components/ui/CountUp";
import { useInView } from "@/hooks/useInView";
import { rupees, type DonorData } from "@/data/content/donorTransparency";

/** colours for the segments of the spending bar */
const tones = ["bg-brand", "bg-emerald-600", "bg-amber-500", "bg-rose-500", "bg-violet-500"];

/** One colour per impact card, in turn (full class names so Tailwind keeps them). */
const impactColours = [
  { card: "from-sky-700 to-blue-500 shadow-blue-500/30 hover:shadow-blue-500/50", bar: "bg-sky-200" },
  { card: "from-emerald-700 to-green-500 shadow-emerald-500/30 hover:shadow-emerald-500/50", bar: "bg-lime-200" },
  { card: "from-orange-600 to-amber-400 shadow-orange-500/30 hover:shadow-orange-500/50", bar: "bg-yellow-100" },
  { card: "from-rose-700 to-pink-500 shadow-rose-500/30 hover:shadow-rose-500/50", bar: "bg-pink-200" },
  { card: "from-violet-700 to-purple-500 shadow-violet-500/30 hover:shadow-violet-500/50", bar: "bg-fuchsia-200" },
  { card: "from-teal-700 to-cyan-500 shadow-teal-500/30 hover:shadow-teal-500/50", bar: "bg-cyan-100" }
];

/** A small icon picked from the words in the label (Children, Nutrition kits, Families, Study kits, Trees, ...). */
function ImpactIcon({ label }: { label: string }) {
  const l = label.toLowerCase();
  const path = /child|student|kid|girl|boy|beneficiar|people|member/.test(l) ? "M12 12a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Zm-7 8c0-3.3 3.1-5.5 7-5.5s7 2.2 7 5.5"
    : /famil|house|home|village/.test(l) ? "M4 11 12 4l8 7v8a1 1 0 0 1-1 1h-4v-6H9v6H5a1 1 0 0 1-1-1v-8Z"
    : /kit|food|meal|ration|nutrition|basket|pack/.test(l) ? "M5 9h14l-1.5 10h-11L5 9Zm3-1 2-4m6 4-2-4M9 13v3m3-3v3m3-3v3"
    : /book|study|school|educat|notebook|material|learn/.test(l) ? "M5 5.5A1.5 1.5 0 0 1 6.5 4H19v14H6.5A1.5 1.5 0 0 0 5 19.5v-14ZM5 19.5A1.5 1.5 0 0 0 6.5 21H19"
    : /tree|plant|green|environment|sapling/.test(l) ? "M12 21v-7m0 0c-4 0-6-3-6-6 4 0 6 2 6 6Zm0 0c0-4 2-6 6-6 0 3-2 6-6 6Z"
    : /health|patient|medical|camp|check|treat/.test(l) ? "M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10Z"
    : /lantern|solar|light|energy/.test(l) ? "M12 3v2m0 14v2M5 12H3m18 0h-2M6.3 6.3 7.7 7.7m8.6 8.6 1.4 1.4m0-11.4-1.4 1.4m-8.6 8.6-1.4 1.4M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8Z"
    : "m12 3 2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9L12 3Z";
  return <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={path} /></svg>;
}

/** One impact figure: icon, a number that counts up when it scrolls into view, and a bar showing its size next to the biggest figure. */
function ImpactCard({ o, max, i }: { o: { value: number; label: string; detail: string }; max: number; i: number }) {
  const [ref, seen] = useInView<HTMLDivElement>(0.3);
  const colour = impactColours[i % impactColours.length];
  return (
    <Reveal delay={i * 80} className="h-full">
      <div ref={ref} className={`group relative h-full overflow-hidden rounded-2xl bg-gradient-to-br p-5 text-white shadow-lg transition duration-300 hover:-translate-y-1.5 hover:shadow-2xl ${colour.card}`}>
        <span aria-hidden="true" className="pointer-events-none absolute -right-8 -top-8 h-28 w-28 rounded-full bg-white/10 transition duration-500 group-hover:scale-150" />
        <span className="relative flex h-11 w-11 items-center justify-center rounded-xl bg-white/15 ring-1 ring-white/25 transition duration-300 group-hover:rotate-6 group-hover:bg-white/25"><ImpactIcon label={o.label} /></span>
        <p className="relative mt-4 font-serif text-4xl font-bold tabular-nums sm:text-5xl"><CountUp stat={{ label: o.label, value: o.value }} /></p>
        <p className="relative mt-1 font-semibold">{o.label}</p>
        {o.detail && <p className="relative mt-1 text-sm text-white/80">{o.detail}</p>}
        <div aria-hidden="true" className="relative mt-4 h-1.5 overflow-hidden rounded-full bg-white/20">
          <div className={`h-full rounded-full ${colour.bar} transition-[width] duration-[1400ms] ease-out motion-reduce:transition-none`} style={{ width: seen && max > 0 ? `${Math.max(6, (o.value / max) * 100)}%` : "0%", transitionDelay: `${i * 120}ms` }} />
        </div>
      </div>
    </Reveal>
  );
}

/** One programme: what came in, what was spent and on what, who it reached, and the proof. Sections with nothing in them are left out. */
function Programme({ d }: { d: DonorData }) {
  const { t } = useLang();
  const spent = d.spending.reduce((n, s) => n + s.amount, 0);
  const balance = d.received - spent;
  const share = (n: number) => (d.received > 0 ? Math.round((n / d.received) * 100) : 0);
  const first = d.outcomes[0];
  const figures: [string, string, string][] = [
    ["Total donations", rupees(d.received), "text-brand-dark"],
    ["Programme expenses", rupees(spent), "text-amber-700"],
    ["Remaining balance", rupees(balance), balance < 0 ? "text-rose-700" : "text-emerald-700"]
  ];
  if (first) figures.push(["Beneficiaries", `${first.value.toLocaleString("en-IN")} ${first.label}`, "text-rose-700"]);
  return (
    <>
      {/* 1. Donation details */}
      <section id="donation-details" className="container-site py-14">
        {(d.period || d.place) && <p className="eyebrow">{[d.period, d.place].filter(Boolean).join(" · ")}</p>}
        <h2 className="h2 mt-2">{d.name}</h2>
        {d.summary && <p className="justified mt-2 max-w-3xl whitespace-pre-line text-ink/70">{d.summary}</p>}
        <div className={`mt-8 grid grid-cols-2 gap-4 ${figures.length > 3 ? "lg:grid-cols-4" : "lg:grid-cols-3"}`}>
          {figures.map(([label, value, tone], i) => (
            <Reveal key={label} delay={i * 60}>
              <div className="h-full rounded-2xl border bg-white p-5 shadow-sm">
                <p className="text-xs font-semibold uppercase tracking-wide text-ink/55">{t(label)}</p>
                <p className={`mt-2 font-serif text-2xl font-bold sm:text-3xl ${tone}`}>{value}</p>
              </div>
            </Reveal>
          ))}
        </div>
        {d.received > 0 && (
          <div className="mt-6 rounded-2xl border bg-white p-5 shadow-sm">
            <div className="flex justify-between text-sm font-semibold"><span>{t("Spent")} {rupees(spent)} ({share(spent)}%)</span><span className="text-emerald-700">{t("Balance")} {rupees(balance)} ({share(balance)}%)</span></div>
            <div className="mt-2 h-3 overflow-hidden rounded-full bg-emerald-100" role="img" aria-label={`${share(spent)}% of the donations spent, ${share(balance)}% remaining`}>
              <div className="h-full rounded-full bg-gradient-to-r from-brand-dark to-brand" style={{ width: `${Math.min(100, share(spent))}%` }} />
            </div>
          </div>
        )}
      </section>

      {/* 2. Utilization of funds */}
      {d.spending.length > 0 && (
        <section id="utilization" className="bg-slate-50 py-14">
          <div className="container-site">
            <p className="eyebrow">{t("Utilization of funds")}</p>
            <h2 className="h2 mt-2">{t("Where every rupee went")}</h2>
            <p className="mt-2 text-ink/70">{t("Out of")} {rupees(d.received)}, {rupees(spent)} {t("was spent on the programme, as follows.")}</p>
            <div className="mt-6 flex h-4 overflow-hidden rounded-full" aria-hidden="true">
              {d.spending.map((s, i) => <div key={i} className={tones[i % tones.length]} style={{ width: `${spent > 0 ? (s.amount / spent) * 100 : 0}%` }} title={`${s.label}: ${rupees(s.amount)}`} />)}
            </div>
            <div className="mt-6 overflow-hidden rounded-2xl border bg-white shadow-sm">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-100 text-xs uppercase tracking-wide text-ink/60">
                  <tr><th className="px-4 py-3">{t("Spent on")}</th><th className="hidden px-4 py-3 md:table-cell">{t("Details")}</th><th className="px-4 py-3 text-right">{t("Amount")}</th><th className="px-4 py-3 text-right">{t("Share")}</th></tr>
                </thead>
                <tbody>
                  {d.spending.map((s, i) => (
                    <tr key={i} className="border-t align-top">
                      <td className="px-4 py-3 font-semibold"><span aria-hidden="true" className={`mr-2 inline-block h-2.5 w-2.5 rounded-full ${tones[i % tones.length]}`} />{s.label}{s.detail && <span className="mt-1 block text-xs font-normal text-ink/60 md:hidden">{s.detail}</span>}</td>
                      <td className="hidden px-4 py-3 text-ink/70 md:table-cell">{s.detail}</td>
                      <td className="whitespace-nowrap px-4 py-3 text-right font-semibold">{rupees(s.amount)}</td>
                      <td className="px-4 py-3 text-right text-ink/70">{share(s.amount)}%</td>
                    </tr>
                  ))}
                  <tr className="border-t bg-slate-50 font-bold"><td className="px-4 py-3" colSpan={2}>{t("Total spent")}</td><td className="whitespace-nowrap px-4 py-3 text-right">{rupees(spent)}</td><td className="px-4 py-3 text-right">{share(spent)}%</td></tr>
                  <tr className={`border-t font-bold ${balance < 0 ? "text-rose-700" : "text-emerald-700"}`}><td className="px-4 py-3" colSpan={2}>{t("Remaining balance")}</td><td className="whitespace-nowrap px-4 py-3 text-right">{rupees(balance)}</td><td className="px-4 py-3 text-right">{share(balance)}%</td></tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>
      )}

      {/* 3. Real impact */}
      {d.outcomes.length > 0 && (
        <section id="impact" className="container-site py-14">
          <p className="eyebrow">{t("Real impact")}</p>
          <h2 className="h2 mt-2">{t("What the donations achieved")}</h2>
          <div className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
            {d.outcomes.map((o, i) => <ImpactCard key={i} o={o} i={i} max={Math.max(...d.outcomes.map((x) => x.value))} />)}
          </div>
          {first && /child/i.test(first.label) && first.value > 0 && spent > 0 && (
            <p className="mt-4 text-sm text-ink/60">{t("Cost per child")}: {rupees(Math.round(spent / first.value))}</p>
          )}
        </section>
      )}

      {/* 4. Reports & proofs */}
      {(d.proofs.length > 0 || d.photos.length > 0 || d.dates.length > 0) && (
        <section id="proofs" className="bg-slate-50 py-14">
          <div className="container-site">
            <p className="eyebrow">{t("Reports & proofs")}</p>
            <h2 className="h2 mt-2">{t("Documents, photos and dates")}</h2>

            {d.proofs.length > 0 && (
              <div className="mt-6 grid gap-5 md:grid-cols-3">
                {d.proofs.map((p, i) => (
                  <article key={i} className="flex flex-col rounded-2xl border bg-white p-5 shadow-sm">
                    {p.kind && <p className="eyebrow">{p.kind}</p>}
                    <h3 className="mt-1 font-serif text-lg font-bold">{p.title}</h3>
                    {p.detail && <p className="justified mt-2 flex-1 text-sm text-ink/70">{p.detail}</p>}
                    {p.file
                      ? <a href={p.file} target="_blank" rel="noreferrer" className="btn btn-brand mt-4 self-start !px-4 !py-2">{t("View")} →</a>
                      : <Link href="/transparency?request=certificate#request" className="mt-4 text-sm font-semibold text-brand hover:underline">{t("Available on request")} →</Link>}
                  </article>
                ))}
              </div>
            )}

            {d.photos.length > 0 && (
              <>
                <h3 className="mt-12 font-serif text-xl font-bold">{t("Project photos")}</h3>
                <div className="mt-4 grid gap-4 sm:grid-cols-3">
                  {d.photos.map((p, i) => (
                    <figure key={i} className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-ink/5">
                      <img src={p.file} alt={p.alt} loading="lazy" decoding="async" className="aspect-[4/3] w-full object-cover" />
                      {p.alt && <figcaption className="p-3 text-sm text-ink/70">{p.alt}</figcaption>}
                    </figure>
                  ))}
                </div>
              </>
            )}

            {d.dates.length > 0 && (
              <>
                <h3 className="mt-12 font-serif text-xl font-bold">{t("Activity dates")}</h3>
                <ol className="mt-4 space-y-0 border-l-2 border-brand/30 pl-6">
                  {d.dates.map((a, i) => (
                    <li key={i} className="relative pb-6 last:pb-0">
                      <span aria-hidden="true" className="absolute -left-[31px] top-1 h-3.5 w-3.5 rounded-full border-2 border-white bg-brand shadow" />
                      {a.date && <p className="text-xs font-bold uppercase tracking-wide text-brand-dark">{a.date}</p>}
                      <p className="font-semibold">{a.title}</p>
                      {a.detail && <p className="text-sm text-ink/70">{a.detail}</p>}
                    </li>
                  ))}
                </ol>
              </>
            )}
          </div>
        </section>
      )}
    </>
  );
}

/** Donor Transparency page. The programmes are kept in the admin panel (Donor Transparency); more than one gets a chooser. */
export default function DonorTransparency() {
  const { t } = useLang();
  const { list, loading } = useDonorProgrammes();
  const [pick, setPick] = useState<string>("");
  const cur = list.find((p) => String(p.id) === pick) || list[0];
  return (
    <>
      <PageHero eyebrow={t("Transparency & Reports")} title={t("Donor Transparency")}
        text={t("See exactly how donations were received, spent and what they achieved, with the bills and photos to prove it.")} />

      {list.length > 1 && (
        <div className="container-site pt-10">
          <div className="flex flex-wrap gap-2" role="tablist" aria-label={t("Programme")}>
            {list.map((p) => (
              <button key={p.id} type="button" role="tab" aria-selected={p === cur} onClick={() => setPick(String(p.id))}
                className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${p === cur ? "border-transparent bg-gradient-to-r from-brand-dark to-brand text-white shadow-lg shadow-brand/30" : "border-ink/10 bg-white text-ink/75 hover:border-brand/40 hover:bg-brand-light hover:text-brand-dark"}`}>{p.name}</button>
            ))}
          </div>
        </div>
      )}

      {cur ? <Programme key={cur.id} d={cur} /> : (
        <section className="container-site py-20 text-center">
          <p className="text-ink/70">{loading ? t("Loading…") : t("No programme has been published yet. Please check back soon.")}</p>
        </section>
      )}

      <section className="container-site py-12 text-center">
        <p className="text-ink/70">{t("Want a statement for a donation you made, or the full audited accounts?")}</p>
        <div className="mt-4 flex flex-wrap justify-center gap-3">
          <Link href="/transparency?request=certificate#request" className="btn btn-brand">{t("Request documents")} →</Link>
          <Link href="/donate" className="btn border-2 border-brand text-brand">{t("Donate")}</Link>
        </div>
      </section>
    </>
  );
}
