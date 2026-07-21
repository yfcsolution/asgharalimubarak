# Asghar Ali Mubarak — Bilingual News

Production-ready Next.js App Router frontend for the WordPress.com newsroom at
`asgharalimubarakblog.wordpress.com`.

Production domain: https://asgharalimubarak.com

## Stack

- Next.js App Router + TypeScript (strict)
- Tailwind CSS + `@tailwindcss/typography`
- Server Components with WordPress REST API fetching
- Incremental Static Regeneration (`revalidate = 60`)
- Vercel / GitHub compatible

## Environment

### Local (`.env.local`)

```bash
WORDPRESS_API_URL=https://public-api.wordpress.com/wp/v2/sites/asgharalimubarakblog.wordpress.com
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### Production / Preview / Development (Vercel)

```bash
WORDPRESS_API_URL=https://public-api.wordpress.com/wp/v2/sites/asgharalimubarakblog.wordpress.com
NEXT_PUBLIC_SITE_URL=https://asgharalimubarak.com
```

Apply the Vercel variables to **Production**, **Preview**, and **Development**.

## Vercel project settings

- **Production Branch:** `main`
- **Framework Preset:** Next.js
- **Root Directory:** `.` (repository root)
- After merging to `main`, redeploy the latest `main` commit **without build cache**

## Scripts

```bash
npm install
npm run dev
npm run lint
npm run build
npm run wordpress:check
npm start
```

## WordPress API resilience

The server tries these bases in order and uses the first valid JSON response:

1. `WORDPRESS_API_URL` (when set)
2. `https://public-api.wordpress.com/wp/v2/sites/asgharalimubarakblog.wordpress.com`
3. `https://asgharalimubarakblog.wordpress.com/wp-json/wp/v2`

If `WORDPRESS_API_URL` is missing, the public WordPress.com proxy is used automatically.

Health check: `/api/health/wordpress` (returns safe JSON, `Cache-Control: no-store`).

Snapshot persistence is best-effort only on Vercel and never blocks live WordPress responses.

## Routes

- `/` — homepage with lead story and latest reports
- `/latest` — paginated archive (all categories)
- `/article/[slug]` — article detail
- `/category/[slug]` — category archive
- `/about` — about the publication (footer link)
- `/contact` — contact page (footer link)
- `/api/health/wordpress` — WordPress connectivity health check
- `/robots.txt` and `/sitemap.xml` — SEO

## Notes

- Only published WordPress posts are fetched on the server.
- Featured images use `next/image` with a branded fallback when missing.
- Titles support English, Urdu, and mixed text via `dir="auto"`.
