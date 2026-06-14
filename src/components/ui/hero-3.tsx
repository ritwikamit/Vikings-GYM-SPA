"use client";

import React from "react";
import { motion } from "motion/react";
import { cn } from "../../lib/utils";

// Props interface for the component
export interface AnimatedMarqueeHeroProps {
  tagline: string;
  title: React.ReactNode;
  description: string;
  ctaText: string;
  onCtaClick?: () => void;
  images: string[];
  className?: string;
}

// Reusable Button component styled for Vikings Gym
const ActionButton = ({ children, onClick }: { children: React.ReactNode, onClick?: () => void }) => (
  <motion.button
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    onClick={onClick}
    className="mt-8 px-10 py-4 rounded bg-red-600 text-black font-mono font-black tracking-widest shadow-xl shadow-red-600/30 transition-all hover:bg-red-700 focus:outline-none flex items-center justify-center gap-2 uppercase"
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
        "relative w-full h-screen overflow-hidden bg-black flex flex-col items-center justify-center text-center px-4 border-b border-red-950/20",
        className
      )}
    >
      <div className="z-10 flex flex-col items-center mt-[-10vh]">
        {/* Tagline */}
        <motion.div
          initial="hidden"
          animate="show"
          variants={FADE_IN_ANIMATION_VARIANTS}
          className="mb-6 inline-flex items-center gap-2 bg-red-650/10 border border-red-900/30 px-3 py-1 rounded-full text-red-500 text-xs font-mono"
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
          className="text-5xl md:text-7xl font-sans font-extrabold tracking-tight text-white uppercase leading-[0.95] mb-6"
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
          className="mt-6 max-w-2xl text-lg text-gray-400 mx-auto font-sans leading-relaxed"
        >
          {description}
        </motion.p>

        {/* Call to Action Button */}
        <motion.div
          initial="hidden"
          animate="show"
          variants={FADE_IN_ANIMATION_VARIANTS}
          transition={{ delay: 0.6 }}
        >
          <ActionButton onClick={onCtaClick}>{ctaText}</ActionButton>
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
