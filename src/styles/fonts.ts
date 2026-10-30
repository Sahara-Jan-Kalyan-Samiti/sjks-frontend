import { Inter, Lora, Merriweather, Noto_Sans_Devanagari, Poppins } from "next/font/google";

/**
 * The site fonts, downloaded at build time and served from our own address (no request to Google when a visitor opens a page).
 * Each exposes a CSS variable that tailwind.config.js uses for font-sans, font-hero, font-quote and font-display.
 */
export const poppins = Poppins({ subsets: ["latin"], weight: ["400", "500", "600", "700"], variable: "--font-poppins", display: "swap" });
export const inter = Inter({ subsets: ["latin"], weight: ["400", "500", "600", "800"], variable: "--font-inter", display: "swap" });
export const devanagari = Noto_Sans_Devanagari({
  subsets: ["devanagari", "latin"],
  weight: ["400", "600", "700"],
  variable: "--font-devanagari",
  display: "swap",
  preload: false
});
export const lora = Lora({
  subsets: ["latin"],
  weight: ["400", "500"],
  style: ["italic"],
  variable: "--font-lora",
  display: "swap",
  preload: false
});
export const merriweather = Merriweather({
  subsets: ["latin"],
  weight: ["700"],
  variable: "--font-merriweather",
  display: "swap",
  preload: false
});

/** Class names that put all five font variables on <body>. */
export const fontVariables = [poppins, inter, devanagari, lora, merriweather].map((f) => f.variable).join(" ");
