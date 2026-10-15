import { Phone, MessageCircle, Dumbbell } from "lucide-react";
import { GYM_CONFIG } from "../config/gym";

const JOIN_MESSAGE = "Hi Vikings Gym & Spa! I want to JOIN. Please share the membership plans and timings.";

export default function MobileFooterNav() {
  const openWhatsApp = (msg: string) => {
    window.open(
      `https://wa.me/${GYM_CONFIG.whatsapp}?text=${encodeURIComponent(msg)}`,
      "_blank",
      "noopener,noreferrer"
    );
  };

  return (
    <nav
      aria-label="Mobile Bottom Actions"
      className="mobile-action-bar lg:hidden fixed bottom-0 inset-x-0 z-40 border-t border-white/10 bg-black/95 backdrop-blur-md"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <div className="grid grid-cols-3 divide-x divide-white/10">
        <a
          href={`tel:${GYM_CONFIG.phone}`}
          className="flex flex-col items-center justify-center gap-1 py-2.5 text-[10px] font-mono font-bold tracking-[0.18em] text-gray-300 active:text-white transition-colors"
        >
          <Phone className="w-5 h-5 text-red-500 shrink-0" />
          <span>CALL</span>
        </a>
        <a
          href={`https://wa.me/${GYM_CONFIG.whatsapp}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col items-center justify-center gap-1 py-2.5 text-[10px] font-mono font-bold tracking-[0.18em] text-gray-300 active:text-white transition-colors"
        >
          <MessageCircle className="w-5 h-5 text-red-500 shrink-0" />
          <span>WHATSAPP</span>
        </a>
        <button
          onClick={() => openWhatsApp(JOIN_MESSAGE)}
          className="flex flex-col items-center justify-center gap-1 py-2.5 text-[10px] font-mono font-black tracking-[0.18em] bg-red-600 !text-white active:bg-red-500 transition-colors cursor-pointer"
        >
          <Dumbbell className="w-5 h-5 shrink-0" />
          <span>JOIN NOW</span>
        </button>
      </div>
    </nav>
  );
}
