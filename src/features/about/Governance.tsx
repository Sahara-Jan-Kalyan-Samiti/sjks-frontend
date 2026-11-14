"use client";

import Link from "next/link";
import { useLang } from "@/i18n/LangContext";
import { site } from "@/config/site";
import PageHero from "@/components/layout/PageHero";
import Reveal from "@/components/ui/Reveal";

const members: [string, string][] = [
  ["Dr. Harishankar Sen", "President"],
  ["Manish Sen", "Secretary"],
  ["Smt. Ritu Usrethe", "Treasurer"]
];

const principles: [string, string][] = [
  ["Transparency", "Open books, published reports and documents shared on request."],
  ["Accountability", "Every rupee and every decision traced to an authorised office-bearer."],
  ["Integrity", "Dignity, fairness and no misuse of the Samiti's resources."]
];

const toc: [string, string][] = [
  ["governing-body", "Governing Body"],
  ["finance", "Financial Management and Audit"],
  ["monitoring", "Programme Monitoring"],
  ["conduct", "Code of Conduct"],
  ["conflict", "Conflict of Interest"],
  ["safeguarding", "Safeguarding"],
  ["grievances", "Grievances and Feedback"],
  ["improvement", "Continuous Improvement"]
];

/** A numbered section card; `id` lets the contents list on the left jump to it. */
function Section({ id, n, title, children }: { id: string; n: number; title: string; children: React.ReactNode }) {
  return (
    <Reveal>
      <section id={id} className="scroll-mt-28 rounded-2xl border border-ink/10 bg-white p-6 shadow-sm sm:p-8">
        <div className="flex items-center gap-4">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand font-serif text-base font-bold text-white">
            {n}
          </span>
          <h2 className="font-serif text-xl font-bold text-ink md:text-2xl">{title}</h2>
        </div>
        <div className="mt-4 space-y-3 text-[15px] leading-relaxed text-ink/75">{children}</div>
      </section>
    </Reveal>
  );
}

function Ticks({ items }: { items: React.ReactNode[] }) {
  return (
    <ul className="space-y-2.5">
      {items.map((x, i) => (
        <li key={i} className="flex gap-3">
          <span
            aria-hidden="true"
            className="mt-1 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-brand/15 text-[10px] font-bold text-brand-dark"
          >
            ✓
          </span>
          <span>{x}</span>
        </li>
      ))}
    </ul>
  );
}

export default function Governance() {
  const { t } = useLang();
  return (
    <>
      <PageHero
        eyebrow={t("About Us")}
        title={t("Good Governance")}
        text="Transparency, accountability and integrity in everything we do."
      />

      <section className="container-site py-12 md:py-16">
        <Reveal>
          <p className="mx-auto max-w-3xl text-center text-lg leading-relaxed text-ink/75">
            At Sahara Jan Kalyan Samiti, good governance is the foundation of ethical and sustainable social development. We are committed
            to using every resource responsibly and making every decision in the best interest of the communities we serve.
          </p>
        </Reveal>
        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          {principles.map(([h, p], i) => (
            <Reveal key={h} delay={i * 70}>
              <div className="h-full rounded-2xl bg-brand-light p-6 text-center ring-1 ring-brand/10">
                <h3 className="font-serif text-lg font-bold text-brand-dark">{h}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink/70">{p}</p>
              </div>
            </Reveal>
          ))}
        </div>
        <p className="mt-6 text-center text-sm text-ink/70">
          Registration details are on our{" "}
          <Link href="/about#legal" className="font-semibold text-brand-dark underline underline-offset-2">
            Registration &amp; Legal Documents
          </Link>{" "}
          section.
        </p>
      </section>

      <div className="bg-brand-light/60 py-12 md:py-16">
        <div className="container-site grid items-start gap-8 lg:grid-cols-4 lg:gap-10">
          <nav
            aria-label="On this page"
            className="hidden rounded-2xl border border-ink/10 bg-white p-5 shadow-sm lg:sticky lg:top-28 lg:block"
          >
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-ink/60">On this page</p>
            <ol className="mt-3 space-y-1">
              {toc.map(([id, label], i) => (
                <li key={id}>
                  <a
                    href={`#${id}`}
                    className="flex gap-3 rounded-lg px-2 py-1.5 text-sm text-ink/75 no-underline hover:bg-brand/10 hover:text-brand-dark"
                  >
                    <span className="font-semibold text-brand">{i + 1}.</span>
                    {label}
                  </a>
                </li>
              ))}
            </ol>
          </nav>

          <div className="space-y-5 lg:col-span-3">
            <Section id="governing-body" n={1} title="Governing Body">
              <p>
                The Samiti is governed by an elected Governing Body, constituted under our registered bye-laws. The Governing Body meets
                regularly to review programmes, finances and policies.
              </p>
              <div className="overflow-hidden rounded-xl border border-ink/10">
                <table className="w-full text-left text-sm">
                  <caption className="sr-only">Office-bearers of the Governing Body</caption>
                  <thead className="bg-brand-dark text-white">
                    <tr>
                      <th scope="col" className="w-14 px-4 py-3 font-semibold">
                        #
                      </th>
                      <th scope="col" className="px-4 py-3 font-semibold">
                        Name
                      </th>
                      <th scope="col" className="px-4 py-3 font-semibold">
                        Designation
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-ink/10">
                    {members.map(([name, post], i) => (
                      <tr key={name} className="odd:bg-white even:bg-brand-light/50">
                        <td className="px-4 py-3 text-ink/60">{i + 1}</td>
                        <th scope="row" className="px-4 py-3 font-semibold text-ink">
                          {name}
                        </th>
                        <td className="px-4 py-3">
                          <span className="rounded-full bg-brand/10 px-3 py-1 text-xs font-semibold text-brand-dark">{post}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="text-sm">
                The full executive committee is listed on the{" "}
                <Link href="/about#committee" className="font-semibold text-brand-dark underline underline-offset-2">
                  About Us
                </Link>{" "}
                page.
              </p>
            </Section>

            <Section id="finance" n={2} title="Financial Management and Audit">
              <Ticks
                items={[
                  "Proper books of accounts are maintained for every financial year.",
                  "Funds are used only for the purposes for which they were given.",
                  "All payments are made with approval from authorised office-bearers, as per the rules framed by our Governing Body."
                ]}
              />
              <div className="overflow-hidden rounded-xl border border-ink/10">
                <table className="w-full text-left text-sm">
                  <caption className="sr-only">Audit details</caption>
                  <tbody className="divide-y divide-ink/10">
                    <tr>
                      <th scope="row" className="w-2/5 bg-brand-light/60 px-4 py-3 font-semibold text-ink">
                        Statutory auditor
                      </th>
                      <td className="px-4 py-3">Independent Chartered Accountant, audited annually</td>
                    </tr>
                    <tr>
                      <th scope="row" className="bg-brand-light/60 px-4 py-3 font-semibold text-ink">
                        Audit firm
                      </th>
                      <td className="px-4 py-3">
                        ITIN THARWANI &amp; CO., Chartered Accountants, 303/304 Ronak Plaza, South Tukoganj, Indore (M.P.) – 452001
                      </td>
                    </tr>
                    <tr>
                      <th scope="row" className="bg-brand-light/60 px-4 py-3 font-semibold text-ink">
                        Latest financial year
                      </th>
                      <td className="px-4 py-3">2025-2026</td>
                    </tr>
                    <tr>
                      <th scope="row" className="bg-brand-light/60 px-4 py-3 font-semibold text-ink">
                        Audited statements
                      </th>
                      <td className="px-4 py-3">
                        Available on request, and in{" "}
                        <Link href="/transparency" className="font-semibold text-brand-dark underline underline-offset-2">
                          Transparency &amp; Reports
                        </Link>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </Section>

            <Section id="monitoring" n={3} title="Programme Monitoring">
              <p>
                We plan our activities based on community needs. We maintain beneficiary and activity records and review progress regularly.
                Our Annual Report is available on request.
              </p>
            </Section>

            <Section id="conduct" n={4} title="Code of Conduct">
              <p>
                All staff, volunteers and representatives are expected to treat every person with dignity, act without discrimination, and
                never misuse the organisation&rsquo;s resources.
              </p>
            </Section>

            <Section id="conflict" n={5} title="Conflict of Interest">
              <p>Any member, staff or volunteer with a personal interest in a decision must disclose it and stay out of that decision.</p>
            </Section>

            <Section id="safeguarding" n={6} title="Safeguarding">
              <p>
                We work to keep children, women and vulnerable people safe in all our activities. Our safeguarding and related policies are
                listed on the{" "}
                <Link href="/policies" className="font-semibold text-brand-dark underline underline-offset-2">
                  Our Policies
                </Link>{" "}
                page.
              </p>
            </Section>

            <Section id="grievances" n={7} title="Grievances and Feedback">
              <p>Beneficiaries, donors, volunteers or anyone else can share a concern or suggestion with us:</p>
              <div className="grid gap-3 sm:grid-cols-2">
                <a
                  href={`mailto:${site.email}`}
                  className="rounded-xl border border-ink/10 bg-brand-light/60 p-4 no-underline transition hover:border-brand/40 hover:shadow-sm"
                >
                  <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-ink/60">Email</span>
                  <span className="mt-1 block break-all font-semibold text-brand-dark">{site.email}</span>
                </a>
                <a
                  href={site.phoneHref}
                  className="rounded-xl border border-ink/10 bg-brand-light/60 p-4 no-underline transition hover:border-brand/40 hover:shadow-sm"
                >
                  <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-ink/60">Phone</span>
                  <span className="mt-1 block font-semibold text-brand-dark">{site.phone}</span>
                </a>
              </div>
              <p>We aim to respond within a few working days. All complaints are treated confidentially.</p>
            </Section>

            <Section id="improvement" n={8} title="Continuous Improvement">
              <p>We review our governance practices every year and keep improving them.</p>
            </Section>

            <p className="pt-2 text-right text-sm text-ink/60">Last updated: 02 Jan 2026</p>
          </div>
        </div>
      </div>
    </>
  );
}
