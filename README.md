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

### Optional social APIs (server-only)

```bash
YOUTUBE_API_KEY=
YOUTUBE_CHANNEL_ID=
YOUTUBE_UPLOADS_PLAYLIST_ID=
META_FACEBOOK_PAGE_ID=
META_FACEBOOK_PAGE_ACCESS_TOKEN=
META_INSTAGRAM_USER_ID=
META_INSTAGRAM_ACCESS_TOKEN=
```

These are never exposed to the browser. The site builds and runs without them;
social pages then show a professional link to the official profile/channel.

## Routes

- `/` — homepage with lead story, latest reports, and optional Latest Videos
- `/latest` — paginated archive (all categories)
- `/article/[slug]` — article detail
- `/category/[slug]` — category archive
- `/categories` — all news sections
- `/about` — About AAM News & Contact (footer only)
- `/contact` — permanent redirect to `/about#contact`
- `/videos` — YouTube videos (API or channel fallback)
- `/videos/[videoId]` — privacy-enhanced YouTube embed
- `/facebook` — Facebook page (Graph API or official link)
- `/instagram` — Instagram (Graph API or official link)
- `/blogger` — Blogger Archive (when WP category exists)
- `/api/health/wordpress` — WordPress connectivity health check
- `/robots.txt` and `/sitemap.xml` — SEO

## Notes

- Header navigation is editorial only (Home, Latest, WordPress categories, More).
- Institutional and social pages live in the footer Explore section.
- Only published WordPress posts are fetched on the server.
- Featured images use `next/image` with a branded fallback when missing.
- Titles support English, Urdu, and mixed text via `dir="auto"`.
