/** "2026-07-22" → "22 July 2026" (English, India locale). */
export const fmtDate = (d: string) =>
  new Date(d + "T00:00:00").toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });
