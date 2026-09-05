# WORKLOG — Vikings-GYM-SPA

Running changelog for AI assistants. Read this first (after AGENTS.md).
Append a new entry at the top after each work session, then commit/push so both CLIs stay in sync.

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
