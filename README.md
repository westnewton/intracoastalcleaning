# Intracoastal Cleaning website

Static site, no dependencies. `node build.mjs` writes the site to `dist/`.

- Site-wide details (email, phone, Web3Forms key, service areas): `site.config.mjs`
- Blog posts: `content/blog/*.md` (file name = URL slug)
- Styles / scripts / icons: `public/`
- Redirects from the old Squarespace URLs and build settings: `vercel.json`

Deploy: `npx vercel` from this folder (Vercel reads build settings from vercel.json).
