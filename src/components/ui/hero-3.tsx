"use client";

import React, { useMemo, useState, useEffect } from "react";
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from "motion/react";
import { Star, Clock, MapPin } from "lucide-react";
import { cn } from "../../lib/utils";
import { GYM_CONFIG } from "../../config/gym";

export type HeroMarqueeImage = string | { src: string; label?: string };

// Props interface for the component
export interface AnimatedMarqueeHeroProps {
  title: React.ReactNode;
  ctaText: string;
  onCtaClick?: () => void;
  secondaryCtaText?: string;
  onSecondaryCtaClick?: () => void;
  video1Src?: string;
  slideshowPhotos?: string[];
  // Preserved for backwards compatibility
  video4Src?: string;
  description?: React.ReactNode;
  images?: HeroMarqueeImage[];
  backgroundImage?: string;
  backgroundVideo?: string;
  className?: string;
}

// Reusable Button component styled for Vikings Gym (fluid full-width sizing for smartphone, auto for tablet/desktop)
const ActionButton = ({ children, onClick }: { children: React.ReactNode, onClick?: () => void }) => (
  <motion.button
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
    onClick={onClick}
    className="w-full sm:w-auto min-h-[46px] px-6 sm:px-8 py-3 sm:py-3.5 rounded-md bg-red-600 text-black font-sans font-black text-xs sm:text-xs tracking-wider shadow-lg shadow-red-600/30 transition-all hover:bg-red-500 active:bg-red-700 flex items-center justify-center gap-2 uppercase cursor-pointer shrink-0 touch-manipulation text-center"
  >
    {children}
  </motion.button>
);

// Interactive dot field (preserved for other sections)
export function DotGrid() {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);

  React.useEffect(() => {
    // Skip heavy continuous canvas computation on smartphones / touch screens for butter-smooth scrolling
    if (typeof window !== "undefined" && (window.innerWidth < 768 || window.matchMedia("(pointer: coarse)").matches || window.matchMedia("(prefers-reduced-motion: reduce)").matches)) {
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf = 0;
    let running = false;
    let w = 0;
    let h = 0;
    const coarse = window.matchMedia("(pointer: coarse)").matches;
    const GAP = coarse ? 44 : 30;
    const RADIUS = 130;
    const dpr = Math.min(window.devicePixelRatio || 1, coarse ? 1.5 : 2);
    const mouse = { x: -9999, y: -9999, tx: -9999, ty: -9999 };
    const seen = { t: -1e9 };

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      w = rect.width;
      h = rect.height;
      canvas.width = Math.max(1, Math.round(w * dpr));
      canvas.height = Math.max(1, Math.round(h * dpr));
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    const host = canvas.closest("section") ?? canvas;
    const onMove = (e: MouseEvent) => {
      const r = canvas.getBoundingClientRect();
      mouse.tx = e.clientX - r.left;
      mouse.ty = e.clientY - r.top;
      seen.t = performance.now();
    };
    const onLeave = () => {
      mouse.tx = -9999;
      mouse.ty = -9999;
      seen.t = -1e9;
    };
    host.addEventListener("mousemove", onMove);
    host.addEventListener("mouseleave", onLeave);
    const onTouch = (e: TouchEvent) => {
      const t = e.touches[0];
      if (!t) return;
      const r = canvas.getBoundingClientRect();
      mouse.tx = t.clientX - r.left;
      mouse.ty = t.clientY - r.top;
      seen.t = performance.now();
    };
    host.addEventListener("touchstart", onTouch, { passive: true });
    host.addEventListener("touchmove", onTouch, { passive: true });
    host.addEventListener("touchend", onLeave);
    host.addEventListener("touchcancel", onLeave);

    const draw = () => {
      const now = performance.now();
      const idle = now - seen.t > 2500;
      const rt = now / 1000;
      const tx = idle ? w * (0.5 + 0.32 * Math.sin(rt * 0.35)) : mouse.tx;
      const ty = idle ? h * (0.42 + 0.28 * Math.sin(rt * 0.27 + 1.3)) : mouse.ty;
      mouse.x += (tx - mouse.x) * 0.28;
      mouse.y += (ty - mouse.y) * 0.28;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);
      let iy = 0;
      for (let gy = GAP / 2; gy < h; gy += GAP, iy++) {
        let ix = 0;
        for (let gx = GAP / 2; gx < w; gx += GAP, ix++) {
          const dx = gx - mouse.x;
          const dy = gy - mouse.y;
          const d = Math.sqrt(dx * dx + dy * dy) || 0.001;
          const t = Math.max(0, 1 - d / RADIUS);
          const swell = t * t;
          const push = swell * 16;
          const phase = ix * 0.9 + iy * 1.7;
          const bx = Math.sin(rt * 0.9 + phase) * 2.2;
          const by = Math.cos(rt * 0.7 + phase * 1.3) * 2.2;
          const px = gx + (dx / d) * push + bx;
          const py = gy + (dy / d) * push + by;
          const r = 1 + swell * 2.6;
          const alpha = 0.1 + swell * 0.55;
          const nx = gx / w - 0.5;
          const ny = gy / h - 0.42;
          const edge = Math.max(0, 1 - (nx * nx * 2.2 + ny * ny * 2.6));
          ctx.beginPath();
          ctx.arc(px, py, r, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${swell > 0.25 ? "239,68,68" : "255,255,255"},${(alpha * edge).toFixed(3)})`;
          ctx.fill();
        }
      }
      raf = requestAnimationFrame(draw);
    };

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !running) {
          running = true;
          raf = requestAnimationFrame(draw);
        } else if (!entry.isIntersecting && running) {
          running = false;
          cancelAnimationFrame(raf);
        }
      },
      { threshold: 0 }
    );
    io.observe(canvas);

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
      host.removeEventListener("mousemove", onMove);
      host.removeEventListener("mouseleave", onLeave);
      host.removeEventListener("touchstart", onTouch);
      host.removeEventListener("touchmove", onTouch);
      host.removeEventListener("touchend", onLeave);
      host.removeEventListener("touchcancel", onLeave);
    };
  }, []);

  return <canvas ref={canvasRef} aria-hidden="true" className="absolute inset-0 h-full w-full pointer-events-none" />;
}

// Clean Immersive Hero: Video 1 (Original Fit, No Zoom) -> Landscaped Photos (Smooth Cross-fade, No Zoom) -> Video 1 in Loop
export const AnimatedMarqueeHero: React.FC<AnimatedMarqueeHeroProps> = ({
  title,
  ctaText,
  onCtaClick,
  secondaryCtaText,
  onSecondaryCtaClick,
  video1Src,
  slideshowPhotos,
  className,
}) => {
  const [heroMode, setHeroMode] = useState<"video" | "photos">("video");
  const [photoIndex, setPhotoIndex] = useState(0);
  const videoRef = React.useRef<HTMLVideoElement>(null);

  const photos = slideshowPhotos && slideshowPhotos.length > 0 ? slideshowPhotos : [];

  // When video 1 completes, transition to landscaped photos
  const handleVideoEnded = () => {
    if (photos.length > 0) {
      setPhotoIndex(0);
      setHeroMode("photos");
    } else if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play().catch(() => {});
    }
  };

  // Landscaped photos cycle every 3.5 seconds with smooth cross-fade (No Zoom)
  useEffect(() => {
    if (heroMode !== "photos" || photos.length === 0) return;

    const timer = setInterval(() => {
      setPhotoIndex((prev) => {
        if (prev + 1 >= photos.length) {
          // Finished photo sequence, switch back to video 1 in continuous loop
          setHeroMode("video");
          return 0;
        }
        return prev + 1;
      });
    }, 3500);

    return () => clearInterval(timer);
  }, [heroMode, photos.length]);

  // When switching back to video mode, reset and play Video 1
  useEffect(() => {
    if (heroMode === "video" && videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play().catch(() => {});
    }
  }, [heroMode]);

  return (
    <section
      id="hero"
      data-hero-section="true"
      className={cn(
        "relative w-full min-h-[calc(100svh-4rem)] sm:min-h-[calc(100dvh-4.5rem)] overflow-hidden bg-black flex flex-col justify-center items-center text-center px-3.5 xs:px-4 sm:px-6 pt-5 xs:pt-7 sm:pt-10 md:pt-14 pb-20 xs:pb-24 sm:pb-12 md:pb-14 border-b border-red-950/20",
        className
      )}
    >
      {/* 1. Full-Cover Hero Background: Video 1 (Original Fit, No Zoom) -> Landscaped Photos -> Video 1 in Loop */}
      <div className="absolute inset-0 w-full h-full overflow-hidden z-0 pointer-events-none">
        {/* Video 1 Layer: smartphone optimized clarity, contrast & subpixel framing; PC view unchanged */}
        <video
          ref={videoRef}
          src={video1Src}
          autoPlay
          muted
          playsInline
          onEnded={handleVideoEnded}
          className={cn(
            "w-full h-full object-cover object-[center_10%] sm:object-[center_14%] md:object-[center_18%] transition-opacity duration-700",
            "mobile-hero-video md:filter-none md:transform-none",
            heroMode === "video" ? "opacity-100" : "opacity-0"
          )}
        />

        {/* Smartphone-Only Cinematic Clarity Overlay (Hides pixelation & sharpens athlete focus; hidden on PC) */}
        <div className="md:hidden absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,rgba(0,0,0,0.65)_100%)] pointer-events-none z-[1]" />
        <div className="md:hidden absolute inset-0 bg-gradient-to-b from-black/45 via-transparent to-black/75 pointer-events-none z-[1]" />

        {/* Landscaped Photos Layer: smooth cross-fade, properly framed */}
        {photos.length > 0 && (
          <div
            className={cn(
              "absolute inset-0 w-full h-full transition-opacity duration-700",
              heroMode === "photos" ? "opacity-100" : "opacity-0"
            )}
          >
            <AnimatePresence mode="wait">
              <motion.img
                key={photos[photoIndex]}
                src={photos[photoIndex]}
                alt="Vikings Arena Floor"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.8, ease: "easeInOut" }}
                className="w-full h-full object-cover object-[center_20%]"
              />
            </AnimatePresence>
          </div>
        )}

        {/* Crisp translucent vertical gradient overlay for contrast */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/25 to-black/40 z-[1]" />

        {/* Side-edge Vignette Fades (Left & Right) */}
        <div className="absolute inset-y-0 left-0 w-20 xs:w-32 sm:w-56 md:w-80 bg-gradient-to-r from-black via-black/65 to-transparent pointer-events-none z-[1]" />
        <div className="absolute inset-y-0 right-0 w-20 xs:w-32 sm:w-56 md:w-80 bg-gradient-to-l from-black via-black/65 to-transparent pointer-events-none z-[1]" />
      </div>

      {/* 2. Hero Content: Perfectly Padded & Fully Visible on Mobile & Desktop */}
      <div className="relative z-10 w-full max-w-4xl mx-auto flex flex-col items-center justify-center space-y-4 xs:space-y-5 sm:space-y-6 md:space-y-8 my-auto">
        {/* Semantic SEO & AEO Anchor for Search Engines & AI Crawlers */}
        <div className="sr-only">
          <h2>Vikings Gym &amp; Spa — Best Gym in Aurangabad, Bihar</h2>
          <p>The #1 premium gym in Aurangabad, Bihar on MG Road. Viva Fitness imported biomechanical machines, Olympic powerlifting deadlift platforms, Moroccan steam bath spa, certified personal trainers, and ladies fitness batches.</p>
        </div>

        <motion.h1
          initial={{ opacity: 0, y: 18, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="w-full text-center mx-auto text-3xl xs:text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-sans font-black tracking-tight text-white uppercase leading-[0.98] xs:leading-[0.94] sm:leading-[0.95] drop-shadow-[0_4px_30px_rgba(0,0,0,0.95)] drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]"
          aria-label="Vikings Gym &amp; Spa — Best Gym in Aurangabad Bihar"
        >
          {title}
        </motion.h1>

        {/* 3. Action Buttons: Full-width stacked on smartphone, side-by-side on tablet/desktop */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.15, ease: "easeOut" }}
          className="w-full max-w-sm sm:max-w-none flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-2.5 sm:gap-5 px-3 sm:px-0 pt-1 sm:pt-2"
        >
          <ActionButton onClick={onCtaClick}>{ctaText}</ActionButton>
          {secondaryCtaText && (
            <button
              type="button"
              onClick={onSecondaryCtaClick}
              className="btn-ice hero-secondary-btn w-full sm:w-auto min-h-[46px] px-6 sm:px-8 py-3 sm:py-3.5 rounded-md border !border-white/40 !bg-black/75 hover:!bg-white/20 backdrop-blur-md !text-white hover:border-transparent hover:!text-white hover:shadow-lg hover:shadow-blue-600/40 font-sans font-black text-xs sm:text-xs tracking-wider uppercase transition-all cursor-pointer shadow-xl shrink-0 touch-manipulation flex items-center justify-center text-center"
            >
              {secondaryCtaText}
            </button>
          )}
        </motion.div>

        {/* 4. Hero Highlights: 100% Transparent with changing Hindi/English highlighted texts */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.25, ease: "easeOut" }}
          className="pt-1 sm:pt-2 flex flex-col items-center max-w-2xl mx-auto w-full px-2"
        >
          <div className="w-full max-w-xl px-2 py-1 flex flex-col items-center gap-1.5 xs:gap-2 bg-transparent">
            <div className="flex flex-wrap items-center justify-center gap-x-2.5 xs:gap-x-3.5 gap-y-1 text-[10px] xs:text-[11px] sm:text-xs font-sans font-extrabold tracking-wider text-white drop-shadow-[0_2px_12px_rgba(0,0,0,0.95)]">
              <span className="inline-flex items-center gap-1.5 text-red-400 drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse shadow-[0_0_8px_rgba(239,68,68,0.8)]" />
                OPEN {GYM_CONFIG.operatingHoursShort.toUpperCase()}
              </span>
              <span className="text-white/40 hidden sm:inline">•</span>
              <span className="inline-flex items-center gap-1 text-amber-300 drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                {GYM_CONFIG.rating}★ RATED ({GYM_CONFIG.athleteCount} ATHLETES)
              </span>
              <span className="text-white/40 hidden sm:inline">•</span>
              <span className="inline-flex items-center text-gray-200 drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
                OLYMPIC IRON & MOROCCAN SPA
              </span>
            </div>
            <p className="text-[10.5px] xs:text-[11px] sm:text-xs font-sans text-gray-300 text-center max-w-sm sm:max-w-md leading-relaxed drop-shadow-[0_2px_10px_rgba(0,0,0,0.95)] font-normal">
              {GYM_CONFIG.address} · Certified Coaches · Viva Fitness Equipment & Moroccan Steam Spa
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
