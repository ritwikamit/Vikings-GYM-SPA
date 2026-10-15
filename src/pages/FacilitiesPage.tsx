import React from "react";
import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { ArrowLeft, Award, Dumbbell, Flame, Sparkles, CheckCircle, Clock, MapPin, Phone } from "lucide-react";
import PublicNavbar from "../components/PublicNavbar";
import logoPremium from "../../assets/l.webp";
import { GYM_CONFIG } from "../config/gym";
import {
  strengthPanoramic,
  deadliftPlatform,
  cardioRowingWide,
  freeWeightsBenches,
  sprintTrackFloor,
  boxingHeavyBag,
  yogaStudioClean,
  receptionSupplements,
} from "../assets/gymImages";
import { usePageSEO } from "../lib/seo";

export default function FacilitiesPage() {
  usePageSEO({
    title: "World-Class Facilities & Moroccan Steam Spa in Aurangabad, Bihar | Vikings Gym",
    description: "Explore 7,500+ sq.ft of elite fitness infrastructure at Vikings Gym Aurangabad: Viva Fitness plate-loaded machines, Olympic powerlifting platforms, Moroccan steam bath, and sprint track.",
    keywords: "gym facilities aurangabad, steam bath gym aurangabad, powerlifting gym aurangabad bihar, viva fitness gym aurangabad, best gym equipment aurangabad",
    canonical: "https://www.vikingsgym.in/facilities",
  });

  const openWhatsApp = (msg: string) => {
    window.open(`https://wa.me/${GYM_CONFIG.whatsapp}?text=${encodeURIComponent(msg)}`, "_blank", "noopener,noreferrer");
  };

  const ZONES = [
    {
      title: "Olympic Powerlifting Center",
      hindiTitle: "ओलंपिक पावरलिफ्टिंग सेंटर",
      badge: "ZONE 01",
      icon: Award,
      img: deadliftPlatform,
      desc: "Competition-grade wooden deadlift platform, calibrated bumper plates, Olympic barbells, safety squat bars, and heavy-duty power cages designed for zero-wobble compound lifting.",
      specs: ["Viva Fitness Competition Platform", "Calibrated Cast & Bumper Plates", "Hardened Chrome Olympic Barbells", "Commercial Power Squat Cages"],
    },
    {
      title: "Imported Selectorized & Plate-Loaded Stacks",
      hindiTitle: "वीवा फिटनेस स्ट्रेंथ स्टेशन",
      badge: "ZONE 02",
      icon: Dumbbell,
      img: strengthPanoramic,
      desc: "Comprehensive lineup of Viva Fitness biomechanically aligned selectorized machines, plate-loaded chest presses, incline chest rows, lat pulldown towers, and dual-cable crossovers.",
      specs: ["Plate-Loaded Incline & Flat Chest Presses", "Multi-Grip Lat Pulldown & Seated Row", "Dual-Cable Crossover Functional Trainer", "Seated Leg Curl & Leg Extension"],
    },
    {
      title: "High-Density Free Weights Floor",
      hindiTitle: "फ्री वेट्स एवं डम्बल सेक्शन",
      badge: "ZONE 03",
      icon: Dumbbell,
      img: freeWeightsBenches,
      desc: "Extensive polyurethane and rubber-coated dumbbell rack ranging from 2.5kg up to 60kg, paired with multiple heavy-duty adjustable incline, decline, and flat benches.",
      specs: ["Dumbbells from 2.5kg to 60kg pairs", "Reinforced Commercial Flat Benches", "Multi-Angle Incline/Decline Benches", "Heavy-Duty Preacher Curl Stations"],
    },
    {
      title: "Cardio & Functional Agility Floor",
      hindiTitle: "कार्डियो व फंक्शनल टर्फ",
      badge: "ZONE 04",
      icon: Flame,
      img: cardioRowingWide,
      desc: "Shock-absorbing commercial treadmills, air resistance rowing machines, high-intensity spin bikes, and an authentic turf sprint track for conditioning and agility intervals.",
      specs: ["Commercial Shock-Absorption Treadmills", "Concept2-Style Air Rowers", "Cult High-Inertia Spin Bikes", "Numbered Sprint Turf Track"],
    },
    {
      title: "Moroccan Steam Spa & Recovery Suite",
      hindiTitle: "मोरक्कन स्टीम स्पा व रिकवरी",
      badge: "ZONE 05",
      icon: Sparkles,
      img: yogaStudioClean,
      desc: "Private luxury Moroccan steam bath cabins offering deep thermal detoxification, vascular relaxation, and accelerated post-workout muscle recovery.",
      specs: ["Temperature-Controlled Steam Generators", "Hygienic Non-Porous Tiled Chambers", "Private Changing & Shower Suites", "Vascular Recovery & Detox Protocol"],
    },
    {
      title: "Supplements Bar & Member Lounge",
      hindiTitle: "सप्लीमेंट्स बार व लाउंज",
      badge: "ZONE 06",
      icon: CheckCircle,
      img: receptionSupplements,
      desc: "Curated pre-workout beverages, whey protein shakes, BCAAs, and comfortable executive seating for workout consultations and nutritional guidance.",
      specs: ["Certified Whey Protein & BCAAs", "Pre-Workout Energy Drinks", "Ergonomic Reception Consultation Desks", "Nutritional Advisory Support"],
    },
  ];

  return (
    <div className="bg-black text-gray-200 min-h-screen font-sans selection:bg-red-600 selection:text-white flex flex-col">
      {/* Full Interactive Navigation Bar */}
      <PublicNavbar />

      {/* Hero Header with Landscaped Photo Background */}
      <header className="subpage-hero relative py-16 sm:py-24 px-4 sm:px-6 border-b border-red-950/40 overflow-hidden" data-subpage-hero="true">
        <div className="absolute inset-0 z-0 pointer-events-none">
          <img
            src={strengthPanoramic}
            alt="Vikings Arena Strength Equipment"
            width="1920"
            height="600"
            decoding="async"
            className="w-full h-full object-cover object-[center_25%]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-black/45" />
          <div className="absolute inset-y-0 left-0 w-20 sm:w-48 md:w-72 bg-gradient-to-r from-black via-black/65 to-transparent pointer-events-none" />
          <div className="absolute inset-y-0 right-0 w-20 sm:w-48 md:w-72 bg-gradient-to-l from-black via-black/65 to-transparent pointer-events-none" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: -60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="relative z-10 max-w-4xl mx-auto text-center"
        >
          <p className="text-red-500 font-sans font-extrabold text-xs tracking-[0.2em] uppercase mb-2">
            विश्वस्तरीय सुविधाएं • WORLD-CLASS ARSENAL
          </p>
          <h1 className="text-3xl sm:text-5xl font-sans font-black text-white uppercase tracking-tight mb-4 drop-shadow-[0_4px_24px_rgba(0,0,0,0.95)]">
            PREMIUM FITNESS INFRASTRUCTURE
          </h1>
          <p className="text-gray-200 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed drop-shadow-[0_2px_10px_rgba(0,0,0,0.95)] font-medium">
            एमजी रोड, औरंगाबाद में स्थित वाइकिंग्स जिम एंड स्पा में अत्याधुनिक वीवा फिटनेस मशीनें, ओलंपिक पावरलिफ्टिंग प्लेटफॉर्म, 60kg तक रबर डम्बल और मोरक्कन स्टीम स्पा की विशेष सुविधा उपलब्ध है।
          </p>
          <div className="w-16 h-1 bg-red-600 mx-auto mt-6 rounded shadow-[0_0_12px_rgba(239,68,68,0.7)]"></div>
        </motion.div>
      </header>

      {/* Main Facilities Content */}
      <main className="flex-1 max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-16 w-full">
        {/* Quick Highlights Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-12">
          <div className="p-4 rounded-xl bg-neutral-950/70 border border-white/5 text-center">
            <span className="block text-xl sm:text-2xl font-black text-white">60 KG</span>
            <span className="text-[11px] font-sans text-gray-400 uppercase">Max Dumbbell Weight</span>
          </div>
          <div className="p-4 rounded-xl bg-neutral-950/70 border border-white/5 text-center">
            <span className="block text-xl sm:text-2xl font-black text-red-500">VIVA FITNESS</span>
            <span className="text-[11px] font-sans text-gray-400 uppercase">Commercial Stacks</span>
          </div>
          <div className="p-4 rounded-xl bg-neutral-950/70 border border-white/5 text-center">
            <span className="block text-xl sm:text-2xl font-black text-white">MOROCCAN</span>
            <span className="text-[11px] font-sans text-gray-400 uppercase">Steam Spa Suites</span>
          </div>
          <div className="p-4 rounded-xl bg-neutral-950/70 border border-white/5 text-center">
            <span className="block text-xl sm:text-2xl font-black text-amber-400">5 AM – 10 PM</span>
            <span className="text-[11px] font-sans text-gray-400 uppercase">Mon–Sat Operating</span>
          </div>
        </div>

        {/* Detailed Zones Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 mb-16">
          {ZONES.map((zone, idx) => {
            const Icon = zone.icon;
            return (
              <div
                key={idx}
                className="group bg-neutral-950/80 border border-neutral-850 hover:border-red-600/50 rounded-2xl overflow-hidden shadow-xl transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  {/* Photo with overlay */}
                  <div className="relative aspect-[16/10] overflow-hidden bg-neutral-900">
                    <img
                      src={zone.img}
                      alt={zone.title}
                      width="640"
                      height="400"
                      loading="lazy"
                      decoding="async"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/20 to-transparent" />
                    <span className="absolute top-3 left-3 px-2.5 py-1 rounded bg-black/80 backdrop-blur-md text-[10px] font-mono font-bold text-red-400 border border-red-500/30 uppercase">
                      {zone.badge}
                    </span>
                  </div>

                  {/* Body Content */}
                  <div className="p-6">
                    <div className="flex items-center gap-2 mb-1.5">
                      <Icon className="w-4 h-4 text-red-500" />
                      <span className="text-[11px] font-sans text-red-400 font-bold uppercase tracking-wider">
                        {zone.hindiTitle}
                      </span>
                    </div>
                    <h3 className="text-xl font-sans font-black text-white uppercase tracking-tight mb-2.5">
                      {zone.title}
                    </h3>
                    <p className="text-sm text-gray-300 font-sans leading-relaxed mb-4">
                      {zone.desc}
                    </p>

                    {/* Specifications List */}
                    <ul className="space-y-1.5 pt-3 border-t border-white/5">
                      {zone.specs.map((spec, sIdx) => (
                        <li key={sIdx} className="flex items-center gap-2 text-xs text-gray-400">
                          <CheckCircle className="w-3.5 h-3.5 text-red-500 shrink-0" />
                          <span>{spec}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="p-6 pt-0">
                  <button
                    onClick={() => openWhatsApp(`Hi Vikings Gym & Spa! I want to book a trial walkthrough of your ${zone.title}.`)}
                    className="w-full py-2.5 rounded-lg bg-neutral-900 hover:bg-red-600 hover:text-black text-gray-300 font-sans font-bold text-xs uppercase tracking-wider transition-all cursor-pointer text-center"
                  >
                    BOOK ZONE WALKTHROUGH →
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* CTA Banner */}
        <div className="relative rounded-3xl p-8 sm:p-12 moving-border-red text-center">
          <div className="moving-border-red-inner p-8 sm:p-12 bg-neutral-950 rounded-3xl flex flex-col items-center">
            <span className="text-xs font-mono font-bold text-red-500 uppercase tracking-widest mb-2">
              PHYSICAL FACILITY INSPECTION
            </span>
            <h2 className="text-2xl sm:text-4xl font-sans font-black text-white uppercase tracking-tight mb-4 max-w-xl">
              EXPERIENCE THE ARSENAL IN PERSON
            </h2>
            <p className="text-sm sm:text-base text-gray-300 max-w-xl mb-8 leading-relaxed">
              Drop by our reception on MG Road, Aurangabad anytime between 5:00 AM and 10:00 PM for a full equipment walkthrough and steam spa consultation.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => openWhatsApp("Hi Vikings Gym & Spa! I'd like to book a complimentary facility walkthrough and workout trial.")}
                className="py-3 px-8 bg-red-600 hover:bg-red-700 text-black font-sans font-black text-xs uppercase tracking-wider rounded-xl transition-all shadow-lg shadow-red-600/30 cursor-pointer"
              >
                SCHEDULE COMPLIMENTARY TOUR
              </button>
              <Link
                to="/memberships"
                className="py-3 px-6 bg-neutral-900 hover:bg-neutral-800 text-white font-sans font-bold text-xs uppercase tracking-wider rounded-xl border border-neutral-800 transition-colors"
              >
                VIEW MEMBERSHIP PLANS →
              </Link>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-neutral-900 bg-neutral-950 py-8 px-4 sm:px-6 text-center text-xs text-gray-500 font-sans">
        <p>© {new Date().getFullYear()} {GYM_CONFIG.name} — {GYM_CONFIG.address}. All rights reserved.</p>
      </footer>
    </div>
  );
}
