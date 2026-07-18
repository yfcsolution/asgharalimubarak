# Asghar Ali Mubarak — Bilingual News

Production-ready Next.js App Router frontend for the WordPress.com newsroom at
`asgharalimubarakblog.wordpress.com`.

## Stack

- Next.js App Router + TypeScript (strict)
- Tailwind CSS + `@tailwindcss/typography`
- Server Components with WordPress REST API fetching
- Incremental Static Regeneration (`revalidate = 60`)
- Vercel / GitHub compatible

## Environment

Copy `.env.example` to `.env.local`:

```bash
WORDPRESS_API_URL=https://public-api.wordpress.com/wp/v2/sites/asgharalimubarakblog.wordpress.com
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

On Vercel, set `NEXT_PUBLIC_SITE_URL` to your production domain.

## Scripts

```bash
npm install
npm run dev
npm run lint
npm run build
npm start
```

## Routes

- `/` — homepage with lead story and latest reports
- `/latest` — paginated archive
- `/article/[slug]` — article detail
- `/category/[slug]` — category archive
- `/about` — about the publication
- `/contact` — contact page
- `/robots.txt` and `/sitemap.xml` — SEO

## Notes

- Only published WordPress posts are fetched on the server.
- Featured images use `next/image` with a branded fallback when missing.
- Titles support English, Urdu, and mixed text via `dir="auto"`.
