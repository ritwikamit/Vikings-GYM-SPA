import React, { useState, useEffect, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import PublicNavbar from "../components/PublicNavbar";
import { 
  ArrowLeft, 
  Instagram, 
  Maximize2, 
  X, 
  ChevronLeft, 
  ChevronRight, 
  MapPin, 
  Phone, 
  Star, 
  ShieldCheck, 
  Camera,
  CheckCircle2
} from "lucide-react";
import { ALL_GYM_GALLERY_IMAGES, GalleryItem, mainArenaPanoramic } from "../assets/gymImages";
import { GYM_CONFIG } from "../config/gym";
import logoPremium from "../../assets/l.webp";
import { usePageSEO } from "../lib/seo";

export default function GalleryPage() {
  usePageSEO({
    title: "Vikings Gym & Spa Photo Gallery — Real Workout & Transformation Photos | Aurangabad",
    description: "Browse HD photos of Vikings Gym & Spa in Aurangabad, Bihar: Viva Fitness equipment, Moroccan steam spa, Olympic deadlift platforms, and real training moments.",
    keywords: "gym photos aurangabad, vikings gym gallery, best gym interior aurangabad bihar, gym pictures aurangabad",
    canonical: "https://www.vikingsgym.in/gallery",
  });

  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  // Filtered items
  const filteredImages = useMemo(() => {
    if (activeCategory === "all") return ALL_GYM_GALLERY_IMAGES;
    return ALL_GYM_GALLERY_IMAGES.filter((img) => img.category === activeCategory);
  }, [activeCategory]);

  // Keyboard navigation for lightbox
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (lightboxIndex === null) return;
      if (e.key === "Escape") setLightboxIndex(null);
      if (e.key === "ArrowLeft") {
        setLightboxIndex((prev) => (prev !== null && prev > 0 ? prev - 1 : filteredImages.length - 1));
      }
      if (e.key === "ArrowRight") {
        setLightboxIndex((prev) => (prev !== null && prev < filteredImages.length - 1 ? prev + 1 : 0));
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [lightboxIndex, filteredImages]);

  // Lock scroll while lightbox open
  useEffect(() => {
    if (lightboxIndex !== null) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [lightboxIndex]);

  const categories = [
    { id: "all", label: "ALL PHOTOS", count: ALL_GYM_GALLERY_IMAGES.length },
    { id: "reception", label: "RECEPTION & LOBBY", count: ALL_GYM_GALLERY_IMAGES.filter(i => i.category === "reception").length },
    { id: "strength", label: "STRENGTH & IRON", count: ALL_GYM_GALLERY_IMAGES.filter(i => i.category === "strength").length },
    { id: "cardio", label: "CARDIO & AGILITY", count: ALL_GYM_GALLERY_IMAGES.filter(i => i.category === "cardio").length },
    { id: "studio", label: "YOGA & STUDIOS", count: ALL_GYM_GALLERY_IMAGES.filter(i => i.category === "studio").length },
    { id: "restroom", label: "EXECUTIVE CHANGING", count: ALL_GYM_GALLERY_IMAGES.filter(i => i.category === "restroom").length },
  ];

  const currentLightboxItem: GalleryItem | undefined = 
    lightboxIndex !== null ? filteredImages[lightboxIndex] : undefined;

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-red-600 selection:text-black font-sans">
      {/* Full Interactive Navigation Bar */}
      <PublicNavbar />

      {/* Hero Header with Landscaped Photo Background & Dark Contrast Overlay */}
      <section className="subpage-hero relative py-14 sm:py-20 px-4 sm:px-8 border-b border-white/10 overflow-hidden" data-subpage-hero="true">
        {/* Background Landscaped Image (Clean fit, No Zoom) */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          <img
            src={mainArenaPanoramic}
            alt="Vikings Arena Floor"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-black/45" />
          <div className="absolute inset-y-0 left-0 w-20 sm:w-48 md:w-72 bg-gradient-to-r from-black via-black/65 to-transparent pointer-events-none" />
          <div className="absolute inset-y-0 right-0 w-20 sm:w-48 md:w-72 bg-gradient-to-l from-black via-black/65 to-transparent pointer-events-none" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: -60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <p className="text-red-500 font-mono text-xs font-bold tracking-[0.2em] uppercase mb-2">
              OFFICIAL FACILITY ARCHIVE · {ALL_GYM_GALLERY_IMAGES.length} REAL PHOTOS
            </p>

            <h1 className="text-3xl sm:text-5xl md:text-6xl font-black uppercase tracking-tight leading-[1] mb-4 text-white drop-shadow-[0_4px_24px_rgba(0,0,0,0.95)]">
              EXPLORE THE <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-rose-500 to-red-600">VIKINGS ARENA</span>
            </h1>
            <p className="text-gray-300 text-sm sm:text-base max-w-3xl leading-relaxed drop-shadow-[0_2px_10px_rgba(0,0,0,0.95)]">
              100% authentic photography captured in-situ at our flagship facility on MG Road, Aurangabad, Bihar. 
              Inspect every section from our executive reception lounge, Olympic powerlifting platform, and imported strength machines to our high-RPM spin fleet, group dance studios, and luxury changing suites.
            </p>
          </motion.div>

          {/* Dual-Row Continuous Auto-Marquee: Upper LTR, Lower RTL */}
          <div className="mt-8 mb-4 overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_4%,black_96%,transparent)]">
            <div className="gallery-marquee-ltr flex gap-3 py-1">
              {[...ALL_GYM_GALLERY_IMAGES.slice(0, 18), ...ALL_GYM_GALLERY_IMAGES.slice(0, 18)].map((img, i) => (
                <div
                  key={`marq1-${i}`}
                  onClick={() => setLightboxIndex(i % ALL_GYM_GALLERY_IMAGES.length)}
                  className="group relative w-56 sm:w-72 aspect-[16/10] shrink-0 rounded-xl overflow-hidden border border-neutral-800 hover:border-red-600/70 shadow-lg cursor-pointer transition-all"
                >
                  <img src={img.url} alt={img.label} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-80 group-hover:opacity-100 transition-opacity" />
                  <div className="absolute bottom-2 left-2.5 right-2.5 flex items-center justify-between text-[10px] font-sans font-bold text-white uppercase">
                    <span className="truncate">{img.label}</span>
                    <span className="text-red-400 font-mono text-[9px] shrink-0 ml-1">{img.zone}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="gallery-marquee-rtl flex gap-3 py-1 mt-2">
              {[...ALL_GYM_GALLERY_IMAGES.slice(18), ...ALL_GYM_GALLERY_IMAGES.slice(18)].map((img, i) => (
                <div
                  key={`marq2-${i}`}
                  onClick={() => setLightboxIndex((18 + i) % ALL_GYM_GALLERY_IMAGES.length)}
                  className="group relative w-56 sm:w-72 aspect-[16/10] shrink-0 rounded-xl overflow-hidden border border-neutral-800 hover:border-red-600/70 shadow-lg cursor-pointer transition-all"
                >
                  <img src={img.url} alt={img.label} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-80 group-hover:opacity-100 transition-opacity" />
                  <div className="absolute bottom-2 left-2.5 right-2.5 flex items-center justify-between text-[10px] font-sans font-bold text-white uppercase">
                    <span className="truncate">{img.label}</span>
                    <span className="text-red-400 font-mono text-[9px] shrink-0 ml-1">{img.zone}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Category Filter Tabs: Swipeable on mobile, wrapped on desktop */}
          <div className="flex overflow-x-auto sm:flex-wrap items-center gap-2 pt-6 sm:pt-8 pb-2 -mx-4 px-4 sm:mx-0 sm:px-0 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => {
                  setActiveCategory(cat.id);
                  setLightboxIndex(null);
                }}
                className={`shrink-0 px-3 sm:px-3.5 py-1.5 sm:py-2 rounded-full font-mono text-[10px] sm:text-[11px] font-bold tracking-wider uppercase transition-all cursor-pointer flex items-center gap-1.5 sm:gap-2 active:scale-95 touch-manipulation ${
                  activeCategory === cat.id
                    ? "bg-red-600 text-black shadow-lg shadow-red-600/30"
                    : "bg-neutral-900/90 border border-neutral-800 text-gray-400 hover:text-white hover:border-neutral-700 backdrop-blur-sm"
                }`}
              >
                <span>{cat.label}</span>
                <span className={`px-1.5 py-0.2 rounded-full text-[9px] ${activeCategory === cat.id ? "bg-black/25 text-black font-black" : "bg-neutral-800 text-gray-400"}`}>
                  {cat.count}
                </span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Main Image Grid — 2 columns on mobile, 3-4 on tablet/desktop */}
      <main className="max-w-7xl mx-auto px-3 sm:px-8 py-6 sm:py-10">
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2.5 sm:gap-5">
          {filteredImages.map((item, index) => (
            <div
              key={item.id}
              onClick={() => setLightboxIndex(index)}
              className="group relative aspect-[4/3] rounded-xl overflow-hidden bg-neutral-950 border border-neutral-900 hover:border-red-600/60 transition-all duration-300 shadow-md hover:shadow-xl hover:shadow-red-950/20 cursor-pointer active:scale-[0.98] touch-manipulation"
            >
              <img
                src={item.url}
                alt={item.alt}
                loading="lazy"
                decoding="async"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
              />

              {/* Gradient Overlay: visible on mobile for legibility, hover on desktop */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-300" />

              {/* Badges on Hover for desktop */}
              <div className="hidden sm:block absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <span className="w-8 h-8 rounded-full bg-black/80 backdrop-blur-md border border-white/20 flex items-center justify-center text-white">
                  <Maximize2 className="w-3.5 h-3.5" />
                </span>
              </div>

              <div className="absolute bottom-2 left-2 right-2 sm:bottom-3 sm:left-3 sm:right-3 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-300">
                <div className="text-[8px] sm:text-[10px] font-mono font-bold text-red-400 uppercase tracking-wider mb-0.5 truncate">
                  {item.zone}
                </div>
                <h3 className="text-[10px] sm:text-xs font-bold text-white leading-snug line-clamp-1">
                  {item.label}
                </h3>
              </div>

              {/* Permanent small zone label pill on mobile */}
              <div className="sm:hidden absolute top-1.5 left-1.5 pointer-events-none">
                <span className="px-1.5 py-0.5 rounded bg-black/75 backdrop-blur-sm text-[8px] font-mono font-bold text-gray-300 border border-white/10 uppercase">
                  {item.zone}
                </span>
              </div>

              {/* Desktop permanent pill */}
              <div className="hidden sm:block absolute top-2.5 left-2.5 group-hover:opacity-0 transition-opacity">
                <span className="px-2 py-0.5 rounded bg-black/75 backdrop-blur-md text-[9px] font-mono font-bold text-gray-300 border border-white/10 uppercase">
                  {item.zone}
                </span>
              </div>
            </div>
          ))}
        </div>

        {filteredImages.length === 0 && (
          <div className="py-24 text-center">
            <p className="text-gray-500 font-mono text-sm">No photographs found for this category.</p>
          </div>
        )}
      </main>

      {/* Interactive Fullscreen Lightbox Modal */}
      <AnimatePresence>
        {lightboxIndex !== null && currentLightboxItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 backdrop-blur-2xl flex flex-col justify-between p-3 sm:p-6"
          >
            {/* Lightbox Top Header */}
            <div className="flex items-center justify-between z-10">
              <div className="flex items-center gap-2 sm:gap-3">
                <span className="px-2 sm:px-2.5 py-0.5 sm:py-1 rounded bg-red-600 text-black font-mono font-black text-[9px] sm:text-[10px] uppercase tracking-wider">
                  {currentLightboxItem.zone}
                </span>
                <span className="text-[11px] sm:text-xs font-mono font-bold text-gray-400">
                  {lightboxIndex + 1} / {filteredImages.length}
                </span>
              </div>

              <button
                onClick={() => setLightboxIndex(null)}
                className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
                aria-label="Close lightbox"
              >
                <X className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </div>

            {/* Main Stage */}
            <div className="relative flex-1 flex items-center justify-center my-2 sm:my-4 overflow-hidden">
              <button
                onClick={() => setLightboxIndex((prev) => (prev !== null && prev > 0 ? prev - 1 : filteredImages.length - 1))}
                className="absolute left-1 sm:left-4 z-20 w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-black/80 sm:bg-black/70 hover:bg-red-600 hover:text-black border border-white/20 flex items-center justify-center text-white transition-all cursor-pointer"
                aria-label="Previous image"
              >
                <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>

              <motion.img
                key={currentLightboxItem.id}
                initial={{ scale: 0.96, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.96, opacity: 0 }}
                transition={{ duration: 0.2 }}
                src={currentLightboxItem.url}
                alt={currentLightboxItem.alt}
                className="max-h-[60vh] sm:max-h-[75vh] max-w-full object-contain rounded-lg shadow-2xl border border-white/10"
              />

              <button
                onClick={() => setLightboxIndex((prev) => (prev !== null && prev < filteredImages.length - 1 ? prev + 1 : 0))}
                className="absolute right-1 sm:right-4 z-20 w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-black/80 sm:bg-black/70 hover:bg-red-600 hover:text-black border border-white/20 flex items-center justify-center text-white transition-all cursor-pointer"
                aria-label="Next image"
              >
                <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
            </div>

            {/* Lightbox Bottom Details */}
            <div className="max-w-4xl mx-auto w-full text-center z-10 pb-1 sm:pb-0">
              <h2 className="text-sm sm:text-lg font-bold text-white mb-0.5 sm:mb-1 line-clamp-1">
                {currentLightboxItem.label}
              </h2>
              <p className="text-gray-400 text-[10px] sm:text-xs max-w-2xl mx-auto leading-relaxed mb-2 sm:mb-3 line-clamp-2">
                {currentLightboxItem.alt}
              </p>
              <div className="flex items-center justify-center gap-3">
                <a
                  href={`https://wa.me/${GYM_CONFIG.phone}?text=${encodeURIComponent(`Hi Vikings Gym, I am inquiring about this facility: ${currentLightboxItem.label}`)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 px-3.5 sm:px-4 py-1.5 rounded-full bg-red-600 hover:bg-red-700 text-black font-mono font-bold text-[10px] sm:text-[11px] tracking-wider uppercase transition-colors"
                >
                  <span>INQUIRE ABOUT THIS ZONE</span>
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer */}
      <footer className="border-t border-neutral-900 py-12 px-4 sm:px-8 text-center text-xs text-gray-500 font-mono">
        <div className="flex items-center justify-center gap-2 mb-3">
          <img src={logoPremium} alt="Vikings Gym" className="h-5 w-auto" />
          <span className="font-bold text-white tracking-widest uppercase">VIKINGS GYM & SPA</span>
        </div>
        <p className="max-w-md mx-auto mb-4 text-gray-400">
          {GYM_CONFIG.address} · {GYM_CONFIG.operatingHoursShort}
        </p>
        <Link to="/" className="text-red-500 hover:underline">
          Return to Homepage
        </Link>
      </footer>
    </div>
  );
}
