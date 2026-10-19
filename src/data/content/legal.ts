import { site } from "@/config/site";

/**
 * Original wording of the three legal pages (Privacy Policy, Terms of Use, DPDP Compliance Notice).
 * Every heading and paragraph can be changed in the admin panel (Website Pages); see src/data/pageContent.ts.
 * A paragraph that starts with "- " is shown as a bullet point.
 */
export type LegalKind = "privacy" | "terms" | "dpdp";
export interface LegalDoc {
  title: string;
  /** opening paragraph above the sections */ intro?: string;
  updated: string;
  sections: { h: string; p: string[] }[];
}

const contact = `${site.name}, ${site.address}. Email: ${site.email}. Phone: ${site.phone}.`;
const updated = "October 2026";

export const legalDocs: Record<LegalKind, LegalDoc> = {
  privacy: {
    title: "Privacy Policy",
    updated,
    intro: `${site.name} respects your privacy. This policy explains what personal information we collect through this website, why we collect it, how we protect it and the choices you have.`,
    sections: [
      {
        h: "Information we collect",
        p: [
          "Details you give us through our forms: name, email address, phone number, organisation, postal address (only for hard-copy requests) and the message you write.",
          "Donation details needed to issue receipts, such as name, email, phone and PAN (for 80G receipts). Card, UPI and bank details are handled by the payment gateway and are not stored by us.",
          "Basic technical data such as browser type, device, pages visited and approximate location, collected through standard server logs and analytics to help us keep the site working well."
        ]
      },
      {
        h: "How we use it",
        p: [
          "- To reply to your enquiry and process document requests.",
          "- To register volunteers, members and event attendees.",
          "- To issue donation receipts and meet tax and accounting requirements.",
          "- To send newsletters and updates you subscribed to.",
          "- To understand how the site is used so we can improve it.",
          "We do not sell or rent your personal information."
        ]
      },
      {
        h: "Cookies and analytics",
        p: [
          "The site uses a small number of cookies and local storage to remember your language choice and to keep forms and menus working. We may use privacy-friendly analytics to count visits. These tools do not identify you personally.",
          "You can block or delete cookies in your browser settings; some parts of the site may then work less smoothly."
        ]
      },
      {
        h: "Sharing",
        p: [
          "We share data only with service providers who help us run the website, send email or process payments, and with authorities when the law requires it.",
          "These providers may use your data only to perform their service for us, and not for their own purposes."
        ]
      },
      {
        h: "Retention and security",
        p: [
          "We keep your information only as long as needed for the purpose it was given, or as required by tax and accounting law. We use reasonable technical and organisational measures to protect it, including encrypted connections (HTTPS) and restricted access to our records.",
          "No method of transmission over the internet is completely secure, so we cannot guarantee absolute security."
        ]
      },
      {
        h: "Children",
        p: [
          "This website is not directed at children. If you are under 18, please use the site and its forms only with the involvement of a parent or guardian."
        ]
      },
      {
        h: "Your choices",
        p: [
          "You may ask us to access, correct or delete your information, or unsubscribe from the newsletter at any time using the link in any email we send. See the DPDP Compliance Notice for your rights under Indian law."
        ]
      },
      {
        h: "Changes to this policy",
        p: [
          "We may update this policy from time to time. The date at the bottom of this page shows when it was last changed. Please check it occasionally."
        ]
      },
      { h: "Contact", p: [contact] }
    ]
  },
  terms: {
    title: "Terms of Use",
    updated,
    intro: "By using this website you agree to these terms. If you do not agree, please do not use the site.",
    sections: [
      {
        h: "Use of the website",
        p: [
          `The content is provided for general information about the work of ${site.name}. You agree not to:`,
          "- misuse the site or try to gain unauthorised access to it,",
          "- submit false, misleading or harmful information through its forms,",
          "- copy or scrape the site in a way that disrupts it or its users."
        ]
      },
      {
        h: "Content and copyright",
        p: [
          `Text, photographs and logos belong to ${site.name} or their respective owners. You may share them for non-commercial, awareness purposes with credit to us. Any other use needs our written permission.`,
          "Photographs of beneficiaries are published with consent and must not be used in a way that harms their dignity."
        ]
      },
      {
        h: "Donations",
        p: [
          "Donations are voluntary. Receipts and tax certificates are issued as per applicable law. Refund requests must be sent to us in writing.",
          "Funds are used for the programmes of the organisation. Where a donor names a particular programme, we use the gift for it as far as practicable."
        ]
      },
      {
        h: "Memberships and volunteering",
        p: [
          "Membership and volunteer applications are accepted at the discretion of the organisation. Members and volunteers are expected to act with respect towards the communities we serve."
        ]
      },
      { h: "External links", p: ["We are not responsible for the content or privacy practices of other websites we link to."] },
      {
        h: "Disclaimer and liability",
        p: [
          "We try to keep information accurate and current but give no warranty that the site is error-free or always available.",
          "To the extent allowed by law, we are not liable for any loss arising from the use of this website."
        ]
      },
      {
        h: "Governing law",
        p: [
          "These terms are governed by the laws of India. Any dispute is subject to the jurisdiction of the courts at the location of our registered office."
        ]
      },
      { h: "Contact", p: [contact] }
    ]
  },
  dpdp: {
    title: "DPDP Compliance Notice",
    updated,
    intro: `This notice explains how ${site.name} handles your personal data under India's Digital Personal Data Protection Act, 2023 (DPDP Act).`,
    sections: [
      {
        h: "Consent and purpose",
        p: [
          "We process your personal data only with your consent, given when you submit a form, and only for the purpose stated on that form. You may withdraw consent at any time by writing to us."
        ]
      },
      {
        h: "Data we process",
        p: [
          "- Identity and contact details (name, email, phone, address).",
          "- Donation and tax details (such as PAN for 80G receipts).",
          "- Messages and requests you send us."
        ]
      },
      {
        h: "Your rights as a Data Principal",
        p: [
          "You have the right to:",
          "- access a summary of the personal data we hold about you,",
          "- ask for correction, completion or erasure of your data,",
          "- withdraw your consent at any time,",
          "- nominate another person to exercise your rights if you are unable to,",
          "- have your grievances addressed."
        ]
      },
      {
        h: "Our obligations",
        p: [
          "We use your data only for the purpose you agreed to, keep it accurate, protect it with reasonable security safeguards, and delete it when the purpose is served unless the law requires us to keep it.",
          "If a personal data breach occurs, we will inform the Data Protection Board and affected persons as the law requires."
        ]
      },
      {
        h: "Children's data",
        p: ["We do not knowingly collect personal data of children without verifiable consent of a parent or guardian."]
      },
      {
        h: "Grievance officer",
        p: [
          `Send requests or complaints to ${site.email} with the subject "Data Privacy". We will respond within a reasonable time. If you remain unsatisfied you may approach the Data Protection Board of India.`
        ]
      },
      { h: "Contact", p: [contact] }
    ]
  }
};
