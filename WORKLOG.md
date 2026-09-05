# WORKLOG — Vikings-GYM-SPA

Running changelog for AI assistants. Read this first (after AGENTS.md).
Append a new entry at the top after each work session, then commit/push so both CLIs stay in sync.

---

## 2026-09-05 - Cylindrical strip for hours/location line (opencode session)

**Goal:** Outer trust card removed; hours/location gets its own pill strip.

**What changed (one commit, hero-3.tsx):** Trust cluster back to open layout; MON-SAT hours + location now sit in a frosted cylindrical pill (rounded-full, dark blur) so the text stays visible over animations.

**Verification:** lint + build pass.

**Deploy status:** Pushed to main; Vercel auto-deploy triggered. Backend untouched.

---

## 2026-09-05 - Snappier dot field + always-alive idle roam (opencode session)

**Goal:** Field felt laggy and died when the pointer stopped moving.

**What changed (one commit, hero-3.tsx):** Cursor follow tightened (0.12 to 0.28 easing, torch springs stiffened) for near-instant response. After 2.5s idle the hotspot roams on its own so the cloth-press keeps breathing during reads and momentum scrolls. Dots also shimmer gently at all times. Phone canvas resolution capped lower for weaker GPUs.

**Verification:** lint + build pass.

**Deploy status:** Pushed to main; Vercel auto-deploy triggered. Backend untouched.

---

## 2026-09-05 - Lucid readability: trust card + dim-text lift (opencode session)

**Goal:** Hours/location line sometimes washed out over animations; brighten dim texts wherever needed.

**What changed (one commit):** Hero trust cluster (stars + hours + location) now sits in a frosted dark-glass card so it reads over any background; info line lifted to gray-300. Site-wide one-step lift for dim functional micro-texts (mobile strip links, coach taglines, plan periods, BMI scale label, reviews caption, gallery note, footer lines) - hierarchy preserved, nothing restyled.

**Verification:** lint + build pass; trust card + hours line confirmed in prerendered HTML.

**Deploy status:** Pushed to main; Vercel auto-deploy triggered. Backend untouched.

---

## 2026-09-05 - Trainers moved after Facilities, menus re-sequenced (opencode session)

**Goal:** Trainers section sits between Facilities and BMI; every menu follows page order.

**What changed (one commit):** Moved the trainers section block (verified single instance, page order facilities-trainers-calculator-pricing-gallery-review-contact-about in source and live HTML). Desktop nav core is now Facilities-Trainers-Memberships-Gallery-Contact with More holding BMI-Reviews-About; mobile strip, overlay menu, footer links and section tracker all re-sequenced identically.

**Deploy status:** Pushed to main; Vercel auto-deploy triggered. Backend untouched.

---

## 2026-09-05 - AC Custom developer credit in footer (opencode session)

**Goal:** Company signature as site developer (name: AC Custom, domain: accustomlabs.com).

**What changed (one commit):** Subtle second line in the footer bottom bar - Designed and Developed by AC Custom, linked to https://accustomlabs.com in a new tab. Gray tone with red hover, hierarchy preserved.

**Verification:** lint + build pass; credit + link confirmed in prerendered HTML.

**Deploy status:** Pushed to main; Vercel auto-deploy triggered. Backend untouched.

---

## 2026-09-05 - Touch support for background animations (opencode session)

**Goal:** Dot field + torch glow must react on phones/tablets, including while scrolling.

**What changed (one commit, hero-3.tsx):** DotGrid listens to touchstart/touchmove (passive, scroll-safe) and resets on touchend/cancel, so the cloth-press follows the finger in every section. Hero torch glow tracks touch via onTouchStart/onTouchMove. Mouse path unchanged.

**Verification:** lint + build pass; touch listeners confirmed in the built bundle.

**Deploy status:** Pushed to main; Vercel auto-deploy triggered. Backend untouched.

---

## 2026-09-05 - Logo wordmark restored on phones (opencode session)

**Goal:** VIKINGS GYM and SPA text visible beside the logo on smartphones.

**What changed (one commit):** Wordmark stacks in two lines on phones (VIKINGS over red GYM and SPA) and stays single-line on sm+. Header compacted on mobile (tighter padding, gaps, Join button) so everything fits 320px screens.

**Verification:** lint + build pass; stacked wordmark confirmed in prerendered HTML.

**Deploy status:** Pushed to main; Vercel auto-deploy triggered. Backend untouched.

---

## 2026-09-05 - Trainer photo alignment on phones (opencode session)

**Goal:** Faces were cropped by the short mobile photo banner.

**What changed (one commit):** Coach photo frames are now square on phones (aspect-square, matching the square portraits - zero cropping) with object-top face priority as a safety net. Desktop/tablet row layout unchanged.

**Verification:** lint + build pass; 7 square frames + face-priority crops confirmed in prerendered HTML.

**Deploy status:** Pushed to main; Vercel auto-deploy triggered. Backend untouched.

---

## 2026-09-05 - Smartphone-first professionalism pass (opencode session)

**Goal:** Treat phones/tablets as the primary device. Note: no UI skill pack is installed (only the opencode-config skill), so this is a direct mobile-UX pass.

**What changed (one commit):**
- Sticky mobile action bar (below lg): CALL / WHATSAPP / JOIN NOW with safe-area padding; page bottom-spaced for it; back-to-top docked above it on phones.
- No-zoom inputs: all form fields 16px on phones (iOS wont auto-zoom), desktop sizes kept.
- Tiny-screen header: wordmark hides under 400px so logo + Join + burger never overflow; QR card shrinks to fit 320px screens.
- Foundation: viewport-fit=cover, antialiased text, transparent tap highlight.

**Verification:** lint + build pass; bar cells, 16px inputs, safe-area, viewport-fit and generated CSS all confirmed in dist.

**Deploy status:** Pushed to main; Vercel auto-deploy triggered. Backend untouched.

---

## 2026-09-05 - Coaches order: Amit, Bittu, Vaishnavi, Ankit, Ali, Neha, Deepsikha (opencode session)

**Goal:** Requested team sequence on the site.

**What changed (one commit):** Reordered DEFAULT_TRAINERS in PublicWebsite.tsx. Verified order in source and prerendered HTML.

**Deploy status:** Pushed to main; Vercel auto-deploy triggered. Backend untouched.

---

## 2026-09-05 - Cloth-press dot field across the full site (opencode session)

**Goal:** Hover animation everywhere except header/footer.

**What changed (one commit):**
- DotGrid exported from hero-3 and mounted in all 8 content sections (facilities, calculator, pricing, trainers, gallery, review, contact, about). Each section is now relative with content layered above (relative z-10) so dots never cover text. Header, footer and overlays untouched.
- Each canvas runs its own loop but pauses off-screen; coarse-pointer devices use a sparser grid. Removed the dead dot-pattern-1 file.

**Verification:** lint + build pass; 9 canvases confirmed in prerendered HTML (hero + 8 sections).

**Deploy status:** Pushed to main; Vercel auto-deploy triggered. Backend untouched.

---

## 2026-09-05 - Rectangular Explore CTA, phone menu strip, cloth-press dots (opencode session)

**Goal:** Rectangular secondary CTA; menus visible on phones; dots part like weight on cloth; tighter hero on phones.

**What changed (one commit):**
- EXPLORE THE ARENA back to rectangular (kept the glass blur finish, red hover border).
- New mobile quick-link strip under the header (phones only): all 8 sections, swipeable, active-section highlight. Hamburger overlay kept for Franchise + Join.
- DotGrid physics upgraded to cloth-press: dots within 130px are pushed radially outward (up to 16px) while swelling red - like pressing into stretched fabric. Eased follow kept.
- Hero vertical padding reduced on phones (py-20, md:py-28).

**Verification:** lint + build pass; strip links + rectangular CTA confirmed in prerendered HTML (physics is runtime canvas).

**Deploy status:** Pushed to main; Vercel auto-deploy triggered. Backend untouched.

---

## 2026-09-05 - Interactive dot field + title reverted to site tone (opencode session)

**Goal:** Dots expand near the cursor; hero title should match other texts (revert brightening).

**What changed (one commit):**
- **Title reverted:** "FOR VALHALLA" gradient back to red-500/rose-600/red-800; removed the h1 red drop-shadow glow.
- **New DotGrid canvas (src/components/ui/hero-3.tsx):** replaces the static SVG dot pattern. Dots near the cursor swell ~3.5x and ignite red with liquid eased follow; calm white pin-dots elsewhere, edge-faded. Pauses off-screen, coarser grid on touch devices, disabled under reduced-motion, aria-hidden.

**Verification:** lint + build pass; canvas + restored gradient confirmed in prerendered HTML. Also verified via codepoint inspection that all Unicode copy (en-dashes, middots, rupee) is intact in source and dist - earlier odd glyphs were console display artifacts only.

**Deploy status:** Pushed to main; Vercel auto-deploy triggered. Backend untouched.

---

## 2026-09-05 — Interactive hero: cursor torch + parallax, glass Explore CTA (opencode session)

**Goal:** Background reacts to the mouse; EXPLORE THE ARENA matches the Google-reviews pill.

**What changed (one commit, `src/components/ui/hero-3.tsx` only):**
- Cursor-tracked red torch glow follows the mouse with spring smoothing; aurora + ember layers parallax against the cursor. Motion values only (no re-renders), transform/opacity-only, `motion-reduce` respected, calm centered state on touch devices.
- EXPLORE THE ARENA restyled to the glass pill (`rounded-full`, white/5 blur, red border on hover) — same language as the reviews badge.

**Verification:** `npm run lint` + `npm run build` pass; torch + pill confirmed in prerendered HTML (interaction itself is runtime).

**Deploy status:** Pushed to `main`; Vercel auto-deploy triggered. Backend untouched.

---

## 2026-09-05 — Mobile performance optimization (opencode session)

**Goal:** Faster loads on phones/tablets (slower networks, weaker CPUs).

**What changed (one commit):**
- **Code-split portal:** `AuthGateway`, `ResetPassword`, `ERPModules`, `MemberDashboard` now `React.lazy` + themed Suspense fallback. Main JS **1094KB → 564KB** (gzip 318KB → 177KB); ERP (476KB) only downloads on `/erp`.
- **WebP images:** 7 trainer photos (1080px JPG) → 640px WebP + logo PNG → WebP. Images **~1092KB → ~266KB** (−76%). Old JPG/PNG removed from `assets/`.
- **Responsive remote images:** hero marquee serves 480w srcset on phones (was 1470w × 14); story bubbles `w=640 → w=200`; gallery `w=900 → w=600`.
- **Loading hygiene:** trainer photos `loading="lazy" + decoding="async"`; preconnect to Unsplash/QR hosts + dns-prefetch `wa.me` in `index.html`.
- **Cheaper animation:** 8 ember particles on phones (16 on desktop).

**Verification:** `npm run lint` + `npm run build` pass; dist confirms WebP (9 refs), srcset (14), preconnect, lazy attrs.

**Deploy status:** Pushed to `main`; Vercel auto-deploy triggered. Backend untouched.

---

## 2026-09-05 — Hero forge ambiance + social-proof redesign (opencode session)

**Goal:** Animated theme-aligned hero background; fix the weak-looking Google-review text row.

**What changed (one commit):**
- **Background (`src/components/ui/hero-3.tsx`):** three drifting red aurora glows + 16 rising ember particles (deterministic, transform/opacity only) + faint red dot texture with radial mask + readability vignette. All hidden under `prefers-reduced-motion`.
- **Text:** title gets a red drop-shadow glow; "FOR VALHALLA" gradient brightened within the red family (`red-400 → rose-500 → red-600`); description lifted to `gray-300`.
- **Trust row rebuilt:** glassmorphic pill with 5 stars (4 filled per 4.4 rating) + bold white rating + review count, linking to the Google Maps listing; hours/location moved to a brighter icon-led line (Clock/MapPin).

**Verification:** `npm run lint` + `npm run build` pass; prerendered HTML contains pill, stars, gradient; `motion-reduce` CSS confirmed.

**Deploy status:** Pushed to `main`; Vercel auto-deploy triggered. Backend untouched.

---

## 2026-09-05 — Responsive pass for phone + tablet (opencode session)

**Goal:** Make the whole page comfortable on small screens and 768px tablets.

**What changed (same commit):**
- All 8 sections: `py-16` on mobile, `py-24` from `md` up; split-layout gaps `gap-10 → lg:gap-16`.
- Grids gain tablet steps: facilities `1 → sm:2 → lg:3`, plans `1 → sm:2 → lg:4`, gallery `2 → sm:3 → lg:4`, trainers single-column until `lg` (was cramped 2-col at 768px); popular-plan `scale-105` now `lg`-only (no mobile overflow).
- Hero: `text-4xl → sm:6xl → md:7xl`, full-width stacked CTAs on phones, wrapping tagline pill.
- Touch/polish: stories strip snap-scroll, shorter map on phones, roomier franchise modal (stacked fields), compact cards/modal padding on mobile, smaller nav logo/type on phones, 2-col footer from `sm`.

**Verification:** `npm run lint` + `npm run build` pass; responsive classes confirmed in output.

---

## 2026-09-05 — Hero enhancement + lucid site-wide headers (opencode session)

**Goal:** Richer hero and a consistent, minimal ("lucid") rhythm across the whole site. Theme untouched.

**What changed (one commit):**
- **Hero (`src/components/ui/hero-3.tsx`):** dual CTA (INVEST IN YOURSELF + ghost EXPLORE THE ARENA scrolling to facilities); trust-signals row (4.4★ · 27 Google reviews / Mon–Sat hours / MG Road); calmer type scale (`base` on mobile); `min-h-svh` + breathing padding instead of fixed `h-screen`; CTA restyled to match site buttons; marquee images lazy-load.
- **Shared `SectionHeader`** (`PublicWebsite.tsx`): one kicker + title + red-rule (+ optional desc) component now used by Facilities, Pricing, Trainers, Gallery — identical rhythm everywhere. Also fixed the "MEET YOUR master COACHES" casing and dropped the pulsing divider.

**Verification:** `npm run lint` + `npm run build` pass; prerendered HTML contains new CTAs, trust row, fixed heading.

**Deploy status:** Pushed to `main`; Vercel auto-deploy triggered. Backend untouched.

---

## 2026-09-05 — Minimal lucid navbar: core links + MORE dropdown (opencode session)

**Goal:** Declutter the crowded 9-link navbar; align header; refine JOIN NOW.

**What changed (one commit, `src/components/PublicWebsite.tsx` only):**
- Desktop nav condensed to 4 core links (TRAINERS · MEMBERSHIPS · GALLERY · CONTACT) + a **MORE ▾ dropdown** (About, Facilities, BMI Calculator, Reviews, Franchise) with hover/click open, outside-click + Escape dismiss, active-section dot.
- Lucid link style: smaller mono type, wide tracking, animated red underline (persists on the active section).
- Header realigned: full-width bar with inner `max-w-7xl` container and fixed heights (72px → 56px on scroll) so logo, links and CTA stay perfectly centered.
- JOIN NOW refined: fixed height, wider tracking, red glow on hover, no layout-shifting scale.
- Mobile menu: condensed divided-list style with the core links first and a full-width JOIN NOW CTA at the bottom.

**Verification:** `npm run lint` + `npm run build` pass; prerendered HTML contains new nav structure.

**Deploy status:** Pushed to `main`; Vercel auto-deploy triggered. Backend untouched.

---

## 2026-09-05 — UI/UX enhancement pass, theme untouched (opencode session)

**Goal:** Polish UI/UX while keeping the black/red Vikings theme exactly as-is.

**What changed (one commit):**
- **Fixed silently-broken styles:** `red-650` / `neutral-850` (27 usages) generated zero CSS under Tailwind v4 — registered them in `src/index.css` via `@theme` so dividers, borders, hovers and focus rings now actually render.
- **Global CSS:** smooth anchor scrolling, slim dark scrollbar with red hover, red `:focus-visible` ring, reduced-motion fallback.
- **Navigation:** sticky bar compresses + gains shadow on scroll; active section highlighted in red (desktop + mobile, via IntersectionObserver); added REVIEWS link; logo links to top; aria-labels on icon buttons.
- **Motion:** new `Reveal` wrapper — every section header and content block fades/rises in once on scroll.
- **UX correctness:** map-card "OPEN NOW" badge is now live (Mon–Sat 5AM–10PM IST → shows CURRENTLY CLOSED otherwise); fixed stale Sunday hours in `index.html` SEO schema.
- **Overlays:** body scroll locks + Escape closes the mobile menu and franchise modal.
- **Footer:** 3-column layout (brand + Explore quick links + contact info) with dynamic year.
- **Forms:** labels wired via htmlFor/id, BMI min/max + numeric keyboards, tel keyboards on phone fields.
- **Back-to-top** floating button appears after scrolling.

**Verification:** `npm run lint` + `npm run build` pass; custom shades confirmed in built CSS; 16 balanced Reveal pairs; prerendered HTML verified (all 8 sections, labels, live open badge).

**Deploy status:** Pushed to `main`; Vercel auto-deploy triggered. Backend untouched.

---

## 2026-09-05 — Added Deepsikha (dance), Vaishnavi (ambassador), Neha (female trainer) (opencode session)

**Goal:** Add 3 new team members from `Trainers/` photos + Instagram profiles.

**What changed (one commit):**
- Copied `Trainers/Deepsikha.jpg`, `Trainers/Neha Singh.jpg`, `Trainers/Vaishnavi Singh.jpg` → `assets/trainers/` (`deepsikha.jpg`, `neha-singh.jpg`, `vaishnavi-singh.jpg`).
- Added `photoUrl` + full profile entries to `DEFAULT_TRAINERS` after Ali: Deepsikha (DANCE COACH & CHOREOGRAPHER, @wanderbiharan), Vaishnavi Singh (GYM BRAND AMBASSADOR, @chawal.to.choorma), Neha Singh (FEMALE FITNESS TRAINER, @smiley_lily02). Instagram URLs cleaned of tracking query params.
- Two more members pending (1 dance teacher, 1 female trainer) — user will provide later.

**Verification:** `npm run lint` + `npm run build` pass; all 3 photos bundled + present in prerendered HTML.

**Deploy status:** Pushed to `main`; Vercel auto-deploy triggered. Backend untouched.

---

## 2026-09-05 — Trainer photos attached (real coaching team) (opencode session)

**Goal:** Show the actual photos of the coaching team (Ankit Kumar, Bittu Verma, Ali, Amit Singh) that were dropped into `Trainers/`.

**What changed (one commit):**
- Copied `Trainers/*.jpg` → `assets/trainers/` (cleaned filenames: `ankit-kumar.jpg`, `bittu-verma.jpg`, `ali.jpg`, `amit-singh.jpg`) and imported them in `src/components/PublicWebsite.tsx`.
- Added `photoUrl` to each `DEFAULT_TRAINERS` entry so every coach card shows their photo (avatar-initial fallback remains for trainers without a photo).
- Coaches section now always renders `DEFAULT_TRAINERS` (the real team + photos); the `trainersAPI.getAll()` query is kept intact for future backend reconnect.

**Verification:** `npm run lint` + `npm run build` pass; all 4 photos bundled into `dist/assets/` and referenced from the prerendered HTML.

**Deploy status:** Pushed to `main`; Vercel auto-deploy triggered. Backend untouched.

---

## 2026-09-05 — Instagram widget slot ready (Option 1 prep) (opencode session)

**Goal:** Prepare the GALLERY section to display the real `@vikings_fitness` feed/stories via a third-party widget (SnapWidget/LightWidget/Elfsight) the moment the owner provides the embed snippet. Backend untouched.

**What changed (one commit):**
- `src/components/PublicWebsite.tsx` — new `InstagramWidget` component that renders an uploaded widget snippet (re-creates `<script>` tags so script-based embeds run, iframes render as-is). GALLERY section now renders the live widget when `GYM_CONFIG.instagramWidget` is set; placeholder grid is kept as the fallback.
- `src/config/gym.ts` — added `instagramWidget: ""` field.

**How the owner activates it (can't be done from code):**
1. Make `@vikings_fitness` a **public** account (Instagram app → Settings → Privacy → turn off "Private").
2. Create a widget on snapwidget.com (or LightWidget/Elfsight/Curator) for `vikings_fitness` (photo gallery + stories widgets exist).
3. Paste the embed snippet into `instagramWidget` in `src/config/gym.ts` (or send it to a future session) → rebuild/deploy.

**Verification:** `npm run lint` + `npm run build` pass; with empty `instagramWidget` the placeholder gallery still renders.

**Deploy status:** Pushed to `main`; Vercel auto-deploy triggered. Backend intact.

---

## 2026-09-05 — WhatsApp leads, real coaching team + IG, Gallery & Daily Stories section (opencode session)

**Goal:** Static-site conversions: every enquiry/join-now CTA opens a WhatsApp chat; feature the real coaching team with their Instagram profiles; add a gallery + daily-stories section linked to the official `@vikings_fitness` account. Backend untouched.

**What changed (one commit):**
- `src/components/PublicWebsite.tsx`
  - All CTAs now open `https://wa.me/917764922023?text=<prefilled message>` via `openWhatsApp()`: header **JOIN NOW**, hero **INVEST IN YOURSELF**, plan **SECURE SLOT NOW** (message includes plan name/price), **ENQUIRE ABOUT GROUP CLASSES**, **BOOK A PERSONAL TRAINER**, **BEGIN YOUR JOURNEY**.
  - Contact form submit and Franchise form submit now ALSO open WhatsApp with the form details (name/phone/message; franchise proposal details) while keeping the success states.
  - Coaches updated to the real team: **Ankit Kumar** (`@ankitxn_`), **Bittu Verma** (`@get_fit_with_bittu`), **Ali** (`@ali_trainer`), **Amit Singh** (`@amysinghca2018`). Each card shows an Instagram pill + icon linking to their profile. Avatar fallback upgraded to a styled ring-initial when no photo (Instagram blocks anonymous photo scraping — see note below).
  - New **GALLERY & DAILY STORIES** section (`id="gallery"`, added to desktop + mobile nav): a stories strip (gradient-ring bubbles linking to `instagram.com/stories/vikings_fitness`), an 8-image gallery grid, and a follow/Watch-stories CTA. Uses curated Unsplash workout/spa imagery consistent with the existing hero — real IG media can't be embedded without a logged-in account.
- `src/config/gym.ts` — added `instagramStories` + `instagramHandle`.

**Instagram limitation (important):** Instagram blocks all anonymous data access (`?__a=1` → login wall, `i.instagram.com/api/...web_profile_info` → 401 `require_login`). Real profile photos, post media and daily-story frames **cannot be extracted without account credentials/API access**. Implementation uses clean placeholders + direct links to the live profiles. To show real photos later: provide image URLs/files and set each coach's `photoUrl` / replace `GALLERY_IMAGES`.

**Verification:** `npm run lint` + `npm run build` (incl. prerender) pass. Prerendered `dist/index.html` (85 kB) contains `wa.me/917764922023`, all 4 coach names, DAILY STORIES, GALLERY, and 0 PORTAL LOGIN.

**Deploy status:** Pushed to `main`; Vercel auto-deploy triggered. Backend intact.

---

## 2026-09-05 — Static-site frontend hardening: portal login hidden, all CTAs scroll on-page (opencode session)

**Goal:** Convert the public-facing homepage into a clean static gym website. Portal login must not be visible, but code preserved for future backend reconnect. Backend untouched.

**What changed (one commit):**
- `src/components/PublicWebsite.tsx`
  - Hidden **PORTAL LOGIN** buttons (desktop nav + mobile menu) via `PORTAL_ACCESS_ENABLED = false` flag — JSX kept in place, not deleted. Same for `onLoginClick`/`onJoinNow` props (preserved via `portalHandlers`).
  - All CTAs now smooth-scroll on-page instead of routing to the login/register portal: header **JOIN NOW** + hero **INVEST IN YOURSELF** → `#pricing`; plan **SECURE SLOT NOW**, **ENQUIRE ABOUT GROUP CLASSES**, **BOOK A PERSONAL TRAINER**, **BEGIN YOUR JOURNEY** → `#contact` (guest inquiry form).
  - Added `id="contact"` to the location/inquiry section + **CONTACT** link in desktop & mobile nav.
  - Added `DEFAULT_TRAINERS` fallback (Arjun Reddy, Kavita Nair, Rohit Kumar — matching seed data) so the coaches section renders even when the backend API is unreachable; frontend now uses `(trainersData && trainersData.length > 0 ? trainersData : DEFAULT_TRAINERS)`.
  - Fixed a stray `referrerPolicy='no-referrer'` that had been embedded inside a className string (moved to proper prop).
- Backend (`backend/`), `App.tsx` auth routes, `src/api/`, all portal components — **unchanged**. Portal remains reachable only via direct URL; no public entry points.

**Verification:** `npm run lint` clean, `npm run build` + prerender pass (exit 0). Prerendered `dist/index.html` (56 kB) contains **0** "PORTAL LOGIN" occurrences, includes `#contact` nav + trainer fallbacks.

**Deploy status:** Pushed to `main`; Vercel auto-deploy triggered. Backend intact.

---

## 2026-08-19 — Google Search Console SEO: verification, canonical www, SPA prerender (opencode session)

**Goal:** Get the site to show logo + details in Google search results (was showing "No information is available for this page").

**What changed (commits `bb3a7ca`, `dec7718`, `71873a0`, `0e67688` — all pushed to main):**
- `public/google6150f36a1a21fac7.html` (new) — Google Search Console domain verification file.
- Canonicalized everything to `https://www.vikingsgym.in` (Vercel 308-redirects apex → www, which was causing Search Console sitemap "couldn't fetch"): updated `public/sitemap.xml`, `public/robots.txt`, and all URL references in `index.html` (canonical, og:url, og:image, twitter:image, JSON-LD schema).
- Root cause of "No information available": the site is a React SPA — Google received only `<div id="root"></div>` (3.3 kB shell). Added **prerendering**:
  - `scripts/prerender.mjs` (new) — after `vite build`, serves `dist/` locally and renders the homepage in headless Chrome, saving the fully-rendered HTML (now 52.7 kB: logo, hero, phone, address, plans, schema).
  - `package.json` — added `"postbuild": "node scripts/prerender.mjs"` + dev deps `puppeteer`, `@sparticuz/chromium`.
  - Vercel build fix: build env Chrome was missing shared libs (`libnspr4.so`, exit 1) → script now uses `@sparticuz/chromium` (self-contained binary) on non-Windows, system Chrome on Windows. Prerender is best-effort and never fails the build.
- Fixed corrupted em/en dashes in `index.html` meta tags (PowerShell ANSI→UTF-8 mojibake earlier turned `—` into `â€”`); verified with `dist/index.html` and live page.
- Verified live: `https://www.vikingsgym.in/` serves 52,689-byte prerendered HTML with title, logo, phone, address, plan names, HealthClub schema.

**Deploy status:** All deploys green (Vercel status `success`). Backend untouched.

**How to verify (user did):** Search Console → www property → URL Inspection `https://www.vikingsgym.in/` → Request Indexing. Re-crawl takes 1–3 days; result should then show logo + title + description.

**Ongoing SEO (recommended, not done):** Google Business Profile, reviews, on-page keyword pages (pricing/services), backlinks (JustDial etc.), Instagram→site links.

---

## 2026-08-12 — Social login, reset-link fallback, editable member profile (opencode session)

**Commit `767e3f0` pushed to main.** Fixes user-reported issues + new auth features.

**Motivation:** (1) forgot-password email never arrived because SMTP is unconfigured; (2) member dashboard showed `PHONE: Not provided` even though a phone was entered at registration — because `register` created a `User` but no linked `Member`, and phone lived on the User; (3) member profile was read-only.

**What changed:**
- `backend/app/services/member_service.py` (new) — `ensure_member_for_user(user)` creates a linked Member profile (member_id VK-xxx, phone/name/email from User, referral code, QR) if missing.
- `backend/app/routes/auth.py` — register() now calls `ensure_member_for_user` for MEMBER role; forgot-password returns `data.reset_link` when SMTP not configured (on-screen reset link fallback); new `POST /auth/google` (verifies Google ID token via tokeninfo, creates/returns JWT) and `POST /auth/facebook` (verifies via Graph API). New env vars: `GOOGLE_CLIENT_ID`, `FACEBOOK_APP_ID`.
- `backend/app/routes/members.py` — `GET /members/me` and `PUT /members/me` now auto-create the Member profile on demand; MEMBER role can update ONLY their own profile (removed staff-only restriction on update).
- `src/context/AuthContext.tsx` — added `loginWithTokens(data)` for social login sessions.
- `src/components/AuthGateway.tsx` — forgot password now shows the reset link on-screen when SMTP is off; added Google + Facebook sign-in buttons (load GIS + FB SDK), graceful "not configured" message when client IDs are missing.
- `src/components/MemberDashboard.tsx` — profile tab is now EDITABLE: name, phone, gender, DOB, address, blood group, height/weight, fitness goal, emergency contact, medical notes with Edit/Save/Cancel. Phone display falls back to `user?.phone`.
- `src/api/auth.ts` — added `googleLogin`, `facebookLogin`.
- `.env.local` — added `VITE_GOOGLE_CLIENT_ID=`, `VITE_FACEBOOK_APP_ID=` (empty).

**Deploy status:** Pushed → Vercel auto-deploys. Backend needs Render restart to pick up new routes.

**How to verify:** Register a member (phone shows up in profile now). Edit profile + save. Forgot password shows a clickable reset link → /reset-password. Google/Facebook buttons render; they show "not configured" until client IDs are set.

**TODO (user action):** Create OAuth credentials (Google OAuth Client ID, Facebook App ID) and add `GOOGLE_CLIENT_ID`, `FACEBOOK_APP_ID` to Render + `VITE_GOOGLE_CLIENT_ID`, `VITE_FACEBOOK_APP_ID` to Vercel. Optionally add Gmail app password via `MAIL_USERNAME`/`MAIL_PASSWORD` to enable real emails.

---

## 2026-08-12 — Real pricing from old site packages.php (opencode session)

**What changed (commit `7ee8ccd`, pushed to main):**
- Scraped https://app2023.13designstreet.com/vikings_gym/webapp/packages.php for real prices.
- `src/components/PublicWebsite.tsx` — replaced placeholder DEFAULT_PLANS with real gym membership pricing:
  - Monthly with the actual prices you confirmed (₹2,000/30d, ₹4,900/90d, ₹9,000/179d, ₹18,000/365d).
  - Added "Group Classes" card (Zumba, Dance, Yoga — ₹1,500/30 days) and "Personal Training" card (1mo ₹7,000 / 2mo ₹12,000 / 3mo ₹21,000) below the plan grid.
- Verified: `npm run lint` clean, `npm run build` succeeds.

**Deploy status:** Pushed → Vercel auto-deploys. Check pricing + group class/PT sections on https://vikingsgymspa.vercel.app.

**Note:** Backend MembershipPlan data may still differ — public site shows fallback plans only when the plans API returns nothing. Consider syncing these rates into backend seeds/plans later.

---

## 2026-08-12 — Real gym details + About/map/plans fixes (opencode session)

**Context:** Antigravity reverted the Public Website. User then requested Instagram, maps, about-details, plans, reviews, Razorpay, old-site migration, and notifications, and asked opencode to do the quick wins so Antigravity gets only the big builds.

**What changed (commit `d5826d2`, pushed to main):**
- `src/config/gym.ts` — real details: instagram `https://www.instagram.com/vikings_fitness`, phone `077649 22023` / `+917764922023` / WhatsApp `917764922023`, address `Q92C+M8J, MG Rd, Aurangabad, Bihar 824101`, rating 4.4 (27 reviews), hours `Mon–Sat 5 AM – 10 PM · Sunday Closed`, full Google Maps place link + embed URL.
- `src/components/PublicWebsite.tsx` —
  - Added missing `#about` section (nav linked to it but it didn't exist — a blank-page/link bug). Shows rating badge, address, phone/WhatsApp, hours, Hindi name, "Begin your journey" CTA, and embedded Google Map iframe with "GET DIRECTIONS".
  - Pricing section now renders `DEFAULT_PLANS` fallback when the plans API returns nothing — fixes empty memberships grid.
  - Contact section updated to real address/phone/hours (removed fake CIDCO details, fake phone, old timings).
  - Footer social icons now link to Instagram, Google Maps, and `tel:` instead of `#`.
  - Removed unused `Facebook`/`Globe` imports.
- Verified: `npm run lint` (tsc --noEmit) clean, `npm run build` succeeds.

**Deploy status:** Pushed to main → Vercel auto-deploys. Verify at https://vikingsgymspa.vercel.app — About section with map, working Instagram/maps/tel links, pricing may show fallback plans if backend plans are empty.

**Pending (handed to Antigravity via prompt):** Razorpay member payment flow, Reviews section + backend moderation, migrate old-site sections (https://app2023.13designstreet.com/vikings_gym/webapp/index.php + packages/offers/gallery/trainers/reviews/feedback/enquiry/book-pt/group-class), automated notifications (APScheduler + SMTP + in-app). Plan prices in DEFAULT_PLANS are placeholders — confirm with gym owner.

---

## 2026-08-12 — Reverted Public Website changes (Antigravity session)

**What changed:**
- `src/components/PublicWebsite.tsx` — Reverted commit `a675235` upon user request. Restored previous clean Public Website implementation.
- `WORKLOG.md` — Updated with revert documentation.

**Deploy status:** Pushed to GitHub `main` (`https://github.com/ritwikamit/Vikings-GYM-SPA`). Vercel auto-deploys clean state.

**How to verify:** View `https://vikingsgymspa.vercel.app`.

---

## 2026-08-12 — Reverted latest public website changes (Antigravity session)

**What changed:**
- `src/components/PublicWebsite.tsx` — Reverted commit `a16cca2` upon user request. Restored previous clean Public Website implementation.
- `WORKLOG.md` — Updated with revert documentation.

**Deploy status:** Pushed to GitHub `main` (`https://github.com/ritwikamit/Vikings-GYM-SPA`). Vercel auto-deploys clean state.

**How to verify:** View `https://vikingsgymspa.vercel.app`. Website restored to previous stable version.

---

## 2026-08-12 — Built comprehensive Member Dashboard UI (Antigravity session)

**What changed:**
- `src/components/MemberDashboard.tsx` — Created a rich, full-featured member-facing dashboard component with 6 interactive tabs:
  1. **Overview**: Metric cards for active plan, total gym visits, workouts, diet plans, and a digital QR entry pass.
  2. **Attendance**: Detailed attendance log table (date, check-in, check-out, entry method, status).
  3. **Workouts**: Assigned exercise routines with goal badges, descriptions, sets, reps, and target protocols.
  4. **Diet & Nutrition**: Prescribed meal schedules (breakfast, lunch, snacks, dinner) with target calories and macronutrient progress bars (protein, carbs, fats).
  5. **Payments**: Transaction history and invoice receipts table with payment methods (Razorpay/UPI/Cash) and status badges.
  6. **My Profile**: Full personal information, fitness goals, physical metrics (height/weight/blood group), and emergency contact details.
- `src/App.tsx` — Wired `MemberDashboard` into the `/member` route for `UserRole.MEMBER`, updated sidebar navigation item (`My Warrior Console`).

**Deploy status:** Pushed to GitHub `main` (`https://github.com/ritwikamit/Vikings-GYM-SPA`). Vercel auto-deploys frontend.

**How to verify:** Log in on `https://vikingsgymspa.vercel.app/login` with member credentials (or `rahul.d@gmail.com` / `Member@123`). Lands on `/member` showing the full member dashboard with attendance, workouts, diet, payments, and profile tabs.

---

## 2026-08-12 — Added project README with UI screenshots (Antigravity session)

**What changed:**
- `README.md` — Replaced generic starter template with an enterprise-grade README including deployment badges, tech stack breakdown, local setup instructions, default seeded admin credentials, API route reference table, and deployment steps.
- `assets/screenshots/hero_banner.jpg` — High-resolution preview of the dark-mode luxury Gym & Spa Admin Management Dashboard.
- `assets/screenshots/member_portal.jpg` — High-resolution preview of the interactive Member Console UI (digital QR pass, workout plans, and diet tracking).

**Deploy status:** Pushed to GitHub `main` (`https://github.com/ritwikamit/Vikings-GYM-SPA`). Vercel and Render deployments auto-build clean.

**How to verify:** View repository homepage on GitHub: `https://github.com/ritwikamit/Vikings-GYM-SPA`.

---

## 2026-08-12 — Fixed production login/sign-up (opencode session)

**Problem:** Login showed "Invalid credentials provided.", sign-up showed "Network error: Cannot reach the server."

**Root causes (all fixed):**
1. `render.yaml` set env `MONGO_URI` but `config.py` read `MONGODB_URI` → backend couldn't reach Atlas.
2. CORS didn't allow `https://vikingsgymspa.vercel.app` → browser blocked all API responses.
3. `MONGODB_URI` in Render had placeholder `<db_password>` and no database name.
4. Atlas Network Access only allowed two residential IPs, not Render's egress.
5. Deploy crash "Exited with status 1" was fixed by Antigravity CLI: `eventlet 0.39.0` + top-level `eventlet.monkey_patch()` in `run.py` + `setuptools>=68.0.0` in requirements.

**Code changes made (all on `main`):**
- `backend/app/config.py` — accept `MONGODB_URI` or `MONGO_URI`.
- `backend/app/__init__.py` — added `https://vikingsgymspa.vercel.app` to CORS origins.
- `src/components/AuthGateway.tsx` — login now distinguishes network errors from bad credentials.
- `backend/requirements.txt`, `backend/run.py` — eventlet fix (by Antigravity).
- Temp debug endpoint `/api/auth/debug/db` added then removed.

**Dashboard changes (manual, not code):**
- Render `MONGODB_URI = mongodb+srv://ritwik014017_db_user:<pw>@cluster0.elk8qoz.mongodb.net/vikings_erp?retryWrites=true&w=majority` (uses `vikings_erp` DB).
- Atlas Network Access: `0.0.0.0/0` allowed.
- Vercel: `VITE_API_URL=https://vikings-gym-backend.onrender.com/api`.

**Deploy status:** Backend + frontend live and working. Login/sign-up verified (register 201, login 200).

**Production DB users now:** `test@example.com` (MEMBER), `verifytest100@example.com` (MEMBER), `ritwik014017@gmail.com` (SUPER_ADMIN, pw `Admin@123`, created by opencode with user permission).

**How to verify:** `POST https://vikings-gym-backend.onrender.com/api/auth/login` with `ritwik014017@gmail.com` / `Admin@123` → 200 SUPER_ADMIN. Or log in on https://vikingsgymspa.vercel.app → lands on `/erp`.

---

## 2026-08-12 — Repo set up locally (opencode session)

**What was done:**
- Cloned repo, installed Node.js 24 LTS (winget), frontend `npm install`, backend venv + `pip install -r requirements.txt`.
- Installed portable MongoDB 8.3.7 at `C:\mongodb` (MSI failed with 1603; using ZIP + `mongod --dbpath C:\mongodb\data\db`). Local `MONGODB_URI=mongodb://localhost:27017/vikings_gym`.
- Seeded local DB: `$env:PYTHONIOENCODING="utf-8"; python -m seed.seed_data`.

**How to run locally:** see AGENTS.md backend/frontend commands.
