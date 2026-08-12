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
  CheckCircle2
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
    <div className="min-h-screen bg-black text-gray-100 font-sans selection:bg-red-650 selection:text-white relative">
      {/* Floating WhatsApp Quick Action Button */}
      <a
        href={WHATSAPP_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 bg-emerald-500 hover:bg-emerald-600 text-white p-3.5 rounded-full shadow-2xl shadow-emerald-950 flex items-center justify-center transition-all hover:scale-110 group cursor-pointer"
        title="Chat on WhatsApp"
      >
        <MessageCircle className="w-6 h-6 fill-current" />
        <span className="max-w-0 overflow-hidden whitespace-nowrap group-hover:max-w-xs transition-all duration-300 font-mono text-xs font-bold pl-0 group-hover:pl-2">
          WHATSAPP INQUIRY
        </span>
      </a>

      {/* Header Bar */}
      <header className="border-b border-red-950/30 bg-black/90 backdrop-blur-md sticky top-0 z-40">
        {/* Top Announcement Bar */}
        <div className="bg-red-950/40 border-b border-red-900/30 px-6 py-1.5 text-[11px] font-mono text-gray-300 flex justify-between items-center max-w-7xl mx-auto">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-red-400 font-bold">
              <MapPin className="w-3 h-3" /> MG Rd, Aurangabad, Bihar
            </span>
            <span className="hidden sm:inline text-gray-500">•</span>
            <span className="hidden sm:flex items-center gap-1 text-amber-400">
              <Star className="w-3 h-3 fill-amber-400" /> 4.4 / 5.0 (27 Google Reviews)
            </span>
          </div>

          <div className="flex items-center gap-4">
            <a href={`tel:07764922023`} className="hover:text-white flex items-center gap-1">
              <PhoneCall className="w-3 h-3 text-red-500" /> {PHONE_NUMBER}
            </a>
            <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" className="hover:text-white flex items-center gap-1 text-rose-400">
              <Instagram className="w-3.5 h-3.5" /> @vikings_fitness
            </a>
          </div>
        </div>

        {/* Main Navbar */}
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <img src={logoPremium} alt="Vikings Logo" className="h-10 w-auto" />
            <div>
              <span className="font-mono text-lg font-black tracking-widest text-white block">
                VIKINGS <span className="text-red-500">GYM & SPA</span>
              </span>
              <span className="text-[9px] font-mono text-gray-400 tracking-wider block -mt-1 uppercase">AURANGABAD HQ</span>
            </div>
          </div>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-8 font-mono text-xs tracking-wider uppercase">
            <a href="#services" className="text-gray-300 hover:text-red-500 transition-colors">SERVICES</a>
            <a href="#about" className="text-gray-300 hover:text-red-500 transition-colors">ABOUT & MAPS</a>
            <a href="#pricing" className="text-gray-300 hover:text-red-500 transition-colors">PACKAGES</a>
            <a href="#reviews" className="text-gray-300 hover:text-red-500 transition-colors">REVIEWS</a>
            <a href="#trainers" className="text-gray-300 hover:text-red-500 transition-colors">TRAINERS</a>
            <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" className="text-rose-400 hover:text-rose-300 transition-colors flex items-center gap-1">
              <Instagram className="w-3.5 h-3.5" /> INSTAGRAM
            </a>
          </nav>

          <div className="hidden lg:flex items-center gap-3">
            <button
              onClick={onLoginClick}
              className="bg-neutral-900 hover:bg-neutral-850 border border-neutral-800 text-white font-mono text-xs font-bold px-4 py-2 rounded transition-all cursor-pointer"
            >
              CLIENT LOGIN
            </button>
            <button
              onClick={onJoinNow}
              className="bg-red-600 hover:bg-red-700 text-black font-mono font-bold text-xs px-5 py-2 rounded transition-all cursor-pointer shadow-lg shadow-red-950/50 uppercase"
            >
              JOIN THE KINGDOM
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden text-white p-2"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Dropdown Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden bg-neutral-950 border-b border-neutral-850 px-6 py-4 space-y-3 font-mono text-xs uppercase">
            <a href="#services" onClick={() => setIsMobileMenuOpen(false)} className="block text-gray-300 py-1">SERVICES</a>
            <a href="#about" onClick={() => setIsMobileMenuOpen(false)} className="block text-gray-300 py-1">ABOUT & MAPS</a>
            <a href="#pricing" onClick={() => setIsMobileMenuOpen(false)} className="block text-gray-300 py-1">PACKAGES</a>
            <a href="#reviews" onClick={() => setIsMobileMenuOpen(false)} className="block text-gray-300 py-1">REVIEWS</a>
            <a href="#trainers" onClick={() => setIsMobileMenuOpen(false)} className="block text-gray-300 py-1">TRAINERS</a>
            <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" className="block text-rose-400 py-1">INSTAGRAM PAGE</a>
            <div className="pt-2 flex flex-col gap-2">
              <button onClick={() => { setIsMobileMenuOpen(false); onLoginClick(); }} className="w-full bg-neutral-900 text-white py-2.5 rounded font-bold">
                CLIENT LOGIN
              </button>
              <button onClick={() => { setIsMobileMenuOpen(false); onJoinNow(); }} className="w-full bg-red-600 text-black py-2.5 rounded font-bold">
                JOIN NOW
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-red-950/20">
        <DotPattern className="opacity-40" />
        <AnimatedMarqueeHero
          onJoinNow={onJoinNow}
          onExplorePlans={() => {
            const el = document.getElementById("pricing");
            if (el) el.scrollIntoView({ behavior: "smooth" });
          }}
        />
      </section>

      {/* Portal Services Quick Grid (Inspired by earlier portal index) */}
      <section id="services" className="py-16 px-6 max-w-7xl mx-auto border-b border-red-950/20">
        <div className="text-center mb-10">
          <p className="text-red-500 font-mono text-xs tracking-widest uppercase mb-2">QUICK PORTAL DIRECTORY</p>
          <h2 className="text-2xl md:text-3xl font-sans font-black text-white uppercase tracking-tight">
            EXPLORE VIKINGS SERVICES & PORTAL MODULES
          </h2>
          <div className="w-16 h-1 bg-red-650 mx-auto mt-3 rounded animate-pulse"></div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 font-mono">
          {/* Quick Item 1: Enquiry */}
          <a href="#contact" className="bg-neutral-900/60 hover:bg-neutral-900 border border-neutral-850 hover:border-red-900/50 p-4 rounded-xl space-y-2 transition-all group">
            <div className="bg-red-600/10 text-red-500 p-2.5 rounded-lg w-fit group-hover:scale-110 transition-transform">
              <HelpCircle className="w-5 h-5" />
            </div>
            <h4 className="text-white text-xs font-bold uppercase">Enquiry</h4>
            <p className="text-[10px] text-gray-500 leading-tight">Get to know our packages & deals</p>
          </a>

          {/* Quick Item 2: Client Login */}
          <button onClick={onLoginClick} className="bg-neutral-900/60 hover:bg-neutral-900 border border-neutral-850 hover:border-red-900/50 p-4 rounded-xl space-y-2 transition-all group text-left">
            <div className="bg-emerald-600/10 text-emerald-500 p-2.5 rounded-lg w-fit group-hover:scale-110 transition-transform">
              <UserCheck className="w-5 h-5" />
            </div>
            <h4 className="text-white text-xs font-bold uppercase">Client Login</h4>
            <p className="text-[10px] text-gray-500 leading-tight">Access workout logs & billing</p>
          </button>

          {/* Quick Item 3: Book PT Sessions */}
          <a href="#pricing" className="bg-neutral-900/60 hover:bg-neutral-900 border border-neutral-850 hover:border-red-900/50 p-4 rounded-xl space-y-2 transition-all group">
            <div className="bg-amber-600/10 text-amber-500 p-2.5 rounded-lg w-fit group-hover:scale-110 transition-transform">
              <Dumbbell className="w-5 h-5" />
            </div>
            <h4 className="text-white text-xs font-bold uppercase">Book PT Sessions</h4>
            <p className="text-[10px] text-gray-500 leading-tight">1-on-1 certified personal coaching</p>
          </a>

          {/* Quick Item 4: Packages */}
          <a href="#pricing" className="bg-neutral-900/60 hover:bg-neutral-900 border border-neutral-850 hover:border-red-900/50 p-4 rounded-xl space-y-2 transition-all group">
            <div className="bg-blue-600/10 text-blue-500 p-2.5 rounded-lg w-fit group-hover:scale-110 transition-transform">
              <Award className="w-5 h-5" />
            </div>
            <h4 className="text-white text-xs font-bold uppercase">Packages</h4>
            <p className="text-[10px] text-gray-500 leading-tight">Find plans tailored to your needs</p>
          </a>

          {/* Quick Item 5: Photo Gallery */}
          <a href="#about" className="bg-neutral-900/60 hover:bg-neutral-900 border border-neutral-850 hover:border-red-900/50 p-4 rounded-xl space-y-2 transition-all group">
            <div className="bg-purple-600/10 text-purple-500 p-2.5 rounded-lg w-fit group-hover:scale-110 transition-transform">
              <Camera className="w-5 h-5" />
            </div>
            <h4 className="text-white text-xs font-bold uppercase">Facility Tour</h4>
            <p className="text-[10px] text-gray-500 leading-tight">Explore gym & spa facilities</p>
          </a>

          {/* Quick Item 6: Trainers */}
          <a href="#trainers" className="bg-neutral-900/60 hover:bg-neutral-900 border border-neutral-850 hover:border-red-900/50 p-4 rounded-xl space-y-2 transition-all group">
            <div className="bg-rose-600/10 text-rose-500 p-2.5 rounded-lg w-fit group-hover:scale-110 transition-transform">
              <Users className="w-5 h-5" />
            </div>
            <h4 className="text-white text-xs font-bold uppercase">Trainers</h4>
            <p className="text-[10px] text-gray-500 leading-tight">Meet our master coaches</p>
          </a>

          {/* Quick Item 7: Reviews */}
          <a href="#reviews" className="bg-neutral-900/60 hover:bg-neutral-900 border border-neutral-850 hover:border-red-900/50 p-4 rounded-xl space-y-2 transition-all group">
            <div className="bg-amber-500/10 text-amber-400 p-2.5 rounded-lg w-fit group-hover:scale-110 transition-transform">
              <Star className="w-5 h-5 fill-amber-400" />
            </div>
            <h4 className="text-white text-xs font-bold uppercase">Google Reviews</h4>
            <p className="text-[10px] text-gray-500 leading-tight">4.4 Rating (27 Reviews)</p>
          </a>

          {/* Quick Item 8: Instagram */}
          <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" className="bg-neutral-900/60 hover:bg-neutral-900 border border-neutral-850 hover:border-red-900/50 p-4 rounded-xl space-y-2 transition-all group">
            <div className="bg-pink-600/10 text-pink-500 p-2.5 rounded-lg w-fit group-hover:scale-110 transition-transform">
              <Instagram className="w-5 h-5" />
            </div>
            <h4 className="text-white text-xs font-bold uppercase">Instagram</h4>
            <p className="text-[10px] text-gray-500 leading-tight">@vikings_fitness community</p>
          </a>

          {/* Quick Item 9: Google Directions */}
          <a href={MAPS_URL} target="_blank" rel="noopener noreferrer" className="bg-neutral-900/60 hover:bg-neutral-900 border border-neutral-850 hover:border-red-900/50 p-4 rounded-xl space-y-2 transition-all group">
            <div className="bg-cyan-600/10 text-cyan-400 p-2.5 rounded-lg w-fit group-hover:scale-110 transition-transform">
              <Compass className="w-5 h-5" />
            </div>
            <h4 className="text-white text-xs font-bold uppercase">Google Maps</h4>
            <p className="text-[10px] text-gray-500 leading-tight">Get directions to gym</p>
          </a>

          {/* Quick Item 10: Call Support */}
          <a href={`tel:07764922023`} className="bg-neutral-900/60 hover:bg-neutral-900 border border-neutral-850 hover:border-red-900/50 p-4 rounded-xl space-y-2 transition-all group">
            <div className="bg-emerald-600/10 text-emerald-400 p-2.5 rounded-lg w-fit group-hover:scale-110 transition-transform">
              <PhoneCall className="w-5 h-5" />
            </div>
            <h4 className="text-white text-xs font-bold uppercase">Call Desk</h4>
            <p className="text-[10px] text-gray-500 leading-tight">077649 22023</p>
          </a>
        </div>
      </section>

      {/* About & Location Details (From Google Maps & Official Listing) */}
      <section id="about" className="py-24 px-6 max-w-7xl mx-auto border-b border-red-950/20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 bg-red-600/10 border border-red-900/40 px-3 py-1 rounded text-red-500 font-mono text-xs font-bold uppercase">
              <MapPin className="w-4 h-4" /> OFFICIAL GYM LISTING & LOCATION
            </div>

            <h2 className="text-3xl md:text-4xl font-sans font-black text-white uppercase tracking-tight">
              VIKINGS GYM & SPA (वाइकिंग्स जिम)
            </h2>

            <p className="text-gray-300 text-sm leading-relaxed">
              Vikings Gym & Spa is Aurangabad's premier fitness center, equipped with state-of-the-art heavy strength equipment, steam & spa facilities, certified personal trainers, and customized group exercise classes.
            </p>

            <div className="bg-neutral-900/60 border border-neutral-850 p-5 rounded-xl space-y-3 font-mono text-xs">
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                <div>
                  <span className="text-gray-500 block uppercase">ADDRESS:</span>
                  <span className="text-white font-bold">{ADDRESS_TEXT}</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <div>
                  <span className="text-gray-500 block uppercase">OPERATING HOURS:</span>
                  <span className="text-emerald-400 font-bold">Monday – Saturday: 5:00 AM – 10:00 PM</span>
                  <span className="text-gray-500 block">Sunday: Closed</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                <div>
                  <span className="text-gray-500 block uppercase">PHONE / WHATSAPP:</span>
                  <a href="tel:07764922023" className="text-white font-bold hover:text-red-400">077649 22023</a>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-4 pt-2">
              <a
                href={MAPS_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-red-600 hover:bg-red-700 text-black font-mono font-bold text-xs px-6 py-3 rounded-lg flex items-center gap-2 transition-all shadow-lg uppercase"
              >
                <Compass className="w-4 h-4" /> GET GOOGLE MAPS DIRECTIONS
              </a>
              <a
                href={INSTAGRAM_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-neutral-900 hover:bg-neutral-850 border border-neutral-800 text-white font-mono font-bold text-xs px-6 py-3 rounded-lg flex items-center gap-2 transition-all uppercase"
              >
                <Instagram className="w-4 h-4 text-rose-500" /> FOLLOW ON INSTAGRAM
              </a>
            </div>
          </div>

          {/* Embedded Google Maps View */}
          <div className="bg-neutral-900/40 border border-neutral-850 p-2 rounded-xl shadow-2xl relative overflow-hidden h-96">
            <iframe
              title="Vikings Gym Google Map"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3738.167389278912!2d84.3681875!3d24.7517233!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x398cfdda0d754111%3A0xf741105a5bcb783d!2sVIKINGS%20GYM!5e0!3m2!1sen!2sin!4v1710000000000!5m2!1sen!2sin"
              className="w-full h-full rounded-lg border-0 filter grayscale invert contrast-125 opacity-90"
              loading="lazy"
              allowFullScreen
            />
          </div>
        </div>
      </section>

      {/* Membership Tiers & Pricing with Razorpay Payment Integration */}
      <section id="pricing" className="py-24 px-6 max-w-7xl mx-auto border-b border-red-950/20">
        <div className="text-center mb-16">
          <p className="text-red-500 font-mono text-xs tracking-widest uppercase mb-2">SHIELD WALL SUBSCRIPTIONS</p>
          <h2 className="text-3xl md:text-4xl font-sans font-black text-white uppercase tracking-tight">
            MEMBERSHIP PLANS & RAZORPAY PAYMENT
          </h2>
          <div className="w-16 h-1 bg-red-650 mx-auto mt-4 rounded animate-pulse"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {plansData && plansData.map((plan: any, index: number) => (
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

              <div className="space-y-2">
                <button
                  onClick={() => setSelectedPlanForPayment(plan)}
                  className={`w-full py-3 rounded-md font-mono font-bold text-xs tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer ${
                    plan.popular
                      ? "bg-red-600 hover:bg-red-700 text-black shadow-lg"
                      : "bg-neutral-950 hover:bg-neutral-900 text-gray-300 border border-neutral-800 hover:border-gray-600"
                  }`}
                >
                  <CreditCard className="w-4 h-4" /> PAY WITH RAZORPAY
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Google Reviews & Member Testimonials Section */}
      <section id="reviews" className="py-24 px-6 max-w-7xl mx-auto border-b border-red-950/20">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-900/40 px-3 py-1 rounded text-amber-400 font-mono text-xs font-bold uppercase mb-3">
            <Star className="w-4 h-4 fill-amber-400" /> GOOGLE MAPS RATING: 4.4 / 5.0 (27 REVIEWS)
          </div>
          <h2 className="text-3xl md:text-4xl font-sans font-black text-white uppercase tracking-tight">
            WARRIOR REVIEWS & TESTIMONIALS
          </h2>
          <div className="w-16 h-1 bg-red-650 mx-auto mt-4 rounded"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Review 1 */}
          <div className="bg-neutral-900/40 border border-neutral-850 p-6 rounded-xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400" />
                ))}
              </div>
              <span className="text-[10px] font-mono text-gray-500">Google Verified</span>
            </div>
            <p className="text-xs text-gray-300 leading-relaxed italic">
              "Best gym in Aurangabad! Excellent equipment, helpful certified trainers, and clean steam spa facilities. The digital QR pass check-in makes everyday access so smooth."
            </p>
            <div className="flex items-center gap-3 pt-2 border-t border-neutral-850">
              <div className="w-8 h-8 rounded-full bg-red-600/20 text-red-400 font-mono font-bold text-xs flex items-center justify-center border border-red-900/40">
                RK
              </div>
              <div>
                <span className="text-xs font-bold text-white block">Rahul Kumar</span>
                <span className="text-[10px] text-gray-500 font-mono">Member for 1 Year</span>
              </div>
            </div>
          </div>

          {/* Review 2 */}
          <div className="bg-neutral-900/40 border border-neutral-850 p-6 rounded-xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400" />
                ))}
              </div>
              <span className="text-[10px] font-mono text-gray-500">Google Verified</span>
            </div>
            <p className="text-xs text-gray-300 leading-relaxed italic">
              "Awesome workout environment! The personal trainers provide customized diet plans and heavy lifting protocols. Highly recommended for fitness enthusiasts in Aurangabad."
            </p>
            <div className="flex items-center gap-3 pt-2 border-t border-neutral-850">
              <div className="w-8 h-8 rounded-full bg-rose-600/20 text-rose-400 font-mono font-bold text-xs flex items-center justify-center border border-rose-900/40">
                PS
              </div>
              <div>
                <span className="text-xs font-bold text-white block">Priya Sharma</span>
                <span className="text-[10px] text-gray-500 font-mono">VIP Spa Member</span>
              </div>
            </div>
          </div>

          {/* Review 3 */}
          <div className="bg-neutral-900/40 border border-neutral-850 p-6 rounded-xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400" />
                ))}
              </div>
              <span className="text-[10px] font-mono text-gray-500">Google Verified</span>
            </div>
            <p className="text-xs text-gray-300 leading-relaxed italic">
              "Great location on MG Road, Aurangabad. Huge space, quality dumbell rack up to 50kg, and supportive management team. 10/10 experience!"
            </p>
            <div className="flex items-center gap-3 pt-2 border-t border-neutral-850">
              <div className="w-8 h-8 rounded-full bg-blue-600/20 text-blue-400 font-mono font-bold text-xs flex items-center justify-center border border-blue-900/40">
                VD
              </div>
              <div>
                <span className="text-xs font-bold text-white block">Vikram Deshmukh</span>
                <span className="text-[10px] text-gray-500 font-mono">Berserker Plan</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 text-center">
          <a
            href={MAPS_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-900/50 font-mono font-bold text-xs px-6 py-3 rounded-lg transition-all"
          >
            <Star className="w-4 h-4 fill-amber-400" /> LEAVE A GOOGLE MAPS REVIEW →
          </a>
        </div>
      </section>

      {/* Master Coaches Showcase */}
      <section id="trainers" className="py-24 bg-neutral-950/40 px-6 border-b border-red-950/20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-red-500 font-mono text-xs tracking-widest uppercase mb-2">ELITE VALKYRIES & BERSERKERS</p>
            <h2 className="text-3xl md:text-4xl font-sans font-black text-white uppercase tracking-tight">
              MEET YOUR MASTER COACHES
            </h2>
            <div className="w-16 h-1 bg-red-650 mx-auto mt-4 rounded"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-4xl mx-auto">
            {trainersData && trainersData.map((t: any, idx: number) => (
              <div key={idx} className="bg-neutral-900/30 border border-neutral-900 rounded-xl overflow-hidden flex flex-col md:flex-row group hover:border-red-950 transition-all duration-300">
                <div className="md:w-2/5 h-64 md:h-auto bg-neutral-900">
                  {t.photoUrl ? (
                    <img src={t.photoUrl} alt={t.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  ) : (
                    <div className="w-full h-full bg-neutral-800 flex items-center justify-center">
                      <span className="text-gray-500 font-mono text-4xl">{t.name ? t.name.charAt(0) : '?'}</span>
                    </div>
                  )}
                </div>
                <div className="md:w-3/5 p-6 flex flex-col justify-between">
                  <div>
                    <div className="text-xs font-mono font-bold text-red-500 mb-1">{t.role}</div>
                    <h3 className="text-lg font-bold text-white mb-2">{t.name}</h3>
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
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact & Inquiry Section */}
      <section id="contact" className="py-24 px-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          <div>
            <span className="text-red-500 font-mono text-xs tracking-widest uppercase block mb-2">VISIT THE KINGDOM</span>
            <h2 className="text-3xl font-sans font-black text-white uppercase tracking-tight mb-6">
              LOCATION & OPERATING DETAILS
            </h2>
            <p className="text-gray-400 text-sm md:text-base leading-relaxed mb-8">
              We stand prepared for your visit at our premiere Aurangabad branch. Drop in for a high-fidelity physical facility tour, experience our cold spa chambers, and enjoy a pre-workout beverage inside our supplements cafe.
            </p>

            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <MapPin className="w-5 h-5 text-red-500 mt-1 shrink-0" />
                <div>
                  <h4 className="text-white text-sm font-mono font-bold uppercase mb-1">HQ BRANCH ADDRESS:</h4>
                  <p className="text-xs text-gray-400 font-mono">
                    {ADDRESS_TEXT}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <Phone className="w-5 h-5 text-red-500 mt-1 shrink-0" />
                <div>
                  <h4 className="text-white text-sm font-mono font-bold uppercase mb-1">DIRECT INQUIRIES:</h4>
                  <p className="text-xs text-gray-400 font-mono">
                    Direct Ph: {PHONE_NUMBER} | Email: ritwik014017@gmail.com
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <Calendar className="w-5 h-5 text-red-500 mt-1 shrink-0" />
                <div>
                  <h4 className="text-white text-sm font-mono font-bold uppercase mb-1">WARRIORS DOCTRINE TIMINGS:</h4>
                  <p className="text-xs text-gray-400 font-mono leading-relaxed">
                    Monday - Saturday: 05:00 AM to 10:00 PM <br />
                    Sunday: Closed
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
                <p className="text-xs text-gray-400 font-mono">
                  A front desk assistant from Vikings Gym Aurangabad will contact you shortly on {contactPhone}. Prepare your shields!
                </p>
              </motion.div>
            ) : (
              <form onSubmit={handleContactSubmit} className="space-y-4 font-mono text-xs">
                <div>
                  <label className="block text-gray-400 mb-1.5 uppercase">Full Name</label>
                  <input
                    type="text"
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                    className="w-full bg-black/50 border border-neutral-850 px-4 py-2.5 rounded text-white text-xs focus:border-red-650 focus:outline-none"
                    placeholder="e.g. Rahul Kumar"
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-400 mb-1.5 uppercase">Phone Number</label>
                  <input
                    type="tel"
                    value={contactPhone}
                    onChange={(e) => setContactPhone(e.target.value)}
                    className="w-full bg-black/50 border border-neutral-850 px-4 py-2.5 rounded text-white text-xs focus:border-red-650 focus:outline-none"
                    placeholder="e.g. +91 77649XXXXX"
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-400 mb-1.5 uppercase">Message / Inquiry Details</label>
                  <textarea
                    rows={3}
                    value={contactMessage}
                    onChange={(e) => setContactMessage(e.target.value)}
                    className="w-full bg-black/50 border border-neutral-850 px-4 py-2.5 rounded text-white text-xs focus:border-red-650 focus:outline-none"
                    placeholder="Inquire about PT sessions, memberships..."
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="w-full bg-red-600 hover:bg-red-700 text-black py-3 rounded font-mono font-bold text-xs tracking-widest transition-all cursor-pointer uppercase"
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
            className="w-full max-w-md bg-neutral-950 border border-red-950/80 p-6 rounded-2xl shadow-2xl relative font-mono"
          >
            <button
              onClick={() => setSelectedPlanForPayment(null)}
              className="absolute right-4 top-4 text-gray-400 hover:text-white"
            >
              ✕
            </button>

            <div className="flex items-center gap-2 text-red-500 font-bold text-xs uppercase mb-1">
              <CreditCard className="w-4 h-4" /> RAZORPAY PAYMENT GATEWAY
            </div>
            <h3 className="text-xl font-black text-white uppercase mb-2">{selectedPlanForPayment.name}</h3>
            <p className="text-xs text-gray-400 mb-4">{selectedPlanForPayment.desc}</p>

            <div className="bg-neutral-900 border border-neutral-850 p-4 rounded-xl space-y-2 mb-6 text-xs">
              <div className="flex justify-between">
                <span className="text-gray-400">PLAN DURATION:</span>
                <span className="text-white font-bold">{selectedPlanForPayment.period}</span>
              </div>
              <div className="flex justify-between border-t border-neutral-800 pt-2">
                <span className="text-gray-400">TOTAL AMOUNT:</span>
                <span className="text-emerald-400 font-black text-base">{selectedPlanForPayment.price}</span>
              </div>
            </div>

            {/* Directions Steps */}
            <div className="bg-black/60 border border-neutral-850 p-3.5 rounded-lg space-y-2 text-[11px] text-gray-300 mb-6">
              <span className="font-bold text-red-400 block uppercase">HOW TO COMPLETE PAYMENT:</span>
              <ol className="list-decimal list-inside space-y-1 text-gray-400">
                <li>Enter your full name and phone number below.</li>
                <li>Click <strong>Proceed to Razorpay Checkout</strong>.</li>
                <li>Pay via UPI, Credit/Debit Card, or Netbanking to activate pass.</li>
              </ol>
            </div>

            {paymentSuccess ? (
              <div className="bg-emerald-500/10 border border-emerald-900/50 p-4 rounded-xl text-center space-y-2">
                <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
                <h4 className="text-white font-bold text-sm">PAYMENT SUCCESSFUL!</h4>
                <p className="text-[11px] text-emerald-400">Your membership pass has been generated. Login to access your QR pass.</p>
              </div>
            ) : (
              <form onSubmit={handleSimulateRazorpayPayment} className="space-y-4 text-xs">
                <div>
                  <label className="block text-gray-400 mb-1 uppercase">Member Name</label>
                  <input
                    type="text"
                    value={payerName}
                    onChange={(e) => setPayerName(e.target.value)}
                    required
                    className="w-full bg-neutral-900 border border-neutral-850 px-3 py-2 rounded text-white focus:border-red-600 focus:outline-none"
                    placeholder="Enter your name"
                  />
                </div>

                <div>
                  <label className="block text-gray-400 mb-1 uppercase">Phone Number</label>
                  <input
                    type="tel"
                    value={payerPhone}
                    onChange={(e) => setPayerPhone(e.target.value)}
                    required
                    className="w-full bg-neutral-900 border border-neutral-850 px-3 py-2 rounded text-white focus:border-red-600 focus:outline-none"
                    placeholder="Enter phone number"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-black font-bold py-3 rounded-lg transition-all uppercase flex items-center justify-center gap-2 cursor-pointer shadow-lg"
                >
                  <CreditCard className="w-4 h-4" /> PROCEED TO RAZORPAY CHECKOUT
                </button>
              </form>
            )}
          </motion.div>
        </div>
      )}

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
            © 2026 Vikings Gym & Spa - MG Road Aurangabad. All rights reserved.
          </p>

          <div className="flex gap-4">
            <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" className="p-2 bg-neutral-900 hover:bg-neutral-850 rounded text-gray-400 hover:text-rose-400 transition-all">
              <Instagram className="w-4 h-4" />
            </a>
            <a href={MAPS_URL} target="_blank" rel="noopener noreferrer" className="p-2 bg-neutral-900 hover:bg-neutral-850 rounded text-gray-400 hover:text-cyan-400 transition-all">
              <MapPin className="w-4 h-4" />
            </a>
            <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="p-2 bg-neutral-900 hover:bg-neutral-850 rounded text-gray-400 hover:text-emerald-400 transition-all">
              <MessageCircle className="w-4 h-4" />
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
