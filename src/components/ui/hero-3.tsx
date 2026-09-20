"use client";

import React, { useMemo, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "motion/react";
import { Star, Clock, MapPin } from "lucide-react";
import { cn } from "../../lib/utils";
import { GYM_CONFIG } from "../../config/gym";

export type HeroMarqueeImage = string | { src: string; label?: string };

// Props interface for the component
export interface AnimatedMarqueeHeroProps {
  title: React.ReactNode;
  description: React.ReactNode;
  ctaText: string;
  onCtaClick?: () => void;
  secondaryCtaText?: string;
  onSecondaryCtaClick?: () => void;
  images: HeroMarqueeImage[];
  backgroundImage?: string;
  className?: string;
}

// Reusable Button component styled for Vikings Gym (fluid sizing for smartphone & tablet)
const ActionButton = ({ children, onClick }: { children: React.ReactNode, onClick?: () => void }) => (
  <motion.button
    whileHover={{ scale: 1.03 }}
    whileTap={{ scale: 0.97 }}
    onClick={onClick}
    className="w-auto min-h-[42px] sm:min-h-[46px] px-4 xs:px-6 sm:px-8 py-2.5 sm:py-3.5 rounded-md bg-red-600 text-black font-mono font-black text-[10px] xs:text-[11px] sm:text-xs tracking-[0.14em] xs:tracking-[0.16em] sm:tracking-[0.2em] shadow-lg shadow-red-600/30 transition-all hover:bg-red-500 active:bg-red-700 flex items-center justify-center gap-1.5 sm:gap-2 uppercase cursor-pointer shrink-0 touch-manipulation"
  >
    {children}
  </motion.button>
);

// Interactive dot field (shared across the whole site): dots swell, ignite red
// and part outward near the cursor, like pressing weight into stretched cloth.
export function DotGrid() {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);

  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let raf = 0;
    let running = false;
    let w = 0;
    let h = 0;
    const coarse = window.matchMedia("(pointer: coarse)").matches;
    const GAP = coarse ? 44 : 30;
    const RADIUS = 130;
    const dpr = Math.min(window.devicePixelRatio || 1, coarse ? 1.5 : 2);
    const mouse = { x: -9999, y: -9999, tx: -9999, ty: -9999 };
    // Last live-pointer time; when idle the hotspot roams on its own
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
    // Touch support: finger position (including while scrolling) drives the field
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
      // Idle >2.5s: hotspot roams on its own so the field stays alive
      const idle = now - seen.t > 2500;
      const rt = now / 1000;
      const tx = idle ? w * (0.5 + 0.32 * Math.sin(rt * 0.35)) : mouse.tx;
      const ty = idle ? h * (0.42 + 0.28 * Math.sin(rt * 0.27 + 1.3)) : mouse.ty;
      // Tight follow: responsive, with just a whisper of smoothing
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
          // Cloth-press: dots part outward around the cursor, like weight on fabric
          const push = swell * 16;
          // Gentle ambient breathing so dots shimmer even with no pointer
          const phase = ix * 0.9 + iy * 1.7;
          const bx = Math.sin(rt * 0.9 + phase) * 2.2;
          const by = Math.cos(rt * 0.7 + phase * 1.3) * 2.2;
          const px = gx + (dx / d) * push + bx;
          const py = gy + (dy / d) * push + by;
          const r = 1 + swell * 2.6;
          const alpha = 0.1 + swell * 0.55;
          // Fade dots toward the edges, like a masked pattern
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

  return <canvas ref={canvasRef} aria-hidden="true" className="absolute inset-0 h-full w-full" />;
}

// The main hero component
export const AnimatedMarqueeHero: React.FC<AnimatedMarqueeHeroProps> = ({
  title,
  description,
  ctaText,
  onCtaClick,
  secondaryCtaText,
  onSecondaryCtaClick,
  images,
  backgroundImage,
  className,
}) => {
  // Animation variants for the text content
  const FADE_IN_ANIMATION_VARIANTS = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100, damping: 20 } },
  };

  // Duplicate images 4x for a seamless, gap-free infinite loop on all screen widths
  const duplicatedImages = useMemo(() => [...images, ...images, ...images, ...images], [images]);

  // Fewer particles on phones to keep old devices smooth.
  const [emberCount] = useState(() =>
    typeof window !== "undefined" &&
    typeof window.matchMedia === "function" &&
    window.matchMedia("(max-width: 640px)").matches
      ? 8
      : 16
  );

  // Deterministic rising-ember particles (stable across renders)
  const embers = useMemo(
    () =>
      Array.from({ length: emberCount }, (_, i) => ({
        left: `${(i * 61 + 7) % 100}%`,
        size: 2 + ((i * 7) % 3),
        duration: 7 + ((i * 13) % 7),
        delay: (i * 1.7) % 8,
        drift: (i % 2 === 0 ? 1 : -1) * (10 + ((i * 11) % 30)),
      })),
    [emberCount]
  );

  // Interactive torch: springs smooth the cursor so a red glow trails it,
  // while the aurora + ember layers drift on parallax against it.
  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.38);
  const glowX = useSpring(mouseX, { stiffness: 120, damping: 20 });
  const glowY = useSpring(mouseY, { stiffness: 120, damping: 20 });
  const torchLeft = useTransform(glowX, (v) => `${v * 100}%`);
  const torchTop = useTransform(glowY, (v) => `${v * 100}%`);
  const auraX = useTransform(glowX, [0, 1], [24, -24]);
  const auraY = useTransform(glowY, [0, 1], [18, -18]);
  const emberX = useTransform(glowX, [0, 1], [-14, 14]);
  const emberY = useTransform(glowY, [0, 1], [-10, 10]);

  const setTorchFromPoint = (clientX: number, clientY: number, el: HTMLElement) => {
    const r = el.getBoundingClientRect();
    mouseX.set((clientX - r.left) / r.width);
    mouseY.set((clientY - r.top) / r.height);
  };
  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    setTorchFromPoint(e.clientX, e.clientY, e.currentTarget);
  };
  const handleTouchMove = (e: React.TouchEvent<HTMLElement>) => {
    const t = e.touches[0];
    if (t) setTorchFromPoint(t.clientX, t.clientY, e.currentTarget);
  };

  return (
    <section
      onMouseMove={handleMouseMove}
      onTouchStart={handleTouchMove}
      onTouchMove={handleTouchMove}
      className={cn(
        "relative w-full min-h-[calc(100svh-3.5rem)] sm:min-h-[calc(100dvh-4.5rem)] overflow-x-hidden bg-black flex flex-col justify-between sm:justify-center items-center text-center px-0 py-3 xs:py-4 sm:py-6 md:py-8 border-b border-red-950/20",
        className
      )}
    >
      {/* Real gym ambient backdrop with cinematic dark vignette */}
      {backgroundImage && (
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
          <motion.img
            src={backgroundImage}
            alt=""
            className="w-full h-full object-cover object-center opacity-20 filter contrast-125 saturate-75 brightness-75 scale-105"
            animate={{ scale: [1.05, 1.09, 1.05] }}
            transition={{ duration: 24, repeat: Infinity, ease: "easeInOut" }}
          />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_65%_at_50%_38%,rgba(0,0,0,0.45)_0%,rgba(0,0,0,0.88)_70%,#000000_100%)]" />
          <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black" />
        </div>
      )}

      {/* Forge ambiance: drifting red glows + rising embers + dot texture + vignette */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden motion-reduce:hidden">
        <motion.div style={{ x: auraX, y: auraY }} className="absolute inset-0">
          <motion.div
            className="absolute -top-32 left-1/2 h-96 w-[42rem] -translate-x-1/2 rounded-full bg-red-600/15 blur-[130px]"
            animate={{ x: ["-6%", "6%", "-6%"], opacity: [0.7, 1, 0.7] }}
            transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute bottom-0 -left-24 h-80 w-80 rounded-full bg-red-800/20 blur-[110px]"
            animate={{ y: ["0%", "-12%", "0%"] }}
            transition={{ duration: 11, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute bottom-10 -right-24 h-80 w-80 rounded-full bg-rose-700/15 blur-[110px]"
            animate={{ y: ["0%", "12%", "0%"] }}
            transition={{ duration: 13, repeat: Infinity, ease: "easeInOut" }}
          />
        </motion.div>
        {/* Cursor torch: a soft red glow that trails the mouse */}
        <motion.div
          className="absolute h-[34rem] w-[34rem] rounded-full bg-red-600/[0.13] blur-[130px]"
          style={{ left: torchLeft, top: torchTop, x: "-50%", y: "-50%" }}
        />
        <motion.div style={{ x: emberX, y: emberY }} className="absolute inset-0">
          {embers.map((e, i) => (
            <motion.span
              key={i}
              className="absolute bottom-[-10px] rounded-full bg-red-500"
              style={{
                left: e.left,
                width: e.size,
                height: e.size,
                boxShadow: "0 0 8px 2px rgba(239,68,68,0.55)",
              }}
              animate={{ y: [0, "-105vh"], x: [0, e.drift], opacity: [0, 1, 1, 0] }}
              transition={{ duration: e.duration, delay: e.delay, repeat: Infinity, ease: "linear", times: [0, 0.15, 0.85, 1] }}
            />
          ))}
        </motion.div>
        <DotGrid />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_60%_at_50%_38%,transparent_30%,rgba(0,0,0,0.75)_100%)]" />
      </div>

      {/* Title Container — Elevated up like a heading on smartphone, centered on tablet/PC */}
      <div className="z-10 flex flex-col items-center max-w-4xl w-full mx-auto px-4 sm:px-6 pt-2 xs:pt-3 sm:pt-0 shrink-0">
        <motion.h1
          initial="hidden"
          animate="show"
          variants={{
            hidden: {},
            show: {
              transition: {
                staggerChildren: 0.1,
              },
            },
          }}
          className="relative z-20 text-3xl xs:text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-sans font-black tracking-tight text-white uppercase leading-[1.02] sm:leading-[0.95] mb-1 xs:mb-2 sm:mb-3"
        >
          {typeof title === 'string' ? (
            title.split(" ").map((word, i) => (
              <motion.span
                key={i}
                variants={FADE_IN_ANIMATION_VARIANTS}
                className="inline-block"
              >
                {word}&nbsp;
              </motion.span>
            ))
          ) : (
            title
          )}
        </motion.h1>
      </div>

      {/* Full-bleed Marquee Stage with Overlapping Lucid Buttons & Trust Badges */}
      <div className="relative z-20 w-full overflow-hidden my-auto sm:my-3.5 md:my-5 py-3 sm:py-3.5 select-none [mask-image:linear-gradient(to_right,transparent_0%,black_3%,black_97%,transparent_100%)] flex flex-col justify-center">
        {/* Moving background track with criss-cross tilted cards from the sides of the screen */}
        <div className="hero-marquee-track flex gap-3 sm:gap-4 md:gap-5 items-center px-2 sm:px-4 opacity-55 sm:opacity-70 transition-opacity pointer-events-none">
          {duplicatedImages.map((item, index) => {
            const src = typeof item === "string" ? item : item.src;
            const label = typeof item === "string" ? undefined : item.label;
            const isRemote = typeof src === "string" && src.startsWith("http");
            const smallSrc = isRemote ? src.replace("w=1470", "w=480").replace("w=1469", "w=480") : src;
            // Criss-cross alternating tilt
            const tilt = index % 2 === 0 ? -2.5 : 3.5;

            return (
              <div
                key={index}
                style={{ transform: `rotate(${tilt}deg)` }}
                className="relative aspect-[4/5] h-40 xs:h-44 sm:h-48 md:h-52 lg:h-56 flex-shrink-0 rounded-xl sm:rounded-2xl overflow-hidden border border-white/10 shadow-[0_8px_25px_rgba(0,0,0,0.85),0_0_12px_rgba(220,38,38,0.15)]"
              >
                {src ? (
                  <img
                    src={smallSrc}
                    {...(isRemote ? { srcSet: `${smallSrc} 480w, ${src} 1470w` } : {})}
                    sizes="(max-width: 640px) 140px, (max-width: 1024px) 175px, 200px"
                    alt={label ? `Vikings Gym ${label}` : `Vikings Gym training facility ${index + 1}`}
                    loading="eager"
                    decoding="async"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-neutral-900" />
                )}
              </div>
            );
          })}
        </div>

        {/* Floating Foreground Layer OVER the moving images: Lucid Buttons & Trust Badges */}
        <div className="absolute inset-0 z-30 flex flex-col items-center justify-center pointer-events-none px-2 sm:px-6">
          <div className="pointer-events-auto flex flex-col items-center gap-2 xs:gap-2.5 sm:gap-3.5 w-full max-w-xl">
            {/* Call to Action Buttons — Lucid Fluid Row */}
            <motion.div
              initial="hidden"
              animate="show"
              variants={FADE_IN_ANIMATION_VARIANTS}
              transition={{ delay: 0.45 }}
              className="flex flex-row items-center justify-center gap-2 xs:gap-2.5 sm:gap-3.5 w-auto"
            >
              <ActionButton onClick={onCtaClick}>{ctaText}</ActionButton>
              {secondaryCtaText && (
                <button
                  onClick={onSecondaryCtaClick}
                  className="btn-ice w-auto min-h-[38px] xs:min-h-[42px] sm:min-h-[46px] px-3.5 xs:px-5 sm:px-8 py-2 xs:py-2.5 sm:py-3.5 rounded-md border border-white/20 bg-black/60 hover:bg-white/10 backdrop-blur-md text-gray-200 hover:border-transparent hover:text-white hover:shadow-lg hover:shadow-blue-600/40 font-mono font-black text-[10px] xs:text-[11px] sm:text-xs tracking-[0.14em] xs:tracking-[0.16em] sm:tracking-[0.2em] uppercase transition-all cursor-pointer shadow-xl shrink-0 touch-manipulation flex items-center justify-center"
                >
                  {secondaryCtaText}
                </button>
              )}
            </motion.div>

            {/* Trust signals: Google Reviews & Date/Hours in the same line, aligned & lucid */}
            <motion.div
              initial="hidden"
              animate="show"
              variants={FADE_IN_ANIMATION_VARIANTS}
              transition={{ delay: 0.6 }}
              className="flex flex-row flex-wrap sm:flex-nowrap items-center justify-center gap-1.5 sm:gap-2.5 max-w-full px-1"
            >
              <a
                href={GYM_CONFIG.mapLink}
                target="_blank"
                rel="noreferrer"
                className="group inline-flex items-center gap-1 xs:gap-1.5 sm:gap-2 rounded-full border border-white/20 bg-black/60 px-2.5 xs:px-3 sm:px-3.5 py-1 sm:py-1.5 backdrop-blur-md transition-all hover:border-amber-400/60 hover:bg-black/80 shadow-lg cursor-pointer shrink-0 touch-manipulation"
              >
                <span className="flex items-center gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-2.5 h-2.5 sm:w-3 sm:h-3 ${i < Math.round(GYM_CONFIG.rating) ? "text-amber-400 fill-amber-400" : "text-neutral-600"}`}
                    />
                  ))}
                </span>
                <span className="text-[10px] xs:text-[11px] sm:text-xs md:text-sm font-sans font-black text-white">{GYM_CONFIG.rating}</span>
                <span className="text-[8.5px] xs:text-[9.5px] sm:text-[10px] md:text-[11px] font-mono font-bold tracking-[0.1em] xs:tracking-[0.12em] sm:tracking-[0.16em] text-gray-300 group-hover:text-white transition-colors">
                  · {GYM_CONFIG.reviews} REVIEWS
                </span>
              </a>

              <div className="inline-flex items-center gap-1 xs:gap-1.5 sm:gap-2 rounded-full border border-white/20 bg-black/60 px-2.5 xs:px-3 sm:px-3.5 py-1 sm:py-1.5 backdrop-blur-md text-[8.5px] xs:text-[9.5px] sm:text-[10px] md:text-[11px] font-mono font-bold tracking-[0.12em] sm:tracking-[0.16em] text-gray-300 shadow-lg shrink-0">
                <span className="inline-flex items-center gap-1">
                  <Clock className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-red-500 shrink-0" />
                  MON–SAT · 5 AM – 10 PM
                </span>
                <span className="text-neutral-600 select-none">·</span>
                <span className="inline-flex items-center gap-1">
                  <MapPin className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-red-500 shrink-0" />
                  MG ROAD
                </span>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Description / Details Container — Positioned after the marquee stage */}
      <div className="z-10 flex flex-col items-center max-w-4xl w-full mx-auto px-4 sm:px-6 pb-2 xs:pb-3 sm:pb-0 shrink-0">
        <motion.p
          initial="hidden"
          animate="show"
          variants={FADE_IN_ANIMATION_VARIANTS}
          transition={{ delay: 0.7 }}
          className="relative z-20 max-w-xl sm:max-w-2xl text-[11px] xs:text-xs sm:text-sm md:text-base text-gray-300 mx-auto font-sans leading-relaxed tracking-normal text-balance px-2"
        >
          {description}
        </motion.p>
      </div>
    </section>
  );
};
