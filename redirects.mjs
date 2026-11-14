/**
 * Permanent redirects of the website (used by next.config.mjs).
 *
 * 1. The bare domain goes to www, so visitors and Google only ever see one address (and the backend only has to trust www).
 * 2. Pages of the old WordPress site go to the page that replaced them, so old Google results and bookmarks keep working
 *    and the search ranking of those addresses carries over.
 */

export const siteHost = "www.saharangosag.com";
export const bareHost = "saharangosag.com";
/** Old address (without trailing slash) -> where that content lives now. */
export const legacyPages = {
  // about the organisation
  "/about-us": "/about",
  "/vision-mission": "/about",
  "/founder-chairman": "/about",
  "/our-team": "/about",
  "/governing-structure": "/about",
  "/organizational-structure": "/about",
  // transparency
  "/annual-reports": "/transparency/annual-reports",
  "/annual-reports-2": "/transparency/annual-reports",
  "/transparency-legal-information": "/transparency",
  // programmes, events, media
  "/projects-impact": "/projects",
  "/success-stories": "/projects",
  "/events-campaigns": "/events",
  "/gallery": "/media",
  "/publications": "/media",
  // donations (the old checkout pages no longer exist: donating happens on /donate)
  "/donation-checkout": "/donate",
  "/donation-confirmation": "/donate",
  "/donation-failed": "/donate",
  "/donor-dashboard": "/donate",
  "/payment": "/donate",
  "/order-received": "/donate",
  "/thank-you": "/donate",
  "/subscription": "/donate",
  // getting involved and membership
  "/faqs": "/get-involved",
  "/member-organization": "/memberships",
  "/member-id-card": "/member-id",
  // policies and legal
  "/human-resource-policy": "/policies",
  "/financial-accounting-policy": "/policies",
  "/policies-governance": "/policies",
  "/terms-conditions": "/terms",
  "/privacy-policy": "/privacy",
  // contact
  "/contact-us": "/contact",
  // WordPress leftovers with no equivalent
  "/login": "/",
  "/dashboard": "/",
  "/account": "/",
  "/edit": "/",
  "/dos": "/",
  "/rajiv": "/"
};

/** The list Next.js expects from `redirects()`. */
export function buildRedirects() {
  return [
    { source: "/:path*", has: [{ type: "host", value: bareHost }], destination: `https://${siteHost}/:path*`, permanent: true },
    ...Object.entries(legacyPages).map(([source, destination]) => ({ source, destination, permanent: true }))
  ];
}
