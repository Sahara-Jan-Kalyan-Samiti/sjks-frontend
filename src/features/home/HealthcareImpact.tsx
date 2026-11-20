"use client";

import { useLang } from "@/i18n/LangContext";
import CountUp from "@/components/ui/CountUp";
import DonateButton from "@/components/ui/DonateButton";
import Img from "@/components/ui/Img";
import Reveal from "@/components/ui/Reveal";
import { useInView } from "@/hooks/useInView";

/** Patients supported by financial year (the Samiti's own figures). The total is worked out, so the table can never disagree with it. */
const years: [string, number][] = [
  ["2023–2024", 912],
  ["2024–2025", 1847],
  ["2025–2026", 2409]
];
const total = years.reduce((sum, [, n]) => sum + n, 0);
const most = Math.max(...years.map(([, n]) => n));

/**
 * "Healthcare Impact": a health-camp photo with the share of patients who improved written on it, beside a table of the patients
 * supported year by year (a bar in every row), then the commitment and a button to support the work.
 */
export default function HealthcareImpact() {
  const { t } = useLang();
  const [tableRef, tableSeen] = useInView<HTMLDivElement>(0.3);
  const [photoRef, photoSeen] = useInView<HTMLDivElement>(0.3);
  return (
    <section id="healthcare-impact" className="defer-render relative overflow-hidden bg-white pb-12 pt-14 md:pb-14 md:pt-16">
      <span aria-hidden="true" className="pointer-events-none absolute -right-24 top-10 h-72 w-72 rounded-full bg-sky-200/40 blur-3xl" />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -left-24 bottom-0 h-72 w-72 rounded-full bg-emerald-200/30 blur-3xl"
      />
      <div className="container-site relative">
        <Reveal>
          <div className="mx-auto max-w-3xl text-center">
            <p className="eyebrow">{t("Healthcare Impact")} · 2023–2026</p>
            <h2 className="h2 mt-2">
              <span className="text-brand">{total.toLocaleString("en-IN")}</span> {t("patients supported in the last three years")}
            </h2>
            <p className="mt-4 leading-relaxed text-ink/70">
              {t(
                "Sahara Jan Kalyan Samiti has been continuously working to improve access to healthcare services by providing medical assistance and treatment support to people in need, particularly from underprivileged and economically weaker sections of society."
              )}
            </p>
            <p className="mt-3 leading-relaxed text-ink/70">
              {t(
                "Over the last three years, our organization has supported 5,168 patients by facilitating medical treatment and providing necessary healthcare assistance."
              )}
            </p>
          </div>
        </Reveal>

        <div className="mt-10 grid items-stretch gap-6 lg:grid-cols-5">
          {/* light card: a photo strip, then the share of patients who improved */}
          <Reveal className="lg:col-span-2">
            <div
              ref={photoRef}
              className="flex h-full flex-col overflow-hidden rounded-2xl border border-ink/10 bg-white shadow-[0_14px_40px_-24px_rgba(11,61,122,.35)]"
            >
              <div className="relative h-48 shrink-0 overflow-hidden sm:h-56">
                <Img
                  file="gallery/health-nutrition/health-checkup-bp.jpg"
                  alt="A doctor checking a patient's blood pressure at a health camp"
                  defer
                  className="absolute inset-0 h-full w-full object-[40%_30%]"
                />
                <span className="absolute left-4 top-4 rounded-full bg-white px-3 py-1 text-[11px] font-bold uppercase tracking-widest text-brand-dark shadow-sm">
                  {t("Our Impact")}
                </span>
              </div>
              <div className="flex flex-1 flex-col p-6">
                <div className="flex items-end gap-3">
                  <p className="text-5xl font-extrabold leading-none tabular-nums text-brand-dark">
                    ~<CountUp stat={{ label: "improved", value: 90, suffix: "%" }} />
                  </p>
                  <p className="pb-0.5 text-xs font-bold uppercase leading-snug tracking-wider text-ink/55">
                    {t("of beneficiaries reported improvement")}
                  </p>
                </div>
                <div aria-hidden="true" className="mt-4 h-2.5 overflow-hidden rounded-full bg-brand/10">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-brand to-emerald-400 transition-[width] duration-[1600ms] ease-out motion-reduce:transition-none"
                    style={{ width: photoSeen ? "90%" : "0%" }}
                  />
                </div>
                <p className="mt-4 text-sm leading-relaxed text-ink/70">
                  {t(
                    "Approximately 90% of the beneficiaries reported improvement in their health conditions and benefited from the medical assistance and treatment support facilitated by our organization."
                  )}
                </p>
              </div>
            </div>
          </Reveal>

          {/* light report table: a bar and the growth on the year before in every row */}
          <Reveal delay={120} className="lg:col-span-3">
            <div
              ref={tableRef}
              className="flex h-full flex-col overflow-hidden rounded-2xl border border-ink/10 bg-white shadow-[0_14px_40px_-24px_rgba(11,61,122,.35)]"
            >
              <table className="h-full w-full border-collapse text-left">
                <caption className="border-b border-ink/10 bg-brand-light/70 px-5 py-4 text-left sm:px-6">
                  <span className="flex items-center gap-3 font-serif text-lg font-bold text-ink">
                    <span
                      aria-hidden="true"
                      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white text-brand shadow-sm ring-1 ring-brand/15"
                    >
                      <svg
                        viewBox="0 0 24 24"
                        className="h-5 w-5"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M3 12h4l2.5-6 4 12 2.5-6h5" />
                      </svg>
                    </span>
                    {t("Our Healthcare Impact at a Glance")}
                  </span>
                </caption>
                <thead>
                  <tr className="border-b border-ink/10 text-[11px] font-bold uppercase tracking-wider text-ink/50">
                    <th scope="col" className="px-5 py-3 sm:px-6">
                      {t("Financial Year")}
                    </th>
                    <th scope="col" className="px-5 py-3 text-right sm:px-6">
                      {t("Patients Supported")}
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-ink/10">
                  {years.map(([label, n], i) => {
                    const growth = i > 0 ? Math.round(((n - years[i - 1][1]) / years[i - 1][1]) * 100) : null;
                    return (
                      <tr key={label} className="transition-colors hover:bg-brand-light/40">
                        <th scope="row" className="w-[30%] whitespace-nowrap px-5 py-5 sm:px-6">
                          <span className="text-base font-semibold text-ink">{label}</span>
                        </th>
                        <td className="px-5 py-5 sm:px-6">
                          <div className="flex items-center gap-4">
                            <div aria-hidden="true" className="h-2.5 flex-1 overflow-hidden rounded-full bg-brand/10">
                              <div
                                className="h-full rounded-full bg-brand transition-[width] duration-[1400ms] ease-out motion-reduce:transition-none"
                                style={{ width: tableSeen ? `${(n / most) * 100}%` : "0%" }}
                              />
                            </div>
                            <span className="flex w-[4.75rem] flex-col items-end leading-tight">
                              <span className="text-lg font-bold tabular-nums text-ink">
                                <CountUp stat={{ label, value: n }} />
                              </span>
                              {growth !== null && <span className="mt-0.5 text-xs font-semibold text-emerald-600">▲ {growth}%</span>}
                            </span>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
                <tfoot>
                  <tr className="border-t-2 border-brand/30 bg-brand-light/70">
                    <th scope="row" className="px-5 py-5 sm:px-6">
                      <span className="block text-base font-bold text-ink">{t("Total")}</span>
                      <span className="block text-xs font-medium text-ink/55">{t("patients in three years")}</span>
                    </th>
                    <td className="px-5 py-5 text-right text-3xl font-extrabold tabular-nums text-brand-dark sm:px-6">
                      <CountUp stat={{ label: "Total", value: total }} />
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </Reveal>
        </div>

        <Reveal>
          <div className="mx-auto mt-8 max-w-3xl text-center">
            <p className="leading-relaxed text-ink/70">
              {t(
                "Our commitment is to ensure that financial difficulties do not become a barrier to accessing essential healthcare and medical treatment."
              )}
            </p>
            <p className="mt-3 font-serif text-xl font-bold text-brand-dark md:text-2xl">
              {t("Serving Humanity, Improving Health, Transforming Lives.")}
            </p>
            <div className="mt-5 flex justify-center">
              <DonateButton to="/donate?cause=Healthcare">Support Our Health Care Work</DonateButton>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
