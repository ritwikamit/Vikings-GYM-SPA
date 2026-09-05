import React, { useState, useEffect } from "react";
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
  ArrowUp,
  ChevronDown,
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
import photoDeepsikha from "../../assets/trainers/deepsikha.jpg";
import photoVaishnavi from "../../assets/trainers/vaishnavi-singh.jpg";
import photoNeha from "../../assets/trainers/neha-singh.jpg";
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
  {
    name: "Deepsikha",
    role: "DANCE COACH & CHOREOGRAPHER",
    years: "Fitness that moves to the beat",
    desc: "Energetic dance coach at Vikings Gym & Spa who leads high-energy dance, Zumba-style and choreography sessions — making cardio fun, rhythmic and addictive for every member.",
    cert: ["Dance", "Choreography", "Cardio"],
    instagram: "https://www.instagram.com/wanderbiharan/",
    instagramHandle: "@wanderbiharan",
    photoUrl: photoDeepsikha,
  },
  {
    name: "Vaishnavi Singh",
    role: "GYM BRAND AMBASSADOR",
    years: "The face of the Vikings lifestyle",
    desc: "Official gym brand ambassador for Vikings Gym & Spa — representing the energy, community and warrior mindset of the Vikings family across every platform.",
    cert: ["Brand Ambassador"],
    instagram: "https://www.instagram.com/chawal.to.choorma/",
    instagramHandle: "@chawal.to.choorma",
    photoUrl: photoVaishnavi,
  },
  {
    name: "Neha Singh",
    role: "FEMALE FITNESS TRAINER",
    years: "Empowering every warrior",
    desc: "Female fitness trainer at Vikings Gym & Spa who coaches strength, conditioning and confidence — supporting members of all levels on their fitness journey.",
    cert: ["Strength", "Conditioning"],
    instagram: "https://www.instagram.com/smiley_lily02/",
    instagramHandle: "@smiley_lily02",
    photoUrl: photoNeha,
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

// Scroll-reveal wrapper: subtle fade + rise when a block first enters the viewport.
function Reveal({ children, className, delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.55, delay, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// Live open/closed status derived from gym hours (Mon–Sat, 5 AM – 10 PM IST).
function isGymOpenNow(now: Date = new Date()): boolean {
  try {
    const fmt = new Intl.DateTimeFormat("en-US", {
      timeZone: "Asia/Kolkata",
      weekday: "short",
      hour: "numeric",
      hourCycle: "h23",
    });
    const parts = Object.fromEntries(fmt.formatToParts(now).map((p) => [p.type, p.value]));
    const day = parts.weekday ?? "";
    const hour = Number(parts.hour ?? "0");
    return day !== "Sun" && hour >= 5 && hour < 22;
  } catch {
    return true;
  }
}

// Anchor sections tracked for nav highlighting.
const SECTION_IDS = ["about", "facilities", "trainers", "gallery", "pricing", "calculator", "review", "contact"];

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

  // UI polish state: scrolled navbar, active nav section, back-to-top visibility
  const [scrolled, setScrolled] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [activeSection, setActiveSection] = useState("");
  const [moreOpen, setMoreOpen] = useState(false);
  const moreRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 24);
      setShowBackToTop(window.scrollY > 700);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Dismiss the MORE dropdown on outside click / Escape
  useEffect(() => {
    if (!moreOpen) return;
    const onDown = (e: MouseEvent) => {
      if (moreRef.current && !moreRef.current.contains(e.target as Node)) setMoreOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMoreOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    window.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      window.removeEventListener("keydown", onKey);
    };
  }, [moreOpen]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveSection(entry.target.id);
        });
      },
      { rootMargin: "-35% 0px -60% 0px" }
    );
    SECTION_IDS.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  // Lock background scroll + close on Escape while an overlay is open
  useEffect(() => {
    if (!isMobileMenuOpen && !franchiseOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsMobileMenuOpen(false);
        setFranchiseOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [isMobileMenuOpen, franchiseOpen]);

  // Static-site actions: every enquiry / join-now CTA opens a WhatsApp chat with a
  // pre-filled message so leads reach the gym front desk directly.
  const openWhatsApp = (message: string) => {
    const url = `https://wa.me/${GYM_CONFIG.whatsapp}?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const JOIN_MESSAGE = "Hi Vikings Gym & Spa! I want to JOIN. Please share the membership plans and timings.";

  const gymOpen = isGymOpenNow();

  // Nav link styling with active-section highlight (desktop + mobile variants)
  // Minimal lucid nav: 4 core links + a MORE dropdown for the rest.
  const MORE_LINKS = [
    { id: "about", label: "ABOUT" },
    { id: "facilities", label: "FACILITIES" },
    { id: "calculator", label: "BMI CALCULATOR" },
    { id: "review", label: "REVIEWS" },
  ];
  const moreActive = MORE_LINKS.some((l) => l.id === activeSection);

  const DeskLink = ({ id, label }: { id: string; label: string }) => (
    <a
      href={`#${id}`}
      className={`group relative py-2 text-[13px] font-mono font-bold tracking-[0.18em] transition-colors ${
        activeSection === id ? "text-red-500" : "text-gray-400 hover:text-white"
      }`}
    >
      {label}
      <span
        className={`absolute -bottom-0.5 left-0 h-px w-full origin-left bg-red-500 transition-transform duration-300 ${
          activeSection === id ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
        }`}
      />
    </a>
  );

  const mobileNavLinkClass = (id: string) =>
    `block py-3.5 border-b border-white/5 transition-colors tracking-[0.2em] ${
      activeSection === id ? "text-red-500" : "text-gray-300 hover:text-white"
    }`;

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
    <div id="top" className="bg-black text-gray-200 min-h-screen font-sans selection:bg-red-600 selection:text-white">
      {/* Dynamic Header */}
      <nav className={`sticky top-0 z-50 backdrop-blur-md border-b transition-all duration-300 ${scrolled ? "bg-black/95 border-red-950/60 shadow-lg shadow-black/60" : "bg-black/90 border-red-950/40"}`}>
        <div className={`max-w-7xl mx-auto px-6 flex justify-between items-center gap-6 transition-all duration-300 ${scrolled ? "h-14" : "h-[72px]"}`}>
          <a href="#top" className="flex items-center gap-3 shrink-0" aria-label="Vikings Gym & Spa — back to top">
            <img src={logoPremium} alt="Vikings Logo" className="h-9 w-auto" />
            <span className="font-mono text-lg font-black tracking-tighter text-white whitespace-nowrap">
              VIKINGS <span className="text-red-500">GYM & SPA</span>
            </span>
          </a>

          <div className="hidden lg:flex items-center gap-7">
            <DeskLink id="trainers" label="TRAINERS" />
            <DeskLink id="pricing" label="MEMBERSHIPS" />
            <DeskLink id="gallery" label="GALLERY" />
            <DeskLink id="contact" label="CONTACT" />
            <div
              ref={moreRef}
              className="relative"
              onMouseEnter={() => setMoreOpen(true)}
              onMouseLeave={() => setMoreOpen(false)}
            >
              <button
                onClick={() => setMoreOpen((v) => !v)}
                aria-haspopup="true"
                aria-expanded={moreOpen}
                className={`flex items-center gap-1.5 py-2 text-[13px] font-mono font-bold tracking-[0.18em] transition-colors cursor-pointer ${moreActive || moreOpen ? "text-red-500" : "text-gray-400 hover:text-white"}`}
              >
                MORE
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-300 ${moreOpen ? "rotate-180" : ""}`} />
              </button>
              <AnimatePresence>
                {moreOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    transition={{ duration: 0.18 }}
                    className="absolute right-0 top-full pt-3"
                  >
                    <div className="w-60 rounded-xl border border-neutral-800/80 bg-neutral-950/95 backdrop-blur-xl p-2 shadow-2xl shadow-black/60">
                      {MORE_LINKS.map((l) => (
                        <a
                          key={l.id}
                          href={`#${l.id}`}
                          onClick={() => setMoreOpen(false)}
                          className={`flex items-center justify-between rounded-lg px-4 py-2.5 text-[12px] font-mono font-bold tracking-[0.18em] transition-colors ${activeSection === l.id ? "bg-red-600/10 text-red-500" : "text-gray-400 hover:bg-white/5 hover:text-white"}`}
                        >
                          {l.label}
                          <span className={`h-1 w-1 rounded-full ${activeSection === l.id ? "bg-red-500" : "bg-transparent"}`} />
                        </a>
                      ))}
                      <div className="my-1.5 h-px bg-white/5" />
                      <button
                        onClick={() => {
                          setMoreOpen(false);
                          setFranchiseOpen(true);
                        }}
                        className="w-full flex items-center justify-between rounded-lg px-4 py-2.5 text-[12px] font-mono font-bold tracking-[0.18em] text-gray-400 hover:bg-white/5 hover:text-white transition-colors cursor-pointer"
                      >
                        FRANCHISE
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          <div className="flex items-center gap-3 sm:gap-4 shrink-0">
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
              className="inline-flex items-center h-10 px-5 sm:px-6 bg-red-600 hover:bg-red-500 text-black font-mono font-black text-xs tracking-[0.2em] rounded-md hover:shadow-lg hover:shadow-red-600/40 active:scale-95 transition-all cursor-pointer whitespace-nowrap"
            >
              JOIN NOW
            </button>

            <button
              className="lg:hidden text-white p-2 cursor-pointer hover:text-red-500 transition-colors"
              onClick={() => setIsMobileMenuOpen(true)}
              aria-label="Open menu"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
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
              aria-label="Close menu"
            >
              <X className="w-8 h-8" />
            </button>

            <div className="flex flex-col items-stretch text-center w-full max-w-xs px-8 text-sm font-bold font-mono">
              <a href="#trainers" onClick={() => setIsMobileMenuOpen(false)} className={mobileNavLinkClass("trainers")}>TRAINERS</a>
              <a href="#pricing" onClick={() => setIsMobileMenuOpen(false)} className={mobileNavLinkClass("pricing")}>MEMBERSHIPS</a>
              <a href="#gallery" onClick={() => setIsMobileMenuOpen(false)} className={mobileNavLinkClass("gallery")}>GALLERY</a>
              <a href="#contact" onClick={() => setIsMobileMenuOpen(false)} className={mobileNavLinkClass("contact")}>CONTACT</a>
              <a href="#about" onClick={() => setIsMobileMenuOpen(false)} className={mobileNavLinkClass("about")}>ABOUT</a>
              <a href="#facilities" onClick={() => setIsMobileMenuOpen(false)} className={mobileNavLinkClass("facilities")}>FACILITIES</a>
              <a href="#calculator" onClick={() => setIsMobileMenuOpen(false)} className={mobileNavLinkClass("calculator")}>BMI CALCULATOR</a>
              <a href="#review" onClick={() => setIsMobileMenuOpen(false)} className={mobileNavLinkClass("review")}>REVIEWS</a>
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  setFranchiseOpen(true);
                }}
                className="block py-3.5 border-b border-white/5 transition-colors tracking-[0.2em] text-gray-300 hover:text-white cursor-pointer"
              >
                FRANCHISE
              </button>

              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  openWhatsApp(JOIN_MESSAGE);
                }}
                className="mt-8 w-full py-3.5 bg-red-600 hover:bg-red-500 text-black font-mono font-black text-sm tracking-[0.2em] rounded-md transition-all cursor-pointer"
              >
                JOIN NOW
              </button>

              {/* PORTAL LOGIN — hidden in static-site mode; preserved for future portal reconnect */}
              {PORTAL_ACCESS_ENABLED && (
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    onLoginClick();
                  }}
                  className="mt-4 text-sm font-mono font-bold text-white border border-red-900 bg-red-950/20 px-8 py-3 rounded-md transition-all cursor-pointer"
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
<section id="facilities" className="py-24 px-6 max-w-7xl mx-auto border-b border-red-950/20 scroll-mt-24">
        <Reveal className="text-center mb-16">
          <p className="text-red-500 font-mono text-xs tracking-widest uppercase mb-2">ROYAL EXPERIENCE</p>
          <h2 className="text-3xl md:text-4xl font-sans font-black text-white uppercase tracking-tight">
            WORLD-CLASS WELLNESS FACILITIES
          </h2>
          <div className="w-16 h-1 bg-red-650 mx-auto mt-4 rounded"></div>
        </Reveal>

        <Reveal delay={0.1}>
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
        </Reveal>
      </section>

      {/* BMI Calculator Section */}
      <section id="calculator" className="py-24 bg-neutral-950/70 border-b border-red-950/20 px-6 scroll-mt-24">
        <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <Reveal>
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
          </Reveal>

          <Reveal delay={0.1}>
          <div className="bg-neutral-900/50 border border-red-950/20 p-8 rounded-xl backdrop-blur-md relative overflow-hidden">
            <h3 className="text-lg font-mono font-bold tracking-wider text-white mb-6 uppercase flex items-center gap-2">
              <Compass className="text-red-500 w-5 h-5" /> BMI AUDIT ENGINE
            </h3>

            <form onSubmit={calculateBMI} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="bmi-weight" className="block text-xs font-mono text-gray-400 mb-2 uppercase">Weight (KG)</label>
                  <input
                    id="bmi-weight"
                    type="number"
                    min={1}
                    max={500}
                    inputMode="decimal"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-850 px-4 py-3 rounded text-white text-sm focus:border-red-650 focus:outline-none"
                    placeholder="e.g. 74"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="bmi-height" className="block text-xs font-mono text-gray-400 mb-2 uppercase">Height (CM)</label>
                  <input
                    id="bmi-height"
                    type="number"
                    min={50}
                    max={250}
                    inputMode="decimal"
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
          </Reveal>
        </div>
      </section>

      {/* Pricing / Memberships */}
      <section id="pricing" className="py-24 px-6 max-w-7xl mx-auto border-b border-red-950/20 scroll-mt-24">
        <Reveal className="text-center mb-16">
          <p className="text-red-500 font-mono text-xs tracking-widest uppercase mb-2">SHIELD WALL PLANS</p>
          <h2 className="text-3xl md:text-4xl font-sans font-black text-white uppercase tracking-tight">
            MEMBERSHIP TIERS & PRICING
          </h2>
          <div className="w-16 h-1 bg-red-650 mx-auto mt-4 rounded animate-pulse"></div>
        </Reveal>

        <Reveal delay={0.1}>
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
        </Reveal>

        {/* Group Classes & Personal Training */}
        <Reveal delay={0.05}>
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
        </Reveal>
      </section>
      <section id="trainers" className="py-24 bg-neutral-950/40 px-6 border-b border-red-950/20 scroll-mt-24">
        <div className="max-w-7xl mx-auto">
          <Reveal className="text-center mb-16">
            <p className="text-red-500 font-mono text-xs tracking-widest uppercase mb-2">ELITE VALKYRIES & BERSERKERS</p>
            <h2 className="text-3xl md:text-4xl font-sans font-black text-white uppercase tracking-tight">
              MEET YOUR master COACHES
            </h2>
            <div className="w-16 h-1 bg-red-650 mx-auto mt-4 rounded"></div>
          </Reveal>

          <Reveal delay={0.1}>
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
          </Reveal>
        </div>
      </section>

      {/* Gallery & Official Instagram Section */}
      <section id="gallery" className="py-24 bg-neutral-950/40 px-6 border-b border-red-950/20 scroll-mt-24">
        <div className="max-w-7xl mx-auto">
          <Reveal className="text-center mb-14">
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
          </Reveal>

          {/* Daily Stories strip */}
          <Reveal delay={0.1}>
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
          </Reveal>

          {/* Gallery grid */}
          <Reveal delay={0.05}>
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
          </Reveal>

          {/* Follow CTA */}
          <Reveal delay={0.05}>
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
          </Reveal>
        </div>
      </section>

      {/* Review us on Google Maps */}
      <section id="review" className="py-24 bg-neutral-950/40 px-6 border-b border-red-950/20 scroll-mt-24">
        <Reveal>
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <span className="text-red-500 font-mono text-xs tracking-widest uppercase block mb-2">SHARE THE EXPERIENCE</span>
            <h2 className="text-3xl md:text-4xl font-sans font-black text-white uppercase tracking-tight mb-4">
              REVIEW US ON GOOGLE MAPS
            </h2>
            <div className="w-16 h-1 bg-red-650 rounded mb-6"></div>
            <p className="text-gray-400 text-sm leading-relaxed max-w-xl mb-6">
              Loved your session at Vikings Gym & Spa? A quick review keeps our warriors fired up and
              helps more legends find their way to the kingdom. It takes less than 30 seconds.
            </p>
            <div className="flex items-center gap-1.5 mb-8">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-5 h-5 text-amber-400 fill-amber-400" />
              ))}
              <span className="text-gray-500 text-xs font-mono ml-2">RATED {GYM_CONFIG.rating} / 5 BY MEMBERS</span>
            </div>
            <div className="flex flex-wrap gap-4">
              <a
                href={GYM_CONFIG.mapLink}
                target="_blank"
                rel="noreferrer"
                className="bg-red-600 hover:bg-red-700 text-black font-mono font-black text-xs px-6 py-3 rounded transition-all cursor-pointer flex items-center gap-2"
              >
                <Star className="w-4 h-4" /> LEAVE A REVIEW
              </a>
              <a
                href={GYM_CONFIG.mapLink}
                target="_blank"
                rel="noreferrer"
                className="bg-neutral-950 hover:bg-neutral-900 text-gray-300 border border-neutral-800 hover:border-gray-600 font-mono font-black text-xs px-6 py-3 rounded transition-all cursor-pointer flex items-center gap-2"
              >
                <MapPin className="w-4 h-4" /> OPEN IN GOOGLE MAPS
              </a>
            </div>
          </div>

          <div className="flex justify-center">
            <div className="bg-neutral-900/60 border border-neutral-900 rounded-2xl p-8 flex flex-col items-center max-w-sm w-full">
              <span className="text-red-500 font-mono text-[10px] tracking-widest uppercase mb-4">SCAN · RATE · FORGE</span>
              <a href={GYM_CONFIG.mapLink} target="_blank" rel="noreferrer" className="block bg-white rounded-xl p-3">
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=260x260&margin=8&data=${encodeURIComponent(GYM_CONFIG.mapLink)}`}
                  alt="QR code — review Vikings Gym & Spa on Google Maps"
                  className="w-56 h-56 object-contain"
                  loading="lazy"
                />
              </a>
              <span className="text-gray-500 text-xs font-mono mt-4 text-center">
                Point your camera at the QR code
                <br />to open & review us on Google Maps
              </span>
            </div>
          </div>
        </div>
        </Reveal>
      </section>

      {/* Contact & Map Section */}
      <section id="contact" className="py-24 px-6 max-w-7xl mx-auto scroll-mt-24">
        <Reveal>
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
                  <label htmlFor="contact-name" className="block text-xs font-mono text-gray-400 mb-1.5 uppercase">Full Name</label>
                  <input
                    id="contact-name"
                    type="text"
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                    className="w-full bg-black/50 border border-neutral-850 px-4 py-2.5 rounded text-white text-xs focus:border-red-650 focus:outline-none"
                    placeholder="e.g. Ritwik Singh"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="contact-phone" className="block text-xs font-mono text-gray-400 mb-1.5 uppercase">Phone Number</label>
                  <input
                    id="contact-phone"
                    type="tel"
                    inputMode="tel"
                    value={contactPhone}
                    onChange={(e) => setContactPhone(e.target.value)}
                    className="w-full bg-black/50 border border-neutral-850 px-4 py-2.5 rounded text-white text-xs focus:border-red-650 focus:outline-none"
                    placeholder="e.g. +91 XXXXX XXXXX"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="contact-message" className="block text-xs font-mono text-gray-400 mb-1.5 uppercase">Message (What are your fitness limits?)</label>
                  <textarea
                    id="contact-message"
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
        </Reveal>
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
                  <label htmlFor="franchise-name" className="block text-[10px] font-mono text-gray-400 mb-1 uppercase">Full Name</label>
                  <input
                    id="franchise-name"
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
                    <label htmlFor="franchise-city" className="block text-[10px] font-mono text-gray-400 mb-1 uppercase">Proposed City/Location</label>
                    <input
                      id="franchise-city"
                      type="text"
                      value={franchiseData.city}
                      onChange={(e) => setFranchiseData({ ...franchiseData, city: e.target.value })}
                      required
                      className="w-full bg-neutral-900 border border-neutral-800 px-3 py-2 rounded text-white text-xs focus:ring-1 focus:ring-red-600 focus:outline-none"
                      placeholder="e.g. Nanded, Jalna"
                    />
                  </div>
                  <div>
                    <label htmlFor="franchise-capital" className="block text-[10px] font-mono text-gray-400 mb-1 uppercase">Available Investment Capital</label>
                    <select
                      id="franchise-capital"
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
                  <label htmlFor="franchise-phone" className="block text-[10px] font-mono text-gray-400 mb-1 uppercase">Direct Phone Number</label>
                  <input
                    id="franchise-phone"
                    type="tel"
                    inputMode="tel"
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
      <section id="about" className="py-24 px-6 max-w-7xl mx-auto border-b border-red-950/20 scroll-mt-24">
        <Reveal>
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
                <span className={`inline-block w-2 h-2 rounded-full animate-pulse ${gymOpen ? "bg-emerald-500" : "bg-red-500"}`}></span>
                <span className={`text-xs font-mono ${gymOpen ? "text-emerald-400" : "text-red-400"}`}>
                  {gymOpen ? `OPEN NOW · ${GYM_CONFIG.hours}` : `CURRENTLY CLOSED · ${GYM_CONFIG.hours}`}
                </span>
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
        </Reveal>
      </section>

      {/* Footer */}
      <footer className="bg-neutral-950/80 border-t border-neutral-900 px-6 pt-14 pb-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-10">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <img src={logoPremium} alt="Vikings Logo" className="h-8 w-auto" />
              <span className="font-mono text-sm font-black text-white tracking-widest">
                VIKINGS <span className="text-red-500">GYM & SPA</span>
              </span>
            </div>
            <p className="text-xs text-gray-500 leading-relaxed max-w-xs mb-5">
              Aurangabad's premium commercial gym & Moroccan steam spa — imported machines, Olympic powerlifting, Zumba, dance & yoga.
            </p>
            <div className="flex gap-3">
              <a href={GYM_CONFIG.instagram} target="_blank" rel="noreferrer" aria-label="Vikings on Instagram" className="p-2 bg-neutral-900 hover:bg-neutral-850 rounded text-gray-400 hover:text-white transition-all">
                <Instagram className="w-4 h-4" />
              </a>
              <a href={GYM_CONFIG.mapLink} target="_blank" rel="noreferrer" aria-label="Vikings on Google Maps" className="p-2 bg-neutral-900 hover:bg-neutral-850 rounded text-gray-400 hover:text-white transition-all">
                <MapPin className="w-4 h-4" />
              </a>
              <a href={`tel:${GYM_CONFIG.phone}`} aria-label="Call Vikings Gym" className="p-2 bg-neutral-900 hover:bg-neutral-850 rounded text-gray-400 hover:text-white transition-all">
                <Phone className="w-4 h-4" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-mono text-xs font-black text-white tracking-widest uppercase mb-4">Explore</h4>
            <ul className="grid grid-cols-2 gap-x-4 gap-y-2.5 text-xs font-mono text-gray-500">
              <li><a href="#about" className="hover:text-red-500 transition-colors">ABOUT</a></li>
              <li><a href="#facilities" className="hover:text-red-500 transition-colors">FACILITIES</a></li>
              <li><a href="#trainers" className="hover:text-red-500 transition-colors">TRAINERS</a></li>
              <li><a href="#gallery" className="hover:text-red-500 transition-colors">GALLERY</a></li>
              <li><a href="#pricing" className="hover:text-red-500 transition-colors">MEMBERSHIPS</a></li>
              <li><a href="#calculator" className="hover:text-red-500 transition-colors">BMI CALCULATOR</a></li>
              <li><a href="#review" className="hover:text-red-500 transition-colors">REVIEWS</a></li>
              <li><a href="#contact" className="hover:text-red-500 transition-colors">CONTACT</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-mono text-xs font-black text-white tracking-widest uppercase mb-4">Reach the Kingdom</h4>
            <ul className="space-y-2.5 text-xs text-gray-500">
              <li>{GYM_CONFIG.address}</li>
              <li>
                <a href={`tel:${GYM_CONFIG.phone}`} className="hover:text-red-500 transition-colors">{GYM_CONFIG.phoneDisplay}</a>
                {" · "}
                <a href={`https://wa.me/${GYM_CONFIG.whatsapp}`} target="_blank" rel="noreferrer" className="hover:text-red-500 transition-colors">WhatsApp</a>
              </li>
              <li className="font-mono">{GYM_CONFIG.hours}</li>
              <li>
                <a href={GYM_CONFIG.instagram} target="_blank" rel="noreferrer" className="hover:text-red-500 transition-colors">@{GYM_CONFIG.instagramHandle}</a>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-6 border-t border-neutral-900">
          <p className="text-xs text-gray-600 font-mono text-center">
            © {new Date().getFullYear()} Vikings Gym & Spa — MG Road, Aurangabad, Bihar. All rights reserved.
          </p>
        </div>
      </footer>

      {/* Back to top */}
      <AnimatePresence>
        {showBackToTop && (
          <motion.button
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 16 }}
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            aria-label="Back to top"
            className="fixed bottom-6 right-6 z-50 bg-red-600 hover:bg-red-700 text-black p-3 rounded-full shadow-lg shadow-red-900/40 transition-colors cursor-pointer"
          >
            <ArrowUp className="w-5 h-5" />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
