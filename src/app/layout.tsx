import type { Metadata, Viewport } from "next";
import Script from "next/script";
import type { ReactNode } from "react";
import SiteShell from "@/components/layout/SiteShell";
import { site } from "@/config/site";
import { env } from "@/lib/env";
import { DEFAULT_SHARE_IMAGE, organizationJsonLd } from "@/lib/seo";
import AppProviders from "@/providers/AppProviders";
import { fontVariables } from "@/styles/fonts";
import "@/styles/index.css";

const description = "Community health, education, women empowerment, tree plantation and disaster relief in Sagar, Madhya Pradesh.";

export const metadata: Metadata = {
  metadataBase: new URL(env.siteUrl),
  title: { default: site.name, template: `%s | ${site.name}` },
  description,
  applicationName: site.name,
  icons: { icon: "/favicon.svg" },
  openGraph: {
    type: "website",
    siteName: site.name,
    locale: "en_IN",
    title: site.name,
    description,
    images: [{ url: DEFAULT_SHARE_IMAGE }]
  },
  twitter: { card: "summary_large_image", title: site.name, description, images: [DEFAULT_SHARE_IMAGE] },
  robots: { index: true, follow: true }
};

export const viewport: Viewport = { themeColor: "#1479d1" };

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    // the English / Hindi switch changes the lang attribute in the browser after the page has loaded
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* open the connections to the API and the database early, before the first request needs them */}
        {env.apiUrl && <link rel="preconnect" href={env.apiUrl} crossOrigin="anonymous" />}
        {env.supabaseUrl && <link rel="preconnect" href={env.supabaseUrl} crossOrigin="anonymous" />}
      </head>
      <body className={fontVariables}>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd()) }} />
        <AppProviders>
          <SiteShell>{children}</SiteShell>
        </AppProviders>
        {env.plausibleDomain && (
          <Script defer data-domain={env.plausibleDomain} src="https://plausible.io/js/script.js" strategy="afterInteractive" />
        )}
      </body>
    </html>
  );
}
