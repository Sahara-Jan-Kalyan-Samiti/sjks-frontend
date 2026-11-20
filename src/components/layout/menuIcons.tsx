import type { ReactElement } from "react";

const icons: { test: RegExp; paths: ReactElement }[] = [
  {
    test: /founder|chairman/i,
    paths: (
      <>
        <circle cx="12" cy="8" r="3.5" />
        <path d="M5 20c0-3.5 3-6 7-6s7 2.5 7 6" />
      </>
    )
  },
  {
    test: /journey/i,
    paths: (
      <>
        <path d="M5 21V4" />
        <path d="M5 4h11l-2 4 2 4H5" />
      </>
    )
  },
  {
    test: /mission|vision/i,
    paths: (
      <>
        <path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12z" />
        <circle cx="12" cy="12" r="3" />
      </>
    )
  },
  {
    test: /committee|team|volunteer|memberships$/i,
    paths: (
      <>
        <circle cx="9" cy="8" r="3" />
        <path d="M3 19c0-3 2.7-5 6-5s6 2 6 5" />
        <path d="M16 5.2a3 3 0 010 5.6M17.5 14.3c2 .6 3.5 2.3 3.5 4.7" />
      </>
    )
  },
  {
    test: /where we work/i,
    paths: (
      <>
        <path d="M12 21s-7-6.2-7-11a7 7 0 0114 0c0 4.8-7 11-7 11z" />
        <circle cx="12" cy="10" r="2.5" />
      </>
    )
  },
  {
    test: /partner|supporter/i,
    paths: (
      <>
        <path d="M10 13a5 5 0 007.07 0l2.12-2.12a5 5 0 00-7.07-7.07L11 5" />
        <path d="M14 11a5 5 0 00-7.07 0L4.81 13.12a5 5 0 007.07 7.07L13 19" />
      </>
    )
  },
  {
    test: /award|recognition/i,
    paths: (
      <>
        <circle cx="12" cy="9" r="5" />
        <path d="M8.5 13.5L7 21l5-3 5 3-1.5-7.5" />
      </>
    )
  },
  {
    test: /legal|registration|certificate/i,
    paths: (
      <>
        <path d="M7 3h8l4 4v14H7z" />
        <path d="M14 3v5h5M10 14l2 2 3-3" />
      </>
    )
  },
  {
    test: /governance|polic|donor transparency|transparency$/i,
    paths: (
      <>
        <path d="M12 3L5 6v5c0 4.5 3 8 7 10 4-2 7-5 7-10V6l-7-3z" />
        <path d="M9 12l2 2 4-4" />
      </>
    )
  },
  {
    test: /women/i,
    paths: (
      <>
        <circle cx="12" cy="7" r="3" />
        <path d="M12 10v6M8.5 13h7M9 21l3-5 3 5" />
      </>
    )
  },
  {
    test: /upcoming|event|calendar/i,
    paths: (
      <>
        <rect x="3.5" y="5" width="17" height="15" rx="2" />
        <path d="M3.5 10h17M8 3v4M16 3v4" />
      </>
    )
  },
  {
    test: /medical|health/i,
    paths: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 8v8M8 12h8" />
      </>
    )
  },
  { test: /fundrais|crowdfunding|donat/i, paths: <path d="M12 20s-7-4.4-7-9.6A4 4 0 0112 8a4 4 0 017 2.4C19 15.6 12 20 12 20z" /> },
  {
    test: /educat/i,
    paths: (
      <>
        <path d="M2.5 9.5L12 5l9.5 4.5L12 14 2.5 9.5z" />
        <path d="M6.5 11.5V16c1.5 1.4 3.4 2 5.5 2s4-.6 5.5-2v-4.5" />
      </>
    )
  },
  {
    test: /environment|plantation/i,
    paths: (
      <>
        <path d="M12 21v-7" />
        <path d="M12 14c-4 0-6-3-6-6 4 0 6 2 6 6zM12 12c0-4 2-7 6-7 0 4-2 7-6 7z" />
      </>
    )
  },
  {
    test: /social welfare|relief/i,
    paths: (
      <>
        <path d="M4 21V10l8-5 8 5v11" />
        <path d="M9 21v-5h6v5" />
      </>
    )
  },
  {
    test: /solar/i,
    paths: (
      <>
        <circle cx="12" cy="12" r="4" />
        <path d="M12 3v2M12 19v2M3 12h2M19 12h2M5.6 5.6l1.4 1.4M17 17l1.4 1.4M18.4 5.6L17 7M7 17l-1.4 1.4" />
      </>
    )
  },
  {
    test: /portfolio/i,
    paths: (
      <>
        <rect x="4" y="4" width="7" height="7" rx="1" />
        <rect x="13" y="4" width="7" height="7" rx="1" />
        <rect x="4" y="13" width="7" height="7" rx="1" />
        <rect x="13" y="13" width="7" height="7" rx="1" />
      </>
    )
  },
  {
    test: /photo|gallery/i,
    paths: (
      <>
        <rect x="3" y="5" width="18" height="14" rx="2" />
        <circle cx="9" cy="10" r="1.6" />
        <path d="M21 16l-5-5-8 8" />
      </>
    )
  },
  {
    test: /video|film/i,
    paths: (
      <>
        <rect x="3" y="5" width="18" height="14" rx="3" />
        <path d="M10 9l5 3-5 3z" />
      </>
    )
  },
  {
    test: /news|press|story|stories|blog/i,
    paths: (
      <>
        <path d="M5 5h11v14H7a2 2 0 01-2-2V5z" />
        <path d="M16 9h3v8a2 2 0 01-2 2M8 9h5M8 13h5" />
      </>
    )
  },
  {
    test: /report|publication|newsletter/i,
    paths: (
      <>
        <path d="M7 3h8l4 4v14H7z" />
        <path d="M14 3v5h5M10 13h6M10 17h6" />
      </>
    )
  },
  {
    test: /member id|id card/i,
    paths: (
      <>
        <rect x="3" y="5" width="18" height="14" rx="2" />
        <circle cx="9" cy="11" r="2" />
        <path d="M6.5 16c.5-1.6 1.6-2.4 2.5-2.4s2 .8 2.5 2.4M14 10h4M14 14h4" />
      </>
    )
  }
];

/** A line icon for a menu entry, picked from its wording; a small arrow when nothing fits. */
export default function MenuIcon({ label }: { label: string }) {
  const found = icons.find((i) => i.test.test(label));
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-[18px] w-[18px]"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {found ? found.paths : <path d="M9 6l6 6-6 6" />}
    </svg>
  );
}
