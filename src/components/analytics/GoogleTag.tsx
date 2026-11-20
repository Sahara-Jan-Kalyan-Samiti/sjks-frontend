"use client";

import { useEffect, useState } from "react";
import Script from "next/script";
import { googleAdsId, googleTagId, liveHosts } from "@/config/analytics";

/** The Google tag, on every page of the published website only (decided in the browser from the address, so one build serves every environment). */
export default function GoogleTag() {
  const [live, setLive] = useState(false);
  useEffect(() => {
    setLive(liveHosts.includes(window.location.hostname));
  }, []);
  if (!live) return null;
  return (
    <>
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${googleTagId}`} strategy="afterInteractive" />
      <Script id="google-tag" strategy="afterInteractive">
        {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${googleTagId}');
gtag('config', '${googleAdsId}');`}
      </Script>
    </>
  );
}
