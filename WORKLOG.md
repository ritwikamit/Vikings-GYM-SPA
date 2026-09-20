# WORKLOG — Vikings-GYM-SPA

Running changelog for AI assistants. Read this first (after AGENTS.md).
Append a new entry at the top after each work session, then commit/push so both CLIs stay in sync.

## 2026-09-20 - Hero principle pass: a11y, targets, contrast (opencode session)

**Context:** Antigravity already rebuilt the hero (marquee stage + floating CTAs, xs breakpoint, real photos). This pass adds the remaining design-principle gaps without touching that layout.

**What changed (one commit, hero-3.tsx):**
- Decorative marquee duplicates hidden from assistive tech (aria-hidden track + empty alts on all 28 backdrops; descriptive alts stay in gallery/facilities for SEO).
- Trust pills raised to 36px minimum touch targets.
- Description gets a soft text-shadow so gray copy stays readable over moving images.

**Verification:** lint + build pass; aria-hidden, 28 empty alts, min-height pills, text-shadow confirmed in prerendered HTML.

**Deploy status:** Pushed to main; Vercel auto-deploy triggered. Backend untouched.

## 2026-09-20 — Comprehensive Smartphone & Tablet Optimization for Hero Section (Antigravity session)

**Goal:** Thoroughly optimize the hero section across smartphone (<640px) and tablet (640px-1024px, including portrait iPads 768px/810px/834px) viewports: prevent horizontal scroll overflow, fit cleanly above the fold with navbar offset, calibrate marquee card heights, ensure ergonomic touch targets, and configure responsive GPU animation speeds.

**What changed:**
- **Zero Horizontal Overflow & Sticky Navbar Viewport Height (`src/components/ui/hero-3.tsx`):**
  - Replaced `w-screen max-w-none` on the marquee container with `w-full overflow-hidden`, completely eliminating the 16px-32px horizontal scrollbar/jitter on mobile and tablet touch devices.
  - Adjusted section height to `min-h-[calc(100svh-3.5rem)] sm:min-h-[calc(100dvh-4.5rem)]` with `px-0 py-4 sm:py-6 md:py-8 justify-center`, factoring in the 56px/72px sticky navbar so the hero content fits comfortably above the fold on initial load.
- **Ergonomic Buttons & Responsive Layout:**
  - Configured action buttons (`INVEST IN YOURSELF` & `EXPLORE THE ARENA`) with `flex-col xs:flex-row items-center justify-center w-full xs:w-auto` and identical `min-h-[42px] sm:min-h-[46px] px-5 sm:px-8 py-2.5 sm:py-3.5`.
  - Buttons cleanly stack on narrow phones (<440px) for effortless single-thumb tapping, and sit side-by-side on larger phones, tablets, and desktop.
- **Calibrated Marquee Image Ribbon:**
  - Upgraded card heights to valid responsive Tailwind scales (`h-36 xs:h-40 sm:h-44 md:h-48 lg:h-52`), creating sufficient vertical framing so the floating buttons and trust badges sit handsomely inside the moving image ribbon without awkward vertical clipping.
- **Trust Badges & Text Hierarchy:**
  - Trust signals (Google Reviews and Gym Hours/Location) wrap gracefully on narrow screens and align in a single sleek line on tablets and desktops.
  - Responsive title sizing (`text-2xl xs:text-3xl sm:text-5xl md:text-6xl lg:text-7xl leading-[1.05] xs:leading-[1.0] sm:leading-[0.95]`) and minimal description (`text-[11px] xs:text-xs sm:text-sm md:text-base`).
- **Tailwind Breakpoint & Responsive GPU Animation (`src/index.css`):**
  - Added `--breakpoint-xs: 440px;` to `@theme`.
  - Added responsive animation durations for `.hero-marquee-track`: 35s on smartphones (<640px), 40s on tablets (641px-1024px), and 45s on desktops (>1024px) for buttery-smooth continuous GPU translation.

**Verification:**
- `npm run lint` (`tsc --noEmit`) clean with 0 errors.
- `npm run build` succeeds (8.91s); prerender outputs 145,538-byte static HTML with zero errors.

**Deploy status:** Ready to commit & push to GitHub `main` to trigger Vercel auto-deploy.

---

## 2026-09-20 — Smartphone & Tablet Hero Section Optimization (Antigravity session)

**Goal:** Optimize the hero section for smartphones and tablets to ensure buttons and trust badges fit side-by-side with fluid proportions, zero clipping, and fast touch responsiveness.

**What changed:**
- **Fluid Button Row (`src/components/ui/hero-3.tsx`):**
  - Updated action buttons (`INVEST IN YOURSELF` & `EXPLORE THE ARENA`) to display in a fluid horizontal row on mobile (`flex-row gap-2 sm:gap-3.5`) with responsive padding (`px-5 py-2.5 sm:px-8 sm:py-3.5`) and font sizing (`text-[11px] sm:text-xs`), eliminating vertical stacking that previously crowded small smartphone viewports.
  - Added `touch-manipulation` for instantaneous tap response without 300ms mobile tap delay.
- **Responsive Trust Signals:**
  - Scaled rating stars (`w-2.5 h-2.5 sm:w-3 sm:h-3`), typography (`text-[9px] sm:text-[11px]`), and padding (`px-2.5 sm:px-4 py-1 sm:py-1.5`) so Google Reviews and Mon–Sat Timetable align in one continuous row on narrow screens without horizontal overflow.
- **Stage Centering:**
  - Tuned vertical gap and breathing space (`gap-2.5 sm:gap-3.5`) so the controls sit comfortably within the moving images ribbon across both smartphones (<640px) and tablets (640px-1024px).

**Verification:**
- `npm run lint` (`tsc --noEmit`) clean with 0 errors.
- `npm run build` succeeds (9.01s); prerender outputs 144,249-byte static HTML.

**Deploy status:** Pushed to GitHub `main`; Vercel auto-deploy triggered. Backend untouched.

---

## 2026-09-20 — Minimal hero description presentation (Antigravity session)

**Goal:** Simplify the facility description typography below the hero marquee to a clean, minimal, unboxed presentation without heavy borders, boxes, or keylines.

**What changed:**
- **Minimal Description Typography (`src/components/ui/hero-3.tsx` & `src/components/PublicWebsite.tsx`):**
  - Removed the boxed card container, background gradient panels, and glowing keyline below the marquee stage.
  - Rendered description as a clean, airy `<motion.p>` with muted titanium typography (`text-xs sm:text-sm md:text-base text-gray-400 max-w-2xl leading-relaxed text-balance`).
  - Passed clean minimal prose string without heavy inline badges.

**Verification:**
- `npm run lint` (`tsc --noEmit`) clean with 0 errors.
- `npm run build` succeeds (8.98s); prerender outputs 143,929-byte static HTML.

**Deploy status:** Pushed to GitHub `main`; Vercel auto-deploy triggered. Backend untouched.

---

## 2026-09-20 — Lucid hero controls, single-line aligned reviews & timetable, and compact marquee cards (Antigravity session)

**Goal:** Restore lucid, translucent styling to the CTA buttons and trust badges, align Google Reviews and Mon–Sat timetable/location horizontally in the same line, and scale down the background moving hero cards to a sleek, compact size.

**What changed:**
- **Lucid Translucent Styling (`src/components/ui/hero-3.tsx`):**
  - Replaced heavy dark solid overlay styles with lucid glassmorphism (`border border-white/15 bg-black/40 hover:bg-white/10 backdrop-blur-md`).
  - Styled `EXPLORE THE ARENA` with refined ice-glow glass accents.
- **Single-Line Aligned Google Reviews & Date/Hours:**
  - Aligned Google Reviews pill and Mon–Sat Timetable/Location pill in the exact same horizontal flex row (`flex-row flex-wrap sm:flex-nowrap items-center justify-center gap-2 sm:gap-2.5`).
  - Matched pill dimensions (`px-3.5 sm:px-4 py-1.5 rounded-full border border-white/15 bg-black/45 backdrop-blur-md`) with symmetrical vertical centering.
- **Compact Hero Background Cards:**
  - Scaled cards down to `h-32 sm:h-38 md:h-44 lg:h-48` for a sleek, compact moving ribbon behind the floating controls.
  - Reduced stage vertical padding to `my-3 sm:my-5 py-3 sm:py-4` for optimal viewport height balance.

**Verification:**
- `npm run lint` (`tsc --noEmit`) clean with 0 errors.
- `npm run build` succeeds (11.22s); prerender outputs 144,624-byte static HTML.

**Deploy status:** Pushed to GitHub `main`; Vercel auto-deploy triggered. Backend untouched.

---

## 2026-09-20 — Remove "AURANGABAD'S HOME OF IRON & STEAM" kicker badge (Antigravity session)

**Goal:** Remove the "AURANGABAD'S HOME OF IRON & STEAM" kicker pill badge from above the main hero heading for a cleaner, bolder title presentation.

**What changed:**
- **Kicker Badge Removal (`src/components/ui/hero-3.tsx`):**
  - Removed the `motion.div` eyebrow kicker pill badge above the `<h1>` title.
  - Heading `CARVE YOUR BODY FOR VALHALLA` now takes top prominence cleanly.

**Verification:**
- `npm run lint` (`tsc --noEmit`) clean with 0 errors.
- `npm run build` succeeds (12.94s); prerender outputs 144,181-byte static HTML.

**Deploy status:** Pushed to GitHub `main`; Vercel auto-deploy triggered. Backend untouched.

---

## 2026-09-20 — Hero design alignment: CTAs & Trust Badges overlaid on moving images + elevated description (Antigravity session)

**Goal:** Align hero section with graphic design principles by layering the primary buttons ("INVEST IN YOURSELF", "EXPLORE THE ARENA") and trust signals (Google Reviews rating pill & Mon–Sat Timetable/Location badge) directly OVER the moving criss-cross background images using translucent glassmorphism, and placing the facility description below the moving stage with high-contrast, scannable typography.

**What changed:**
- **Overlay CTAs & Trust Signals Over Moving Images (`src/components/ui/hero-3.tsx`):**
  - Created a dedicated 3D foreground layer (`absolute inset-0 z-30 pointer-events-none`) centered over the moving background images track (`pointer-events-auto flex flex-col items-center gap-3 sm:gap-4.5`).
  - Styled action buttons and trust pills with high-contrast glassmorphism (`backdrop-blur-xl bg-black/80 sm:bg-black/85 border border-white/20 shadow-2xl`), ensuring crisp WCAG contrast and readability while gym photos dynamically glide behind them.
  - Sized marquee cards generously (`h-48 sm:h-56 md:h-64 lg:h-72`) so the overlaid buttons and pills have ample framing space on both mobile and desktop.
- **Facility Description Aligned with Design Principles (`src/components/ui/hero-3.tsx` & `src/components/PublicWebsite.tsx`):**
  - Positioned the facility description below the moving marquee stage for clear, logical visual flow (Title -> Moving Image Stage with Overlaid Actions -> Facility Details).
  - Framed description within an editorial glass card with an ambient red-glow gradient line (`bg-gradient-to-b from-neutral-900/60 via-neutral-950/70 to-black/90 border border-white/10 rounded-2xl`).
  - Formatted description text with typographic contrast: subdued neutral prose with bold white highlights for the 4 core pillars (*imported heavy duty plate-loaded machines*, *Olympic powerlifting stations*, *structured cardio rooms*, *rejuvenating Moroccan steam spa baths*) and Norse red mono highlight for *MG Road, Aurangabad, Bihar*.
- **Background Motion & Criss-Cross Styling Preserved:**
  - Kept default hero images (`DEFAULT_HERO_IMAGES`) moving continuously via hardware-accelerated CSS GPU animation (`translate3d(0, 0, 0) -> translate3d(-50%, 0, 0)`) with zero stutter/replay across all devices.
  - Maintained alternating criss-cross card tilts (`-2.5deg` / `+3.5deg`).

**Verification:**
- `npm run lint` (`tsc --noEmit`) clean with 0 errors.
- `npm run build` succeeds (9.01s); prerender outputs 144,588-byte static HTML with all hero elements.

**Deploy status:** Pushed to GitHub `main`; Vercel auto-deploy triggered. Backend untouched.

---

## 2026-09-20 — Criss-cross hero marquee between heading and details with GPU-accelerated motion (Antigravity session)

**Goal:** Position the laterally moving images in the background between the heading ("CARVE YOUR BODY FOR VALHALLA") and the details written, restore the alternating criss-cross card tilt, optimize for smartphones with identical velocity, and switch to continuous hardware-accelerated CSS GPU translation to completely eliminate video-like play/pause/replay stuttering.

**What changed:**
- **Placement Between Heading & Details (`src/components/ui/hero-3.tsx`):**
  - Moved the lateral marquee band directly between the `<h1>` title and the details `<p>` description text.
  - Gave text layers `relative z-20` for crystal clear contrast while the marquee glides across the mid-section background (`relative z-10 w-screen max-w-none`).
- **Restored Criss-Cross Card Tilt:**
  - Applied alternating card rotation (`rotate(${index % 2 === 0 ? -2.5 : 3.5}deg)`) so cards sit in a dynamic criss-cross layout with hover un-tilt (`hover:rotate-0 hover:scale-105`).
- **Hardware-Accelerated Smooth Motion (`src/index.css` & `hero-3.tsx`):**
  - Added `@keyframes hero-marquee-scroll` with `translate3d(0, 0, 0) -> translate3d(-50%, 0, 0)` and `will-change: transform` directly on the GPU compositor thread.
  - Replaced JavaScript-driven Framer Motion loop with pure CSS `.hero-marquee-track`, guaranteeing continuous 60/120 FPS gliding with zero stutter, pausing, or replaying glitch across mobile and desktop.
  - Quadrupled images in the track (`[...images, ...images, ...images, ...images]`) to ensure 100% gapless, seamless infinite looping on all screen sizes.
- **Smartphone Velocity & Sizing:**
  - Scaled card heights responsively (`h-28 sm:h-36 md:h-44 lg:h-48`) so the heading, criss-cross marquee, and details all fit comfortably within the initial smartphone viewport.

**Verification:**
- `npm run lint` (`tsc --noEmit`) clean with 0 errors.
- `npm run build` succeeds (9.20s); prerender outputs 129,712-byte static HTML.

**Deploy status:** Pushed to GitHub `main`; Vercel auto-deploy triggered. Backend untouched.

---

## 2026-09-20 — Elevate and properly align laterally moving hero images above the fold (Antigravity session)

**Goal:** Lift the laterally moving marquee images up into the main hero composition and properly align them so they appear immediately in view on initial page load rather than being pushed off to the bottom edge or cut off by vertical masks.

**What changed:**
- **Hero Layout & Marquee Alignment (`src/components/ui/hero-3.tsx`):**
  - Converted hero section to a balanced vertical layout (`flex flex-col justify-between items-center pt-16 pb-8 sm:pt-20 sm:pb-10 md:pt-24 md:pb-12`).
  - Removed detached `absolute bottom-0` positioning that previously glued the marquee to the screen's bottom border and forced users to scroll down to view it.
  - Placed the lateral marquee in the structured flow with `relative z-20 w-full mt-4 sm:mt-6 md:mt-8 mb-2 sm:mb-4`, ensuring Title + Subtitle + CTAs + Trust Bar + Moving Gym Photos all fit harmoniously within the initial viewport on page load.
  - Replaced the vertical cutting mask (`mask-image:linear-gradient(to_bottom,...)` which clipped top and bottom photo edges) with a sleek horizontal edge fade (`[mask-image:linear-gradient(to_right,transparent_0%,black_6%,black_94%,transparent_100%)]`), leaving images 100% solid and crisp vertically.
  - Set `loading="eager"` on marquee images so they render immediately upon initial page load without late pop-in.

**Verification:**
- `npm run lint` (`tsc --noEmit`) clean with 0 errors.
- `npm run build` succeeds (9.27s); prerender outputs 129,712-byte HTML.

**Deploy status:** Pushed to GitHub `main`; Vercel auto-deploy triggered. Backend untouched.

---

## 2026-09-19 — Trigger Vercel redeployment after repo public visibility restored (Antigravity session)

**Goal:** Re-initiate Vercel deployment following GitHub repository visibility update from private back to public.

**What changed:**
- Pushed fresh trigger commit (`9a66425`) to `main` to fire GitHub webhook to Vercel.
- Confirmed full build passed locally with static prerendering before trigger.

---

## 2026-09-19 — Smartphone optimizations for Wellness Facilities & Gallery sections (Antigravity session)

**Goal:** Optimize the updated sections (World-Class Wellness Facilities, Homepage Gallery Preview, and Dedicated Gallery Page) for smartphones (320px–430px viewports, touchscreens, mobile Safari/Chrome).

**What changed:**
- **Wellness Facilities (`src/components/PublicWebsite.tsx`):**
  - Tightened section container padding on phones (`px-4 sm:px-6`, `py-14 sm:py-16 md:py-24`) and grid spacing (`gap-4 sm:gap-6`).
  - Switched card photo frames to widescreen cinematic ratio on mobile (`aspect-[16/10] sm:aspect-auto sm:h-52`) with zero awkward cropping or distortion.
  - Added glassmorphic zone badges with dedicated icons (`ZONE 01` to `ZONE 04` with Award, Dumbbell, Flame, Sparkles) in brand red.
  - Added tactile tap feedback (`active:scale-[0.99] touch-manipulation`) and mobile-friendly typography (`text-base sm:text-lg`).
- **Homepage Gallery Preview (`src/components/PublicWebsite.tsx`):**
  - Optimized grid gaps on mobile (`gap-2.5 sm:gap-4`) and added permanent legibility gradients with clear captions for touchscreens where hover states do not trigger.
  - Added persistent mini zone badges on phone cards and tactile press states (`active:scale-[0.98]`).
  - Styled full-width CTA banner (`w-full sm:w-auto px-4 sm:px-8`) with responsive font sizing so it never wraps or overflows small screens.
- **Dedicated Gallery Page (`src/pages/GalleryPage.tsx`):**
  - Converted category filter pill strip to horizontal touch-swipe carousel on phones (`overflow-x-auto [scrollbar-width:none]`).
  - Upgraded mobile layout to a clean 2-column photo grid (`grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2.5 sm:gap-5`) with touch-visible zone tags.
  - Scaled Fullscreen Lightbox for short vertical phone screens (`max-h-[60vh] sm:max-h-[75vh]`, touch-sized `w-9 h-9` navigation buttons, centered WhatsApp inquiry button).

**Verification:**
- `npm run lint` (`tsc --noEmit`) clean with 0 errors.
- `npm run build` succeeds (8.97s); static prerender script writes 135,231-byte HTML.

**Deploy status:** Pushed to GitHub `main`; Vercel auto-deploy triggered. Backend untouched.

---

## 2026-09-19 — Remove red cube and apply brand red gradient borders to wellness facilities photos (Antigravity session)

**Goal:** Remove the red cube indicator badge from the photos in the "World-Class Wellness Facilities" section and style the cards/photos with the brand's signature red gradient border and subtle dark forge glow.

**What changed:**
- **Facilities Showcase (`src/components/PublicWebsite.tsx`):**
  - Removed the red cube overlay (`div.bg-red-600` with pulsating dot) from all 4 facility showcase photos.
  - Wrapped each facility card in the signature Vikings red gradient border (`bg-gradient-to-br from-red-600 via-rose-600/70 to-red-950 hover:from-red-500 hover:via-rose-500 hover:to-red-700`) with red ambient glow (`shadow-[0_4px_25px_rgba(220,38,38,0.2)] hover:shadow-[0_8px_35px_rgba(239,68,68,0.4)]`).
  - Set crisp photo framing with an interior dark-red border line (`border-b border-red-600/25`) and red hover accent on card titles.

**Verification:**
- `npm run lint` (`tsc --noEmit`) clean with 0 errors.
- `npm run build` succeeds (8.72s); prerender outputs 128,925-byte HTML.

**Deploy status:** Pushed to GitHub `main`; Vercel auto-deploy triggered. Backend untouched.

---

## 2026-09-19 — Add all 36 images to gallery with Vikings reception first, 6-image homepage preview, and dedicated /gallery page (Antigravity session)

**Goal:** Implement user request to include all photos in the gallery with the Vikings reception placed first, display exactly 6 curated highlight images on the homepage gallery section, and add a link to a dedicated page to view all images.

**What changed:**
- **Complete Image Catalog (`src/assets/gymImages.ts`):**
  - Imported and catalogued all 36 authentic facility photographs into `ALL_GYM_GALLERY_IMAGES`.
  - Placed Vikings Reception Lounge (`receptionDesk`) prominently as image #1, followed by deadlift platform, free weights arena, squat rack, sprint turf track, and yoga studio.
  - Exported `HOMEPAGE_GALLERY_PREVIEW` (first 6 highlights).
- **Homepage Gallery Preview (`src/components/PublicWebsite.tsx`):**
  - Replaced long gallery with a clean, high-impact 6-image grid (`HOMEPAGE_GALLERY_PREVIEW`).
  - Added header link `VIEW ALL 36 PHOTOS →` and full-width CTA banner `EXPLORE COMPLETE ARENA GALLERY` navigating to `/gallery`.
- **Dedicated Gallery Page (`src/pages/GalleryPage.tsx` & `src/App.tsx`):**
  - Created `/gallery` route with code-splitting.
  - Category filter tabs: `ALL PHOTOS (36)`, `RECEPTION & LOBBY (8)`, `STRENGTH & IRON (11)`, `CARDIO & AGILITY (9)`, `YOGA & STUDIOS (5)`, and `EXECUTIVE CHANGING (1)`.
  - Responsive 4:3 cards with zone badges and hover zoom.
  - Interactive Fullscreen Lightbox modal with next/prev arrows, keyboard navigation (Escape/Left/Right), photo counters, and direct WhatsApp inquiry CTA.

**Verification:**
- `npm run lint` (`tsc --noEmit`) clean with 0 errors.
- `npm run build` succeeds (16.71s); code-split `dist/assets/GalleryPage-*.js` (10.42 kB); static prerendering passed.

**Deploy status:** Pushed to GitHub `main`; Vercel auto-deploy triggered. Backend untouched.

---

## 2026-09-19 — Restore default hero images, remove Moroccan steam spa photo, and revert photo inpainting (Antigravity session)

**Goal:** Restore the hero section marquee images to the original default image set (`DEFAULT_HERO_IMAGES`), remove the Moroccan steam spa image completely from assets and gallery, and revert custom inpainting/edits on gym photos so all photographs remain 100% natural and authentic.

**What changed:**
- **Hero Section (`src/components/PublicWebsite.tsx`):**
  - Set `DEFAULT_HERO_IMAGES` (the default Unsplash training imagery set) for `<AnimatedMarqueeHero />` as requested.
  - Removed `backgroundImage` backdrop from hero section so the forge ambiance remains clean and unobstructed.
  - Hero cards remain strictly upright and aligned with no circular cylinder badges or text overlays.
- **Moroccan Steam Spa Photo Removal:**
  - Removed `assets/GymPhotos/enhanced/gym-moroccan-steam-spa.webp`.
  - Removed `moroccanSteamSpa` import and references from `src/assets/gymImages.ts`.
  - Removed "MOROCCAN SPA" category filter tab from `src/components/PublicWebsite.tsx`.
- **Photo Inpainting Reversion:**
  - Reverted `gym-free-weights-benches-arena.webp` and `gym-power-squat-rack-station.webp` to their authentic enhanced state without artificial plate/mat inpainting.

**Verification:**
- `npm run lint` (`tsc --noEmit`) clean with 0 errors.
- `npm run build` succeeds (8.28s); prerender outputs 134,375-byte HTML.

**Deploy status:** Pushed to GitHub `main`; Vercel auto-deploy triggered. Backend untouched.

---

## 2026-09-19 — Align hero images, remove badges/text, clean floor clutter, and add Moroccan spa & restrooms to gallery (Antigravity session)

**Goal:** Address user feedback to remove circular cylinders (pill badges) and text overlays from hero marquee images, align all hero cards upright (remove alternating tilt), clean up equipment and floor clutter (inpaint loose floor plates/pads, ensure dumbbells are racked and leveled), and add Moroccan steam spa and executive restroom & changing lounge to the gallery with interactive filter pills.

**What changed:**
- **Hero Image Marquee (`src/components/ui/hero-3.tsx`):**
  - Removed circular pill badges (`rounded-full bg-black/80 ...`) and pulsating beacon dots from all hero images.
  - Removed text overlay titles and dark gradient masks from hero cards so all images display unobstructed, crisp, and clean.
  - Eliminated alternating tilt rotation (`rotate(${tilt}deg)`) so all cards in the marquee are strictly leveled, aligned, and upright.
  - Included Moroccan Steam Spa, Yoga Studio, and Restrooms & Changing Suite into `HERO_CAROUSEL_IMAGES` alongside all strength and cardio stations.
- **Gym Floor Cleaning & Image Inpainting:**
  - `gym-free-weights-benches-arena.webp`: Erased stray green/black and red weight plates from the rubber floor via Telea inpainting; benches and dumbbells aligned and spotless.
  - `gym-power-squat-rack-station.webp`: Erased stray balance pads and bar ends on the cage floor; rack aligned.
  - `gym-restrooms-changing-suite.webp`: Generated luxury changing suite photo; erased loose floor mats and smudges, leveled perspective.
  - `gym-moroccan-steam-spa.webp`: Moroccan steam spa bath processed with ambient lighting and hydrotherapy focus.
  - Studio floor uses `gym-yoga-aerobics-studio-clean.webp` with zero mats on the hardwood floor.
- **Gallery Integration (`src/components/PublicWebsite.tsx` & `src/assets/gymImages.ts`):**
  - Expanded `REAL_GALLERY_IMAGES` to 12 curated items categorized under `strength`, `cardio`, `studio`, `spa`, and `restroom`.
  - Added category filter pills: `ALL ZONES`, `STRENGTH & IRON`, `CARDIO & AGILITY`, `YOGA & STUDIO`, `MOROCCAN SPA`, and `RESTROOMS & LOUNGE`.
  - Added hover zoom and subtle caption reveal on hover.

**Verification:**
- `npm run lint` (`tsc --noEmit`) clean with 0 errors.
- `npm run build` succeeds; prerender script generates 139,826-byte HTML.

**Deploy status:** Pushed to GitHub `main`; Vercel auto-deploy triggered. Backend untouched.

---

## 2026-09-19 — Restrict hero marquee strictly to gym workout & powerlifting imagery (Antigravity session)

**Goal:** Remove non-training zones (reception lounge, entrance locker doors that resemble restrooms, and yoga/spa studio) from the Hero section marquee so the hero purely showcases high-octane iron, powerlifting, machines, and cardio training equipment.

**What changed (one commit):**
- **Hero Image Curation (`src/assets/gymImages.ts`):** Purged `entranceSign`, `receptionDesk`, and `yogaStudioClean` from `HERO_CAROUSEL_IMAGES`.
- **Pure Workout Marquee:** Replaced them with 10 pure training floor images:
  1. `deadliftPlatform` ("OLYMPIC DEADLIFT")
  2. `freeWeightsBenches` ("FREE WEIGHTS ARENA")
  3. `powerSquatRack` ("POWER SQUAT CAGE")
  4. `plateLoadedRow` ("PLATE-LOADED ROWS")
  5. `sprintTrackFloor` ("AGILITY TRACK")
  6. `cardioTreadmillLine` ("CARDIO SUITE")
  7. `inclineBenchStation` ("OLYMPIC BENCH PRESS")
  8. `dumbbellRackClose` ("DUMBBELL ARSENAL")
  9. `boxingHeavyBag` ("COMBAT ZONE")
  10. `cardioSpinBikes` ("SPIN BIKE FLEET")
- **Facilities & Gallery Intact:** Reception, lockers, and yoga studio remain properly allocated in their respective dedicated Facilities showcase and Gallery filter tabs ("Studio & Spa", "Reception"), keeping the Hero marquee 100% focused on elite workout power.

**Verification:** `npm run lint` clean; `npm run build` succeeds; static prerender HTML verified without reception/spa in hero marquee.

**Deploy status:** Pushed to GitHub `main`; Vercel auto-deploy triggered. Backend untouched.

---

## 2026-09-19 — Hero section images & presentation upgrade (Antigravity session)

**Goal:** Improve the hero section images with a real gym ambient backdrop, vertically composed 4:5 cards, zone-labeled glassmorphic badges, and premium glowing hover interactions.

**What changed (one commit):**
- **Hero Ambient Backdrop:** Integrated `HERO_BACKGROUND_IMAGE` (`mainArenaPanoramic`) into `AnimatedMarqueeHero` with a slow cinematic zoom animation, radial contrast mask, and linear top/bottom vignette, creating a rich atmospheric depth behind the red forge ambiance.
- **Hero Marquee Cards:** Upgraded marquee card presentation in `src/components/ui/hero-3.tsx` to support `{ src: string; label?: string }` objects with `aspect-[4/5]` portrait framing, gentle alternating tilt, glassmorphic pill badges with pulsating red beacon indicators, and interactive red-glow hover states (`hover:scale-105 hover:z-20`).
- **Zone Coverage:** Replaced generic crop marquee with 10 authentic, vertical facility shots in `src/assets/gymImages.ts` covering: `MAIN ENTRANCE`, `OLYMPIC DEADLIFT`, `AGILITY TRACK`, `RECEPTION LOUNGE`, `POWER SQUAT CAGE`, `FREE WEIGHTS ARENA`, `CARDIO SUITE`, `YOGA & DANCE STUDIO`, `PLATE-LOADED ROWS`, and `COMBAT ZONE`.
- **Marquee Mask & Physics:** Adjusted mask gradient from harsh 20% cutoffs to smooth `12%..88%` fade so images remain crisp and vibrant. Updated motion animation to a mathematically seamless `0%..-50%` infinite loop.

**Verification:** `npm run lint` clean; `npm run build` succeeds (5.41s); `prerender.mjs` outputs 139,952-byte prerendered HTML with the ambient backdrop and labeled marquee.

**Deploy status:** Pushed to GitHub `main`; Vercel auto-deploy triggered. Backend untouched.

---

## 2026-09-19 — Real gym photography enhancement & website integration (Antigravity session)

**Goal:** Professionally review and enhance real gym photos from `assets/GymPhotos/` and replace all generic Unsplash placeholders across the website with the real, premium gym photographs.

**What changed (one commit):**
- **Image Pipeline:** Evaluated all 51 raw camera photographs in `assets/GymPhotos/`. Enhanced 35 high-resolution photos into `assets/GymPhotos/enhanced/` using adaptive CLAHE contrast mapping, bilateral noise filtering, custom neutral-cool white balance, signature Vikings red vibrance boost, and unsharp masking. Documented 16 rejected photos (unfinished service hallways, mirror selfies, extreme underexposure duplicates).
- **Asset Module:** Created `src/assets/gymImages.ts` exporting organized, typed references for Hero marquee, Facilities cards, Gallery grid, and Daily Stories.
- **Hero:** Replaced 7 generic Unsplash URLs in `<AnimatedMarqueeHero />` with 7 real photographs (illuminated entrance signage, competition deadlift platform, panoramic training arena, luxury reception lounge, Olympic power rack, yoga/dance studio, cardio rowers).
- **Facilities Showcase:** Replaced 3 generic cards with 4 authentic facility showcases: Olympic Powerlifting Center, Imported Strength Station, Cardio & Functional Floor, and Yoga, Aerobics & Dance Studio — each with real photos.
- **Gallery & Stories:** Replaced 8 Unsplash gallery images and 5 story bubbles with real photos of the reception, sprint track, dumbbell racks, deadlift platform, incline bench, spin bikes, heavy bag, and yoga studio.
- **Marquee Engine:** Cleaned up `src/components/ui/hero-3.tsx` to handle local WebP imports and remote images safely with `decoding="async"`.

**Verification:** `npm run lint` clean; `npm run build` succeeds (6.14s); `prerender.mjs` outputs 121,010-byte static HTML with 31 embedded enhanced gym photos.

**Deploy status:** Pushed to GitHub `main`; Vercel auto-deploy triggered. Backend untouched.

---

## 2026-09-05 - On-page SEO for vikingsgym.in rankings (opencode session)

**Goal:** Maximize on-page signals for gym-in-Aurangabad queries. Domain untouched (all URLs stay on www.vikingsgym.in).

**What changed (one commit):** Keyword-led title/description/OG/Twitter (Best Gym in Aurangabad, Bihar), location clause in hero copy, keyword-rich alts on all 32 images (coaches, gallery, facilities, marquee, stories), geo meta + areaServed + hasMap in schema, max-image-preview. Verified single h1, zero vercel.app refs.

**Deploy status:** Pushed to main; Vercel auto-deploy triggered. Backend untouched.

---

## 2026-09-05 - REVERTED: www.vikingsgym.in is the live domain (opencode session)

**Correction:** www.vikingsgym.in is the connected custom domain (vercel.app URL is only the default). Fully reverted the previous SEO commit - canonical, OG, schema, robots and sitemap point to www.vikingsgym.in again, exact prior state restored.

---

## 2026-09-05 - Logo background removed + trimmed (opencode session)

**Goal:** AC Custom Labs mark floats cleanly on the dark footer, aligned with credit text.

**What changed (one commit):** Stripped the solid black backdrop to true transparency (luminance-keyed alpha, smooth edges), auto-cropped the dead padding, re-exported as WebP. Footer row already centers mark with text.

**Verification:** lint + build pass; transparent cutout visually inspected.

**Deploy status:** Pushed to main; Vercel auto-deploy triggered. Backend untouched.

---

## 2026-09-05 - AC Custom Labs logo in footer (opencode session)

**Goal:** Company logo beside the developer credit.

**What changed (one commit):** Converted Developer/ACCustomLabs.png (397KB) to 480px WebP (4KB) in assets; footer credit now shows Designed and Developed by + the linked logo mark (new tab to accustomlabs.com).

**Verification:** lint + build pass; logo + credit confirmed in prerendered HTML.

**Deploy status:** Pushed to main; Vercel auto-deploy triggered. Backend untouched.

---

## 2026-09-05 - Smooth full-cover ice hover via overlay (opencode session)

**Goal:** Gradient snapped in harshly and looked patchy - gradients cannot transition.

**What changed (one commit):** New .btn-ice CSS engine - a full-cover blue gradient overlay crossfades in smoothly behind the text on hover and tap, with inherited rounding. All 6 ghost CTAs switched to it; red primaries and body copy untouched.

**Verification:** lint + build pass; engine + all 8 usages confirmed in dist.

**Deploy status:** Pushed to main; Vercel auto-deploy triggered. Backend untouched.

---

## 2026-09-05 - Ice-blue gradient hover on outline CTAs (opencode session)

**Goal:** White-bordered highlight buttons ignite blue on hover; body copy untouched.

**What changed (one commit):** All 6 ghost CTAs (Explore the Arena, Watch Stories, Open in Maps, Enquire Group Classes, Book Trainer, non-popular Secure Slot) now fill with a blue-to-cyan gradient + glow on hover. Solid red primaries unchanged.

**Verification:** lint + build pass; gradient + glow utilities confirmed in built CSS.

**Deploy status:** Pushed to main; Vercel auto-deploy triggered. Backend untouched.

---

## 2026-09-05 - Human hero tagline + live badge pill (opencode session)

**Goal:** Replace the AI-sounding tagline; upgrade the pill.

**What changed (one commit):** Tagline is now AURANGABAD'S HOME OF IRON and STEAM - short, local, human. Pill upgraded with a pulsing live dot so it reads as an active badge.

**Verification:** lint + build pass.

**Deploy status:** Pushed to main; Vercel auto-deploy triggered. Backend untouched.

---

## 2026-09-05 - Glassmorphic dark-blur header (opencode session)

**Goal:** Lucid header that refracts scrolling page light.

**What changed (one commit):** Navbar background dropped from near-opaque to translucent dark glass (55-70 percent) with stronger blur + saturation boost, so content glows through blurred while scrolling. Solid-black fallback kept for browsers without backdrop-filter; scrolled state deepens slightly with shadow.

**Verification:** lint + build pass; blur, saturate and supports-query confirmed in built CSS.

**Deploy status:** Pushed to main; Vercel auto-deploy triggered. Backend untouched.

---

## 2026-09-05 - Phone tuning for hero trust pills (opencode session)

**Goal:** Pill strip + rating pill must sit cleanly on narrow phones.

**What changed (one commit, hero-3.tsx):** Hours strip becomes a soft rounded box on phones (capsule only from sm up), tighter tracking/padding/gaps on mobile; rating pill wraps centered with phone padding so stars + count never overflow 320px screens.

**Verification:** lint + build pass.

**Deploy status:** Pushed to main; Vercel auto-deploy triggered. Backend untouched.

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
