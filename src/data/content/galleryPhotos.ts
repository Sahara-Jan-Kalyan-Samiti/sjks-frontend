import type { Photo } from "@/components/sections/Gallery";

/**
 * The photos of the Media & Gallery page: a balanced set, four to six per group (Solar Lantern has four), 45 in all, listed group by group.
 * The live list is managed in the admin panel (table gallery_photos) and mirrors this one, see
 * sjks-database/supabase/migrations/20250210000000_gallery_balanced_set.sql; this list is what shows when the database cannot be reached.
 * Add a photo only if it adds something: every photo here is downloaded when a visitor opens the page.
 */
export const galleryPhotos: Photo[] = [
  // Education
  {
    file: "gallery/education/preschool-circle-activity.jpg",
    alt: "Pre-school children in yellow uniforms taking part in a circle activity",
    cat: "Education"
  },
  {
    file: "gallery/education/preschool-yellow-uniform-children.jpg",
    alt: "Pre-school children in yellow uniforms outside their centre",
    cat: "Education"
  },
  {
    file: "gallery/education/school-bags-children-teacher.jpg",
    alt: "Children with their new school bags, with their teacher",
    cat: "Education"
  },
  {
    file: "gallery/education/children-studying-with-slates.jpg",
    alt: "Children studying with slates while others wait in line with school bags",
    cat: "Education"
  },
  {
    file: "gallery/education/children-learning-kits.jpg",
    alt: "Children seated with school bags and learning material at a village centre",
    cat: "Education"
  },
  {
    file: "gallery/education/classroom-students-uniform.jpg",
    alt: "Students in school uniform attending a classroom session",
    cat: "Education"
  },
  // Health
  {
    file: "gallery/health-nutrition/mothers-children-nutrition-session.jpg",
    alt: "Mothers and children gathered at a nutrition centre session",
    cat: "Health"
  },
  {
    file: "gallery/health-nutrition/nutrition-kit-received-by-child.jpg",
    alt: "A child receiving a nutrition kit at the pre-school and nutrition programme",
    cat: "Health"
  },
  { file: "gallery/health-nutrition/health-checkup-bp.jpg", alt: "Blood-pressure check at a community health camp", cat: "Health" },
  {
    file: "gallery/health-nutrition/child-nutrition-kit-handover.jpg",
    alt: "A nutrition kit handed to a mother at the pre-school education and child-nutrition programme",
    cat: "Health"
  },
  {
    file: "gallery/health-nutrition/mother-infant-nutrition-centre.jpg",
    alt: "A mother with her infant at a community nutrition centre",
    cat: "Health"
  },
  {
    file: "gallery/health-nutrition/menstrual-hygiene-inauguration.jpg",
    alt: "A student addressing the inauguration of the menstrual-hygiene programme with KONE",
    cat: "Health"
  },
  // Social Relief
  {
    file: "gallery/social-relief/clothing-kits-children-courtyard.jpg",
    alt: "Children holding their new clothing kits in a village courtyard",
    cat: "Social Relief"
  },
  {
    file: "gallery/social-relief/clothing-kits-children-settlement.jpg",
    alt: "Children with clothing kits outside their homes in a settlement",
    cat: "Social Relief"
  },
  {
    file: "gallery/social-relief/clothing-kit-handover.jpg",
    alt: "A Sahara team member handing a clothing kit to a child",
    cat: "Social Relief"
  },
  {
    file: "gallery/social-relief/ration-kits-distribution.jpg",
    alt: "Ration kits laid out for distribution to families, with children seated in front",
    cat: "Social Relief"
  },
  {
    file: "gallery/social-relief/ration-clothes-tribal-women.jpg",
    alt: "Ration and clothes distribution for tribal women",
    cat: "Social Relief"
  },
  { file: "field-1.jpg", alt: "Winter blanket and cloth drive", cat: "Social Relief" },
  // Environment
  {
    file: "gallery/environment/plantation-planting-sapling.jpg",
    alt: "Volunteers planting a sapling together during a tree-plantation drive",
    cat: "Environment"
  },
  {
    file: "gallery/environment/plantation-volunteers-planting.jpg",
    alt: "Employee volunteers planting a tree under their volunteering-programme banner",
    cat: "Environment"
  },
  {
    file: "gallery/environment/plantation-open-land.jpg",
    alt: "A volunteer planting saplings on open land during the plantation drive",
    cat: "Environment"
  },
  {
    file: "gallery/environment/plantation-volunteers-at-pit.jpg",
    alt: "Volunteers gathered around a freshly dug pit at the plantation site",
    cat: "Environment"
  },
  {
    file: "gallery/environment/plantation-volunteers-with-saplings.jpg",
    alt: "Volunteers holding saplings, ready to plant",
    cat: "Environment"
  },
  {
    file: "gallery/environment/plantation-seoni-volunteers.jpg",
    alt: "Volunteers with their programme banner at a plantation site in Seoni",
    cat: "Environment"
  },
  // Skill Development
  {
    file: "gallery/skill-development/kaushal-workshop-group.jpg",
    alt: "Project Kaushal: students and trainers after a job-readiness workshop",
    cat: "Skill Development"
  },
  {
    file: "gallery/skill-development/kaushal-batch-courtyard.jpg",
    alt: "Project Kaushal: batch photo with trainers on a college campus",
    cat: "Skill Development"
  },
  {
    file: "gallery/skill-development/kaushal-circle-activity.jpg",
    alt: "Project Kaushal: students taking part in a circle activity",
    cat: "Skill Development"
  },
  {
    file: "gallery/skill-development/kaushal-trainer-speaking.jpg",
    alt: "Project Kaushal: a trainer addressing students",
    cat: "Skill Development"
  },
  {
    file: "gallery/skill-development/kaushal-student-presentation.jpg",
    alt: "Project Kaushal: students presenting during a session",
    cat: "Skill Development"
  },
  {
    file: "gallery/skill-development/kaushal-team-after-session.jpg",
    alt: "Project Kaushal: trainers and volunteers together after a session",
    cat: "Skill Development"
  },
  // Solar Lantern
  {
    file: "solar-lantern-forest-edge.jpg",
    alt: "Solar lantern and charging panel handed to a family at the forest edge, Sagar district",
    cat: "Solar Lantern"
  },
  {
    file: "solar-lantern-rahli.jpg",
    alt: "Solar lantern distribution in a Rahli-block settlement with no electricity connection",
    cat: "Solar Lantern"
  },
  { file: "solar-lantern-hamlet.jpg", alt: "A woman receives a solar lantern in a low-lying, flood-prone hamlet", cat: "Solar Lantern" },
  {
    file: "solar-lantern-mother-child.jpg",
    alt: "A mother holding her young child receives her family's solar lantern",
    cat: "Solar Lantern"
  },
  // CSR & Volunteering
  {
    file: "gallery/csr-volunteering/employee-volunteers-sahara-banner.jpg",
    alt: "Employee volunteers with the Sahara team and banner before a community volunteering drive",
    cat: "CSR & Volunteering"
  },
  {
    file: "gallery/csr-volunteering/sap-volunteers-group.jpg",
    alt: "SAP Labs volunteer team at a community volunteering session",
    cat: "CSR & Volunteering"
  },
  {
    file: "gallery/csr-volunteering/sap-volunteer-with-students.jpg",
    alt: "A SAP Labs volunteer with school children holding craft items",
    cat: "CSR & Volunteering"
  },
  {
    file: "gallery/csr-volunteering/sap-volunteering-activity.jpg",
    alt: "SAP Labs volunteers on a hands-on activity with children",
    cat: "CSR & Volunteering"
  },
  {
    file: "gallery/csr-volunteering/sap-volunteers-workshop.jpg",
    alt: "SAP Labs volunteers running a hands-on workshop",
    cat: "CSR & Volunteering"
  },
  {
    file: "/assets/images/about/about-01.jpg",
    alt: "Partner and Sahara team with wheelchairs and equipment ready for donation",
    cat: "CSR & Volunteering"
  },
  // Women Empowerment
  { file: "field-3.jpg", alt: "Tailoring centre", cat: "Women Empowerment" },
  { file: "/assets/images/donation/donate-v3.jpg", alt: "Women of a village self-help group standing together", cat: "Women Empowerment" },
  {
    file: "/assets/images/contact/contact-01.jpg",
    alt: "Women and children learning together at a community centre",
    cat: "Women Empowerment"
  },
  {
    file: "/assets/images/home/hero-slide-03.jpg",
    alt: "Women of the community who run self-help and skill groups",
    cat: "Women Empowerment"
  },
  {
    file: "gallery/health-nutrition/women-session-centre.jpg",
    alt: "Women attending a health and nutrition awareness session at a Sahara centre",
    cat: "Women Empowerment"
  }
];
