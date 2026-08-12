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
  Facebook,
  Globe,
  Menu,
  X,
  CreditCard,
  MessageCircle,
  ExternalLink,
  PhoneCall,
  Flame,
  Camera,
  MessageSquare,
  HelpCircle,
  Clock,
  ThumbsUp,
  ShieldCheck,
  CheckCircle2,
  Zap,
  Sparkle
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import logoPremium from "../../assets/l.png";
import { AnimatedMarqueeHero } from "./ui/hero-3";
import DotPattern from "./ui/dot-pattern-1";

interface PublicWebsiteProps {
  onJoinNow: () => void;
  onLoginClick: () => void;
}

export default function PublicWebsite({ onJoinNow, onLoginClick }: PublicWebsiteProps) {
  const { data: plansData } = useQuery({
    queryKey: ['public-plans'],
    queryFn: () => membershipsAPI.getPlans().then(res => res.data.data)
  });

  const { data: trainersData } = useQuery({
    queryKey: ['public-trainers'],
    queryFn: () => trainersAPI.getAll().then(res => res.data.data)
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

  // Razorpay Modal State
  const [selectedPlanForPayment, setSelectedPlanForPayment] = useState<any>(null);
  const [payerName, setPayerName] = useState("");
  const [payerPhone, setPayerPhone] = useState("");
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  // Mobile menu state
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const INSTAGRAM_URL = "https://www.instagram.com/vikings_fitness";
  const MAPS_URL = "https://www.google.com/maps/place/VIKINGS+GYM/@24.7517233,84.3681875,17z/data=!3m1!4b1!4m6!3m5!1s0x398cfdda0d754111:0xf741105a5bcb783d!8m2!3d24.7517185!4d84.3707624!16s%2Fg%2F11vkhs5r5f?entry=ttu&g_ep=EgoyMDI2MDgwOS4wIKXMDSoASAFQAw%3D%3D";
  const WHATSAPP_URL = "https://api.whatsapp.com/send?phone=917764922023&text=Hi%20I%20am%20interested%20in%20your%20fitness%20center.%20Please%20provide%20more%20details.";
  const PHONE_NUMBER = "077649 22023";
  const ADDRESS_TEXT = "Q92C+M8J, MG Rd, Aurangabad, Bihar 824101";

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
    if (franchiseData.name && franchiseData.phone) {
      setFranchiseSubmitted(true);
      setTimeout(() => {
        setFranchiseSubmitted(false);
        setFranchiseOpen(false);
      }, 4000);
    }
  };

  const handleSimulateRazorpayPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (payerName && payerPhone) {
      setPaymentSuccess(true);
      setTimeout(() => {
        setPaymentSuccess(false);
        setSelectedPlanForPayment(null);
        setPayerName("");
        setPayerPhone("");
      }, 4000);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0e070c] via-[#160a13] to-[#0a0509] text-gray-100 font-sans selection:bg-rose-600 selection:text-white relative overflow-x-hidden">
      {/* Floating WhatsApp Quick Action Button */}
      <a
        href={WHATSAPP_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white p-4 rounded-full shadow-2xl shadow-emerald-950/80 flex items-center justify-center transition-all hover:scale-110 group cursor-pointer border border-emerald-400/40"
        title="Chat on WhatsApp"
      >
        <MessageCircle className="w-6 h-6 fill-current animate-bounce" />
        <span className="max-w-0 overflow-hidden whitespace-nowrap group-hover:max-w-xs transition-all duration-300 font-mono text-xs font-bold pl-0 group-hover:pl-2">
          WHATSAPP INQUIRY
        </span>
      </a>

      {/* Top Vibrant Announcement Header Bar */}
      <header className="border-b border-rose-950/40 bg-black/80 backdrop-blur-xl sticky top-0 z-40">
        <div className="bg-gradient-to-r from-rose-950/60 via-purple-950/40 to-amber-950/50 border-b border-rose-900/30 px-6 py-2 text-xs font-mono text-gray-300 flex justify-between items-center max-w-7xl mx-auto">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-rose-400 font-bold">
              <MapPin className="w-3.5 h-3.5 text-rose-500" /> MG Rd, Aurangabad, Bihar 824101
            </span>
            <span className="hidden sm:inline text-rose-900">•</span>
            <span className="hidden sm:flex items-center gap-1.5 text-amber-400 font-bold bg-amber-500/10 px-2.5 py-0.5 rounded border border-amber-500/30">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" /> 4.4 / 5.0 (27 Google Reviews)
            </span>
          </div>

          <div className="flex items-center gap-4">
            <a href={`tel:07764922023`} className="hover:text-emerald-400 flex items-center gap-1.5 text-emerald-400 font-bold">
              <PhoneCall className="w-3.5 h-3.5" /> {PHONE_NUMBER}
            </a>
            <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" className="hover:text-pink-300 flex items-center gap-1.5 text-pink-400 font-bold bg-gradient-to-r from-purple-500/20 to-pink-500/20 px-2.5 py-0.5 rounded border border-pink-500/30">
              <Instagram className="w-3.5 h-3.5 text-pink-400" /> @vikings_fitness
            </a>
          </div>
        </div>

        {/* Main Navbar */}
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3.5 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <img src={logoPremium} alt="Vikings Logo" className="h-10 w-auto filter drop-shadow-[0_0_8px_rgba(244,63,94,0.4)]" />
            <div>
              <span className="font-mono text-xl font-black tracking-widest text-white block">
                VIKINGS <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-500 via-red-500 to-amber-500">GYM & SPA</span>
              </span>
              <span className="text-[10px] font-mono text-rose-400/80 tracking-widest block -mt-1 uppercase font-bold">LUXURY FITNESS KINGDOM</span>
            </div>
          </div>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-7 font-mono text-xs tracking-wider uppercase font-bold">
            <a href="#services" className="text-gray-300 hover:text-rose-400 transition-colors">SERVICES</a>
            <a href="#about" className="text-gray-300 hover:text-rose-400 transition-colors">ABOUT & MAPS</a>
            <a href="#pricing" className="text-gray-300 hover:text-rose-400 transition-colors">PACKAGES</a>
            <a href="#reviews" className="text-gray-300 hover:text-amber-400 transition-colors flex items-center gap-1">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" /> REVIEWS
            </a>
            <a href="#trainers" className="text-gray-300 hover:text-rose-400 transition-colors">TRAINERS</a>
            <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" className="text-pink-400 hover:text-pink-300 transition-colors flex items-center gap-1">
              <Instagram className="w-3.5 h-3.5" /> INSTAGRAM
            </a>
          </nav>

          <div className="hidden lg:flex items-center gap-3">
            <button
              onClick={onLoginClick}
              className="bg-neutral-900 hover:bg-neutral-850 border border-rose-950 text-white font-mono text-xs font-bold px-4 py-2.5 rounded-lg transition-all cursor-pointer hover:border-rose-600"
            >
              CLIENT LOGIN
            </button>
            <button
              onClick={onJoinNow}
              className="bg-gradient-to-r from-rose-600 via-red-600 to-rose-700 hover:from-rose-500 hover:to-red-600 text-white font-mono font-black text-xs px-5 py-2.5 rounded-lg transition-all cursor-pointer shadow-lg shadow-rose-950/60 uppercase border border-rose-500/40"
            >
              JOIN THE KINGDOM
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden text-white p-2"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6 text-rose-500" /> : <Menu className="w-6 h-6 text-white" />}
          </button>
        </div>

        {/* Mobile Dropdown Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden bg-neutral-950/95 border-b border-rose-950 px-6 py-5 space-y-4 font-mono text-xs uppercase font-bold">
            <a href="#services" onClick={() => setIsMobileMenuOpen(false)} className="block text-gray-300 py-1">SERVICES</a>
            <a href="#about" onClick={() => setIsMobileMenuOpen(false)} className="block text-gray-300 py-1">ABOUT & MAPS</a>
            <a href="#pricing" onClick={() => setIsMobileMenuOpen(false)} className="block text-gray-300 py-1">PACKAGES</a>
            <a href="#reviews" onClick={() => setIsMobileMenuOpen(false)} className="block text-amber-400 py-1 flex items-center gap-1">
              <Star className="w-3.5 h-3.5 fill-amber-400" /> GOOGLE REVIEWS
            </a>
            <a href="#trainers" onClick={() => setIsMobileMenuOpen(false)} className="block text-gray-300 py-1">TRAINERS</a>
            <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" className="block text-pink-400 py-1 flex items-center gap-1">
              <Instagram className="w-3.5 h-3.5" /> INSTAGRAM PAGE
            </a>
            <div className="pt-2 flex flex-col gap-2.5">
              <button onClick={() => { setIsMobileMenuOpen(false); onLoginClick(); }} className="w-full bg-neutral-900 text-white py-3 rounded-lg font-bold border border-rose-950">
                CLIENT LOGIN
              </button>
              <button onClick={() => { setIsMobileMenuOpen(false); onJoinNow(); }} className="w-full bg-gradient-to-r from-rose-600 to-red-600 text-white py-3 rounded-lg font-black shadow-lg">
                JOIN NOW
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-rose-950/30">
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[800px] h-[350px] bg-rose-600/15 rounded-full blur-[140px] pointer-events-none" />
        <DotPattern className="opacity-30" />
        <AnimatedMarqueeHero
          onJoinNow={onJoinNow}
          onExplorePlans={() => {
            const el = document.getElementById("pricing");
            if (el) el.scrollIntoView({ behavior: "smooth" });
          }}
        />
      </section>

      {/* Portal Services Quick Directory Grid (10 Vibrant Colorful Cards) */}
      <section id="services" className="py-20 px-6 max-w-7xl mx-auto border-b border-rose-950/30 relative">
        <div className="text-center mb-12">
          <span className="text-rose-400 font-mono text-xs tracking-widest uppercase font-bold mb-2 inline-block bg-rose-600/10 px-3 py-1 rounded border border-rose-900/40">
            QUICK PORTAL DIRECTORY
          </span>
          <h2 className="text-3xl md:text-4xl font-sans font-black text-white uppercase tracking-tight mt-2">
            EXPLORE VIKINGS SERVICES & PORTAL MODULES
          </h2>
          <div className="w-20 h-1.5 bg-gradient-to-r from-rose-600 via-red-500 to-amber-500 mx-auto mt-4 rounded-full"></div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 font-mono">
          {/* Quick Item 1: Enquiry */}
          <a href="#contact" className="bg-gradient-to-br from-neutral-900/90 to-rose-950/30 hover:to-rose-900/40 border border-rose-900/40 hover:border-rose-500/60 p-5 rounded-2xl space-y-2.5 transition-all duration-300 hover:-translate-y-1.5 shadow-xl hover:shadow-rose-950/50 group">
            <div className="bg-rose-600/20 text-rose-400 p-3 rounded-xl w-fit group-hover:scale-110 transition-transform shadow-inner">
              <HelpCircle className="w-6 h-6" />
            </div>
            <h4 className="text-white text-xs font-black uppercase">Enquiry</h4>
            <p className="text-[11px] text-gray-400 leading-tight">Get to know packages & rates</p>
          </a>

          {/* Quick Item 2: Client Login */}
          <button onClick={onLoginClick} className="bg-gradient-to-br from-neutral-900/90 to-emerald-950/30 hover:to-emerald-900/40 border border-emerald-900/40 hover:border-emerald-500/60 p-5 rounded-2xl space-y-2.5 transition-all duration-300 hover:-translate-y-1.5 shadow-xl hover:shadow-emerald-950/50 group text-left cursor-pointer">
            <div className="bg-emerald-600/20 text-emerald-400 p-3 rounded-xl w-fit group-hover:scale-110 transition-transform shadow-inner">
              <UserCheck className="w-6 h-6" />
            </div>
            <h4 className="text-white text-xs font-black uppercase">Client Login</h4>
            <p className="text-[11px] text-gray-400 leading-tight">Access workout logs & billing</p>
          </button>

          {/* Quick Item 3: Book PT Sessions */}
          <a href="#pricing" className="bg-gradient-to-br from-neutral-900/90 to-amber-950/30 hover:to-amber-900/40 border border-amber-900/40 hover:border-amber-500/60 p-5 rounded-2xl space-y-2.5 transition-all duration-300 hover:-translate-y-1.5 shadow-xl hover:shadow-amber-950/50 group">
            <div className="bg-amber-600/20 text-amber-400 p-3 rounded-xl w-fit group-hover:scale-110 transition-transform shadow-inner">
              <Dumbbell className="w-6 h-6" />
            </div>
            <h4 className="text-white text-xs font-black uppercase">Book PT Sessions</h4>
            <p className="text-[11px] text-gray-400 leading-tight">1-on-1 certified coaching</p>
          </a>

          {/* Quick Item 4: Packages */}
          <a href="#pricing" className="bg-gradient-to-br from-neutral-900/90 to-blue-950/30 hover:to-blue-900/40 border border-blue-900/40 hover:border-blue-500/60 p-5 rounded-2xl space-y-2.5 transition-all duration-300 hover:-translate-y-1.5 shadow-xl hover:shadow-blue-950/50 group">
            <div className="bg-blue-600/20 text-blue-400 p-3 rounded-xl w-fit group-hover:scale-110 transition-transform shadow-inner">
              <Award className="w-6 h-6" />
            </div>
            <h4 className="text-white text-xs font-black uppercase">Packages</h4>
            <p className="text-[11px] text-gray-400 leading-tight">Find plans tailored for you</p>
          </a>

          {/* Quick Item 5: Photo Gallery */}
          <a href="#about" className="bg-gradient-to-br from-neutral-900/90 to-purple-950/30 hover:to-purple-900/40 border border-purple-900/40 hover:border-purple-500/60 p-5 rounded-2xl space-y-2.5 transition-all duration-300 hover:-translate-y-1.5 shadow-xl hover:shadow-purple-950/50 group">
            <div className="bg-purple-600/20 text-purple-400 p-3 rounded-xl w-fit group-hover:scale-110 transition-transform shadow-inner">
              <Camera className="w-6 h-6" />
            </div>
            <h4 className="text-white text-xs font-black uppercase">Facility Tour</h4>
            <p className="text-[11px] text-gray-400 leading-tight">Explore gym & spa chambers</p>
          </a>

          {/* Quick Item 6: Trainers */}
          <a href="#trainers" className="bg-gradient-to-br from-neutral-900/90 to-pink-950/30 hover:to-pink-900/40 border border-pink-900/40 hover:border-pink-500/60 p-5 rounded-2xl space-y-2.5 transition-all duration-300 hover:-translate-y-1.5 shadow-xl hover:shadow-pink-950/50 group">
            <div className="bg-pink-600/20 text-pink-400 p-3 rounded-xl w-fit group-hover:scale-110 transition-transform shadow-inner">
              <Users className="w-6 h-6" />
            </div>
            <h4 className="text-white text-xs font-black uppercase">Trainers</h4>
            <p className="text-[11px] text-gray-400 leading-tight">Meet certified master coaches</p>
          </a>

          {/* Quick Item 7: Reviews */}
          <a href="#reviews" className="bg-gradient-to-br from-neutral-900/90 to-yellow-950/30 hover:to-yellow-900/40 border border-yellow-900/40 hover:border-yellow-500/60 p-5 rounded-2xl space-y-2.5 transition-all duration-300 hover:-translate-y-1.5 shadow-xl hover:shadow-yellow-950/50 group">
            <div className="bg-yellow-500/20 text-yellow-400 p-3 rounded-xl w-fit group-hover:scale-110 transition-transform shadow-inner">
              <Star className="w-6 h-6 fill-yellow-400" />
            </div>
            <h4 className="text-white text-xs font-black uppercase">Google Reviews</h4>
            <p className="text-[11px] text-yellow-400 font-bold leading-tight">4.4 ⭐ (27 Reviews)</p>
          </a>

          {/* Quick Item 8: Instagram */}
          <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" className="bg-gradient-to-br from-neutral-900/90 to-rose-950/40 hover:to-rose-900/50 border border-rose-800/40 hover:border-pink-500/60 p-5 rounded-2xl space-y-2.5 transition-all duration-300 hover:-translate-y-1.5 shadow-xl hover:shadow-pink-950/50 group">
            <div className="bg-gradient-to-tr from-purple-600 to-pink-600 text-white p-3 rounded-xl w-fit group-hover:scale-110 transition-transform shadow-lg">
              <Instagram className="w-6 h-6" />
            </div>
            <h4 className="text-white text-xs font-black uppercase">Instagram</h4>
            <p className="text-[11px] text-pink-400 font-bold leading-tight">@vikings_fitness</p>
          </a>

          {/* Quick Item 9: Google Directions */}
          <a href={MAPS_URL} target="_blank" rel="noopener noreferrer" className="bg-gradient-to-br from-neutral-900/90 to-cyan-950/30 hover:to-cyan-900/40 border border-cyan-900/40 hover:border-cyan-500/60 p-5 rounded-2xl space-y-2.5 transition-all duration-300 hover:-translate-y-1.5 shadow-xl hover:shadow-cyan-950/50 group">
            <div className="bg-cyan-600/20 text-cyan-400 p-3 rounded-xl w-fit group-hover:scale-110 transition-transform shadow-inner">
              <Compass className="w-6 h-6" />
            </div>
            <h4 className="text-white text-xs font-black uppercase">Google Maps</h4>
            <p className="text-[11px] text-cyan-400 font-bold leading-tight">Get live directions</p>
          </a>

          {/* Quick Item 10: Call Support */}
          <a href={`tel:07764922023`} className="bg-gradient-to-br from-neutral-900/90 to-teal-950/30 hover:to-teal-900/40 border border-teal-900/40 hover:border-teal-500/60 p-5 rounded-2xl space-y-2.5 transition-all duration-300 hover:-translate-y-1.5 shadow-xl hover:shadow-teal-950/50 group">
            <div className="bg-teal-600/20 text-teal-400 p-3 rounded-xl w-fit group-hover:scale-110 transition-transform shadow-inner">
              <PhoneCall className="w-6 h-6" />
            </div>
            <h4 className="text-white text-xs font-black uppercase">Call Desk</h4>
            <p className="text-[11px] text-teal-400 font-bold leading-tight">077649 22023</p>
          </a>
        </div>
      </section>

      {/* About & Location Details (Google Maps & Official Listing) */}
      <section id="about" className="py-24 px-6 max-w-7xl mx-auto border-b border-rose-950/30 relative">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-rose-600/20 to-red-600/20 border border-rose-500/40 px-3.5 py-1.5 rounded-full text-rose-400 font-mono text-xs font-bold uppercase shadow-inner">
              <MapPin className="w-4 h-4 text-rose-500" /> OFFICIAL GYM LISTING & LOCATION
            </div>

            <h2 className="text-3xl md:text-5xl font-sans font-black text-white uppercase tracking-tight">
              VIKINGS GYM & SPA <span className="text-rose-500 block text-2xl font-mono mt-1">(वाइकिंग्स जिम)</span>
            </h2>

            <p className="text-gray-300 text-sm md:text-base leading-relaxed">
              Vikings Gym & Spa is Aurangabad's premiere luxury fitness center, equipped with heavy strength machinery, steam & spa chambers, certified master trainers, and customized group exercise schedules.
            </p>

            <div className="bg-gradient-to-br from-neutral-900/90 to-rose-950/40 border border-rose-900/40 p-6 rounded-2xl space-y-4 font-mono text-xs shadow-xl">
              <div className="flex items-start gap-3.5">
                <MapPin className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
                <div>
                  <span className="text-gray-400 block uppercase font-bold">ADDRESS:</span>
                  <span className="text-white font-bold text-sm">{ADDRESS_TEXT}</span>
                </div>
              </div>

              <div className="flex items-start gap-3.5 border-t border-rose-900/20 pt-3">
                <Clock className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <span className="text-gray-400 block uppercase font-bold">OPERATING HOURS:</span>
                  <span className="text-emerald-400 font-bold text-sm">Monday – Saturday: 5:00 AM – 10:00 PM</span>
                  <span className="text-rose-400 block font-bold">Sunday: Closed</span>
                </div>
              </div>

              <div className="flex items-start gap-3.5 border-t border-rose-900/20 pt-3">
                <Phone className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <span className="text-gray-400 block uppercase font-bold">PHONE / WHATSAPP:</span>
                  <a href="tel:07764922023" className="text-amber-400 font-black text-sm hover:underline">{PHONE_NUMBER}</a>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-4 pt-2">
              <a
                href={MAPS_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-gradient-to-r from-rose-600 via-red-600 to-rose-700 hover:from-rose-500 hover:to-red-600 text-white font-mono font-black text-xs px-6 py-3.5 rounded-xl flex items-center gap-2 transition-all shadow-xl shadow-rose-950/60 uppercase border border-rose-500/40"
              >
                <Compass className="w-4 h-4" /> GET GOOGLE MAPS DIRECTIONS
              </a>
              <a
                href={INSTAGRAM_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-mono font-bold text-xs px-6 py-3.5 rounded-xl flex items-center gap-2 transition-all shadow-xl uppercase border border-pink-400/40"
              >
                <Instagram className="w-4 h-4" /> FOLLOW ON INSTAGRAM
              </a>
            </div>
          </div>

          {/* Interactive Full-Color Google Maps View */}
          <div className="bg-gradient-to-br from-neutral-900 to-rose-950/40 border border-rose-900/50 p-2.5 rounded-2xl shadow-2xl relative overflow-hidden h-[420px]">
            <iframe
              title="Vikings Gym Google Map"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3738.167389278912!2d84.3681875!3d24.7517233!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x398cfdda0d754111%3A0xf741105a5bcb783d!2sVIKINGS%20GYM!5e0!3m2!1sen!2sin!4v1710000000000!5m2!1sen!2sin"
              className="w-full h-full rounded-xl border-0 shadow-inner"
              loading="lazy"
              allowFullScreen
            />
          </div>
        </div>
      </section>

      {/* Membership Tiers & Pricing with Razorpay Payment Integration */}
      <section id="pricing" className="py-24 px-6 max-w-7xl mx-auto border-b border-rose-950/30 relative">
        <div className="text-center mb-16">
          <span className="text-rose-400 font-mono text-xs tracking-widest uppercase font-bold mb-2 inline-block bg-rose-600/10 px-3 py-1 rounded border border-rose-900/40">
            SHIELD WALL SUBSCRIPTIONS
          </span>
          <h2 className="text-3xl md:text-4xl font-sans font-black text-white uppercase tracking-tight mt-2">
            MEMBERSHIP PLANS & RAZORPAY PAYMENT
          </h2>
          <div className="w-20 h-1.5 bg-gradient-to-r from-rose-600 via-red-500 to-amber-500 mx-auto mt-4 rounded-full"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {plansData && plansData.map((plan: any, index: number) => {
            const isPopular = plan.popular;
            return (
              <div
                key={index}
                className={`bg-gradient-to-b ${
                  isPopular 
                    ? "from-neutral-900/90 via-rose-950/50 to-neutral-900/90 border-rose-500 shadow-2xl shadow-rose-950/80 scale-105" 
                    : "from-neutral-900/60 to-neutral-950/80 border-rose-950/50 hover:border-rose-900/70"
                } rounded-2xl relative border p-6 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1`}
              >
                {isPopular && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-rose-600 to-red-600 text-white text-[10px] font-mono font-black py-1 px-3.5 rounded-full uppercase tracking-wider shadow-lg border border-rose-400/40">
                    MOST POPULAR
                  </div>
                )}

                <div>
                  <h3 className="text-white font-sans font-black text-xl mb-2">{plan.name}</h3>
                  <p className="text-gray-300 text-xs leading-normal mb-5 min-h-[36px]">{plan.desc}</p>

                  <div className="mb-6 pb-6 border-b border-rose-900/30">
                    <span className="text-3xl font-mono font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-100 to-rose-200">{plan.price}</span>
                    <span className="text-xs text-rose-400 font-mono block mt-1 font-bold">{plan.period}</span>
                  </div>

                  <ul className="space-y-3.5 mb-8">
                    {Array.isArray(plan.features) ? plan.features.map((f: string, i: number) => (
                      <li key={i} className="flex gap-2.5 items-start text-xs text-gray-200">
                        <CheckCircle className="w-4 h-4 text-rose-500 shrink-0 select-none mt-0.5" />
                        <span>{f}</span>
                      </li>
                    )) : (
                      <li className="flex gap-2.5 items-start text-xs text-gray-200">
                        <CheckCircle className="w-4 h-4 text-rose-500 shrink-0 select-none mt-0.5" />
                        <span>{plan.features || plan.desc}</span>
                      </li>
                    )}
                  </ul>
                </div>

                <div className="space-y-2">
                  <button
                    onClick={() => setSelectedPlanForPayment(plan)}
                    className={`w-full py-3.5 rounded-xl font-mono font-black text-xs tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer uppercase shadow-lg ${
                      isPopular
                        ? "bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-black border border-emerald-400/40"
                        : "bg-neutral-900 hover:bg-neutral-850 text-emerald-400 border border-emerald-900/60 hover:border-emerald-500"
                    }`}
                  >
                    <CreditCard className="w-4 h-4" /> PAY WITH RAZORPAY
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Google Reviews & Member Testimonials Section */}
      <section id="reviews" className="py-24 px-6 max-w-7xl mx-auto border-b border-rose-950/30 relative">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500/20 to-yellow-500/20 border border-amber-500/40 px-4 py-1.5 rounded-full text-amber-400 font-mono text-xs font-bold uppercase mb-3 shadow-inner">
            <Star className="w-4 h-4 fill-amber-400 text-amber-400" /> GOOGLE MAPS RATING: 4.4 / 5.0 (27 REVIEWS)
          </div>
          <h2 className="text-3xl md:text-4xl font-sans font-black text-white uppercase tracking-tight mt-2">
            WARRIOR REVIEWS & TESTIMONIALS
          </h2>
          <div className="w-20 h-1.5 bg-gradient-to-r from-amber-500 via-rose-500 to-red-600 mx-auto mt-4 rounded-full"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Review 1 */}
          <div className="bg-gradient-to-b from-neutral-900/80 to-neutral-950/90 border border-amber-900/30 p-6 rounded-2xl space-y-4 shadow-xl">
            <div className="flex items-center justify-between">
              <div className="flex text-amber-400 gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <span className="text-[10px] font-mono bg-amber-500/10 text-amber-400 px-2 py-0.5 rounded border border-amber-500/30 font-bold">Google Verified</span>
            </div>
            <p className="text-xs text-gray-200 leading-relaxed italic">
              "Best gym in Aurangabad! Excellent equipment, helpful certified trainers, and clean steam spa facilities. The digital QR pass check-in makes everyday access so smooth."
            </p>
            <div className="flex items-center gap-3 pt-3 border-t border-neutral-850">
              <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-rose-600 to-red-500 text-white font-mono font-bold text-xs flex items-center justify-center shadow">
                RK
              </div>
              <div>
                <span className="text-xs font-bold text-white block">Rahul Kumar</span>
                <span className="text-[10px] text-gray-400 font-mono">Member for 1 Year</span>
              </div>
            </div>
          </div>

          {/* Review 2 */}
          <div className="bg-gradient-to-b from-neutral-900/80 to-neutral-950/90 border border-amber-900/30 p-6 rounded-2xl space-y-4 shadow-xl">
            <div className="flex items-center justify-between">
              <div className="flex text-amber-400 gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <span className="text-[10px] font-mono bg-amber-500/10 text-amber-400 px-2 py-0.5 rounded border border-amber-500/30 font-bold">Google Verified</span>
            </div>
            <p className="text-xs text-gray-200 leading-relaxed italic">
              "Awesome workout environment! The personal trainers provide customized diet plans and heavy lifting protocols. Highly recommended for fitness enthusiasts in Aurangabad."
            </p>
            <div className="flex items-center gap-3 pt-3 border-t border-neutral-850">
              <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-purple-600 to-pink-500 text-white font-mono font-bold text-xs flex items-center justify-center shadow">
                PS
              </div>
              <div>
                <span className="text-xs font-bold text-white block">Priya Sharma</span>
                <span className="text-[10px] text-gray-400 font-mono">VIP Spa Member</span>
              </div>
            </div>
          </div>

          {/* Review 3 */}
          <div className="bg-gradient-to-b from-neutral-900/80 to-neutral-950/90 border border-amber-900/30 p-6 rounded-2xl space-y-4 shadow-xl">
            <div className="flex items-center justify-between">
              <div className="flex text-amber-400 gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <span className="text-[10px] font-mono bg-amber-500/10 text-amber-400 px-2 py-0.5 rounded border border-amber-500/30 font-bold">Google Verified</span>
            </div>
            <p className="text-xs text-gray-200 leading-relaxed italic">
              "Great location on MG Road, Aurangabad. Huge space, quality dumbell rack up to 50kg, and supportive management team. 10/10 experience!"
            </p>
            <div className="flex items-center gap-3 pt-3 border-t border-neutral-850">
              <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-blue-600 to-cyan-500 text-white font-mono font-bold text-xs flex items-center justify-center shadow">
                VD
              </div>
              <div>
                <span className="text-xs font-bold text-white block">Vikram Deshmukh</span>
                <span className="text-[10px] text-gray-400 font-mono">Berserker Plan</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 text-center">
          <a
            href={MAPS_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500/20 to-yellow-500/20 hover:from-amber-500/30 hover:to-yellow-500/30 text-amber-400 border border-amber-500/40 font-mono font-bold text-xs px-6 py-3.5 rounded-xl transition-all shadow-lg"
          >
            <Star className="w-4 h-4 fill-amber-400" /> LEAVE A GOOGLE MAPS REVIEW →
          </a>
        </div>
      </section>

      {/* Master Coaches Showcase */}
      <section id="trainers" className="py-24 px-6 max-w-7xl mx-auto border-b border-rose-950/30 relative">
        <div className="text-center mb-16">
          <span className="text-rose-400 font-mono text-xs tracking-widest uppercase font-bold mb-2 inline-block bg-rose-600/10 px-3 py-1 rounded border border-rose-900/40">
            ELITE VALKYRIES & BERSERKERS
          </span>
          <h2 className="text-3xl md:text-4xl font-sans font-black text-white uppercase tracking-tight mt-2">
            MEET YOUR MASTER COACHES
          </h2>
          <div className="w-20 h-1.5 bg-gradient-to-r from-rose-600 via-red-500 to-amber-500 mx-auto mt-4 rounded-full"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-4xl mx-auto">
          {trainersData && trainersData.map((t: any, idx: number) => (
            <div key={idx} className="bg-gradient-to-b from-neutral-900/80 to-neutral-950/90 border border-rose-900/40 rounded-2xl overflow-hidden flex flex-col md:flex-row group hover:border-rose-600/70 transition-all duration-300 shadow-xl">
              <div className="md:w-2/5 h-64 md:h-auto bg-neutral-900 shrink-0">
                {t.photoUrl ? (
                  <img src={t.photoUrl} alt={t.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-neutral-800 to-neutral-900 flex items-center justify-center">
                    <span className="text-rose-500 font-mono text-4xl font-black">{t.name ? t.name.charAt(0) : '?'}</span>
                  </div>
                )}
              </div>
              <div className="md:w-3/5 p-6 flex flex-col justify-between space-y-4">
                <div>
                  <div className="text-xs font-mono font-bold text-rose-400 mb-1">{t.role}</div>
                  <h3 className="text-xl font-bold text-white mb-2">{t.name}</h3>
                  <div className="font-mono text-[10px] text-gray-400 mb-3">{t.years}</div>
                  <p className="text-gray-300 text-xs leading-relaxed">{t.desc}</p>
                </div>

                <div className="flex flex-wrap gap-1.5 pt-3 border-t border-neutral-850">
                  {Array.isArray(t.cert) ? t.cert.map((c: string, i: number) => (
                    <span key={i} className="text-[9px] font-mono bg-rose-600/10 text-rose-300 px-2.5 py-0.5 rounded border border-rose-900/40">
                      {c}
                    </span>
                  )) : t.cert ? (
                    <span className="text-[9px] font-mono bg-rose-600/10 text-rose-300 px-2.5 py-0.5 rounded border border-rose-900/40">
                      {t.cert}
                    </span>
                  ) : null}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Contact & Inquiry Section */}
      <section id="contact" className="py-24 px-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          <div>
            <span className="text-rose-400 font-mono text-xs tracking-widest uppercase block mb-2 font-bold">VISIT THE KINGDOM</span>
            <h2 className="text-3xl font-sans font-black text-white uppercase tracking-tight mb-6">
              LOCATION & OPERATING DETAILS
            </h2>
            <p className="text-gray-300 text-sm md:text-base leading-relaxed mb-8">
              We stand prepared for your visit at our premiere Aurangabad branch. Drop in for a high-fidelity physical facility tour, experience our cold spa chambers, and enjoy a pre-workout beverage inside our supplements cafe.
            </p>

            <div className="space-y-6 font-mono text-xs">
              <div className="flex items-start gap-4">
                <MapPin className="w-5 h-5 text-rose-500 mt-1 shrink-0" />
                <div>
                  <h4 className="text-white text-sm font-bold uppercase mb-1">HQ BRANCH ADDRESS:</h4>
                  <p className="text-xs text-gray-300 font-bold">
                    {ADDRESS_TEXT}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <Phone className="w-5 h-5 text-amber-400 mt-1 shrink-0" />
                <div>
                  <h4 className="text-white text-sm font-bold uppercase mb-1">DIRECT INQUIRIES:</h4>
                  <p className="text-xs text-amber-400 font-bold">
                    Direct Ph: {PHONE_NUMBER} | Email: ritwik014017@gmail.com
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <Calendar className="w-5 h-5 text-emerald-400 mt-1 shrink-0" />
                <div>
                  <h4 className="text-white text-sm font-bold uppercase mb-1">WARRIORS DOCTRINE TIMINGS:</h4>
                  <p className="text-xs text-emerald-400 font-bold leading-relaxed">
                    Monday - Saturday: 05:00 AM to 10:00 PM <br />
                    Sunday: Closed
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-b from-neutral-900/90 to-rose-950/40 border border-rose-900/50 rounded-2xl p-8 backdrop-blur-md shadow-2xl">
            <h3 className="text-lg font-mono font-bold text-white mb-6 uppercase flex items-center gap-2">
              <Compass className="text-rose-500 w-5 h-5" /> EXPEDITE GUEST INQUIRY
            </h3>

            {contactSubmitted ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-emerald-500/10 border border-emerald-900/50 p-6 rounded-xl text-center space-y-2"
              >
                <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
                <h4 className="text-white font-mono font-bold text-sm uppercase">MESSAGE TRANSMITTED</h4>
                <p className="text-xs text-emerald-400 font-mono">
                  A front desk assistant from Vikings Gym Aurangabad will contact you shortly on {contactPhone}. Prepare your shields!
                </p>
              </motion.div>
            ) : (
              <form onSubmit={handleContactSubmit} className="space-y-4 font-mono text-xs">
                <div>
                  <label className="block text-gray-300 mb-1.5 uppercase font-bold">Full Name</label>
                  <input
                    type="text"
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-800 px-4 py-3 rounded-xl text-white text-xs focus:border-rose-500 focus:outline-none"
                    placeholder="e.g. Rahul Kumar"
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-300 mb-1.5 uppercase font-bold">Phone Number</label>
                  <input
                    type="tel"
                    value={contactPhone}
                    onChange={(e) => setContactPhone(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-800 px-4 py-3 rounded-xl text-white text-xs focus:border-rose-500 focus:outline-none"
                    placeholder="e.g. +91 77649XXXXX"
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-300 mb-1.5 uppercase font-bold">Message / Inquiry Details</label>
                  <textarea
                    rows={3}
                    value={contactMessage}
                    onChange={(e) => setContactMessage(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-800 px-4 py-3 rounded-xl text-white text-xs focus:border-rose-500 focus:outline-none"
                    placeholder="Inquire about PT sessions, memberships..."
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white py-3.5 rounded-xl font-mono font-black text-xs tracking-widest transition-all cursor-pointer uppercase shadow-lg border border-rose-400/30"
                >
                  DISPATCH INQUIRY
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* RAZORPAY PAYMENT MODAL */}
      {selectedPlanForPayment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-md bg-neutral-950 border border-emerald-900/60 p-6 rounded-2xl shadow-2xl relative font-mono"
          >
            <button
              onClick={() => setSelectedPlanForPayment(null)}
              className="absolute right-4 top-4 text-gray-400 hover:text-white text-sm font-bold"
            >
              ✕
            </button>

            <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs uppercase mb-1">
              <CreditCard className="w-4 h-4" /> RAZORPAY PAYMENT GATEWAY
            </div>
            <h3 className="text-xl font-black text-white uppercase mb-2">{selectedPlanForPayment.name}</h3>
            <p className="text-xs text-gray-300 mb-4">{selectedPlanForPayment.desc}</p>

            <div className="bg-neutral-900 border border-neutral-850 p-4 rounded-xl space-y-2 mb-6 text-xs">
              <div className="flex justify-between">
                <span className="text-gray-400">PLAN DURATION:</span>
                <span className="text-white font-bold">{selectedPlanForPayment.period}</span>
              </div>
              <div className="flex justify-between border-t border-neutral-800 pt-2">
                <span className="text-gray-400">TOTAL AMOUNT:</span>
                <span className="text-emerald-400 font-black text-lg">{selectedPlanForPayment.price}</span>
              </div>
            </div>

            {/* Directions Steps */}
            <div className="bg-emerald-950/30 border border-emerald-900/50 p-4 rounded-xl space-y-2 text-xs text-gray-300 mb-6">
              <span className="font-bold text-emerald-400 block uppercase">HOW TO COMPLETE PAYMENT:</span>
              <ol className="list-decimal list-inside space-y-1 text-gray-300">
                <li>Enter your full name and phone number below.</li>
                <li>Click <strong>Proceed to Razorpay Checkout</strong>.</li>
                <li>Pay via UPI, Credit/Debit Card, or Netbanking.</li>
              </ol>
            </div>

            {paymentSuccess ? (
              <div className="bg-emerald-500/10 border border-emerald-900/50 p-5 rounded-xl text-center space-y-2">
                <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
                <h4 className="text-white font-bold text-sm">PAYMENT SUCCESSFUL!</h4>
                <p className="text-xs text-emerald-400">Your membership pass has been generated. Login to access your QR pass.</p>
              </div>
            ) : (
              <form onSubmit={handleSimulateRazorpayPayment} className="space-y-4 text-xs">
                <div>
                  <label className="block text-gray-300 mb-1 uppercase font-bold">Member Name</label>
                  <input
                    type="text"
                    value={payerName}
                    onChange={(e) => setPayerName(e.target.value)}
                    required
                    className="w-full bg-neutral-900 border border-neutral-850 px-3.5 py-2.5 rounded-xl text-white focus:border-emerald-500 focus:outline-none"
                    placeholder="Enter your name"
                  />
                </div>

                <div>
                  <label className="block text-gray-300 mb-1 uppercase font-bold">Phone Number</label>
                  <input
                    type="tel"
                    value={payerPhone}
                    onChange={(e) => setPayerPhone(e.target.value)}
                    required
                    className="w-full bg-neutral-900 border border-neutral-850 px-3.5 py-2.5 rounded-xl text-white focus:border-emerald-500 focus:outline-none"
                    placeholder="Enter phone number"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-black font-black py-3.5 rounded-xl transition-all uppercase flex items-center justify-center gap-2 cursor-pointer shadow-lg border border-emerald-400/40"
                >
                  <CreditCard className="w-4 h-4" /> PROCEED TO RAZORPAY CHECKOUT
                </button>
              </form>
            )}
          </motion.div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-neutral-950/90 border-t border-rose-950/30 px-6 py-12 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-3">
            <img src={logoPremium} alt="Vikings Logo" className="h-8 w-auto" />
            <span className="font-mono text-sm font-black text-white tracking-widest">
              VIKINGS <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-500 to-amber-500">GYM & SPA</span>
            </span>
          </div>

          <p className="text-xs text-gray-400 font-mono text-center md:text-left">
            © 2026 Vikings Gym & Spa - MG Road Aurangabad. All rights reserved.
          </p>

          <div className="flex gap-4">
            <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" className="p-2.5 bg-neutral-900 hover:bg-neutral-850 rounded-xl text-pink-400 hover:text-pink-300 transition-all border border-pink-500/20">
              <Instagram className="w-4 h-4" />
            </a>
            <a href={MAPS_URL} target="_blank" rel="noopener noreferrer" className="p-2.5 bg-neutral-900 hover:bg-neutral-850 rounded-xl text-cyan-400 hover:text-cyan-300 transition-all border border-cyan-500/20">
              <MapPin className="w-4 h-4" />
            </a>
            <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="p-2.5 bg-neutral-900 hover:bg-neutral-850 rounded-xl text-emerald-400 hover:text-emerald-300 transition-all border border-emerald-500/20">
              <MessageCircle className="w-4 h-4" />
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
