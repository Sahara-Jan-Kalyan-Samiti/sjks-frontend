"use client";

import { useLang } from "@/i18n/LangContext";

const OUTER = "M60 3 L113 21 V68 C113 108 91 133 60 147 C29 133 7 108 7 68 V21 Z";
const INNER = "M60 11 L105 26 V68 C105 102 86 124 60 136 C34 124 15 102 15 68 V26 Z";

/** The organisations that have verified the Samiti, as named on its registration seal. */
const partners = ["Google for Nonprofits", "Microsoft", "Goodstack", "Benevity", "TechSoup"];
const RING_TEXT = `${partners.map((p) => p.toUpperCase()).join(" ★ ")} ★ `;

/**
 * A round "verified" seal: a green shield with a tick in the middle, and the names of the organisations that verified the Samiti
 * written round the edge, turning slowly. A light sweeps across the shield now and then.
 */
export default function VerifiedShield({ className = "" }: { className?: string }) {
  const { t } = useLang();
  return (
    <div
      role="img"
      aria-label={`${t("Verified Nonprofit")}: ${partners.join(", ")}`}
      className={`relative aspect-square w-[5.75rem] drop-shadow-[0_10px_14px_rgba(3,20,48,.5)] md:w-36 md:drop-shadow-[0_14px_20px_rgba(3,20,48,.5)] lg:w-40 ${className}`}
    >
      <svg
        viewBox="0 0 200 200"
        aria-hidden="true"
        className="absolute inset-0 h-full w-full animate-spin [animation-duration:26s] motion-reduce:animate-none"
      >
        <defs>
          <path id="vs-ring" d="M100,100 m-79,0 a79,79 0 1,1 158,0 a79,79 0 1,1 -158,0" />
        </defs>
        <circle cx="100" cy="100" r="98" fill="#fff" />
        <circle cx="100" cy="100" r="93" fill="#0d3b86" />
        <circle cx="100" cy="100" r="93" fill="none" stroke="#f5b800" strokeWidth="1.5" />
        <circle cx="100" cy="100" r="67" fill="none" stroke="#f5b800" strokeWidth="1.5" />
        <text fill="#fff" fontSize="10.5" fontWeight="700" fontFamily="Arial, Helvetica, sans-serif">
          <textPath href="#vs-ring" textLength="493" lengthAdjust="spacing">
            {RING_TEXT}
          </textPath>
        </text>
      </svg>

      <svg viewBox="0 0 200 200" aria-hidden="true" className="absolute inset-0 h-full w-full">
        <style>{`@keyframes vsShine{0%,55%{transform:translateX(-150px)}100%{transform:translateX(150px)}}@media (prefers-reduced-motion:no-preference){.vs-shine{animation:vsShine 4.2s ease-in-out infinite}}`}</style>
        <defs>
          <linearGradient id="vs-gold" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#fff1a8" />
            <stop offset=".5" stopColor="#f5b800" />
            <stop offset="1" stopColor="#b97d00" />
          </linearGradient>
          <linearGradient id="vs-green" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#4cc15a" />
            <stop offset="1" stopColor="#177a2c" />
          </linearGradient>
          <linearGradient id="vs-light" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#fff" stopOpacity="0" />
            <stop offset=".5" stopColor="#fff" stopOpacity=".6" />
            <stop offset="1" stopColor="#fff" stopOpacity="0" />
          </linearGradient>
          <clipPath id="vs-clip">
            <path d={INNER} />
          </clipPath>
        </defs>
        <circle cx="100" cy="100" r="64" fill="#f7faff" />
        <g transform="translate(100 100) scale(.78) translate(-60 -75)">
          <path d={OUTER} fill="url(#vs-gold)" />
          <path d={INNER} fill="url(#vs-green)" />
          <path d="M60 11 L15 26 V68 C15 102 34 124 60 136 Z" fill="#fff" opacity=".12" />
          <g clipPath="url(#vs-clip)">
            <g transform="skewX(-18)">
              <rect className="vs-shine" x="-10" y="0" width="34" height="150" fill="url(#vs-light)" />
            </g>
          </g>
          <path
            d="M36 76 L55 95 L86 58"
            fill="none"
            stroke="#0b5a1d"
            strokeOpacity=".35"
            strokeWidth="13"
            strokeLinecap="round"
            strokeLinejoin="round"
            transform="translate(0 2.5)"
          />
          <path d="M36 76 L55 95 L86 58" fill="none" stroke="#fff" strokeWidth="11" strokeLinecap="round" strokeLinejoin="round" />
        </g>
      </svg>
    </div>
  );
}
