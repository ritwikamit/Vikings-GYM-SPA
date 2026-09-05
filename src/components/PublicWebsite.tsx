import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { membershipsAPI, trainersAPI } from "../api";
import {
  Dumbbell,
  Sparkles,
  MapPin,
  Phone,
  Calendar,
  UserCheck,
  ArrowRight,
  ShieldAlert,
  Calculator,
  Award,
  Compass,
  Layers,
  CheckCircle,
  Star,
  Users,
  Instagram,
  Menu,
  X,
  Play
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import logoPremium from "../../assets/l.png";
import photoAnkitKumar from "../../assets/trainers/ankit-kumar.jpg";
import photoBittuVerma from "../../assets/trainers/bittu-verma.jpg";
import photoAli from "../../assets/trainers/ali.jpg";
import photoAmitSingh from "../../assets/trainers/amit-singh.jpg";
import { AnimatedMarqueeHero } from "./ui/hero-3";
import DotPattern from "./ui/dot-pattern-1";
import { GYM_CONFIG } from "../config/gym";

interface PublicWebsiteProps {
  onJoinNow: () => void;
  onLoginClick: () => void;
}

const DEFAULT_PLANS = [
  {
    name: "Monthly Warrior",
    price: "₹2,000",
    period: "30 Days",
    desc: "Full gym floor access for one month. Start your fitness journey today.",
    features: ["Full gym floor access", "All strength & cardio zones", "Steam bath included", "Locker facility"],
    popular: false,
  },
  {
    name: "Quarterly Shield",
    price: "₹4,900",
    period: "90 Days",
    desc: "Three months of training at a better per-day rate than monthly.",
    features: ["Everything in Monthly", "Free fitness assessment", "Guest passes (2x)", "Priority class booking"],
    popular: true,
  },
  {
    name: "Half-Year Berserker",
    price: "₹9,000",
    period: "179 Days",
    desc: "Six months of relentless gains with the best value pricing.",
    features: ["Everything in Quarterly", "Trainer guidance included", "Personalized diet plan", "Premium plan pricing"],
    popular: false,
  },
  {
    name: "Annual Valhalla",
    price: "₹18,000",
    period: "365 Days",
    desc: "The full Valhalla experience — the ultimate annual commitment for dedicated warriors.",
    features: ["Everything in Half-Year", "Best per-day rate", "Customized diet + audit", "Priority trainer slots"],
    popular: false,
  },
];

const DEFAULT_TRAINERS = [
  {
    name: "Amit Singh",
    role: "GYM COACH & MEMBER SUPPORT",
    years: "Building the Vikings fam one rep at a time",
    desc: "Warm, hands-on coach at Vikings Gym & Spa who supports members on the gym floor, corrects form and keeps the arena motivating every single day.",
    cert: ["Gym Coaching"],
    instagram: "https://www.instagram.com/amysinghca2018/",
    instagramHandle: "@amysinghca2018",
    photoUrl: photoAmitSingh,
  },
  {
    name: "Bittu Verma",
    role: "FITNESS & WEIGHT LOSS COACH",
    years: "Turning goals into daily habits",
    desc: "Dedicated fitness coach at Vikings. Specializes in weight loss, cardio conditioning and instructor-led group sessions that keep every Warrior accountable.",
    cert: ["Fitness Coaching", "Weight Loss"],
    instagram: "https://www.instagram.com/get_fit_with_bittu/",
    instagramHandle: "@get_fit_with_bittu",
    photoUrl: photoBittuVerma,
  },
  {
    name: "Ankit Kumar",
    role: "STRENGTH & CONDITIONING COACH",
    years: "Making members stronger, meaner & fitter",
    desc: "Full-time strength coach at Vikings Gym & Spa. Trains members from their first lift to competition form with disciplined, measurable programming.",
    cert: ["Strength & Conditioning"],
    instagram: "https://www.instagram.com/ankitxn_/",
    instagramHandle: "@ankitxn_",
    photoUrl: photoAnkitKumar,
  },
  {
    name: "Ali",
    role: "PERSONAL TRAINING & TRANSFORMATION COACH",
    years: "Personalized 1-on-1 transformation",
    desc: "Vikings personal trainer who programs individual workouts, nutrition guidance and progress audits for members chasing serious body transformation.",
    cert: ["Personal Training"],
    instagram: "https://www.instagram.com/ali_trainer/",
    instagramHandle: "@ali_trainer",
    photoUrl: photoAli,
  },
];

// Renders a third-party Instagram widget snippet (SnapWidget/LightWidget/Elfsight).
// Scripts are re-created so script-based embeds actually run; iframes render as-is.
function InstagramWidget({ snippet }: { snippet: string }) {
  const containerRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const box = containerRef.current;
    if (!snippet || !box) return;
    box.innerHTML = snippet;
box.querySelectorAll("script").forEach((oldScript) => {
        const newScript = document.createElement("script");
        Array.from(oldScript.attributes).forEach((attr: Attr) =>
          newScript.setAttribute(attr.name, attr.value)
        );
      newScript.text = oldScript.text;
      oldScript.parentNode?.replaceChild(newScript, oldScript);
    });
  }, [snippet]);

  return <div ref={containerRef} />;
}

const STORY_TILES = [
  { img: "https://images.unsplash.com/photo-1540497077202-7c8a3999166f?q=80&w=640&auto=format&fit=crop", label: "WOD" },
  { img: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=640&auto=format&fit=crop", label: "Training" },
  { img: "https://images.unsplash.com/photo-1599058917212-d750089bc07e?q=80&w=640&auto=format&fit=crop", label: "Lifts" },
  { img: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=640&auto=format&fit=crop", label: "Warriors" },
  { img: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?q=80&w=640&auto=format&fit=crop", label: "Steam Spa" },
];

const GALLERY_IMAGES = [
  { url: "https://images.unsplash.com/photo-1540497077202-7c8a3999166f?q=80&w=900&auto=format&fit=crop", alt: "Strength zone", label: "Strength" },
  { url: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?q=80&w=900&auto=format&fit=crop", alt: "Barbell training", label: "Barbell" },
  { url: "https://images.unsplash.com/photo-1574680096145-d05b474e2155?q=80&w=900&auto=format&fit=crop", alt: "Gym floor", label: "Floor" },
  { url: "https://images.unsplash.com/photo-1599058917212-d750089bc07e?q=80&w=900&auto=format&fit=crop", alt: "Deadlift", label: "Deadlift" },
  { url: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=900&auto=format&fit=crop", alt: "Coach-led training", label: "Coaching" },
  { url: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?q=80&w=900&auto=format&fit=crop", alt: "Conditioning", label: "Conditioning" },
  { url: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=900&auto=format&fit=crop", alt: "Intense session", label: "Intensity" },
  { url: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?q=80&w=900&auto=format&fit=crop", alt: "Steam spa recovery", label: "Steam Spa" },
];

// Static-site mode: the member portal login is intentionally hidden but fully
// preserved (JSX marked with `PORTAL_ACCESS_ENABLED` + App.tsx routes remain)
// so the portal can be re-enabled later without losing the integration.
const PORTAL_ACCESS_ENABLED = false;

export default function PublicWebsite({ onJoinNow, onLoginClick }: PublicWebsiteProps) {
  const { data: plansData } = useQuery({
    queryKey: ['public-plans'],
    queryFn: () => membershipsAPI.getPlans().then(res => res.data.data)
  });

  const { data: trainersData } = useQuery({
    queryKey: ['public-trainers'],
    queryFn: () => trainersAPI.getAll().then(res => res.data.data)
  });
  // Note: the coaches section always renders DEFAULT_TRAINERS (real team + photos).
  // The API query above is preserved for future backend reconnect.

  // BMI Calculator States
  const [weight, setWeight] = useState<string>("70");
  const [height, setHeight] = useState<string>("175");
  const [bmiResult, setBmiResult] = useState<number | null>(null);
  const [bmiCategory, setBmiCategory] = useState<string>("");
  const [bmiSuggestion, setBmiSuggestion] = useState<string>("");

  // Contact States
  const [contactName, setContactName] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [contactMessage, setContactMessage] = useState("");
  const [contactSubmitted, setContactSubmitted] = useState(false);

  // Franchise inquiry states
  const [franchiseOpen, setFranchiseOpen] = useState(false);
  const [franchiseData, setFranchiseData] = useState({ name: "", city: "", capital: "20L-50L", phone: "" });
  const [franchiseSubmitted, setFranchiseSubmitted] = useState(false);

  // Mobile menu state
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Static-site actions: every enquiry / join-now CTA opens a WhatsApp chat with a
  // pre-filled message so leads reach the gym front desk directly.
  const openWhatsApp = (message: string) => {
    const url = `https://wa.me/${GYM_CONFIG.whatsapp}?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const JOIN_MESSAGE = "Hi Vikings Gym & Spa! I want to JOIN. Please share the membership plans and timings.";

  // Portal handlers are preserved for future portal reconnect.
  const portalHandlers = { onJoinNow, onLoginClick };
  void portalHandlers;

  const calculateBMI = (e: React.FormEvent) => {
    e.preventDefault();
    const w = parseFloat(weight);
    const h = parseFloat(height) / 100;
    if (w > 0 && h > 0) {
      const bmiValue = Number((w / (h * h)).toFixed(1));
      setBmiResult(bmiValue);
      if (bmiValue < 18.5) {
        setBmiCategory("Underweight (Level: Recruit)");
        setBmiSuggestion("Focus on caloric surplus and heavy compound lifts. We recommend the Vikings Monthly Recruit plan paired with Muscle Gain diet guidance.");
      } else if (bmiValue < 25) {
        setBmiCategory("Normal weight (Level: Shield Warrior)");
        setBmiSuggestion("Excellent metrics! Retain athletic functional mass. We recommend our Shield-Wall Quarterly or Berserker Half-Yearly plan.");
      } else if (bmiValue < 30) {
        setBmiCategory("Overweight (Level: Strongman)");
        setBmiSuggestion("Focus on high intensity cardio boxing routines & moderate caloric deficit. We suggest the Berserker Half-Yearly weight loss conditioning.");
      } else {
        setBmiCategory("Obese (Level: Berserker Champ)");
        setBmiSuggestion("High risk warning. Aim for sustained active conditioning. Try our Valhalla Annual Champion which includes trainer audit and custom diet.");
      }
    }
  };

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (contactName && contactPhone) {
      const msg = `Hi Vikings Gym & Spa! I'm ${contactName} (${contactPhone}). ${
        contactMessage ? `My inquiry: ${contactMessage}` : "I'd like to know more about your memberships & timings."
      }`;
      openWhatsApp(msg);
      setContactSubmitted(true);
      setTimeout(() => {
        setContactSubmitted(false);
        setContactName("");
        setContactPhone("");
        setContactMessage("");
      }, 4000);
    }
  };

  const handleFranchiseSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const msg = `FRANCHISE PROPOSAL — I'm ${franchiseData.name}. Preferred city: ${franchiseData.city}. Investment range: ${franchiseData.capital}. Contact: ${franchiseData.phone}.`;
    openWhatsApp(msg);
    setFranchiseSubmitted(true);
    setTimeout(() => {
      setFranchiseSubmitted(false);
      setFranchiseOpen(false);
      setFranchiseData({ name: "", city: "", capital: "20L-50L", phone: "" });
    }, 4000);
  };

  return (
    <div className="bg-black text-gray-200 min-h-screen font-sans selection:bg-red-600 selection:text-white">
      {/* Dynamic Header */}
      <nav className="sticky top-0 z-50 bg-black/90 backdrop-blur-md border-b border-red-950/40 px-6 py-4 flex justify-between items-center max-w-7xl mx-auto">
        <div className="flex items-center gap-3">
          <img src={logoPremium} alt="Vikings Logo" className="h-10 w-auto" />
          <span className="font-mono text-xl font-black tracking-tighter text-white">
            VIKINGS <span className="text-red-500">GYM & SPA</span>
          </span>
        </div>

        <div className="hidden lg:flex items-center gap-8 text-sm font-semibold tracking-wide text-gray-400">
          <a href="#about" className="hover:text-red-500 transition-colors">ABOUT</a>
          <a href="#facilities" className="hover:text-red-500 transition-colors">FACILITIES</a>
          <a href="#trainers" className="hover:text-red-500 transition-colors">TRAINERS</a>
          <a href="#gallery" className="hover:text-red-500 transition-colors">GALLERY</a>
          <a href="#pricing" className="hover:text-red-500 transition-colors">MEMBERSHIPS</a>
          <a href="#calculator" className="hover:text-red-500 transition-colors">BMI CALCULATOR</a>
          <a href="#contact" className="hover:text-red-500 transition-colors">CONTACT</a>
          <button
            onClick={() => setFranchiseOpen(true)}
            className="hover:text-red-500 transition-colors cursor-pointer text-left"
          >
            FRANCHISE
          </button>
        </div>

        <div className="flex items-center gap-3 sm:gap-4">
          {/* PORTAL LOGIN — hidden in static-site mode; preserved for future portal reconnect */}
          {PORTAL_ACCESS_ENABLED && (
            <button
              onClick={onLoginClick}
              className="hidden sm:block text-xs font-mono font-bold text-gray-300 hover:text-white border border-gray-800 hover:border-gray-600 px-4 py-2 rounded-md transition-all cursor-pointer"
            >
              PORTAL LOGIN
            </button>
          )}

          <button
            onClick={() => openWhatsApp(JOIN_MESSAGE)}
            className="bg-red-600 hover:bg-red-700 text-black font-mono font-black text-xs px-4 py-2 sm:px-5 sm:py-2.5 rounded hover:scale-105 active:scale-95 transition-all shadow-lg shadow-red-600/20 cursor-pointer"
          >
            JOIN NOW
          </button>

          <button 
            className="lg:hidden text-white p-2"
            onClick={() => setIsMobileMenuOpen(true)}
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-[60] bg-black/95 backdrop-blur-xl flex flex-col items-center justify-center"
          >
            <button 
              className="absolute top-6 right-6 text-white p-2 cursor-pointer hover:text-red-500 transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <X className="w-8 h-8" />
            </button>

            <div className="flex flex-col items-center gap-8 text-xl font-bold font-mono tracking-widest text-gray-300">
              <a href="#about" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-red-500 transition-colors">ABOUT</a>
              <a href="#facilities" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-red-500 transition-colors">FACILITIES</a>
              <a href="#trainers" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-red-500 transition-colors">TRAINERS</a>
              <a href="#gallery" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-red-500 transition-colors">GALLERY</a>
              <a href="#pricing" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-red-500 transition-colors">MEMBERSHIPS</a>
              <a href="#calculator" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-red-500 transition-colors">BMI CALCULATOR</a>
              <a href="#contact" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-red-500 transition-colors">CONTACT</a>
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  setFranchiseOpen(true);
                }}
                className="hover:text-red-500 transition-colors cursor-pointer text-center uppercase"
              >
                Franchise
              </button>

              {/* PORTAL LOGIN — hidden in static-site mode; preserved for future portal reconnect */}
              {PORTAL_ACCESS_ENABLED && (
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    onLoginClick();
                  }}
                  className="mt-8 text-sm font-mono font-bold text-white border border-red-900 bg-red-950/20 px-8 py-3 rounded-md transition-all cursor-pointer"
                >
                  PORTAL LOGIN
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero Section */}
      <AnimatedMarqueeHero
        tagline="AURANGABAD'S ULTIMATE COMMERCIAL FITNESS & STEAM SPA"
        title={
          <>
            CARVE YOUR BODY <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-rose-600 to-red-800">
              FOR VALHALLA
            </span>
          </>
        }
        description="A high-end, premium, dark-themed training facility featuring imported heavy duty plate-loaded machines, Olympic powerlifting stations, structured cardio rooms, and complete rejuvenating Moroccan steam spa baths."
        ctaText="INVEST IN YOURSELF"
        onCtaClick={() => openWhatsApp(JOIN_MESSAGE)}
        images={[
          "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1470&auto=format&fit=crop",
          "https://images.unsplash.com/photo-1540497077202-7c8a3999166f?q=80&w=1470&auto=format&fit=crop",
          "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=1470&auto=format&fit=crop",
          "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?q=80&w=1470&auto=format&fit=crop",
          "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?q=80&w=1470&auto=format&fit=crop",
          "https://images.unsplash.com/photo-1574680096145-d05b474e2155?q=80&w=1470&auto=format&fit=crop",
          "https://images.unsplash.com/photo-1599058917212-d750089bc07e?q=80&w=1469&auto=format&fit=crop"
        ]}
      />

      {/* Facilities Showcase */}
<section id="facilities" className="py-24 px-6 max-w-7xl mx-auto border-b border-red-950/20">
        <div className="text-center mb-16">
          <p className="text-red-500 font-mono text-xs tracking-widest uppercase mb-2">ROYAL EXPERIENCE</p>
          <h2 className="text-3xl md:text-4xl font-sans font-black text-white uppercase tracking-tight">
            WORLD-CLASS WELLNESS FACILITIES
          </h2>
          <div className="w-16 h-1 bg-red-650 mx-auto mt-4 rounded"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              title: "Imported Strength Station",
              description: "Plate-loaded machines from Hammer Strength, custom lat rows, hack squat hubs, and full selectorized stack tools.",
              icon: Dumbbell,
              img: "https://images.unsplash.com/photo-1540497077202-7c8a3999166f?auto=format&fit=crop&q=80&w=600"
            },
            {
              title: "Moroccan Steam & Spa",
              description: "Indulge in physical hot hydrotherapy. Revitalize muscles, optimize circulatory systems, and promote post-lifting detox.",
              icon: Sparkles,
              img: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&q=80&w=600"
            },
            {
              title: "Olympic Powerlifting Center",
              description: "Premium competition bars, calibrated plates, heavy drop deadlift platforms, and competition squat racks.",
              icon: Award,
              img: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&q=80&w=600"
            }
          ].map((f, i) => (
            <div key={i} className="bg-neutral-900/50 rounded-2xl overflow-hidden border border-neutral-800/30 group-hover:border-red-600/30 transition-all duration-300 flex flex-col h-full">
              <div className="relative h-48 overflow-hidden bg-neutral-900">
                <img
                  src={f.img}
                  alt={f.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-80"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
                <div className="absolute top-4 left-4 bg-red-600 text-black p-2 rounded">
                  <div className="w-2 h-2 rounded-full bg-red-300 animate-pulse" />
                </div>
              </div>
              <div className="p-5 flex flex-col">
                <h3 className="text-lg font-mono font-bold text-white mb-2">{f.title}</h3>
                <p className="text-gray-300 text-sm leading-relaxed">{f.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* BMI Calculator Section */}
      <section id="calculator" className="py-24 bg-neutral-950/70 border-b border-red-950/20 px-6">
        <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <div className="flex items-center gap-2 bg-red-650/10 border border-red-900/30 px-3 py-1 rounded-full text-red-500 text-xs font-mono w-max mb-6">
              <Calculator className="w-3.5 h-3.5" />
              PHYSIOLOGY AUDIT TOOL
            </div>
            <h2 className="text-3xl md:text-4xl font-sans font-black text-white uppercase tracking-tight mb-6">
              COMPUTE YOUR INDEX & START YOUR TRANSFORMATION
            </h2>
            <p className="text-gray-400 text-sm md:text-base leading-relaxed mb-6">
              Knowing your Body Mass Index (BMI) gives Vikings coaching trainers immediate starting insights into your biological requirements, lean muscle limits, and calorie baselines. Compute yours instantly and match with a personalized club plan!
            </p>
            <div className="bg-neutral-900/60 border border-neutral-800/60 p-5 rounded-lg flex items-start gap-4">
              <ShieldAlert className="w-6 h-6 text-red-500 shrink-0 mt-0.5" />
              <p className="text-xs text-gray-400 leading-relaxed">
                <strong className="text-white font-mono block mb-1">HEALTH & MEDICAL STANDARDS:</strong>
                If you suffer from historical blood pressure conditions, bone fractures, or other relevant cardiac issues, please mention these detailed factors on our member registration card in the front desk office.
              </p>
            </div>
          </div>

          <div className="bg-neutral-900/50 border border-red-950/20 p-8 rounded-xl backdrop-blur-md relative overflow-hidden">
            <h3 className="text-lg font-mono font-bold tracking-wider text-white mb-6 uppercase flex items-center gap-2">
              <Compass className="text-red-500 w-5 h-5" /> BMI AUDIT ENGINE
            </h3>

            <form onSubmit={calculateBMI} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono text-gray-400 mb-2 uppercase">Weight (KG)</label>
                  <input
                    type="number"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-850 px-4 py-3 rounded text-white text-sm focus:border-red-650 focus:outline-none"
                    placeholder="e.g. 74"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono text-gray-400 mb-2 uppercase">Height (CM)</label>
                  <input
                    type="number"
                    value={height}
                    onChange={(e) => setHeight(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-850 px-4 py-3 rounded text-white text-sm focus:border-red-650 focus:outline-none"
                    placeholder="e.g. 178"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-red-600 hover:bg-red-700 text-black py-3 rounded font-mono font-bold text-xs tracking-widest transition-all cursor-pointer"
              >
                COMPUTE METRIC
              </button>
            </form>

            {bmiResult !== null && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-8 pt-6 border-t border-neutral-850"
              >
                <div className="flex justify-between items-center mb-3">
                  <span className="text-sm font-mono text-gray-400">YOUR ACCURATE BMI:</span>
                  <span className="text-2xl font-mono font-black text-rose-500 bg-red-600/10 px-3 py-1 rounded border border-red-900/40">
                    {bmiResult}
                  </span>
                </div>
                <div className="mb-4">
                  <span className="text-xs font-mono text-gray-500 uppercase block mb-1">BIOLOGY SCALE:</span>
                  <span className="text-sm font-bold text-white block">{bmiCategory}</span>
                </div>
                <div className="bg-black/60 border border-neutral-850 p-4 rounded text-xs text-gray-400 leading-normal">
                  {bmiSuggestion}
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </section>

      {/* Pricing / Memberships */}
      <section id="pricing" className="py-24 px-6 max-w-7xl mx-auto border-b border-red-950/20">
        <div className="text-center mb-16">
          <p className="text-red-500 font-mono text-xs tracking-widest uppercase mb-2">SHIELD WALL PLANS</p>
          <h2 className="text-3xl md:text-4xl font-sans font-black text-white uppercase tracking-tight">
            MEMBERSHIP TIERS & PRICING
          </h2>
          <div className="w-16 h-1 bg-red-650 mx-auto mt-4 rounded animate-pulse"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {(plansData && plansData.length > 0 ? plansData : DEFAULT_PLANS).map((plan: any, index: number) => (
            <div
              key={index}
              className={`bg-neutral-900/40 rounded-xl relative border ${plan.popular ? "border-red-600 shadow-xl shadow-red-900/10 scale-105" : "border-neutral-850"} p-6 flex flex-col justify-between`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-red-600 text-black text-[10px] font-mono font-black py-1 px-3 rounded uppercase tracking-wider">
                  MOST POPULAR
                </div>
              )}

              <div>
                <h3 className="text-white font-sans font-bold text-lg mb-2">{plan.name}</h3>
                <p className="text-gray-400 text-xs leading-normal mb-4 min-h-[36px]">{plan.desc}</p>

                <div className="mb-6 pb-6 border-b border-neutral-850">
                  <span className="text-3xl font-mono font-black text-white">{plan.price}</span>
                  <span className="text-xs text-gray-500 font-mono block mt-1">{plan.period}</span>
                </div>

                <ul className="space-y-3 mb-8">
                  {Array.isArray(plan.features) ? plan.features.map((f: string, i: number) => (
                    <li key={i} className="flex gap-2.5 items-start text-xs text-gray-300">
                      <CheckCircle className="w-4 h-4 text-red-500 shrink-0 select-none" />
                      <span>{f}</span>
                    </li>
                  )) : (
                    <li className="flex gap-2.5 items-start text-xs text-gray-300">
                      <CheckCircle className="w-4 h-4 text-red-500 shrink-0 select-none" />
                      <span>{plan.features || plan.desc}</span>
                    </li>
                  )}
                </ul>
              </div>

              <button
                onClick={() => openWhatsApp(`Hi Vikings Gym & Spa! I want to secure the ${plan.name} (${plan.price} / ${plan.period}). Please confirm availability.`)}
                className={`w-full py-3 rounded-md font-mono font-bold text-xs tracking-wider transition-all cursor-pointer ${plan.popular
                  ? "bg-red-600 hover:bg-red-700 text-black shadow-lg"
                  : "bg-neutral-950 hover:bg-neutral-900 text-gray-300 border border-neutral-800 hover:border-gray-600"
                  }`}
              >
                SECURE SLOT NOW
              </button>
            </div>
          ))}
        </div>

        {/* Group Classes & Personal Training */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-neutral-900/30 border border-neutral-900 rounded-xl p-8">
            <p className="text-red-500 font-mono text-xs tracking-widest uppercase mb-4">GROUP CLASSES · ₹1,500 / 30 DAYS</p>
            <h3 className="text-white font-sans font-bold text-lg mb-4">TRAIN IN THE PACK</h3>
            <ul className="space-y-3 mb-6">
              {["Zumba", "Dance Classes", "Yoga"].map((c) => (
                <li key={c} className="flex gap-2.5 items-start text-xs text-gray-300">
                  <CheckCircle className="w-4 h-4 text-red-500 shrink-0 select-none" />
                  <span>{c} — ₹1,500 / month</span>
                </li>
              ))}
            </ul>
            <button
              onClick={() => openWhatsApp("Hi Vikings Gym & Spa! I'd like to enquire about GROUP CLASSES (Zumba / Dance / Yoga). Please share details.")}
              className="w-full py-3 rounded-md font-mono font-bold text-xs tracking-wider transition-all cursor-pointer bg-neutral-950 hover:bg-neutral-900 text-gray-300 border border-neutral-800 hover:border-gray-600"
            >
              ENQUIRE ABOUT GROUP CLASSES
            </button>
          </div>

          <div className="bg-neutral-900/30 border border-neutral-900 rounded-xl p-8">
            <p className="text-red-500 font-mono text-xs tracking-widest uppercase mb-4">PERSONAL TRAINING · 1-ON-1 COACHING</p>
            <h3 className="text-white font-sans font-bold text-lg mb-4">TRAIN LIKE A BERSERKER</h3>
            <ul className="space-y-3 mb-6">
              {[
                { name: "1 Month", price: "₹7,000" },
                { name: "2 Months", price: "₹12,000" },
                { name: "3 Months", price: "₹21,000" },
              ].map((pt) => (
                <li key={pt.name} className="flex justify-between items-center text-xs text-gray-300">
                  <span className="flex gap-2.5 items-center">
                    <CheckCircle className="w-4 h-4 text-red-500 shrink-0 select-none" />
                    {pt.name} Personal Training
                  </span>
                  <span className="font-mono text-white font-bold">{pt.price}</span>
                </li>
              ))}
            </ul>
            <button
              onClick={() => openWhatsApp("Hi Vikings Gym & Spa! I'd like to BOOK A PERSONAL TRAINER session. Please share availability & pricing.")}
              className="w-full py-3 rounded-md font-mono font-bold text-xs tracking-wider transition-all cursor-pointer bg-neutral-950 hover:bg-neutral-900 text-gray-300 border border-neutral-800 hover:border-gray-600"
            >
              BOOK A PERSONAL TRAINER
            </button>
          </div>
        </div>
      </section>
      <section id="trainers" className="py-24 bg-neutral-950/40 px-6 border-b border-red-950/20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-red-500 font-mono text-xs tracking-widest uppercase mb-2">ELITE VALKYRIES & BERSERKERS</p>
            <h2 className="text-3xl md:text-4xl font-sans font-black text-white uppercase tracking-tight">
              MEET YOUR master COACHES
            </h2>
            <div className="w-16 h-1 bg-red-650 mx-auto mt-4 rounded"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-4xl mx-auto">
            {DEFAULT_TRAINERS.map((t: any, idx: number) => (
              <div key={idx} className="bg-neutral-900/30 border border-neutral-900 rounded-xl overflow-hidden flex flex-col md:flex-row group hover:border-red-950 transition-all duration-300">
                <div className="md:w-2/5 h-64 md:h-auto bg-neutral-900">
                  {t.photoUrl ? (
                    <img src={t.photoUrl} alt={t.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-red-950 via-neutral-900 to-neutral-950 flex items-center justify-center relative">
                      <div className="absolute inset-0 opacity-20 bg-[linear-gradient(to_right,rgba(255,255,255,0.1)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[size:20px_20px]"></div>
                      <div className="w-24 h-24 rounded-full border-2 border-red-600/60 bg-neutral-950 flex items-center justify-center relative">
                        <span className="text-red-500 font-mono text-5xl font-black uppercase">{t.name ? t.name.charAt(0) : '?'}</span>
                      </div>
                    </div>
                  )}
                </div>
                <div className="md:w-3/5 p-6 flex flex-col justify-between">
                  <div>
                    <div className="text-xs font-mono font-bold text-red-500 mb-1">{t.role}</div>
                    <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
                      {t.name}
                      {t.instagram && (
                        <a
                          href={t.instagram}
                          target="_blank"
                          rel="noreferrer"
                          className="text-[10px] font-mono font-bold text-gray-400 hover:text-white transition-colors"
                          title={`Instagram ${t.instagramHandle || ""}`.trim()}
                        >
                          <Instagram className="w-4 h-4" />
                        </a>
                      )}
                    </h3>
                    <div className="font-mono text-[10px] text-gray-500 mb-3">{t.years}</div>
                    <p className="text-gray-400 text-xs leading-relaxed mb-4">{t.desc}</p>
                  </div>

                  <div className="flex flex-wrap gap-1.5 pt-3 border-t border-neutral-850">
                    {Array.isArray(t.cert) ? t.cert.map((c: string, i: number) => (
                      <span key={i} className="text-[9px] font-mono bg-neutral-950 text-gray-400 px-2 py-0.5 rounded border border-neutral-900">
                        {c}
                      </span>
                    )) : t.cert ? (
                      <span className="text-[9px] font-mono bg-neutral-950 text-gray-400 px-2 py-0.5 rounded border border-neutral-900">
                        {t.cert}
                      </span>
                    ) : null}

                    {t.instagram && (
                      <a
                        href={t.instagram}
                        target="_blank"
                        rel="noreferrer"
                        className="ml-auto text-[9px] font-mono bg-red-600/10 text-red-400 hover:text-white hover:bg-red-600/25 px-2.5 py-0.5 rounded border border-red-900/50 transition-all uppercase font-bold"
                      >
                        <Instagram className="w-3 h-3 inline -mt-0.5 mr-1" />
                        {t.instagramHandle || "Instagram"}
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery & Official Instagram Section */}
      <section id="gallery" className="py-24 bg-neutral-950/40 px-6 border-b border-red-950/20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-red-500 font-mono text-xs tracking-widest uppercase mb-2">LIVE FROM THE ARENA</p>
            <h2 className="text-3xl md:text-4xl font-sans font-black text-white uppercase tracking-tight">
              GALLERY & DAILY STORIES
            </h2>
            <div className="w-16 h-1 bg-red-650 mx-auto mt-4 rounded"></div>
            <p className="text-gray-400 text-sm mt-6 max-w-xl mx-auto leading-relaxed">
              Training clips, member transformations and steam-spa energy — posted every day on our official account{" "}
              <a href={GYM_CONFIG.instagram} target="_blank" rel="noreferrer" className="text-red-500 hover:underline">@{GYM_CONFIG.instagramHandle}</a>.
              Tap today's stories below to watch the action live on Instagram.
            </p>
          </div>

          {/* Daily Stories strip */}
          <div className="mb-14">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-mono text-sm font-black text-white uppercase tracking-widest flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-red-600/10 border border-red-500/30 flex items-center justify-center">
                  <Play className="w-3 h-3 text-red-500 fill-red-500" />
                </span>
                DAILY STORIES
              </h3>
              <a
                href={GYM_CONFIG.instagramStories}
                target="_blank"
                rel="noreferrer"
                className="text-[10px] font-mono text-red-500 hover:text-white uppercase font-bold transition-colors"
              >
                View on Instagram →
              </a>
            </div>

            <div className="flex gap-5 overflow-x-auto pb-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {STORY_TILES.map((s, i) => (
                <a
                  key={i}
                  href={GYM_CONFIG.instagramStories}
                  target="_blank"
                  rel="noreferrer"
                  className="flex flex-col items-center shrink-0 group"
                  title={`Watch today's stories`}
                >
                  <div className="relative w-20 h-20 md:w-24 md:h-24 rounded-full p-[3px] bg-gradient-to-tr from-red-600 via-rose-500 to-amber-400 group-hover:scale-105 transition-transform">
                    <div className="w-full h-full rounded-full overflow-hidden border-4 border-black">
                      <img src={s.img} alt={s.label} loading="lazy" className="w-full h-full object-cover" />
                    </div>
                    <span className="absolute inset-0 flex items-center justify-center">
                      <span className="w-8 h-8 rounded-full bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm">
                        <Play className="w-4 h-4 text-white fill-white ml-0.5" />
                      </span>
                    </span>
                  </div>
                  <span className="mt-2 text-[9px] font-mono text-gray-400 uppercase tracking-wider">{s.label}</span>
                </a>
              ))}
            </div>
            <p className="text-[10px] font-mono text-gray-600 mt-3">
              Stories refresh every 24 hours on our official Instagram account — tap any bubble to watch live.
            </p>
          </div>

          {/* Gallery grid */}
          <div>
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-mono text-sm font-black text-white uppercase tracking-widest">GALLERY</h3>
              <a
                href={GYM_CONFIG.instagram}
                target="_blank"
                rel="noreferrer"
                className="text-[10px] font-mono text-red-500 hover:text-white uppercase font-bold transition-colors"
              >
                Follow @{GYM_CONFIG.instagramHandle} →
              </a>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {GYM_CONFIG.instagramWidget ? (
                <div className="col-span-2 md:col-span-4 rounded-xl border border-neutral-900 overflow-hidden bg-neutral-950/60 p-3">
                  <InstagramWidget snippet={GYM_CONFIG.instagramWidget} />
                </div>
              ) : (
                GALLERY_IMAGES.map((img, i) => (
                  <a
                    key={i}
                    href={GYM_CONFIG.instagram}
                    target="_blank"
                    rel="noreferrer"
                    className="relative h-40 md:h-52 overflow-hidden rounded-lg group border border-neutral-900 hover:border-red-900/60 transition-all"
                  >
                    <img
                      src={img.url}
                      alt={img.alt}
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity">
                      <span className="text-[9px] font-mono text-white uppercase tracking-wider">{img.label}</span>
                      <Instagram className="w-3 h-3 text-red-400 shrink-0" />
                    </div>
                  </a>
                ))
              )}
            </div>
          </div>

          {/* Follow CTA */}
          <div className="mt-12 bg-neutral-900/40 border border-neutral-900 rounded-xl p-8 text-center">
            <h4 className="font-mono font-black text-white uppercase tracking-widest mb-2">DON'T MISS TODAY'S ACTION</h4>
            <p className="text-xs text-gray-400 mb-6 max-w-lg mx-auto leading-relaxed">
              Follow us for daily training clips, member transformation updates and behind-the-scenes energy from the gym floor.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <a
                href={GYM_CONFIG.instagram}
                target="_blank"
                rel="noreferrer"
                className="bg-red-600 hover:bg-red-700 text-black font-mono font-black text-xs px-6 py-3 rounded transition-all cursor-pointer flex items-center gap-2"
              >
                <Instagram className="w-4 h-4" /> FOLLOW @{GYM_CONFIG.instagramHandle.toUpperCase()}
              </a>
              <a
                href={GYM_CONFIG.instagramStories}
                target="_blank"
                rel="noreferrer"
                className="bg-neutral-950 hover:bg-neutral-900 text-gray-300 border border-neutral-800 hover:border-gray-600 font-mono font-black text-xs px-6 py-3 rounded transition-all cursor-pointer"
              >
                WATCH TODAY'S STORIES
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Contact & Map Section */}
      <section id="contact" className="py-24 px-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          <div>
            <span className="text-red-500 font-mono text-xs tracking-widest uppercase block mb-2">VISIT THE KINGDOM</span>
            <h2 className="text-3xl font-sans font-black text-white uppercase tracking-tight mb-6">
              LOCATION & OPERATING DETAILS
            </h2>
            <p className="text-gray-400 text-sm md:text-base leading-relaxed mb-8">
              Drop in for a high-fidelity physical facility tour, experience our steam spa chambers, and enjoy an pre-workout beverage inside our supplements cafe. We're on MG Road, Aurangabad — open Monday to Saturday, 5 AM to 10 PM.
            </p>

            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <MapPin className="w-5 h-5 text-red-500 mt-1 shrink-0" />
                <div>
                  <h4 className="text-white text-sm font-mono font-bold uppercase mb-1">GYM ADDRESS:</h4>
                  <p className="text-xs text-gray-400">
                    {GYM_CONFIG.address}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <Phone className="w-5 h-5 text-red-500 mt-1 shrink-0" />
                <div>
                  <h4 className="text-white text-sm font-mono font-bold uppercase mb-1">DIRECT INQUIRIES:</h4>
                  <p className="text-xs text-gray-400">
                    <a href={`tel:${GYM_CONFIG.phone}`} className="hover:text-red-500">{GYM_CONFIG.phoneDisplay}</a> ·{" "}
                    <a href={`https://wa.me/${GYM_CONFIG.whatsapp}`} target="_blank" rel="noreferrer" className="hover:text-red-500">WhatsApp</a>
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <Calendar className="w-5 h-5 text-red-500 mt-1 shrink-0" />
                <div>
                  <h4 className="text-white text-sm font-mono font-bold uppercase mb-1">WARRIORS DOCTRINE TIMINGS:</h4>
                  <p className="text-xs text-gray-400 font-mono leading-relaxed">
                    {GYM_CONFIG.hours}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-neutral-900/50 border border-neutral-900 rounded-xl p-8 backdrop-blur-md">
            <h3 className="text-lg font-mono font-bold text-white mb-6 uppercase flex items-center gap-2">
              <Compass className="text-red-500 w-5 h-5" /> EXPEDITE GUEST INQUIRY
            </h3>

            {contactSubmitted ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-red-650/10 border border-red-900/40 p-6 rounded-lg text-center"
              >
                <CheckCircle className="w-12 h-12 text-red-500 mx-auto mb-3" />
                <h4 className="text-white font-mono font-bold text-sm uppercase mb-1">MESSAGE TRANSMITTED</h4>
                <p className="text-xs text-gray-400">
                  A front desk assistant from Vikings Gym Aurangabad will get back to you via call or WhatsApp on {contactPhone} shortly. Prepare your shields!
                </p>
              </motion.div>
            ) : (
              <form onSubmit={handleContactSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-mono text-gray-400 mb-1.5 uppercase">Full Name</label>
                  <input
                    type="text"
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                    className="w-full bg-black/50 border border-neutral-850 px-4 py-2.5 rounded text-white text-xs focus:border-red-650 focus:outline-none"
                    placeholder="e.g. Ritwik Singh"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-gray-400 mb-1.5 uppercase">Phone Number</label>
                  <input
                    type="tel"
                    value={contactPhone}
                    onChange={(e) => setContactPhone(e.target.value)}
                    className="w-full bg-black/50 border border-neutral-850 px-4 py-2.5 rounded text-white text-xs focus:border-red-650 focus:outline-none"
                    placeholder="e.g. +91 XXXXX XXXXX"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-gray-400 mb-1.5 uppercase">Message (What are your fitness limits?)</label>
                  <textarea
                    rows={3}
                    value={contactMessage}
                    onChange={(e) => setContactMessage(e.target.value)}
                    className="w-full bg-black/50 border border-neutral-850 px-4 py-2.5 rounded text-white text-xs focus:border-red-650 focus:outline-none"
                    placeholder="Want to inquire about trainers..."
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="w-full bg-red-600 hover:bg-red-700 text-black py-3 rounded font-mono font-bold text-xs tracking-widest transition-all cursor-pointer"
                >
                  DISPATCH INQUIRY
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* Franchise Query Modal */}
      {franchiseOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-lg bg-neutral-950 border border-red-950/80 p-8 rounded-xl shadow-2xl relative"
          >
            <button
              onClick={() => setFranchiseOpen(false)}
              className="absolute right-4 top-4 text-xs font-mono text-gray-500 hover:text-gray-300"
            >
              [CLOSE]
            </button>

            <h3 className="text-xl font-mono font-black text-white uppercase tracking-tight mb-2">
              FRANCHISE INVESTOR EXPEDITION
            </h3>
            <p className="text-xs text-gray-500 mb-6 leading-relaxed">
              Become a part of the rapid-scale Vikings commercial gym network. We provide absolute site configuration layout plans, digital marketing formulas, customized billing ERP software tools, and certified instructor coaching pools.
            </p>

            {franchiseSubmitted ? (
              <div className="bg-red-650/10 border border-red-900/40 p-6 rounded-lg text-center">
                <CheckCircle className="w-10 h-10 text-red-500 mx-auto mb-2" />
                <h4 className="text-white font-mono text-xs uppercase mb-1">PROPOSAL RECEIVED</h4>
                <p className="text-[11px] text-gray-400">
                  Our franchisee expansion director (Mr. Karan Singh) will check reports for <strong>{franchiseData.city}</strong> and schedule an inspection briefing session.
                </p>
              </div>
            ) : (
              <form onSubmit={handleFranchiseSubmit} className="space-y-4">
                <div>
                  <label className="block text-[10px] font-mono text-gray-400 mb-1 uppercase">Full Name</label>
                  <input
                    type="text"
                    value={franchiseData.name}
                    onChange={(e) => setFranchiseData({ ...franchiseData, name: e.target.value })}
                    required
                    className="w-full bg-neutral-900 border border-neutral-800 px-3 py-2 rounded text-white text-xs focus:ring-1 focus:ring-red-600 focus:outline-none"
                    placeholder="e.g. Vikram Joshi"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-mono text-gray-400 mb-1 uppercase">Proposed City/Location</label>
                    <input
                      type="text"
                      value={franchiseData.city}
                      onChange={(e) => setFranchiseData({ ...franchiseData, city: e.target.value })}
                      required
                      className="w-full bg-neutral-900 border border-neutral-800 px-3 py-2 rounded text-white text-xs focus:ring-1 focus:ring-red-600 focus:outline-none"
                      placeholder="e.g. Nanded, Jalna"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-mono text-gray-400 mb-1 uppercase">Available Investment Capital</label>
                    <select
                      value={franchiseData.capital}
                      onChange={(e) => setFranchiseData({ ...franchiseData, capital: e.target.value })}
                      className="w-full bg-neutral-900 border border-neutral-800 px-3 py-2 rounded text-white text-xs focus:ring-1 focus:ring-red-650 focus:outline-none"
                    >
                      <option value="20L-50L">₹20 Lakhs - ₹50 Lakhs</option>
                      <option value="50L-1Cr">₹50 Lakhs - ₹1 Crore</option>
                      <option value="1Cr+">₹1 Crore +</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-mono text-gray-400 mb-1 uppercase">Direct Phone Number</label>
                  <input
                    type="tel"
                    value={franchiseData.phone}
                    onChange={(e) => setFranchiseData({ ...franchiseData, phone: e.target.value })}
                    required
                    className="w-full bg-neutral-900 border border-neutral-800 px-3 py-2 rounded text-white text-xs focus:ring-1 focus:ring-red-600 focus:outline-none"
                    placeholder="e.g. +91 97654..."
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-red-600 hover:bg-red-700 text-black py-2.5 rounded font-mono font-bold text-xs tracking-widest transition-all uppercase cursor-pointer"
                >
                  TRANSMIT PROPOSAL
                </button>
              </form>
            )}
          </motion.div>
        </div>
      )}

      {/* About Section (bottom of page) */}
      <section id="about" className="py-24 px-6 max-w-7xl mx-auto border-b border-red-950/20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <p className="text-red-500 font-mono text-xs tracking-widest uppercase mb-2">ABOUT THE KINGDOM</p>
            <h2 className="text-3xl md:text-4xl font-sans font-black text-white uppercase tracking-tight mb-6">
              VIKINGS GYM <span className="text-red-500">वाइकिंग्स जिम</span>
            </h2>
            <div className="flex items-center gap-3 mb-6">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className={`w-4 h-4 ${i < Math.floor(GYM_CONFIG.rating) ? "text-amber-400 fill-amber-400" : "text-gray-600"}`} />
                ))}
              </div>
              <span className="text-sm font-mono text-white">{GYM_CONFIG.rating}</span>
              <a href={GYM_CONFIG.mapLink} target="_blank" rel="noreferrer" className="text-xs font-mono text-gray-400 hover:text-red-500 underline underline-offset-2">
                Rated {GYM_CONFIG.reviews} times on Google
              </a>
            </div>
            <p className="text-gray-400 text-sm md:text-base leading-relaxed mb-6">
              {GYM_CONFIG.name} is Aurangabad's ultimate commercial fitness & steam spa facility. Imported heavy-duty
              plate-loaded machines, Olympic powerlifting stations, structured cardio rooms, and complete rejuvenating
              Moroccan steam spa baths — built for warriors who want to train hard and recover harder.
            </p>
            <ul className="space-y-4 mb-8">
              <li className="flex items-start gap-3 text-sm text-gray-300">
                <MapPin className="w-5 h-5 text-red-500 mt-0.5 shrink-0" />
                <div>
                  <span className="font-mono text-white text-xs uppercase">Address:</span>
                  <p className="text-gray-400 text-xs mt-1">{GYM_CONFIG.address} (see map below for directions)</p>
                </div>
              </li>
              <li className="flex items-start gap-3 text-sm text-gray-300">
                <Phone className="w-5 h-5 text-red-500 mt-0.5 shrink-0" />
                <div>
                  <span className="font-mono text-white text-xs uppercase">Call / WhatsApp:</span>
                  <p className="text-gray-400 text-xs mt-1">
                    <a href={`tel:${GYM_CONFIG.phone}`} className="hover:text-red-500">{GYM_CONFIG.phoneDisplay}</a> ·{" "}
                    <a href={`https://wa.me/${GYM_CONFIG.whatsapp}`} target="_blank" rel="noreferrer" className="hover:text-red-500">WhatsApp us</a>
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-3 text-sm text-gray-300">
                <Calendar className="w-5 h-5 text-red-500 mt-0.5 shrink-0" />
                <div>
                  <span className="font-mono text-white text-xs uppercase">Operating Hours:</span>
                  <p className="text-gray-400 text-xs mt-1">{GYM_CONFIG.hours}</p>
                </div>
              </li>
              <li className="flex items-start gap-3 text-sm text-gray-300">
                <Instagram className="w-5 h-5 text-red-500 mt-0.5 shrink-0" />
                <div>
                  <span className="font-mono text-white text-xs uppercase">Instagram:</span>
                  <p className="text-gray-400 text-xs mt-1">
                    <a href={GYM_CONFIG.instagram} target="_blank" rel="noreferrer" className="hover:text-red-500">@{GYM_CONFIG.instagram.split("/").pop()}</a>
                  </p>
                </div>
              </li>
            </ul>
            <button
              onClick={() => openWhatsApp(JOIN_MESSAGE)}
              className="bg-red-600 hover:bg-red-700 text-black font-mono font-black text-xs px-6 py-3 rounded hover:scale-105 active:scale-95 transition-all shadow-lg shadow-red-600/20 cursor-pointer"
            >
              BEGIN YOUR JOURNEY
            </button>
          </div>

          <div className="bg-neutral-900/50 border border-neutral-900 rounded-xl overflow-hidden">
            <iframe
              src={GYM_CONFIG.mapEmbed}
              title="VIKINGS GYM Location"
              className="w-full h-[400px] border-0"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
            <div className="p-5 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span className="text-xs font-mono text-emerald-400">OPEN NOW · {GYM_CONFIG.hours}</span>
              </div>
              <a
                href={GYM_CONFIG.mapLink}
                target="_blank"
                rel="noreferrer"
                className="text-xs font-mono font-bold text-black bg-red-600 hover:bg-red-700 px-4 py-2 rounded transition-all cursor-pointer"
              >
                GET DIRECTIONS
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-neutral-950/80 border-t border-neutral-900 px-6 py-12 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-3">
            <img src={logoPremium} alt="Vikings Logo" className="h-8 w-auto" />
            <span className="font-mono text-sm font-black text-white tracking-widest">
              VIKINGS <span className="text-red-500">GYM & SPA</span>
            </span>
          </div>

          <p className="text-xs text-gray-500 font-mono text-center md:text-left">
            © 2026 Vikings Gym & Spa - MG Road, Aurangabad, Bihar. All rights reserved.
          </p>

          <div className="flex gap-4">
            <a href={GYM_CONFIG.instagram} target="_blank" rel="noreferrer" className="p-2 bg-neutral-900 hover:bg-neutral-850 rounded text-gray-400 hover:text-white transition-all">
              <Instagram className="w-4 h-4" />
            </a>
            <a href={GYM_CONFIG.mapLink} target="_blank" rel="noreferrer" className="p-2 bg-neutral-900 hover:bg-neutral-850 rounded text-gray-400 hover:text-white transition-all">
              <MapPin className="w-4 h-4" />
            </a>
            <a href={`tel:${GYM_CONFIG.phone}`} className="p-2 bg-neutral-900 hover:bg-neutral-850 rounded text-gray-400 hover:text-white transition-all">
              <Phone className="w-4 h-4" />
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
