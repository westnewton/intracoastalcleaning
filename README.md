# Intracoastal Cleaning website

Static site, no dependencies. `node build.mjs` writes the site to `dist/`.

- Site-wide details (email, phone, Web3Forms key, service areas): `site.config.mjs`
- Blog posts: `content/blog/*.md` (file name = URL slug)
- Town pages (`/areas/<slug>`): `content/areas.mjs`
- Starting price shown across the site: `priceFrom` in `site.config.mjs` (0 hides it)
- Analytics: Vercel Web Analytics (enable it in the Vercel project → Analytics tab)
- Styles / scripts / icons: `public/`
- Redirects from the old Squarespace URLs and build settings: `vercel.json`

Deploy: `npx vercel` from this folder (Vercel reads build settings from vercel.json).
