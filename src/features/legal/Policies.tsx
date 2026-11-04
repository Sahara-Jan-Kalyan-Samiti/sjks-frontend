"use client";

import { policies, policiesEmail } from "@/data/content/policies";
import { useLang } from "@/i18n/LangContext";
import PageHero from "@/components/layout/PageHero";
import Reveal from "@/components/ui/Reveal";
import { site } from "@/config/site";

/** Our Policies: the list of policies that guide the Samiti's work, staff and volunteers. */
export default function Policies() {
  const { t } = useLang();
  const intro = t(
    `${site.name} is committed to transparency, accountability and the safety of everyone we work with. The following policies guide our work, staff and volunteers:`
  );
  return (
    <>
      <PageHero eyebrow={t("About Us")} title={t("Our Policies")} text={intro} />

      <section className="bg-gradient-to-b from-[#f3f8fe] via-white to-white py-12 md:py-16">
        <div className="container-site">
          <ol className="mx-auto grid max-w-4xl gap-3">
            {policies.map((p, i) => (
              <Reveal key={p} delay={(i % 5) * 50}>
                <li className="flex items-center gap-4 rounded-2xl border border-ink/10 bg-white p-4 shadow-sm sm:p-5">
                  <span
                    aria-hidden="true"
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand text-sm font-bold text-white"
                  >
                    {i + 1}
                  </span>
                  <span className="font-semibold leading-snug text-ink">{t(p)}</span>
                </li>
              </Reveal>
            ))}
          </ol>

          <p className="mx-auto mt-8 max-w-4xl rounded-2xl bg-brand-light px-5 py-4 text-ink/80">
            {t("Copies of these policies are available on request. Please write to us at")}{" "}
            <a href={`mailto:${policiesEmail}`} className="font-semibold text-brand-dark hover:text-brand">
              {policiesEmail}
            </a>
            .
          </p>
        </div>
      </section>
    </>
  );
}
