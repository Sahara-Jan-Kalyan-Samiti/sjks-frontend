/** Google tag (gtag.js). It is loaded only on the published website addresses below, so visits to stage, preview or local copies never reach Google. */
export const googleTagId = "GTM-PQX6SJ3F";
export const liveHosts = ["saharangosag.com", "www.saharangosag.com"];

/** Google Ads account, configured next to the tag above so conversions are counted for it. */
export const googleAdsId = "AW-18564971645";

/** Google Ads "Purchase" conversion, reported once when a live donation is confirmed (send_to = account / conversion label). */
export const donationConversion = `${googleAdsId}/7XlXCPbG8rgdEP34u5RF`;
