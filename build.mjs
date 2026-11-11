// Static site generator for intracoastalcleaning.com — no dependencies.
// Run: node build.mjs  → writes the site to ./dist
import fs from 'node:fs';
import path from 'node:path';
import { site, img } from './site.config.mjs';

const DIST = 'dist';
fs.rmSync(DIST, { recursive: true, force: true });
fs.mkdirSync(DIST, { recursive: true });
fs.cpSync('public', DIST, { recursive: true });

const esc = (s = '') => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const telHref = (p) => 'tel:+1' + p.replace(/\D/g, '').replace(/^1/, '');
const write = (route, html) => {
  const file = route === '/' ? 'index.html' : route.replace(/^\//, '') + '.html';
  const out = path.join(DIST, file);
  fs.mkdirSync(path.dirname(out), { recursive: true });
  fs.writeFileSync(out, html);
};

// ---------- shared pieces ----------
const WAVES = `<path d="M4 20c9-9 17-9 26 0s17 9 26 0" stroke="#4FA3B5"/><path d="M4 32c9-9 17-9 26 0s17 9 26 0" stroke="#1A5D6B"/><path d="M4 44c9-9 17-9 26 0s17 9 26 0" stroke="#6B9F7D"/>`;
const logo = (light = false) => `<svg viewBox="0 0 300 64" role="img" aria-label="${site.name}" xmlns="http://www.w3.org/2000/svg"><g fill="none" stroke-width="5.5" stroke-linecap="round">${light ? WAVES.replace('#1A5D6B', '#9CC9D3') : WAVES}</g><text x="72" y="34" font-family="'DM Serif Display', Georgia, serif" font-size="30" fill="${light ? '#fff' : '#0E3B45'}">Intracoastal</text><text x="73" y="55" font-family="'DM Sans', Arial, sans-serif" font-size="13.5" letter-spacing="4.2" fill="${light ? '#9CC9D3' : '#1A5D6B'}">CLEANING</text></svg>`;
const check = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 6 9 17l-5-5"/></svg>`;

const NAV = [
  ['/residential-services', 'Residential'],
  ['/commercial-services', 'Commercial'],
  ['/specialty-services', 'Specialty'],
  ['/about', 'About'],
  ['/blog', 'Blog'],
];

const orgSchema = {
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness',
  '@id': site.url + '/#business',
  name: site.name,
  url: site.url,
  email: site.email,
  ...(site.phone ? { telephone: site.phone } : {}),
  logo: site.url + '/logo.svg',
  image: img('photo-1582836080262-088c42e984c7', 1200),
  description: 'Locally owned residential, commercial, and specialty cleaning in Wilmington, NC. Residential services use 100% organic products.',
  address: { '@type': 'PostalAddress', addressLocality: 'Wilmington', addressRegion: 'NC', addressCountry: 'US' },
  areaServed: site.areas.map((a) => ({ '@type': 'Place', name: `${a}, NC` })),
  knowsAbout: ['House cleaning', 'Commercial cleaning', 'Move-out cleaning', 'Post-construction cleaning', 'Vacation rental turnover cleaning', 'Organic cleaning'],
};

function layout({ route, title, description, body, schema = [], ogImage, ogType = 'website', noindex = false }) {
  const canonical = site.url + (route === '/' ? '/' : route);
  const jsonld = [orgSchema, ...schema].map((s) => `<script type="application/ld+json">${JSON.stringify(s)}</script>`).join('\n');
  const navLinks = NAV.map(([href, label]) => `<a href="${href}"${route === href || (href === '/blog' && route.startsWith('/blog')) ? ' aria-current="page"' : ''}>${label}</a>`).join('');
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)}</title>
<meta name="description" content="${esc(description)}">
<link rel="canonical" href="${canonical}">
${noindex ? '<meta name="robots" content="noindex">' : ''}
<meta property="og:type" content="${ogType}">
<meta property="og:site_name" content="${site.name}">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(description)}">
<meta property="og:url" content="${canonical}">
<meta property="og:image" content="${ogImage || img('photo-1582836080262-088c42e984c7', 1200, 630)}">
<meta name="twitter:card" content="summary_large_image">
<meta name="theme-color" content="#0E3B45">
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="preconnect" href="https://images.unsplash.com">
<link href="https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600;9..40,700&family=DM+Serif+Display&display=swap" rel="stylesheet">
<link rel="stylesheet" href="/styles.css">
${jsonld}
</head>
<body>
<a class="skip" href="#main">Skip to content</a>
<header class="site-header">
  <div class="wrap header-inner">
    <a class="logo" href="/" aria-label="${site.name} home">${logo()}</a>
    <button class="menu-toggle" aria-label="Menu" aria-expanded="false" aria-controls="nav"><svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M4 7h16M4 12h16M4 17h16"/></svg></button>
    <nav class="nav" id="nav">${navLinks}${site.phone ? `<a class="header-phone" href="${telHref(site.phone)}">${site.phone}</a>` : ''}<a class="btn btn-primary" href="/contact">Get a free quote</a></nav>
  </div>
</header>
<main id="main">
${body}
</main>
<footer class="site-footer">
  <div class="wrap">
    <div class="footer-grid">
      <div>
        <a class="logo" href="/" aria-label="${site.name} home">${logo(true)}</a>
        <p style="margin-top:16px;max-width:300px">Locally owned house, office and specialty cleaning in Wilmington, NC and the Cape Fear region.</p>
      </div>
      <div><h4>Services</h4><ul>
        <li><a href="/residential-services">Residential cleaning</a></li>
        <li><a href="/commercial-services">Commercial cleaning</a></li>
        <li><a href="/specialty-services">Move-out &amp; post-construction</a></li>
        <li><a href="/specialty-services#airbnb">Airbnb turnovers</a></li>
      </ul></div>
      <div><h4>Company</h4><ul>
        <li><a href="/about">About us</a></li>
        <li><a href="/blog">Blog</a></li>
        <li><a href="/contact">Free quote</a></li>
      </ul></div>
      <div><h4>Contact</h4><ul>
        ${site.phone ? `<li><a href="${telHref(site.phone)}">${site.phone}</a></li>` : ''}
        <li><a href="mailto:${site.email}">${site.email}</a></li>
        <li>Wilmington, NC</li>
      </ul></div>
    </div>
    <div class="footer-bottom"><span>&copy; ${new Date().getFullYear()} ${site.name}. Locally owned in Wilmington, NC.</span><span>Fully licensed &amp; insured</span></div>
  </div>
</footer>
<div class="mobile-bar">${site.phone ? `<a class="btn btn-ghost" href="${telHref(site.phone)}">Call</a>` : `<a class="btn btn-ghost" href="mailto:${site.email}">Email us</a>`}<a class="btn btn-primary" href="/contact">Free quote</a></div>
<script src="/site.js" defer></script>
</body>
</html>`;
}

const hero = ({ image, alt, eyebrow, title, text, small = true, actions = true }) => `
<section class="hero${small ? ' hero-sm' : ''}">
  <img class="bg" src="${img(image, 1600)}" srcset="${img(image, 800)} 800w, ${img(image, 1600)} 1600w, ${img(image, 2400)} 2400w" sizes="100vw" alt="${esc(alt)}" fetchpriority="high">
  <div class="wrap">
    ${eyebrow ? `<span class="eyebrow" style="color:#a9d7b8">${eyebrow}</span>` : ''}
    <h1>${title}</h1>
    ${text ? `<p>${text}</p>` : ''}
    ${actions ? `<div class="actions"><a class="btn btn-light" href="/contact">Get a free quote</a>${site.phone ? `<a class="btn btn-outline-light" href="${telHref(site.phone)}">Call ${site.phone}</a>` : ''}</div>` : ''}
  </div>
</section>`;

const trust = `<div class="trust"><div class="wrap"><ul>
<li>${check}Locally owned in Wilmington</li><li>${check}Fully licensed &amp; insured</li><li>${check}Background-checked team</li><li>${check}100% satisfaction guarantee</li>
</ul></div></div>`;

const areasList = (list = site.areas) => `<ul class="areas">${list.map((a) => `<li>${a}</li>`).join('')}</ul>`;

const faq = (items) => `<div class="faq">${items.map(([q, a]) => `<details><summary>${q}</summary><p>${a}</p></details>`).join('')}</div>`;
const faqSchema = (items) => ({ '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: items.map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })) });

const ctaBand = (title = 'Ready for a cleaner space?', text = 'Tell us about your home or business and we’ll follow up with a clear, no-pressure estimate—usually within 24 hours.') => `
<section class="cta-band">
  <svg class="waves-deco" viewBox="0 0 60 60" fill="none" stroke="#fff" stroke-width="5" stroke-linecap="round">${WAVES.replace(/stroke="#\w+"/g, '')}</svg>
  <div class="wrap"><h2>${title}</h2><p>${text}</p>
  <div class="actions"><a class="btn btn-light" href="/contact">Get a free quote</a>${site.phone ? `<a class="btn btn-outline-light" href="${telHref(site.phone)}">Call ${site.phone}</a>` : ''}</div></div>
</section>`;

const serviceOptions = ['House cleaning', 'Deep cleaning', 'Move-in / move-out cleaning', 'Post-construction cleanup', 'Airbnb / vacation rental turnover', 'Office / commercial cleaning', 'Estate or hoarding cleanup', 'Not sure yet'];

const quoteForm = (preset = '') => `
<div class="form-card">
  <h3 style="margin-bottom:4px">Get your free quote</h3>
  <p style="color:var(--muted);margin-bottom:22px">Takes about a minute. We usually reply within 24 hours.</p>
  <form class="quote-form" novalidate>
    <input type="hidden" name="access_key" value="${site.web3formsKey}">
    <input type="hidden" name="subject" value="New quote request – intracoastalcleaning.com">
    <input type="hidden" name="from_name" value="Intracoastal Cleaning website">
    <input type="checkbox" name="botcheck" class="hp" tabindex="-1" autocomplete="off">
    <div class="form-grid">
      <div><label for="f-first">First name</label><input id="f-first" name="first_name" autocomplete="given-name" required></div>
      <div><label for="f-last">Last name <span class="opt">(optional)</span></label><input id="f-last" name="last_name" autocomplete="family-name"></div>
      <div><label for="f-phone">Phone <span class="opt">(optional)</span></label><input id="f-phone" name="phone" type="tel" autocomplete="tel"></div>
      <div><label for="f-email">Email</label><input id="f-email" name="email" type="email" autocomplete="email" required></div>
      <div><label for="f-service">What do you need? <span class="opt">(optional)</span></label><select id="f-service" name="service"><option value="">Choose a service</option>${serviceOptions.map((o) => `<option${o === preset ? ' selected' : ''}>${o}</option>`).join('')}</select></div>
      <div><label for="f-area">Town <span class="opt">(optional)</span></label><select id="f-area" name="town"><option value="">Choose your town</option>${site.areas.map((a) => `<option>${a}</option>`).join('')}<option>Other</option></select></div>
      <div class="full"><label for="f-msg">Tell us about your space <span class="opt">(optional)</span></label><textarea id="f-msg" name="message" placeholder="Bedrooms/bathrooms or square footage, how often you'd like service, pets, timing…"></textarea></div>
    </div>
    <button class="btn btn-primary" type="submit">Request my free quote</button>
    <div class="form-status" role="status" aria-live="polite"></div>
    <p class="form-note">No spam, ever. We only use your details to reply to your request.</p>
  </form>
</div>`;

const quoteSection = (alt = true) => `
<section class="section${alt ? ' section-alt' : ''}" id="quote">
  <div class="wrap quote">
    <div class="quote-aside">
      <span class="eyebrow">Free estimates</span>
      <h2>Let’s get your space clean</h2>
      <p class="lede">Residential, commercial or a one-time job—tell us what you need and we’ll put together a clear, no-pressure quote.</p>
      <ul class="checks">
        <li>Reply usually within 24 hours</li>
        <li>100% organic products for homes</li>
        <li>Fully licensed, insured &amp; background-checked</li>
        <li>Not happy? We come back and fix it—free</li>
      </ul>
      <div class="contact-lines">
        ${site.phone ? `<div>Call or text: <a href="${telHref(site.phone)}">${site.phone}</a></div>` : ''}
        <div>Email: <a href="mailto:${site.email}">${site.email}</a></div>
      </div>
    </div>
    ${quoteForm()}
  </div>
</section>`;

const breadcrumbSchema = (items) => ({ '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: items.map(([name, url], i) => ({ '@type': 'ListItem', position: i + 1, name, item: site.url + url })) });

// ---------- blog ----------
function parsePost(file) {
  const raw = fs.readFileSync(file, 'utf8').replace(/\r\n?/g, '\n'); // tolerate Windows line endings
  const [head, ...rest] = raw.split('\n---\n');
  const meta = Object.fromEntries(head.split('\n').filter(Boolean).map((l) => { const i = l.indexOf(':'); return [l.slice(0, i).trim(), l.slice(i + 1).trim()]; }));
  meta.slug = path.basename(file, '.md');
  meta.md = rest.join('\n---\n');
  return meta;
}
const inline = (s) => esc(s).replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>').replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2">$1</a>');
function md2html(md) {
  const blocks = md.trim().split(/\n{2,}/);
  return blocks.map((b) => {
    const lines = b.split('\n');
    if (b.startsWith('### ')) return `<h3>${inline(b.slice(4))}</h3>`;
    if (b.startsWith('## ')) return `<h2>${inline(b.slice(3))}</h2>`;
    if (lines.every((l) => l.startsWith('- '))) return `<ul>${lines.map((l) => `<li>${inline(l.slice(2))}</li>`).join('')}</ul>`;
    if (lines.every((l) => l.startsWith('|'))) {
      const rows = lines.filter((l) => !/^[\s|:-]+$/.test(l)).map((l) => l.replace(/^\||\|$/g, '').split('|').map((c) => c.trim()));
      return `<table><thead><tr>${rows[0].map((c) => `<th>${inline(c)}</th>`).join('')}</tr></thead><tbody>${rows.slice(1).map((r) => `<tr>${r.map((c) => `<td>${inline(c)}</td>`).join('')}</tr>`).join('')}</tbody></table>`;
    }
    if (/^\[.+\]\(.+\)$/.test(b)) return `<p class="cta-line">${inline(b)}</p>`;
    return `<p>${inline(b)}</p>`;
  }).join('\n');
}
const posts = fs.readdirSync('content/blog').filter((f) => f.endsWith('.md')).map((f) => parsePost(path.join('content/blog', f))).sort((a, b) => b.date.localeCompare(a.date) || a.title.localeCompare(b.title));
const fmtDate = (d) => new Date(d + 'T12:00:00').toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
const postCard = (p) => `<a class="card" href="/blog/${p.slug}"><img src="${img(p.image, 700, 525)}" alt="${esc(p.imageAlt)}" loading="lazy" width="700" height="525"><div class="card-body"><span class="post-meta">${fmtDate(p.date)}</span><h3 style="margin-top:6px">${esc(p.title)}</h3><p>${esc(p.description)}</p><span class="card-link">Read article →</span></div></a>`;

// ---------- pages ----------
const pages = {};

pages['/'] = layout({
  route: '/',
  title: 'Intracoastal Cleaning | Wilmington, NC House & Office Cleaning',
  description: 'Residential, commercial, and specialty cleaning in Wilmington, NC. Our residential services use 100% organic products. Locally owned. Free estimates.',
  body: `
${hero({ image: 'photo-1582836080262-088c42e984c7', alt: 'Wooden pier stretching into the ocean on a clear day', eyebrow: 'Wilmington · Wrightsville Beach · Cape Fear', title: 'Spotless homes.<br>Professional spaces.', text: 'Locally owned house, office and specialty cleaning across the Cape Fear coast. Our residential service uses 100% organic products—safe for kids, pets and the planet.', small: false })}
${trust}
<section class="section">
  <div class="wrap">
    <div class="section-head center"><span class="eyebrow">What we do</span><h2>Cleaning for every kind of space</h2><p class="lede">Recurring service, deep cleans, or the one-time jobs that need extra attention.</p></div>
    <div class="cards">
      <a class="card" href="/residential-services"><img src="${img('photo-1584622650111-993a426fbf0a', 700, 525)}" alt="Modern bathroom with walk-in glass shower and gray vanity" loading="lazy" width="700" height="525"><div class="card-body"><h3>Residential</h3><p>A healthier clean for your home with 100% organic products. Recurring service, deep cleans, or one-time visits.</p><span class="card-link">House cleaning →</span></div></a>
      <a class="card" href="/commercial-services"><img src="${img('photo-1497215728101-856f4ea42174', 700, 525)}" alt="Bright office with large windows, a tall plant and a laptop" loading="lazy" width="700" height="525"><div class="card-body"><h3>Commercial</h3><p>Offices, retail and medical facilities kept spotless on your schedule. Consistent crews, reliable results, fully insured.</p><span class="card-link">Commercial cleaning →</span></div></a>
      <a class="card" href="/specialty-services"><img src="${img('photo-1686178827149-6d55c72d81df', 700, 525)}" alt="Cleaner vacuuming a gray upholstered couch" loading="lazy" width="700" height="525"><div class="card-body"><h3>Specialty</h3><p>Move-outs, post-construction, Airbnb turnovers and deep cleans—for the jobs that need extra detail.</p><span class="card-link">Specialty cleaning →</span></div></a>
    </div>
  </div>
</section>
<section class="section section-alt">
  <div class="wrap split">
    <img src="${img('photo-1528740561666-dc2479dc08ab', 900, 720)}" alt="Brown spray bottles of bathroom and kitchen cleaner on a wooden surface" loading="lazy" width="900" height="720">
    <div>
      <span class="eyebrow">Why Intracoastal</span>
      <h2>Clean spaces shouldn’t come with compromises</h2>
      <p>We’re a Wilmington-based team that believes your family’s health matters as much as a spotless home. That’s why our residential services use only organic products—no bleach, no ammonia, no synthetic fragrances.</p>
      <p>Whether it’s a weekly house cleaning, a busy office, or a post-renovation deep clean, we bring the same care and attention to every job. Locally owned, fully insured, and proud to serve the Cape Fear community.</p>
      <ul class="checks"><li>Safe around children, pets and people with sensitivities</li><li>Biodegradable and septic-safe</li><li>The same familiar faces on recurring visits</li></ul>
      <a class="btn btn-ghost" href="/about">More about us</a>
    </div>
  </div>
</section>
<section class="section">
  <div class="wrap">
    <div class="section-head center"><span class="eyebrow">How it works</span><h2>Simple from quote to clean</h2></div>
    <div class="steps">
      <div class="step"><h3>Get a quote</h3><p>Tell us about your space and what you need. We follow up with a clear, no-pressure estimate—usually within 24 hours.</p></div>
      <div class="step"><h3>Schedule your clean</h3><p>Pick a time that works for you. Flexible scheduling, including recurring appointments.</p></div>
      <div class="step"><h3>We clean, you relax</h3><p>Our team arrives on time with everything we need. You don’t have to be home.</p></div>
      <div class="step"><h3>Walk into clean</h3><p>If anything isn’t right, let us know within 24 hours and we’ll make it right.</p></div>
    </div>
  </div>
</section>
<section class="section section-alt">
  <div class="wrap split">
    <div>
      <span class="eyebrow">Service area</span>
      <h2>Proudly serving the Cape Fear region</h2>
      <p>We clean homes and businesses throughout Wilmington and the surrounding coast, including:</p>
      ${areasList()}
      <p style="color:var(--muted)">Not sure if we cover your area? <a href="/contact">Just ask</a>—we’re happy to work with you.</p>
    </div>
    <img src="${img('photo-1735231179264-ab53db8b2f7e', 900, 720)}" alt="Bridge over the water with city buildings under a blue sky" loading="lazy" width="900" height="720">
  </div>
</section>
<section class="section">
  <div class="wrap">
    <div class="section-head" style="display:flex;justify-content:space-between;align-items:end;gap:20px;flex-wrap:wrap"><div><span class="eyebrow">From the blog</span><h2 style="margin:0">Cleaning tips &amp; guides</h2></div><a class="btn btn-ghost" href="/blog">All articles</a></div>
    <div class="cards">${posts.slice(0, 3).map(postCard).join('')}</div>
  </div>
</section>
${quoteSection()}`,
});

// Residential
const resFaq = [
  ['Do I need to be home during the cleaning?', 'Nope. Many of our clients give us a key or garage code. We’re fully insured and background-checked, and we’ll lock up when we leave.'],
  ['How long does a cleaning take?', 'It depends on the size of your home and the service level. A standard clean for a typical 3-bedroom home takes about 2–3 hours. Deep cleans take longer.'],
  ['Do you bring your own supplies?', 'Yes. We bring all organic products and equipment. If you have specific products you’d like us to use, just let us know.'],
  ['Are your cleaners employees or contractors?', 'Employees. Our team members are trained, insured, and paid fairly. You’ll see the same familiar faces on recurring visits.'],
  ['What if I’m not satisfied?', 'Let us know within 24 hours and we’ll come back to fix it—no charge, no hassle. Your satisfaction is guaranteed.'],
  ['Do you clean houses with pets?', 'Absolutely. Our organic products are pet-safe, and we’re used to working around furry family members. Just give us a heads-up about any pets during booking.'],
];
pages['/residential-services'] = layout({
  route: '/residential-services',
  title: 'Organic House Cleaning in Wilmington, NC | Intracoastal Cleaning',
  description: 'Safe, eco-friendly house cleaning using 100% organic products. Recurring maid service, deep cleans, and move-in/move-out cleaning for Wilmington-area homes. Free estimates.',
  schema: [faqSchema(resFaq), breadcrumbSchema([['Home', '/'], ['Residential cleaning', '/residential-services']]), { '@context': 'https://schema.org', '@type': 'Service', serviceType: 'House cleaning', provider: { '@id': site.url + '/#business' }, areaServed: site.areas.map((a) => `${a}, NC`), description: 'Recurring, deep and customized house cleaning using 100% organic products.' }],
  body: `
${hero({ image: 'photo-1583847268964-b28dc8f51f92', alt: 'Bright living room with a gray sofa, coffee tables and houseplants', eyebrow: 'Residential cleaning', title: 'A cleaner home—without the chemicals', text: 'Our residential team uses 100% organic products. Safe for your family, your pets, and the Carolina coast we all love.' })}
${trust}
<section class="section">
  <div class="wrap split">
    <div>
      <span class="eyebrow">Why we started</span>
      <h2>You shouldn’t have to choose</h2>
      <p>There’s nothing like walking into a clean home. But for a lot of families, that fresh-cleaned smell comes with a tradeoff—harsh chemicals that linger on countertops, floors, and the air your kids and pets breathe.</p>
      <p>We started Intracoastal Cleaning because we believe you shouldn’t have to choose. Our residential cleaning services use only 100% organic, non-toxic products—no bleach, no ammonia, no synthetic fragrances. Just a spotless home you can feel good about.</p>
    </div>
    <img src="${img('photo-1546387903-6d82d96ccca6', 900, 720)}" alt="Eucalyptus in a clear glass vase on a white surface" loading="lazy" width="900" height="720">
  </div>
</section>
<section class="section section-alt">
  <div class="wrap">
    <div class="section-head"><span class="eyebrow">Our services</span><h2>Choose the clean that fits</h2></div>
    <div class="service"><div><h3>Standard Clean</h3><p class="tag">Our go-to service for regular home maintenance.</p></div><div><p>We’ll tackle the essentials so you can spend your time on what matters.</p><ul class="checks"><li><strong>Kitchen:</strong> counters, appliances (exterior), sink, floors</li><li><strong>Bathrooms:</strong> toilet, shower/tub, sink, mirrors, floors</li><li><strong>Living areas:</strong> dusting, vacuuming, mopping</li><li><strong>Bedrooms:</strong> dusting, vacuuming, making beds</li><li>Trash removal and general tidying</li></ul><p class="best"><strong>Best for:</strong> Busy households looking to maintain a clean baseline week to week.</p></div></div>
    <div class="service"><div><h3>Deep Clean</h3><p class="tag">A top-to-bottom reset for your home.</p></div><div><p>We go beyond the surface to clean the spots that get missed in day-to-day life. Everything in Standard Clean, plus:</p><ul class="checks"><li>Inside appliances (oven, microwave, refrigerator)</li><li>Baseboards and door frames</li><li>Light fixtures and ceiling fans</li><li>Inside cabinets and drawers (on request)</li><li>Window sills and tracks</li><li>Detailed scrubbing in kitchens and baths</li></ul><p class="best"><strong>Best for:</strong> First-time clients, seasonal refreshes, post-holiday recovery, or anyone ready for a fresh start.</p></div></div>
    <div class="service"><div><h3>Customized</h3><p class="tag">Built around your household.</p></div><div><p>We’re here to serve you. Whether it’s pets, children, or a busy household, let us know how we can best clean and organize your space—and we’ll build the visit around it.</p><a class="btn btn-primary" href="/contact">Tell us what you need</a></div></div>
  </div>
</section>
<section class="section">
  <div class="wrap split">
    <img src="${img('photo-1584622650111-993a426fbf0a', 900, 720)}" alt="Clean modern bathroom with glass shower" loading="lazy" width="900" height="720">
    <div>
      <span class="eyebrow">Why organic?</span>
      <h2>The same spotless results, minus the residue</h2>
      <p>Most conventional cleaning products contain chemicals linked to respiratory issues, skin irritation, hormone disruption, and environmental harm. We chose a different path. Our organic products are:</p>
      <ul class="checks"><li>Free from bleach, ammonia, and synthetic fragrances</li><li>Safe around children, pets, and people with sensitivities</li><li>Biodegradable and septic-safe</li><li>Just as effective as traditional cleaners (we’ve tested them thoroughly)</li></ul>
      <a href="/blog/why-we-use-100-organic-products-in-our-residential-cleaning">Why we use 100% organic products →</a>
    </div>
  </div>
</section>
<section class="section section-alt">
  <div class="wrap">
    <div class="section-head"><span class="eyebrow">What to expect</span><h2>Four simple steps</h2></div>
    <div class="steps">
      <div class="step"><h3>Get a quote</h3><p>Tell us about your home and what you need. We’ll follow up with a clear, no-pressure estimate—usually within 24 hours.</p></div>
      <div class="step"><h3>Schedule your clean</h3><p>Pick a time that works for you. We offer flexible scheduling, including recurring appointments.</p></div>
      <div class="step"><h3>We clean, you relax</h3><p>Our team arrives on time with everything we need. You don’t have to be home—just let us know your preferences.</p></div>
      <div class="step"><h3>Walk into clean</h3><p>Come home to a spotless space. If anything isn’t right, let us know and we’ll make it right.</p></div>
    </div>
  </div>
</section>
<section class="section">
  <div class="wrap split" style="align-items:start">
    <div><span class="eyebrow">Service areas</span><h2>Homes across the Cape Fear region</h2>${areasList(['Wilmington', 'Wrightsville Beach', 'Hampstead', 'Porters Neck', 'Ogden', 'Monkey Junction'])}<p style="color:var(--muted)">Not sure if we cover your area? <a href="/contact">Just ask</a>—we’re happy to work with you.</p></div>
    <div><span class="eyebrow">FAQ</span><h2>Frequently asked questions</h2>${faq(resFaq)}</div>
  </div>
</section>
${quoteSection()}`,
});

// Commercial
const comFaq = [
  ['How often do you clean?', 'We offer daily, weekly, biweekly, and monthly service—whatever fits your needs.'],
  ['Do you bring your own supplies?', 'Yes. We arrive fully equipped with professional-grade cleaning products and equipment.'],
  ['Can you clean after business hours?', 'Absolutely. Most of our commercial clients prefer evening or weekend service.'],
  ['Do you require a contract?', 'No long-term contracts required. We earn your business every visit.'],
  ['Are you insured?', 'Yes. We carry full liability insurance and are bonded.'],
];
pages['/commercial-services'] = layout({
  route: '/commercial-services',
  title: 'Commercial Cleaning Services in Wilmington, NC | Intracoastal Cleaning',
  description: 'Reliable office, retail, and medical facility cleaning in the Wilmington area. Flexible scheduling, consistent results. Locally owned and fully insured. Request a quote.',
  schema: [faqSchema(comFaq), breadcrumbSchema([['Home', '/'], ['Commercial cleaning', '/commercial-services']]), { '@context': 'https://schema.org', '@type': 'Service', serviceType: 'Commercial cleaning', provider: { '@id': site.url + '/#business' }, areaServed: site.areas.map((a) => `${a}, NC`), description: 'Office, retail, medical, property management and light industrial cleaning.' }],
  body: `
${hero({ image: 'photo-1631193816258-28b44b21e78b', alt: 'Office workspace with desks, chairs and computer monitors', eyebrow: 'Commercial cleaning', title: 'Professional spaces. Consistent results.', text: 'A clean office builds trust with clients, keeps employees healthy, and lets you focus on what you do best.' })}
${trust}
<section class="section">
  <div class="wrap">
    <div class="section-head"><span class="eyebrow">Services we offer</span><h2>Tailored to your space, schedule and standards</h2><p class="lede">Intracoastal Cleaning provides reliable commercial cleaning across the Wilmington area.</p></div>
    <div class="features">
      <div class="feature"><h3>Office cleaning</h3><p>From small professional suites to multi-floor office buildings: dusting, vacuuming, restroom sanitation, breakroom upkeep, and trash removal—done consistently, every visit.</p></div>
      <div class="feature"><h3>Retail &amp; storefronts</h3><p>First impressions matter. We help Wilmington shops, boutiques, and salons maintain clean floors, sparkling windows, and welcoming spaces.</p></div>
      <div class="feature"><h3>Medical &amp; dental offices</h3><p>Healthcare facilities require a higher standard. Our team is trained in proper sanitation protocols for patients and staff.</p></div>
      <div class="feature"><h3>Property management &amp; common areas</h3><p>Apartment lobbies, HOA clubhouses, shared hallways—routine maintenance or turnover cleans between tenants.</p></div>
      <div class="feature"><h3>Warehouse &amp; light industrial</h3><p>Break rooms, restrooms, and office areas within industrial spaces, on a regular schedule.</p></div>
      <div class="feature"><h3>Post-construction</h3><p>Fine dust, paint overspray and debris removed so your new or renovated space is ready to open. <a href="/specialty-services#post-construction">Learn more</a></p></div>
    </div>
  </div>
</section>
<section class="section section-alt">
  <div class="wrap split" style="align-items:start">
    <div>
      <span class="eyebrow">Why businesses choose us</span>
      <h2>Reliable, local and accountable</h2>
      <ul class="checks">
        <li><strong>Flexible scheduling.</strong> Early mornings, evenings, weekends, or after-hours—your business keeps running without interruption.</li>
        <li><strong>Consistent crews.</strong> You’ll see the same faces each visit. Our team gets to know your space and expectations.</li>
        <li><strong>Customized cleaning plans.</strong> A schedule and checklist built around your needs—not a one-size-fits-all package.</li>
        <li><strong>Fully insured &amp; bonded.</strong> Full liability insurance for your peace of mind.</li>
        <li><strong>Local &amp; accountable.</strong> If something’s not right, you’re talking to the owner—not a call center.</li>
      </ul>
    </div>
    <div>
      <span class="eyebrow">Industries we serve</span>
      <h2>Who we clean for</h2>
      <ul class="industries"><li>Law firms &amp; professional services</li><li>Medical and dental practices</li><li>Real estate &amp; property management</li><li>Retail stores and salons</li><li>Gyms and fitness studios</li><li>Churches and nonprofits</li><li>Restaurants (front-of-house)</li><li>Warehouses &amp; light industrial</li></ul>
    </div>
  </div>
</section>
<section class="section">
  <div class="wrap">
    <div class="section-head"><span class="eyebrow">Our process</span><h2>How we get started</h2></div>
    <div class="steps">
      <div class="step"><h3>Walkthrough &amp; quote</h3><p>We visit your space, learn about your needs, and provide a clear, no-obligation quote.</p></div>
      <div class="step"><h3>Custom cleaning plan</h3><p>A checklist and schedule tailored to your business—daily, weekly, or on your terms.</p></div>
      <div class="step"><h3>Consistent service</h3><p>Your assigned team handles every visit. We track our work and adjust as needed.</p></div>
      <div class="step"><h3>Ongoing communication</h3><p>Questions or concerns? You’ll always have a direct line to our team.</p></div>
    </div>
  </div>
</section>
<section class="section section-alt">
  <div class="wrap split" style="align-items:start">
    <div><span class="eyebrow">Service area</span><h2>Commercial cleaning across the Cape Fear region</h2>${areasList()}<p style="color:var(--muted)">Not sure if you’re in our service area? <a href="/contact">Contact us</a>—we’re happy to discuss.</p></div>
    <div><span class="eyebrow">FAQ</span><h2>Frequently asked questions</h2>${faq(comFaq)}</div>
  </div>
</section>
${quoteSection(false)}`,
});

// Specialty
const specFaq = [
  ['How much does move-out cleaning cost?', 'Pricing depends on the size and condition of the home. Most move-out cleans range from $200–$500. We provide free quotes.'],
  ['Can you clean the same day as my guest checkout?', 'Yes. We offer same-day turnover service for Airbnb and vacation rental hosts. Contact us to discuss your booking schedule.'],
  ['Do you handle junk removal?', 'We focus on cleaning, but we can coordinate with local junk removal services for estate cleanouts and hoarding situations.'],
  ['How far in advance should I book a post-construction clean?', 'We recommend booking as soon as you have a target completion date. We can often accommodate jobs with just a few days’ notice.'],
  ['Is there a minimum charge for one-time cleaning?', 'Yes, we have a minimum service charge for one-time jobs. Contact us for details based on your location.'],
];
const specSvc = (id, title, tag, intro, listTitle, items, extra = '') => `<div class="service" id="${id}"><div><h3>${title}</h3><p class="tag">${tag}</p></div><div>${intro}<p><strong>${listTitle}</strong></p><ul class="checks">${items.map((i) => `<li>${i}</li>`).join('')}</ul>${extra}</div></div>`;
pages['/specialty-services'] = layout({
  route: '/specialty-services',
  title: 'Move-Out, Post-Construction & Deep Cleaning | Wilmington, NC',
  description: 'Specialty cleaning services in Wilmington—move-out cleans, post-construction cleanup, Airbnb turnovers, estate cleanouts, and one-time deep cleans. Free estimates.',
  schema: [faqSchema(specFaq), breadcrumbSchema([['Home', '/'], ['Specialty cleaning', '/specialty-services']])],
  body: `
${hero({ image: 'photo-1618832515490-e181c4794a45', alt: 'Kitchen under renovation with plastic sheeting and a step ladder', eyebrow: 'Specialty cleaning', title: 'Beyond the routine', text: 'Handing over keys, finishing a renovation, or prepping a rental for the next guest—we handle the one-time jobs that demand extra attention.' })}
${trust}
<section class="section">
  <div class="wrap">
    <div class="section-head"><span class="eyebrow">Our services</span><h2>One-time jobs, done like an inspection is coming</h2><p class="lede">We bring the crew, the equipment, and the detail-oriented approach these high-stakes situations require.</p></div>
    ${specSvc('move-out', 'Move-Out &amp; Move-In Cleaning', 'Moving is stressful enough. Let us handle the cleaning.', '<p>Move-out cleans help you get your deposit back and leave on good terms with landlords or buyers. We clean every surface, inside every cabinet, and behind every appliance—the details that get checked. Move-in cleans give you a fresh start before you unpack.</p>', 'What’s included:', ['Full kitchen deep clean (inside appliances, cabinets, drawers)', 'Bathroom sanitization and grout cleaning', 'Interior windows and window sills', 'Baseboards, door frames, and light switches', 'Ceiling fans and light fixtures', 'Closet interiors', 'Garage sweep-out (on request)'], '<p><a href="/blog/the-ultimate-move-out-cleaning-checklist-for-wilmington-renters">See our move-out cleaning checklist →</a></p>')}
    ${specSvc('post-construction', 'Post-Construction Cleanup', 'Contractors build. We clean up after.', '<p>Renovations and new builds leave behind dust, debris, and chaos that regular cleaning can’t touch. We remove the fine dust from every surface, clean paint splatters and adhesive residue, and get your space move-in ready.</p>', 'We handle:', ['Fine dust removal from all surfaces, including walls and ceilings', 'Window and glass cleaning (interior)', 'Paint overspray and sticker/label removal', 'Cabinet and fixture cleaning (inside and out)', 'Floor cleaning and debris removal', 'Final detail work before walkthrough or move-in'], '<p class="best"><strong>Ideal for:</strong> General contractors, homeowners finishing renovations, property managers, and real estate agents preparing listings.</p>')}
    ${specSvc('airbnb', 'Airbnb &amp; Vacation Rental Turnover', 'Your next guest might book tonight.', '<p>Fast, reliable turnover cleaning keeps your reviews high and your calendar full. We work with short-term rental hosts on same-day turnovers—fresh linens, spotless bathrooms, and the small touches that earn five-star reviews.</p>', 'Our turnover service includes:', ['Full bathroom and kitchen cleaning', 'Linen change and bed making (linens provided by host)', 'Restocking toiletries and supplies (provided by host)', 'Trash removal and dish washing', 'Surface wipe-down throughout', 'Floor cleaning', 'Quick inspection for damage or maintenance issues'], '<p class="best"><strong>Scheduling:</strong> Same-day availability for most turnovers. Regular hosts can set up recurring service tied to their booking calendar.</p>')}
    ${specSvc('deep-cleaning', 'Deep Cleaning', 'Sometimes a home just needs a reset.', '<p>Our deep cleaning goes beyond the surface to tackle buildup that accumulates over time—inside the oven, behind the refrigerator, in the grout lines, under the furniture.</p>', 'What’s included:', ['Detailed kitchen cleaning (inside oven, microwave, refrigerator)', 'Bathroom deep scrub (grout, tile, fixtures, exhaust fans)', 'Baseboard and door frame cleaning', 'Interior window cleaning', 'Ceiling fan and light fixture dusting', 'Under and behind furniture', 'Cabinet fronts and hardware'], '<p class="best"><strong>Best for:</strong> First-time clients before recurring service, seasonal refreshes, homes that haven’t been professionally cleaned in a while, or preparing a home for sale or guests.</p>')}
    ${specSvc('estate', 'Estate Cleanout Support', 'Handled with care and discretion.', '<p>Clearing a loved one’s home is hard. After the belongings are sorted and removed, we come in to clean the space—preparing it for sale, rental, or the next chapter.</p>', 'Our estate cleaning includes:', ['Full interior cleaning after cleanout', 'Deep cleaning of kitchens and bathrooms', 'Removal of remaining small debris', 'Carpet and floor cleaning', 'Odor treatment if needed', 'Preparing the home for listing or new occupants'])}
    ${specSvc('hoarding', 'Hoarding Cleanup', 'Patient, discreet and non-judgmental.', '<p>We work with families and individuals to restore spaces that have become overwhelming. Every job is handled with care.</p>', 'Our approach:', ['Discreet, unmarked vehicles', 'Compassionate, respectful crews', 'Coordination with junk removal services if needed', 'Deep cleaning and sanitization after cleanout', 'Odor treatment and air quality improvement'])}
  </div>
</section>
<section class="section section-alt">
  <div class="wrap">
    <div class="section-head"><span class="eyebrow">Why Intracoastal</span><h2>Built for tight timelines</h2></div>
    <div class="features">
      <div class="feature"><h3>Same-day &amp; next-day availability</h3><p>Specialty jobs often come with tight timelines. We work around yours.</p></div>
      <div class="feature"><h3>Detailed, thorough work</h3><p>These aren’t maintenance cleans. We treat every specialty job like an inspection is coming.</p></div>
      <div class="feature"><h3>Free estimates</h3><p>For larger jobs, we’ll visit the site and provide a detailed quote before any work begins.</p></div>
      <div class="feature"><h3>Fully insured</h3><p>Protection for you and peace of mind for everyone.</p></div>
      <div class="feature"><h3>Local &amp; responsive</h3><p>Owned and operated in Wilmington. When you reach out, you get us.</p></div>
      <div class="feature"><h3>Coordinated cleanouts</h3><p>We can line up local junk removal for estate and hoarding jobs.</p></div>
    </div>
  </div>
</section>
<section class="section">
  <div class="narrow"><div class="section-head"><span class="eyebrow">FAQ</span><h2>Frequently asked questions</h2></div>${faq(specFaq)}</div>
</section>
${quoteSection()}`,
});

// About
pages['/about'] = layout({
  route: '/about',
  title: 'About Intracoastal Cleaning | Locally Owned in Wilmington, NC',
  description: 'Intracoastal Cleaning is a locally owned Wilmington, NC cleaning company. Organic products for homes, consistent crews for businesses, and a 100% satisfaction guarantee.',
  schema: [breadcrumbSchema([['Home', '/'], ['About', '/about']])],
  body: `
${hero({ image: 'photo-1582836080262-088c42e984c7', alt: 'Wooden pier extending into the ocean', eyebrow: 'About us', title: 'Named after the waterway we call home', text: 'A Wilmington-based team that believes clean spaces shouldn’t come with compromises.' })}
<section class="section">
  <div class="wrap split">
    <div>
      <span class="eyebrow">Our story</span>
      <h2>Would we use it in our own homes?</h2>
      <p>When we started Intracoastal Cleaning, we had to choose what products we’d bring into our customers’ homes. Conventional products get the job done fast and cheap, but we kept coming back to one question—would we want these used around our own families?</p>
      <p>The answer was no. So our residential services use only organic, plant-based products: no bleach, no ammonia, no synthetic fragrances.</p>
      <p>We named the company after the Intracoastal Waterway for a reason. Living on the coast means living connected to the environment, and what we wash down the drain ripples outward into the Cape Fear River and the Atlantic.</p>
    </div>
    <img src="${img('photo-1546387903-6d82d96ccca6', 900, 720)}" alt="Eucalyptus in a glass vase" loading="lazy" width="900" height="720">
  </div>
</section>
<section class="section section-alt">
  <div class="wrap">
    <div class="section-head center"><span class="eyebrow">What you can count on</span><h2>The same care on every job</h2></div>
    <div class="features">
      <div class="feature"><h3>Locally owned</h3><p>We’re based in Wilmington. If something’s not right, you’re talking to the owner—not a call center.</p></div>
      <div class="feature"><h3>Licensed &amp; insured</h3><p>Fully licensed and insured, with background-checked team members.</p></div>
      <div class="feature"><h3>Satisfaction guaranteed</h3><p>Let us know within 24 hours and we’ll come back to fix it—no charge, no hassle.</p></div>
      <div class="feature"><h3>Familiar faces</h3><p>Our cleaners are employees, trained and paid fairly. You’ll see the same crew on recurring visits.</p></div>
      <div class="feature"><h3>Organic for homes</h3><p>Safe around children, pets and people with sensitivities. Biodegradable and septic-safe.</p></div>
      <div class="feature"><h3>Every kind of space</h3><p>Weekly house cleaning, busy offices, post-renovation deep cleans and vacation rental turnovers.</p></div>
    </div>
  </div>
</section>
${ctaBand()}`,
});

// Contact
pages['/contact'] = layout({
  route: '/contact',
  title: 'Get a Free Cleaning Quote | Intracoastal Cleaning | Wilmington, NC',
  description: 'Get a free cleaning estimate for your Wilmington-area home or business. Serving Wilmington, Wrightsville Beach, Leland, and surrounding areas. We usually reply within 24 hours.',
  schema: [breadcrumbSchema([['Home', '/'], ['Contact', '/contact']])],
  body: `
<section class="section" style="padding-top:64px">
  <div class="wrap quote">
    <div class="quote-aside">
      <span class="eyebrow">Contact us</span>
      <h1 style="font-size:clamp(2.2rem,4.6vw,3.2rem)">Let’s get clean.</h1>
      <p class="lede">Tell us a little about your home or business and we’ll follow up with a clear, no-pressure estimate—usually within 24 hours.</p>
      <ul class="checks">
        <li>Free estimates—no obligation</li>
        <li>Residential, commercial and one-time specialty jobs</li>
        <li>Fully licensed, insured &amp; background-checked</li>
        <li>100% satisfaction guarantee</li>
      </ul>
      <div class="contact-lines">
        ${site.phone ? `<div>Call or text: <a href="${telHref(site.phone)}">${site.phone}</a></div>` : ''}
        <div>Email: <a href="mailto:${site.email}">${site.email}</a></div>
        <div style="color:var(--muted)">Serving ${site.areas.slice(0, -1).join(', ')} and ${site.areas.at(-1)}.</div>
      </div>
    </div>
    ${quoteForm()}
  </div>
</section>`,
});

// Blog index + posts
pages['/blog'] = layout({
  route: '/blog',
  title: 'Cleaning Tips & Guides | Intracoastal Cleaning Blog',
  description: 'Cleaning checklists, guides and tips for Wilmington homeowners, renters, vacation rental hosts and businesses from Intracoastal Cleaning.',
  body: `
<section class="section" style="padding-top:64px">
  <div class="wrap">
    <div class="section-head"><span class="eyebrow">Blog</span><h1 style="font-size:clamp(2.2rem,4.6vw,3.2rem)">Cleaning tips &amp; guides</h1><p class="lede">Checklists and practical advice for homes, rentals and businesses on the Cape Fear coast.</p></div>
    <div class="cards">${posts.map(postCard).join('')}</div>
  </div>
</section>
${ctaBand()}`,
});

for (const p of posts) {
  const route = '/blog/' + p.slug;
  const others = posts.filter((x) => x.slug !== p.slug).slice(0, 3);
  pages[route] = layout({
    route,
    title: (p.seoTitle || p.title + ' | Intracoastal Cleaning'),
    description: p.description,
    ogType: 'article',
    ogImage: img(p.image, 1200, 630),
    schema: [
      { '@context': 'https://schema.org', '@type': 'BlogPosting', headline: p.title, description: p.description, datePublished: p.date, dateModified: p.date, image: img(p.image, 1200, 630), mainEntityOfPage: site.url + route, author: { '@type': 'Organization', name: site.name, url: site.url }, publisher: { '@id': site.url + '/#business' } },
      breadcrumbSchema([['Home', '/'], ['Blog', '/blog'], [p.title, route]]),
    ],
    body: `
<article class="section" style="padding-top:56px">
  <div class="narrow">
    <nav class="breadcrumbs" aria-label="Breadcrumb"><a href="/">Home</a> / <a href="/blog">Blog</a></nav>
    <h1 style="font-size:clamp(2rem,4.4vw,3rem)">${esc(p.title)}</h1>
    <p class="post-meta">${fmtDate(p.date)} · Intracoastal Cleaning</p>
    <img class="post-hero" src="${img(p.image, 1400, 700)}" srcset="${img(p.image, 760, 380)} 760w, ${img(p.image, 1400, 700)} 1400w" sizes="(max-width: 800px) 100vw, 760px" alt="${esc(p.imageAlt)}" width="1400" height="700">
    <div class="prose">${md2html(p.md)}</div>
    <div class="post-cta"><div><h3>Want us to handle it?</h3><p style="margin:4px 0 0;color:var(--muted)">Free, no-pressure quotes for homes and businesses across the Cape Fear coast.</p></div><a class="btn btn-primary" href="/contact">Get a free quote</a></div>
  </div>
</article>
<section class="section section-alt"><div class="wrap"><div class="section-head"><h2>More from the blog</h2></div><div class="cards">${others.map(postCard).join('')}</div></div></section>`,
  });
}

// 404
const notFound = layout({
  route: '/404', noindex: true,
  title: 'Page not found | Intracoastal Cleaning',
  description: 'The page you were looking for could not be found.',
  body: `<section class="section"><div class="narrow" style="text-align:center"><span class="eyebrow">404</span><h1>We couldn’t find that page</h1><p class="lede" style="margin-inline:auto">It may have moved. Try one of these instead:</p><p style="display:flex;gap:12px;justify-content:center;flex-wrap:wrap;margin-top:24px"><a class="btn btn-primary" href="/contact">Get a free quote</a><a class="btn btn-ghost" href="/">Home page</a><a class="btn btn-ghost" href="/blog">Blog</a></p></div></section>`,
});
fs.writeFileSync(path.join(DIST, '404.html'), notFound);

for (const [route, html] of Object.entries(pages)) write(route, html);

// sitemap + robots
const today = new Date().toISOString().slice(0, 10);
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${Object.keys(pages).map((r) => { const post = posts.find((p) => '/blog/' + p.slug === r); return `  <url><loc>${site.url}${r === '/' ? '/' : r}</loc><lastmod>${post ? post.date : today}</lastmod></url>`; }).join('\n')}
</urlset>`;
fs.writeFileSync(path.join(DIST, 'sitemap.xml'), sitemap);
fs.writeFileSync(path.join(DIST, 'robots.txt'), `User-agent: *\nAllow: /\n\nSitemap: ${site.url}/sitemap.xml\n`);

console.log(`Built ${Object.keys(pages).length} pages + 404 into ./${DIST}`);
