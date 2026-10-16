import { legalDocs } from "@/data/content/legal";
import { pageTextDefaults } from "@/data/content/pageContent";

/**
 * Search and share text of every page: the title (shown as "<title> | Sahara Jan Kalyan Samiti") and the description.
 * The key is the page address. Pages that depend on a post or a programme (news, blog, projects) build theirs from that item.
 * Texts an admin edits in the panel (Website Pages) show in the page itself; this list holds the original wording for crawlers.
 */
export interface PageSeo {
  /** Left out on the home page, which is simply the organisation name. */
  title?: string;
  description: string;
}

export const pageSeo = {
  "/": {
    description: "Community health, education, women empowerment, tree plantation and disaster relief."
  },
  "/about": {
    title: "About Us - Founder, Mission & Committee",
    description: "The founder, mission, executive committee and management team of Sahara Jan Kalyan Samiti, working in Sagar, Madhya Pradesh since 2004."
  },
  "/about/journey": { title: "Our Journey", description: "How Sahara Jan Kalyan Samiti grew from its registration in 2004 into a community-led organisation across Madhya Pradesh." },
  "/about/awards": { title: "Awards & Recognition", description: "Awards, appreciation and recommendation letters received by Sahara Jan Kalyan Samiti." },
  "/projects": { title: "Our Projects", description: "The core programmes and the complete project portfolio of Sahara Jan Kalyan Samiti since 2004." },
  "/crowdfunding": { title: "How Crowdfunding Helps", description: "How medical crowdfunding works and how Sahara Jan Kalyan Samiti makes sure every gift reaches the patient." },
  "/media": { title: "Media & Gallery", description: "Photos and videos from the field work of Sahara Jan Kalyan Samiti." },
  "/news": { title: "News & Updates", description: "Press coverage and news about the work of Sahara Jan Kalyan Samiti." },
  "/events": { title: "Events Calendar", description: "Upcoming and past events and drives of Sahara Jan Kalyan Samiti." },
  "/blog": { title: "Blog", description: "Stories, voices and lessons from the communities Sahara Jan Kalyan Samiti works with." },
  "/transparency": { title: "Transparency & Reports", description: "Annual reports, the impact report, donor transparency and certificate requests from Sahara Jan Kalyan Samiti." },
  "/transparency/annual-reports": { title: "Annual Reports", description: "Annual reports of Sahara Jan Kalyan Samiti, by financial year." },
  "/transparency/impact-report": { title: "Impact Report", description: "The impact report of Sahara Jan Kalyan Samiti, 2004 to 2025." },
  "/transparency/donor-transparency": { title: "Donor Transparency", description: "For each programme: the donations received, how they were spent, who they reached and the proof." },
  "/memberships": { title: "Memberships", description: pageTextDefaults["memberships.hero.text"] },
  "/member-id": { title: "Member ID Card", description: "Apply for and download your Sahara Jan Kalyan Samiti member ID card." },
  "/donate": { title: "Donate", description: "Support healthcare, education, women's livelihoods and relief in Madhya Pradesh. Donations are eligible for 80G tax benefits." },
  "/get-involved": { title: "Get Involved", description: "Volunteer, partner or support Sahara Jan Kalyan Samiti as an individual, a student or a company." },
  "/contact": { title: "Contact Us", description: "Contact Sahara Jan Kalyan Samiti: office address, phone and e-mail in Sagar, Madhya Pradesh." },
  "/privacy": { title: legalDocs.privacy.title, description: "How Sahara Jan Kalyan Samiti collects, uses and protects the information you give us." },
  "/terms": { title: legalDocs.terms.title, description: "The terms for using the Sahara Jan Kalyan Samiti website." },
  "/dpdp": { title: legalDocs.dpdp.title, description: "Our notice under India's Digital Personal Data Protection Act: your rights and how to use them." }
} as const satisfies Record<string, PageSeo>;

export type PagePath = keyof typeof pageSeo;
