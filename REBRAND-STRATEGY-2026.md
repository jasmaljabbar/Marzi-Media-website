# Marzi Media — brand transformation strategy

9 November 2026. Phase 2 deliverable, per the ten-division transformation brief. This is a strategy document for review and sign-off — no code has been changed as part of it.

## 1. What Phase 1 actually found

### The live site and repo
The deployed site (`marzi.thejguniverse.com`) and this repo are the same thing: a single `index.html`, `styles.css`, `script.js`, no build step, no framework, no backend. It currently documents eight services, all sourced from a 32-page portfolio PDF: logo & branding, website design, social media & campaigns, print media, copywriting, packaging, posters, video production. Four client projects are shown (Saleena Pickles, e.youth Mathrubhumi, Urban Culture, English Debate Club). Thirteen crew portraits (now sixteen, after the November crew update). No social links exist on the live site today.

The project has an explicit, repeated no-fabrication policy written into its own docs: *"There are no invented testimonials, performance statistics, awards, locations, or project results."* That constraint shaped this brief.

### Instagram (@marzi.media)
Public grid, partially visible before Instagram's login wall (did not sign in — that's outside what I'll do on your behalf). Confirmed:
- Bio: *"Digital Marketing • Branding • Media Web • Design • Video • Business Solutions"*, Ambalavayal Wayanad, links to `marzimedia.in` (note: a **second domain**, distinct from `marzi.thejguniverse.com` — worth resolving which is canonical before this ships).
- Profile photo is the same three-bar mark used on the website. Brand is consistent across both surfaces.
- 123 followers, 4 following — an early-stage account, not an established content archive.
- Visible posts: ABL Juice Point (shop reel/photo), Central Resto Cafe (logo card — already a known client per BRAND-NOTES), a Malayalam-language illustrated poster campaign, an Instagram/Facebook promo illustration, relatable/meme-style reels ("when you finish all your work..."), a "content creator wanted" recruitment post, a road-safety poster, a "DESIGNS" service-promo tile in navy/orange.
- Style read: bold flat color blocks, orange/charcoal/navy consistent with the site's existing palette, heavy use of Malayalam copy for local reach, a mix of polished poster design and lower-fidelity reels/memes for engagement.

**This confirms six of your ten divisions with real visual evidence** (Branding & Creative, Digital Marketing, Video & Motion, Web Development, Printing & Signage, Business Digital Solutions in a loose sense). **It shows nothing for the other four** — Software Development, AI & Automation, IT & Networking, Interior Design — on either the portfolio PDF or the visible Instagram grid. You've already agreed to supply real material for those before I build their pages; this brief proceeds on that basis and treats them as **pending, not refused**.

## 2. The honest scope problem

Your brief asks for a "multidisciplinary creative and technology company" positioning. What's documented today is a creative/digital-marketing studio with genuine, good work. Closing that gap is a positioning exercise *and* a proof exercise — the site can say "we do IT & Networking" the moment the copy changes, but it will only be credible the moment there's a real CCTV install photo or a real network diagram next to it. I'd rather ship the repositioning in a sequence that never puts text ahead of evidence than launch all ten divisions on day one with four of them unsupported.

## 3. Positioning

Adopt your framing directly — it's good and it's differentiating:

> **BUILD. BRAND. CREATE. GROW.**
> Marzi Media is where businesses come to build their brand, create their identity, and develop their future.

Three pillars, not ten flat tiles, on the homepage:

| Pillar | Divisions | Evidence today |
|---|---|---|
| **Creative** | Branding & Creative, Digital Marketing, Video & Motion, Printing & Signage | Strong — portfolio PDF + Instagram |
| **Technology** | Web Development, Software Development, AI & Automation, IT & Networking | Web Dev strong; other three pending |
| **Business Spaces & Solutions** | Interior Design, Business Digital Solutions | Pending / partial |

Leading with three pillars (not ten divisions) is also the honest move: it lets Creative carry the page on real work while Technology and Business Spaces grow into their claims as material arrives, without the homepage reading as four strong services and six empty ones side by side.

## 4. Visual direction

**Keep, don't replace:** the existing system is already most of the way to your brief. Charcoal/paper base, orange accent family (`#f47a20`, `#a74407`), red/yellow secondary from the logo bars, Manrope + italic serif pairing, generous whitespace, restrained scroll-linked motion, no animation library, no stock-photo aesthetic. That is luxury-minimalist by construction, not by accident — it was built that way deliberately (see BRAND-NOTES.md). Re-skinning it from scratch would throw away work that already matches the brief and risk the kind of generic-template look you explicitly said to avoid.

**What actually needs to change:**
- **Editorial weight.** Push headline type larger and bolder at the hero and section openers — the brief's "strong editorial typography" is a scale/contrast request more than a typeface request. Manrope stays; its weight range (already loaded) can carry this.
- **Photography-led panels.** The three featured-work panels (Saleena green, e.youth leaf-green, Urban Culture plum, English Debate royal blue) already prove the "large visual composition" direction works here — extend that panel language to the new Branding & Creative feature section in §6, rather than inventing a new card style.
- **Navy as a second ink.** The hero's navy `#111e32` and the Instagram "DESIGNS" post both land on a dark blue-black — this is already a validated secondary tone, not a new color. Use it for the Technology pillar's visual identity so Creative and Technology read as distinct zones without leaving the existing palette.
- **No new motion system.** The scroll-driven crew wall, pinned opening sequence, and project-card reveals already satisfy "smooth, subtle animations." Adding more motion on top risks the "excessive animations" problem you flagged as a thing to avoid.

Net: this is an **elevation**, not a rebuild. The risk in this project is scope creep into a redesign nobody asked for — the existing design language already clears your bar; it needs re-sequencing and depth, not replacement.

## 5. Information architecture reality check

This matters and needs your sign-off before Phase 3 starts: **the site is one HTML file.** There is no router, no templating, no build step, by deliberate original design ("build-free," per README.md). Ten individual service pages means one of:

- **(A) Ten additional static HTML files** (`services/branding.html`, `services/software-development.html`, …), each a plain copy of the shared header/footer/nav markup around unique content. Zero new tooling, fully consistent with "preserve the existing development framework" and "no runtime dependencies." Cost: shared markup (nav, footer, structured data) has to be hand-edited in eleven places when it changes, instead of one.
- **(B) Introduce a minimal static-site build step** (e.g. a tiny include/templating script) so shared chrome lives once. Cheaper to maintain long-term, but it's new tooling on a project whose README currently promises "no build step... no framework," and directly conflicts with "preserve the existing development framework."

**My recommendation is (A).** It's slower to maintain by hand but it changes nothing about how this project works today, and you can always migrate to (B) later without touching content. I'm flagging this rather than deciding it because it's an architectural commitment, not a design one.

## 6. Homepage restructure

Re-sequencing existing sections plus two new ones, not a rebuild:

1. **Hero** — new headline/description per your brief (§6 of your original request). Reuses the existing three-layer navy composition mechanism; swap copy only.
2. **Introduction** — new "More than an agency" section. New copy block, existing typographic treatment.
3. **Services overview** — **new**: three pillar cards (§3 table), each expanding to its divisions. Replaces the flat eight-service list as the primary services entry point.
4. **Featured: Branding & Creative** — **new**: a dedicated showcase for your primary service, reusing the existing project-panel component (§4) with real logo/identity/packaging work already in the portfolio.
5. **Selected work** — existing section, re-tagged by category (Branding & Identity, Graphic Design, Packaging, Digital Marketing, Web & Software, Video & Motion, Interior & Signage) instead of the current flat four-up grid. Categories with no projects yet are simply absent from the filter, not shown empty.
6. **Process** — **new**: Discover → Strategize → Create → Grow, four short panels. New content, matches the existing numbered-reason-card component already used in "Why Marzi."
7. **Why Marzi Media** — existing section, retitled "One Partner. Multiple Possibilities," copy updated to speak to multidisciplinary range once the Technology/Business Spaces pillars have real content to point to.
8. **Creative showcase (Instagram)** — **new**, see §7.
9. **Final CTA** — existing contact section, headline swapped to "Let's Build Something Meaningful."

Crew wall, contact details, WhatsApp links, footer: unchanged.

## 7. Instagram integration — practical approach

A live embedded feed needs the Meta Graph API, a Business/Creator account linked to a Meta App, app review, and a server to refresh long-lived tokens every 60 days. This site has no backend and no build step by design (§5) — bolting on a token-refresh server to show nine thumbnails is a disproportionate amount of new infrastructure, and a static site cannot hold a secret token safely client-side. I won't fake a live feed (you said not to, and static.go API-shaped JSON dressed up as "live" would be exactly that).

**Recommended instead:** a curated creative showcase, manually maintained the same way the existing portfolio is — you pick the posts, I pull the images, optimize them into `assets/` exactly like every other portfolio image on this site, each tile links out to its real Instagram post URL, and the section footer links to the profile with a clear "Follow @marzi.media" CTA. Same editorial quality as the rest of the site, zero new infrastructure, no stale-feed risk, no token to rotate. Updating it later is a five-minute manual edit, same as adding a new crew member.

## 8. What's still needed from you before Phase 3 can start in full

1. **Confirm canonical domain** — `marzi.thejguniverse.com` (current CNAME) or `marzimedia.in` (Instagram bio link)? Affects structured data and any canonical/sitemap work.
2. **Software Development, AI & Automation, IT & Networking, Interior Design** — real project photos, client names (or "confidential client" if needed), and a one-line description each. One real example per division is enough to start its page; more can follow.
3. **5–10 Instagram posts to feature** in the curated showcase (§7) — tell me which ones, or say "your pick" and I'll select from what's publicly visible.
4. **IA decision** — confirm option (A) from §5 (ten plain static HTML pages) unless you want to discuss (B).

## 9. Proposed build sequence (Phase 3, once the above lands)

Ordered so every step ships something real and nothing is built twice:

1. Visual elevation pass (§4) applied across the existing single page — typographic scale, navy as second ink. Lowest risk, immediately visible.
2. Homepage restructure (§6) using only the six already-evidenced divisions — pillars, re-tagged portfolio, process section.
3. Service pages for the six evidenced divisions (§5 option A).
4. Instagram curated showcase (§7) once you've picked posts.
5. Service pages for the four pending divisions, each as soon as its material arrives — doesn't block on the others.
6. Full responsive + accessibility + console/network pass across every new page (matches your existing validation bar in README.md §Validation).

Each step is independently shippable — nothing here requires the whole transformation to land at once before any of it is live.
