import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: { DEFAULT: "#1479d1", dark: "#0b4f9c", light: "#e6f3fd" },
        sky: { DEFAULT: "#38bdf8", soft: "#bae6fd" },
        accent: "#38bdf8",
        ink: "#0f2340"
      },
      // the CSS variables come from next/font in src/styles/fonts.ts
      fontFamily: {
        sans: ["var(--font-poppins)", "var(--font-devanagari)", "system-ui", "sans-serif"],
        hero: ["var(--font-poppins)", "var(--font-devanagari)", "system-ui", "sans-serif"],
        serif: ["var(--font-poppins)", "var(--font-devanagari)", "system-ui", "sans-serif"],
        quote: ["var(--font-poppins)", "var(--font-devanagari)", "system-ui", "sans-serif"],
        display: ["var(--font-poppins)", "var(--font-devanagari)", "system-ui", "sans-serif"]
      },
      maxWidth: { site: "1200px" },
      keyframes: { slideprogress: { from: { transform: "scaleX(0)" }, to: { transform: "scaleX(1)" } } }
    }
  },
  plugins: []
};

export default config;
