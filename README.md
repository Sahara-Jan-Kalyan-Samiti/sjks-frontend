# sjks-frontend

[![Build and deploy](https://github.com/scalric/sjks-frontend/actions/workflows/deploy.yml/badge.svg)](https://github.com/scalric/sjks-frontend/actions/workflows/deploy.yml)

The public website of **Sahara Jan Kalyan Samiti (SJKS)**, a registered non-profit in Sagar, Madhya Pradesh, working in healthcare, education, women's livelihoods, environment and relief since 2004.

The site is bilingual (English and Hindi) and lets visitors learn about the programmes, read reports, donate, volunteer, apply for a member ID card and follow the Samiti's work.

> This repository is one of four that make up the SJKS platform. See [How the platform fits together](#how-the-platform-fits-together).

---

## Contents

1. [Tech stack](#tech-stack)
2. [Features and pages](#features-and-pages)
3. [Getting started](#getting-started)
4. [Scripts](#scripts)
5. [Environment variables](#environment-variables)
6. [Project structure](#project-structure)
7. [How the platform fits together](#how-the-platform-fits-together)
8. [Working on the site](#working-on-the-site)
9. [Quality checks](#quality-checks)
10. [Deployment](#deployment)
11. [Branches and contributing](#branches-and-contributing)

---

## Tech stack

| Area | Technology |
|---|---|
| UI | React 18, TypeScript 5.5 |
| Build | Vite 5 |
| Styling | Tailwind CSS 3 (brand tokens in `tailwind.config.js`, shared classes in `src/styles/index.css`) |
| Routing | React Router 6, every page except Home is loaded on demand |
| Data | Supabase (Postgres, Storage) through `@supabase/supabase-js` |
| Languages | English and Hindi, switched on screen (`src/i18n`) |
| Quality | ESLint, Prettier, Vitest, GitHub Actions |
| Hosting | Google Cloud Storage behind Cloud CDN |

Requires **Node.js 20 or newer** (see `.nvmrc`).

## Features and pages

| Area | Routes |
|---|---|
| **Home** | Hero, live impact dashboard, programmes slider, active campaigns, impact calculator, stories, field map |
| **About** | `/about`, `/about/journey`, `/about/awards` |
| **Programmes** | `/projects`, `/projects/:slug`, `/crowdfunding` (how medical crowdfunding helps) |
| **Media** | `/media` (photo and video gallery), `/news`, `/news/:slug`, `/events`, `/blog`, `/blog/:slug` |
| **Transparency** | `/transparency`, `/transparency/annual-reports`, `/transparency/impact-report`, `/transparency/donor-transparency` |
| **Get involved** | `/donate`, `/get-involved`, `/contact`, `/memberships`, `/member-id` |
| **Legal** | `/privacy`, `/terms`, `/dpdp` |

Other behaviour worth knowing:

- **Donations** use the hosted Razorpay payment page. The website never handles card data; payments are recorded by `sjks-backend`.
- **Forms** (contact, volunteer, document request, newsletter) are saved through the backend or the database and fall back to e-mail if neither is reachable.
- **Editable text and media** (page texts, gallery, blog, awards, team, reports) come from Supabase and are managed in `sjks-admin`. Built-in defaults live in `src/data/content`.
- **Member ID card** is drawn in the browser and can be downloaded as a JPG or PDF.

## Getting started

```bash
git clone https://github.com/scalric/sjks-frontend.git
cd sjks-frontend
npm ci
cp .env.example .env     # then fill in the two Supabase values (see below)
npm run dev              # http://localhost:5173
```

The site starts without any environment file, but content that comes from Supabase (gallery, blog, awards, team, live numbers) will then show its built-in defaults only.

To work with the backend at the same time, start `sjks-backend` on port 8080. In development Vite forwards every `/api` request there, so `VITE_API_URL` can stay empty.

## Scripts

| Command | What it does |
|---|---|
| `npm run dev` | Development server with hot reload |
| `npm run build` | Type-check, then build to `dist/` |
| `npm run preview` | Serve the built site locally |
| `npm run typecheck` | TypeScript check only |
| `npm run lint` | ESLint |
| `npm test` | Unit tests (Vitest) |
| `npm run format` / `npm run format:check` | Apply or check Prettier formatting |
| `npm run export:admin -- <folder>` | Export page texts and the project portfolio for `sjks-admin` (see [Working on the site](#working-on-the-site)) |

## Environment variables

Copy `.env.example` to `.env`. **Every value here is public**: it is compiled into the browser bundle. Never put a secret or a Supabase `service_role` key in a `VITE_` variable.

| Variable | Required | Purpose |
|---|---|---|
| `VITE_SUPABASE_URL` | yes | Supabase project URL |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | yes | Supabase publishable (anon) key. Access is limited by Row Level Security in the database |
| `VITE_API_URL` | production | Address of `sjks-backend`, for example `https://api.saharangosag.com`. Leave empty in development |
| `VITE_ADMIN_URL` | no | Shows an "Admin" link in the footer |
| `VITE_WEB3FORMS_KEY`, `VITE_FORM_ENDPOINT` | no | Fallback form delivery by e-mail |
| `VITE_LIVE_DATA_URL` | no | Remote copy of `public/data/live.json` |
| `VITE_PLAUSIBLE_DOMAIN` | no | Privacy-friendly analytics |

The real `.env` is ignored by git. Only `.env.example` is committed.

## Project structure

```
index.html                  Page shell: title, fonts, SEO data
vite.config.ts              Vite settings, the "@" alias, dev proxy to the backend
tailwind.config.js          Brand colours, fonts, page width
eslint.config.js · .prettierrc · .editorconfig   Code quality rules
scripts/                    export-admin-data.ts
public/                     Static files served as they are
  images/                   Photos grouped by page (about, home, awards, partners, ...)
  assets/images/            Logo, gallery photos, news clippings, crowdfunding images
  documents/                Impact reports and annual report PDFs
  data/live.json            Fallback live numbers
src/
  main.tsx                  Entry point
  app/App.tsx               All routes (lazy-loaded)
  styles/index.css          Global styles, buttons, animations
  config/                   site.ts (organisation identity, legal IDs), navigation.ts (menu)
  pages/                    One folder per area, one file per route
    home/ about/ projects/ media/ news/ events/ blog/
    transparency/ membership/ support/ legal/ NotFound.tsx
  components/
    layout/                 Header, TopBar, Footer, PageHero, floating buttons
    ui/                     Small parts: Img, Reveal, CountUp, DonateButton, Wave, ...
    forms/                  SmartForm, DocumentRequestForm, OrganizationApplyForm
    home/                   Impact dashboard, campaigns, slider, testimonials, supporters
    sections/               FAQ, gallery, volunteer wall, issued cards, medical funding
    maps/                   India network map, work map
  data/content/             Built-in content: news, blog, awards, portfolio, legal, page texts
  data/geo/                 Map geometry (large; loaded only when a map is shown)
  hooks/                    useLiveData, usePageText, useBlog, useTitle, ...
  services/                 supabase.ts (database client), forms.ts (form delivery)
  utils/                    validate, date, justify, receipt, pdf, memberCard (+ tests)
  i18n/                     LangContext and the Hindi dictionaries
```

Imports use the `@/` alias for `src/`, for example `import Img from "@/components/ui/Img"`.

### Design tokens

| Token | Value |
|---|---|
| `brand` | `#1479d1` |
| `brand-dark` | `#0b4f9c` |
| `brand-light` | `#e6f3fd` |
| `sky` | `#38bdf8` |
| `ink` | `#0f2340` |

Fonts: Poppins (interface), Inter (hero), Noto Sans Devanagari (Hindi), Lora (quotes), Merriweather (large numbers). Page width: `.container-site` (max 1200 px).

## How the platform fits together

The platform is split into four repositories:

| Repository | Role |
|---|---|
| **sjks-frontend** (this one) | Public website |
| sjks-admin | Admin panel for staff |
| sjks-backend | Node API: payment webhook, receipts, e-mail, exports |
| sjks-database | Supabase migrations, access rules and storage buckets |

```
Visitor ──► sjks-frontend ──► Supabase   (public content and forms, read with the publishable key)
                 │
                 └──────────► sjks-backend ──► Supabase   (payments, receipts, e-mail; uses the secret key)

Razorpay ── webhook ──► sjks-backend
```

## Working on the site

**Change a page's text or a menu item.** Page structure is in `src/pages`. The menu is `src/config/navigation.ts`. Organisation details (phone, address, 80G and 12A numbers, social links) are in `src/config/site.ts`.

**Add a news story.** Open `src/data/content/news.ts`, copy an entry and edit it, then put the image in `public/assets/images/news/`. Newest first. Only publish things that really happened.

**Add a page.** Create the file in the matching `src/pages/<area>/` folder, add a lazy import and a route in `src/app/App.tsx`, and add it to `src/config/navigation.ts` if it needs a menu entry.

**Add Hindi text.** Wording written with `t("English text")` is looked up in `src/i18n/hi.ts`. Other on-screen text is translated from the dictionaries in `src/i18n`. A missing entry simply stays in English.

**Keep the admin panel in step.** The admin panel's "Website Pages" and "Projects" screens use data exported from this repository. After you change `src/data/content/pageContent.ts` or `portfolio.ts`, run:

```bash
npm run export:admin -- ../sjks-admin/src/data/generated
```

and commit the two JSON files in `sjks-admin`.

## Quality checks

```bash
npm run typecheck && npm run lint && npm test && npm run build
```

The same checks run on every pull request and every push (see `.github/workflows/deploy.yml`). Please make sure they pass before you open a pull request.

## Deployment

The site is built into static files and hosted on **Google Cloud Storage behind an HTTPS load balancer with Cloud CDN**.

1. Create a bucket per environment (staging and production). Turn on static website hosting with `index.html` as both the main page and the not-found page, so the single-page app can handle every route.
2. Put a load balancer with a managed SSL certificate in front, for example `www.saharangosag.com`, with Cloud CDN on.
3. In GitHub, go to Settings → Secrets and variables → Actions → Variables and add:

   | Variable | Value |
   |---|---|
   | `VITE_SUPABASE_URL`, `VITE_SUPABASE_PUBLISHABLE_KEY` | Public Supabase values for that environment |
   | `VITE_API_URL` | `https://api.saharangosag.com` |
   | `VITE_ADMIN_URL` | Optional admin address |
   | `GCP_BUCKET_STAGING`, `GCP_BUCKET_PROD` | Bucket names |
   | `GCP_URLMAP`, `GCP_PROJECT` | Load balancer and project |
   | `GCP_WIF_PROVIDER`, `GCP_SERVICE_ACCOUNT` | Workload Identity Federation (keyless login from GitHub) |

4. Push to `stage` to deploy staging, or to `main` to deploy production. `dev` only runs the checks.

The workflow caches hashed files in `assets/` for a year and never caches `index.html`.

Recommended response headers on the load balancer: `Strict-Transport-Security`, `X-Content-Type-Options: nosniff`, `Referrer-Policy`, and a Content-Security-Policy that allows the site itself, Google Fonts, `https://*.supabase.co` and the API address.

## Branches and contributing

| Branch | Purpose |
|---|---|
| `main` | Production. Deploys to the live website |
| `stage` | Staging. Deploys to the test site |
| `dev` | Integration. Runs the checks only |
| `<name>-dev` (for example `kaif-dev`) | Personal working branch |

Work on your own branch, open a pull request into `dev`, then promote `dev` → `stage` → `main` by pull request. Do not commit directly to `main` or `stage`. The pull request template lists what to check.

## License

Private repository. All rights reserved by Sahara Jan Kalyan Samiti.
