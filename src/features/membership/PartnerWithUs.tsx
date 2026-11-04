"use client";

import { site } from "@/config/site";
import { useLang } from "@/i18n/LangContext";
import PageHero from "@/components/layout/PageHero";

const PHONE = "07582-355068";

/** Partner With Us: how NGOs, foundations, CSR partners and community groups can work with the Samiti. */
export default function PartnerWithUs() {
  const { t } = useLang();
  return (
    <>
      <PageHero
        images={["/assets/images/member-id-banner.jpg"]}
        imgClassName="object-[center_42%]"
        eyebrow={t("Membership")}
        title={t("Partner With Us")}
        text={t(
          "Sahara Jan Kalyan Samiti welcomes NGOs, foundations, CSR partners and community groups who share our commitment to education, nutrition and the welfare of children and families. Together, we can reach more people and create a lasting impact."
        )}
      />

      <section className="bg-gradient-to-b from-[#f3f8fe] via-white to-white py-12 md:py-16">
        <div className="container-site">
          <div className="mx-auto max-w-3xl rounded-3xl bg-white p-6 shadow-[0_10px_40px_-12px_rgba(11,79,156,.25)] ring-1 ring-brand/10 sm:p-8">
            <p className="text-lg text-ink/80">{t("To partner with us, write to us or call us:")}</p>
            <ul className="mt-5 space-y-3">
              <li>
                <a
                  href={`mailto:${site.email}`}
                  className="flex items-center gap-3 rounded-2xl border border-ink/10 p-4 font-semibold text-brand-dark transition hover:bg-brand-light"
                >
                  <span aria-hidden="true" className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-light text-brand">
                    <svg
                      viewBox="0 0 24 24"
                      className="h-5 w-5"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <rect x="3" y="5" width="18" height="14" rx="2" />
                      <path d="m3 7 9 6 9-6" />
                    </svg>
                  </span>
                  {site.email}
                </a>
              </li>
              <li>
                <a
                  href="tel:+917582355068"
                  className="flex items-center gap-3 rounded-2xl border border-ink/10 p-4 font-semibold text-brand-dark transition hover:bg-brand-light"
                >
                  <span aria-hidden="true" className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-light text-brand">
                    <svg
                      viewBox="0 0 24 24"
                      className="h-5 w-5"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z" />
                    </svg>
                  </span>
                  {PHONE}
                </a>
              </li>
            </ul>
          </div>
        </div>
      </section>
    </>
  );
}
