# Marzi Media

The website of Marzi Media, a digital marketing and business solutions agency in Ambalavayal, Wayanad, Kerala. It is a responsive, build-free site made with HTML, CSS and vanilla JavaScript, served by GitHub Pages at https://marzi.thejguniverse.com/ (see `CNAME`). Fonts and images are hosted locally. There is no framework, npm install, tracking, cookies or third-party runtime request.

## Preview

Run this from the project folder, then visit http://localhost:4173:

```bash
python3 -m http.server 4173
```

Use the local server rather than opening the files directly: links to the home page are written as `./` and `../`, which a browser only resolves to `index.html` when a server is running. The local server does not show `404.html` for missing paths; GitHub Pages does.

## Contact details

Verified by the owner: **+91 95268 96340**, **+91 80892 96340**, the email **aiwayanad@gmail.com**, and **Ambalavayal, Wayanad**. The street name **AI Zone** comes from the studio's own posters (`assets/works/`); confirm it with the owner. The posters also show **884 865 4655** and **marzimedia29@gmail.com**, which do not appear on the site. Search engines compare these details across the web, so the site, the posters, social profiles and a Google Business Profile should all use the same ones.

If any detail changes, update it everywhere it appears: the header and contact section of `index.html`, the footers of every page, the FAQ, and the JSON-LD blocks (`index.html` and each service page).

## Project map

- `index.html`: the home page. It follows the 2026 wireframe: hero, client strip, about, services, why Marzi, selected work, crew, FAQ, contact, footer.
- `work.html`: every portfolio project, with links to the matching service pages.
- `services/*.html`: ten service pages.
- `404.html`: the page GitHub Pages shows for any missing URL. Its links and assets are root-relative (`/home.css`) because it can be served at any depth.
- `home.css`: styles for the home, work and 404 pages.
- `styles.css`: styles for the service pages only. Rules that only the old home page used were removed in November 2026. That cut the file from 96 KB to 17 KB, and before-and-after screenshots of all ten pages at three widths were pixel-identical.
- `script.js`: loaded by the home and work pages. It sets the footer year, turns the contact form into a WhatsApp message and moves the crew rows with scroll. Everything works in a simpler form without it.
- `robots.txt`, `sitemap.xml`: crawl rules and the list of the 12 indexable URLs. Update `lastmod` in the sitemap when a page changes meaningfully.
- `assets/`: images, the favicon, `logo.png` (512 × 512, used in structured data and as the Apple touch icon), `og-image.jpg` (1200 × 630 link preview), and the font: `manrope.woff2`, a Latin subset of `manrope.ttf`, with the SIL Open Font License beside it.
- `BRAND-NOTES.md`, `REBRAND-STRATEGY-2026.md`: source facts and brand direction.

## SEO setup

- Every page has a unique title of 60 characters or fewer, a meta description, a canonical URL, Open Graph and Twitter tags with `og-image.jpg`, and `lang="en-IN"`.
- `index.html` carries one JSON-LD graph: `ProfessionalService` (address, phones, languages, the ten services), `WebSite` and `FAQPage`. Service pages carry `Service` and `BreadcrumbList`. `work.html` carries `CollectionPage` and `BreadcrumbList`.
- Service pages have a visible breadcrumb. Their footers link to every service, the work page and the contact section.
- Canonical URLs use the `.html` form for inner pages and `/` for the home page. Keep internal links in that form.

Steps that are outside this repository:

1. In the repository's **Settings › Pages**, tick **Enforce HTTPS**. Until then, the `http://` address also serves the site.
2. Verify the domain in Google Search Console and submit `https://marzi.thejguniverse.com/sitemap.xml`.
3. Create or claim a Google Business Profile with the same name, address and phone number as the site. Then add its link, and any social profiles, to `sameAs` in the `index.html` JSON-LD.
4. If the business moves to its own domain, change `CNAME`, every canonical and `og:` URL, the JSON-LD, `robots.txt` and `sitemap.xml` together.

## Home page details

- **Header.** The logo, a dark pill navigation (Home, About us, Services, Work, Contact) and a red "WhatsApp us" button. Below 860 px the navigation becomes a full-width row under the logo, and a floating WhatsApp button sits in the bottom-right corner. No menu script is needed.
- **Hero.** The brand mark is an inline SVG of three bars and a dot. Its bars grow in on load (CSS transforms only, and off with reduced motion). The H1 is "Digital marketing & business solutions agency in Wayanad", and it is the largest element painted on load.
- **Client strip.** Logos come from the supplied portfolio, in `assets/clients/`. The `-80` files are the ones in use, 80 px tall. Saleena Pickles has no standalone logo, so it is set as type.
- **About.** The orange panel is a collage of six crew portraits (`-240` versions) linking to the crew wall. Replace it with a real team photo when one exists.
- **Services.** Each card's heading link covers the whole card, so each service page is linked with its name as the anchor text.
- **Crew.** There are two static leadership rows, then four rows that move with page scrolling. Where the browser supports `ViewTimeline` the compositor runs the motion; elsewhere one transform per frame is written from cached geometry. Copies of each row are added by `script.js`, hidden from assistive technology and made inert. Keyboard focus, reduced motion and disabled JavaScript give static rows that scroll sideways. The script does no layout work until the wall is within about one and a half screens. To add or change a person, edit the `.crew-group` blocks in `index.html` and add a 640 × 640 WebP to `assets/crew-web/`. The originals stay in `assets/Crew/`.
- **FAQ.** Native `<details>` elements. The questions and answers are repeated in the `FAQPage` JSON-LD, so change both together.
- **Contact form.** There is no backend. On submit, `script.js` opens WhatsApp with the name, phone number, service and message written out, and nothing is sent until the visitor presses send. Without JavaScript, the form still opens a WhatsApp chat with the studio.

## Icons

Icons are SVG symbols in a sprite at the top of each page's `<body>`: `icon-arrow-up-right`, `icon-arrow-down` and `icon-chat` on the home page. Place one with `<svg class="icon" aria-hidden="true"><use href="#icon-arrow-up-right" /></svg>`. It takes the surrounding font size and text colour. Do not type arrows or other symbol characters as icons. Manrope has no glyphs for them, so browsers substitute a system font, which on Apple devices is often the colour emoji font.

## Images

- Serve WebP at the size it is displayed: 640 px wide for full-width images, 400 px for two-up images, with `srcset` and `sizes` so phones download the smaller file.
- Every content image has a descriptive `alt`. Portraits in the moving crew rows use `alt=""` because their caption already names the person.
- Keep filenames as lowercase slugs. Files with spaces or line breaks in their names (the originals in `assets/Crew/` and `assets/works/`) are kept as sources only and are not linked from any page.

## Accessibility and performance

- Semantic landmarks, a skip link, one H1 per page, visible focus rings, and colour contrast of at least 4.5:1 for text. White text sits on the deeper red `#d62e1c`, not the brand red.
- Reduced-motion preference turns off smooth scrolling, the hero entrance and crew motion.
- The font is preloaded, and images have fixed dimensions, so there is no layout shift. Every image below the hero is lazy-loaded.
- Lighthouse (mobile, local server, November 2026): home performance 100, accessibility 100, best practices 100, SEO 100. Total blocking time is 10 ms, down from 1,090 ms with the previous opening animation.

## Deploy to GitHub Pages

The site deploys from the root of the `main` branch. Upload or push `index.html`, `work.html`, `404.html`, `home.css`, `styles.css`, `script.js`, `robots.txt`, `sitemap.xml`, `CNAME`, `.nojekyll`, the `services` folder and the `assets` folder. Do not upload ZIP archives, QA screenshots or the original portfolio PDF.

GitHub's instructions for configuring a publishing source: https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site

## Content rules

There are no invented testimonials, statistics, awards, prices or project results. Service pages for newer divisions say plainly that their images are illustrative rather than completed client work; replace those images with real project photos as work is completed. Crew names and roles come from the owner.
