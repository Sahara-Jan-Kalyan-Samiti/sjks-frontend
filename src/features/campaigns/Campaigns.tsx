"use client";

import Link from "next/link";
import { useCampaigns, useDaysLeft } from "@/hooks/useCampaigns";
import { useLang } from "@/i18n/LangContext";
import { campaignStats, donateLink, rupees, type CampaignPage } from "@/data/content/campaigns";
import PageHero from "@/components/layout/PageHero";
import DonateButton from "@/components/ui/DonateButton";
import Reveal from "@/components/ui/Reveal";
import { CampaignCover, heartPhotos, PinIcon, ProgressBar, StatusPill, useDaysText } from "./shared";

/** The three moments shown under the campaigns: what a gift becomes. Photo, caption, and which part of the photo stays in view. */
const moments = [
  { src: heartPhotos[0], text: "A full plate for a hungry child", pos: "object-[58%_center]" },
  { src: heartPhotos[1], text: "A check-up for a family that cannot wait", pos: "object-[70%_center]" },
  { src: heartPhotos[2], text: "A girl riding to school, and to her future", pos: "object-[62%_center]" }
];

/** One campaign on the list: the whole card opens the campaign page, the Donate button goes straight to the donation page. */
export function CampaignCard({ c }: { c: CampaignPage }) {
  const { t } = useLang();
  const s = campaignStats(c);
  const days = useDaysLeft(c.endDate);
  const daysText = useDaysText(days);
  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-3xl border border-ink/10 bg-white shadow-[0_18px_40px_-26px_rgba(11,61,122,.45)] transition duration-300 hover:-translate-y-1.5 hover:shadow-[0_26px_50px_-24px_rgba(11,61,122,.5)] focus-within:ring-2 focus-within:ring-brand">
      <div className="relative aspect-[16/10] shrink-0 overflow-hidden">
        <CampaignCover
          c={c}
          className="transition duration-500 group-hover:scale-105 motion-reduce:transition-none motion-reduce:group-hover:scale-100"
        />
        {c.cause && (
          <span className="absolute left-4 top-4 rounded-full bg-white/95 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-brand-dark shadow">
            {t(c.cause)}
          </span>
        )}
        <StatusPill reached={s.reached} days={days} className="absolute right-4 top-4" />
      </div>
      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <h3 className="font-serif text-xl font-bold leading-snug text-brand-dark">
          <Link href={`/campaigns/${c.slug}`} className="outline-none after:absolute after:inset-0 after:content-['']">
            {c.title}
          </Link>
        </h3>
        {c.location && (
          <p className="mt-1.5 flex items-center gap-1.5 text-xs font-medium text-ink/65">
            <PinIcon />
            {c.location}
          </p>
        )}
        {c.description && <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-ink/70">{c.description}</p>}

        <div className="mt-5">
          <div className="mb-2 flex items-end justify-between gap-3">
            <p className="num-gradient text-2xl font-extrabold tabular-nums leading-none">{s.pct}%</p>
            <p className="text-[11px] font-semibold uppercase tracking-wider text-ink/65">{t("funded")}</p>
          </div>
          <ProgressBar pct={s.pct} label={`${c.title}: ${s.pct}%`} />
        </div>

        <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
          <div className="rounded-xl bg-brand-light/60 px-3 py-2">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-ink/65">{t("Raised")}</p>
            <p className="mt-0.5 text-base font-bold tabular-nums text-brand-dark">{rupees(s.raised)}</p>
          </div>
          <div className="rounded-xl bg-ink/[.04] px-3 py-2">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-ink/65">{t("Still needed")}</p>
            <p className="mt-0.5 text-base font-bold tabular-nums text-ink">{rupees(s.left)}</p>
          </div>
        </div>
        <p className="mt-3 flex flex-wrap items-center justify-between gap-2 text-xs text-ink/65">
          <span>
            {t("Goal")} {rupees(s.goal)}
          </span>
          {daysText && <span className="rounded-full bg-brand/10 px-2.5 py-0.5 font-semibold text-brand-dark">{daysText}</span>}
        </p>

        <div className="mt-auto flex flex-wrap items-center justify-between gap-3 pt-5">
          <DonateButton to={donateLink(c)} size="sm" className="relative z-10">
            {t("Donate")}
          </DonateButton>
          <span className="text-sm font-semibold text-brand">
            {t("Read full story")}{" "}
            <span aria-hidden="true" className="inline-block transition group-hover:translate-x-1 motion-reduce:transition-none">
              →
            </span>
          </span>
        </div>
      </div>
    </article>
  );
}

const trust = [
  {
    text: "Secure online payment through Razorpay",
    icon: <path d="M12 3 5 6v5c0 4.5 3 8 7 10 4-2 7-5.5 7-10V6l-7-3Zm-3 9 2 2 4-4" />
  },
  {
    text: "80G receipt when you give your PAN",
    icon: (
      <>
        <path d="M7 3h8l4 4v14H7z" />
        <path d="M14 3v5h5M10 13h6M10 17h6" />
      </>
    )
  },
  {
    text: "Amounts and updates kept current by our team",
    icon: (
      <>
        <path d="M4 19V9M10 19V5M16 19v-7M22 19H2" />
      </>
    )
  }
];

export default function Campaigns({ initialCampaigns }: { initialCampaigns?: CampaignPage[] }) {
  const { t } = useLang();
  const list = useCampaigns(initialCampaigns);
  return (
    <>
      <PageHero
        eyebrow={t("Fundraising")}
        title={t("Fundraising Campaigns")}
        text={t("Help us reach a goal. Every campaign shows what is needed, what has been raised and how much is still needed.")}
        images={["/assets/images/home/hero-slide-02.jpg"]}
        imgClassName="object-[center_28%]"
      />

      <section className="relative isolate overflow-hidden bg-gradient-to-b from-[#f3f8fe] via-white to-[#eef5fd] py-12 md:py-16">
        <div aria-hidden="true" className="pointer-events-none absolute -left-32 top-10 -z-10 h-80 w-80 rounded-full bg-sky/20 blur-3xl" />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-32 bottom-10 -z-10 h-96 w-96 rounded-full bg-brand/10 blur-3xl"
        />
        <div className="container-site">
          <ul className="mb-10 grid gap-3 sm:grid-cols-3">
            {trust.map((x) => (
              <li
                key={x.text}
                className="flex items-center gap-3 rounded-2xl bg-white px-4 py-3 text-sm font-medium text-ink/80 shadow-sm ring-1 ring-ink/5"
              >
                <span aria-hidden="true" className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand/10 text-brand">
                  <svg
                    viewBox="0 0 24 24"
                    className="h-5 w-5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    {x.icon}
                  </svg>
                </span>
                {t(x.text)}
              </li>
            ))}
          </ul>

          {!list && (
            <p role="status" className="py-16 text-center text-ink/65">
              {t("Loading…")}
            </p>
          )}
          {list && !list.length && (
            <div className="grid overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-ink/5 md:grid-cols-2">
              <div className="relative min-h-[15rem] md:min-h-[20rem]">
                <img
                  src={heartPhotos[0]}
                  alt=""
                  loading="lazy"
                  decoding="async"
                  className="absolute inset-0 h-full w-full object-cover object-[60%_center]"
                />
              </div>
              <div className="flex flex-col justify-center p-8 text-center md:p-12 md:text-left">
                <p className="font-serif text-2xl font-bold text-brand-dark">{t("No campaign is running right now")}</p>
                <p className="mt-3 text-ink/70 md:text-lg">
                  {t("New fundraising campaigns will appear here. You can still support our work at any time.")}
                </p>
                <p className="mt-7 flex flex-wrap justify-center gap-3 md:justify-start">
                  <DonateButton to="/donate">{t("Donate Now")}</DonateButton>
                  <Link href="/projects" className="btn border-2 border-brand text-brand">
                    {t("Our Projects")} <span aria-hidden="true">→</span>
                  </Link>
                </p>
              </div>
            </div>
          )}
          {list && list.length > 0 && (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {list.map((c, i) => (
                <Reveal key={c.slug} delay={Math.min(i, 5) * 70} className="h-full">
                  <CampaignCard c={c} />
                </Reveal>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="bg-white py-14 md:py-20">
        <div className="container-site">
          <Reveal>
            <div className="mx-auto max-w-2xl text-center">
              <p className="eyebrow">{t("Why it matters")}</p>
              <h2 className="h2 mt-2">{t("Your gift, in their smile")}</h2>
              <p className="mt-3 text-ink/70 md:text-lg">
                {t("Meals, medicines, school bags and a safe place to learn: this is what a campaign becomes.")}
              </p>
            </div>
          </Reveal>
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {moments.map((m, i) => (
              <Reveal key={m.text} delay={i * 90} className="h-full">
                <figure className="group relative aspect-[4/5] overflow-hidden rounded-3xl shadow-[0_18px_40px_-22px_rgba(11,61,122,.55)]">
                  <img
                    src={m.src}
                    alt=""
                    loading="lazy"
                    decoding="async"
                    className={`h-full w-full object-cover transition duration-700 group-hover:scale-105 motion-reduce:transition-none ${m.pos}`}
                  />
                  <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-[#061a36]/90 via-[#061a36]/20 to-transparent" />
                  <figcaption className="absolute inset-x-0 bottom-0 p-6 text-left font-serif text-xl font-bold leading-snug text-white">
                    {t(m.text)}
                  </figcaption>
                </figure>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
