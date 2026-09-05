"use client";

import React, { useMemo, useState } from "react";
import { motion } from "motion/react";
import { Star, Clock, MapPin } from "lucide-react";
import { cn } from "../../lib/utils";
import { GYM_CONFIG } from "../../config/gym";
import DotPattern from "./dot-pattern-1";

// Props interface for the component
export interface AnimatedMarqueeHeroProps {
  tagline: string;
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

// The main hero component
export const AnimatedMarqueeHero: React.FC<AnimatedMarqueeHeroProps> = ({
  tagline,
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

  return (
    <section
      className={cn(
        "relative w-full min-h-svh overflow-hidden bg-black flex flex-col items-center justify-center text-center px-4 py-28 border-b border-red-950/20",
        className
      )}
    >
      {/* Forge ambiance: drifting red glows + rising embers + dot texture + vignette */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden motion-reduce:hidden">
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
        <DotPattern className="fill-red-500/[0.07] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_40%,black,transparent)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_60%_at_50%_38%,transparent_30%,rgba(0,0,0,0.75)_100%)]" />
      </div>

      <div className="z-10 flex flex-col items-center max-w-4xl mt-[-6vh]">
        {/* Tagline */}
        <motion.div
          initial="hidden"
          animate="show"
          variants={FADE_IN_ANIMATION_VARIANTS}
          className="mb-6 inline-flex items-center gap-2 bg-red-650/10 border border-red-900/30 px-4 py-1.5 rounded-full text-red-500 text-[11px] font-mono font-bold tracking-[0.2em] text-center leading-relaxed max-w-full"
        >
          {tagline}
        </motion.div>

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
          className="text-4xl sm:text-6xl md:text-7xl font-sans font-black tracking-tight text-white uppercase leading-[0.95] mb-6 drop-shadow-[0_2px_28px_rgba(220,38,38,0.35)]"
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
              className="w-full sm:w-auto px-8 py-4 rounded-md border border-neutral-700 hover:border-red-600 text-gray-300 hover:text-white font-mono font-black text-xs tracking-[0.2em] uppercase transition-all cursor-pointer"
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
            className="group inline-flex items-center gap-2.5 rounded-full border border-white/10 bg-white/5 px-5 py-2.5 backdrop-blur-md transition-colors hover:border-amber-400/40"
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
          <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-[11px] font-mono font-bold tracking-[0.2em] text-gray-400">
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
