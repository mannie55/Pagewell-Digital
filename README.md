# PageWell Digital

Agency website built with Next.js (App Router), TypeScript and Tailwind CSS v4.

## Getting started

```bash
npm install
cp .env.example .env.local   # set NEXT_PUBLIC_SITE_URL
npm run dev                  # http://localhost:3000
```

## Scripts

| Command             | What it does         |
| ------------------- | -------------------- |
| `npm run dev`       | Start the dev server |
| `npm run build`     | Production build     |
| `npm run lint`      | ESLint               |
| `npm run typecheck` | TypeScript check     |
| `npm run format`    | Format with Prettier |

## Structure

- `app/` — routes, layout, `sitemap.ts`, `robots.ts`
- `components/sections/` — page sections (hero, services, …)
- `components/ui/` — reusable building blocks (buttons, cards, …)
- `content/` — MDX content (case studies, blog)
- `lib/site.ts` — site name, description and URL used across metadata
