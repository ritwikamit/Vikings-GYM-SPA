import React, { useState, useEffect, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
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
import { ALL_GYM_GALLERY_IMAGES, GalleryItem } from "../assets/gymImages";
import { GYM_CONFIG } from "../config/gym";
import logoPremium from "../../assets/l.webp";

export default function GalleryPage() {
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
      {/* Top Navbar */}
      <header className="sticky top-0 z-40 bg-black/85 backdrop-blur-xl border-b border-white/10 px-4 sm:px-8 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-4 sm:gap-6">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-xs font-mono font-bold tracking-[0.15em] text-gray-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 px-3.5 py-2 rounded-md transition-all cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-red-500" />
            <span>BACK TO ARENA</span>
          </Link>

          <Link to="/" className="flex items-center gap-2 group">
            <img src={logoPremium} alt="Vikings Gym" className="h-7 w-auto object-contain" />
            <span className="font-mono font-black text-sm tracking-[0.2em] text-white group-hover:text-red-500 transition-colors hidden sm:inline">
              VIKINGS GYM
            </span>
          </Link>
        </div>

        <div className="flex items-center gap-3">
          <a
            href={GYM_CONFIG.mapLink}
            target="_blank"
            rel="noreferrer"
            className="hidden md:inline-flex items-center gap-1.5 text-[11px] font-mono font-bold text-gray-400 hover:text-white transition-colors"
          >
            <MapPin className="w-3.5 h-3.5 text-red-500" />
            MG ROAD, AURANGABAD
          </a>

          <a
            href={`https://wa.me/${GYM_CONFIG.phone}?text=${encodeURIComponent("Hi Vikings Gym, I explored your complete gallery and would like to inquire about membership and facility tour.")}`}
            target="_blank"
            rel="noreferrer"
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-black font-mono font-black text-[11px] tracking-[0.18em] rounded-md transition-all uppercase cursor-pointer"
          >
            JOIN NOW
          </a>
        </div>
      </header>

      {/* Hero Header */}
      <section className="relative py-12 sm:py-16 px-4 sm:px-8 max-w-7xl mx-auto border-b border-white/10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-600/10 border border-red-600/30 text-red-400 font-mono text-[10px] font-bold tracking-[0.2em] uppercase mb-4">
          <Camera className="w-3.5 h-3.5" />
          <span>OFFICIAL FACILITY ARCHIVE · {ALL_GYM_GALLERY_IMAGES.length} REAL PHOTOS</span>
        </div>

        <h1 className="text-3xl sm:text-5xl md:text-6xl font-black uppercase tracking-tight leading-[1] mb-4">
          EXPLORE THE <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-rose-600 to-red-800">VIKINGS ARENA</span>
        </h1>
        <p className="text-gray-400 text-sm sm:text-base max-w-3xl leading-relaxed">
          100% authentic photography captured in-situ at our flagship facility on MG Road, Aurangabad, Bihar. 
          Inspect every section from our executive reception lounge, Olympic powerlifting platform, and imported strength machines to our high-RPM spin fleet, group dance studios, and luxury changing suites.
        </p>

        {/* Category Filter Tabs */}
        <div className="flex flex-wrap gap-2 pt-8">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => {
                setActiveCategory(cat.id);
                setLightboxIndex(null);
              }}
              className={`px-3.5 py-2 rounded-full font-mono text-[11px] font-bold tracking-wider uppercase transition-all cursor-pointer flex items-center gap-2 ${
                activeCategory === cat.id
                  ? "bg-red-600 text-black shadow-lg shadow-red-600/30"
                  : "bg-neutral-900/90 border border-neutral-800 text-gray-400 hover:text-white hover:border-neutral-700"
              }`}
            >
              <span>{cat.label}</span>
              <span className={`px-1.5 py-0.2 rounded-full text-[9px] ${activeCategory === cat.id ? "bg-black/25 text-black font-black" : "bg-neutral-800 text-gray-400"}`}>
                {cat.count}
              </span>
            </button>
          ))}
        </div>
      </section>

      {/* Main Image Grid */}
      <main className="max-w-7xl mx-auto px-4 sm:px-8 py-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
          {filteredImages.map((item, index) => (
            <div
              key={item.id}
              onClick={() => setLightboxIndex(index)}
              className="group relative aspect-[4/3] rounded-xl overflow-hidden bg-neutral-950 border border-neutral-900 hover:border-red-600/60 transition-all duration-300 shadow-md hover:shadow-xl hover:shadow-red-950/20 cursor-pointer"
            >
              <img
                src={item.url}
                alt={item.alt}
                loading="lazy"
                decoding="async"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
              />

              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

              {/* Badges on Hover */}
              <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <span className="w-8 h-8 rounded-full bg-black/80 backdrop-blur-md border border-white/20 flex items-center justify-center text-white">
                  <Maximize2 className="w-3.5 h-3.5" />
                </span>
              </div>

              <div className="absolute bottom-3 left-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="text-[10px] font-mono font-bold text-red-400 uppercase tracking-widest mb-0.5">
                  {item.zone}
                </div>
                <h3 className="text-xs font-bold text-white leading-snug line-clamp-1">
                  {item.label}
                </h3>
              </div>

              {/* Permanent small zone label pill */}
              <div className="absolute top-2.5 left-2.5 group-hover:opacity-0 transition-opacity">
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
            className="fixed inset-0 z-50 bg-black/95 backdrop-blur-2xl flex flex-col justify-between p-4 sm:p-6"
          >
            {/* Lightbox Top Header */}
            <div className="flex items-center justify-between z-10">
              <div className="flex items-center gap-3">
                <span className="px-2.5 py-1 rounded bg-red-600 text-black font-mono font-black text-[10px] uppercase tracking-wider">
                  {currentLightboxItem.zone}
                </span>
                <span className="text-xs font-mono font-bold text-gray-400">
                  {lightboxIndex + 1} / {filteredImages.length}
                </span>
              </div>

              <button
                onClick={() => setLightboxIndex(null)}
                className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
                aria-label="Close lightbox"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Main Stage */}
            <div className="relative flex-1 flex items-center justify-center my-4 overflow-hidden">
              <button
                onClick={() => setLightboxIndex((prev) => (prev !== null && prev > 0 ? prev - 1 : filteredImages.length - 1))}
                className="absolute left-2 sm:left-4 z-20 w-11 h-11 rounded-full bg-black/70 hover:bg-red-600 hover:text-black border border-white/20 flex items-center justify-center text-white transition-all cursor-pointer"
                aria-label="Previous image"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>

              <motion.img
                key={currentLightboxItem.id}
                initial={{ scale: 0.96, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.96, opacity: 0 }}
                transition={{ duration: 0.2 }}
                src={currentLightboxItem.url}
                alt={currentLightboxItem.alt}
                className="max-h-[75vh] max-w-full object-contain rounded-lg shadow-2xl border border-white/10"
              />

              <button
                onClick={() => setLightboxIndex((prev) => (prev !== null && prev < filteredImages.length - 1 ? prev + 1 : 0))}
                className="absolute right-2 sm:right-4 z-20 w-11 h-11 rounded-full bg-black/70 hover:bg-red-600 hover:text-black border border-white/20 flex items-center justify-center text-white transition-all cursor-pointer"
                aria-label="Next image"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>

            {/* Lightbox Bottom Details */}
            <div className="max-w-4xl mx-auto w-full text-center z-10">
              <h2 className="text-base sm:text-lg font-bold text-white mb-1">
                {currentLightboxItem.label}
              </h2>
              <p className="text-gray-400 text-xs max-w-2xl mx-auto leading-relaxed mb-3">
                {currentLightboxItem.alt}
              </p>
              <div className="flex items-center justify-center gap-3">
                <a
                  href={`https://wa.me/${GYM_CONFIG.phone}?text=${encodeURIComponent(`Hi Vikings Gym, I am inquiring about this facility: ${currentLightboxItem.label}`)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-red-600 hover:bg-red-700 text-black font-mono font-bold text-[11px] tracking-wider uppercase transition-colors"
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
          MG Road, Above Central Bank, Aurangabad, Bihar 824101 · Open Mon–Sat 5 AM – 10 PM
        </p>
        <Link to="/" className="text-red-500 hover:underline">
          Return to Homepage
        </Link>
      </footer>
    </div>
  );
}
