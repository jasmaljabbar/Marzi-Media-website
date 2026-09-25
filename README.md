# Marzi Media

A responsive, build-free agency website made with HTML5, CSS3, and vanilla JavaScript. All fonts and artwork are hosted locally. No framework, npm installation, tracking, or third-party runtime requests.

## Preview

Open `index.html` directly, or run this from the project folder:

```bash
python3 -m http.server 4173
```

Visit http://localhost:4173. The site uses relative asset paths and works at a GitHub Pages repository subpath.

## Contact

Verified by the owner: **+91 95268 96340**, **+91 80758 91492**, and **Ambalavayal, Wayanad**. The primary CTA opens WhatsApp for the first number. Each number also has its own WhatsApp and click-to-call link. These are ordinary HTML links and work without JavaScript. Opening a chat does not send a message automatically.

Update contact links and organization structured data in `index.html` if details change. No email or social profile was supplied, so none is invented. No contact form or backend is needed.

## Deploy to GitHub Pages

1. Create a GitHub repository, for example `marzi-media`. Use a public repository if your plan requires it for Pages.
2. Upload `index.html`, `styles.css`, `script.js`, `.nojekyll`, and the entire `assets` folder to the root of the `main` branch. Keep the font license with its font. Do not upload the original 478 MB portfolio PDF, QA screenshots, or ZIP archives.
3. Open **Settings → Pages**.
4. Under **Build and deployment**, choose **Deploy from a branch**.
5. Choose **main** and **/ (root)**, then **Save**.
6. Wait for the Pages deployment to finish. Visit the URL shown in Settings → Pages, usually `https://YOUR-USERNAME.github.io/marzi-media/`.
7. Check navigation, project previews, mobile layout, and the verified contact links on the published URL.

For an account root site, name the repository `YOUR-USERNAME.github.io`; the public URL then omits the repository segment. A custom domain can be configured in Pages settings later.

Official instructions: https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site

### Optional Git commands

If this folder is not already a Git repository, run `git init -b main` first. Then:

```bash
git add index.html styles.css script.js assets .nojekyll .gitignore README.md BRAND-NOTES.md
git commit -m "feat: add Marzi Media portfolio website"
git remote add origin https://github.com/YOUR-USERNAME/marzi-media.git
git push -u origin main
```

Replace the example repository URL. If an `origin` already exists, check it with `git remote -v` rather than adding it again. Do not overwrite an existing remote or branch without reviewing it.

## Project map

- `index.html` — semantic sections, SEO metadata, structured organization data, project dialog.
- `styles.css` — brand tokens, layout, component styles, responsive breakpoints, reduced-motion rules.
- `script.js` — chapter menu, chapter tracking (rail, rolling wordmark, progress ring), project dialogs, shared scroll scenes, one-time secondary reveals, and the scroll-driven crew rows.
- `assets/` — optimized portfolio artwork, favicon, local Manrope font and SIL Open Font License.
- `BRAND-NOTES.md` — source facts, design decisions, and content limitations.

## Editing

Change colors in the `:root` block in `styles.css`. Project cards live in HTML; their enlarged views are described in the `projects` object in `script.js`. Service descriptions use native `<details>` elements and work without JavaScript. Contact links and location live in `index.html`.

There are no invented testimonials, performance statistics, awards, locations, or project results. Client names are shown as text rather than presented as official logo files. Crew names and roles come from the owner-supplied portrait filenames in `assets/Crew/`. All 12 supplied crew members appear in the photo wall.

## Chapter navigation

The navigation treats the page as five numbered chapters: 01 Our work, 02 What we do, 03 About us, 04 Why Marzi (`#why`), and 05 Let’s talk. The header keeps the Marzi mark and a “Let’s talk” link to `#contact`.

- **Rolling wordmark.** The MARZI MEDIA wordmark beside the mark rolls to the chapter being read (“What we do / CHAPTER 02”) and back to the wordmark at the top of the page. It is decorative (`aria-hidden`); the chapter links carry `aria-current="location"`.
- **Chapter rail (1101 px and wider).** A slim capsule on the left edge lists 01–05. Each number’s line fills orange as its chapter is read; hovering or focusing a number shows its name. The capsule switches to a dark version over the services section and footer. The header tucks away while reading downwards and returns when scrolling up or when keyboard focus enters it.
- **✳ menu button.** In the header on desktop and floating bottom right on smaller screens, within thumb reach. Its orange ring shows reading progress for the whole page.
- **Chapter menu.** A full-screen orange native `<dialog>` with the chapters in large type (rising in sequence), both phone numbers, WhatsApp links and the location. The current chapter is set in the italic serif. Escape or the × closes it and returns focus to the menu button; choosing a chapter closes the menu, scrolls there, and moves keyboard focus to that section.
- Without JavaScript, the rail still works as plain links: vertical on wide screens, a row of chapter chips under the header on smaller ones.

Navigation motion uses transform and opacity only. All chapter state comes from cached section positions inside the single scheduled scroll frame shared with the crew and scroll scenes.

## Crew portraits

The crew wall contains three alternating rows with large “Meet / the / Crew” typography. Names and roles remain visible on the photographs. On every screen size, vertical page scrolling controls the horizontal positions directly: scrolling down advances the rows, scrolling up reverses them, and stopping holds them still. There is no autoplay, timer, inertia, or pause button.

Keyboard focus on a row (or tapping it on touch screens) switches it to a static horizontal list, allowing arrow-key or swipe scrolling. Reduced-motion preference and disabled JavaScript provide static, horizontally scrollable rows so every portrait can be explored at the reader’s pace. Repeated visual groups are hidden from assistive technology.

Each portrait lists `loading="lazy"` before `src`: copies keep attribute order, and a copy that sees `src` first would download immediately. All portraits switch to eager loading once the wall is within one viewport, so none waits for lazy loading while the rows move. Original photos remain in `assets/Crew/`. The website serves smaller WebP versions from `assets/crew-web/`; originals are excluded from the delivery ZIP. To change a portrait, replace its optimized file. Edit names, roles, or row order in the original `.crew-group` blocks in `index.html`; JavaScript creates the extra visual copies needed to fill wide screens automatically. In browsers with `ViewTimeline` (Chromium, Safari 26), each row is a scroll-linked Web Animation that the browser's compositor runs in step with page scrolling, so main-thread work cannot stall it. Other browsers use a fallback that writes one transform per scheduled scroll frame from cached geometry, via the non-inherited `--crew-offset` property, without reading layout. Both paths produce the same positions. The crew stops updating off-screen, and no continuous rendering loop runs.

## Accessibility and performance

- Semantic landmarks, skip link, one H1, meaningful image alternatives, visible keyboard focus.
- Native dialogs support keyboard focus containment and Escape, and make the rest of the page inert. The menu button exposes `aria-haspopup` and `aria-expanded`. Selecting a chapter in the menu transfers focus to its destination. Focus rings stay visible over light, dark and orange sections.
- Reduced-motion preference disables reveals and smooth scrolling. Content and navigation remain readable with JavaScript disabled; project enlargements need JavaScript; all contact links work without it.
- WebP images, fixed image dimensions, lazy-loaded project images, eager hero, local font with `font-display: swap`, deferred scripts.
- No build step, API keys, cookies, or required third-party requests.
- Metadata includes title, description, Open Graph text, Twitter summary metadata, theme color, favicon, and organization structured data. No domain, canonical, or sitemap is fabricated. Add the final canonical URL and a sitemap after choosing the public domain.

## Hero composition

The hero presents three real portfolio disciplines inside a dark navy workspace: Glam Walk website design (PDF page 15), English Debate Club identity (page 11), and e.youth social content (page 7). Browser, brand board, and phone are HTML/CSS layers. Only the Glam Walk screenshot is a new asset: `assets/hero-glam-walk.webp`, 1100 × 527, approximately 43 KB. Existing identity assets are reused. No external stock or generated artwork is required.

Fixed aspect ratios reserve the composition's space. Image dimensions are explicit; the main website image is preloaded. Each layer follows the existing hero scroll progress with smaller travel on mobile. Reduced motion and disabled JavaScript leave a complete static composition. The hero project link goes to selected work, where Saleena Pickles remains intact.

## Motion and UI maintenance

The existing HTML/CSS/vanilla JavaScript architecture remains. No runtime dependencies were added. CSS is grouped by component, followed by responsive and reduced-motion overrides.

- `createScrollScenes` shares the existing scheduled scroll frame with navigation and crew. Geometry is cached and refreshed after resize, font loading, and disclosure changes. An Intersection Observer limits active scenes. No scroll interception or continuous animation loop is used.
- Scene progress controls hero layer separation, project image masks and scale, service-panel arrival and progress rail, about-copy emphasis, reason-card arrival, contact glow/type, and footer arrival. Scrolling backward restores earlier states.
- `data-reveal` remains for secondary entrances such as section headings. Main scroll scenes use their own progress rather than combining two entrance effects on one element.
- Motion tokens (`--ease-out`, `--motion-duration`) live in `:root`. Mobile removes large translations and image curtains, and reduces hero layer travel. Reduced motion disables scroll scenes, entrances, smooth scrolling, decorative hover transforms, and crew movement, including live preference changes.
- The sticky header keeps its original document footprint; the chapter rail, floating menu button and menu overlay the page without shifting sections. `aria-current="location"` identifies the current chapter. Native anchor scrolling retains browser history and respects header clearance.
- Native service disclosures and project dialogs remain the source of their open/closed state. No replacement accordion or modal library is required.

## Validation

Latest hero checks: Chromium layouts at 320, 375, 390, 768, 1024, 1440, and 1920 px; all three hero images loaded; no horizontal overflow at checked positions; all four project dialogs; all eight service toggles; mobile menu Escape and focus return; actual desktop hero scroll reversal; no captured console errors. DOM tests also cover scene reversal, reduced-motion changes, lifecycle cleanup, and missing Intersection Observer.

See `artifacts/SCROLL-HERO-QA.md` for current evidence and limitations. Earlier screenshots and performance numbers in `artifacts/QA.md` describe the previous hero and are historical. QA artifacts and original full-resolution portraits are excluded from the delivery ZIP.
