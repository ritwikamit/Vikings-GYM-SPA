import React from "react";
import logoPremium from "../../assets/l.webp";

export default function MinimalLoadingScreen() {
  return (
    <div className="fixed inset-0 z-[99999] bg-black flex flex-col items-center justify-center text-center p-6 select-none">
      {/* Minimal Brand Emblem */}
      <img
        src={logoPremium}
        alt="Vikings Gym &amp; Spa"
        width="40"
        height="40"
        decoding="async"
        className="w-10 h-10 object-contain drop-shadow-[0_0_16px_rgba(239,68,68,0.5)] mb-3.5"
      />

      {/* Minimal Brand Title */}
      <div className="font-sans font-black text-sm sm:text-base tracking-[0.26em] uppercase text-white mb-3">
        VIKINGS <span className="text-red-500">GYM &amp; SPA</span>
      </div>

      {/* Minimal Sleek Loading Line */}
      <div className="w-32 h-[2px] bg-white/10 rounded-full overflow-hidden relative mb-3">
        <div className="absolute inset-y-0 w-1/2 bg-gradient-to-r from-transparent via-red-500 to-red-600 rounded-full animate-pulse" />
      </div>

      {/* Minimal Status Text */}
      <div className="font-sans text-[11px] font-semibold tracking-[0.22em] uppercase text-gray-400 animate-pulse">
        Loading...
      </div>
    </div>
  );
}
