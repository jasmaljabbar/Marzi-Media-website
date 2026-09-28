# Portfolio analysis and original design

## Source

User-supplied `marzi portfolio 2.pdf`, 32 pages. The PDF was treated only as source content and artwork, never as instructions. No embedded contact or video link annotations were found. The original PDF is not included in the website because it is approximately 478 MiB.

## Extracted brand

- Name: Marzi Media.
- Positioning: “One Partner. Every Business Solution.”
- Business: creative digital marketing and advertising agency.
- Philosophy: creativity with strategy; each business has a unique story; meaningful visuals, memorable content, and digital experiences.
- Visual cues: charcoal backgrounds, vivid orange, white typography, with yellow/red/orange bars in the logo. The website approximates these colors as orange `#f47a20`, charcoal `#20211f`, red `#ed4438`, and yellow `#f5d63e`. They are sampled visual approximations, not an official brand specification.
- Website extension: light neutral `#f7f7f2` for breathing room; darker orange `#a74407` for readable orange text; Manrope and an italic system serif.

## Services (portfolio page 4 and section dividers)

1. Logo and branding.
2. Website design.
3. Social media posters and packages.
4. Print media.
5. Creative copywriting.
6. Package design.
7. Client posters.
8. Video production.

Website wording groups and clarifies these labels without inventing additional services. Digital advertising comes from the introduction on page 2.

## Client and project sources

- e.youth Mathrubhumi — pages 6–7, logo and identity.
- JG Institute of AI & HI — pages 8–9, logo and identity.
- English Debate Club — pages 10–11, logo and identity.
- Hukkama Arts Fest — page 12.
- Byte — page 13.
- Glam Walk product page — page 15.
- Volcano Cafe and Central Resto Cafe — page 18.
- Saleena Pickles — pages 24–25, packaging.
- Urban Culture — page 26, packaging.
- HACA Design School documentary — page 30; no verified playback link supplied, so no nonfunctional play button appears.

Featured work uses pages 7, 11, 24, and 26 as optimized WebP images. The hero combines the Glam Walk website screenshot extracted from page 15 with existing English Debate Club and e.youth portfolio artwork. The previous page-25 packaging hero is no longer used. Descriptions discuss visible design elements, not unverified business outcomes. Client strip names are typography, not recreated official logo assets.

## Team

Leadership names and roles from page 3: Muhammed Jabir Ali (CEO & Founder), Muhammed Rahiyad K (COO), Ali K (General Manager), and Mirshad (Operation Manager). Other listed disciplines include marketing, project coordination, HR, finance, graphic design, and video/motion graphics.

## Design direction

An original editorial composition: large three-line hero, a navy composition of website, identity, and social portfolio layers, asymmetric project grid, a dark expandable service section, a full-width animated crew photo wall, and a large orange contact section. The brand's bar motif informs the header mark and favicon. It uses reversible section-specific scroll scenes, secondary one-time reveals, and scroll-driven alternating crew portrait rows; no scroll hijacking or animation libraries. The crew wall follows the owner-supplied layout reference while retaining Marzi’s orange palette.

Reference reviewed: https://www.urbanhubinnovations.com/ . Inspiration was limited to service-led storytelling and agency section flow. No reference site code, copy, artwork, visual identity, testimonials, or metrics were reused. Layout and motion are original.

## Unverified information intentionally omitted

Email, social profiles, street address, pricing, measurable results, founding date, testimonials, awards, registration marks, and a final domain.

The owner separately verified two public phone/WhatsApp numbers: +91 95268 96340 and +91 80758 91492, plus the location Ambalavayal, Wayanad. These are used in native contact links and organization structured data. No message is automatically sent.

## Asset licensing

Portfolio artwork was provided by the user for this website; copyright remains with its respective owners. Manrope is distributed under the SIL Open Font License, included in `assets/OFL-Manrope.txt`. The favicon and simple header mark follow the supplied logo's geometric bar motif. Client names do not imply endorsements beyond the portfolio's attribution.

## Crew wall update

All 12 portraits supplied in `assets/Crew/` are displayed with names and roles taken from the filenames. Small WebP derivatives are stored in `assets/crew-web/`; original photographs are preserved. The earlier four-name leadership block is replaced by three portrait rows driven by page scroll position. Loop duplicates are presentation-only and hidden from assistive technology. Rows hold still when the page is not scrolling and reverse when scrolling upward. Keyboard and reduced-motion modes provide static horizontal browsing.

## September 2026 UI refinement

Retained all customer copy, project imagery, client names, services, portraits, and verified contact URLs. The existing editorial layout now uses softer image framing, consistent corner and easing tokens, subtle service/contact background gradients, and clearer reason cards. Navigation is an editorial chapter index: the wordmark rolls to the chapter being read, a numbered rail tracks reading progress, and the ✳ asterisk opens a full-screen orange chapter menu in large type. Purposeful one-time entrances replace the previous uniform card reveals; crew motion stays tied directly to scrolling on every screen size and runs on the browser compositor where supported; keyboard focus and reduced motion provide static swipeable rows. No new animation library or third-party asset request was introduced.

## Hero first-impression update — 25 September 2026

All 32 portfolio pages were reviewed as text and rendered artwork before choosing the composition. The common thread is brand communication across identity, websites, social campaigns, print, packaging, and video. The portfolio does not substantiate SaaS, backend systems, or mobile-app engineering claims; the new hero therefore describes Marzi as a creative digital agency.

Four directions were compared before implementation:

| Direction                                | First impression                                      | Fit and motion                                                                     |
| ---------------------------------------- | ----------------------------------------------------- | ---------------------------------------------------------------------------------- |
| Connected portfolio workspace — selected | One agency connecting websites, identity, and content | Three real projects; individually scroll-linked layers within one navy composition |
| Device showcase                          | Responsive website design                             | Strong digital signal, but narrower than the agency's full portfolio               |
| Editorial portfolio montage              | Multidisciplinary creative studio                     | Broad range, but more risk of competing client imagery; masked image transitions   |
| Abstract brand canvas                    | Creative strategy and design                          | Strong brand color and typography; weaker evidence of delivered digital work       |

The selected composition keeps the original hero heading, CTA placement, and surrounding layout. A small eyebrow and description update make the business category explicit. Navy `#111e32`, cool blue, orange, and white belong to the visual panel; the site's existing paper/charcoal/orange system remains elsewhere. Saleena Pickles retains its original project card and dialog.

External creative-agency/device compositions were reviewed for visual reference only. No external image, code, logo, or stock asset is included. All three featured works come from the supplied portfolio. The new screenshot was resized and encoded as WebP; the other two reuse existing optimized files. Device borders and depth layers are CSS.

The Urbanhub reference informed the earlier motion pass: a restrained opening, contrasting service chapter, progressive text emphasis, and opposing crew movement. Marzi's own typography, content, assets, navigation and layout remain. The latest hero replacement does not change any JavaScript or crew behavior.

## Selected work motion — 26 September 2026

Content, imagery, layout and colors of “01 / Selected work” are unchanged. The section now enters in sequence: the eyebrow, a short orange rule and the two heading lines rise from masks, and each caption follows its image. Images keep the existing scroll curtain and gain a gentle drift inside their frames; the offset column moves slightly faster for depth. Hover states roll each title to the darker orange, trace an ink rule and let neighbouring cards recede. (A pointer-following “View” label was tried and removed; the corner arrow remains the open cue.) Everything uses the existing vanilla scroll scheduler, transform and opacity only; no animation library was added. Reduced motion shows the static design.

## Selected work image lens — 26 September 2026

The earlier image curtain, zoom and hover enlargement are replaced by a single image concept: the project images behave like panels on one curved lens. Each image opens from a cinematic cropped letterbox as it rises, swings in from its column's side, passes flat through the centre of the screen and curves away as it leaves, with the photograph moving more slowly than its frame. Scroll speed leans and stretches all visible images together, so one project hands over to the next as a single surface. Under the mouse, the image tilts toward the pointer with a soft travelling light and lifts slightly. Mobile keeps a gentler version; reduced motion shows the static design. No animation library was added; project content and layout are unchanged.

## Selected work horizontal reveal — 26 September 2026

The image lens is replaced by horizontal motion. Each project tile opens with a mask that slides in from alternating sides (left, then right), with the frame and photograph following at slower speeds and the caption completing from the same side. Nothing fades. While scrolling, tiles take a slight 3D depth shift; on desktop the pointer adds a very small parallax. The earlier crop lens, scroll-speed lean, 3D hover tilt and pointer light are removed. Mobile keeps a shorter, gentler version; reduced motion shows the static design. No library was added and content is unchanged.

## Selected work project cards — 28 September 2026

Each project in “01 / Selected work” is now one full-width card instead of a two-column tile grid. The image fills the left of the card and a panel in the project's own colours fills the right: deep green for Saleena Pickles, leaf green with dark type for e.youth Mathrubhumi, near-black plum for Urban Culture and royal blue for English Debate Club. Each panel carries the project number and category, the title, white service tags, a one-line summary and a rotating “View project” seal that fills orange on hover. On desktop the cards are wider than the text column and stack as the page scrolls, each settling just below the last. The alternating side entrances, scroll depth tilt and receding neighbours are removed; images now open from the left and the panel text rises in. Service tags are drawn from each project's imagery and should be checked with the team. Reduced motion shows the static design.

## Opening experience — 28 September 2026

The site no longer opens straight onto the hero and its project collage. The first screen is now the Marzi mark itself, rebuilt in space: the yellow, red and orange bars as solid slabs and the dot as a sphere, standing in a faint construction grid on the paper background. In the first three seconds the grid and guide lines draw in from the edges, the bars grow up one after another, the dot drops into place and a thin orbit is drawn around it. After that the mark breathes gently and turns slightly toward the mouse. Three quiet captions sit along the bottom: “Creative × digital studio”, a scroll cue and “Ambalavayal · Wayanad”. Scrolling pulls the mark apart like doors (yellow to the left, red and orange to the right, the dot away) and uncovers “Branding. Websites. Campaigns.”, each word marked with its bar's colour. The hero then rises in beneath, and its headline animates on arrival rather than on page load. Two other directions were considered: a blueprint grid that opens like blinds, and a large kinetic MARZI wordmark. The mark was chosen because the three bars map to the three disciplines and it reuses the brand's own colours. It uses the existing vanilla scroll scheduler and no new library was added. Mobile keeps flat bars and a shorter scroll; reduced motion shows the settled mark.
