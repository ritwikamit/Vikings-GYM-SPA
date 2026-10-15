import React, { useState, useEffect } from "react";
import {
  Dumbbell,
  Sparkles,
  MapPin,
  Phone,
  MessageCircle,
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
  Facebook,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
  Play,
  Flame,
  Heart,
  Camera,
  Volume2,
  VolumeX,
  Sun,
  Moon,
  HelpCircle,
  ShieldCheck,
  Cookie,
  FileText,
  Building2,
  Crown,
  MoreHorizontal,
} from "lucide-react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import PublicNavbar from "./PublicNavbar";
import { usePageSEO } from "../lib/seo";
import logoPremium from "../../assets/l.webp";
import devLogo from "../../assets/ac-custom-labs.webp";
import heroVideo from "../../assets/animationVideos/video1.webm";
import videoBuiltDiff from "../../assets/animationVideos/video2.webm";
import videoStrengthAction from "../../assets/animationVideos/video3.webm";
import videoDumbbellPan from "../../assets/animationVideos/video4.webm";
import photoAnkitKumar from "../../assets/trainers/ankit-kumar.webp";
import photoBittuVerma from "../../assets/trainers/bittu-verma.webp";
import photoAli from "../../assets/trainers/ali.webp";
import photoAmitSingh from "../../assets/trainers/amit-singh.webp";
import photoDeepsikha from "../../assets/trainers/deepsikha.webp";
import photoVaishnavi from "../../assets/trainers/vaishnavi-singh.webp";
import photoNeha from "../../assets/trainers/neha-singh.webp";
import { AnimatedMarqueeHero, DotGrid } from "./ui/hero-3";
import { GYM_CONFIG } from "../config/gym";
import {
  HERO_BACKGROUND_IMAGE,
  HERO_CAROUSEL_IMAGES,
  HOMEPAGE_GALLERY_PREVIEW,
  ALL_GYM_GALLERY_IMAGES,
  REAL_GALLERY_IMAGES,
  REAL_STORY_TILES,
  mainArenaPanoramic,
  freeWeightsBenches,
  deadliftPlatform,
  strengthPanoramic,
  cardioRowingWide,
  yogaStudioClean,
} from "../assets/gymImages";

const GALLERY_ROW_1 = ALL_GYM_GALLERY_IMAGES.slice(0, 18);
const GALLERY_ROW_2 = ALL_GYM_GALLERY_IMAGES.slice(18);

const DEFAULT_HERO_IMAGES = [
  "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1470&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1540497077202-7c8a3999166f?q=80&w=1470&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=1470&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?q=80&w=1470&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?q=80&w=1470&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1574680096145-d05b474e2155?q=80&w=1470&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1599058917212-d750089bc07e?q=80&w=1469&auto=format&fit=crop",
];

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

const BRAND_AMBASSADOR = {
  name: "Vaishnavi Singh",
  role: "OFFICIAL BRAND AMBASSADOR",
  handle: "@chawal.to.choorma",
  instagram: "https://www.instagram.com/chawal.to.choorma/",
  photoUrl: photoVaishnavi,
  tagline: "The Face of the Vikings Lifestyle & Modern Wellness",
  quote: "Fitness is not about punishment; it is about self-respect, daily consistency, and showing up every single day to lift yourself and everyone around you.",
  bio: "Official Brand Ambassador for Vikings Gym & Spa — inspiring youth and women across Bihar to embrace weight training, athletic confidence, and balanced Indian nutrition.",
};

const DEFAULT_TRAINERS = [
  {
    name: "Amit Singh",
    role: "OWNER & HEAD COACH",
    isOwner: true,
    years: "Founder & Master Coach · Vikings Gym & Spa",
    desc: "Gym Owner and passionate Head Coach at Vikings Gym & Spa. Committed to Olympic strength standards, hands-on member mentorship, and building Aurangabad's ultimate fitness kingdom.",
    cert: ["Gym Owner", "Head Coach", "Biomechanics & Form"],
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
    name: "Neha Singh",
    role: "FEMALE FITNESS TRAINER",
    years: "Empowering every warrior",
    desc: "Female fitness trainer at Vikings Gym & Spa who coaches strength, conditioning and confidence — supporting members of all levels on their fitness journey.",
    cert: ["Strength", "Conditioning"],
    instagram: "https://www.instagram.com/smiley_lily02/",
    instagramHandle: "@smiley_lily02",
    photoUrl: photoNeha,
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

// Scroll-reveal wrapper: subtle fade + rise with organic cubic-bezier ease
function Reveal({ children, className, delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-30px" }}
      transition={{ duration: 0.5, delay, ease: [0.16, 1, 0.3, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}


// Unified lucid section header: kicker + title + red rule + optional description (compact on mobile/tab)
function SectionHeader({ kicker, title, desc }: { kicker: string; title: React.ReactNode; desc?: React.ReactNode }) {
  return (
    <Reveal className="text-center mb-6 sm:mb-10 md:mb-14 max-w-2xl mx-auto px-2">
      <p className="text-red-500 font-sans font-extrabold text-[10px] sm:text-xs tracking-[0.2em] uppercase mb-1.5 sm:mb-2">{kicker}</p>
      <h2 className="text-2xl sm:text-3xl md:text-4xl font-sans font-black text-white uppercase tracking-tight">
        {title}
      </h2>
      <div className="w-12 sm:w-16 h-1 bg-red-650 mx-auto mt-3 sm:mt-4 rounded"></div>
      {desc && <p className="text-gray-400 font-sans text-xs sm:text-sm mt-2.5 sm:mt-4 leading-relaxed">{desc}</p>}
    </Reveal>
  );
}

// Redesigned Arena in Motion video card (Modern Sans-Serif Typography, No Typewriter Font, No Cylinders)
function ActionReelCard({
  videoSrc,
  title,
  subtitle,
  description,
}: {
  videoSrc: string;
  title: string;
  subtitle: string;
  description: string;
  badge?: string;
}) {
  return (
    <div className="group relative rounded-2xl p-[1.5px] bg-gradient-to-b from-neutral-800 via-neutral-900 to-red-950/60 hover:from-red-600 hover:to-neutral-900 transition-all duration-500 shadow-xl shadow-black/80 hover:shadow-2xl hover:shadow-red-950/30">
      <div className="bg-[#09090b] rounded-[15px] overflow-hidden flex flex-col h-full relative aspect-[9/16] w-full">
        <video
          src={videoSrc}
          autoPlay
          loop
          muted
          playsInline
          preload="metadata"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
        />

        {/* Ambient Dark Gradient Overlays for high contrast text legibility */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/25 to-black/50 pointer-events-none" />

        {/* Bottom Info Card (Modern Sans-Serif Typography, No typewriter font) */}
        <div className="absolute bottom-0 inset-x-0 p-5 sm:p-6 z-10 bg-gradient-to-t from-black via-black/90 to-transparent">
          <div className="flex items-center gap-2 mb-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
            <span className="text-[11px] font-sans text-red-400 uppercase tracking-widest font-extrabold block">
              {subtitle}
            </span>
          </div>
          <h3 className="text-lg sm:text-xl font-sans font-black text-white uppercase tracking-tight leading-snug mb-2 group-hover:text-red-400 transition-colors">
            {title}
          </h3>
          <p className="text-gray-300 text-xs sm:text-sm font-sans leading-relaxed">
            {description}
          </p>
        </div>
      </div>
    </div>
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

// Specially Designed Video 2 Showcase Component with moving red light border
function ManifestoVideoShowcase({ videoSrc, onJoinClick }: { videoSrc: string; onJoinClick: () => void }) {
  const [isMuted, setIsMuted] = useState(true);
  const videoRef = React.useRef<HTMLVideoElement>(null);

  const toggleSound = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!videoRef.current) return;
    const nextMuted = !isMuted;
    videoRef.current.muted = nextMuted;
    setIsMuted(nextMuted);
    if (!nextMuted) {
      videoRef.current.play().catch(() => {});
    }
  };

  return (
    <section id="manifesto" className="relative py-8 sm:py-12 md:py-20 px-4 sm:px-6 max-w-7xl mx-auto border-b border-red-950/20 scroll-mt-24">
      <DotGrid />
      <div className="relative z-10">
        <SectionHeader
          kicker="SPECIALLY DESIGNED // BUILT DIFFERENT"
          title="THE VIKINGS MANIFESTO"
          desc="Step into an arena crafted without compromise. Where industrial dark aesthetics meet high-precision biomechanics and recovery."
        />

        <Reveal delay={0.1}>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-12 items-center max-w-6xl mx-auto">
            {/* Specially Designed Video 2 with continuous moving red light border */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="moving-border-red rounded-2xl w-full max-w-[280px] xs:max-w-[320px] sm:max-w-[380px] shadow-2xl shadow-red-950/40">
                <div className="moving-border-red-inner p-2 rounded-2xl bg-[#09090b]">
                  <div className="relative aspect-[9/16] rounded-xl overflow-hidden bg-black group">
                    <video
                      ref={videoRef}
                      src={videoSrc}
                      autoPlay
                      loop
                      muted={isMuted}
                      playsInline
                      preload="auto"
                      className="w-full h-full object-cover scale-100 group-hover:scale-105 transition-transform duration-700 ease-out"
                    />

                    {/* Gradient overlay for bottom badge legibility */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />

                    {/* Sound toggle overlay button */}
                    <button
                      onClick={toggleSound}
                      aria-label={isMuted ? "Unmute manifesto video" : "Mute manifesto video"}
                      className="absolute bottom-4 right-4 z-20 w-11 h-11 rounded-full bg-black/80 hover:bg-red-600 border border-white/20 hover:border-red-500 text-white flex items-center justify-center backdrop-blur-md shadow-xl transition-all cursor-pointer active:scale-95"
                    >
                      {isMuted ? <VolumeX className="w-5 h-5 text-gray-200" /> : <Volume2 className="w-5 h-5 text-white animate-pulse" />}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Manifesto details & pillars */}
            <div className="lg:col-span-7 flex flex-col justify-center space-y-4 sm:space-y-6">
              <div className="flex items-center gap-2 text-red-500 font-sans text-xs font-extrabold uppercase tracking-widest w-fit">
                आधुनिक फिटनेस एरीना • PURPOSE-BUILT FACILITY
              </div>

              <h3 className="text-2xl sm:text-3xl md:text-4xl font-sans font-black text-white uppercase tracking-tight leading-tight">
                BUILT FOR STRENGTH. <br />
                <span className="text-red-500">ENGINEERED FOR RECOVERY.</span>
              </h3>

              <p className="text-red-400 font-sans text-xs font-bold uppercase tracking-wider">
                शरीर को मजबूत और फौलाद बनाने का आधुनिक एरीना
              </p>

              <p className="text-gray-300 text-xs sm:text-base leading-relaxed">
                एमजी रोड, औरंगाबाद में स्थित वाइकिंग्स जिम एंड स्पा में बायोमेकैनिकली सटीक वीवा फिटनेस (Viva Fitness) प्लेट-लोडेड मशीनें, कम्पटीशन ओलंपिक प्लेटफॉर्म और मोरक्कन स्टीम स्पा की विशेष सुविधा उपलब्ध है।
              </p>

              <div className="grid grid-cols-1 xs:grid-cols-2 gap-2.5 sm:gap-3.5 pt-1 sm:pt-2">
                <div className="p-4 rounded-xl bg-neutral-900/40 border border-neutral-850 hover:border-red-950 transition-colors">
                  <div className="text-red-500 font-sans font-black text-xs uppercase mb-1">01 / CALIBRATED ARSENAL</div>
                  <p className="text-gray-400 text-xs leading-relaxed">Viva Fitness biomechanically aligned stacks that optimize muscle activation throughout the full range of motion.</p>
                </div>
                <div className="p-4 rounded-xl bg-neutral-900/40 border border-neutral-850 hover:border-red-950 transition-colors">
                  <div className="text-red-500 font-sans font-black text-xs uppercase mb-1">02 / COMPETITION PLATFORMS</div>
                  <p className="text-gray-400 text-xs leading-relaxed">Regulation bumper plates and deadlift wood platforms designed for heavy compound strength sessions.</p>
                </div>
                <div className="p-4 rounded-xl bg-neutral-900/40 border border-neutral-850 hover:border-red-950 transition-colors">
                  <div className="text-red-500 font-sans font-black text-xs uppercase mb-1">03 / MOROCCAN STEAM SPA</div>
                  <p className="text-gray-400 text-xs leading-relaxed">Deep thermal detoxification and vascular relaxation to accelerate muscle recovery post-workout.</p>
                </div>
                <div className="p-4 rounded-xl bg-neutral-900/40 border border-neutral-850 hover:border-red-950 transition-colors">
                  <div className="text-red-500 font-sans font-black text-xs uppercase mb-1">04 / ZERO-EGO ATMOSPHERE</div>
                  <p className="text-gray-400 text-xs leading-relaxed">Every member is coached with respect, strict form guidance, and an energizing, dark-aesthetic culture.</p>
                </div>
              </div>

              <div className="pt-2 flex flex-wrap gap-4 items-center">
                <button
                  onClick={onJoinClick}
                  className="px-6 py-3 bg-red-600 hover:bg-red-700 text-black font-sans font-black text-xs tracking-wider rounded uppercase transition-all shadow-lg shadow-red-600/20 hover:scale-105 active:scale-95 cursor-pointer"
                >
                  CLAIM YOUR MEMBERSHIP
                </button>
                <a
                  href="#pricing"
                  className="px-6 py-3 bg-neutral-900 hover:bg-neutral-850 border border-neutral-800 text-gray-200 hover:text-white font-sans font-bold text-xs tracking-wider rounded uppercase transition-colors"
                >
                  VIEW MEMBERSHIP TIERS →
                </a>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

// 6 Essential FAQs for Visitors & Members
// High-Intent FAQs for AEO (Answer Engine Optimization) & SEO
const FAQS = [
  {
    q: "Which is the best gym in Aurangabad, Bihar?",
    a: "Vikings Gym & Spa on MG Road is widely regarded as the #1 and most premium gym in Aurangabad, Bihar. With over 7,500 sq.ft of air-conditioned floor, imported Viva Fitness biomechanical plate-loaded machines, Olympic powerlifting deadlift platforms, an authentic Moroccan steam spa, and certified coaches, it delivers an elite international-standard fitness environment.",
  },
  {
    q: "What are the gym membership fees at Vikings Gym Aurangabad?",
    a: "Membership plans at Vikings Gym & Spa Aurangabad start from ₹2,000 per month. Flexible options include 1-Month (₹2,000), 3-Month Shield-Wall (₹4,900), 6-Month Berserker (₹9,000), and 12-Month Valhalla Annual VIP (₹18,000). Plans include full floor access, Moroccan steam bath sessions, body composition audits, and 0% EMI financing.",
  },
  {
    q: "Where exactly is Vikings Gym located in Aurangabad?",
    a: "We are centrally located on MG Road, Near Overbridge, Above Central Bank, Old GT Road, Aurangabad, Bihar (PIN: 824101). Our facility is directly accessible from Ramesh Chowk, Dani Bigha, Karma Road, Jasoiya, Daudnagar, and Dehri, featuring dedicated two-wheeler and four-wheeler parking.",
  },
  {
    q: "What are the operating hours and timings of Vikings Gym & Spa?",
    a: "We are open Monday through Saturday from 5:00 AM to 10:00 PM IST continuously. Special early morning recovery and training sessions run on Sundays from 6:00 AM to 12:00 PM.",
  },
  {
    q: "Does Vikings Gym in Aurangabad have a steam bath and spa?",
    a: "Yes! Vikings Gym features an authentic Moroccan steam bath and luxury hydro-recovery spa. Rejuvenating thermal steam sessions are included with standard quarterly, half-yearly, and annual memberships to accelerate muscle recovery and detoxify the body.",
  },
  {
    q: "Is Vikings Gym in Aurangabad suitable for female members and beginners?",
    a: "100% yes. Vikings Gym is safe, supportive, and beginner-friendly. We feature certified female fitness coaches (including Coach Neha Singh), dedicated ladies workout batches with complete privacy, secure lockers, and personalized form correction for new recruits.",
  },
  {
    q: "Can I take a complimentary trial tour or workout before joining?",
    a: "Yes! Drop by our reception on MG Road anytime during operating hours or click 'Join Now' to WhatsApp us at +91 77649 22023 to reserve a complimentary facility walkthrough, machine test, and fitness assessment.",
  },
  {
    q: "What personal training programs and classes do you offer?",
    a: "We offer dedicated 1-on-1 personal coaching with certified trainers, Olympic powerlifting mentoring, fat loss & hyper-trophy programs, high-energy Zumba dance workouts, and flexibility Power Yoga sessions.",
  },
];

// Anchor sections tracked for nav highlighting in exact top-to-bottom page order.
const SECTION_IDS = [
  "manifesto",
  "facilities",
  "trainers",
  "calculator",
  "pricing",
  "gallery",
  "faq",
  "contact",
  "about",
];

const ENRICHED_STORY_TILES = [
  {
    img: REAL_STORY_TILES[0]?.img,
    label: "Arena Entry",
    hindiLabel: "स्वागत कक्ष व एरीना",
    timeAgo: "2h ago",
    caption: "Morning check-in at reception · MG Road, Aurangabad",
    hindiCaption: "सुबह का सत्र — एमजी रोड, औरंगाबाद रिसेप्शन डेस्क",
  },
  {
    img: REAL_STORY_TILES[1]?.img,
    label: "Olympic Deadlift",
    hindiLabel: "डेडलिफ्ट प्लेटफॉर्म",
    timeAgo: "4h ago",
    caption: "Heavy compound strength training on Viva Fitness competition platforms",
    hindiCaption: "वीवा फिटनेस कम्पटीशन प्लेटफॉर्म पर डेडलिफ्ट वर्कआउट",
  },
  {
    img: REAL_STORY_TILES[2]?.img,
    label: "Iron & Dumbbells",
    hindiLabel: "डम्बल और बेंच",
    timeAgo: "6h ago",
    caption: "High-density dumbbell racks and adjustable incline flat benches",
    hindiCaption: "प्रीमियम रबर-कोटेड डम्बल और एडजस्टेबल बेंच सेक्शन",
  },
  {
    img: REAL_STORY_TILES[3]?.img,
    label: "Sprint & Agility",
    hindiLabel: "स्प्रिंट ट्रैक",
    timeAgo: "8h ago",
    caption: "Conditioning turf sprint track for high-intensity intervals",
    hindiCaption: "हाई-इंटेंसिटी कंडीशनिंग और एथलेटिक टर्फ ट्रैक",
  },
  {
    img: REAL_STORY_TILES[4]?.img,
    label: "Steam Spa & Recovery",
    hindiLabel: "स्टीम स्पा एवं रिकवरी",
    timeAgo: "10h ago",
    caption: "Moroccan steam bath session for muscle relaxation and recovery",
    hindiCaption: "वर्कआउट के बाद मोरक्कन स्टीम बाथ और मसल्स रिकवरी",
  },
];
const STORY_TILES = ENRICHED_STORY_TILES;
const GALLERY_IMAGES = REAL_GALLERY_IMAGES;

// Static-site mode: the member portal login is intentionally hidden but fully
// preserved (JSX marked with `PORTAL_ACCESS_ENABLED` + App.tsx routes remain)
// so the portal can be re-enabled later without losing the integration.
const PORTAL_ACCESS_ENABLED = false;

// Animated Hero Title: cycles Valhalla / Strength power words in vibrant red gradient every 3 seconds with glowing focus
function RotatingHeroTitle() {
  const WORDS = [
    "VALHALLA",
    "GREATNESS",
    "GLORY",
    "WARRIORS",
    "STRENGTH",
    "DOMINANCE",
  ];
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % WORDS.length);
    }, 3000);
    return () => clearInterval(timer);
  }, [WORDS.length]);

  return (
    <span className="block text-center w-full select-none">
      <span className="block text-white tracking-tight drop-shadow-[0_4px_24px_rgba(0,0,0,0.95)]">
        CARVE YOUR BODY FOR
      </span>
      <span className="relative inline-flex items-center justify-center min-h-[1.12em] min-w-[200px] xs:min-w-[260px] sm:min-w-[420px] md:min-w-[560px] overflow-hidden align-middle mt-1 sm:mt-2">
        <AnimatePresence mode="wait">
          <motion.span
            key={WORDS[index]}
            initial={{ y: 44, opacity: 0, filter: "blur(8px)" }}
            animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
            exit={{ y: -44, opacity: 0, filter: "blur(8px)" }}
            transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
            className="inline-block text-transparent bg-clip-text bg-gradient-to-r from-red-600 via-red-500 to-rose-600 drop-shadow-[0_0_40px_rgba(239,68,68,0.85)] drop-shadow-[0_4px_16px_rgba(0,0,0,0.95)] font-black tracking-tight"
          >
            {WORDS[index]}
          </motion.span>
        </AnimatePresence>
      </span>
    </span>
  );
}

export default function PublicWebsite({ onJoinNow, onLoginClick }: PublicWebsiteProps) {
  usePageSEO({
    title: "Best Gym in Aurangabad, Bihar | Vikings Gym & Spa — Steam Bath, Viva Fitness & Personal Training",
    description: "Looking for the best gym in Aurangabad, Bihar or the best gym near you? Vikings Gym & Spa on MG Road is Aurangabad's #1 rated premium fitness arena featuring imported Viva Fitness machines, Olympic powerlifting platforms, luxury Moroccan steam bath, certified trainers, Zumba & Yoga. Membership starting at ₹2,000/mo. Visit today!",
    keywords: "best gym in aurangabad, best gym in aurangabad bihar, best gym near me, premium gym in aurangabad, gym in aurangabad bihar, aurangabad gym fees, top gym in aurangabad, vikings gym aurangabad, vikings gym & spa, gym mg road aurangabad, ladies gym aurangabad bihar, steam bath gym aurangabad, zumba classes aurangabad bihar, fitness center aurangabad bihar, personal trainer aurangabad, powerlifting gym aurangabad bihar, bodybuilding aurangabad, औरंगाबाद बिहार का सबसे अच्छा जिम, औरंगाबाद में बेस्ट जिम, वाइकिंग्स जिम औरंगाबाद",
    canonical: "https://www.vikingsgym.in/",
  });

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

  // Light mode theme toggle state with localStorage & DOM synchronization
  const [isLightMode, setIsLightMode] = useState<boolean>(() => {
    if (typeof window !== "undefined") {
      return (
        document.documentElement.classList.contains("theme-light") ||
        localStorage.getItem("vikings_theme") === "light"
      );
    }
    return false;
  });

  useEffect(() => {
    const handleThemeChange = (e: any) => {
      const nextTheme = e.detail?.theme === "light";
      setIsLightMode((prev) => (prev !== nextTheme ? nextTheme : prev));
    };
    window.addEventListener("vikings_theme_change", handleThemeChange);
    return () => window.removeEventListener("vikings_theme_change", handleThemeChange);
  }, []);

  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);
  const [showAllFaqs, setShowAllFaqs] = useState(false);
  const [activeStoryIndex, setActiveStoryIndex] = useState<number | null>(null);

  // Keyboard controls for Story Viewer Modal
  useEffect(() => {
    if (activeStoryIndex === null) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setActiveStoryIndex(null);
      } else if (e.key === "ArrowRight") {
        setActiveStoryIndex((prev) => (prev !== null ? (prev + 1) % STORY_TILES.length : 0));
      } else if (e.key === "ArrowLeft") {
        setActiveStoryIndex((prev) => (prev !== null ? (prev - 1 + STORY_TILES.length) % STORY_TILES.length : 0));
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [activeStoryIndex]);

  // Cookie consent banner for new visitors: zero flash for existing users, once only per new user
  const [showCookieBanner, setShowCookieBanner] = useState<boolean>(false);

  useEffect(() => {
    try {
      if (typeof window !== "undefined") {
        const consent = localStorage.getItem("vikings_cookie_consent");
        if (!consent) {
          setShowCookieBanner(true);
        }
      }
    } catch {}
  }, []);

  const acceptCookies = (type: "all" | "essential" | "dismissed") => {
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem("vikings_cookie_consent", type);
      } catch {}
    }
    setShowCookieBanner(false);
  };


  // Active nav section with throttled scroll-spy (zero layout thrashing for 120fps mobile scroll)
  const [activeSection, setActiveSection] = useState("");

  useEffect(() => {
    let rafId: number | null = null;
    let lastSection = "";
    let lastChecked = 0;

    const onScroll = () => {
      const now = performance.now();
      // Throttle calculations to at most once per 120ms to keep mobile scrolling butter-smooth
      if (now - lastChecked < 120) return;
      lastChecked = now;

      if (rafId !== null) return;
      rafId = window.requestAnimationFrame(() => {
        const sy = window.scrollY;
        let matched = "";
        if (sy >= 180) {
          const headerOffset = 160;
          for (let i = SECTION_IDS.length - 1; i >= 0; i--) {
            const id = SECTION_IDS[i];
            const el = document.getElementById(id);
            if (el && sy + headerOffset >= el.offsetTop) {
              matched = id;
              break;
            }
          }
        }
        if (matched !== lastSection) {
          lastSection = matched;
          setActiveSection(matched);
        }
        rafId = null;
      });
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (rafId !== null) window.cancelAnimationFrame(rafId);
    };
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
    <div id="top" className={`bg-black text-gray-200 min-h-screen font-sans selection:bg-red-600 selection:text-white pb-20 lg:pb-0 ${isLightMode ? "theme-light" : ""}`}>
      {/* Full Interactive Navigation Bar */}
      <PublicNavbar
        activeSection={activeSection}
        onLoginClick={PORTAL_ACCESS_ENABLED ? onLoginClick : undefined}
      />

      {/* Hero Section: Clean Video 1 (No Zoom) -> Landscaped Gym Photos -> Loop back to Video 1 */}
      <AnimatedMarqueeHero
        title={<RotatingHeroTitle />}
        ctaText="INVEST IN YOURSELF"
        onCtaClick={() => openWhatsApp(JOIN_MESSAGE)}
        secondaryCtaText="EXPLORE THE ARENA"
        onSecondaryCtaClick={() => document.getElementById("manifesto")?.scrollIntoView({ behavior: "smooth" })}
        video1Src={heroVideo}
        slideshowPhotos={[
          mainArenaPanoramic,
          strengthPanoramic,
          freeWeightsBenches,
          deadliftPlatform,
          cardioRowingWide,
        ]}
      />

      {/* Moving Ribbon of Texts moving just below hero section */}
      <div className="relative w-full overflow-hidden bg-neutral-950/95 border-y border-red-950/60 py-3.5 select-none z-20 shadow-xl shadow-black/80">
        <div className="ticker-ribbon-track flex items-center gap-8 text-[11px] sm:text-xs font-mono font-black tracking-[0.2em] uppercase text-neutral-300">
          {[
            "VIKINGS GYM & SPA • औरंगाबाद का सर्वश्रेष्ठ फिटनेस अखाड़ा",
            "VIVA FITNESS IMPORTED EQUIPMENT",
            "60KG DUMBBELLS & OLYMPIC PLATFORMS",
            "मोरक्कन स्टीम बाथ एवं हाइड्रोथेरेपी रिकवरी स्पा",
            "CERTIFIED STRENGTH COACHES & PERSONAL TRAINING",
            "BIOMETRIC TURNSTILE ACCESS • 24/7 CCTV SURVEILLANCE",
            "OLD GT ROAD • NEAR OVERBRIDGE CHOWK AURANGABAD",
            "CARVE YOUR BODY FOR VALHALLA • अनुशासन ही विजय है",
          ].map((text, idx) => (
            <span key={`ticker-a-${idx}`} className="inline-flex items-center gap-4 shrink-0">
              <span className="text-white hover:text-red-400 transition-colors drop-shadow-[0_1px_6px_rgba(0,0,0,0.8)]">
                {text}
              </span>
              <span className="w-2 h-2 rounded-full bg-red-600 shadow-[0_0_8px_rgba(239,68,68,0.9)] shrink-0" />
            </span>
          ))}
          {/* Duplicate loop for seamless infinite marquee scroll */}
          {[
            "VIKINGS GYM & SPA • औरंगाबाद का सर्वश्रेष्ठ फिटनेस अखाड़ा",
            "VIVA FITNESS IMPORTED EQUIPMENT",
            "60KG DUMBBELLS & OLYMPIC PLATFORMS",
            "मोरक्कन स्टीम बाथ एवं हाइड्रोथेरेपी रिकवरी स्पा",
            "CERTIFIED STRENGTH COACHES & PERSONAL TRAINING",
            "BIOMETRIC TURNSTILE ACCESS • 24/7 CCTV SURVEILLANCE",
            "OLD GT ROAD • NEAR OVERBRIDGE CHOWK AURANGABAD",
            "CARVE YOUR BODY FOR VALHALLA • अनुशासन ही विजय है",
          ].map((text, idx) => (
            <span key={`ticker-b-${idx}`} className="inline-flex items-center gap-4 shrink-0">
              <span className="text-white hover:text-red-400 transition-colors drop-shadow-[0_1px_6px_rgba(0,0,0,0.8)]">
                {text}
              </span>
              <span className="w-2 h-2 rounded-full bg-red-600 shadow-[0_0_8px_rgba(239,68,68,0.9)] shrink-0" />
            </span>
          ))}
        </div>
      </div>

      {/* Dedicated Space for Specially Designed Video 2: The Manifesto */}
      <ManifestoVideoShowcase
        videoSrc={videoBuiltDiff}
        onJoinClick={() => openWhatsApp(JOIN_MESSAGE)}
      />

      {/* Facilities Showcase */}
      <section id="facilities" className="relative py-8 sm:py-12 md:py-20 px-3.5 sm:px-6 max-w-7xl mx-auto border-b border-red-950/20 scroll-mt-24">
        <DotGrid />
        <div className="relative z-10">
        <SectionHeader
          kicker="विश्वस्तरीय सुविधाएं • WORLD-CLASS WELLNESS FACILITIES"
          title="PREMIUM FITNESS & SPA INFRASTRUCTURE"
          desc="एमजी रोड, औरंगाबाद में अत्याधुनिक वीवा फिटनेस (Viva Fitness) मशीनें, 60kg तक रबर डम्बल और मोरक्कन स्टीम बाथ"
        />

        <Reveal delay={0.1}>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4 md:gap-6">
          {[
            {
              title: "Olympic Powerlifting Center",
              badge: "ZONE 01",
              description: "Viva Fitness competition deadlift platform, calibrated bumper plates, Olympic bars, and power squat cages.",
              icon: Award,
              img: deadliftPlatform
            },
            {
              title: "Imported Strength Station",
              badge: "ZONE 02",
              description: "Plate-loaded chest rows, custom lat stations, cable crossovers, and complete Viva Fitness selectorized stacks.",
              icon: Dumbbell,
              img: strengthPanoramic
            },
            {
              title: "Cardio & Functional Floor",
              badge: "ZONE 03",
              description: "Commercial treadmills, Concept air rowers, Cult spin bikes, numbered sprint sled lanes, and boxing heavy bags.",
              icon: Flame,
              img: cardioRowingWide
            },
            {
              title: "Yoga, Aerobics & Dance Studio",
              badge: "ZONE 04",
              description: "Dedicated group fitness hall with full mirror walls, Om mandala art, climate control, kettlebells, and studio sound.",
              icon: Sparkles,
              img: yogaStudioClean
            }
          ].map((f, i) => {
            const Icon = f.icon;
            return (
              <div
                key={i}
                className="relative p-[1.5px] rounded-xl sm:rounded-2xl bg-gradient-to-br from-red-600 via-rose-600/70 to-red-950 hover:from-red-500 hover:via-rose-500 hover:to-red-700 shadow-[0_4px_25px_rgba(220,38,38,0.2)] hover:shadow-[0_8px_35px_rgba(239,68,68,0.4)] transition-all duration-300 flex flex-col h-full group active:scale-[0.99] touch-manipulation"
              >
                <div className="bg-[#0c0c0c] rounded-[11px] sm:rounded-[15px] overflow-hidden flex flex-col h-full">
                  <div className="relative aspect-[16/10] sm:aspect-auto sm:h-52 overflow-hidden bg-neutral-900 border-b border-red-600/25">
                    <img
                      src={f.img}
                      alt={`Vikings Gym Aurangabad ${f.title}`}
                      loading="lazy"
                      decoding="async"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />

                    {/* Zone tag badge with icon */}
                    <div className="absolute top-1.5 left-1.5 sm:top-3 sm:left-3 flex items-center gap-1 sm:gap-1.5 px-2 py-0.5 rounded-md bg-black/80 backdrop-blur-md border border-white/15 text-[8.5px] sm:text-[10px] font-mono font-bold text-gray-200 shadow-md">
                      <Icon className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-red-500" />
                      <span className="tracking-wider">{f.badge}</span>
                    </div>
                  </div>
                  <div className="p-2.5 sm:p-5 flex flex-col flex-1 justify-between">
                    <div>
                      <h3 className="text-xs sm:text-base lg:text-lg font-mono font-bold text-white mb-1 group-hover:text-red-400 transition-colors leading-snug line-clamp-1 sm:line-clamp-none">
                        {f.title}
                      </h3>
                      <p className="text-gray-300 text-[10px] sm:text-xs lg:text-sm leading-snug sm:leading-relaxed line-clamp-2 sm:line-clamp-none">
                        {f.description}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        <div className="mt-4 sm:mt-6 text-center">
          <Link
            to="/facilities"
            className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-red-500 hover:text-white uppercase transition-colors"
          >
            EXPLORE FULL FACILITY SPECS (ALL 8 ZONES) →
          </Link>
        </div>
        </Reveal>
        </div>
      </section>

      {/* Real Footage & Arena Action Reels */}
      <section id="arena-action" className="relative py-8 sm:py-12 md:py-20 px-4 sm:px-6 max-w-7xl mx-auto border-b border-red-950/20 scroll-mt-24 overflow-hidden">
        <DotGrid />
        {/* Ambient atmospheric red aura */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[320px] bg-red-950/25 blur-[120px] rounded-full pointer-events-none" />

        <div className="relative z-10">
          <SectionHeader
            kicker="REAL FLOOR FOOTAGE // UNCUT"
            title="THE ARENA IN MOTION"
            desc="Unfiltered glimpse inside Aurangabad's most intense iron cathedral. High-precision Viva Fitness equipment and competition dumbbells in daily action."
          />

          <Reveal delay={0.1}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 max-w-4xl mx-auto">
              <div className="relative aspect-[9/16] sm:aspect-[4/5] rounded-2xl overflow-hidden bg-black group border border-neutral-850 shadow-xl">
                <video
                  src={videoStrengthAction}
                  autoPlay
                  loop
                  muted
                  playsInline
                  preload="metadata"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent pointer-events-none" />
                <div className="absolute bottom-4 left-4 right-4">
                  <span className="text-[10px] font-sans font-extrabold text-red-500 tracking-wider uppercase block">
                    VIVA FITNESS BIOMECHANICS
                  </span>
                  <h3 className="text-sm sm:text-base font-sans font-black text-white uppercase tracking-tight">
                    POWER &amp; HIGH-PRECISION MOTION
                  </h3>
                </div>
              </div>

              <div className="relative aspect-[9/16] sm:aspect-[4/5] rounded-2xl overflow-hidden bg-black group border border-neutral-850 shadow-xl">
                <video
                  src={videoDumbbellPan}
                  autoPlay
                  loop
                  muted
                  playsInline
                  preload="metadata"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent pointer-events-none" />
                <div className="absolute bottom-4 left-4 right-4">
                  <span className="text-[10px] font-sans font-extrabold text-red-500 tracking-wider uppercase block">
                    COMPETITION IRON
                  </span>
                  <h3 className="text-sm sm:text-base font-sans font-black text-white uppercase tracking-tight">
                    THE DUMBBELL ARSENAL
                  </h3>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <section id="trainers" className="relative py-8 sm:py-12 md:py-20 bg-neutral-950/40 px-4 sm:px-6 border-b border-red-950/20 scroll-mt-24">
        <DotGrid />
        <div className="relative z-10 max-w-7xl mx-auto">
          <SectionHeader
            kicker="प्रमाणित कोच • CERTIFIED COACHES"
            title="TRAIN UNDER EXPERT GUIDANCE"
            desc="हेड कोच अमित सिंह और अनुभवी ट्रेनर्स के मार्गदर्शन में सुरक्षित, वैज्ञानिक और परिणाम-उन्मुख वर्कआउट"
          />

          <Reveal delay={0.1}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-8 md:gap-12 max-w-4xl mx-auto">
            {DEFAULT_TRAINERS.map((t: any, idx: number) => (
              <div
                key={idx}
                className={`bg-neutral-900/30 border rounded-xl overflow-hidden flex-col md:flex-row group transition-all duration-300 ${
                  t.isOwner
                    ? "border-red-600/50 shadow-xl shadow-red-950/20"
                    : "border-neutral-900 hover:border-red-950"
                } ${idx >= 2 ? "hidden lg:flex" : "flex"}`}
              >
                <div className="md:w-2/5 aspect-square md:aspect-auto md:h-auto bg-neutral-900 overflow-hidden">
                  {t.photoUrl ? (
                    <img src={t.photoUrl} alt={`${t.name} — coach at Vikings Gym Aurangabad`} loading="lazy" decoding="async" className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-300" />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-red-950 via-neutral-900 to-neutral-950 flex items-center justify-center relative">
                      <div className="absolute inset-0 opacity-20 bg-[linear-gradient(to_right,rgba(255,255,255,0.1)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[size:20px_20px]"></div>
                      <div className="w-24 h-24 rounded-full border-2 border-red-600/60 bg-neutral-950 flex items-center justify-center relative">
                        <span className="text-red-500 font-mono text-5xl font-black uppercase">{t.name ? t.name.charAt(0) : '?'}</span>
                      </div>
                    </div>
                  )}
                </div>
                <div className="md:w-3/5 p-4 sm:p-6 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <div className="text-xs font-mono font-bold text-red-500">{t.role}</div>
                      {t.isOwner && (
                        <span className="px-2 py-0.5 rounded bg-red-600 text-black text-[9px] font-sans font-black tracking-widest uppercase shadow-sm shadow-red-600/40">
                          OWNER
                        </span>
                      )}
                    </div>
                    <h3 className="text-base sm:text-lg font-bold text-white mb-1.5 sm:mb-2 flex items-center gap-2">
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
                    <div className="font-mono text-[10px] text-gray-400 mb-2 sm:mb-3">{t.years}</div>
                    <p className="text-gray-400 text-xs leading-relaxed mb-3 sm:mb-4">{t.desc}</p>
                  </div>

                  <div className="flex flex-wrap gap-1.5 pt-2.5 sm:pt-3 border-t border-neutral-850">
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
          <div className="mt-5 sm:mt-8 text-center lg:hidden">
            <Link
              to="/trainers"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border border-red-500/40 bg-red-600/10 hover:bg-red-600 hover:text-black text-red-400 font-mono text-xs font-bold transition-all uppercase"
            >
              MEET ALL 6 CERTIFIED COACHES &amp; PT PACKAGES →
            </Link>
          </div>
          </Reveal>
        </div>
      </section>

      {/* Dedicated Brand Ambassador Section */}
      <section id="ambassador" className="relative py-8 sm:py-12 md:py-20 bg-neutral-950/60 px-4 sm:px-6 border-b border-red-950/20 scroll-mt-24">
        <DotGrid />
        <div className="relative z-10 max-w-7xl mx-auto">
          <SectionHeader
            kicker="ब्रांड एंबेसडर • BRAND AMBASSADOR"
            title="VAISHNAVI SINGH"
            desc="बिहार में युवा शक्ति, संतुलित भारतीय पोषण (@chawal.to.choorma) और फिटनेस संस्कृति को प्रेरित करती वाइकिंग्स जिम की आधिकारिक ब्रांड एंबेसडर"
          />

          <Reveal delay={0.1}>
            <div className="max-w-4xl mx-auto bg-neutral-900/40 border border-neutral-800/80 rounded-2xl overflow-hidden shadow-2xl backdrop-blur-md grid grid-cols-1 md:grid-cols-12">
              {/* Photo Showcase */}
              <div className="md:col-span-5 relative min-h-[240px] xs:min-h-[280px] md:min-h-[460px] overflow-hidden group">
                <img
                  src={photoVaishnavi}
                  alt="Vaishnavi Singh — Official Brand Ambassador Vikings Gym"
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/30 to-transparent" />
                <div className="absolute top-3 left-3 sm:top-4 sm:left-4">
                  <span className="px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-md bg-red-600 text-black text-[9px] sm:text-[10px] font-sans font-black tracking-widest uppercase shadow-sm">
                    BRAND AMBASSADOR
                  </span>
                </div>
                <div className="absolute bottom-3 left-3 right-3 sm:bottom-5 sm:left-5 sm:right-5">
                  <h3 className="text-xl sm:text-2xl font-sans font-black text-white tracking-tight leading-tight">
                    Vaishnavi Singh
                  </h3>
                  <a
                    href="https://www.instagram.com/chawal.to.choorma/"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-red-400 hover:text-white transition-colors mt-1"
                  >
                    <Instagram className="w-3.5 h-3.5" />
                    @chawal.to.choorma
                  </a>
                </div>
              </div>

              {/* Story & Philosophy */}
              <div className="md:col-span-7 p-4 sm:p-8 md:p-10 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 text-red-500 text-[10px] sm:text-[11px] font-mono uppercase tracking-wider mb-2 sm:mb-3">
                    <Sparkles className="w-3 h-3 text-red-500" />
                    INSPIRING MODERN ATHLETES
                  </div>
                  <h4 className="text-base sm:text-xl md:text-2xl font-sans font-black text-white uppercase tracking-tight mb-2 sm:mb-3">
                    Redefining Fitness & Authentic Wellness
                  </h4>
                  <p className="text-xs sm:text-sm font-sans text-gray-300 leading-relaxed mb-4 sm:mb-6 italic border-l-2 border-red-600 pl-3">
                    "Fitness is not about punishment; it is about self-respect, daily consistency, and showing up every single day to lift yourself and everyone around you."
                  </p>

                  <div className="space-y-2.5 sm:space-y-4 mb-4 sm:mb-6">
                    <div className="flex items-start gap-2.5 sm:gap-3">
                      <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg bg-red-600/10 border border-red-600/25 flex items-center justify-center shrink-0 mt-0.5">
                        <Flame className="w-3.5 h-3.5 text-red-500" />
                      </div>
                      <div>
                        <div className="text-[11px] sm:text-xs font-sans font-bold text-white uppercase tracking-wide">The Vikings Mindset</div>
                        <div className="text-[10px] sm:text-xs font-sans text-gray-400 leading-relaxed">Inspiring members to step boldly onto the training floor, conquer hesitations, and discover genuine strength.</div>
                      </div>
                    </div>

                    <div className="flex items-start gap-2.5 sm:gap-3">
                      <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg bg-red-600/10 border border-red-600/25 flex items-center justify-center shrink-0 mt-0.5">
                        <Heart className="w-3.5 h-3.5 text-red-500" />
                      </div>
                      <div>
                        <div className="text-[11px] sm:text-xs font-sans font-bold text-white uppercase tracking-wide">Sustainable Nutrition (@chawal.to.choorma)</div>
                        <div className="text-[10px] sm:text-xs font-sans text-gray-400 leading-relaxed">Advocating for wholesome daily Indian home cooking paired with structured progressive overload.</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-3 sm:pt-4 border-t border-neutral-800/80 flex flex-wrap items-center justify-between gap-2.5 sm:gap-4">
                  <a
                    href="https://www.instagram.com/chawal.to.choorma/"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 px-3.5 sm:px-5 py-2 sm:py-2.5 rounded-lg bg-red-600 hover:bg-red-700 text-black font-sans font-black text-[11px] sm:text-xs tracking-wider uppercase transition-all shadow-lg shadow-red-600/30"
                  >
                    <Instagram className="w-3.5 h-3.5" />
                    FOLLOW ON INSTAGRAM
                  </a>
                  <Link
                    to="/ambassador"
                    className="text-[10.5px] sm:text-[11px] font-mono text-gray-400 hover:text-white transition-colors"
                  >
                    READ AMBASSADOR STORY →
                  </Link>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* BMI Calculator Section */}
      <section id="calculator" className="relative py-8 sm:py-12 md:py-20 bg-neutral-950/70 border-b border-red-950/20 px-4 sm:px-6 scroll-mt-24">
        <DotGrid />
        <div className="relative z-10 max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-10 lg:gap-16 items-center">
          <Reveal>
          <div>
            <div className="flex items-center gap-2 text-red-500 text-xs font-mono font-bold uppercase tracking-wider mb-2.5 sm:mb-4">
              <Calculator className="w-3.5 h-3.5" />
              PHYSIOLOGY AUDIT TOOL
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-sans font-black text-white uppercase tracking-tight mb-3 sm:mb-6">
              COMPUTE YOUR INDEX & START YOUR TRANSFORMATION
            </h2>
            <p className="text-gray-400 text-xs sm:text-base leading-relaxed mb-4 sm:mb-6">
              Knowing your Body Mass Index (BMI) gives Vikings coaching trainers immediate starting insights into your biological requirements, lean muscle limits, and calorie baselines. Compute yours instantly and match with a personalized club plan!
            </p>
            <div className="bg-neutral-900/60 border border-neutral-800/60 p-3.5 sm:p-5 rounded-lg flex items-start gap-3 sm:gap-4">
              <ShieldAlert className="w-5 h-5 sm:w-6 sm:h-6 text-red-500 shrink-0 mt-0.5" />
              <p className="text-[11px] sm:text-xs text-gray-400 leading-relaxed">
                <strong className="text-white font-mono block mb-0.5 sm:mb-1">HEALTH & MEDICAL STANDARDS:</strong>
                If you suffer from historical blood pressure conditions, bone fractures, or other relevant cardiac issues, please mention these detailed factors on our member registration card in the front desk office.
              </p>
            </div>
          </div>
          </Reveal>

          <Reveal delay={0.1}>
          <div className="bg-neutral-900/50 border border-red-950/20 p-4 sm:p-8 rounded-xl backdrop-blur-md relative overflow-hidden">
            <h3 className="text-base sm:text-lg font-mono font-bold tracking-wider text-white mb-4 sm:mb-6 uppercase flex items-center gap-2">
              <Compass className="text-red-500 w-4 h-4 sm:w-5 sm:h-5" /> BMI AUDIT ENGINE
            </h3>

            <form onSubmit={calculateBMI} className="space-y-4 sm:space-y-6">
              <div className="grid grid-cols-2 gap-3 sm:gap-4">
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
                    className="w-full bg-neutral-950 border border-neutral-850 px-4 py-3 rounded text-white text-base sm:text-sm focus:border-red-650 focus:outline-none"
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
                    className="w-full bg-neutral-950 border border-neutral-850 px-4 py-3 rounded text-white text-base sm:text-sm focus:border-red-650 focus:outline-none"
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
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mt-8 moving-border-red rounded-xl"
              >
                <div className="moving-border-red-inner p-5 sm:p-6 bg-neutral-950 rounded-xl">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-sm font-mono text-gray-400">YOUR ACCURATE BMI:</span>
                    <span className="text-2xl font-mono font-black text-red-500 bg-red-600/10 px-3 py-1 rounded border border-red-900/40">
                      {bmiResult}
                    </span>
                  </div>
                  <div className="mb-4">
                    <span className="text-xs font-mono text-gray-400 uppercase block mb-1">BIOLOGY SCALE:</span>
                    <span className="text-sm font-bold text-white block">{bmiCategory}</span>
                  </div>
                  <div className="bg-black/60 border border-neutral-850 p-4 rounded text-xs text-gray-400 leading-normal">
                    {bmiSuggestion}
                  </div>
                </div>
              </motion.div>
            )}
          </div>
          </Reveal>
        </div>
      </section>

      {/* Pricing / Memberships */}
      <section id="pricing" className="relative py-8 sm:py-12 md:py-20 px-4 sm:px-6 max-w-7xl mx-auto border-b border-red-950/20 scroll-mt-24">
        <DotGrid />
        <div className="relative z-10">
        <SectionHeader
          kicker="पारदर्शी शुल्क • TRANSPARENT PRICING"
          title="MEMBERSHIP TIERS & PACKAGES"
          desc="कोई छुपा हुआ शुल्क नहीं — 1 माह, 3 माह, 6 माह और 1 वर्ष के पारदर्शी फिटनेस प्लान्स"
        />

        <Reveal delay={0.1}>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {DEFAULT_PLANS.map((plan: any, index: number) => {
            const isPop = Boolean(plan.popular);
            return (
              <div
                key={index}
                className={
                  isPop
                    ? "moving-border-red rounded-xl lg:scale-105 shadow-xl shadow-red-950/40"
                    : `bg-neutral-900/40 rounded-xl relative border border-neutral-850 p-5 sm:p-6 flex-col justify-between ${index >= 2 ? "hidden lg:flex" : "flex"}`
                }
              >
                <div className={isPop ? "moving-border-red-inner p-5 sm:p-6 flex flex-col justify-between h-full bg-[#0c0c0c] rounded-xl relative" : "h-full flex flex-col justify-between"}>
                  {isPop && (
                    <div className="w-full py-1.5 px-3 mb-4 bg-gradient-to-r from-red-600 to-rose-600 text-black text-[11px] font-sans font-black rounded-md uppercase tracking-wider text-center shadow-lg shadow-red-600/30 flex items-center justify-center gap-1.5">
                      <span>★</span>
                      <span>MOST POPULAR CHOICE</span>
                      <span>★</span>
                    </div>
                  )}

                  <div>
                    <h3 className="text-white font-sans font-bold text-base sm:text-lg mb-1.5 sm:mb-2">{plan.name}</h3>
                    <p className="text-gray-400 text-xs leading-normal mb-3 sm:mb-4 min-h-[30px]">{plan.desc}</p>

                    <div className="mb-4 sm:mb-6 pb-4 sm:pb-6 border-b border-neutral-850">
                      <span className="text-2xl sm:text-3xl font-sans font-black text-white">{plan.price}</span>
                      <span className="text-xs text-gray-400 font-sans block mt-1">{plan.period}</span>
                    </div>

                    <ul className="space-y-2.5 sm:space-y-3 mb-6 sm:mb-8">
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
                    className={`w-full py-2.5 sm:py-3 rounded-md font-sans font-bold text-xs tracking-wider transition-all cursor-pointer ${isPop
                      ? "bg-red-600 hover:bg-red-700 text-black shadow-lg"
                      : "btn-ice bg-neutral-950 text-gray-300 hover:text-white border border-neutral-800 hover:border-transparent hover:shadow-lg hover:shadow-blue-600/30"
                      }`}
                  >
                    SECURE SLOT NOW
                  </button>
                </div>
              </div>
            );
          })}
        </div>
        <div className="mt-5 sm:mt-8 text-center lg:hidden">
          <Link
            to="/memberships"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border border-red-500/40 bg-red-600/10 hover:bg-red-600 hover:text-black text-red-400 font-mono text-xs font-bold transition-all uppercase"
          >
            VIEW ALL 4 MEMBERSHIP TIERS &amp; PT RATES →
          </Link>
        </div>
        </Reveal>

        {/* Group Classes & Personal Training — Visible on Desktop */}
        <Reveal delay={0.05}>
        <div className="mt-12 hidden lg:grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-neutral-900/30 border border-neutral-900 rounded-xl p-6 sm:p-8">
            <p className="text-red-500 font-sans font-extrabold text-xs tracking-widest uppercase mb-4">GROUP CLASSES · ₹1,500 / 30 DAYS</p>
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
              className="btn-ice w-full py-3 rounded-md font-mono font-bold text-xs tracking-wider transition-all cursor-pointer bg-neutral-950 text-gray-300 hover:text-white border border-neutral-800 hover:border-transparent hover:shadow-lg hover:shadow-blue-600/30"
            >
              ENQUIRE ABOUT GROUP CLASSES
            </button>
          </div>

          <div className="bg-neutral-900/30 border border-neutral-900 rounded-xl p-6 sm:p-8">
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
              className="btn-ice w-full py-3 rounded-md font-mono font-bold text-xs tracking-wider transition-all cursor-pointer bg-neutral-950 text-gray-300 hover:text-white border border-neutral-800 hover:border-transparent hover:shadow-lg hover:shadow-blue-600/30"
            >
              BOOK A PERSONAL TRAINER
            </button>
          </div>
        </div>
        <div className="mt-3 text-center lg:hidden">
          <Link to="/memberships" className="text-[11px] font-mono text-gray-400 hover:text-red-400 transition-colors">
            Looking for 1-on-1 Personal Training or Zumba/Yoga classes? View options →
          </Link>
        </div>
        </Reveal>
        </div>
      </section>
      {/* Gallery & Official Instagram Section */}
      {/* Gallery & Daily Stories Section */}
      <section id="gallery" className="relative py-8 sm:py-12 md:py-20 bg-neutral-950/40 px-4 sm:px-6 border-b border-red-950/20 scroll-mt-24">
        <DotGrid />
        <div className="relative z-10 max-w-7xl mx-auto">
          <SectionHeader
            kicker="दैनिक वर्कआउट झलकियां • LIVE ARENA STORIES"
            title="DAILY STORIES &amp; ARENA MOMENTS"
            desc={
              <>
                एमजी रोड, औरंगाबाद में हर दिन का अनुशासन और वर्कआउट — आधिकारिक इंस्टाग्राम{" "}
                <a href={GYM_CONFIG.instagram} target="_blank" rel="noreferrer" className="text-red-500 hover:underline font-bold">@{GYM_CONFIG.instagramHandle}</a>{" "}
                और फेसबुक पेज पर देखें। किसी भी स्टोरी कार्ड पर टैप करके लाइव प्रिव्यू देखें।
              </>
            }
          />

          {/* Daily Stories Redesigned Section */}
          <Reveal delay={0.1}>
          <div className="mb-6 sm:mb-10 md:mb-14">
            {/* Header with Live Status & Dual Channel Links */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-white/5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-amber-400 via-rose-500 to-red-600 p-[2px] flex items-center justify-center shrink-0 shadow-lg shadow-red-600/20">
                  <div className="w-full h-full bg-black rounded-full flex items-center justify-center">
                    <Instagram className="w-4 h-4 text-white" />
                  </div>
                </div>
                <div>
                  <h3 className="font-sans text-sm sm:text-base font-black text-white uppercase tracking-wider flex items-center gap-2">
                    DAILY STORIES &amp; ARENA MOMENTS
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-red-600/15 border border-red-500/30 text-[9px] font-mono text-red-400 font-bold">
                      <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" /> 5 LIVE TODAY
                    </span>
                  </h3>
                  <p className="text-[11px] font-sans text-gray-400">
                    24-घंटे के वर्कआउट क्लिप्स, पर्सनल रिकॉर्ड्स और स्टीम स्पा सेशन्स
                  </p>
                </div>
              </div>

              {/* Dual Social Channel Links */}
              <div className="flex items-center gap-2.5 flex-wrap">
                <a
                  href={GYM_CONFIG.instagramStories}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg border border-red-500/40 bg-red-600/10 hover:bg-red-600 hover:text-black text-red-400 font-mono text-xs font-bold transition-all uppercase"
                >
                  <Instagram className="w-3.5 h-3.5" />
                  WATCH STORIES →
                </a>
                <a
                  href={GYM_CONFIG.facebook}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg border border-blue-500/40 bg-blue-600/10 hover:bg-blue-600 hover:text-white text-blue-400 font-mono text-xs font-bold transition-all uppercase"
                >
                  <Facebook className="w-3.5 h-3.5" />
                  FACEBOOK PAGE
                </a>
              </div>
            </div>

            {/* Instagram-Style Story Avatar Rings Reel */}
            <div className="flex items-center gap-3 sm:gap-6 overflow-x-auto pb-4 mb-6 scrollbar-none select-none">
              {STORY_TILES.map((s, i) => (
                <button
                  key={`ring-${i}`}
                  onClick={() => setActiveStoryIndex(i)}
                  className="flex flex-col items-center gap-1.5 shrink-0 group cursor-pointer focus:outline-none"
                  aria-label={`Open ${s.label} story`}
                >
                  {/* Glowing Instagram Ring */}
                  <div className="relative p-[2.5px] rounded-full bg-gradient-to-tr from-amber-400 via-rose-500 to-red-600 group-hover:scale-105 transition-transform duration-300 shadow-md shadow-red-950/40">
                    <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full overflow-hidden border-2 border-black bg-black">
                      <img src={s.img} alt={s.label} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                    </div>
                    {/* Live Dot */}
                    <span className="absolute bottom-0 right-1 w-3 h-3 rounded-full bg-red-600 border-2 border-black animate-pulse" />
                  </div>
                  <span className="text-[10px] font-sans font-bold text-gray-200 group-hover:text-red-400 transition-colors max-w-[70px] truncate text-center">
                    {s.hindiLabel}
                  </span>
                </button>
              ))}
            </div>

            {/* Minimal stories hint */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-[11px] font-mono text-gray-400 pt-1 border-t border-neutral-900">
              <span className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                स्टोरी पर टैप करके लाइव प्रिव्यू देखें · Stories refresh every 24 hours
              </span>
              <div className="flex items-center gap-3">
                <a href={GYM_CONFIG.instagram} target="_blank" rel="noreferrer" className="text-red-400 hover:text-white transition-colors underline">
                  Instagram @{GYM_CONFIG.instagramHandle}
                </a>
                <span>·</span>
                <a href={GYM_CONFIG.facebook} target="_blank" rel="noreferrer" className="text-blue-400 hover:text-white transition-colors underline">
                  Official Facebook Page
                </a>
              </div>
            </div>
          </div>
          </Reveal>

          {/* In-App Interactive Story Viewer Modal */}
          <AnimatePresence>
            {activeStoryIndex !== null && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="fixed inset-0 z-[110] flex items-center justify-center bg-black/95 backdrop-blur-2xl p-2 sm:p-4 select-none"
                onClick={() => setActiveStoryIndex(null)}
              >
                <motion.div
                  initial={{ scale: 0.94, y: 16 }}
                  animate={{ scale: 1, y: 0 }}
                  exit={{ scale: 0.94, y: 16 }}
                  transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                  onClick={(e) => e.stopPropagation()}
                  className="relative w-full max-w-sm sm:max-w-md aspect-[9/16] rounded-3xl overflow-hidden bg-neutral-950 border border-white/10 shadow-2xl shadow-red-950/80 flex flex-col justify-between"
                >
                  {/* Story Background Image */}
                  <img
                    src={STORY_TILES[activeStoryIndex]?.img}
                    alt={STORY_TILES[activeStoryIndex]?.label}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-black/70 pointer-events-none" />

                  {/* Top Bar: Progress Segments & User Info */}
                  <div className="relative z-20 p-3.5 sm:p-4 flex flex-col gap-2.5">
                    {/* Multi-segment story progress bar */}
                    <div className="grid grid-cols-5 gap-1.5 w-full">
                      {STORY_TILES.map((_, idx) => (
                        <div
                          key={`progress-${idx}`}
                          className="h-1 rounded-full bg-white/20 overflow-hidden"
                        >
                          <div
                            className={`h-full rounded-full transition-all duration-300 ${
                              idx < activeStoryIndex
                                ? "w-full bg-white"
                                : idx === activeStoryIndex
                                ? "w-full bg-red-500 animate-pulse"
                                : "w-0"
                            }`}
                          />
                        </div>
                      ))}
                    </div>

                    {/* Header: User avatar, name, time, close */}
                    <div className="flex items-center justify-between text-white">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full p-[1.5px] bg-gradient-to-tr from-amber-400 via-rose-500 to-red-600">
                          <img
                            src={logoPremium}
                            alt="Vikings Gym"
                            className="w-full h-full rounded-full object-cover bg-black"
                          />
                        </div>
                        <div>
                          <span className="font-sans text-xs font-black block tracking-wider uppercase">
                            vikings_fitness
                          </span>
                          <span className="text-[10px] font-mono text-gray-300 block">
                            {STORY_TILES[activeStoryIndex]?.timeAgo} · Aurangabad, Bihar
                          </span>
                        </div>
                      </div>

                      <button
                        onClick={() => setActiveStoryIndex(null)}
                        className="w-8 h-8 rounded-full bg-black/60 hover:bg-black/90 text-white flex items-center justify-center transition-colors cursor-pointer border border-white/20"
                        aria-label="Close story viewer"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Left & Right Tap Navigation Zones */}
                  <div className="absolute inset-y-16 inset-x-0 flex justify-between z-10 pointer-events-none">
                    <button
                      onClick={() => setActiveStoryIndex((prev) => (prev !== null && prev > 0 ? prev - 1 : STORY_TILES.length - 1))}
                      className="w-1/3 h-full pointer-events-auto cursor-pointer focus:outline-none flex items-center justify-start pl-2 text-white/50 hover:text-white transition-opacity opacity-0 sm:opacity-100"
                      aria-label="Previous story"
                    >
                      <div className="w-9 h-9 rounded-full bg-black/40 border border-white/10 flex items-center justify-center backdrop-blur-sm">
                        <ChevronLeft className="w-5 h-5 text-white" />
                      </div>
                    </button>
                    <button
                      onClick={() => setActiveStoryIndex((prev) => (prev !== null && prev < STORY_TILES.length - 1 ? prev + 1 : 0))}
                      className="w-1/3 h-full pointer-events-auto cursor-pointer focus:outline-none flex items-center justify-end pr-2 text-white/50 hover:text-white transition-opacity opacity-0 sm:opacity-100"
                      aria-label="Next story"
                    >
                      <div className="w-9 h-9 rounded-full bg-black/40 border border-white/10 flex items-center justify-center backdrop-blur-sm">
                        <ChevronRight className="w-5 h-5 text-white" />
                      </div>
                    </button>
                  </div>

                  {/* Bottom Caption & External Action CTAs */}
                  <div className="relative z-20 p-4 sm:p-5 flex flex-col gap-3 bg-gradient-to-t from-black via-black/90 to-transparent">
                    <div>
                      <span className="inline-block px-2 py-0.5 rounded bg-red-600/30 text-red-300 border border-red-500/40 text-[9px] font-sans font-bold uppercase mb-1">
                        {STORY_TILES[activeStoryIndex]?.hindiLabel}
                      </span>
                      <h4 className="text-base sm:text-lg font-sans font-black text-white uppercase tracking-tight">
                        {STORY_TILES[activeStoryIndex]?.label}
                      </h4>
                      <p className="text-xs text-gray-200 font-sans mt-0.5 leading-relaxed">
                        {STORY_TILES[activeStoryIndex]?.hindiCaption}
                      </p>
                      <p className="text-[11px] text-gray-400 font-sans mt-0.5">
                        {STORY_TILES[activeStoryIndex]?.caption}
                      </p>
                    </div>

                    {/* Direct Social Link Buttons */}
                    <div className="grid grid-cols-2 gap-2 pt-1">
                      <a
                        href={GYM_CONFIG.instagramStories}
                        target="_blank"
                        rel="noreferrer"
                        className="py-2.5 px-3 rounded-xl bg-red-600 hover:bg-red-700 text-black font-sans font-black text-[11px] uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all text-center"
                      >
                        <Instagram className="w-3.5 h-3.5" />
                        INSTAGRAM STORY
                      </a>
                      <a
                        href={GYM_CONFIG.facebook}
                        target="_blank"
                        rel="noreferrer"
                        className="py-2.5 px-3 rounded-xl bg-neutral-900 hover:bg-neutral-850 border border-neutral-700 text-white font-sans font-bold text-[11px] uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all text-center"
                      >
                        <Facebook className="w-3.5 h-3.5 text-blue-400" />
                        FACEBOOK PAGE
                      </a>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Facility Gallery Dual-Row Continuous Auto-Marquee */}
          <Reveal delay={0.05}>
          <div className="overflow-hidden py-2">
            <div className="flex items-center justify-between mb-4 sm:mb-5">
              <div className="flex items-center gap-2 sm:gap-2.5">
                <h3 className="font-mono text-xs sm:text-sm font-black text-white uppercase tracking-wider sm:tracking-widest">
                  FACILITY GALLERY
                </h3>
                <span className="px-2 py-0.5 rounded bg-red-600/20 text-red-400 border border-red-600/30 text-[8px] sm:text-[9px] font-mono font-bold uppercase whitespace-nowrap">
                  36 REAL PHOTOS
                </span>
              </div>
              <Link
                to="/gallery"
                className="inline-flex items-center gap-1 sm:gap-1.5 text-[11px] sm:text-xs font-mono font-bold text-red-500 hover:text-white uppercase transition-colors group cursor-pointer shrink-0"
              >
                <span>OPEN FULL GALLERY</span>
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </Link>
            </div>

            {/* Upper Row: Left to Right Marquee */}
            <div className="overflow-hidden py-1.5 [mask-image:linear-gradient(to_right,transparent,black_4%,black_96%,transparent)]">
              <div className="gallery-marquee-ltr flex gap-3 sm:gap-4">
                {[...GALLERY_ROW_1, ...GALLERY_ROW_1].map((img, i) => (
                  <Link
                    key={`r1-${i}`}
                    to="/gallery"
                    className="group relative w-64 sm:w-80 aspect-[16/10] shrink-0 rounded-xl overflow-hidden border border-neutral-900 hover:border-red-600/70 transition-all shadow-md hover:shadow-xl cursor-pointer"
                  >
                    <img
                      src={img.url}
                      alt={img.label}
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-transparent opacity-85 group-hover:opacity-100 transition-opacity" />
                    <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between">
                      <span className="text-[11px] font-sans font-bold text-white uppercase tracking-tight truncate block">
                        {img.label}
                      </span>
                      <span className="text-[9px] font-mono text-red-400 font-bold uppercase shrink-0 ml-2">
                        {img.zone}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Lower Row: Right to Left Marquee */}
            <div className="overflow-hidden py-1.5 mt-2.5 [mask-image:linear-gradient(to_right,transparent,black_4%,black_96%,transparent)]">
              <div className="gallery-marquee-rtl flex gap-3 sm:gap-4">
                {[...GALLERY_ROW_2, ...GALLERY_ROW_2].map((img, i) => (
                  <Link
                    key={`r2-${i}`}
                    to="/gallery"
                    className="group relative w-64 sm:w-80 aspect-[16/10] shrink-0 rounded-xl overflow-hidden border border-neutral-900 hover:border-red-600/70 transition-all shadow-md hover:shadow-xl cursor-pointer"
                  >
                    <img
                      src={img.url}
                      alt={img.label}
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-transparent opacity-85 group-hover:opacity-100 transition-opacity" />
                    <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between">
                      <span className="text-[11px] font-sans font-bold text-white uppercase tracking-tight truncate block">
                        {img.label}
                      </span>
                      <span className="text-[9px] font-mono text-red-400 font-bold uppercase shrink-0 ml-2">
                        {img.zone}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* View All Photos Full-Width CTA Banner */}
            <div className="mt-4 sm:mt-6 text-center">
              <Link
                to="/gallery"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-4 sm:px-8 py-3 sm:py-3.5 rounded-xl bg-neutral-950/90 hover:bg-neutral-900 text-white border border-neutral-800 hover:border-red-600/70 shadow-lg shadow-black/50 transition-all group cursor-pointer active:scale-[0.98]"
              >
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-red-600/20 text-red-500 border border-red-600/40 flex items-center justify-center group-hover:scale-110 group-hover:bg-red-600 group-hover:text-black transition-all shrink-0">
                  <Camera className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </div>
                <div className="text-left">
                  <div className="text-[10.5px] sm:text-xs font-mono font-black tracking-[0.12em] sm:tracking-[0.16em] uppercase text-white group-hover:text-red-400 transition-colors">
                    EXPLORE COMPLETE ARENA GALLERY (ALL 36 REAL PHOTOS)
                  </div>
                  <div className="text-[8.5px] sm:text-[10px] font-mono text-gray-400">
                    Olympic powerlifting, Viva Fitness stacks, cardio fleet &amp; Moroccan steam spa →
                  </div>
                </div>
              </Link>
            </div>
          </div>
          </Reveal>

          {/* Follow CTA */}
          <Reveal delay={0.05}>
          <div className="mt-6 sm:mt-12 bg-neutral-900/40 border border-neutral-900 rounded-xl p-5 sm:p-8 text-center">
            <h4 className="font-mono font-black text-white uppercase tracking-widest mb-1.5 sm:mb-2 text-xs sm:text-sm">DON'T MISS TODAY'S ACTION</h4>
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
                className="btn-ice bg-neutral-950 text-gray-300 hover:text-white border border-neutral-800 hover:border-transparent hover:shadow-lg hover:shadow-blue-600/30 font-mono font-black text-xs px-6 py-3 rounded transition-all cursor-pointer"
              >
                WATCH TODAY'S STORIES
              </a>
            </div>
          </div>
          </Reveal>
        </div>
      </section>

      {/* Review us on Google Maps */}
      <section id="review" className="relative py-8 sm:py-12 md:py-20 bg-neutral-950/40 px-4 sm:px-6 border-b border-red-950/20 scroll-mt-24">
        <DotGrid />
        <Reveal>
        <div className="relative z-10 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
          <div>
            <span className="text-red-500 font-mono text-xs tracking-widest uppercase block mb-2">SHARE THE EXPERIENCE</span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-sans font-black text-white uppercase tracking-tight mb-3 sm:mb-4">
              REVIEW US ON GOOGLE MAPS
            </h2>
            <div className="w-12 sm:w-16 h-1 bg-red-650 rounded mb-4 sm:mb-6"></div>
            <p className="text-gray-400 text-xs sm:text-sm leading-relaxed max-w-xl mb-4 sm:mb-6">
              Loved your session at Vikings Gym & Spa? A quick review keeps our warriors fired up and
              helps more legends find their way to the kingdom. It takes less than 30 seconds.
            </p>
            <div className="flex items-center gap-1.5 mb-6 sm:mb-8">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400 fill-amber-400" />
              ))}
              <span className="text-gray-400 text-xs font-mono ml-2">RATED {GYM_CONFIG.rating} / 5 BY MEMBERS</span>
            </div>
            <div className="flex flex-wrap gap-3 sm:gap-4">
              <a
                href={GYM_CONFIG.mapLink}
                target="_blank"
                rel="noreferrer"
                className="bg-red-600 hover:bg-red-700 text-black font-mono font-black text-xs px-5 sm:px-6 py-2.5 sm:py-3 rounded transition-all cursor-pointer flex items-center gap-2"
              >
                <Star className="w-4 h-4" /> LEAVE A REVIEW
              </a>
              <a
                href={GYM_CONFIG.mapLink}
                target="_blank"
                rel="noreferrer"
                className="btn-ice bg-neutral-950 text-gray-300 hover:text-white border border-neutral-800 hover:border-transparent hover:shadow-lg hover:shadow-blue-600/30 font-mono font-black text-xs px-5 sm:px-6 py-2.5 sm:py-3 rounded transition-all cursor-pointer flex items-center gap-2"
              >
                <MapPin className="w-4 h-4" /> OPEN IN GOOGLE MAPS
              </a>
            </div>
          </div>

          <div className="hidden lg:flex justify-center">
            <div className="bg-neutral-900/60 border border-neutral-900 rounded-2xl p-6 sm:p-8 flex flex-col items-center max-w-sm w-full">
              <span className="text-red-500 font-mono text-[10px] tracking-widest uppercase mb-4">SCAN · RATE · FORGE</span>
              <a href={GYM_CONFIG.mapLink} target="_blank" rel="noreferrer" className="block bg-white rounded-xl p-3">
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=260x260&margin=8&data=${encodeURIComponent(GYM_CONFIG.mapLink)}`}
                  alt="QR code — review Vikings Gym & Spa on Google Maps"
                  className="w-48 h-48 sm:w-56 sm:h-56 object-contain"
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

      {/* FAQs Section */}
      <section id="faq" className="relative py-8 sm:py-12 md:py-20 px-4 sm:px-6 max-w-5xl mx-auto border-b border-red-950/20 scroll-mt-24">
        <DotGrid />
        <div className="relative z-10">
          <SectionHeader
            kicker="CLEAR ANSWERS"
            title="FREQUENTLY ASKED QUESTIONS"
            desc="Everything you need to know about memberships, amenities, hours, and training at Vikings Gym & Spa."
          />

          <Reveal delay={0.1}>
            <div className="space-y-2.5 sm:space-y-3.5">
              {FAQS.map((faq, idx) => {
                const isOpen = openFaqIndex === idx;
                return (
                  <div
                    key={idx}
                    className={`rounded-xl border border-neutral-850 bg-neutral-900/40 hover:border-red-900/60 transition-colors overflow-hidden ${!showAllFaqs && idx >= 3 ? "hidden sm:block" : "block"}`}
                  >
                    <button
                      onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                      className="w-full px-4 sm:px-5 py-3 sm:py-4 text-left flex items-center justify-between gap-3 sm:gap-4 cursor-pointer focus:outline-none"
                      aria-expanded={isOpen}
                    >
                      <span className="font-mono text-xs sm:text-base font-bold text-white flex items-center gap-2.5 sm:gap-3">
                        <span className="text-red-500 font-mono text-xs">0{idx + 1}.</span>
                        {faq.q}
                      </span>
                      <ChevronDown
                        className={`w-4 h-4 text-red-500 shrink-0 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
                      />
                    </button>
                    <AnimatePresence>
                      {isOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.25 }}
                          className="overflow-hidden"
                        >
                          <div className="px-4 sm:px-5 pb-4 sm:pb-5 pt-1 text-gray-300 text-xs sm:text-sm leading-relaxed border-t border-neutral-850/60">
                            {faq.a}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
            {!showAllFaqs && (
              <div className="mt-4 sm:hidden text-center">
                <button
                  onClick={() => setShowAllFaqs(true)}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-neutral-900 hover:bg-neutral-850 border border-neutral-800 text-red-500 font-mono text-xs font-bold uppercase transition-all"
                >
                  VIEW ALL {FAQS.length} FAQS ({FAQS.length - 3} MORE) ↓
                </button>
              </div>
            )}
          </Reveal>
        </div>
      </section>



      {/* Contact & Map Section */}
      <section id="contact" className="relative py-8 sm:py-12 md:py-20 px-4 sm:px-6 max-w-7xl mx-auto scroll-mt-24">
        <DotGrid />
        <Reveal>
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-10 lg:gap-16">
          <div>
            <span className="text-red-500 font-mono text-xs tracking-widest uppercase block mb-1.5 sm:mb-2">जिम विजिट करें • VISIT VIKINGS GYM</span>
            <h2 className="text-2xl sm:text-3xl font-sans font-black text-white uppercase tracking-tight mb-3 sm:mb-4">
              LOCATION &amp; CONTACT DETAILS
            </h2>
            <p className="text-gray-400 text-xs sm:text-sm md:text-base leading-relaxed mb-4 sm:mb-6">
              एमजी रोड, औरंगाबाद में हमारे आधुनिक एरीना को विजिट करें, वीवा फिटनेस उपकरण और मोरक्कन स्टीम स्पा का अनुभव लें। सोमवार से शनिवार, सुबह 5 बजे से रात 10 बजे तक खुला है।
            </p>

            <div className="space-y-3.5 sm:space-y-5">
              <div className="flex items-start gap-3 sm:gap-4">
                <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-red-500 mt-1 shrink-0" />
                <div>
                  <h4 className="text-white text-xs sm:text-sm font-mono font-bold uppercase mb-0.5 sm:mb-1">GYM ADDRESS (पता):</h4>
                  <p className="text-xs text-gray-300">
                    {GYM_CONFIG.address}
                  </p>
                  <p className="text-[11px] text-gray-500 mt-0.5">
                    रमेश चौक के पास, एमजी रोड, औरंगाबाद, बिहार 824101
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 sm:gap-4">
                <Phone className="w-4 h-4 sm:w-5 sm:h-5 text-red-500 mt-1 shrink-0" />
                <div>
                  <h4 className="text-white text-xs sm:text-sm font-mono font-bold uppercase mb-0.5 sm:mb-1">DIRECT INQUIRIES (संपर्क):</h4>
                  <p className="text-xs text-gray-300">
                    <a href={`tel:${GYM_CONFIG.phone}`} className="hover:text-red-500 font-bold">{GYM_CONFIG.phoneDisplay}</a> ·{" "}
                    <a href={`https://wa.me/${GYM_CONFIG.whatsapp}`} target="_blank" rel="noreferrer" className="hover:text-red-500 font-bold">WhatsApp Direct</a>
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 sm:gap-4">
                <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-red-500 mt-1 shrink-0" />
                <div>
                  <h4 className="text-white text-xs sm:text-sm font-mono font-bold uppercase mb-0.5 sm:mb-1">TIMINGS (समय):</h4>
                  <p className="text-xs text-gray-300 font-mono leading-relaxed">
                    {GYM_CONFIG.hours} (रविवार रिकवरी)
                  </p>
                </div>
              </div>

              {/* Direct Social Media Links */}
              <div className="pt-1 sm:pt-2 flex flex-wrap items-center gap-2 sm:gap-3">
                <a
                  href={GYM_CONFIG.facebook}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-3.5 py-1.5 sm:py-2 rounded-lg bg-blue-600/10 hover:bg-blue-600 hover:text-white border border-blue-500/30 text-blue-400 font-mono text-[11px] sm:text-xs font-bold transition-all uppercase"
                >
                  <Facebook className="w-3.5 h-3.5" />
                  OFFICIAL FACEBOOK
                </a>
                <a
                  href={GYM_CONFIG.instagram}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-3.5 py-1.5 sm:py-2 rounded-lg bg-pink-600/10 hover:bg-gradient-to-r hover:from-amber-500 hover:to-rose-600 hover:text-white border border-pink-500/30 text-pink-400 font-mono text-[11px] sm:text-xs font-bold transition-all uppercase"
                >
                  <Instagram className="w-3.5 h-3.5" />
                  INSTAGRAM FEED
                </a>
                <a
                  href={GYM_CONFIG.mapLink}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-3.5 py-1.5 sm:py-2 rounded-lg bg-neutral-900 hover:bg-neutral-850 border border-neutral-800 text-gray-300 hover:text-white font-mono text-[11px] sm:text-xs font-bold transition-all uppercase"
                >
                  <MapPin className="w-3.5 h-3.5 text-red-500" />
                  GOOGLE MAPS
                </a>
              </div>
            </div>
          </div>

          <div className="bg-neutral-900/50 border border-neutral-900 rounded-xl p-4 sm:p-6 md:p-8 backdrop-blur-md">
            <h3 className="text-base sm:text-lg font-mono font-bold text-white mb-4 sm:mb-6 uppercase flex items-center gap-2">
              <Compass className="text-red-500 w-4 h-4 sm:w-5 sm:h-5" /> EXPEDITE GUEST INQUIRY
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
              <form onSubmit={handleContactSubmit} className="space-y-3.5 sm:space-y-4">
                <div>
                  <label htmlFor="contact-name" className="block text-[11px] sm:text-xs font-mono text-gray-400 mb-1 sm:mb-1.5 uppercase">Full Name</label>
                  <input
                    id="contact-name"
                    type="text"
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                    className="w-full bg-black/50 border border-neutral-850 px-3.5 sm:px-4 py-2 sm:py-2.5 rounded text-white text-base sm:text-xs focus:border-red-650 focus:outline-none"
                    placeholder="e.g. Ritwik Singh"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="contact-phone" className="block text-[11px] sm:text-xs font-mono text-gray-400 mb-1 sm:mb-1.5 uppercase">Phone Number</label>
                  <input
                    id="contact-phone"
                    type="tel"
                    inputMode="tel"
                    value={contactPhone}
                    onChange={(e) => setContactPhone(e.target.value)}
                    className="w-full bg-black/50 border border-neutral-850 px-3.5 sm:px-4 py-2 sm:py-2.5 rounded text-white text-base sm:text-xs focus:border-red-650 focus:outline-none"
                    placeholder="e.g. +91 XXXXX XXXXX"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="contact-message" className="block text-[11px] sm:text-xs font-mono text-gray-400 mb-1 sm:mb-1.5 uppercase">Message (What are your fitness limits?)</label>
                  <textarea
                    id="contact-message"
                    rows={2}
                    value={contactMessage}
                    onChange={(e) => setContactMessage(e.target.value)}
                    className="w-full bg-black/50 border border-neutral-850 px-3.5 sm:px-4 py-2 sm:py-2.5 rounded text-white text-base sm:text-xs focus:border-red-650 focus:outline-none"
                    placeholder="Want to inquire about trainers..."
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="w-full bg-red-600 hover:bg-red-700 text-black py-2.5 sm:py-3 rounded font-mono font-bold text-xs tracking-widest transition-all cursor-pointer"
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
            className="w-full max-w-lg bg-neutral-950 border border-red-950/80 p-5 sm:p-8 rounded-xl shadow-2xl relative"
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
                    className="w-full bg-neutral-900 border border-neutral-800 px-3 py-2 rounded text-white text-base sm:text-xs focus:ring-1 focus:ring-red-600 focus:outline-none"
                    placeholder="e.g. Vikram Joshi"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="franchise-city" className="block text-[10px] font-mono text-gray-400 mb-1 uppercase">Proposed City/Location</label>
                    <input
                      id="franchise-city"
                      type="text"
                      value={franchiseData.city}
                      onChange={(e) => setFranchiseData({ ...franchiseData, city: e.target.value })}
                      required
                      className="w-full bg-neutral-900 border border-neutral-800 px-3 py-2 rounded text-white text-base sm:text-xs focus:ring-1 focus:ring-red-600 focus:outline-none"
                      placeholder="e.g. Nanded, Jalna"
                    />
                  </div>
                  <div>
                    <label htmlFor="franchise-capital" className="block text-[10px] font-mono text-gray-400 mb-1 uppercase">Available Investment Capital</label>
                    <select
                      id="franchise-capital"
                      value={franchiseData.capital}
                      onChange={(e) => setFranchiseData({ ...franchiseData, capital: e.target.value })}
                      className="w-full bg-neutral-900 border border-neutral-800 px-3 py-2 rounded text-white text-base sm:text-xs focus:ring-1 focus:ring-red-650 focus:outline-none"
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
                    className="w-full bg-neutral-900 border border-neutral-800 px-3 py-2 rounded text-white text-base sm:text-xs focus:ring-1 focus:ring-red-600 focus:outline-none"
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
      <section id="about" className="relative py-8 sm:py-12 md:py-20 px-4 sm:px-6 max-w-7xl mx-auto border-b border-red-950/20 scroll-mt-24">
        <DotGrid />
        <Reveal>
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-10 lg:gap-16 items-center">
          <div>
            <p className="text-red-500 font-mono text-xs tracking-widest uppercase mb-1.5 sm:mb-2">ABOUT THE KINGDOM</p>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-sans font-black text-white uppercase tracking-tight mb-4 sm:mb-6">
              VIKINGS GYM <span className="text-red-500">वाइकिंग्स जिम</span>
            </h2>
            <div className="flex items-center gap-3 mb-4 sm:mb-6">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${i < Math.floor(GYM_CONFIG.rating) ? "text-amber-400 fill-amber-400" : "text-gray-600"}`} />
                ))}
              </div>
              <span className="text-xs sm:text-sm font-mono text-white">{GYM_CONFIG.rating}</span>
              <a href={GYM_CONFIG.mapLink} target="_blank" rel="noreferrer" className="text-xs font-mono text-gray-400 hover:text-red-500 underline underline-offset-2">
                Rated {GYM_CONFIG.reviews} times on Google
              </a>
            </div>
            <p className="text-gray-400 text-xs sm:text-sm md:text-base leading-relaxed mb-4 sm:mb-6">
              {GYM_CONFIG.name} is Aurangabad's ultimate commercial fitness & steam spa facility. Imported heavy-duty
              plate-loaded machines, Olympic powerlifting stations, structured cardio rooms, and complete rejuvenating
              Moroccan steam spa baths — built for warriors who want to train hard and recover harder.
            </p>
            <ul className="space-y-2.5 sm:space-y-4 mb-5 sm:mb-8">
              <li className="flex items-start gap-2.5 sm:gap-3 text-xs sm:text-sm text-gray-300">
                <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-red-500 mt-0.5 shrink-0" />
                <div>
                  <span className="font-mono text-white text-xs uppercase">Address:</span>
                  <p className="text-gray-400 text-xs mt-0.5 sm:mt-1">{GYM_CONFIG.address} (see map below for directions)</p>
                </div>
              </li>
              <li className="flex items-start gap-2.5 sm:gap-3 text-xs sm:text-sm text-gray-300">
                <Phone className="w-4 h-4 sm:w-5 sm:h-5 text-red-500 mt-0.5 shrink-0" />
                <div>
                  <span className="font-mono text-white text-xs uppercase">Call / WhatsApp:</span>
                  <p className="text-gray-400 text-xs mt-0.5 sm:mt-1">
                    <a href={`tel:${GYM_CONFIG.phone}`} className="hover:text-red-500">{GYM_CONFIG.phoneDisplay}</a> ·{" "}
                    <a href={`https://wa.me/${GYM_CONFIG.whatsapp}`} target="_blank" rel="noreferrer" className="hover:text-red-500">WhatsApp us</a>
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-2.5 sm:gap-3 text-xs sm:text-sm text-gray-300">
                <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-red-500 mt-0.5 shrink-0" />
                <div>
                  <span className="font-mono text-white text-xs uppercase">Operating Hours:</span>
                  <p className="text-gray-400 text-xs mt-0.5 sm:mt-1">{GYM_CONFIG.hours}</p>
                </div>
              </li>
              <li className="flex items-start gap-2.5 sm:gap-3 text-xs sm:text-sm text-gray-300">
                <Instagram className="w-4 h-4 sm:w-5 sm:h-5 text-red-500 mt-0.5 shrink-0" />
                <div>
                  <span className="font-mono text-white text-xs uppercase">Instagram:</span>
                  <p className="text-gray-400 text-xs mt-0.5 sm:mt-1">
                    <a href={GYM_CONFIG.instagram} target="_blank" rel="noreferrer" className="hover:text-red-500">@{GYM_CONFIG.instagram.split("/").pop()}</a>
                  </p>
                </div>
              </li>
            </ul>
            <button
              onClick={() => openWhatsApp(JOIN_MESSAGE)}
              className="bg-red-600 hover:bg-red-700 text-black font-mono font-black text-xs px-5 sm:px-6 py-2.5 sm:py-3 rounded hover:scale-105 active:scale-95 transition-all shadow-lg shadow-red-600/20 cursor-pointer"
            >
              BEGIN YOUR JOURNEY
            </button>
          </div>

          <div className="bg-neutral-900/50 border border-neutral-900 rounded-xl overflow-hidden">
            <iframe
              src={GYM_CONFIG.mapEmbed}
              title="VIKINGS GYM Location"
              className="w-full h-[220px] sm:h-[320px] md:h-[400px] border-0"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
            <div className="p-3.5 sm:p-5 flex flex-wrap items-center justify-between gap-3 sm:gap-4">
              <div className="flex items-center gap-2">
                <span className={`inline-block w-2 h-2 rounded-full animate-pulse ${gymOpen ? "bg-emerald-500" : "bg-red-500"}`}></span>
                <span className={`text-[11px] sm:text-xs font-mono ${gymOpen ? "text-emerald-400" : "text-red-400"}`}>
                  {gymOpen ? `OPEN NOW · ${GYM_CONFIG.hours}` : `CURRENTLY CLOSED · ${GYM_CONFIG.hours}`}
                </span>
              </div>
              <a
                href={GYM_CONFIG.mapLink}
                target="_blank"
                rel="noreferrer"
                className="text-xs font-mono font-bold text-black bg-red-600 hover:bg-red-700 px-3.5 sm:px-4 py-1.5 sm:py-2 rounded transition-all cursor-pointer"
              >
                GET DIRECTIONS
              </a>
            </div>
          </div>
        </div>
        </Reveal>
      </section>

      {/* Footer - Always Dark Luxury Design */}
      <footer className="footer-always-dark bg-neutral-950 border-t border-neutral-900 px-4 sm:px-6 pt-8 sm:pt-14 pb-6 sm:pb-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-10 mb-6 sm:mb-10">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <img src={logoPremium} alt="Vikings Logo" className="h-8 w-auto" />
              <div>
                <span className="font-mono text-sm font-black text-white tracking-widest block">
                  VIKINGS <span className="text-red-500">GYM &amp; SPA</span>
                </span>
                <span className="text-[10px] font-sans font-bold text-gray-400 block tracking-normal">
                  वाइकिंग्स जिम एंड स्पा
                </span>
              </div>
            </div>
            <p className="text-xs text-gray-400 leading-relaxed max-w-xs mb-5">
              एमजी रोड, औरंगाबाद का प्रीमियम कमर्शियल फिटनेस सेंटर एवं मोरक्कन स्टीम स्पा — वीवा फिटनेस मशीनें, ओलंपिक पावरलिफ्टिंग, डांस व योगा।
            </p>
            <div className="flex gap-3">
              <a href={GYM_CONFIG.instagram} target="_blank" rel="noreferrer" aria-label="Vikings on Instagram" className="p-2 bg-neutral-900 hover:bg-neutral-850 rounded text-gray-400 hover:text-white transition-all">
                <Instagram className="w-4 h-4" />
              </a>
              <a href={GYM_CONFIG.facebook} target="_blank" rel="noreferrer" aria-label="Vikings on Facebook" className="p-2 bg-neutral-900 hover:bg-neutral-850 rounded text-gray-400 hover:text-white transition-all">
                <Facebook className="w-4 h-4" />
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
            <h4 className="font-sans text-xs font-black text-white tracking-widest uppercase mb-4">Explore</h4>
            <ul className="grid grid-cols-2 gap-x-4 gap-y-2.5 text-xs font-sans font-medium text-gray-400">
              <li><a href="#manifesto" className="hover:text-red-500 transition-colors">MANIFESTO</a></li>
              <li><a href="#facilities" className="hover:text-red-500 transition-colors">FACILITIES</a></li>
              <li><a href="#arena-action" className="hover:text-red-500 transition-colors">ARENA</a></li>
              <li><a href="#trainers" className="hover:text-red-500 transition-colors">TRAINERS</a></li>
              <li><a href="#ambassador" className="hover:text-red-500 transition-colors">AMBASSADOR</a></li>
              <li><a href="#calculator" className="hover:text-red-500 transition-colors">BMI CALCULATOR</a></li>
              <li><a href="#pricing" className="hover:text-red-500 transition-colors">MEMBERSHIPS</a></li>
              <li><a href="#gallery" className="hover:text-red-500 transition-colors">DAILY STORIES</a></li>
              <li><a href="#faq" className="hover:text-red-500 transition-colors">FAQS</a></li>
              <li><a href="#review" className="hover:text-red-500 transition-colors">REVIEWS</a></li>
              <li><a href="#contact" className="hover:text-red-500 transition-colors">CONTACT</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-sans text-xs font-black text-white tracking-widest uppercase mb-4">Reach the Kingdom</h4>
            <ul className="space-y-2.5 text-xs text-gray-400 font-sans">
              <li>{GYM_CONFIG.address}</li>
              <li>
                <a href={`tel:${GYM_CONFIG.phone}`} className="hover:text-red-500 transition-colors">{GYM_CONFIG.phoneDisplay}</a>
                {" · "}
                <a href={`https://wa.me/${GYM_CONFIG.whatsapp}`} target="_blank" rel="noreferrer" className="hover:text-red-500 transition-colors">WhatsApp</a>
              </li>
              <li>{GYM_CONFIG.hours}</li>
              <li>
                <a href={GYM_CONFIG.instagram} target="_blank" rel="noreferrer" className="hover:text-red-500 transition-colors">@{GYM_CONFIG.instagramHandle}</a>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-6 border-t border-neutral-900 flex flex-col items-center">
          {/* Dedicated Legal Links referencing separate pages */}
          <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-gray-400 mb-4 font-sans font-medium">
            <Link to="/privacy" className="hover:text-red-500 transition-colors">Privacy Policy</Link>
            <span className="text-neutral-700">·</span>
            <Link to="/terms" className="hover:text-red-500 transition-colors">Terms & Conditions</Link>
            <span className="text-neutral-700">·</span>
            <Link to="/cookies" className="hover:text-red-500 transition-colors">Cookies Policy</Link>
          </div>

          <p className="text-xs text-gray-500 font-sans text-center">
            © {new Date().getFullYear()} Vikings Gym & Spa — MG Road, Aurangabad, Bihar. All rights reserved.
          </p>
          <div className="flex items-center justify-center gap-2.5 mt-3">
            <span className="text-[11px] text-gray-500 font-sans">Designed & Developed by</span>
            {/* TODO: link logo to https://accustomlabs.com once the site is live */}
            <img src={devLogo} alt="AC Custom Labs logo" loading="lazy" className="h-5 w-auto" />
          </div>
        </div>
      </footer>

      {/* Full-Screen Functional Cookie Consent Modal for New Visitors */}
      <AnimatePresence>
        {showCookieBanner && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/85 backdrop-blur-xl p-4 sm:p-6 overflow-y-auto"
            style={{ overscrollBehavior: "contain" }}
            onClick={(e) => {
              if (e.target === e.currentTarget) acceptCookies("essential");
            }}
          >
            <motion.div
              initial={{ scale: 0.94, opacity: 0, y: 16 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.94, opacity: 0, y: 16 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-full max-w-lg rounded-3xl shadow-2xl shadow-black/90 my-auto text-left border border-red-950/50 bg-[#0a0a0a]"
            >
              <div className="p-5 sm:p-7 bg-[#0a0a0a] rounded-3xl border border-white/10 flex flex-col gap-4 sm:gap-5">
                {/* Header with Cookie Icon & Title */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-2xl bg-red-600/15 text-red-500 flex items-center justify-center border border-red-600/30 shrink-0 shadow-lg shadow-red-600/10">
                      <Cookie className="w-5 h-5 sm:w-6 sm:h-6" />
                    </div>
                    <div>
                      <span className="text-[10px] sm:text-[11px] font-sans font-bold text-red-500 block uppercase tracking-wider">
                        कुकीज़ और प्रदर्शन प्राथमिकताएँ
                      </span>
                      <h3 className="font-sans text-sm sm:text-base font-black text-white uppercase tracking-tight">
                        COOKIE &amp; EXPERIENCE SETTINGS
                      </h3>
                    </div>
                  </div>
                  <button
                    onClick={() => acceptCookies("essential")}
                    className="text-gray-400 hover:text-white p-1 rounded-lg hover:bg-white/5 transition-colors cursor-pointer"
                    aria-label="Dismiss cookie notice"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Plain, Honest Explanation in Hindi and English */}
                <div className="space-y-2 text-xs sm:text-[13px] text-gray-300 font-sans leading-relaxed">
                  <p>
                    हम वेबसाइट की गति, हाई-डेफिनिशन वर्कआउट वीडियो, और थीम (लाइट/डार्क) प्राथमिकताओं को सुरक्षित रखने के लिए आवश्यक कुकीज़ और स्थानीय ब्राउज़र स्टोरेज का उपयोग करते हैं।
                  </p>
                  <p className="text-gray-400 text-[11px] sm:text-xs">
                    We use localized browser storage and performance cookies to enable ultra-smooth gym video streaming, theme persistence, and rapid facility page loads. No third-party ad tracking.
                  </p>
                </div>

                {/* Direct Benefits Checklist */}
                <div className="grid grid-cols-2 gap-2 pt-0.5">
                  <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/5 flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                    <div className="text-[11px] font-sans">
                      <span className="font-bold text-white block">आवश्यक कुकीज़</span>
                      <span className="text-gray-400 text-[10px]">थीम और वीडियो कैश</span>
                    </div>
                  </div>
                  <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/5 flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-red-400 shrink-0" />
                    <div className="text-[11px] font-sans">
                      <span className="font-bold text-white block">100% सुरक्षित</span>
                      <span className="text-gray-400 text-[10px]">कोई विज्ञापन ट्रैकर नहीं</span>
                    </div>
                  </div>
                </div>

                {/* Functional Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-2.5 pt-1">
                  <button
                    onClick={() => acceptCookies("all")}
                    className="flex-1 py-3 px-5 bg-red-600 hover:bg-red-700 text-black font-sans font-black text-xs sm:text-sm tracking-wider rounded-xl uppercase transition-all shadow-lg shadow-red-600/30 active:scale-95 cursor-pointer text-center"
                  >
                    ALLOW ALL COOKIES (स्वीकार करें)
                  </button>
                  <button
                    onClick={() => acceptCookies("essential")}
                    className="py-3 px-4 bg-neutral-900 hover:bg-neutral-850 border border-neutral-800 hover:border-neutral-700 text-gray-300 hover:text-white font-sans font-bold text-xs rounded-xl uppercase transition-colors active:scale-95 cursor-pointer text-center"
                  >
                    ESSENTIAL ONLY (केवल आवश्यक)
                  </button>
                </div>

                {/* Policy Links */}
                <div className="pt-2 border-t border-white/5 flex flex-wrap items-center justify-between gap-2 text-[11px] font-sans text-gray-400">
                  <Link
                    to="/cookies"
                    onClick={() => acceptCookies("essential")}
                    className="hover:text-red-400 transition-colors underline flex items-center gap-1.5"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    Cookies Policy (विस्तृत नीति)
                  </Link>
                  <Link
                    to="/terms"
                    onClick={() => acceptCookies("essential")}
                    className="hover:text-red-400 transition-colors underline"
                  >
                    Terms &amp; Conditions (नियम व शर्तें)
                  </Link>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
