# WORKLOG — Vikings-GYM-SPA

Running changelog for AI assistants. Read this first (after AGENTS.md).
Append a new entry at the top after each work session, then commit/push so both CLIs stay in sync.

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
