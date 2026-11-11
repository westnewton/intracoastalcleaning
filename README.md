# Intracoastal Cleaning website

Static site, no dependencies. `node build.mjs` writes the site to `dist/`.

- Site-wide details (email, phone, Web3Forms key, service areas): `site.config.mjs`
- Blog posts: `content/blog/*.md` (file name = URL slug)
  - `date:` in the future = scheduled. The post stays hidden until that date (Wilmington time); a daily GitHub Action
    (`.github/workflows/publish-scheduled-posts.yml`) rebuilds the live site the morning a post is due.
    Needs a one-time `VERCEL_DEPLOY_HOOK` repository secret (setup steps are in that file).
  - Vercel preview deployments show scheduled posts (marked "Scheduled") so they can be reviewed.
  - `updated:` (optional) shows "Updated <date>" and tells Google the post was refreshed.
  - Test a future date locally: `SITE_TODAY=2027-01-06 node build.mjs`
- Town pages (`/areas/<slug>`): `content/areas.mjs`
- Starting price shown across the site: `priceFrom` in `site.config.mjs` (0 hides it)
- Analytics: Vercel Web Analytics (enable it in the Vercel project → Analytics tab)
- Styles / scripts / icons: `public/`
- Redirects from the old Squarespace URLs and build settings: `vercel.json`

Deploy: `npx vercel` from this folder (Vercel reads build settings from vercel.json).
