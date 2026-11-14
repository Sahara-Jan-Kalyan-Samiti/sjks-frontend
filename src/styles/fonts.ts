import { Noto_Sans_Devanagari, Poppins } from "next/font/google";

/**
 * The site fonts, downloaded at build time and served from our own address (no request to Google when a visitor opens a page).
 * Each exposes a CSS variable that tailwind.config.ts uses for font-sans, font-hero, font-quote and font-display.
 * Only Poppins is loaded for English: extra families (Inter, Lora, Merriweather) cost about 1 second of loading on a phone, so every
 * family name in tailwind.config.ts points at Poppins. Hindi text uses Noto Sans Devanagari, downloaded only when it is shown.
 */
export const poppins = Poppins({ subsets: ["latin"], weight: ["400", "500", "600", "700"], variable: "--font-poppins", display: "swap" });
export const devanagari = Noto_Sans_Devanagari({
  subsets: ["devanagari", "latin"],
  weight: ["400", "600", "700"],
  variable: "--font-devanagari",
  display: "swap",
  preload: false
});

/** Class names that put the font variables on <body>. */
export const fontVariables = [poppins, devanagari].map((f) => f.variable).join(" ");
