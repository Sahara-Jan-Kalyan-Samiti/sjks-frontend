"use client";

import { useEffect, useState } from "react";

/** True while the screen is narrower than `max` px (default 768, Tailwind's md). Updates when the window is resized or rotated.
 *  Starts as false (what the server renders) and is corrected right after the page is shown. */
export function useIsMobile(max = 768): boolean {
  const query = `(max-width: ${max - 1}px)`;
  const [mobile, setMobile] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia(query);
    const on = () => setMobile(mq.matches);
    on(); mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, [query]);
  return mobile;
}
