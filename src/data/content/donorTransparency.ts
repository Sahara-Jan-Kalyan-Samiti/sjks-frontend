/**
 * Donor Transparency page (Transparency & Reports -> Donor Transparency).
 * DEMO DATA: made up to show how the page will look. These are NOT real financial figures. Before the page goes live,
 * replace every figure below with verified numbers. Set `isDemo` to true to show the "demo page" notice again.
 * The totals are worked out from the lists, so only the lists need editing.
 */
export const isDemo = false;

export interface Programme {
  name: string; period: string; place: string; summary: string;
  /** money received for this programme, in rupees */
  received: number;
}
export interface Spend { label: string; detail: string; amount: number }
export interface Outcome { value: number; label: string; detail: string }
export interface Proof { title: string; kind: string; detail: string; /** a file in /public, when there is one; without it the item is listed as "available on request" */ file?: string }

export const programme: Programme = {
  name: "Poshan Ka Utsav (Nutrition Festival)",
  period: "12 - 14 March",
  place: "Sahara learning centres, Sagar district, Madhya Pradesh",
  summary: "A three-day nutrition festival for children of the Samiti's learning centres: a hot nutritious meal every day, a take-home nutrition kit, school materials, and a health and nutrition awareness session for mothers.",
  received: 50000
};

/** Where the money went. The "spent" total on the page is the sum of this list. */
export const spending: Spend[] = [
  { label: "Nutritious meals & snacks", detail: "Three days of hot meals, fruit and milk for 100 children", amount: 16000 },
  { label: "Take-home nutrition kits", detail: "Dry rations, jaggery, groundnuts and fortified flour, one kit per child", amount: 9000 },
  { label: "Educational materials", detail: "Notebooks, pencils, slates and school bags", amount: 6000 },
  { label: "Health check & awareness session", detail: "Height / weight check-up, anaemia screening and a session for mothers", amount: 2500 },
  { label: "Venue, transport & logistics", detail: "Tent and seating, carrying supplies to the centres", amount: 1500 }
];

/** What the money achieved. The first entry is the number of children (shown as "Beneficiaries"). */
export const outcomes: Outcome[] = [
  { value: 100, label: "Children", detail: "ate a nutritious meal on each of the three days" },
  { value: 100, label: "Nutrition kits", detail: "handed to children to take home" },
  { value: 100, label: "Study kits", detail: "of notebooks, pencils and a school bag" },
  { value: 85, label: "Families", detail: "reached through the kits and the mothers' session" }
];

export const proofs: Proof[] = [
  { title: "Expense report", kind: "PDF", detail: "Line-by-line statement of what was spent, signed by the treasurer." },
  { title: "Bill & receipt summary", kind: "PDF", detail: "Supplier bills for food, kits and materials, matched to the expense report." },
  { title: "Audit documentation", kind: "PDF", detail: "Extract from the audited accounts and the auditor's certificate for the year." }
];

export const activityDates: { date: string; title: string; detail: string }[] = [
  { date: "5 March", title: "Donations received", detail: "₹50,000 received from donors and recorded in the Samiti's account." },
  { date: "8 March", title: "Supplies purchased", detail: "Food, kits and school materials bought against bills." },
  { date: "12 - 14 March", title: "Festival held", detail: "Meals served and kits handed out at the learning centres." },
  { date: "20 March", title: "Accounts closed", detail: "Expenses reconciled with bills; balance carried to the next programme." }
];

/** Photos of the activity (files already on the website). */
export const photos: { file: string; alt: string }[] = [
  { file: "/assets/images/home/hero-slide-02.jpg", alt: "Children enjoying a hot meal served at a Sahara centre" },
  { file: "/assets/images/projects/projects-01.jpg", alt: "Children with slates and school bags at a village learning centre" },
  { file: "/assets/images/gallery/health-nutrition/child-nutrition-kit-handover.jpg", alt: "A nutrition kit handed to a mother at the education and nutrition programme" }
];

export const spent = spending.reduce((n, s) => n + s.amount, 0);
export const balance = programme.received - spent;
export const rupees = (n: number) => `₹${n.toLocaleString("en-IN")}`;

/** One programme as the page shows it. Comes from the admin panel (tables donor_programmes / donor_items). */
export interface DonorData {
  id: number | string; name: string; period: string; place: string; summary: string; received: number;
  spending: Spend[]; outcomes: Outcome[]; proofs: Proof[]; photos: { file: string; alt: string }[]; dates: { date: string; title: string; detail: string }[];
}
/** What the page shows while the database cannot be reached: the example above. */
export const fallbackProgrammes: DonorData[] = [{
  id: "example", ...programme, spending, outcomes, proofs, photos, dates: activityDates
}];
