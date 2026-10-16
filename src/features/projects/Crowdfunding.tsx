"use client";

import dynamic from "next/dynamic";
import Skeleton from "@/components/ui/Skeleton";
import Link from "next/link";
import { useLang } from "@/i18n/LangContext";
import { testimonials } from "@/data/content/content";
import PageHero from "@/components/layout/PageHero";
import Reveal from "@/components/ui/Reveal";
import CountUp from "@/components/ui/CountUp";

// the map holds about 270 KB of geometry: it is loaded in the browser only when the page shows it
const IndiaNetworkMap = dynamic(() => import("@/components/maps/IndiaNetworkMap"), { ssr: false, loading: () => <Skeleton className="h-80" /> });

const base = "/assets/images/crowdfunding/";
const quote = testimonials.find((x) => x.program === "Medical Treatment Assistance");
/** Shown with a bare "+" so the figures stay one line and the same size; the unit goes in the caption. */
const impact = [
  { stat: { label: "Patients supported", value: 2000, suffix: "+" }, caption: "Patients supported with treatment assistance" },
  { stat: { label: "Direct & indirect beneficiaries", value: 25000, suffix: "+" }, caption: "People reached across all our programmes" },
  { stat: { label: "Working since", value: 2004, plain: true }, caption: "Years of service, registered and accountable" }
];

/** Faces in these photos are already blurred; captions are general and name no patient. */
const gallery = [
  { file: "icu-care.jpg", title: "When every hour counts", text: "Intensive care that a family could not have paid for alone." },
  { file: "child-care.jpg", title: "A child, and a family's fear", text: "Strangers chose to carry part of a parent's worry." },
  { file: "surgery-recovery.jpg", title: "The operation that could not wait", text: "Surgery and recovery paid through a community fundraiser." },
  { file: "oxygen-support.jpg", title: "Breathing, with help", text: "Life-support costs covered so treatment never stopped midway." },
  { file: "neonatal-care.jpg", title: "The smallest patients", text: "Newborn intensive care, where each day in the unit has a cost." },
  { file: "ward-recovery.jpg", title: "The road back home", text: "Medicines and follow-up care that bring a patient home." }
];

const journey = [
  { title: "A family reaches out", text: "They bring the hospital's estimate and the medical papers to our team, often on the same day the bill arrives." },
  { title: "We verify, then we speak", text: "The diagnosis, documents and hospital are checked first. Only a verified case is ever shared with supporters." },
  { title: "The community gives", text: "The case is shared widely. Anyone can contribute, and no amount is too small to count." },
  { title: "Funds go to the hospital", text: "Money is paid toward the treatment cost and the family is kept informed at every step." },
  { title: "We account for it", text: "Receipts, reports and updates are open to every donor through our transparency pages." }
];

const Chapter = ({ n, label, light }: { n: string; label: string; light?: boolean }) => (
  <p className={`flex items-center gap-3 text-xs font-semibold uppercase tracking-widest ${light ? "text-white/90" : "text-brand"}`}>
    <span className={`rounded-full px-3 py-1 ${light ? "bg-white text-brand-dark" : "bg-brand text-white"}`}>Chapter {n}</span><span>{label}</span>
  </p>
);

export default function Crowdfunding() {
  const { t } = useLang();
  return (
    <>
      <PageHero eyebrow={t("Medical Crowdfunding")} title={t("One bill. One family. Thousands of hands.")}
        text={t("How ordinary people, giving together, pay for treatment that no single family could, and how we make sure it reaches the patient.")} />

      {/* 1. the problem, told as a moment */}
      <section className="container-site py-16">
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <Reveal>
            <Chapter n="01" label={t("The moment")} />
            <h2 className="h2 mt-3">{t("It starts with a number on a hospital estimate.")}</h2>
            <p className="justified mt-4 text-lg text-ink/80">{t("A father is told his child needs urgent surgery. The estimate is more than the family earns in two years. There is no insurance, and no relative with that kind of money.")}</p>
            <p className="justified mt-4 text-ink/70">{t("In a village in Madhya Pradesh, this is not a rare story. It is a Tuesday. A single illness can undo a lifetime of work, and the hours lost in searching for money are hours the patient does not have.")}</p>
          </Reveal>
          <Reveal delay={120}>
            <div className="relative">
              <img src={base + "icu-care.jpg"} alt={t("A patient in intensive care, face kept private")} loading="lazy" decoding="async" className="h-[22rem] w-full rounded-2xl object-cover shadow-lg md:h-[28rem]" />
              <p className="absolute -bottom-5 left-4 right-4 rounded-xl bg-white p-4 text-sm font-semibold text-ink shadow-lg md:left-auto md:right-6 md:max-w-xs">
                {t("Medical emergencies are among the biggest reasons families fall into debt.")}
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* 2. the idea: many small gifts */}
      <section className="container-site py-16">
        <Reveal>
          <Chapter n="02" label={t("The turn")} />
          <h2 className="h2 mt-3 max-w-3xl">{t("A small gift, multiplied by many people.")}</h2>
        </Reveal>
        <div className="mt-8 grid items-stretch gap-8 lg:grid-cols-2">
          <Reveal className="h-full">
            <p className="justified text-lg text-ink/80">{t("Crowdfunding is the process of raising funds with the help of people across the country. Anyone can raise funds this way: a newborn child, a senior citizen, or an NGO standing beside them.")}</p>
            <p className="justified mt-4 text-ink/70">{t("No single gift has to be large. When many people give a little for the same patient, the bill that looked impossible is met within days.")}</p>
          </Reveal>
          <Reveal delay={120} className="h-full">
            <div className="flex h-full flex-col justify-center rounded-2xl bg-brand-light p-6 md:p-8">
              <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3 text-center">
                <div><p className="font-serif text-3xl font-bold text-brand-dark md:text-4xl">₹100</p><p className="mt-1 text-xs text-ink/60 md:text-sm">{t("from one person")}</p></div>
                <p className="text-xl font-bold text-brand md:text-2xl" aria-hidden="true">× 1,000</p>
                <div><p className="font-serif text-3xl font-bold text-brand-dark md:text-4xl">₹1,00,000</p><p className="mt-1 text-xs text-ink/60 md:text-sm">{t("toward one patient")}</p></div>
              </div>
              <p className="mt-5 border-t border-brand/20 pt-3 text-center text-xs text-ink/55">{t("An example of the arithmetic, not a record of one case.")}</p>
            </div>
          </Reveal>
        </div>
        <Reveal>
          <p className="mt-12 text-center text-sm font-semibold uppercase tracking-widest text-brand">{t("Where the giving reaches")}</p>
          <div className="mt-4 overflow-hidden rounded-2xl shadow-md"><IndiaNetworkMap /></div>
        </Reveal>
      </section>

      {/* 3. how we do it: a vertical timeline */}
      <section className="bg-slate-50 py-16">
        <div className="container-site">
          <Reveal>
            <Chapter n="03" label={t("The method")} />
            <h2 className="h2 mt-3">{t("How we carry a case from request to recovery")}</h2>
          </Reveal>
          <div className="mt-12 grid items-start gap-10 lg:grid-cols-[1.15fr_1fr] lg:gap-14">
            <ol className="relative space-y-8 border-l-2 border-brand/30 pl-8 md:pl-12">
              {journey.map((s, i) => (
                <li key={s.title} className="relative">
                  <Reveal delay={i * 60}>
                    <span className="absolute -left-[3.15rem] flex h-10 w-10 items-center justify-center rounded-full bg-brand font-bold text-white ring-4 ring-slate-50 md:-left-[4.15rem] md:h-12 md:w-12 md:text-lg">{i + 1}</span>
                    <h3 className="font-serif text-xl font-bold">{t(s.title)}</h3>
                    <p className="justified mt-1 max-w-2xl text-ink/70">{t(s.text)}</p>
                  </Reveal>
                </li>
              ))}
            </ol>
            <Reveal delay={120} className="lg:sticky lg:top-28">
              <figure className="relative overflow-hidden rounded-2xl shadow-lg">
                <img src="/assets/images/gallery/health-nutrition/health-checkup-bp.jpg" alt={t("A health worker examines a patient while villagers wait their turn")} loading="lazy" decoding="async" className="h-80 w-full object-cover md:h-[30rem]" />
                <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#061a36]/90 to-transparent p-5 pt-16 text-sm text-white">
                  {t("Care reaches the village first. Crowdfunding is how we carry the cases that need a hospital.")}
                </figcaption>
              </figure>
            </Reveal>
          </div>
        </div>
      </section>

      {/* 4. the people */}
      <section className="container-site py-16">
        <Reveal>
          <Chapter n="04" label={t("The people")} />
          <h2 className="h2 mt-3 max-w-3xl">{t("Behind every number is a bed, and someone waiting beside it.")}</h2>
          <p className="mt-3 max-w-2xl text-sm text-ink/60">{t("Faces are kept private, and photos are shared only with the family's consent.")}</p>
        </Reveal>

        <figure className="mt-10 overflow-hidden rounded-2xl border bg-white shadow-md md:grid md:grid-cols-2">
          <img src={base + "family-before-after.jpg"} alt={t("A family together at home, and the same patient during treatment")} loading="lazy" decoding="async" className="h-72 w-full object-cover md:h-full" />
          <figcaption className="flex flex-col justify-center bg-gradient-to-br from-brand-dark to-brand p-8 text-white md:p-12">
            <p className="text-xs font-semibold uppercase tracking-widest text-white/80">{t("From the hospital bed to home")}</p>
            <h3 className="mt-3 font-serif text-2xl font-bold md:text-3xl">{t("Left: the family at home. Right: the weeks it took to get back there.")}</h3>
            {quote && <blockquote className="mt-5 border-l-4 border-white/50 pl-4 text-white/95">
              <p>“{quote.quote}”</p>
              <footer className="mt-2 text-sm text-white/75">{quote.name}</footer>
            </blockquote>}
          </figcaption>
        </figure>

        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {gallery.map((g, i) => (
            <Reveal key={g.file} delay={(i % 3) * 80}>
              <article className="group relative overflow-hidden rounded-2xl shadow-sm">
                <img src={base + g.file} alt={t(g.title)} loading="lazy" decoding="async" className="h-72 w-full object-cover transition duration-500 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#061a36]/90 via-[#061a36]/20 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-5 text-white">
                  <h3 className="font-serif text-lg font-bold">{t(g.title)}</h3>
                  <p className="mt-1 text-sm text-white/85">{t(g.text)}</p>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </section>

      {/* 5. impact in numbers */}
      <section className="bg-gradient-to-br from-brand-dark to-brand py-16 text-white">
        <div className="container-site">
          <Reveal>
            <Chapter n="05" label={t("The result")} light />
            <h2 className="mt-3 max-w-3xl text-3xl font-bold leading-tight md:text-4xl">{t("What two decades of giving together has added up to")}</h2>
          </Reveal>
          <dl className="mt-10 grid gap-5 sm:grid-cols-3">
            {impact.map(({ stat, caption }) => (
              <div key={stat.label} className="flex flex-col rounded-2xl border border-white/20 bg-white/10 p-7 backdrop-blur">
                <dd className="whitespace-nowrap font-serif text-5xl font-bold leading-none md:text-6xl"><CountUp stat={stat} /></dd>
                <dt className="mt-4 border-t border-white/25 pt-4 text-base font-semibold">{t(stat.label)}</dt>
                <p className="mt-1 text-sm text-white/80">{t(caption)}</p>
              </div>
            ))}
          </dl>
          <p className="mt-6 text-sm text-white/75">{t("Figures from our own records. See the full reports on the transparency pages.")}</p>
          <div className="mt-10 flex flex-col items-start gap-5 border-t border-white/25 pt-8 md:flex-row md:items-center md:justify-between">
            <p className="max-w-xl text-lg font-semibold leading-snug">{t("The next family is already in a waiting room. You can be part of their story.")}</p>
            <div className="flex flex-wrap gap-3">
              <Link href="/donate" className="btn btn-primary">{t("Donate for a patient")} <span aria-hidden="true">→</span></Link>
              <Link href="/transparency" className="btn btn-outline">{t("See where funds go")}</Link>
            </div>
          </div>
        </div>
      </section>

    </>
  );
}
