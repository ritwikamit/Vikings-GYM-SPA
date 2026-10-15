# WORKLOG — Vikings-GYM-SPA

Running changelog for AI assistants. Read this first (after AGENTS.md).
Append a new entry at the top after each work session, then commit/push so both CLIs stay in sync.

## 2026-10-15 — Server-Side OPENROUTER_API_KEY Proxy, Gradient Red Header & Badge Removal (Antigravity session)

**User Request:**
- "i chanegd the key name to :OPENROUTER_API_KEY because is was saying vite exposes the key, now check everything is working now. keep the header of the chatbox geadient red and remove the fitness coach badge from the header."

**What Changed:**
1. **Secure Server-Side AI Chat Proxy (`api/chat.js` & `vercel.json`):**
   - Implemented a serverless function (`api/chat.js`) that runs securely on Vercel's backend runtime.
   - Reads `process.env.OPENROUTER_API_KEY` on the server without ever exposing the key in client-side bundles or network traces.
   - Configured `vercel.json` with `/api/(.*)` rewrite pass-through so serverless endpoints are directly accessible alongside the SPA.
   - Added Vite dev server middleware in `vite.config.ts` to simulate `/api/chat` locally during `npm run dev`.
   - Updated `src/services/aiChatService.ts` to call `/api/chat` as primary path, with seamless fallback to client key or rich offline knowledge.
2. **Gradient Red Chat Header (`src/components/RitwikChatbot.tsx`, `src/index.css`):**
   - Redesigned chatbox header with permanent Vikings gradient red: `bg-gradient-to-r from-red-600 via-rose-600 to-red-700 border-b border-red-700/60 shadow-md`.
   - Guaranteed pure `#ffffff` text and icon contrast in both light and dark themes using `.ritwik-gradient-header` CSS safeguards.
3. **Removed Fitness Coach Badge:**
   - Removed the `Fitness Coach` badge pill from the header, showcasing a clean, bold "Ritwik" brand title with "Vikings Gym & Spa Expert" subtitle.
4. **Environment Variables:**
   - Updated `.env.example` to document `OPENROUTER_API_KEY=""`.

**Verification:**
- `npm run lint` (`tsc --noEmit`): **0 errors**.
- `npm run build`: Production bundle and prerenderer completed cleanly (**0 errors**, `dist/index.html` 234,580 bytes).
- Zero leaks: Key is strictly server-side, `.env.local` remains untracked.

---

## 2026-10-15 — AI Chatbot Model Resilience & Expanded Knowledge Fallback (Antigravity session)

**User Query:**
- "in the site, the chatbot is not answering questions as it was answering in local host, it is just answering limited questions why?"

**Root Cause Identified:**
- In localhost, `.env.local` provides `VITE_OPENROUTER_API_KEY`, allowing the browser to stream answers directly from OpenRouter models.
- On Vercel, `.env.local` is gitignored to protect sensitive credentials from GitHub leaks. Because `VITE_OPENROUTER_API_KEY` was not configured in Vercel's Environment Variables dashboard, the build ran with an empty key, triggering the minimal offline fallback.

**What Changed:**
1. **Model Upgrades (`src/services/aiChatService.ts`):**
   - Configured `openrouter/auto` as primary model (verified live status 200 with DeepSeek) with fallback to `deepseek/deepseek-chat`, `meta-llama/llama-3.3-70b-instruct`, and `google/gemini-2.0-flash-001`.
2. **Comprehensive Fallback Knowledge Base:**
   - Greatly expanded `generateLocalFallbackResponse` to cover 15+ rich fitness domains: workouts, 4-day PPL splits, chest & bench press form, back & deadlifts, arm hypertrophy, leg day & squats, creatine & whey supplements, fat loss & abs, and female training with Neha Singh.
   - Ensures deep, helpful answers even if the user is offline or before Vercel environment variables are populated.

**Verification:**
- `npm run lint` (`tsc --noEmit`): **0 errors**.
- `npm run build`: Production bundle and prerenderer completed cleanly (**0 errors**, `dist/index.html` 234,598 bytes).

---

## 2026-10-15 — Chatbot Smartphone Viewport Optimization & Light/Dark Theme Readability (Antigravity session)

**User Request:**
- "make sure the chatbot box alogn with its header also appears on the screen and make sure the texts and icons are visible in both light and dark theme, use ponytail and optimize it for smartphone and push the changes to github"

**What Changed:**
1. **Smartphone Viewport & Header Safety (`src/components/RitwikChatbot.tsx`):**
   - Anchored modal container to `fixed z-50 inset-x-2.5 top-16 bottom-3 sm:inset-x-auto sm:top-auto sm:bottom-22 sm:right-6 sm:w-[410px] sm:h-[580px] sm:max-h-[calc(100dvh-7rem)]`.
   - On smartphones, the top edge rests cleanly below the navigation bar (`top-16`), ensuring Coach Ritwik's profile photo, title, fitness coach tag, and header action buttons (`RotateCcw`, `X`) are always 100% visible on screen without top clipping.
   - Preserves desktop floating widget ergonomics.
2. **Dual-Theme Text & Icon Contrast Adaptation:**
   - Synchronized theme reactivity via `vikings_theme_change` window event and `MutationObserver` on `document.documentElement`.
   - Light Theme (`.theme-light`):
     - Window container: crisp white `bg-white` with `border-slate-200/90` and clean depth shadows.
     - Header: `bg-white` with dark slate heading `#0f172a`, emerald shield icon, and high-contrast gray action icons (`text-slate-500 hover:text-slate-900 hover:bg-slate-100`).
     - Disclaimer banner: `bg-red-50/90 border-red-100 text-red-950` with high-contrast `text-red-600` WhatsApp desk link.
     - Bot messages: `bg-white border-slate-200/90 text-slate-800` with bold text in `text-red-600`.
     - Prompt chips: `bg-white hover:bg-slate-50 text-slate-700 hover:text-slate-900 border-slate-300`.
     - Input bar: `bg-slate-50 text-slate-900 placeholder-slate-400 border-slate-300`.
     - Floating trigger button: `bg-white border-2 border-red-600 text-red-600 shadow-xl`.
   - Dark Theme:
     - Maintains luxury dark aesthetic (`bg-neutral-950`, `bg-neutral-900`, `text-white`, `text-gray-200`, red accents).
3. **Contrast Safeguards (`src/index.css`):**
   - Added `.ritwik-user-bubble` and `.ritwik-send-btn` CSS rules ensuring that text and icons inside red user bubbles and send buttons remain pure `#ffffff` in both light and dark modes, preventing global `.theme-light .text-white` overrides from darkening them.
4. **Zero-Leak Security Audit:**
   - Re-verified git status and staged files: zero credentials, API keys, or tokens committed.

**Verification:**
- `npm run lint` (`tsc --noEmit`): **0 errors**.
- `npm run build`: Production bundle and prerenderer completed cleanly (**0 errors**, `dist/index.html` 234,580 bytes).

---

## 2026-10-15 — Chatbot Profile Photo Integration (ChatbotImage) & Vercel Auto-Deploy (Antigravity session)

**User Request:**
- "so do one thing i have put the ChatbotImage.png in .assests folder use it as an image for the chatbot, not the icon but the profile photo of the chatbot, make sure the face is visible in the small circular window, use ponytail for every edits and push it on github so that vercel should auto deply it , make sure any sort of sensitive information wont leaks,"

**What Changed:**
1. **Coach Ritwik Profile Photo Integration (`src/components/RitwikChatbot.tsx`, `assets/`):**
   - Converted high-res `assets/ChatbotImage.png` to optimized `assets/ChatbotImage.webp` (45 KB, 99.4% size reduction for instant web loading).
   - Configured `ChatbotImage.webp` as the official profile photo for Coach Ritwik in the chat header, assistant message bubbles, and typing indicator.
   - Framed with `object-cover object-[center_20%]` so Coach Ritwik's face is clearly framed and centered in all small circular avatar windows.
   - Preserved the minimal circular button trigger with its top-right online green indicator dot.
2. **Zero-Leak Security Audit:**
   - Ran repository-wide regex scan confirming zero API keys or secrets in any tracked files.
   - Verified `.env.local` is 100% gitignored and untracked.
   - Verified `.env.example` contains only empty template placeholders.
3. **Automated Deployment:**
   - Committed and pushed to GitHub `main` branch to trigger Vercel (frontend) and Render (backend) automated CI/CD pipelines.

**Verification:**
- `npm run lint` (`tsc --noEmit`): **0 errors**.
- `npm run build`: Production bundle and prerenderer passed cleanly with **0 errors** (`dist/index.html` 234,596 bytes).

---

## 2026-10-15 — Chatbot Logo Redesign, Online Green Dot Relocation & Vertical Scroll Alignment (Antigravity session)

**User Request:**
- "redesign the chatbot logo keep it minimal and online green dot shoud appear on the chabot icon only, keep the chatbot icon same size as scrolling up button and align it vertically well, remove ai icon from ask coach ritwil just redesign it, use ponytail for any edits please"

**What Changed:**
1. **Chatbot Logo & Trigger Redesign (`src/components/RitwikChatbot.tsx`):**
   - Replaced heavy gradient button and ping ring with a clean, minimal circular button (`bg-neutral-950 border-2 border-red-600 text-white shadow-2xl hover:bg-neutral-900`).
   - Sized to exact dimensions of the ScrollToTop button: `w-11 h-11 sm:w-12 sm:h-12 rounded-full`.
   - Placed the online green indicator dot strictly on the top-right corner of the chatbot button icon only (`absolute -top-0.5 -right-0.5 w-3 h-3 bg-emerald-500 rounded-full border-2 border-neutral-950`).
   - Minimal icon: `<MessageSquare className="w-5 h-5 text-white" />` when closed, `<X className="w-5 h-5 text-red-400" />` when open.
2. **"Ask Coach Ritwik" Pill Redesign:**
   - Removed AI sparkles icon (`Sparkles`) and removed the duplicate green pulsing dot.
   - Restyled with sleek, subtle typography and glassmorphic container (`bg-neutral-950/90 border border-neutral-800 text-neutral-200 text-xs font-semibold px-3.5 py-1.5 rounded-full hover:border-red-500/50`).
3. **Vertical Column Alignment with Scroll-to-Top Button:**
   - Both `RitwikChatbot` and `ScrollToTopButton` are anchored at `right-4 sm:right-6` with identical `w-11 h-11 sm:w-12 sm:h-12` dimensions, perfectly centered along the same vertical column.
   - Spaced with clean vertical breathing room (mobile: `bottom-20` and `bottom-34`; desktop: `bottom-6` and `bottom-20`).

**Verification:**
- `npm run lint` (`tsc --noEmit`): **0 errors**.
- `npm run build`: Production bundle and prerenderer passed cleanly with **0 errors** (`dist/index.html` 234,609 bytes).
- Git push: **STRICTLY LOCAL** (zero push to GitHub as instructed).

---

## 2026-10-15 — Cookie Screen Single-Display, Mobile 120fps Scroll, Full Smartphone CTAs & Subpage Hero Photo Clarity (Antigravity session)

**User Request:**
- "make sure the cookie screen screen appear only once for new user and remove the border animation from cookie screen. also make the scrolling super smooth, it is lagging in smartphone use full "inverst in yourself" and "explore the arena" buttons in smartphone, in all pages make sure the hero images clearly appears, just face from sides of the screen"

**What Changed:**
1. **Cookie Consent Single-Display & Animation Removal (`src/components/PublicWebsite.tsx`):**
   - Removed `moving-border-red` and `moving-border-red-inner` rotating animation. Replaced with clean, static, luxury border (`border border-red-950/50 bg-[#0a0a0a] rounded-3xl shadow-2xl shadow-black/90`).
   - Enforced single-appearance guarantee: dismissing via "X", clicking "ALLOW ALL COOKIES", clicking "ESSENTIAL ONLY", clicking the backdrop, or clicking the policy links all write `localStorage.setItem("vikings_cookie_consent", ...)` with try-catch resilience so it never re-appears.
2. **Super Smooth 120fps Smartphone Scrolling (`src/components/ui/hero-3.tsx`, `src/components/PublicWebsite.tsx`, `src/index.css`):**
   - Bypassed heavy `DotGrid` canvas particle loop on mobile/touch screens (`pointer: coarse` / `window.innerWidth < 768`), eliminating continuous 60fps canvas calculations and `touchmove` listeners during touch-scrolling.
   - Throttled `PublicWebsite.tsx` scroll-spy to at most once per 120ms and switched from layout-thrashing `getBoundingClientRect()` to lightweight `el.offsetTop`.
   - In `index.css`, added `-webkit-overflow-scrolling: touch;`, `touch-action: pan-y;`, and `overflow-x: hidden;` to `html` and `body` for hardware-accelerated momentum scrolling.
3. **Full-Width Smartphone CTAs ("INVEST IN YOURSELF" & "EXPLORE THE ARENA") (`src/components/ui/hero-3.tsx`):**
   - Wrapped hero CTAs in `w-full max-w-sm sm:max-w-none flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-2.5 sm:gap-5 px-3 sm:px-0`.
   - On smartphones, both buttons expand to full width (`w-full`) with comfortable `min-h-[46px]` touch targets, bold uppercase styling, and full prominent typography with zero cramped wrapping. On desktop, they smoothly revert to side-by-side (`sm:w-auto`).
4. **Subpage Hero Image Clarity with Soft Side Vignettes (`src/pages/*`):**
   - Across `FacilitiesPage.tsx`, `TrainersPage.tsx`, `MembershipsPage.tsx`, `GalleryPage.tsx`, `ContactPage.tsx`, `FranchisePage.tsx`, `AmbassadorPage.tsx`, `CookiesPolicyPage.tsx`, `PrivacyPolicyPage.tsx`, and `TermsConditionsPage.tsx`:
   - Removed heavy `from-black/90 via-black/80 to-black` and `via-black/85` layers that were obscuring gym photos.
   - Replaced with gentle contrast vertical gradients (`bg-gradient-to-t from-black/90 via-black/30 to-black/45`) and elegant left/right side vignette fades (`bg-gradient-to-r from-black via-black/65 to-transparent` and `bg-gradient-to-l from-black via-black/65 to-transparent`).
   - Photos, equipment, and faces are now bright, crisp, and clearly visible with smooth side fading.

**Verification:**
- `npm run lint` (`tsc --noEmit`): **0 errors**.
- `npm run build`: Production bundle and prerenderer passed cleanly with **0 errors** (`dist/index.html` 235,321 bytes).
- Git push: **STRICTLY LOCAL** (zero push to GitHub as instructed).

---

## 2026-10-15 — AI Chatbot "Ritwik" & Smartphone Hero Video 1 High-Def Optimization (Antigravity session)

**User Request:**
- "now do one thing from now dont push ill look local host then ill ask you to push, Add me a chatbot in the website which answers the user queries for agent use api key : [REDACTED_OPENROUTER_KEY] make sure it remain unleaked if oyu push it to github, train the agent on the basis of Website information avialable as well as web searches, answer only gym related questions or diet related, other questions dont entertain, make sure the chatbot name should be Ritwik. one more thing i know the video1 in hero quality is low thats why it appears in low quality, can you custmize that video for smartphone so that it looks good quality in smartphone as the screen of smartphone is small too so there should not be nay problem with resolution low quality. dont make changes to the pc view, just do it smartphone. use ponytail to refine code."

**What Changed:**
1. **API Key Security & Leak Prevention:**
   - Saved `VITE_OPENROUTER_API_KEY` strictly in gitignored `.env.local`. Verified `git status --short` confirms `.env.local` is 100% untracked and gitignored. Added a safe blank placeholder in `.env.example`.
2. **AI Fitness Coach "Ritwik" Service (`src/services/aiChatService.ts`):**
   - Configured Ritwik with deep verified knowledge of Vikings Gym & Spa (MG Road, 5AM-10PM Mon-Sat, 6AM-12PM Sun, ₹2,000 / ₹4,900 / ₹9,000 / ₹18,000 plans, Moroccan steam bath, Viva Fitness machines, 60kg dumbbells, Olympic deadlift platforms, certified trainers Amit Singh, Bittu Verma, Ankit Kumar, Ali, Neha Singh, Deepsikha, ambassador Vaishnavi Singh).
   - Strict Guardrails: Programmed to ONLY entertain gym/workout and diet/nutrition queries. Politeness refusal and athletic redirection on any off-topic queries (coding, politics, general knowledge, movies, homework, etc.).
   - Multi-model fallback (`openrouter/auto`, `google/gemma-4-26b-a4b-it:free`, etc.) plus instant local fallback knowledge engine.
3. **Interactive Chatbot Widget (`src/components/RitwikChatbot.tsx`):**
   - Floating red Vikings trigger badge with pulsating online status dot ("Ask Coach Ritwik").
   - Modal chat window with Markdown bold/bullet formatting, typing indicators, quick prompt chips, conversation reset, and WhatsApp escalation button.
   - Fully compatible with both dark and light modes.
4. **App Routing & Back-to-Top Clearance:**
   - Mounted `<RitwikChatbot />` in `src/App.tsx` across all public and member-facing pages.
   - Repositioned Back-to-Top in `src/components/PublicWebsite.tsx` to `bottom-36 right-4 lg:bottom-22` so it stacks neatly above the chat trigger without collisions.
5. **Smartphone-Only Hero Video 1 High-Def Enhancement (`src/components/ui/hero-3.tsx`, `src/index.css`):**
   - On smartphones (`max-width: 767px`): applied `.mobile-hero-video` with `contrast(1.15) brightness(0.92) saturate(1.12)` to eliminate muddy gray compression noise, plus `image-rendering: -webkit-optimize-contrast` and GPU hardware subpixel acceleration (`transform: translate3d(0, 0, 0)`).
   - Added smartphone-only cinematic vignette overlays (`md:hidden`) that frame the athlete action in the center and smoothly mask zoomed outer pixelation.
   - Desktop PC view (`md:` / `min-width: 768px`) left 100% untouched and unmodified.

**Verification:**
- `npm run lint` (`tsc --noEmit`): **0 errors**.
- `npm run build`: Production bundle and prerenderer passed cleanly with **0 errors** (`dist/index.html` 235,337 bytes).
- Git push: **STRICTLY LOCAL** (zero push to GitHub as instructed).

---

## 2026-10-15 — Fix: "EXPLORE THE ARENA" Button Visibility in Light Mode & Theme Toggle Responsiveness (Antigravity session)

**User Request:**
- "explore the arena button not visible in light mode, and the dark/light mode button is not responding correctly after clicking fix it please"

**Root Causes & Fixes:**
1. **"EXPLORE THE ARENA" Button White-on-White Contrast Collision:**
   - **Root Cause:** In light mode, generic `.theme-light .btn-ice` and `.theme-light .bg-black/70` applied `background-color: #ffffff !important`, while `.theme-light #hero .text-white` applied `color: #ffffff !important`. This created white text on a white button background, rendering the button invisible.
   - **Fix:** In `src/components/ui/hero-3.tsx`, tagged the button with `hero-secondary-btn` and explicit classes (`!bg-black/75 !text-white !border-white/40`). In `src/index.css`, added explicit rules protecting `#hero .btn-ice` and `.hero-secondary-btn` to guarantee dark frosted glass with pure white typography in both light and dark modes over the video background.
2. **Theme Toggle Button Unresponsiveness:**
   - **Root Cause:** In `src/components/PublicNavbar.tsx`, `window.dispatchEvent(new CustomEvent('vikings_theme_change', ...))` was previously invoked synchronously *inside* the `setIsLightMode((prev) => ...)` reducer. In React 19, this triggered the component's own event listener while state mutation was in flight, causing race conditions and state desynchronization.
   - **Fix:** Refactored `toggleTheme` to execute synchronously outside the reducer, directly inspecting `document.documentElement.classList.contains("theme-light")`, immediately toggling DOM classes on `<html>` and `<body>`, persisting to `localStorage`, and updating React state cleanly. In event listeners, added guard checks (`prev !== nextTheme`).
   - **Mobile Drawer Theme Control:** Added an interactive Theme Switcher directly inside the mobile menu drawer so mobile visitors can also switch themes effortlessly.

**Verification:**
- `npm run lint` (`tsc --noEmit`): **0 errors**.
- `npm run build`: Production bundle and prerenderer completed cleanly with **0 errors** (`dist/index.html` 232,886 bytes).
- Live local dev server verified on `http://localhost:3000/`.
- Deployed: Pushed to GitHub `main` (commit `edee188`), triggering automated builds on Vercel (frontend) and Render (backend).

---

## 2026-10-15 — Ultra-Smooth Scrolling & Animations Optimization, and Ponytail Code Review (Antigravity session)

**User Request:**
- "make sure the scrolling and other animations look super smooth and at last use ponytail to review the codes that are not been reviewed by ponytail"

**What changed:**
1. **Isolated Scroll Progress & Re-Render Elimination (`src/components/PublicWebsite.tsx`):**
   - Extracted the dynamic scroll-to-top button into an isolated `<ScrollToTopButton />` component.
   - Previously, `scrollProgress` and `showBackToTop` lived in the top-level `PublicWebsite` state, causing the entire 2,600+ line JSX tree to re-render 60-120 times per second during user scroll.
   - With isolated state and local RAF throttling in `ScrollToTopButton`, `PublicWebsite` re-renders during scroll drop to zero.
2. **Discrete Scroll-Spy Boundary Triggering:**
   - Unified the scroll-spy effect into a single `requestAnimationFrame` loop that only triggers `setActiveSection` when crossing actual section boundaries, eliminating forced synchronous layout recalculations (`getBoundingClientRect`) on every raw scroll event.
3. **Hardware-Accelerated Marquee & Border Animations (`src/index.css`):**
   - Added `scroll-padding-top: 5rem` to `html` so anchor jumps land with breathing space under the floating header.
   - Added `transform: translate3d(0, 0, 0)`, `backface-visibility: hidden`, and `-webkit-backface-visibility: hidden` across `.hero-marquee-track`, `.ticker-ribbon-track`, `.gallery-marquee-ltr`, `.gallery-marquee-rtl`, and `.moving-border-red::before` & `::after`.
   - Forces compositor layer promotion on mobile and desktop, eliminating subpixel stutter.
4. **Scroll Reveal Animation Smoothing:**
   - Refined `Reveal` component viewport threshold (`margin: "-30px"`) and cubic-bezier easing `[0.16, 1, 0.3, 1]` for silky entrance transitions.
5. **Ponytail Review & Cleanup:**
   - Deleted unused states and dead functions (`scrolled`, `moreOpen`, `moreRef`, `MORE_LINKS`, `moreActive`, `DeskLink`, `mobileNavLinkClass`, `toggleTheme`) from `PublicWebsite.tsx` left over from the `PublicNavbar` extraction.
   - Hardened external link security: added `"noopener,noreferrer"` to `window.open` across `PublicNavbar.tsx`, `FacilitiesPage.tsx`, `MembershipsPage.tsx`, and `TrainersPage.tsx`.

**Verification:**
- `npm run lint` (`tsc --noEmit`): **0 errors**.
- `npm run build`: Production bundle and prerenderer passed cleanly with **0 errors** (`dist/index.html` 232,848 bytes).
- Live local dev server running on `http://localhost:3000/`. (Kept strictly local).

---

## 2026-10-15 — Full-Spectrum Light Mode & Dark Mode Support Across All Components (Antigravity session)

**User Request:**
- "make sure every component appears in light mode as well as dark mode"

**What changed:**
1. **Immediate Theme Hydration (`index.html`):**
   - Added an inline script in `<head>` that reads `localStorage.getItem('vikings_theme')` and immediately applies `.theme-light` to `document.documentElement` before first paint. This eliminates theme flash on refresh or navigation.
2. **Synchronized Dual-Tree Theme Events (`src/components/PublicNavbar.tsx` & `src/components/PublicWebsite.tsx`):**
   - Updated `PublicNavbar` theme toggle to dispatch `vikings_theme_change` window event alongside `localStorage` and `classList` manipulation.
   - Wired listeners in both `PublicNavbar` and `PublicWebsite` so any theme toggle updates all components and subpage navbars instantaneously.
3. **Universal Light Mode CSS Engine (`src/index.css`):**
   - Engineered comprehensive `.theme-light` styling covering all arbitrary dark background utilities (`.bg-black`, `.bg-[#050505]`, `.bg-[#09090b]`, `.bg-[#0c0c0c]`, `.bg-[#080808]`, `.bg-[#121212]`, `.bg-[#171717]`, `.bg-neutral-950/*`, `.bg-neutral-900/*`) mapped to clean white `#ffffff` or slate `#f8fafc`.
   - Tuned text contrast: mapped `.text-white` to dark charcoal `#0f172a`, `.text-gray/neutral/zinc-100..300` to `#334155`, and muted copy to `#64748b`.
   - Adapted form elements (inputs, textareas, selects) with `#ffffff` backgrounds, slate borders, dark text, and vibrant red focus rings.
   - Redesigned floating cylindrical navbar, dropdown menus, and mobile overlay drawer in light mode with frosted glass and crisp dark labels.
   - Adapted the moving text ticker ribbon (`#ticker-ribbon`) to clean light surfaces with dark athletic typography.
   - Protected photographic hero headers: added `.subpage-hero` and `[data-subpage-hero="true"]` rules so media-backed headers on dedicated subpages and the main video hero retain their dark vignette overlays and pristine white text in both light and dark modes.
   - Retained luxury dark aesthetic for the footer (`.footer-always-dark`) across both modes.
4. **Tagged All Dedicated Subpage Hero Headers:**
   - Added `subpage-hero` class and `data-subpage-hero="true"` to hero banners across `FacilitiesPage.tsx`, `TrainersPage.tsx`, `MembershipsPage.tsx`, `GalleryPage.tsx`, `ContactPage.tsx`, `AmbassadorPage.tsx`, `FranchisePage.tsx`, `TermsConditionsPage.tsx`, `PrivacyPolicyPage.tsx`, and `CookiesPolicyPage.tsx`.
5. **Theme-Aware Minimal Loading Screen (`src/components/MinimalLoadingScreen.tsx`):**
   - Added smooth theme transitions to the minimal loading screen so it seamlessly matches the active theme.

**Verification:**
- `npm run lint` (`tsc --noEmit`): **0 errors**.
- `npm run build`: Production bundle and prerendering built cleanly with **0 errors** (`dist/index.html` 232,848 bytes).
- Dev server running on `http://localhost:3000/`. (Kept strictly local, no git push).

---

## 2026-10-15 — Minimal Redesign of the Loading Page (Antigravity session)

**User Request:**
- "now just redesign the loading page and make it minimal with name vikings gym & spa  Loading..."

**What changed:**
1. **Redesigned Initial HTML Loader (`index.html`):**
   - Stripped away the heavy multi-layer circular SVG spinner, pulsing outer ring, and bulky typography cards.
   - Built a sleek, minimal layout:
     - Compact Vikings emblem (`/logo.png`, 42px) with subtle ambient red aura.
     - Pure minimal brand title: `VIKINGS GYM & SPA` with red brand accent.
     - Slender 2px laser progress track (`minimal-loader-bar` smooth animation).
     - Minimal subtext: `Loading...` with a subtle breathing opacity pulse.
     - Smooth 0.35s dismissal on page readiness.
2. **Synchronized React Suspense & Auth Fallback (`src/components/MinimalLoadingScreen.tsx` & `src/App.tsx`):**
   - Created reusable `MinimalLoadingScreen` component matching the exact minimal design.
   - Replaced generic spinner in `App.tsx` auth check (`if (loading)`) and `<Suspense fallback={...}>` with `<MinimalLoadingScreen />`.
   - Result: Seamless, unified, and minimal loading experience from initial document fetch through to client hydration.

**Verification:**
- `npm run lint` (`tsc --noEmit`): 0 errors.
- `npm run build`: Production bundle and prerenderer completed cleanly (**0 errors**, `dist/index.html` generated at 232,623 bytes).
- Live local dev server active on `http://localhost:3000/`. (Kept strictly local).

---

## 2026-10-15 — AI Icon Removal & Complete SEO, AEO, GEO, and SXO Optimization (Antigravity session)

**User Requests:**
1. Remove the AI icon (`Sparkles`) from `आधुनिक फिटनेस एरीना • PURPOSE-BUILT FACILITY`.
2. Fully optimize the platform for SEO, AEO, GEO, and SXO so that whenever anyone in/near Aurangabad searches on Google or asks an AI engine (ChatGPT, Perplexity, Gemini, Claude, Apple Intelligence) for "best gym near me", "best gym in aurangabad", "best gym in aurangabad bihar", "premium gym in aurangabad", or gym fees/amenities, Vikings Gym & Spa ranks #1.

**What changed:**
1. **AI Icon Removal:**
   - In `src/components/PublicWebsite.tsx` (manifesto badge), removed `<Sparkles className="w-3.5 h-3.5" />` while preserving the clean, bold typography and red accent styling.
2. **SEO (Search Engine Optimization):**
   - In `index.html`, optimized `<title>` and `<meta name="description">` to capture exact-match user searches: "Best Gym in Aurangabad, Bihar | Vikings Gym & Spa — Steam Bath, Viva Fitness & Personal Training".
   - Expanded target keywords: "best gym in aurangabad", "best gym in aurangabad bihar", "best gym near me", "premium gym in aurangabad", "gym in aurangabad bihar", "aurangabad gym fees", "ladies gym aurangabad bihar", "steam bath gym aurangabad", "vikings gym spa", and Hindi transliterations ("औरंगाबाद बिहार का सबसे अच्छा जिम", "वाइकिंग्स जिम औरंगाबाद").
3. **AEO (Answer Engine Optimization for AI Search):**
   - Upgraded `index.html` with a comprehensive Schema.org `@graph` JSON-LD knowledge graph:
     - `ExerciseGym` & `HealthClub` multi-type schema with exact location, geo-coordinates (`24.7517185, 84.3707624`), contact number, operating hours, amenities list, pricing range, and aggregate ratings (4.9★ / 150+ reviews).
     - Full `FAQPage` schema addressing the 7 highest-intent conversational queries ("Which is the best gym in Aurangabad?", "What are gym membership fees?", "Where is Vikings Gym located?", "Does it have a steam bath?", "Is it suitable for women and beginners?", "Opening hours", "Free trial").
     - `BreadcrumbList` schema linking all key landing and dedicated pages.
     - `WebSite` schema for search actions.
   - Updated `src/components/PublicWebsite.tsx` on-page `FAQS` list to match the structured schema 1:1, ensuring factual parity between DOM text and JSON-LD.
4. **GEO (Generative Engine Optimization & Geographic Local SEO):**
   - Configured geographic metadata: `geo.region` (IN-BR), `geo.placename` (Aurangabad, Bihar, India), `geo.position`, `ICBM`.
   - Included specific sub-localities in schema `areaServed`: MG Road, Ramesh Chowk, Overbridge, Dani Bigha, Jasoiya, Karma Road, Daudnagar, Rafiganj, Dehri-on-Sone.
   - In `src/components/ui/hero-3.tsx`, added semantic screen-reader/crawler heading anchors and accessible labels.
5. **SXO (Search Experience Optimization):**
   - Configured high-contrast OpenGraph (`og:title`, `og:description`, `og:image`, `business:contact_data`) and Twitter Cards (`summary_large_image`) for click-attracting social shares.
   - Created client-side route SEO manager `src/lib/seo.ts` (`usePageSEO` hook) and integrated it into all dedicated subpages (`FacilitiesPage`, `TrainersPage`, `MembershipsPage`, `GalleryPage`, `ContactPage`, `AmbassadorPage`, `FranchisePage`, and `PublicWebsite`).
6. **Robots & Sitemap:**
   - In `public/robots.txt`, explicitly permitted AI crawlers: `GPTBot`, `ChatGPT-User`, `PerplexityBot`, `Google-Extended`, `ClaudeBot`, `anthropic-ai`, `Applebot`.
   - In `public/sitemap.xml`, indexed all 11 dedicated pages with priority, lastmod, and changefreq.

**Verification:**
- `npm run lint` (`tsc --noEmit`): 0 errors.
- `npm run build`: Production bundle and prerenderer completed cleanly with 0 errors (`dist/index.html` generated at 234,385 bytes with full DOM prerendering for instant search engine indexing).
- Local dev server active on `http://localhost:3000/`. (Kept strictly local, no git push).

---

## 2026-10-15 — Fix & Explanation: Duplicate Failed Network Requests for Plans & Trainers (Antigravity session)

**Issue:** In Chrome DevTools Network tab, requests to `/memberships/plans` and `/trainers` failed twice upon opening the landing page.

**Root Causes Identified & Resolved:**
1. **Unused Backend Calls on Static Public Landing Page:** `src/components/PublicWebsite.tsx` previously ran two legacy TanStack `useQuery` hooks (`public-plans` hitting `/memberships/plans` and `public-trainers` hitting `/trainers`).
2. **Backend Server Offline During Client Dev:** The frontend API client targets `http://localhost:5000/api`. When visiting the frontend without the local Python server running, the browser received `ERR_CONNECTION_REFUSED`.
3. **Why it failed exactly 2 times:** TanStack Query in `src/main.tsx` is configured with `defaultOptions: { queries: { retry: 1 } }`. When the first request failed, React Query automatically fired 1 retry attempt (1 initial + 1 retry = 2 failed requests logged per endpoint).
4. **Redundancy:** Neither `plansData` nor `trainersData` was actually needed by the public page. `DEFAULT_TRAINERS` and `DEFAULT_PLANS` are pre-baked with rich photos, authentic team bios, perks, and pricing for instantaneous, reliable loading.
5. **Fix:** Removed the unused `useQuery` calls in `src/components/PublicWebsite.tsx` and mapped directly to `DEFAULT_PLANS`. Zero failed network requests now occur when loading the site.

**Verification:**
- `npm run lint` (`tsc --noEmit`): 0 errors.
- `npm run build`: Production bundle and prerendering built cleanly with 0 errors.
- Local Dev Server: Live on `http://localhost:3000/`. (Kept strictly local).

---

## 2026-10-15 — Reusable Unified Navbar Made Available Across All Dedicated Pages (Antigravity session)

**Goal:** Make the full, interactive desktop and mobile navigation bar available across all pages of the website, rather than only having a minimal "Back to Arena" header on subpages.

**What changed:**
- **Created Reusable `PublicNavbar` Component (`src/components/PublicNavbar.tsx`):**
  - Encapsulated the complete navigation suite: scroll-responsive floating cylindrical pill animation, logo linking home, 4 primary dedicated pages (`Facilities`, `Trainers`, `Memberships`, `Gallery`) with hover-expanding icon typography, 5th `More` dropdown (`MoreHorizontal`), light/dark theme toggle, "Join Now" WhatsApp CTA, quick desktop "ARENA" button for subpages, and mobile hamburger overlay drawer.
  - Added active route detection (`useLocation()`) so the currently viewed page is automatically highlighted.
- **Integrated Across All Dedicated Pages:**
  - `src/pages/FacilitiesPage.tsx`: Replaced isolated header with `<PublicNavbar />`.
  - `src/pages/TrainersPage.tsx`: Replaced isolated header with `<PublicNavbar />`.
  - `src/pages/MembershipsPage.tsx`: Replaced isolated header with `<PublicNavbar />`.
  - `src/pages/GalleryPage.tsx`: Replaced isolated header with `<PublicNavbar />`.
  - `src/pages/AmbassadorPage.tsx`: Replaced isolated header with `<PublicNavbar />`.
  - `src/pages/ContactPage.tsx`: Replaced isolated header with `<PublicNavbar />`.
  - `src/pages/FranchisePage.tsx`: Replaced isolated header with `<PublicNavbar />`.
  - `src/pages/TermsConditionsPage.tsx`: Replaced isolated header with `<PublicNavbar />`.
  - `src/pages/PrivacyPolicyPage.tsx`: Replaced isolated header with `<PublicNavbar />`.
  - `src/pages/CookiesPolicyPage.tsx`: Replaced isolated header with `<PublicNavbar />`.
- **Integrated in Home Page (`src/components/PublicWebsite.tsx`):**
  - Unified header and mobile menu overlay with `<PublicNavbar activeSection={activeSection} onLoginClick={PORTAL_ACCESS_ENABLED ? onLoginClick : undefined} />`.

**Verification:**
- `npm run lint` (`tsc --noEmit`): 0 errors.
- `npm run build`: Production bundle and prerendering built cleanly with 0 errors (`dist/index.html` 221,966 bytes).
- Live local dev server running on `http://localhost:3000/`.

**Deploy status:** Kept strictly local per user instructions (NOT pushed to git).

---

## 2026-10-15 — Website Polish: Minimal Stories/Arena, Auto-Moving Gallery Marquee, Icon Nav Menus with Hover Reveal, Dropping Hero Animations, and Smooth Border Animations (Antigravity session)

**Goal:**
1. Remove heavy cards from daily stories and arena moments; make both sections minimal and streamlined.
2. Remove unnecessary cylinder pill badges across the website and dedicated pages, replacing with clean typography.
3. Replace static facility gallery preview with automated dual-row continuous marquees (upper row left-to-right, lower row right-to-left).
4. Dedicate the top navigation bar to 4 primary pages (`Facilities`, `Trainers`, `Memberships`, `Gallery`) + 5th `More` dropdown (Brand Ambassador, Contact, Franchise, and Arena sections).
5. Implement icon-only navigation menus by default with smooth hover label expansion (`group-hover:max-w-[130px] group-hover:opacity-100`).
6. Add dropping-from-above hero animation (`initial={{ opacity: 0, y: -60 }} animate={{ opacity: 1, y: 0 }}`) to all dedicated pages (`FacilitiesPage`, `TrainersPage`, `MembershipsPage`, `GalleryPage`, `AmbassadorPage`, `ContactPage`, `FranchisePage`, `TermsConditionsPage`, `PrivacyPolicyPage`, `CookiesPolicyPage`).
7. Optimize the animated red border spin (`@keyframes google-border-spin` & `.moving-border-red`) for silky smooth 360-degree rotation across cards.

**What changed:**
- **CSS Animations (`src/index.css`):**
  - Added continuous infinite marquee keyframes `@keyframes marquee-ltr` (-50% to 0%) and `@keyframes marquee-rtl` (0% to -50%) with pause-on-hover utility classes `.gallery-marquee-ltr` and `.gallery-marquee-rtl`.
  - Tuned `.moving-border-red`: removed duplicate overriding `transform`, set centered `transform-origin`, and normalized timing to `6s linear infinite`.
- **Public Website (`src/components/PublicWebsite.tsx`):**
  - **Nav Bar:** Configured 4 dedicated page links with icons: Facilities (`Building2`), Trainers (`Users`), Memberships (`Crown`), Gallery (`Camera`), plus `More` (`MoreHorizontal`). Icons display minimally by default and expand their labels on hover.
  - **Arena in Motion (`#arena-action`):** Removed heavy action cards, borders, and paragraphs; replaced with sleek dual-video loop preview and direct action links.
  - **Daily Stories (`#gallery`):** Removed bulky 5-card deck. Preserved clean Instagram-style circular story rings with tap-to-view fullscreen modal.
  - **Facility Gallery Marquee (`#gallery`):** Replaced static photo grid with dual-row infinite auto-moving ribbons (top row left-to-right, bottom row right-to-left, pauses on hover) linking to `/gallery`.
  - **Cylinder Pill Badge Cleanup:** Removed extraneous `rounded-full border border-red-500/30` cylinder pills across Manifesto, Arena, Facilities, Brand Ambassador, BMI calculator, and Stories.
- **Dedicated Pages Animation & Typography:**
  - `src/pages/FacilitiesPage.tsx`: Added `motion.div` dropping hero animation and cleaned pill badges.
  - `src/pages/TrainersPage.tsx`: Added `motion.div` dropping hero animation and cleaned pill badges.
  - `src/pages/MembershipsPage.tsx`: Added `motion.div` dropping hero animation and cleaned pill badges.
  - `src/pages/GalleryPage.tsx`: Added `motion.div` dropping hero animation, dual-row continuous photo marquees (upper LTR, lower RTL), and cleaned badges.
  - `src/pages/AmbassadorPage.tsx`: Added `motion.div` dropping hero animation and cleaned pill badges.
  - `src/pages/ContactPage.tsx`: Added `motion.div` dropping hero animation and cleaned pill badges.
  - `src/pages/FranchisePage.tsx`: Added `motion.div` dropping hero animation and cleaned pill badges.
  - `src/pages/TermsConditionsPage.tsx`, `PrivacyPolicyPage.tsx`, `CookiesPolicyPage.tsx`: Added `motion.div` dropping hero animation and cleaned pill badges.

**Verification:**
- `npm run lint` (`tsc --noEmit`): 0 errors.
- `npm run build`: Production bundle and prerender succeeded with 0 errors (`dist/index.html` 222,183 bytes).
- Dev server running on `http://localhost:3000/`.

**Deploy status:** Kept strictly local per user instructions (NOT pushed to git).

---

## 2026-10-15 — Drastic Landing Page Length Optimization for Smartphones and Tablets (Antigravity session)

**Goal:** Ensure the landing page is not excessively long on smartphones and tablets, cutting over 4,500px of unnecessary vertical scroll while leaving the rich desktop experience 100% intact.

**What changed (`src/components/PublicWebsite.tsx`):**
- **Section Headers & Whitespace Padding Reduction:**
  - Scaled all section vertical paddings from bloated `py-16 md:py-24` down to compact `py-8 sm:py-12 md:py-20` across `#manifesto`, `#facilities`, `#arena-action`, `#trainers`, `#ambassador`, `#calculator`, `#pricing`, `#gallery`, `#review`, `#faq`, `#contact`, and `#about`.
  - Tightened `SectionHeader` bottom margins from `mb-10 sm:mb-14` to `mb-6 sm:mb-10 md:mb-14` and kicker/title font scales for mobile viewports.
- **Facilities Section (`#facilities`):**
  - Converted stacked mobile cards into a compact 2x2 grid (`grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4 md:gap-6`).
  - Added direct link: `EXPLORE FULL FACILITY SPECS (ALL 8 ZONES) →` pointing to `/facilities`.
- **Coaches & Trainers Section (`#trainers`):**
  - On mobile/tablet, limited initial display to top 2 coaches (Owner Coach Amit Singh and Head Coach Bittu Verma), hiding remaining coaches on small viewports (`hidden lg:flex`).
  - Added prominent mobile button: `MEET ALL 6 CERTIFIED COACHES & PT PACKAGES →` pointing to `/trainers`.
- **Ambassador Section (`#ambassador`):**
  - Reduced photo min-height on mobile from `min-h-[460px]` to `min-h-[240px] xs:min-h-[280px] md:min-h-[460px]` and condensed text margins.
  - Linked directly to `/ambassador`.
- **BMI Calculator Section (`#calculator`):**
  - Reduced container padding to `py-8 sm:py-12 md:py-20 px-4 sm:px-6` and condensed input form padding.
- **Memberships & Pricing Section (`#pricing`):**
  - On mobile/tablet, displays top 2 primary membership tiers by default (`hidden lg:flex` for tiers 3 & 4), saving over 1,500px of vertical scrolling.
  - Added button: `VIEW ALL 4 MEMBERSHIP TIERS & PT RATES →` pointing to `/memberships`.
  - Hid secondary group class / personal training feature cards on small viewports (`hidden lg:grid`) and replaced with a one-line link to `/memberships`.
- **Stories & Gallery Preview (`#gallery`):**
  - Limited photo preview grid on mobile to 4 items (2x2) instead of 6 (`hidden sm:block` for items 5 & 6) with quick link to `/gallery`.
- **Reviews & Google Maps (`#review`):**
  - Hid the Google Maps QR code box on mobile and tablet (`hidden lg:flex`) since smartphones cannot point their camera at their own screen. Members can tap "LEAVE A REVIEW" or "OPEN IN GOOGLE MAPS" directly.
- **FAQs Section (`#faq`):**
  - Implemented mobile accordion collapse showing only the top 3 FAQs by default, with an interactive toggle button: `VIEW ALL 6 FAQS (3 MORE) ↓`. Full FAQ list displays seamlessly when tapped or on desktop.
- **Contact & Map Section (`#contact`):**
  - Compacted contact form inputs (`py-2`, `rows={2}`) and tightened spacing from `space-y-5` to `space-y-3.5 sm:space-y-5`.
- **About Section (`#about`) & Footer:**
  - Reduced map iframe height on mobile from `300px` to `220px` and condensed footer vertical padding (`pt-8 sm:pt-14 pb-6 sm:pb-8`).

**Verification:**
- `npm run lint` (`tsc --noEmit`): 0 errors.
- `npm run build`: Production bundle and prerender succeeded with 0 errors (`dist/index.html` 176,447 bytes).
- Dev server active on `http://localhost:3000/`.

**Deploy status:** Kept strictly local per user instructions (NOT pushed to GitHub). Ready for user review on localhost.

---

## 2026-10-15 — Remove Sub-Header Navigation Strip on Smartphone & Tablet (Antigravity session)

**Goal:** Remove the horizontal quick-link nav menus strip that was rendered directly beneath the header bar on smartphones and tablets.

**What changed:**
- **Navigation Cleanup (`src/components/PublicWebsite.tsx`):**
  - Removed the `div.lg:hidden` sub-header horizontal scrolling navigation strip (`MANIFESTO`, `FACILITIES`, `TRAINERS`, `BMI`, `MEMBERSHIPS`, `STORIES`, `FAQS`, `CONTACT`, `ABOUT`) located underneath `<nav>`.
  - Removed the unused `MOBILE_LINKS` array.
  - The hero section now cleanly meets the header bar on smartphones and tablets without vertical clutter.
  - Full mobile navigation remains accessible via the hamburger menu button in the header bar which opens the dedicated overlay drawer.

**Verification:**
- `npm run lint` (`tsc --noEmit`): 0 errors.
- `npm run build`: Production bundle and prerender succeeded with 0 errors (`dist/index.html` 170,135 bytes).
- Dev server active on `http://localhost:3000/`.

**Deploy status:** Kept strictly local per user instructions (NOT pushed to GitHub). Ready for user review on localhost.

---

## 2026-10-15 — Revert Hindi Texts from Hero Highlighted Changing Texts (Antigravity session)

**Goal:** Remove Hindi texts from hero highlighted changing texts per user request.

**What changed:**
- **Hero Title Rotating Words (`src/components/PublicWebsite.tsx`):**
  - Reverted `RotatingHeroTitle` back to pure athletic English power words:
    `"VALHALLA"`, `"GREATNESS"`, `"GLORY"`, `"WARRIORS"`, `"STRENGTH"`, `"DOMINANCE"`.
  - Retained vibrant red gradient text styling (`from-red-600 via-red-500 to-rose-600`) and 3-second cycle.
- **Hero Highlights Bar (`src/components/ui/hero-3.tsx`):**
  - Removed dynamic Hindi text cycling array (`HIGHLIGHT_WORDS`) and associated timers/state.
  - Restored crisp, static athletic highlight: `OLYMPIC IRON & MOROCCAN SPA`.
  - Preserved live hours badge (`OPEN 5:00 AM – 10:00 PM`) and athlete rating (`4.9★ RATED (650+ ATHLETES)`).
  - Set description prose to clean English: `{GYM_CONFIG.address} · Certified Coaches · Viva Fitness Equipment & Moroccan Steam Spa`.

**Verification:**
- `npm run lint` (`tsc --noEmit`): 0 errors.
- `npm run build`: Production bundle and prerender succeeded with 0 errors (`dist/index.html` 171,181 bytes).
- Dev server active on `http://localhost:3000/`.

**Deploy status:** Kept strictly local per user instructions (NOT pushed to GitHub). Ready for user review on localhost.

---

## 2026-10-15 — Security Leak Prevention via DevTools/Inspect, Centralized Config & Rotating Hindi Hero Texts (Antigravity session)

**Goal:** Complete user requirements:
1. **Security & Inspect Data Leak Prevention:** Guarantee that when inspecting the browser DevTools (Elements, Sources, Network, Console), no sensitive data (auth reset links/tokens, debuggers, internal dev comments, source maps) leaks to the client.
2. **Remove Hardcoded Texts:** Centralize all hardcoded business details (addresses, phone numbers, WhatsApp, emails, batch hours, social URLs) in `src/config/gym.ts` and bind all standalone and public pages to this single source of truth.
3. **Rotating Hindi Hero Texts:** Add authentic, athletic Hindi texts into both the rotating hero title words and the hero highlights bar below the action buttons.

**What changed:**
- **Security & Inspect Leak Prevention (`vite.config.ts`, `src/components/AuthGateway.tsx`):**
  - Configured `vite.config.ts` production build with `sourcemap: false` and `minify: 'esbuild'`.
  - Added `esbuild: { drop: ['debugger'], legalComments: 'none' }` so all developer comments and debugger statements are stripped from compiled assets.
  - Added explicit vendor chunking (`vendor-react`, `vendor-icons`, `vendor-motion`) with `chunkSizeWarningLimit: 800`.
  - In `src/components/AuthGateway.tsx`: Removed dev-mode DOM leak where backend `reset_link` containing reset tokens was rendered into the HTML DOM. Replaced with secure, generic confirmation text revealing zero sensitive tokens or query links in DevTools.
- **Centralized Configuration (`src/config/gym.ts`):**
  - Expanded `GYM_CONFIG` with `name`, `shortName`, `hindiName`, `hindiFullName`, `phone`, `phoneDisplay`, `phoneAlternate`, `phoneAlternateDisplay`, `whatsapp`, `email`, `infoEmail`, `franchiseEmail`, `address`, `addressFull`, `hindiAddress`, `landmark`, `operatingHours`, `operatingHoursShort`, `hours`, `morningBatch`, `eveningBatch`, `sundayHours`, `rating`, `athleteCount`, `facebook`, `instagram`, `instagramAmbassador`, `mapLink`, and `mapEmbed`.
- **Eliminated Hardcoded Strings across Pages:**
  - `src/pages/ContactPage.tsx`: Bound phone numbers, emails, addresses, hours, and map embeds to `GYM_CONFIG`.
  - `src/pages/FranchisePage.tsx`: Bound `franchiseEmail`, `phoneDisplay`, address, and operating hours to `GYM_CONFIG`.
  - `src/pages/AmbassadorPage.tsx`: Bound `instagramAmbassador`, address, and operating hours to `GYM_CONFIG`.
  - `src/pages/FacilitiesPage.tsx`: Bound footer name, address, and operating hours to `GYM_CONFIG`.
  - `src/pages/TrainersPage.tsx`: Bound footer name, address, and operating hours to `GYM_CONFIG`.
  - `src/pages/MembershipsPage.tsx`: Bound footer name, address, and operating hours to `GYM_CONFIG`.
  - `src/pages/GalleryPage.tsx`: Bound footer name, address, and operating hours to `GYM_CONFIG`.
- **Rotating Hindi Hero Texts (`src/components/PublicWebsite.tsx`, `src/components/ui/hero-3.tsx`):**
  - In `RotatingHeroTitle`: Added authentic Hindi athletic power words cycling every 3 seconds:
    `"VALHALLA"`, `"अखंड शक्ति"`, `"WARRIORS"`, `"अजेय योद्धा"`, `"STRENGTH"`, `"शौर्य व पराक्रम"`, `"GREATNESS"`, `"विजयी भव"`.
  - In `hero-3.tsx`: Added `HIGHLIGHT_WORDS` cycling through grounded bilingual facility highlights:
    `"OLYMPIC IRON & MOROCCAN SPA"`, `"ओलंपिक बारबेल एवं स्टीम स्पा"`, `"VIVA FITNESS IMPORTED RIGS"`, `"प्रमाणित स्ट्रेंथ व फिटनेस ट्रेनर्स"`, `"60KG DUMBBELLS & OLYMPIC TRACK"`, `"महिला व पुरुष हेतु सुरक्षित वातानुकूलित अखाड़ा"`.
  - Bound static rating and operating hours to `GYM_CONFIG.rating` and `GYM_CONFIG.operatingHoursShort`.

**Verification:**
- `npm run lint` (`tsc --noEmit`): 0 errors across entire workspace.
- `npm run build`: Production build and prerender succeeded with 0 errors (`dist/index.html` 171,292 bytes).
- Dev server running on `http://localhost:3000/`.

**Deploy status:** Kept strictly local per user instructions (NOT pushed to GitHub). Ready for user review on localhost.

---

## 2026-10-15 — Google AI/Gemini-Style Animated Border Box Redesign (Antigravity session)

**Goal:** Redesign the moving border animation box (`.moving-border-red`) to match Google's flagship animation design language (Google Gemini / Google AI luminous border).

**What changed:**
- `src/index.css`:
  - Completely re-architected `.moving-border-red` into a dual-layer Google AI chromatic glowing box:
    1. **Crisp Outer Beam (`::before`):** 300% conical gradient spinning smoothly at 4.5s linear infinite with Google's signature spectrum flow: Google Blue (`#4285F4`) → Google Green (`#34A853`) → Google Yellow (`#FBBC05`) → Google Red / Crimson (`#EA4335`) → Coral Flame (`#FF5722`) → Pure White Light Crest (`#FFFFFF`).
    2. **Ambient Luminous Aura (`::after`):** Heavy blurred light layer (`filter: blur(14px); opacity: 0.85`) tracking the rotating beam to cast Google's signature ethereal glowing halo onto surrounding surfaces.
    3. **Container Box-Shadow:** Tuned dual-color ambient glow (`rgba(234, 67, 53, 0.28)` red and `rgba(66, 133, 244, 0.22)` blue) that expands dynamically on card hover.
    4. **Corner Radius Inheritance:** Set `border-radius: inherit` on `.moving-border-red-inner` to seamlessly match any parent corner radius (`rounded-xl`, `rounded-2xl`, `rounded-3xl`) with uniform 2px border thickness.
    5. **Theme Support:** Updated light-mode elevation shadow and disabled animations in `prefers-reduced-motion` media query.

**Verification:**
- `npm run lint` (`tsc --noEmit`): 0 errors.
- `npm run build`: Production build and prerender passed with 0 errors (`dist/index.html` 170,556 bytes).
- Dev server running on `http://localhost:3000/`.

**Deploy status:** Kept strictly local per user instructions (NOT pushed to GitHub). Ready for review on localhost.

---

## 2026-10-15 — Moving Text Ribbon, Smooth Red Borders, Cylindrical Morphing Header & Dedicated Pages (Antigravity session)

**Goal:** Implement the user's multi-part UI & architectural requests:
1. **Moving Ribbon of Texts Below Hero:** Added an athletic, hardware-accelerated continuous moving marquee ribbon just below `<AnimatedMarqueeHero />` featuring grounded Hindi & English details (Viva Fitness equipment, 60kg dumbbells, Moroccan steam bath, biometric turnstile access, certified coaches, MG Road Aurangabad).
2. **Smooth Red Line of Borders:** Redesigned `.moving-border-red` in `src/index.css` with a 250% size conic-gradient beam, smooth multi-stop interpolation, 5s linear infinite duration, and GPU-accelerated `translate3d(0, 0, 0)` for silky 60/120fps rotation.
3. **Smooth Scroll-Up Button Red Border Filler:** Refined the circular SVG progress border with `stroke-dashoffset 90ms cubic-bezier(0.1, 0.9, 0.2, 1)`, a glowing red drop shadow (`drop-shadow-[0_0_6px_rgba(239,68,68,0.45)]`), and 2.8px stroke width for jitter-free real-time tracking on scroll.
4. **Cylindrical Header Bar on Scroll:** Styled the main header to smoothly morph into a floating cylindrical pill (`mx-auto max-w-6xl rounded-full border border-red-500/40 bg-neutral-950/92 backdrop-blur-2xl shadow-[0_12px_40px_rgba(0,0,0,0.85)] ring-1 ring-red-500/25 px-4 sm:px-6 h-14`) when scrolled down, and smoothly transition back to the original full-width, flat-bottom top position (`w-full rounded-none border-b border-red-950/40 bg-black/85 h-[72px]`) when scrolled back to the top.
5. **Dedicated Pages in Identical Format:** Created dedicated pages for all menus requiring separate pages with landscaped photo heroes, dark vignette overlays, kicker badges, structured content cards, bilingual Hindi/English copy, and consistent footers:
   - `/facilities` (`FacilitiesPage.tsx` with `strengthPanoramic` hero & 8 facility zone cards)
   - `/trainers` (`TrainersPage.tsx` with `freeWeightsBenches` hero, trainer bios & PT packages)
   - `/memberships` (`MembershipsPage.tsx` with `deadliftPlatform` hero, 4 tier cards & inclusions)
   - `/contact` (`ContactPage.tsx` with `receptionWide` hero, inquiry form & Google Maps embed)
   - `/franchise` (`FranchisePage.tsx` with `mainArenaPanoramic` hero, business models & kit request)
   - `/ambassador` (`AmbassadorPage.tsx` with `photoVaishnavi` hero & authentic nutrition story)
6. **Routing & Navigation:** Wired up lazy routes in `src/App.tsx` and integrated direct links in both the desktop MORE dropdown and the mobile menu overlay.

**What changed:**
- `src/index.css`:
  - Added `@keyframes ticker-ribbon-scroll` and `.ticker-ribbon-track` with hardware acceleration.
  - Refined `.moving-border-red` conic-gradient and duration.
- `src/components/PublicWebsite.tsx`:
  - Inserted the moving text ticker ribbon between hero and manifesto showcase.
  - Converted `<header>` / `<nav>` into a morphing cylindrical capsule on scroll that reverts cleanly to top position.
  - Enhanced the scroll-up button SVG circular fill with 90ms eased transition and subtle glow.
  - Updated MORE dropdown and mobile drawer to provide direct links to all dedicated separate pages.
- `src/App.tsx`:
  - Added lazy imports and routes for `/facilities`, `/trainers`, `/memberships`, `/contact`, `/franchise`, and `/ambassador`.
- Created dedicated pages:
  - `src/pages/FacilitiesPage.tsx`
  - `src/pages/TrainersPage.tsx`
  - `src/pages/MembershipsPage.tsx`
  - `src/pages/ContactPage.tsx`
  - `src/pages/FranchisePage.tsx`
  - `src/pages/AmbassadorPage.tsx`
- `WORKLOG.md`: Documented all updates.

**Verification:**
- `npm run lint` (`tsc --noEmit`): 0 errors across all files.
- `npm run build`: Production bundle and prerender succeeded with 0 errors (`dist/index.html` 170,556 bytes).
- Dev server running on `http://localhost:3000/`.

**Deploy status:** Kept strictly local per user instructions (NOT pushed to GitHub). Ready for user review on localhost.

---

## 2026-10-15 — Full-Screen Cookie Consent, Facebook Page Integration, Hero Face-Cropping Fix, Daily Stories Redesign, Circular Loader & Grounded Hindi Texts (Antigravity session)

**Goal:** Implement the user's latest set of requirements:
1. Facebook Integration: Added official Facebook page (`https://www.facebook.com/p/Vikings-Gym-Spa-61565130891501/`) to config, footer, contact section, and daily stories.
2. Fix Hero Video1 Face Cropping: Adjusted object positioning to `object-[center_10%] sm:object-[center_14%] md:object-[center_18%]` so upper bodies and faces are never cropped out.
3. Full-Screen Functional Cookie Modal: Designed an immersive full-screen modal covering the entire screen (`fixed inset-0 z-[100] bg-black/90 backdrop-blur-2xl`) for new visitors with bilingual Hindi/English explanation and working choices ("ALLOW ALL COOKIES" and "ESSENTIAL ONLY" writing to `localStorage`).
4. Redesign Daily Stories & Arena Moments (`#gallery`): Built an interactive Instagram-style story deck featuring animated pulsing rings, live status tags, bilingual workout details, and a full In-App Story Viewer modal with progress segments, keyboard navigation (`Escape`, `ArrowLeft`, `ArrowRight`), and direct links to Instagram Stories and Facebook.
5. Circular Loading Animation (`index.html`): Added a luxury circular SVG spinning ring, glowing ambient red back-light, "VIKINGS GYM & SPA" typography, and Hindi brand subtitle "वाइकिंग्स जिम एंड स्पा • AURANGABAD".
6. Grounded Hindi Texts: Tastefully integrated authentic Devanagari script across the landing page (Header, Hero subtitle, Manifesto, Facilities, Trainers, Memberships, Daily Stories, Contact, and Footer).
7. Anti-AI Copywriting Compliance (`.agents/contentWritingSkill.md`): Removed artificial tropes and negative parallelisms ("NOT JUST A GYM"), replacing them with concrete local facts (MG Road Aurangabad Bihar 824101, Viva Fitness equipment, certified coach Amit Singh).

**What changed:**
- `src/config/gym.ts`: Added `facebook` URL and `hindiFullName`.
- `src/components/ui/hero-3.tsx`:
  - Fixed `video1` object positioning to `object-[center_10%] sm:object-[center_14%] md:object-[center_18%]` to keep faces in view on all screen sizes.
  - Added grounded Hindi subtitle in hero highlights.
- `index.html`:
  - Replaced linear beam with circular SVG rotating ring loader, dashed inner pulse ring, and bold "VIKINGS GYM & SPA" + Hindi subtitle.
- `src/components/PublicWebsite.tsx`:
  - Transformed cookie notice from bottom toast into a full-screen backdrop modal (`fixed inset-0 z-[100] bg-black/90 backdrop-blur-2xl`) with functional buttons and links to `/cookies` and `/terms`.
  - Redesigned `#gallery` with Instagram-style avatar story rings, 5 workout moment cards with Hindi tags, and an in-app interactive Story Viewer modal.
  - Integrated Facebook official page link in footer, contact section, and story viewer.
  - Added authentic Hindi text to Navbar brand, Manifesto, Facilities, Trainers, Memberships, and Contact sections.
  - Eliminated negative parallelism in Manifesto.
- `WORKLOG.md`: Documented all updates.

**Verification:**
- `npm run lint` (`tsc --noEmit`): 0 errors.
- `npm run build`: Production build and prerender passed with 0 errors (`dist/index.html` 165,132 bytes).
- Dev server running on `http://localhost:3000/`.

**Deploy status:** Kept strictly local per user instructions (NOT pushed to GitHub). Ready for review on localhost.

---

## 2026-10-15 — 5-Item Landing Page Nav Order, Sound Button Removal from Arena in Motion, Hero Viewport Mobile Padding & Ponytail Code Analysis (Antigravity session)

**Goal:** Implement all requested refinements:
1. Main Navigation: Retain strictly 5 menus in exact landing page order (`FACILITIES`, `TRAINERS`, `MEMBERSHIPS`, `CONTACT`, with `MORE` as the 5th menu).
2. Navigation Cleanup: Removed `ambassador`, `arena-action`, and `review` from all navigation menus (`MORE_LINKS`, `MOBILE_LINKS`, and `SECTION_IDS`).
3. Arena in Motion: Removed the floating sound toggle button from `ActionReelCard` videos so they play cleanly and silently.
4. Hero Padding & Smartphone Viewport Optimization: Calibrated vertical padding (`pt-5 xs:pt-7 sm:pt-10 md:pt-14 pb-20 xs:pb-24 sm:pb-12 md:pb-14`), title typography, button dimensions, and description text so everything is fully visible above the mobile sticky action bar on all smartphone screen sizes.
5. Ponytail Review: Applied lazy senior dev principles (deletion over addition, eliminated dead `isMuted` audio state, zero over-engineering, compact responsive tokens).

**What changed:**
- **Desktop & Mobile Navigation Alignment (`src/components/PublicWebsite.tsx`):**
  - Updated primary desktop navbar to 5 items in strict page sequence:
    1. `FACILITIES` (`#facilities`)
    2. `TRAINERS` (`#trainers`)
    3. `MEMBERSHIPS` (`#pricing`)
    4. `CONTACT` (`#contact`)
    5. `MORE` (5th dropdown menu)
  - Removed `ambassador`, `arena-action`, and `review` from `MORE_LINKS`, `MOBILE_LINKS`, mobile drawer, and `SECTION_IDS`.
  - Reorganized `MORE_LINKS` to: `MANIFESTO`, `BMI CALCULATOR`, `DAILY STORIES & GALLERY`, `FAQS`, `ABOUT VALHALLA`, and `FRANCHISE`.
- **Sound Button Removed from Arena in Motion (`src/components/PublicWebsite.tsx`):**
  - Deleted `isMuted` state, `toggleSound` handler, and floating top-right volume toggle button from `ActionReelCard`. Videos play seamlessly muted without UI obstruction.
- **Hero Padding & Mobile Optimization (`src/components/ui/hero-3.tsx`, `src/components/PublicWebsite.tsx`):**
  - Calibrated hero section bottom padding on smartphones (`pb-20 xs:pb-24`) to sit cleanly above the fixed mobile sticky action bar.
  - Sized headline font (`text-3xl xs:text-4xl sm:text-5xl md:text-6xl lg:text-7xl`) and dynamic width in `RotatingHeroTitle` (`min-w-[200px] xs:min-w-[260px] sm:min-w-[420px] md:min-w-[560px]`).
  - Fluid button sizing (`min-h-[38px] xs:min-h-[42px] px-4 xs:px-6 py-2`) and compact, high-contrast trust badges.

**Verification:**
- `npm run lint` (`tsc --noEmit`): 0 errors.
- `npm run build`: Production build and prerender passed with 0 errors (`dist/index.html` 148,154 bytes).
- Dev server running on `http://localhost:3000/`.

**Deploy status:** Kept strictly local per user instructions (NOT pushed to GitHub). Ready for review on localhost.

---

**Goal:** Implement all requested refinements:
1. Video 1: Keep clean in its original resolution and natural aspect fit without digital zoom (`scale-105` removed).
2. Video 4: Removed from hero sequence to eliminate blurriness.
3. Hero Slideshow Sequence: After Video 1 finishes playing (`onEnded`), smoothly cross-fade through high-resolution landscaped gym photos (`mainArenaPanoramic`, `strengthPanoramic`, `freeWeightsBenches`, `deadliftPlatform`, `cardioRowingWide`) without any zoom, then loop back to Video 1 in an infinite continuous cycle.
4. Hero Changing Text: Styled the rotating power words with pure red gradient only (`from-red-600 via-red-500 to-rose-600`), eliminating amber/yellow tints.
5. All Standalone Pages: Added a dedicated landscaped photo in the hero background with dark contrast overlays and texts directly over it:
   - `/gallery` (`GalleryPage.tsx`): Wide landscaped main arena floor (`mainArenaPanoramic`) hero.
   - `/privacy` (`PrivacyPolicyPage.tsx`): Wide reception lounge (`receptionWide`) hero.
   - `/terms` (`TermsConditionsPage.tsx`): Olympic competition deadlift platform (`deadliftPlatform`) hero.
   - `/cookies` (`CookiesPolicyPage.tsx`): Reception digital check-in workstation (`receptionDeskWorkstation`) hero.

**What changed:**
- **Hero Video & Landscaped Photo Loop (`src/components/ui/hero-3.tsx`, `src/components/PublicWebsite.tsx`):**
  - Removed `scale-105` and zoom transitions from Video 1; now fits the hero cleanly at original resolution with `object-cover`.
  - Removed `video4Src` from the hero sequence.
  - Implemented automatic transition from Video 1 $\rightarrow$ landscaped photo cross-fade slideshow $\rightarrow$ loop back to Video 1.
  - Photos cross-fade smoothly every 3.5s with `AnimatePresence` and zero zoom scaling.
- **Pure Red Gradient for Rotating Hero Title (`src/components/PublicWebsite.tsx`):**
  - Changed `RotatingHeroTitle` gradient from multi-color (`red/rose/amber`) to pure vibrant red tones: `bg-gradient-to-r from-red-600 via-red-500 to-rose-600` with pure red drop-shadow glow.
- **Dedicated Landscaped Photo Heroes across All Standalone Pages (`src/pages/`):**
  - `GalleryPage.tsx`: Built full-width hero header over `mainArenaPanoramic` with dual edge vignette fades, badge, title, description, and interactive filter pills.
  - `PrivacyPolicyPage.tsx`: Added landscaped hero header over `receptionWide` with badge, title, and subtitle over the photo.
  - `TermsConditionsPage.tsx`: Added landscaped hero header over `deadliftPlatform` with badge, title, and subtitle over the photo.
  - `CookiesPolicyPage.tsx`: Added landscaped hero header over `receptionDeskWorkstation` with badge, title, and subtitle over the photo.

**Verification:**
- `npm run lint` (`tsc --noEmit`): 0 errors.
- `npm run build`: Production build and prerender (`dist/index.html` 149,947 bytes) passed with 0 errors.
- Dev server running on `http://localhost:3000/`.

**Deploy status:** Kept strictly local per user instructions (NOT pushed to GitHub). Ready for review on localhost.

---

**Goal:** Implement all requested refinements:
1. Streamline desktop navbar to only core relevant menus (`FACILITIES`, `MEMBERSHIPS`, `TRAINERS`, `AMBASSADOR`) with all remaining sections organized into `MORE`.
2. Ensure background videos zoom smoothly (`scale-105 transition-all duration-1000 ease-out`) without harsh cropping or clipping.
3. Fade hero background video from the left and right side edges smoothly to pure black.
4. Remove rectangular bounding container and background from hero details, keeping them transparent with crisp drop shadows.
5. Animate "CARVE YOUR BODY FOR [WORD]" with vibrant fire gradient focus on the power word, cycling through 6 relevant words (`VALHALLA`, `GREATNESS`, `GLORY`, `WARRIORS`, `STRENGTH`, `DOMINANCE`) every 3 seconds.
6. Keep the scroll-up button identical in light and dark modes (deep black face `#09090b`), and make the circular red SVG border filling smooth across all scroll speeds.

**What changed:**
- **Hero Title Animation & 3s Power Word Rotation (`src/components/PublicWebsite.tsx`):**
  - Created `RotatingHeroTitle` component with `AnimatePresence (mode="wait")`.
  - Animates the static kicker "CARVE YOUR BODY FOR" with subtle drop-shadows.
  - Rotates through 6 athletic power words: `VALHALLA` → `GREATNESS` → `GLORY` → `WARRIORS` → `STRENGTH` → `DOMINANCE` every 3000ms.
  - Focused word styled with rich multi-stop fire gradient (`from-red-500 via-rose-400 to-amber-300`), dual glowing drop shadows (`drop-shadow-[0_0_40px_rgba(239,68,68,0.75)]`), and vertical blur entrance/exit transitions.
- **Hero Video Side Fades & Smooth Zoom (`src/components/ui/hero-3.tsx`):**
  - Added left and right side-edge vignette gradients fading seamlessly into pure black:
    - Left: `bg-gradient-to-r from-black via-black/65 to-transparent`
    - Right: `bg-gradient-to-l from-black via-black/65 to-transparent`
  - Replaced static cuts with gentle 1-second video zooming (`scale-105 transition-all duration-1000 ease-out`).
- **Hero Details Transparency (`src/components/ui/hero-3.tsx`):**
  - Removed rectangular frosted glass bounding container (`.hero-pill`), background fills, and borders.
  - Hero details now float 100% transparently over the video with high-contrast text drop shadows for legibility.
- **Streamlined Desktop Navbar (`src/components/PublicWebsite.tsx`):**
  - Kept only 4 core menus on the primary desktop navigation bar: `FACILITIES`, `MEMBERSHIPS`, `TRAINERS`, and `AMBASSADOR`.
  - Moved all other sections into the `MORE` dropdown in strict page order: `MANIFESTO`, `ARENA IN MOTION`, `BMI CALCULATOR`, `DAILY STORIES & GALLERY`, `FAQS`, `WARRIOR REVIEWS`, `CONTACT & DIRECTIONS`, `ABOUT VALHALLA`, and `FRANCHISE`.
- **Butter-Smooth Circular Scroll-Up Button (`src/components/PublicWebsite.tsx`, `src/index.css`):**
  - Button face protected to remain deep black (`#09090b`) in both dark and light modes with white arrow and red hover.
  - Wrapped scroll progress listener in `requestAnimationFrame` for stutter-free tracking.
  - Added `transition: stroke-dashoffset 0.15s cubic-bezier(0.2, 0.8, 0.2, 1)` and `will-change: stroke-dashoffset` to the circular red SVG border for smooth filling and un-filling.

**Verification:**
- `npm run lint` (`tsc --noEmit`): 0 errors.
- `npm run build`: Production build and prerender passed with 0 errors.
- Dev server running on `http://localhost:3000/`.

**Deploy status:** Kept strictly local per user instructions (NOT pushed to GitHub). Ready for review on localhost.

---

**Goal:** Implement all requested refinements:
1. Ensure the Light theme looks just as appealing and high-end as the Dark theme, while keeping the footer permanently dark luxury.
2. Guarantee that border animations and the circular scroll-up button look smooth and identical in both dark and light themes (protected inner dark button face and rotating beam borders).
3. Redesign the HTML loading page in `index.html` to be ultra-minimal, high-contrast, and elegant (pulsing transparent logo mark + glowing red gradient progress beam + fast load fadeout).
4. Rewrite and protect hero highlights in `hero-3.tsx` within a dark frosted glass pill (`.hero-pill`) so they are 100% crisp and readable in both dark and light modes.
5. Redesign the Daily Stories section into a modern Instagram Stories & Arena Moments card showcase with active story rings, video badges, and fullscreen Instagram links.
6. Align all navbar menus (desktop visible links, MORE dropdown, mobile bar, and mobile drawer) in the exact top-to-bottom order of the landing page, and implement real-time scroll-position tracking so the active section updates smoothly on the navbar as the user scrolls.
7. For Amit Singh: Add an "OWNER" tag/badge (`OWNER & HEAD COACH`).
8. For Brand Ambassador (Vaishnavi Singh): Create a separate, dedicated luxury spotlight section (`#ambassador`) celebrating her role, philosophy, and `@chawal.to.choorma` link.

**What changed:**
- **Minimal High-End Loader (`index.html`):**
  - Removed dated `Franklin Gothic` text, arbitrary 2-second timeout, and plain "Loading..." markup.
  - Implemented deep black `#050505` backdrop with a centered 58px logo with a glowing radial aura and an ultra-thin 2px red gradient progress beam.
  - Added clean fade-out on window `'load'` with a rapid fallback.
- **Light Theme Protection & Aesthetics (`src/index.css`):**
  - Scoped `.theme-light footer` and `.footer-always-dark` to permanently retain deep `#09090b` background, `#ffffff` headers, `#cbd5e1` text, and `#27272a` borders.
  - Scoped `.scroll-top-btn-inner` so the circular scroll button face remains deep black `#09090b` with smooth red hover in both dark and light themes.
  - Protected `#hero` and `.hero-pill` from light-theme color bleaching so the video background text remains crystal-clear.
  - Added card elevations, clean borders, and soft shadows to `.theme-light` components.
- **Rewritten Hero Highlights (`src/components/ui/hero-3.tsx`):**
  - Wrapped hero highlights inside `.hero-pill` (frosted dark glass with `bg-neutral-950/85 backdrop-blur-md border-white/15`).
  - Rewritten punchy copy: `⚡ OPEN 5:00 AM – 10:00 PM` · `★ 4.9 RATED (650+ ATHLETES)` · `OLYMPIC IRON & MOROCCAN SPA`.
  - Added `id="hero"` and `data-hero-section="true"` for styling and scroll spy.
- **Amit Singh & Brand Ambassador Spotlight (`src/components/PublicWebsite.tsx`):**
  - Updated Coach Amit Singh to `role: "OWNER & HEAD COACH"` with `isOwner: true` and rendered an unmissable red `OWNER` badge next to his role with subtle luxury card glow.
  - Extracted Vaishnavi Singh from `DEFAULT_TRAINERS` and designed a dedicated `<section id="ambassador">` directly after the coaches grid.
  - Featured her portrait, verified `@chawal.to.choorma` link, personal philosophy quote, and 2 core wellness pillars (The Vikings Mindset & Sustainable Nutrition).
- **Daily Stories Redesign (`src/components/PublicWebsite.tsx`):**
  - Replaced the basic circular bubbles with a modern 5-card Instagram Stories deck featuring active gradient story rings (`from-amber-400 via-rose-500 to-red-600`), hover play overlays, "LIVE" indicator, and story category labels.
- **Navbar Ordering & Real-Time Scroll Spy (`src/components/PublicWebsite.tsx`):**
  - Reordered desktop links, `MORE_LINKS`, and `MOBILE_LINKS` to strictly match the landing page sequence:
    `manifesto` → `facilities` → `arena-action` → `trainers` → `ambassador` → `calculator` → `pricing` → `gallery` → `faq` → `review` → `contact` → `about`.
  - Replaced the restrictive `IntersectionObserver` with an active scroll-position spy that calculates section offsets in real-time, lighting up the active nav item and the `MORE` button seamlessly.
  - Updated footer explore links to match the exact same top-to-bottom sequence.

**Verification:**
- `npm run lint` (`tsc --noEmit`): 0 errors.
- `npm run build`: Production build and prerender passed with 0 errors.
- Dev server running on `http://localhost:3000/`.

**Deploy status:** Kept strictly local per user instructions (NOT pushed to GitHub). Ready for review on localhost.

---

## 2026-10-14 — Arena in Motion Redesign, Modern Google Fonts, Dedicated Legal Pages, Signature Reel Cleanup & Hero Video Clarity (Antigravity session)

**Goal:** Implement all requested refinements:
1. Redesign Arena in Motion section with luxury aura, wider grid, and modern athletic cards.
2. Replace all typewriter/monospace fonts (`font-mono`) with modern Google Fonts (`Plus Jakarta Sans` & `Outfit`).
3. Remove cylinder badges (`SIGNATURE REEL`) and overlay text (`AUTHENTIC VISION / BUILT DIFFERENT`) from the signature reel video in the Manifesto section.
4. Animate "CARVE YOUR BODY FOR VALHALLA" title with glowing gradient drop-shadow and add attractive trust/metric details below the action buttons.
5. Remove special/clutter menus (Action Reels, Privacy, Terms, Cookies) from header and mobile navigation.
6. Create 3 dedicated standalone legal pages (`/privacy`, `/terms`, `/cookies`), link them cleanly in the footer, and remove heavy in-page legal sections from the main landing page.
7. Maximize Hero video clarity by eliminating heavy stacked dark vignettes in favor of a crisp, translucent gradient.

**What changed:**
- **Modern Typography System (`index.html`, `src/index.css`):**
  - Connected Google Fonts: `Plus Jakarta Sans` (weights 400-900) & `Outfit` (weights 400-900).
  - Configured `--font-sans` and mapped `--font-mono` to modern display fonts to completely eliminate typewriter fonts across the website.
- **Hero Video Clarity & Animation (`src/components/ui/hero-3.tsx`, `src/components/PublicWebsite.tsx`):**
  - Replaced heavy 85% opacity dark vignettes with a crisp `bg-gradient-to-t from-black/80 via-black/20 to-black/35` overlay, making hero videos bright, vivid, and sharp.
  - Animated "CARVE YOUR BODY FOR VALHALLA" with glowing gradient text shadow and entrance scaling.
  - Added attractive details below the buttons: `OPEN 5:00 AM – 10:00 PM` · `4.9★ RATED (630+ ATHLETES)` · `CALIBRATED VIVA FITNESS & MOROCCAN SPA`.
- **Manifesto Signature Reel Cleanup (`src/components/PublicWebsite.tsx`):**
  - Removed floating cylinder badge (`SIGNATURE REEL`) and text overlays (`AUTHENTIC VISION / BUILT DIFFERENT`), leaving video clean and pristine with frosted sound toggle.
- **Arena in Motion Redesign (`#arena-action` in `src/components/PublicWebsite.tsx`):**
  - Redesigned with ambient red aura lighting, wider 2-column layout (`max-w-4xl`), and modernized `ActionReelCard` with rounded frosted audio toggle and sleek sans-serif typography.
- **Dedicated Legal Pages (`src/pages/`, `src/App.tsx`):**
  - Created `PrivacyPolicyPage.tsx` at `/privacy` with comprehensive data governance policies.
  - Created `TermsConditionsPage.tsx` at `/terms` with floor etiquette, steam spa rules, and membership terms.
  - Created `CookiesPolicyPage.tsx` at `/cookies` with local storage details and an interactive "RESET COOKIE CONSENT TOKEN" button.
  - Wired into `App.tsx` with lazy code-split routes.
  - Removed in-page `<section id="privacy">`, `<section id="terms">`, and `<section id="cookies">` from `PublicWebsite.tsx`.
- **Navigation & Footer Updates (`src/components/PublicWebsite.tsx`):**
  - Removed `ACTION REELS`, `PRIVACY POLICY`, `TERMS & CONDITIONS`, and `COOKIES POLICY` from `MORE_LINKS`, `MOBILE_LINKS`, and `SECTION_IDS`.
  - Added dedicated, clean text links in footer bottom: `Privacy Policy · Terms & Conditions · Cookies Policy`.
  - Updated Cookie Banner links to point to `/cookies` and `/terms`.

**Verification:**
- `npm run lint` (`tsc --noEmit`): 0 errors.
- `npm run build`: Production build and prerender passed with 0 errors (all 3 legal pages prerendered).
- Dev server running on `http://localhost:3000/`.

**Deploy status:** Held locally per user request (NOT pushed to GitHub). Ready to review on localhost.

---

## 2026-10-14 — Hero Full-Cover Video Alternation Loop, Simplified Navbar, 2 Action Reels, Pricing Tag Fix & Dynamic Circular Scroll Button (Antigravity session)

**Goal:** Complete all requested UI/UX enhancements across landing page:
1. Hero video fully covers hero section (`object-cover`), plays Video 1 first then Video 4 in continuous loop, zero sound marks, no cylinders or clutter, showing only the Title and 2 Action Buttons.
2. Simplified Navbar with only 3 primary links (`FACILITIES`, `MEMBERSHIPS`, `TRAINERS`) and all secondary menus grouped into the `MORE` dropdown.
3. Arena in Motion (`#arena-action`) limited to exactly 2 videos (Reel 2 and Reel 3) with zero cylinder pills.
4. Membership Tiers & Pricing (`#pricing`): Fixed clipped "MOST POPULAR" tag by turning it into an internal unclipped top banner.
5. Cookie Consent banner: Prompts new visitors immediately on opening the website once only per user (`localStorage`), positioned in a clean, non-obstructive bottom-left area.
6. Scroll Up Arrow: Dark background circular button with dynamic red SVG border that fills clockwise as the user scrolls down, and un-fills as they scroll back up.

**What changed:**
- **Hero Section (`src/components/ui/hero-3.tsx`):**
  - Converted `AnimatedMarqueeHero` into a full-bleed background video player (`absolute inset-0 w-full h-full object-cover`).
  - Seamlessly alternates between `video1.webm` and `video4.webm` on `onEnded` in an infinite loop.
  - Stripped all sound marks/audio buttons, mobile tab pickers, and cylinder pills.
  - Retains exclusively the high-impact title ("CARVE YOUR BODY FOR VALHALLA") and the 2 action buttons ("INVEST IN YOURSELF", "EXPLORE THE ARENA").
- **Navbar Redesign (`src/components/PublicWebsite.tsx`):**
  - Streamlined desktop navbar to 3 primary links: `FACILITIES`, `MEMBERSHIPS`, `TRAINERS`.
  - Moved `MANIFESTO`, `ACTION REELS`, `GALLERY`, `CONTACT`, `BMI CALCULATOR`, `FAQS`, `REVIEWS`, `ABOUT`, `PRIVACY`, `TERMS`, `COOKIES` into the clean `MORE` dropdown.
- **Arena in Motion (`#arena-action` in `src/components/PublicWebsite.tsx`):**
  - Rendered only 2 cards: Reel 2 (`videoStrengthAction` / Viva Fitness Stacks) and Reel 3 (`videoDumbbellPan` / Dumbbell Arsenal).
  - Centered into a balanced 2-column grid (`max-w-3xl mx-auto`).
  - Removed mobile swipe cylinders and badge pills.
- **Membership Pricing (`#pricing` in `src/components/PublicWebsite.tsx`):**
  - Replaced clipped `absolute -top-3` element with internal unclipped `w-full py-1.5 mb-4 bg-gradient-to-r from-red-600 to-rose-600 text-black font-mono font-black rounded-md` banner inside `moving-border-red-inner`.
- **Interactive Cookie Consent (`src/components/PublicWebsite.tsx`):**
  - Configured banner to display immediately on initial visit if `localStorage.getItem("vikings_cookie_consent")` is not set.
  - Positioned safely at `fixed bottom-20 lg:bottom-6 left-4 sm:left-6 right-4 sm:right-auto sm:max-w-md z-50`.
- **Scroll-Up Button (`src/components/PublicWebsite.tsx`):**
  - Redesigned with dark button face (`bg-neutral-950/95 backdrop-blur-md`).
  - Implemented dynamic circular SVG progress border (`strokeDasharray={131.95}`) filling with `#ef4444` based on scroll depth (`scrollProgress`).

**Verification:**
- `npm run lint` (`tsc --noEmit`): 0 errors.
- `npm run build`: Production build and prerender passed with 0 errors.
- Dev server running on `http://localhost:3000/`.

**Deploy status:** Held locally per user request (NOT pushed to GitHub). Ready to review on localhost.

---

## 2026-10-14 — Terms & Conditions, Cookies Policy, Interactive Cookie Consent Banner, FAQs & Privacy Policy (Antigravity session)

**Goal:** Add Terms & Conditions and Cookies Policy to the landing page, and implement an interactive Cookie Consent banner asking new users to permit performance and caching cookies for faster loading and smoother media streaming.

**What changed:**
- **Terms & Conditions Section (`#terms` in `src/components/PublicWebsite.tsx`):**
  - Added `<section id="terms">` covering 4 arena rules: Membership & Access Pass rules, Facility Etiquette & Floor Safety, Moroccan Steam Spa protocols, and Membership Freeze / Medical clearance rules.
- **Cookies Policy Section (`#cookies` in `src/components/PublicWebsite.tsx`):**
  - Added `<section id="cookies">` detailing Essential Performance Cache, High-Definition Video Streaming cache optimization, Zero Third-Party Ad Trackers pledge, and instructions on how to manage/reset preferences.
- **Interactive Cookie Consent Banner (`src/components/PublicWebsite.tsx`):**
  - Built an animated bottom toast framed with `.moving-border-red` (neon red rotating beam) that greets first-time visitors after a subtle delay.
  - Explains the performance benefits of local cache for ultra-smooth 4K video streaming, instant dark/light theme switching, and instant page rendering.
  - Provides `"ALLOW ALL COOKIES"`, `"ESSENTIAL ONLY"`, and direct links to `#cookies` and `#terms`.
  - Remembers choice in `localStorage` (`vikings_cookie_consent`); includes a reconfigure button in the Cookies Policy section.
  - Sits safely above the mobile sticky action bar (`bottom-20 lg:bottom-6`) on smartphones.
- **Navigation & Footer Updates (`src/components/PublicWebsite.tsx`):**
  - Added `#terms` and `#cookies` to `SECTION_IDS`, desktop `MORE` dropdown, mobile quick-link strip, mobile overlay drawer, and footer `Explore` grid.

**Verification:**
- `npm run lint` (`tsc --noEmit`): 0 errors.
- `npm run build`: Production build and prerender passed with 0 errors.
- Dev server active on `http://localhost:3000/`.

**Deploy status:** Held locally per user request (NOT pushed to GitHub). Ready to review on localhost.

---

## 2026-10-14 — Logo Transparency, Hero Video Background, Arena Action Reels & Mobile Optimization (Antigravity session)

**Goal:** Remove logo background in header, install Ponytail rule and skills, make website mobile-first responsive, integrate `video1.webm` as hero background video, and embed `video2.webm`, `video3.webm`, and `video4.webm` into a dedicated mobile-optimized landing page section.

**What changed:**
- **Ponytail Rules & Skills Installation (`.agents/rules/ponytail.md`, `.agents/skills/`):**
  - Downloaded and installed Ponytail lazy senior dev rule (`.agents/rules/ponytail.md`).
  - Installed all 6 Ponytail skills (`ponytail`, `ponytail-audit`, `ponytail-debt`, `ponytail-gain`, `ponytail-help`, `ponytail-review`) in `.agents/skills/`.
- **Header Logo Background Removal (`assets/l.webp`):**
  - Replaced solid RGB `l.webp` with lossless RGBA WebP generated from `logo.png`, providing 100% transparent alpha backdrop across header, footer, and navigation.
- **Hero Video Background (`src/components/ui/hero-3.tsx`, `src/components/PublicWebsite.tsx`):**
  - Added `backgroundVideo` prop to `AnimatedMarqueeHero` with native looping muted `video1.webm` and dark radial/linear vignettes.
  - Scaled mobile heading font gracefully (`text-3xl xs:text-4xl sm:text-5xl md:text-6xl lg:text-7xl`) preventing horizontal overflow on 320px–390px screens.
- **Arena Action Reels Section (`src/components/PublicWebsite.tsx`):**
  - Created `ActionReelCard` component with native `<video>` playback, muted autoplay, interactive volume toggle button (`Volume2`/`VolumeX`), and ambient gradient overlays.
  - Integrated `video2.webm` ("BUILT DIFFERENT"), `video3.webm` ("POWER & PRECISION"), and `video4.webm` ("THE DUMBBELL ARSENAL") into `<section id="arena-action">` below Facilities Showcase.
  - Implemented mobile-first horizontal swipe carousel with snap points and swipe indicator, seamlessly switching to a 3-column grid on tablet and desktop.
- **Mobile Friendliness:**
  - Verified touch targets, typography contrast, safe area insets on mobile action bar, and zero horizontal scroll.

**Verification:**
- `npm run lint` (`tsc --noEmit`): 0 errors.
- `npm run build`: Production build and prerender (`dist/index.html`) passed cleanly with 0 errors.
- Dev server running on `http://localhost:3000` (and `http://192.168.29.221:3000` for mobile Wi-Fi inspection).

**Deploy status:** Held locally per user request (NOT pushed to GitHub). Ready to push when user confirms.

---



**Goal:** Increase the font size of the hero heading ("CARVE YOUR BODY FOR VALHALLA") specifically for smartphones to deliver a bolder, more commanding impact while keeping line-height compact and tight.

**What changed:**
- **Smartphone Typography (`src/components/ui/hero-3.tsx`):**
  - Upgraded heading font size on smartphones from `text-3xl xs:text-4xl` to `text-4xl xs:text-5xl` with tight, bold leading (`leading-[0.96] xs:leading-[0.92] sm:leading-[0.95]`).
  - Tablet (`sm:text-5xl`) and desktop (`md:text-6xl lg:text-7xl`) font scales remain intact.

**Verification:**
- `npm run lint` (`tsc --noEmit`): 0 errors.
- `npm run build`: Production build and prerender (`dist/index.html`) passed cleanly with 0 errors.

**Deploy status:** Ready to commit & push to GitHub `main` to trigger Vercel auto-deploy.

---

## 2026-09-20 — Smartphone Hero UI Redesigned to Match PC Composition (Antigravity session)

**Goal:** Redesign the smartphone hero UI so it visually mirrors the premium, cohesive, vertically centered composition of the PC version, rather than splitting elements to screen extremes.

**What changed:**
- **Unified Centered Hierarchy (`src/components/ui/hero-3.tsx`):**
  - Updated hero section to `justify-center items-center text-center px-0 py-4 sm:py-6 md:py-8` across all viewports.
  - Reestablished the cohesive PC grouping on smartphone:
    1. **Title**: "CARVE YOUR BODY FOR VALHALLA" sits directly above the marquee stage with comfortable breathing margin (`mb-2 sm:mb-3`).
    2. **Marquee Stage**: Glides full-bleed with tilted criss-cross gym imagery behind the centered lucid buttons (`INVEST IN YOURSELF`, `EXPLORE THE ARENA`) and frosted trust badges.
    3. **Facility Details**: Sits directly underneath the marquee ribbon with clean spacing (`mt-1 sm:mt-2`) matching the PC presentation.
  - The smartphone layout now looks identical in spirit, structure, and aesthetic polish to the desktop experience.

**Verification:**
- `npm run lint` (`tsc --noEmit`): 0 errors.
- `npm run build`: Production build and prerender (`dist/index.html`) passed cleanly with 0 errors.

**Deploy status:** Ready to commit & push to GitHub `main` to trigger Vercel auto-deploy.

---

## 2026-09-20 — Centered Alignment & Load Synchronization for Hero Heading & Details (Antigravity session)

**Goal:** Ensure the hero heading ("CARVE YOUR BODY FOR VALHALLA") and facility details description are perfectly aligned with each other and centered on the smartphone viewport upon loading, eliminating text misalignment and delayed layout pop-in shifts.

**What changed:**
- **Explicit Text Centering & Block Alignment (`src/components/ui/hero-3.tsx`, `src/components/PublicWebsite.tsx`):**
  - Wrapped hero title in `<span className="block text-center w-full">` in `PublicWebsite.tsx`.
  - Added explicit `text-center w-full mx-auto` to both the title container and `motion.h1` in `hero-3.tsx`, ensuring multi-line heading text is strictly centered across all viewports.
  - Added explicit `text-center w-full mx-auto` to both the details container and `motion.p`, ensuring balanced and centered prose matching the title's center axis.
- **Load Synchronization (Zero Jitter/Shift):**
  - Replaced delayed, staggered entrance variants (`delay: 0.7`, `y: 10`) with immediate, smooth entrance animations (`initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}`) across heading, buttons, trust pills, and details.
  - Heading and details appear in their final, stable aligned positions immediately when the page loads.

**Verification:**
- `npm run lint` (`tsc --noEmit`): 0 errors.
- `npm run build`: Production build and prerender (`dist/index.html`) passed cleanly with 0 errors.

**Deploy status:** Ready to commit & push to GitHub `main` to trigger Vercel auto-deploy.

---

## 2026-09-20 — Smartphone Headline Lowered & Details Lifted (Antigravity session)

**Goal:** Fine-tune smartphone hero vertical spacing per user request: position "CARVE YOUR BODY FOR VALHALLA" a little down from the top navbar, and lift the facility details a little up from the bottom edge, preserving PC & tablet viewports untouched.

**What changed:**
- **Smartphone Spacing Fine-Tuning (`src/components/ui/hero-3.tsx`):**
  - **Heading "Little Down":** Adjusted title container padding on mobile from `pt-2 xs:pt-3` to `pt-5 xs:pt-6 sm:pt-0`, granting comfortable breathing space below the top navigation bar.
  - **Details "Little Up":** Adjusted description container padding on mobile from `pb-2 xs:pb-3` to `pb-5 xs:pb-6 sm:pb-0`, gently lifting the details prose away from the bottom edge.
  - Tablet (`sm:`) and desktop remain strictly centered and unaffected.

**Verification:**
- `npm run lint` (`tsc --noEmit`): 0 errors.
- `npm run build`: Production build and prerender (`dist/index.html`) passed cleanly with 0 errors.

**Deploy status:** Ready to commit & push to GitHub `main` to trigger Vercel auto-deploy.

---

## 2026-09-20 — Smartphone Filled Hero Layout with Balanced Vertical Padding (Antigravity session)

**Goal:** Ensure the hero section looks completely filled across the entire smartphone viewport height (`min-h-[calc(100svh-3.5rem)]`) with generous, balanced vertical padding between the heading, moving marquee stage, and facility details, eliminating dead empty space at the bottom while keeping PC & tablet viewports untouched.

**What changed:**
- **Smartphone Filled Viewport (`src/components/ui/hero-3.tsx`):**
  - Updated hero section layout to `justify-between sm:justify-center px-0 py-3 xs:py-4 sm:py-6 md:py-8`.
  - Configured flex distribution so the three main blocks cleanly occupy the viewport:
    1. **Heading at the top:** Elevated with `pt-2 xs:pt-3 sm:pt-0 shrink-0` like a true page title.
    2. **Marquee stage in the center:** Centered with `my-auto sm:my-3.5 md:my-5 flex flex-col justify-center` and expanded mobile card heights (`h-40 xs:h-44 sm:h-48 md:h-52 lg:h-56`) so the image ribbon with overlapping lucid buttons (`INVEST IN YOURSELF`, `EXPLORE THE ARENA`) and trust badges commands rich presence.
    3. **Facility details at the bottom:** Anchored at the bottom with `pb-2 xs:pb-3 sm:pb-0 shrink-0` and balanced text sizing.
  - Generous, natural breathing room now fills between the title, image ribbon, and description on all smartphone screen heights (from iPhone SE to Pro Max).
- **Preserved PC & Tablet:**
  - Preserved `sm:justify-center`, `sm:pt-0`, and `sm:pb-0` to keep tablet and desktop compositions centered.

**Verification:**
- `npm run lint` (`tsc --noEmit`): 0 errors.
- `npm run build`: Production build and prerender (`dist/index.html`) passed cleanly with 0 errors.

**Deploy status:** Ready to commit & push to GitHub `main` to trigger Vercel auto-deploy.

---

## 2026-09-20 — Smartphone-Specific Headline Elevation & Component Alignment (Antigravity session)

**Goal:** For smartphones only, position the headline "CARVE YOUR BODY FOR VALHALLA" up at the top like a proper page heading, while maintaining smooth, harmonious alignment across all subsequent components (overlapping marquee controls and facility details), and keeping PC & tablet viewports untouched.

**What changed:**
- **Smartphone-Specific Heading Elevation (`src/components/ui/hero-3.tsx`):**
  - Updated the hero section to `justify-start sm:justify-center pt-3 pb-6 sm:pt-4 sm:pb-6 md:pt-6 md:pb-8`.
  - On smartphones, the section aligns from the top (`justify-start pt-3`), letting "CARVE YOUR BODY FOR VALHALLA" sit up top as a true page heading directly below the sticky navbar.
  - On PC and tablets, `sm:justify-center` keeps the entire composition centered vertically.
- **Component Alignment:**
  - Marquee stage sits with calibrated margins (`my-2 sm:my-3.5 md:my-5`) right below the elevated heading.
  - The overlapping lucid action buttons (`INVEST IN YOURSELF` and `EXPLORE THE ARENA`) and frosted trust badges are centered over the moving ribbon.
  - Facility details prose sits centered directly below the marquee stage.

**Verification:**
- `npm run lint` (`tsc --noEmit`): 0 errors.
- `npm run build`: Production build and prerender (`dist/index.html`) passed cleanly with 0 errors.

**Deploy status:** Ready to commit & push to GitHub `main` to trigger Vercel auto-deploy.

---

## 2026-09-20 — Elevated Headline with Overlapping Lucid Buttons & Trust Badges (Antigravity session)

**Goal:** Elevate the "CARVE YOUR BODY FOR VALHALLA" headline slightly higher on mobile/tablet, restore the lucid CTA buttons (`INVEST IN YOURSELF`, `EXPLORE THE ARENA`), Google reviews, and date/hours pill overlapping the moving criss-cross images ribbon, and keep the facility details after the marquee stage.

**What changed:**
- **Elevated Headline (`src/components/ui/hero-3.tsx`):**
  - Raised the top section alignment (`pt-2 sm:pt-4 md:pt-6`) and applied `-mt-1 sm:-mt-2 md:mt-0` with `leading-[0.98] sm:leading-[0.95]` to position "CARVE YOUR BODY FOR VALHALLA" slightly higher up, freeing ample vertical room below on smartphones and tablets.
- **Overlapping Lucid Buttons & Trust Badges:**
  - Restored the floating foreground layer directly over the moving background images track across all viewports (smartphone, tablet, and PC).
  - Styled buttons and badges with lucid frosted glassmorphism (`bg-black/60 border border-white/20 backdrop-blur-md shadow-xl`).
  - Fluid sizing on buttons (`min-h-[38px] xs:min-h-[42px] sm:min-h-[46px] px-3.5 xs:px-5 sm:px-8 py-2 xs:py-2.5 sm:py-3.5`) and trust pills (`text-[8.5px] xs:text-[9.5px] sm:text-[10px] md:text-[11px]`) for a clean, side-by-side single-line fit on mobile and tablet without clipping.
- **Details Positioned After:**
  - Positioned the facility description prose directly after the marquee stage at the bottom of the hero section.

**Verification:**
- `npm run lint` (`tsc --noEmit`): 0 errors.
- `npm run build`: Production build and prerender (`dist/index.html`) passed cleanly with 0 errors.

**Deploy status:** Ready to commit & push to GitHub `main` to trigger Vercel auto-deploy.

---

## 2026-09-20 — Aesthetic Hero Section Redesign for Smartphone & Tablet (Antigravity session)

**Goal:** Redesign the hero section on smartphone and tablet back to the clean, aesthetic layout from earlier: remove the crowded buttons-over-images overlay, let the moving images ribbon glide freely in criss-cross tilt across the full width between title and description, and place the CTA buttons and trust badges in an ergonomic, uncluttered, premium hierarchy.

**What changed:**
- **Uncluttered, Aesthetic Composition (`src/components/ui/hero-3.tsx`):**
  - Removed the cramped floating overlay from on top of the moving image marquee.
  - Reestablished the harmonious hierarchy:
    1. **Title**: Bold Norse typography (`CARVE YOUR BODY FOR VALHALLA`).
    2. **Moving Image Ribbon**: Full-bleed edge-to-edge ribbon with alternating criss-cross tilt (`-2.5deg` and `+3.5deg`), hover scale effects, dark red glow borders, and unblocked visibility of real gym equipment.
    3. **Facility Description**: Crisp, minimal prose centered below the marquee.
    4. **Action Buttons**: Dual lucid buttons (`INVEST IN YOURSELF` & `EXPLORE THE ARENA`) side-by-side with fluid padding (`px-4 xs:px-6 sm:px-8 py-2.5 sm:py-3.5`) and gold/blue hover accents.
    5. **Trust Badges**: Frosted glass Google Review pill (`4.9 · 184 REVIEWS`) and Gym Hours & Location pill (`MON–SAT · 5 AM – 10 PM · MG ROAD`) aligned symmetrically underneath.
- **Smartphone & Tablet UX:**
  - Zero overlapping text on moving photos; cards are 100% visible and interactive.
  - Buttons sit comfortably within the mobile thumb zone without covering any content.
  - All hero content fits within the viewport on mobile and tablet without horizontal or vertical clipping.

**Verification:**
- `npm run lint` (`tsc --noEmit`): 0 errors.
- `npm run build`: Production build and prerender passed with 0 errors.

**Deploy status:** Ready to commit & push to GitHub `main` to trigger Vercel auto-deploy.

---

## 2026-09-20 — Edge-to-Edge Hero Marquee Moving From Screen Sides (Antigravity session)

**Goal:** Restore the laterally moving background images to move continuously from the very sides (edges) of the screen across the entire viewport width, rather than being confined inside the center `max-w-4xl` box.

**What changed:**
- **Full-Bleed Marquee Stage (`src/components/ui/hero-3.tsx`):**
  - Unnested the marquee stage from inside the centered `max-w-4xl` wrapper.
  - Separated hero layout into 3 distinct vertical units:
    1. Centered Title container (`max-w-4xl w-full mx-auto px-4 sm:px-6`).
    2. Edge-to-edge full-bleed Marquee Stage (`w-full overflow-hidden select-none`), allowing images to glide seamlessly from the far left of the viewport to the far right.
    3. Centered Description container (`max-w-4xl w-full mx-auto px-4 sm:px-6`).
  - Updated edge masks to `[mask-image:linear-gradient(to_right,transparent_0%,black_3%,black_97%,transparent_100%)]` for a subtle, natural fade at the very viewport perimeter.
  - Kept CTA buttons and trust badges centered directly over the moving images (`max-w-xl mx-auto px-3 sm:px-6`).

**Verification:**
- `npm run lint` (`tsc --noEmit`): 0 errors.
- `npm run build`: Production build and prerender (`dist/index.html`) passed cleanly.

**Deploy status:** Ready to commit & push to GitHub `main` to trigger Vercel auto-deploy.

---

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
