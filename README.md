# sjks--frontend

[![Build and deploy](https://github.com/scalric/sjks-frontend/actions/workflows/deploy.yml/badge.svg)](https://github.com/scalric/sjks-frontend/actions/workflows/deploy.yml)

The public website of **Sahara Jan Kalyan Samiti (SJKS)**, a registered non-profit in Sagar, Madhya Pradesh, working in healthcare, education, women's livelihoods, environment and relief since 2004.

The site is bilingual (English and Hindi) and lets visitors learn about the programmes, read reports, donate, volunteer, apply for a member ID card and follow the Samiti's work.

> This repository is one of four that make up the SJKS platform. See [How the platform fits together](#how-the-platform-fits-together).

--

## Content

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
| Framework | Next.js 14 (App Router, server rendering for search engines), React 18, TypeScript 5.5 |
| Styling | Tailwind CSS 3 (brand tokens in `tailwind.config.ts`, shared classes in `src/styles/index.css`) |
| Routing | Next.js file-based routes in `src/app`; each page has its own title, description, share preview, sitemap entry |
| Data | Supabase (Postgres, Storage) through `@supabase/supabase-js` |
| Languages | English and Hindi, switched on screen (`src/i18n`) |
| Quality | ESLint (with accessibility rules), Prettier, Vitest, GitHub Actions |
| Monitoring | Plausible analytics and Sentry error reporting, both optional |
| Hosting | Google Cloud Run (container built with Cloud Build) |

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
| **Legal** | `/privacy`, `/terms`, `/dpdp`, `/refund-policy` |

Other behaviour worth knowing:

- **Donations** use the hosted Razorpay payment page. The website never handles card data; payments are recorded by `sjks-backend`.
- **Forms** (contact, volunteer, document request, newsletter) are saved through the backend or the database and fall back to e-mail if neither is reachable.
- **Editable text and media** (page texts, gallery, blog, awards, team, reports) come from Supabase and are managed in `sjks-admin`. Built-in defaults live in `src/data/content`.
- **Member ID card** is drawn in the browser and can be downloaded as a JPG or PDF.

### Built-in quality features

- **Error and loading states:** `not-found.tsx` (404 with links to popular pages), `error.tsx` (a page failed, with a "Try again" button), `global-error.tsx` (the whole layout failed) and `loading.tsx` (skeleton placeholders).
- **Lazy loading:** photos use `loading="lazy"`. Heavy or below-the-fold sections (the India map, project slider, impact calculator, testimonials, volunteer wall, issued cards, work map) are loaded in their own files with `next/dynamic` and show a skeleton while they load. They are still rendered on the server, so search engines see them.
- **Responsive layout:** mobile-first Tailwind breakpoints (`sm`, `md`, `lg`) throughout.
- **Accessibility:** `eslint-plugin-jsx-a11y` runs with `npm run lint`; a skip-to-content link, visible keyboard focus, labelled dialogs that close with Escape, and decorative images with empty `alt`.
- **Health check:** `GET /api/health` returns `{"status":"ok"}` for uptime monitors.

## Getting started

```bash
git clone https://github.com/scalric/sjks-frontend.git
cd sjks-frontend
npm ci
cp .env.example .env.local   # then fill in the two Supabase values (see below)
npm run dev                  # http://localhost:3000
```

The site starts without any environment file, but content that comes from Supabase (gallery, blog, awards, team, live numbers) will then show its built-in defaults only.

To work with the backend at the same time, start `sjks-backend` on port 8080. In development Next.js forwards every `/api` request there, so `NEXT_PUBLIC_API_URL` can stay empty.

## Scripts

| Command | What it does |
|---|---|
| `npm run dev` | Development server with hot reload |
| `npm run build` | Production build into `.next/` |
| `npm start` | Serve the production build locally |
| `npm run typecheck` | TypeScript check only |
| `npm run lint` | ESLint |
| `npm test` | Unit tests (Vitest) |
| `npm run format` / `npm run format:check` | Apply or check Prettier formatting |
| `npm run export:admin -- <folder>` | Export page texts and the project portfolio for `sjks-admin` (see [Working on the site](#working-on-the-site)) |

## Environment variables

Copy `.env.example` to `.env.local`. **Every value here is public**: it is compiled into the browser bundle. Never put a secret or a Supabase `service_role` key in a `NEXT_PUBLIC_` variable.

| Variable | Required | Purpose |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | yes | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | yes | Supabase publishable (anon) key. Access is limited by Row Level Security in the database |
| `NEXT_PUBLIC_API_URL` | production | Address of `sjks-backend`, for example `https://api.saharangosag.com`. Leave empty in development |
| `NEXT_PUBLIC_SITE_URL` | production | Public address of the website, for canonical links, the sitemap and share previews |
| `NEXT_PUBLIC_ADMIN_URL` | no | Shows an "Admin" link in the footer |
| `NEXT_PUBLIC_WEB3FORMS_KEY`, `NEXT_PUBLIC_FORM_ENDPOINT` | no | Fallback form delivery by e-mail |
| `NEXT_PUBLIC_LIVE_DATA_URL` | no | Remote copy of `public/data/live.json` |
| `NEXT_PUBLIC_PLAUSIBLE_DOMAIN` | no | Privacy-friendly analytics |
| `NEXT_PUBLIC_SENTRY_DSN` | no | Sends browser errors to Sentry. Empty means off. The Sentry code is only downloaded when an error happens |

The real `.env.local` is ignored by git. Only `.env.example` is committed.

`NEXT_PUBLIC_` values are compiled in at build time. The Dockerfile and `cloudbuild.yaml` currently pass the Supabase, site, API and admin values; to use Plausible or Sentry on the deployed site, also add them as build arguments there.

## Project structure

```
next.config.mjs             Next.js settings: security headers, dev proxy to the backend, standalone output
tailwind.config.ts          Brand colours, fonts, page width
eslint.config.js · .prettierrc · .editorconfig   Code quality rules
Dockerfile · cloudbuild.yaml   Container image and Cloud Run deployment
scripts/                    export-admin-data.ts
public/                     Static files served as they are: assets/images, documents (annual reports), data/live.json
src/
  app/                      Routes. page.tsx files are thin: they set the SEO metadata and render a screen from features/
    layout.tsx              Root layout: fonts, site-wide metadata, structured data, header and footer
    not-found.tsx · error.tsx · global-error.tsx · loading.tsx   404, error and loading states
    api/health/route.ts     Health check for uptime monitors
    sitemap.ts · robots.ts  /sitemap.xml and /robots.txt
  features/                 The screens, one folder per area (home, about, projects, media, news, events,
                            blog, transparency, membership, support, legal) + NotFound.tsx.
                            Pieces used by only one area (for example the home sliders) live in its folder
  providers/                AppProviders (language, text justification)
  styles/                   index.css (global styles) and fonts.ts (self-hosted fonts)
  config/                   site.ts (organisation identity), navigation.ts (menu), seo.ts (title and description per page)
  components/               layout/ ui/ forms/ sections/ maps/ (shared pieces)
  data/content/             Built-in content: news, blog, awards, portfolio, legal, page texts
  data/geo/                 Map geometry (large; loaded only when a map is shown)
  hooks/                    useLiveData, usePageText, useBlog, useClientValue, ...
  services/                 supabase.ts (database client), blog.ts (server-side blog fetch), forms.ts
  lib/                      env.ts (typed public settings), seo.ts (metadata and structured data builders), monitoring.ts (Sentry)
  utils/                    validate, date, justify, receipt, pdf, memberCard (+ tests)
  i18n/                     LangContext and the Hindi dictionaries
```

Files that use hooks, click handlers or browser features start with `"use client"`. Everything else renders on the server, so search engines receive the full page.

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

**Change a page's text or a menu item.** Page screens are in `src/features`. Search and share text of each page is in `src/config/seo.ts`. The menu is `src/config/navigation.ts`. Organisation details (phone, address, 80G and 12A numbers, social links) are in `src/config/site.ts`.

**Add a news story.** Open `src/data/content/news.ts`, copy an entry and edit it, then put the image in `public/assets/images/news/`. Images all live under `public/assets/images/` with kebab-case file names. The old `/images/...` addresses still work through a rewrite in `next.config.mjs`, because some database rows store them. Newest first. Only publish things that really happened.

**Add a page.** Create the screen in `src/features/<area>/`, add `src/app/<route>/page.tsx` (copy a simple one such as `about/awards`), add its title and description to `src/config/seo.ts`, and add it to `src/config/navigation.ts` if it needs a menu entry.

**Add a heavy section.** Import it with `next/dynamic` and give it a `<Skeleton className="h-80" />` as `loading` (see `src/features/home/Home.tsx`), so it loads on demand without a layout jump.

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

Tests live next to the code they cover (`*.test.ts`) and run with Vitest. Lint includes accessibility rules; where a rule is turned off for a file (photo viewers, carousels) `eslint.config.js` explains why.

## Deployment

The site runs as a container on **Google Cloud Run**. `Dockerfile` builds the Next.js standalone server; `cloudbuild.yaml` builds the image and deploys it.

1. In the Google Cloud project, create an Artifact Registry Docker repository named `sjks` and two Cloud Run services' worth of access (`sjks-frontend-staging`, `sjks-frontend`).
2. Map `www.saharangosag.com` to the production service (Cloud Run domain mapping or a load balancer with Cloud CDN).
3. In GitHub, go to Settings → Secrets and variables → Actions → Variables and add:

   | Variable | Value |
   |---|---|
   | `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Public Supabase values for that environment |
   | `NEXT_PUBLIC_SITE_URL` | Public address of the website |
   | `NEXT_PUBLIC_API_URL` | `https://api.saharangosag.com` |
   | `NEXT_PUBLIC_ADMIN_URL` | Optional admin address |
   | `GCP_PROJECT`, `GCP_REGION` | Project and region (for example `asia-south1`) |
   | `GCP_WIF_PROVIDER`, `GCP_SERVICE_ACCOUNT` | Workload Identity Federation (keyless login from GitHub) |

4. Push to `stage` to deploy staging, or to `main` to deploy production. `dev` only runs the checks.

`NEXT_PUBLIC_` values are compiled in at build time, so staging and production are separate builds. Blog pages refresh from the database about once a minute without a redeploy.

Local container test: `docker build -t sjks-frontend . && docker run -p 8080:8080 sjks-frontend`.

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
