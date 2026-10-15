import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { ArrowUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function ScrollToTopButton() {
  const location = useLocation();
  const [show, setShow] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let rafId: number | null = null;
    const updateScroll = () => {
      const sy = window.scrollY;
      setShow(sy > 200);
      const total = document.documentElement.scrollHeight - window.innerHeight;
      if (total > 0) {
        setProgress(Math.min(100, Math.max(0, (sy / total) * 100)));
      }
    };

    const onScroll = () => {
      if (rafId !== null) return;
      rafId = window.requestAnimationFrame(() => {
        updateScroll();
        rafId = null;
      });
    };

    updateScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (rafId !== null) window.cancelAnimationFrame(rafId);
    };
  }, [location.pathname]);

  return (
    <AnimatePresence>
      {show && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 16 }}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.94 }}
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          aria-label="Back to top"
          className="fixed bottom-36 right-4 sm:right-6 lg:bottom-22 z-40 w-11 h-11 sm:w-12 sm:h-12 rounded-full flex items-center justify-center p-0 cursor-pointer shadow-2xl shadow-black/80 group"
        >
          <svg
            className="w-full h-full -rotate-90 pointer-events-none absolute inset-0 drop-shadow-[0_0_6px_rgba(239,68,68,0.45)]"
            viewBox="0 0 48 48"
          >
            <circle
              cx="24"
              cy="24"
              r="21"
              fill="none"
              stroke="rgba(255, 255, 255, 0.12)"
              strokeWidth="2.5"
            />
            <circle
              cx="24"
              cy="24"
              r="21"
              fill="none"
              stroke="#ef4444"
              strokeWidth="2.8"
              strokeDasharray={131.95}
              strokeDashoffset={131.95 - (131.95 * progress) / 100}
              strokeLinecap="round"
              style={{
                transition: "stroke-dashoffset 90ms cubic-bezier(0.1, 0.9, 0.2, 1)",
                willChange: "stroke-dashoffset",
              }}
            />
          </svg>
          <div className="scroll-top-btn-inner w-[34px] h-[34px] sm:w-[38px] sm:h-[38px] rounded-full !bg-neutral-950 !text-white hover:!text-red-500 flex items-center justify-center transition-colors">
            <ArrowUp className="w-5 h-5 block shrink-0" strokeWidth={2.4} />
          </div>
        </motion.button>
      )}
    </AnimatePresence>
  );
}
