import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import {
  Building2,
  Users,
  Crown,
  Camera,
  MoreHorizontal,
  ChevronDown,
  ArrowRight,
  Sun,
  Moon,
  Menu,
  X,
  ArrowLeft,
} from "lucide-react";
import logoPremium from "../../assets/l.webp";
import { GYM_CONFIG } from "../config/gym";

export interface PublicNavbarProps {
  activeSection?: string;
  onLoginClick?: () => void;
  showBackToArena?: boolean;
}

const MORE_ARENA_LINKS = [
  { id: "manifesto", label: "WARRIORS MANIFESTO" },
  { id: "calculator", label: "BMI POWER INDEX" },
  { id: "review", label: "REVIEWS & RATING" },
  { id: "faq", label: "WARRIOR PROTOCOL FAQ" },
  { id: "about", label: "HEADQUARTERS & HOURS" },
];

export default function PublicNavbar({
  activeSection = "",
  onLoginClick,
  showBackToArena = true,
}: PublicNavbarProps) {
  const location = useLocation();
  const isHome = location.pathname === "/";

  // Scrolled navbar cylindrical floating effect
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    let rafId: number | null = null;
    const onScroll = () => {
      if (rafId !== null) return;
      rafId = window.requestAnimationFrame(() => {
        setScrolled(window.scrollY > 24);
        rafId = null;
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (rafId !== null) window.cancelAnimationFrame(rafId);
    };
  }, []);

  // MORE dropdown state
  const [moreOpen, setMoreOpen] = useState(false);
  const moreRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!moreOpen) return;
    const onDown = (e: MouseEvent) => {
      if (moreRef.current && !moreRef.current.contains(e.target as Node)) {
        setMoreOpen(false);
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMoreOpen(false);
    };
    window.addEventListener("mousedown", onDown);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("keydown", onKey);
    };
  }, [moreOpen]);

  // Mobile menu drawer
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Theme state
  const [isLightMode, setIsLightMode] = useState<boolean>(() => {
    if (typeof window !== "undefined") {
      return (
        localStorage.getItem("vikings_theme") === "light" ||
        document.documentElement.classList.contains("theme-light")
      );
    }
    return false;
  });

  useEffect(() => {
    const handleThemeChange = (e: any) => {
      const nextTheme = e.detail?.theme === "light";
      setIsLightMode((prev) => (prev !== nextTheme ? nextTheme : prev));
    };
    window.addEventListener("vikings_theme_change", handleThemeChange);
    return () => window.removeEventListener("vikings_theme_change", handleThemeChange);
  }, []);

  const toggleTheme = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    const currentIsLight =
      typeof window !== "undefined"
        ? document.documentElement.classList.contains("theme-light") ||
          localStorage.getItem("vikings_theme") === "light"
        : isLightMode;
    const nextIsLight = !currentIsLight;

    if (typeof window !== "undefined") {
      try {
        localStorage.setItem("vikings_theme", nextIsLight ? "light" : "dark");
      } catch (err) {}

      document.documentElement.classList.toggle("theme-light", nextIsLight);
      document.body?.classList.toggle("theme-light", nextIsLight);

      const rootDiv = document.getElementById("top");
      if (rootDiv) {
        rootDiv.classList.toggle("theme-light", nextIsLight);
      }

      window.dispatchEvent(
        new CustomEvent("vikings_theme_change", { detail: { theme: nextIsLight ? "light" : "dark" } })
      );
    }

    setIsLightMode(nextIsLight);
  };

  const openWhatsApp = (msg: string) => {
    const url = `https://wa.me/${GYM_CONFIG.whatsapp}?text=${encodeURIComponent(msg)}`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const isMorePageActive =
    location.pathname === "/ambassador" ||
    location.pathname === "/contact" ||
    location.pathname === "/franchise";

  return (
    <>
      <header
        className={`sticky top-0 z-50 w-full transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] pointer-events-none ${
          scrolled ? "pt-2 sm:pt-3.5 px-3 sm:px-6" : "pt-0 px-0"
        }`}
      >
        <nav
          className={`pointer-events-auto transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] flex items-center justify-between ${
            scrolled
              ? "mx-auto max-w-6xl rounded-full border border-red-500/40 bg-neutral-950/92 backdrop-blur-2xl shadow-[0_12px_40px_rgba(0,0,0,0.85)] ring-1 ring-red-500/25 px-4 sm:px-6 h-14"
              : "w-full rounded-none border-b border-red-950/40 bg-black/85 backdrop-blur-xl shadow-none px-4 sm:px-8 h-[72px]"
          }`}
        >
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-2 sm:gap-3 shrink-0 group"
            aria-label="Vikings Gym & Spa — return to arena home"
          >
            <img src={logoPremium} alt="Vikings Logo" width="36" height="36" className="h-8 sm:h-9 w-auto shrink-0 group-hover:scale-105 transition-transform" />
            <span className="font-mono font-black text-white whitespace-nowrap leading-none sm:leading-normal">
              <span className="block sm:inline text-[13px] sm:text-lg tracking-tight sm:tracking-tighter">VIKINGS</span>{" "}
              <span className="block sm:inline text-[10px] sm:text-lg tracking-[0.12em] sm:tracking-tighter text-red-500">GYM &amp; SPA</span>
            </span>
          </Link>

          {/* Desktop Nav Items */}
          <div className="hidden lg:flex items-center gap-1.5 xl:gap-2">
            {/* 1. Facilities */}
            <Link
              to="/facilities"
              className={`group relative flex items-center gap-2 py-2 px-3 rounded-xl border transition-all duration-300 cursor-pointer ${
                location.pathname === "/facilities"
                  ? "border-red-500/50 bg-neutral-900/90 text-white"
                  : "border-transparent hover:border-red-500/40 hover:bg-neutral-900/80 text-gray-300 hover:text-white"
              }`}
              title="Facilities"
            >
              <Building2 className="w-4 h-4 text-red-500 group-hover:scale-110 transition-transform duration-200 shrink-0" />
              <span className={`overflow-hidden whitespace-nowrap transition-all duration-300 ease-out text-xs font-sans font-bold tracking-[0.14em] ${
                location.pathname === "/facilities"
                  ? "max-w-[130px] opacity-100"
                  : "max-w-0 opacity-0 group-hover:max-w-[130px] group-hover:opacity-100"
              }`}>
                FACILITIES
              </span>
            </Link>

            {/* 2. Trainers */}
            <Link
              to="/trainers"
              className={`group relative flex items-center gap-2 py-2 px-3 rounded-xl border transition-all duration-300 cursor-pointer ${
                location.pathname === "/trainers"
                  ? "border-red-500/50 bg-neutral-900/90 text-white"
                  : "border-transparent hover:border-red-500/40 hover:bg-neutral-900/80 text-gray-300 hover:text-white"
              }`}
              title="Trainers"
            >
              <Users className="w-4 h-4 text-red-500 group-hover:scale-110 transition-transform duration-200 shrink-0" />
              <span className={`overflow-hidden whitespace-nowrap transition-all duration-300 ease-out text-xs font-sans font-bold tracking-[0.14em] ${
                location.pathname === "/trainers"
                  ? "max-w-[130px] opacity-100"
                  : "max-w-0 opacity-0 group-hover:max-w-[130px] group-hover:opacity-100"
              }`}>
                TRAINERS
              </span>
            </Link>

            {/* 3. Memberships */}
            <Link
              to="/memberships"
              className={`group relative flex items-center gap-2 py-2 px-3 rounded-xl border transition-all duration-300 cursor-pointer ${
                location.pathname === "/memberships"
                  ? "border-red-500/50 bg-neutral-900/90 text-white"
                  : "border-transparent hover:border-red-500/40 hover:bg-neutral-900/80 text-gray-300 hover:text-white"
              }`}
              title="Memberships"
            >
              <Crown className="w-4 h-4 text-red-500 group-hover:scale-110 transition-transform duration-200 shrink-0" />
              <span className={`overflow-hidden whitespace-nowrap transition-all duration-300 ease-out text-xs font-sans font-bold tracking-[0.14em] ${
                location.pathname === "/memberships"
                  ? "max-w-[130px] opacity-100"
                  : "max-w-0 opacity-0 group-hover:max-w-[130px] group-hover:opacity-100"
              }`}>
                MEMBERSHIPS
              </span>
            </Link>

            {/* 4. Gallery */}
            <Link
              to="/gallery"
              className={`group relative flex items-center gap-2 py-2 px-3 rounded-xl border transition-all duration-300 cursor-pointer ${
                location.pathname === "/gallery"
                  ? "border-red-500/50 bg-neutral-900/90 text-white"
                  : "border-transparent hover:border-red-500/40 hover:bg-neutral-900/80 text-gray-300 hover:text-white"
              }`}
              title="Gallery"
            >
              <Camera className="w-4 h-4 text-red-500 group-hover:scale-110 transition-transform duration-200 shrink-0" />
              <span className={`overflow-hidden whitespace-nowrap transition-all duration-300 ease-out text-xs font-sans font-bold tracking-[0.14em] ${
                location.pathname === "/gallery"
                  ? "max-w-[130px] opacity-100"
                  : "max-w-0 opacity-0 group-hover:max-w-[130px] group-hover:opacity-100"
              }`}>
                GALLERY
              </span>
            </Link>

            {/* 5. More Dropdown */}
            <div
              ref={moreRef}
              className="relative"
              onMouseEnter={() => setMoreOpen(true)}
              onMouseLeave={() => setMoreOpen(false)}
            >
              <button
                onClick={() => setMoreOpen((v) => !v)}
                aria-haspopup="true"
                aria-expanded={moreOpen}
                className={`group relative flex items-center gap-2 py-2 px-3 rounded-xl border transition-all duration-300 cursor-pointer ${
                  moreOpen || isMorePageActive
                    ? "border-red-500/50 bg-neutral-900 text-white"
                    : "border-transparent hover:border-red-500/40 hover:bg-neutral-900/80 text-gray-300 hover:text-white"
                }`}
                title="More"
              >
                <MoreHorizontal className="w-4 h-4 text-red-500 group-hover:scale-110 transition-transform duration-200 shrink-0" />
                <span className={`overflow-hidden whitespace-nowrap transition-all duration-300 ease-out text-xs font-sans font-bold tracking-[0.14em] flex items-center gap-1 ${
                  moreOpen ? "max-w-[130px] opacity-100" : "max-w-0 opacity-0 group-hover:max-w-[130px] group-hover:opacity-100"
                }`}>
                  MORE
                  <ChevronDown className={`w-3 h-3 transition-transform duration-300 ${moreOpen ? "rotate-180" : ""}`} />
                </span>
              </button>

              <AnimatePresence>
                {moreOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    transition={{ duration: 0.18 }}
                    className="absolute right-0 top-full pt-3"
                  >
                    <div className="w-64 rounded-xl border border-neutral-800/80 bg-neutral-950/95 backdrop-blur-xl p-2.5 shadow-2xl shadow-black/80 space-y-1">
                      <div className="px-3 py-1 text-[10px] font-mono uppercase tracking-wider text-red-500 font-bold">
                        Dedicated Pages
                      </div>
                      <Link
                        to="/ambassador"
                        onClick={() => setMoreOpen(false)}
                        className={`flex items-center justify-between rounded-lg px-3 py-2 text-[12px] font-sans font-bold tracking-[0.12em] transition-colors ${
                          location.pathname === "/ambassador"
                            ? "bg-red-600/20 text-white"
                            : "text-gray-200 hover:bg-white/5 hover:text-white"
                        }`}
                      >
                        BRAND AMBASSADOR
                        <ArrowRight className="w-3.5 h-3.5 text-neutral-500" />
                      </Link>
                      <Link
                        to="/contact"
                        onClick={() => setMoreOpen(false)}
                        className={`flex items-center justify-between rounded-lg px-3 py-2 text-[12px] font-sans font-bold tracking-[0.12em] transition-colors ${
                          location.pathname === "/contact"
                            ? "bg-red-600/20 text-white"
                            : "text-gray-200 hover:bg-white/5 hover:text-white"
                        }`}
                      >
                        CONTACT &amp; LOCATION
                        <ArrowRight className="w-3.5 h-3.5 text-neutral-500" />
                      </Link>
                      <Link
                        to="/franchise"
                        onClick={() => setMoreOpen(false)}
                        className={`flex items-center justify-between rounded-lg px-3 py-2 text-[12px] font-sans font-bold tracking-[0.12em] transition-colors ${
                          location.pathname === "/franchise"
                            ? "bg-red-600/20 text-white"
                            : "text-gray-200 hover:bg-white/5 hover:text-white"
                        }`}
                      >
                        FRANCHISE PROPOSAL
                        <ArrowRight className="w-3.5 h-3.5 text-neutral-500" />
                      </Link>

                      <div className="my-1.5 h-px bg-white/5" />
                      <div className="px-3 py-1 text-[10px] font-mono uppercase tracking-wider text-neutral-500 font-bold">
                        Arena Sections
                      </div>
                      {MORE_ARENA_LINKS.map((l) => (
                        <a
                          key={l.id}
                          href={isHome ? `#${l.id}` : `/#${l.id}`}
                          onClick={() => setMoreOpen(false)}
                          className={`flex items-center justify-between rounded-lg px-3 py-1.5 text-[11px] font-sans font-bold tracking-[0.12em] transition-colors ${
                            activeSection === l.id
                              ? "bg-red-600/10 text-red-500"
                              : "text-gray-400 hover:bg-white/5 hover:text-white"
                          }`}
                        >
                          {l.label}
                          <span className={`h-1 w-1 rounded-full ${activeSection === l.id ? "bg-red-500" : "bg-transparent"}`} />
                        </a>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Right Action Icons & Buttons */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Quick Back to Arena on dedicated pages (desktop) */}
            {!isHome && showBackToArena && (
              <Link
                to="/"
                className="hidden xl:inline-flex items-center gap-1.5 text-[11px] font-sans font-bold text-gray-300 hover:text-white bg-neutral-900/80 hover:bg-neutral-800 px-3 py-1.5 rounded-lg border border-neutral-800 transition-all cursor-pointer"
                title="Return to Main Arena"
              >
                <ArrowLeft className="w-3.5 h-3.5 text-red-500" />
                ARENA
              </Link>
            )}

            {/* Portal login if enabled */}
            {onLoginClick && (
              <button
                onClick={onLoginClick}
                className="hidden sm:block text-xs font-mono font-bold text-gray-300 hover:text-white border border-gray-800 hover:border-gray-600 px-4 py-2 rounded-md transition-all cursor-pointer"
              >
                PORTAL LOGIN
              </button>
            )}

            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              aria-label={isLightMode ? "Switch to dark mode" : "Switch to light mode"}
              title={isLightMode ? "Switch to Dark Mode" : "Switch to Light Mode"}
              className="p-2 rounded-lg border border-white/10 hover:border-red-500/50 bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white transition-all cursor-pointer"
            >
              {isLightMode ? <Moon className="w-4 h-4 text-amber-500" /> : <Sun className="w-4 h-4 text-amber-400" />}
            </button>

            {/* Join Now CTA */}
            <button
              onClick={() => openWhatsApp("Hi Vikings Gym Team, I'd like to join Vikings Gym & Spa!")}
              className="inline-flex items-center h-9 sm:h-10 px-3 sm:px-6 bg-red-600 hover:bg-red-700 text-black font-mono font-black text-[10px] sm:text-xs tracking-[0.2em] rounded-md hover:scale-105 active:scale-95 transition-all shadow-lg shadow-red-600/20 cursor-pointer whitespace-nowrap"
            >
              JOIN NOW
            </button>

            {/* Mobile Hamburger Button */}
            <button
              className="lg:hidden text-white p-2 cursor-pointer hover:text-red-500 transition-colors"
              onClick={() => setIsMobileMenuOpen(true)}
              aria-label="Open navigation menu"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile Drawer Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-[60] bg-black/95 backdrop-blur-xl flex flex-col items-center justify-center pointer-events-auto"
          >
            <button
              className="absolute top-6 right-6 text-white p-2 cursor-pointer hover:text-red-500 transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
              aria-label="Close menu"
            >
              <X className="w-8 h-8" />
            </button>

            <div className="flex flex-col items-stretch text-center w-full max-w-xs px-6 text-sm font-bold font-sans overflow-y-auto max-h-[85vh] py-6">
              {/* Home / Arena Link */}
              <Link
                to="/"
                onClick={() => setIsMobileMenuOpen(false)}
                className={`py-2 px-3 rounded mb-2 text-xs uppercase tracking-widest transition-colors ${
                  isHome ? "bg-red-600 text-black font-black" : "bg-white/5 text-gray-200 hover:text-white hover:bg-red-600/20"
                }`}
              >
                Arena Home
              </Link>

              {/* Dedicated Pages Grid */}
              <div className="py-2 mb-3 border-b border-white/10 text-left">
                <span className="text-[10px] font-mono uppercase tracking-widest text-red-500 font-bold block mb-2">
                  Dedicated Pages
                </span>
                <div className="grid grid-cols-2 gap-1.5">
                  <Link
                    to="/facilities"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`px-2.5 py-1.5 rounded text-[11px] font-sans font-bold text-center transition-colors ${
                      location.pathname === "/facilities"
                        ? "bg-red-600/30 text-red-400 border border-red-500/50"
                        : "bg-white/5 text-gray-300 hover:text-white hover:bg-red-600/20"
                    }`}
                  >
                    Facilities
                  </Link>
                  <Link
                    to="/trainers"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`px-2.5 py-1.5 rounded text-[11px] font-sans font-bold text-center transition-colors ${
                      location.pathname === "/trainers"
                        ? "bg-red-600/30 text-red-400 border border-red-500/50"
                        : "bg-white/5 text-gray-300 hover:text-white hover:bg-red-600/20"
                    }`}
                  >
                    Trainers
                  </Link>
                  <Link
                    to="/memberships"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`px-2.5 py-1.5 rounded text-[11px] font-sans font-bold text-center transition-colors ${
                      location.pathname === "/memberships"
                        ? "bg-red-600/30 text-red-400 border border-red-500/50"
                        : "bg-white/5 text-gray-300 hover:text-white hover:bg-red-600/20"
                    }`}
                  >
                    Memberships
                  </Link>
                  <Link
                    to="/gallery"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`px-2.5 py-1.5 rounded text-[11px] font-sans font-bold text-center transition-colors ${
                      location.pathname === "/gallery"
                        ? "bg-red-600/30 text-red-400 border border-red-500/50"
                        : "bg-white/5 text-gray-300 hover:text-white hover:bg-red-600/20"
                    }`}
                  >
                    Gallery
                  </Link>
                  <Link
                    to="/contact"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`px-2.5 py-1.5 rounded text-[11px] font-sans font-bold text-center transition-colors ${
                      location.pathname === "/contact"
                        ? "bg-red-600/30 text-red-400 border border-red-500/50"
                        : "bg-white/5 text-gray-300 hover:text-white hover:bg-red-600/20"
                    }`}
                  >
                    Contact
                  </Link>
                  <Link
                    to="/ambassador"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`px-2.5 py-1.5 rounded text-[11px] font-sans font-bold text-center transition-colors ${
                      location.pathname === "/ambassador"
                        ? "bg-red-600/30 text-red-400 border border-red-500/50"
                        : "bg-white/5 text-gray-300 hover:text-white hover:bg-red-600/20"
                    }`}
                  >
                    Ambassador
                  </Link>
                  <Link
                    to="/franchise"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`col-span-2 px-2.5 py-1.5 rounded text-[11px] font-sans font-bold text-center transition-colors ${
                      location.pathname === "/franchise"
                        ? "bg-red-600/30 text-red-400 border border-red-500/50"
                        : "bg-white/5 text-gray-300 hover:text-white hover:bg-red-600/20"
                    }`}
                  >
                    Franchise Proposal
                  </Link>
                </div>
              </div>

              {/* Arena Section Shortcuts */}
              <div className="py-2 text-left space-y-1">
                <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-500 font-bold block mb-1">
                  Arena Sections
                </span>
                {MORE_ARENA_LINKS.map((link) => (
                  <a
                    key={link.id}
                    href={isHome ? `#${link.id}` : `/#${link.id}`}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block py-1.5 px-3 rounded text-[11px] text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
                  >
                    {link.label}
                  </a>
                ))}
              </div>

              {/* Mobile Drawer Theme Toggle */}
              <div className="pt-3 mt-1 border-t border-white/10 flex items-center justify-between">
                <span className="text-[11px] font-sans font-bold text-gray-300">
                  THEME:
                </span>
                <button
                  type="button"
                  onClick={toggleTheme}
                  aria-label={isLightMode ? "Switch to dark mode" : "Switch to light mode"}
                  className="px-3 py-1.5 rounded-lg border border-white/15 bg-white/5 hover:bg-white/10 text-amber-400 font-sans font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  {isLightMode ? (
                    <>
                      <Moon className="w-4 h-4 text-amber-500" />
                      <span>LIGHT MODE</span>
                    </>
                  ) : (
                    <>
                      <Sun className="w-4 h-4 text-amber-400" />
                      <span>DARK MODE</span>
                    </>
                  )}
                </button>
              </div>

              {/* WhatsApp Desk Button */}
              <div className="pt-3 mt-2 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    openWhatsApp("Hi Vikings Gym Team, I'd like to book an arena trial pass!");
                  }}
                  className="w-full py-2.5 rounded-lg bg-red-600 hover:bg-red-700 text-black font-mono font-bold text-xs tracking-wider transition-colors cursor-pointer"
                >
                  CHAT ON WHATSAPP
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
