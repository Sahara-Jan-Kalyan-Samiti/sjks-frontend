export type PressTopic = "Health" | "Education & Youth" | "Women & Nutrition" | "Environment";

export interface PressClipping {
  paper: string;
  date: string;
  /** Under public/assets/images/. Leave out until the clipping is available: the paper is still credited in "Covered by". */
  image?: string;
  alt: string;
}

export interface PressReport {
  id: string;
  /** yyyy-mm-dd */
  date: string;
  kicker: string;
  topics: PressTopic[];
  title: string;
  /** Headline of the original report (Hindi or Marathi). */
  headlineLocal: string;
  summary: string;
  coveredBy: string;
  clippings: PressClipping[];
}

export const pressTopics: PressTopic[] = ["Health", "Education & Youth", "Women & Nutrition", "Environment"];

/** Press coverage, newest first. Add a report by copying one object; keep it factual, as the newspaper reported it. */
export const pressReports: PressReport[] = [
  {
    id: "cooper-hospital",
    date: "2026-08-14",
    kicker: "Healthcare · CSR Partnership",
    topics: ["Health"],
    title: "KONE India and Sahara modernise diagnostic facilities at Mumbai’s Cooper Hospital",
    headlineLocal: "कूपर रुग्णालयाच्या निदान सुविधांचे आधुनिकीकरण — कोने इंडिया आणि सहारा जन कल्याण समितीचा पुढाकार",
    summary:
      "Under a CSR initiative with KONE Elevator India, Sahara helped upgrade diagnostic services at the H.B.T. Medical College & Dr. R.N. Cooper Municipal General Hospital in Juhu, Mumbai, including a new ultrasound facility — helping more patients get faster, more accurate diagnosis. The report carries a separate box on Sahara’s community-health work.",
    coveredBy: "Dainik Lokanama (Marathi), Mumbai",
    clippings: [
      {
        paper: "Dainik Lokanama",
        date: "14 Aug 2026",
        image: "news/cooper-hospital-lokmat.jpeg",
        alt: "Dainik Lokanama clipping, 14 August 2026, on Cooper Hospital diagnostic upgrade"
      }
    ]
  },
  {
    id: "chess-day",
    date: "2026-07-22",
    kicker: "Education & Youth",
    topics: ["Education & Youth"],
    title: "Inter-college chess championship marks International Chess Day in Bina",
    headlineLocal: "अंतरराष्ट्रीय शतरंज दिवस पर शासकीय कन्या महाविद्यालय बीना में अंतरमहाविद्यालयीन शतरंज प्रतियोगिता आयोजित",
    summary:
      "With the I.I.M.U.N. Social Impact Initiative, Sahara organised an inter-college chess competition at Government Girls College, Bina, for students from colleges across Sagar district. Chief speaker Dr. Harishankar Sen called chess “a powerful tool for life management, strategic thinking and leadership”.",
    coveredBy: "Bhumika Bhaskar, Sagar · Dainik Parihar Garjana, Chhatarpur",
    clippings: [
      {
        paper: "Bhumika Bhaskar",
        date: "22 Jul 2026",
        image: "news/chess-day-bhumika-bhaskar.jpeg",
        alt: "Bhumika Bhaskar clipping on the chess competition"
      },
      { paper: "Parihar Garjana", date: "22 Jul 2026", alt: "Parihar Garjana clipping on the chess competition" }
    ]
  },
  {
    id: "mental-health",
    date: "2026-06-06",
    kicker: "Mental Health · Student Wellbeing",
    topics: ["Health", "Education & Youth"],
    title: "One-day mental health training for college students in Bina",
    headlineLocal: "शासकीय कन्या महाविद्यालय बीना में मानसिक स्वास्थ्य एवं छात्र कल्याण पर एक दिवसीय प्रशिक्षण कार्यक्रम आयोजित",
    summary:
      "In line with Supreme Court directions on student mental health, Government Girls College, Bina, held a training programme with Sahara on 3 June. Sahara’s psychologist Dr. Shailendra Yadav spoke on exam stress and seeking help; Dr. Harishankar Sen, the programme’s nodal officer, urged students to talk openly rather than hide problems.",
    coveredBy: "Bhumika Bhaskar, Sagar · Haribhumi, Bhopal–Sagar edition",
    clippings: [
      {
        paper: "Bhumika Bhaskar",
        date: "6 Jun 2026",
        image: "news/mental-health-training-bhumika-bhaskar.jpeg",
        alt: "Bhumika Bhaskar clipping on the mental health training"
      },
      {
        paper: "Haribhumi",
        date: "11 Jun 2026",
        image: "news/mental-health-training-haribhumi.jpeg",
        alt: "Haribhumi clipping on the mental health training"
      }
    ]
  },
  {
    id: "world-environment-day",
    date: "2026-06-06",
    kicker: "Environment",
    topics: ["Environment"],
    title: "Tree plantation and awareness drive on World Environment Day",
    headlineLocal: "विश्व पर्यावरण दिवस पर सहारा जन कल्याण समिति द्वारा किया गया वृक्षारोपण एवं पर्यावरण जागरूकता कार्यक्रम",
    summary:
      "Members and volunteers planted saplings at several locations in the city and spoke with residents about pollution and climate change. “Trees are not just nature’s beauty — they are the foundation of life,” said Dr. Harishankar Sen, as participants pledged to protect the saplings.",
    coveredBy: "Bhumika Bhaskar, Sagar",
    clippings: [
      {
        paper: "Bhumika Bhaskar",
        date: "6 Jun 2026",
        image: "news/environment-day-bhumika-bhaskar.jpeg",
        alt: "Bhumika Bhaskar clipping on the World Environment Day plantation"
      }
    ]
  },
  {
    id: "relief-nutrition",
    date: "2026-06-02",
    kicker: "Nutrition · Relief",
    topics: ["Women & Nutrition"],
    title: "Relief and nutrition support for families in Amavani and Ratona panchayats",
    headlineLocal: "सहारा जन कल्याण समिति एवं जीव दया फाउंडेशन द्वारा जरूरतमंद परिवारों को राहत सामग्री एवं पोषण सहायता का वितरण",
    summary:
      "With Jiv Daya Foundation, Sahara distributed clothing, footwear and ration kits to tribal and other needy families in Sagar district. The report also describes Sahara’s ongoing malnutrition and pre-school programme, which gives children daily nutrition and play-based early learning.",
    coveredBy: "Bhumika Bhaskar, Sagar",
    clippings: [
      {
        paper: "Bhumika Bhaskar",
        date: "2 Jun 2026",
        image: "news/relief-nutrition-bhumika-bhaskar.jpeg",
        alt: "Bhumika Bhaskar clipping on relief and nutrition distribution"
      }
    ]
  },
  {
    id: "rehli-ration",
    date: "2026-05-31",
    kicker: "Women · Tribal Communities",
    topics: ["Women & Nutrition"],
    title: "Ration, clothing and health supplies for tribal women in Rehli",
    headlineLocal: "सहारा जन कल्याण समिति ने आदिवासी महिलाओं को राशन और वस्त्र वितरण कर किया सम्मानित",
    summary:
      "Tribal women received ration kits, sarees and footwear, and medical supplies were provided to strengthen rural health services, with support from Jiv Daya Foundation. Mamta Khatik, Project Officer of the Women & Child Development Department, attended as chief guest. The story was carried by three newspapers the same day.",
    coveredBy: "Dainik Bhaskar · Deshbandhu · Patrika — Sagar editions",
    clippings: [
      { paper: "Dainik Bhaskar", date: "31 May 2026", alt: "Dainik Bhaskar clipping on ration distribution" },
      {
        paper: "Deshbandhu",
        date: "31 May 2026",
        image: "news/ration-clothes-deshbandhu.jpeg",
        alt: "Deshbandhu clipping on ration distribution"
      },
      {
        paper: "Patrika",
        date: "31 May 2026",
        image: "news/ration-clothes-patrika.jpeg",
        alt: "Patrika clipping on ration distribution"
      }
    ]
  }
];
