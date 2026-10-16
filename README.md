# sjks-frontend

Public website of **Sahara Jan Kalyan Samiti** (Sagar, Madhya Pradesh), bilingual (English / Hindi).

Part of the SJKS platform, which is split into four repositories:

| Repository | What it is |
|---|---|
| **sjks-frontend** (this one) | Public website, React |
| sjks-admin | Admin panel, React |
| sjks-backend | Node API (payments webhook, receipts, email, exports) |
| sjks-database | Supabase migrations, policies, storage buckets |


## Tech stack

React 18 · TypeScript 5.5 · Vite 5.4 · Tailwind CSS 3.4 · React Router 6.26 · Supabase JS client

## Getting started

```bash
npm ci
cp .env.example .env      # fill VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY
npm run dev               # http://localhost:5173
```

| Script | Purpose |
|---|---|
| `npm run dev` | Dev server with hot reload (`/api` is proxied to `http://localhost:8080`) |
| `npm run typecheck` | TypeScript check |
| `npm run lint` | ESLint |
| `npm test` | Unit tests (Vitest) |
| `npm run build` | Type-check and build to `dist/` |
| `npm run preview` | Serve the built site locally |

## Environment variables

All are **public** (they end up in the browser). Never put a secret or a Supabase service-role key here. See `.env.example`.

| Variable | Purpose |
|---|---|
| `VITE_SUPABASE_URL`, `VITE_SUPABASE_PUBLISHABLE_KEY` | Supabase connection (Row Level Security protects the data) |
| `VITE_API_URL` | Backend base URL, e.g. `https://api.saharangosag.com` (empty in dev) |
| `VITE_ADMIN_URL` | Optional footer link to the admin panel |
| `VITE_WEB3FORMS_KEY`, `VITE_FORM_ENDPOINT` | Optional form fallbacks |
| `VITE_LIVE_DATA_URL` | Optional remote `live.json` |
| `VITE_PLAUSIBLE_DOMAIN` | Optional analytics |

## Folder structure

```
index.html                  HTML entry: meta tags, Google Fonts, JSON-LD
vite.config.ts              Vite, "@" alias, dev proxy to the backend
tailwind.config.js          Brand colours, fonts, max width
eslint.config.js · .prettierrc · .editorconfig
public/                     Images, PDFs (annual and impact reports), data/live.json
src/
  main.tsx                  Entry: router, language provider, analytics
  app/App.tsx               Route table (pages are lazy-loaded)
  styles/index.css          Global styles, buttons, animations
  config/                   site.ts (organisation identity, legal IDs, links), navigation.ts
  pages/                    One folder per area, one file per route
    home/ about/ projects/ media/ news/ events/ blog/
    transparency/ membership/ support/ (Donate, GetInvolved, Contact) legal/
  components/
    layout/                 Layout, Header, TopBar, Footer, PageHero, FloatingActions, ...
    ui/                     Img, Reveal, CountUp, DonateButton, Wave, SocialIcons, ...
    forms/                  SmartForm, DocumentRequestForm, OrganizationApplyForm
    home/                   ImpactShowcase, CampaignProgress, ProjectSlider, Testimonials, ...
    sections/               InfoBlocks (FAQ), Gallery, VolunteerWall, IssuedCards, MedicalFunding
    maps/                   IndiaNetworkMap, WorkMap
  data/content/             Static content: news, blog, awards, portfolio, projectFocus, legal, ...
  data/geo/                 Map geometry (large; loaded only when a map is shown)
  hooks/                    useLiveData, usePageText, useBlog, useInView, ...
  services/                 supabase.ts (client), forms.ts (form delivery)
  utils/                    validate, date, justify, receipt, pdf, memberCard (+ *.test.ts)
  i18n/                     LangContext, domTranslate, Hindi dictionaries
.github/workflows/          CI and deploy to Google Cloud
```

Imports use the `@/` alias for `src/` (for example `import Img from "@/components/ui/Img"`).

### Design tokens

`brand #1479d1` · `brand-dark #0b4f9c` · `brand-light #e6f3fd` · `sky #38bdf8` · `ink #0f2340`.
Fonts: Poppins (UI), Inter (hero), Noto Sans Devanagari (Hindi), Lora (quotes), Merriweather (numbers).
Container: `.container-site` (max 1200 px).

## Adding a news story

Open `src/data/news.ts`, copy one object, edit it, and put the image in `public/assets/images/news/`. Newest first. Only publish things that really happened.

## Deployment (Google Cloud)

The build is plain static files, so it is hosted on **Cloud Storage behind an HTTPS Load Balancer with Cloud CDN**.

1. Create a bucket per environment (staging, production) and enable static website hosting with `index.html` as both the main page and the not-found page (single-page-app fallback).
2. Put a load balancer + managed SSL certificate in front (`www.saharangosag.com`), with Cloud CDN enabled.
3. In GitHub -> Settings -> Variables, set `VITE_SUPABASE_URL`, `VITE_SUPABASE_PUBLISHABLE_KEY`, `VITE_API_URL`, `VITE_ADMIN_URL`, `GCP_BUCKET_STAGING`, `GCP_BUCKET_PROD`, `GCP_URLMAP`, `GCP_PROJECT`, `GCP_WIF_PROVIDER`, `GCP_SERVICE_ACCOUNT`.
4. Push to `stage` (staging) or `main` (production); `dev` only runs the checks. `.github/workflows/deploy.yml` builds, uploads, and clears the CDN cache.

Cache rules applied by the workflow: `index.html` is never cached; files in `assets/` are cached for a year (their names change on every build).

Recommended response headers (set on the load balancer / bucket): `Strict-Transport-Security`, `X-Content-Type-Options: nosniff`, `Referrer-Policy`, and a Content-Security-Policy that allows `self`, Google Fonts, `https://*.supabase.co` and the API origin.

## Branches

`main` = production · `stage` = staging · `dev` = integration (checks only) · each person works in their own branch (for example `kaif-dev`) and opens a pull request into `dev`.

## Related notes

- Donations use the hosted Razorpay payment page (`src/data/site.ts`, `razorpayMe`). The backend records payments from the Razorpay webhook; the website does not handle card data.
- Admin-edited text and media come from Supabase (`page_content`, `gallery_photos`, `blog_posts`, ...). Defaults live in `src/data/`.
