"use client";

import { useLang } from "@/i18n/LangContext";
import PageHero from "@/components/layout/PageHero";
import SmartForm from "@/components/forms/SmartForm";
import { Steps, Highlights, Faq } from "@/components/sections/InfoBlocks";
import { StatStrip, PhotoStrip, TickList, CrossLink, involvedImages as img } from "./InvolvedParts";

export default function Volunteer() {
  const { t } = useLang();
  return (
    <>
      <PageHero
        eyebrow={t("Get Involved")}
        title={t("Volunteer Support")}
        text="Give your time, skills and energy at our field camps, learning centres and plantation drives. No experience needed."
        images={[img.volunteerHero]}
      />
      <StatStrip
        items={[
          ["20+", "Years of service"],
          ["5", "Programme areas"],
          ["Mon-Sat", "Office open"],
          ["Free", "Always, to volunteer"]
        ]}
      />
      <Steps
        eyebrow="How it works"
        title="From first hello to your first field day"
        intro="Getting started is simple. Here is what to expect once you register."
        steps={[
          ["Register", "Fill in the short form below, or call or WhatsApp our team."],
          ["We connect", "A team member contacts you to understand your interests, skills and availability."],
          ["Get matched", "You are matched to education, health camps, women's livelihoods, environment or relief."],
          ["Make a difference", "Join field activity with our team and see the work first-hand."]
        ]}
      />
      <section id="volunteer" className="bg-brand-light py-16 md:py-20">
        <div className="container-site grid items-start gap-8 lg:grid-cols-5 lg:gap-12">
          <div className="lg:col-span-2 lg:sticky lg:top-28">
            <p className="eyebrow">Volunteer registration</p>
            <h2 className="mt-2 font-serif text-3xl font-bold leading-tight text-ink md:text-4xl">Volunteer with us</h2>
            <p className="mt-3 text-base leading-relaxed text-ink/70">Tell us how you would like to help and our team will contact you.</p>
            <TickList
              items={[
                "Education, health camps, women's livelihoods, plantation and relief",
                "Students and young professionals welcome, no experience needed",
                "Our team contacts you within a few working days"
              ]}
            />
            <img
              src={img.withStudents}
              alt="A volunteer with students at a learning centre"
              loading="lazy"
              className="mt-8 hidden aspect-[16/10] w-full rounded-2xl object-cover shadow-sm ring-1 ring-ink/10 lg:block"
            />
          </div>
          <div className="rounded-3xl border border-ink/10 bg-white p-6 shadow-[0_20px_50px_-28px_rgba(11,61,122,.35)] sm:p-8 lg:col-span-3">
            <SmartForm
              strictPhone
              kind="Volunteer sign-up"
              submitLabel="Volunteer with us"
              table="volunteers"
              fields={[
                { name: "name", label: "Full name", required: true, placeholder: "Your full name" },
                { name: "phone", label: "Phone", type: "tel", required: true, placeholder: "98765 43210" },
                { name: "email", label: "Email", type: "email", placeholder: "you@example.com (optional)" },
                {
                  name: "area",
                  label: "Area of interest",
                  type: "select",
                  options: ["Child education", "Health camps", "Women empowerment", "Tree plantation", "Relief drives", "Anywhere needed"]
                },
                { name: "message", label: "Message", type: "textarea", placeholder: "Tell us about your skills or availability (optional)" }
              ]}
            />
          </div>
        </div>
      </section>
      <PhotoStrip
        eyebrow="See the work"
        title="Volunteers in the field"
        photos={[
          [img.activity, "Volunteering activity at a learning centre"],
          [img.planting, "Plantation drive"],
          [img.workshop, "Skill workshop with volunteers"]
        ]}
      />
      <Highlights
        eyebrow="Ways to help"
        title="There is a role for everyone"
        items={[
          ["Give your time", "Support learning centres, health camps, plantation drives and relief distribution."],
          ["Share a skill", "Teaching, medical help, design, photography, accounts or digital support are all welcome."],
          ["Spread the word", "Follow us on social media and share our stories with your network."]
        ]}
      />
      <Faq
        items={[
          ["Do I need prior experience to volunteer?", "No. Most field activities need willingness and time. Our team guides you on the day."],
          ["Can students volunteer?", "Yes. Students and young professionals are welcome. Contact us with your availability."],
          ["How soon will someone contact me?", "We aim to reply within a few working days. For something urgent, call or WhatsApp us."],
          [
            "Where is your office?",
            "Our office is at 21/419, Behind TCPC, Khurai Road, Shastri Ward No. 20, Near Hotel Ahilya, Sagar, Madhya Pradesh - 470002, and is open Monday to Saturday, 9:00 AM - 6:00 PM."
          ]
        ]}
      />
      <CrossLink
        title="Is your company looking to make an impact?"
        text="Partner with us on a CSR project with defined goals, field reporting and documentation."
        href="/csr-partnerships"
        cta="CSR Partnerships"
      />
    </>
  );
}
