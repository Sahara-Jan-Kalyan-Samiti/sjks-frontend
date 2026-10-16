import type { Metadata } from "next";
import { pageSeo, type PagePath } from "@/config/seo";
import { site } from "@/config/site";
import { env } from "@/lib/env";

/** Picture used when a page has none of its own (link previews on WhatsApp, Facebook, LinkedIn ...). */
export const DEFAULT_SHARE_IMAGE = "/assets/images/logo.png";

interface MetadataInput {
  /** Page title without the organisation name; left out for the home page. */
  title?: string;
  description: string;
  /** Address of the page, e.g. "/about". Becomes the canonical link. */
  path: string;
  /** Path or full address of the share picture. */
  image?: string;
  type?: "website" | "article";
}

/** Everything a page tells search engines and link previews: title, description, canonical address, Open Graph and Twitter card. */
export function buildMetadata({ title, description, path, image = DEFAULT_SHARE_IMAGE, type = "website" }: MetadataInput): Metadata {
  const full = title ? `${title} | ${site.name}` : site.name;
  return {
    // the root layout adds " | Sahara Jan Kalyan Samiti" to a plain title through its title template
    title: title ?? { absolute: site.name },
    description,
    alternates: { canonical: path },
    openGraph: { type, url: path, siteName: site.name, locale: "en_IN", title: full, description, images: [{ url: image }] },
    twitter: { card: "summary_large_image", title: full, description, images: [image] }
  };
}

/** Metadata of a page listed in src/config/seo.ts. */
export function pageMetadata(path: PagePath): Metadata {
  return buildMetadata({ ...pageSeo[path], path });
}

/** The organisation as structured data (schema.org NGO): shown in Google's knowledge panel and rich results. */
export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "NGO",
    name: site.name,
    alternateName: "SJKS",
    url: env.siteUrl,
    logo: `${env.siteUrl}${DEFAULT_SHARE_IMAGE}`,
    telephone: site.phone.replace(/\s/g, ""),
    email: site.email,
    foundingDate: "2004-10-19",
    sameAs: Object.values(site.social).filter(Boolean),
    address: {
      "@type": "PostalAddress",
      streetAddress: "21/419, Behind TCPC, Khurai Road, Shastri Ward No. 20",
      addressLocality: "Sagar",
      addressRegion: "Madhya Pradesh",
      postalCode: "470002",
      addressCountry: "IN"
    }
  };
}
