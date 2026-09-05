"use client";

import React from "react";
import { motion } from "motion/react";
import { Star } from "lucide-react";
import { cn } from "../../lib/utils";
import { GYM_CONFIG } from "../../config/gym";

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
    className="px-8 py-4 rounded-md bg-red-600 text-black font-mono font-black text-xs tracking-[0.2em] shadow-lg shadow-red-600/20 transition-colors hover:bg-red-700 flex items-center justify-center gap-2 uppercase cursor-pointer"
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

  return (
    <section
      className={cn(
        "relative w-full min-h-svh overflow-hidden bg-black flex flex-col items-center justify-center text-center px-4 py-28 border-b border-red-950/20",
        className
      )}
    >
      <div className="z-10 flex flex-col items-center max-w-4xl mt-[-6vh]">
        {/* Tagline */}
        <motion.div
          initial="hidden"
          animate="show"
          variants={FADE_IN_ANIMATION_VARIANTS}
          className="mb-6 inline-flex items-center gap-2 bg-red-650/10 border border-red-900/30 px-4 py-1.5 rounded-full text-red-500 text-[11px] font-mono font-bold tracking-[0.2em]"
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
          className="text-5xl md:text-7xl font-sans font-black tracking-tight text-white uppercase leading-[0.95] mb-6"
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
          className="mt-6 max-w-2xl text-base md:text-lg text-gray-400 mx-auto font-sans leading-relaxed"
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
              className="px-8 py-4 rounded-md border border-neutral-700 hover:border-red-600 text-gray-300 hover:text-white font-mono font-black text-xs tracking-[0.2em] uppercase transition-all cursor-pointer"
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
          className="mt-10 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-[11px] font-mono font-bold tracking-[0.2em] text-gray-500"
        >
          <span className="inline-flex items-center gap-1.5">
            <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
            {GYM_CONFIG.rating} · {GYM_CONFIG.reviews} GOOGLE REVIEWS
          </span>
          <span className="hidden sm:inline text-neutral-800">/</span>
          <span>MON–SAT · 5 AM – 10 PM</span>
          <span className="hidden sm:inline text-neutral-800">/</span>
          <span>MG ROAD, AURANGABAD</span>
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
          {duplicatedImages.map((src, index) => (
            <div
              key={index}
              className="relative aspect-[3/4] h-48 md:h-64 flex-shrink-0"
              style={{
                rotate: `${(index % 2 === 0 ? -2 : 5)}deg`,
              }}
            >
              {src ? (
                <img
                  src={src}
                  alt={`Showcase image ${index + 1}`}
                  loading="lazy"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover rounded-2xl shadow-[0_0_15px_rgba(220,38,38,0.2)] border border-red-950/50"
                />
              ) : (
                <div className="w-full h-full bg-neutral-900 rounded-2xl shadow-[0_0_15px_rgba(220,38,38,0.2)] border border-red-950/50" />
              )}
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};
