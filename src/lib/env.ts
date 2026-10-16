/**
 * Public settings, read once and typed. Every value here is compiled into the browser bundle, so it must never hold a secret.
 * Next.js only inlines `process.env.NEXT_PUBLIC_*` when the name is written out in full, so each one is spelled out below.
 */
export const env = {
  /** Supabase project URL and publishable (anon) key. Row Level Security in the database protects the data. */
  supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL ?? "",
  supabaseKey: process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? "",
  /** sjks-backend address, without a trailing slash. Empty in development: Next.js then forwards /api to the local backend. */
  apiUrl: (process.env.NEXT_PUBLIC_API_URL ?? "").replace(/\/$/, ""),
  /** Where this website is published. Used for canonical links, the sitemap and share previews. */
  siteUrl: (process.env.NEXT_PUBLIC_SITE_URL || "https://www.saharangosag.com").replace(/\/$/, ""),
  /** Optional footer link to the admin panel. */
  adminUrl: process.env.NEXT_PUBLIC_ADMIN_URL ?? "",
  /** Fallback form delivery by e-mail (used only if the database and backend cannot be reached). */
  web3formsKey: process.env.NEXT_PUBLIC_WEB3FORMS_KEY ?? "",
  formEndpoint: process.env.NEXT_PUBLIC_FORM_ENDPOINT ?? "",
  /** Remote copy of public/data/live.json. */
  liveDataUrl: process.env.NEXT_PUBLIC_LIVE_DATA_URL || "/data/live.json",
  /** Privacy-friendly analytics (Plausible), for example "saharangosag.com". */
  plausibleDomain: process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN ?? "",
  /** True when running `next dev`. */
  isDev: process.env.NODE_ENV !== "production"
} as const;
