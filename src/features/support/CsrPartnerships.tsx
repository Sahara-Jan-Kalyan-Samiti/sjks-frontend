"use client";

import { useLang } from "@/i18n/LangContext";
import PageHero from "@/components/layout/PageHero";
import SmartForm from "@/components/forms/SmartForm";
import { Steps, Highlights, Faq } from "@/components/sections/InfoBlocks";
import { StatStrip, PhotoStrip, TickList, CrossLink, involvedImages as img } from "./InvolvedParts";

export default function CsrPartnerships() {
  const { t } = useLang();
  return (
    <>
      <PageHero
        eyebrow={t("Get Involved")}
        title={t("CSR Partnerships")}
        text="Partner with a registered, transparent NGO for verified, reportable impact in Madhya Pradesh."
        images={[img.csrHero]}
      />
      <StatStrip
        items={[
          ["CSR-1", "Registered"],
          ["12A · 80G", "Tax benefits"],
          ["FCRA", "Registered"],
          ["Since 2004", "Community work"]
        ]}
      />
      <Steps
        eyebrow="How a partnership works"
        title="From enquiry to reported impact"
        intro="A clear, documented process from the first conversation to the final report."
        steps={[
          ["Enquire", "Send us your CSR focus area and budget through the form below."],
          ["Plan together", "We shape a project with defined goals, timeline and beneficiaries."],
          ["Deliver", "Our field team runs the programme, with your employees welcome to take part."],
          ["Report", "You receive field reports, photographs and documentation for your CSR records."]
        ]}
      />
      <section id="csr" className="bg-brand-light py-16 md:py-20">
        <div className="container-site grid items-start gap-8 lg:grid-cols-5 lg:gap-12">
          <div className="order-1 lg:col-span-2 lg:sticky lg:top-28">
            <p className="eyebrow">Corporate partnership</p>
            <h2 className="mt-2 font-serif text-3xl font-bold leading-tight text-ink md:text-4xl">Corporate CSR enquiry</h2>
            <p className="mt-3 text-base leading-relaxed text-ink/70">Partner with us for verified, reportable impact.</p>
            <TickList
              items={[
                "CSR-1, 12A, 80G and FCRA registered",
                "Defined goals, field reporting and documentation",
                "Certificates and reports shared on request"
              ]}
            />
            <img
              src={img.workshop}
              alt="Corporate volunteers at a Sahara workshop"
              loading="lazy"
              className="mt-8 hidden aspect-[16/10] w-full rounded-2xl object-cover shadow-sm ring-1 ring-ink/10 lg:block"
            />
          </div>
          <div className="order-2 rounded-3xl border border-ink/10 bg-white p-6 shadow-[0_20px_50px_-28px_rgba(11,61,122,.35)] sm:p-8 lg:col-span-3">
            <SmartForm
              strictPhone
              kind="CSR enquiry"
              submitLabel="Send enquiry"
              fields={[
                { name: "company", label: "Company name", required: true, placeholder: "Your company or foundation" },
                { name: "name", label: "Contact person", required: true, placeholder: "Full name" },
                { name: "email", label: "Email", type: "email", required: true, placeholder: "name@company.com" },
                { name: "phone", label: "Phone", type: "tel", placeholder: "98765 43210 (optional)" },
                {
                  name: "message",
                  label: "How would you like to partner?",
                  type: "textarea",
                  placeholder: "Tell us about your CSR focus area or budget (optional)"
                }
              ]}
            />
          </div>
        </div>
      </section>
      <PhotoStrip
        eyebrow="See the work"
        title="Corporate teams in the field"
        photos={[
          [img.csrHero, "Employee volunteers with Sahara"],
          [img.withStudents, "Volunteer with students"],
          [img.activity, "Volunteering activity"]
        ]}
      />
      <Highlights
        eyebrow="Partnership options"
        title="Ways your company can partner"
        items={[
          ["Co-create a project", "Design a CSR project with defined goals, field reporting and documentation."],
          ["Employee volunteering", "Bring your team to field camps, plantation drives and learning centres."],
          ["Sponsor a cause", "Sponsor a child's education, a tree drive, a health camp or a family kit."]
        ]}
      />
      <Faq
        items={[
          [
            "Is the Samiti eligible for CSR funding?",
            "Yes. We hold CSR-1 registration along with 12A, 80G and FCRA. Certificates are shared on request."
          ],
          [
            "What reports will we receive?",
            "Field reports, photographs and documentation for your CSR records, as agreed for each project."
          ],
          [
            "Can my organisation partner with the Samiti?",
            "Yes. Companies can write to us here, and NPOs and institutions can apply to join our network from the Memberships page."
          ],
          ["How soon will someone contact me?", "We aim to reply within a few working days. For something urgent, call or WhatsApp us."]
        ]}
      />
      <CrossLink
        title="Prefer to give your own time?"
        text="Individuals and students can join our field activities as volunteers."
        href="/volunteer"
        cta="Volunteer Support"
      />
    </>
  );
}
