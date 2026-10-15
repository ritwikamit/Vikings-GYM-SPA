import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { ArrowLeft, Cookie, Zap, HardDrive, ShieldCheck, RefreshCw, Check } from "lucide-react";
import PublicNavbar from "../components/PublicNavbar";
import logoPremium from "../../assets/l.webp";
import { receptionDeskWorkstation } from "../assets/gymImages";

export default function CookiesPolicyPage() {
  const [resetFeedback, setResetFeedback] = useState(false);

  const handleResetCookies = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("vikings_cookie_consent");
      setResetFeedback(true);
      setTimeout(() => setResetFeedback(false), 3500);
    }
  };

  return (
    <div className="bg-black text-gray-200 min-h-screen font-sans selection:bg-red-600 selection:text-white flex flex-col">
      {/* Full Interactive Navigation Bar */}
      <PublicNavbar />

      {/* Hero Header with Landscaped Photo Background & Dark Overlay */}
      <header className="subpage-hero relative py-14 sm:py-20 px-4 sm:px-6 border-b border-red-950/40 overflow-hidden" data-subpage-hero="true">
        {/* Landscaped Background Image (No Zoom) */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          <img
            src={receptionDeskWorkstation}
            alt="Vikings Check-in & Workstation"
            width="1920"
            height="500"
            decoding="async"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-black/45" />
          <div className="absolute inset-y-0 left-0 w-20 sm:w-48 md:w-72 bg-gradient-to-r from-black via-black/65 to-transparent pointer-events-none" />
          <div className="absolute inset-y-0 right-0 w-20 sm:w-48 md:w-72 bg-gradient-to-l from-black via-black/65 to-transparent pointer-events-none" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: -60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="relative z-10 max-w-4xl mx-auto text-center"
        >
          <div className="inline-flex items-center gap-2 text-red-500 font-sans text-xs font-bold uppercase tracking-widest mb-3">
            <Cookie className="w-4 h-4 text-red-500" />
            LOCAL PERFORMANCE & DATA STORAGE
          </div>
          <h1 className="text-3xl sm:text-5xl font-sans font-black text-white uppercase tracking-tight mb-4 drop-shadow-[0_4px_24px_rgba(0,0,0,0.95)]">
            COOKIES & STORAGE POLICY
          </h1>
          <p className="text-gray-200 text-sm sm:text-base max-w-xl mx-auto leading-relaxed drop-shadow-[0_2px_10px_rgba(0,0,0,0.95)] font-medium">
            How Vikings Gym & Spa utilizes localized browser caching and performance cookies to provide rapid page rendering, fluid video streaming, and responsive theme toggling.
          </p>
          <div className="w-16 h-1 bg-red-600 mx-auto mt-6 rounded shadow-[0_0_12px_rgba(239,68,68,0.7)]"></div>
        </motion.div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 py-10 sm:py-14 w-full">

        <div className="space-y-8 bg-neutral-950/60 border border-neutral-850 p-6 sm:p-10 rounded-2xl shadow-xl">
          {/* Section 1 */}
          <section className="space-y-3">
            <div className="flex items-center gap-3 text-red-500 font-sans text-base font-bold uppercase">
              <Zap className="w-5 h-5 shrink-0" />
              <h2>1. Essential Performance Caching</h2>
            </div>
            <p className="text-gray-300 text-sm leading-relaxed pl-8">
              We leverage modern browser local storage (<code className="text-red-400 bg-neutral-900 px-1.5 py-0.5 rounded text-xs">localStorage</code>) to store functional UI preferences, such as your dark/light visual theme choice, audio mute settings, and session credentials. This ensures your view doesn't revert to defaults every time you switch pages or refresh.
            </p>
          </section>

          {/* Section 2 */}
          <section className="space-y-3">
            <div className="flex items-center gap-3 text-red-500 font-sans text-base font-bold uppercase">
              <HardDrive className="w-5 h-5 shrink-0" />
              <h2>2. High-Definition Video Streaming & Asset Cache</h2>
            </div>
            <p className="text-gray-300 text-sm leading-relaxed pl-8">
              To deliver pristine 60FPS video reels and high-resolution facility images without constant network buffering, your browser caches lightweight .webm video assets and optimized WebP images locally. This drastically slashes data consumption on mobile networks and guarantees immediate playback.
            </p>
          </section>

          {/* Section 3 */}
          <section className="space-y-3">
            <div className="flex items-center gap-3 text-red-500 font-sans text-base font-bold uppercase">
              <ShieldCheck className="w-5 h-5 shrink-0" />
              <h2>3. Zero Third-Party Advertising Trackers</h2>
            </div>
            <p className="text-gray-300 text-sm leading-relaxed pl-8">
              Vikings Gym & Spa does not install third-party tracking pixels, cross-domain behavioral monitors, or data-broker trackers on your device. We respect your digital sovereignty; your interaction with our website remains strictly private between you and our application.
            </p>
          </section>

          {/* Section 4 */}
          <section className="space-y-3">
            <div className="flex items-center gap-3 text-red-500 font-sans text-base font-bold uppercase">
              <RefreshCw className="w-5 h-5 shrink-0" />
              <h2>4. Managing & Resetting Your Preferences</h2>
            </div>
            <p className="text-gray-300 text-sm leading-relaxed pl-8 mb-4">
              You can reconfigure or completely wipe your stored preferences at any time. When you click the button below, your saved cookie consent token is removed, and you will be prompted anew on your next visit to the homepage.
            </p>
            <div className="pl-8">
              <button
                onClick={handleResetCookies}
                className="px-5 py-2.5 rounded-lg bg-red-600 hover:bg-red-700 text-black font-sans font-bold text-xs uppercase tracking-wider transition-all cursor-pointer shadow-lg shadow-red-600/20 active:scale-95 flex items-center gap-2"
              >
                {resetFeedback ? (
                  <>
                    <Check className="w-4 h-4 text-black" />
                    PREFERENCES RESET SUCCESSFUL
                  </>
                ) : (
                  <>
                    <RefreshCw className="w-4 h-4 text-black" />
                    RESET COOKIE CONSENT TOKEN
                  </>
                )}
              </button>
              {resetFeedback && (
                <p className="text-xs text-emerald-400 mt-2 font-sans font-semibold">
                  ✓ Cookie consent reset. You will see the consent prompt upon visiting the main arena page.
                </p>
              )}
            </div>
          </section>

          <div className="pt-6 border-t border-neutral-850 flex items-center justify-between text-xs text-gray-500">
            <span>Governance: Digital Personal Data Protection Standards</span>
            <span>Policy Status: Active</span>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-neutral-900 bg-neutral-950 py-8 px-6 text-center text-xs text-gray-500">
        <div className="flex flex-wrap items-center justify-center gap-6 mb-4 font-sans font-bold text-gray-400">
          <Link to="/" className="hover:text-red-500 transition-colors">Home</Link>
          <span>·</span>
          <Link to="/privacy" className="hover:text-red-500 transition-colors">Privacy Policy</Link>
          <span>·</span>
          <Link to="/terms" className="hover:text-red-500 transition-colors">Terms & Conditions</Link>
          <span>·</span>
          <Link to="/cookies" className="text-red-500">Cookies Policy</Link>
        </div>
        <p>© {new Date().getFullYear()} Vikings Gym & Spa. All rights reserved.</p>
      </footer>
    </div>
  );
}
