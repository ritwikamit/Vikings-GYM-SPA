"use client";

import React, { useMemo, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "motion/react";
import { Star, Clock, MapPin } from "lucide-react";
import { cn } from "../../lib/utils";
import { GYM_CONFIG } from "../../config/gym";

// Props interface for the component
export interface AnimatedMarqueeHeroProps {
  title: React.ReactNode;
  description: string;
  ctaText: string;
  onCtaClick?: () => void;
  secondaryCtaText?: string;
  onSecondaryCtaClick?: () => void;
  images: string[];
  className?: string;
}

// Reusable Button component styled for Vikings Gym
const ActionButton = ({ children, onClick }: { children: React.ReactNode, onClick?: () => void }) => (
  <motion.button
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    onClick={onClick}
    className="w-full sm:w-auto px-8 py-4 rounded-md bg-red-600 text-black font-mono font-black text-xs tracking-[0.2em] shadow-lg shadow-red-600/20 transition-colors hover:bg-red-700 flex items-center justify-center gap-2 uppercase cursor-pointer"
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
  className,
}) => {
  // Animation variants for the text content
  const FADE_IN_ANIMATION_VARIANTS = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100, damping: 20 } },
  };

  // Duplicate images for a seamless loop
  const duplicatedImages = [...images, ...images];

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
        "relative w-full min-h-svh overflow-hidden bg-black flex flex-col items-center justify-center text-center px-4 py-20 md:py-28 border-b border-red-950/20",
        className
      )}
    >
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

      <div className="z-10 flex flex-col items-center max-w-4xl mt-[-6vh]">
        {/* Main Title */}
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
          className="text-4xl sm:text-6xl md:text-7xl font-sans font-black tracking-tight text-white uppercase leading-[0.95] mb-6"
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

        {/* Description */}
        <motion.p
          initial="hidden"
          animate="show"
          variants={FADE_IN_ANIMATION_VARIANTS}
          transition={{ delay: 0.5 }}
          className="mt-6 max-w-2xl text-base md:text-lg text-gray-300 mx-auto font-sans leading-relaxed"
        >
          {description}
        </motion.p>

        {/* Call to Action Buttons */}
        <motion.div
          initial="hidden"
          animate="show"
          variants={FADE_IN_ANIMATION_VARIANTS}
          transition={{ delay: 0.6 }}
          className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <ActionButton onClick={onCtaClick}>{ctaText}</ActionButton>
          {secondaryCtaText && (
            <button
              onClick={onSecondaryCtaClick}
              className="w-full sm:w-auto px-8 py-4 rounded-md border border-white/10 bg-white/5 backdrop-blur-md text-gray-200 hover:border-transparent hover:bg-gradient-to-r hover:from-blue-600 hover:to-cyan-500 hover:text-white hover:shadow-lg hover:shadow-blue-600/40 font-mono font-black text-xs tracking-[0.2em] uppercase transition-all cursor-pointer"
            >
              {secondaryCtaText}
            </button>
          )}
        </motion.div>

        {/* Trust signals */}
        <motion.div
          initial="hidden"
          animate="show"
          variants={FADE_IN_ANIMATION_VARIANTS}
          transition={{ delay: 0.75 }}
          className="mt-10 flex flex-col items-center gap-4"
        >
          <a
            href={GYM_CONFIG.mapLink}
            target="_blank"
            rel="noreferrer"
            className="group inline-flex max-w-full flex-wrap items-center justify-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 sm:px-5 py-2.5 backdrop-blur-md transition-colors hover:border-amber-400/40"
          >
            <span className="flex items-center gap-0.5">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-3.5 h-3.5 ${i < Math.round(GYM_CONFIG.rating) ? "text-amber-400 fill-amber-400" : "text-neutral-600"}`}
                />
              ))}
            </span>
            <span className="text-sm font-sans font-black text-white">{GYM_CONFIG.rating}</span>
            <span className="text-[11px] font-mono font-bold tracking-[0.18em] text-gray-300 group-hover:text-white transition-colors">
              · {GYM_CONFIG.reviews} GOOGLE REVIEWS
            </span>
          </a>
          <div className="flex flex-wrap items-center justify-center gap-x-4 sm:gap-x-5 gap-y-1.5 rounded-2xl sm:rounded-full border border-white/10 bg-black/45 px-4 sm:px-5 py-2.5 backdrop-blur-md text-[11px] font-mono font-bold tracking-[0.14em] sm:tracking-[0.2em] text-gray-300 max-w-full">
            <span className="inline-flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-red-500" />
              MON–SAT · 5 AM – 10 PM
            </span>
            <span className="inline-flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-red-500" />
              MG ROAD, AURANGABAD
            </span>
          </div>
        </motion.div>
      </div>

      {/* Animated Image Marquee */}
      <div className="absolute bottom-0 left-0 w-full h-1/3 md:h-2/5 [mask-image:linear-gradient(to_bottom,transparent,black_20%,black_80%,transparent)]">
        <motion.div
          className="flex gap-4"
          animate={{
            x: ["-100%", "0%"],
            transition: {
              ease: "linear",
              duration: 40,
              repeat: Infinity,
            },
          }}
        >
          {duplicatedImages.map((src, index) => {
            // Small variant for phones; full-size for larger screens.
            const smallSrc = src.replace("w=1470", "w=480").replace("w=1469", "w=480");
            return (
            <div
              key={index}
              className="relative aspect-[3/4] h-48 md:h-64 flex-shrink-0"
              style={{
                rotate: `${(index % 2 === 0 ? -2 : 5)}deg`,
              }}
            >
              {src ? (
                <img
                  src={smallSrc}
                  srcSet={`${smallSrc} 480w, ${src} 1470w`}
                  sizes="(max-width: 768px) 45vw, 220px"
                  alt={`Showcase image ${index + 1}`}
                  loading="lazy"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover rounded-2xl shadow-[0_0_15px_rgba(220,38,38,0.2)] border border-red-950/50"
                />
              ) : (
                <div className="w-full h-full bg-neutral-900 rounded-2xl shadow-[0_0_15px_rgba(220,38,38,0.2)] border border-red-950/50" />
              )}
            </div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
};
