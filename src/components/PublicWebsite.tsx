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
  Globe
} from "lucide-react";
import { motion } from "motion/react";
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
          <a href="#pricing" className="hover:text-red-500 transition-colors">MEMBERSHIPS</a>
          <a href="#calculator" className="hover:text-red-500 transition-colors">BMI CALCULATOR</a>
          <button
            onClick={() => setFranchiseOpen(true)}
            className="hover:text-red-500 transition-colors cursor-pointer text-left"
          >
            FRANCHISE
          </button>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={onLoginClick}
            className="text-xs font-mono font-bold text-gray-300 hover:text-white border border-gray-800 hover:border-gray-600 px-4 py-2 rounded-md transition-all cursor-pointer"
          >
            PORTAL LOGIN
          </button>

          <button
            onClick={onJoinNow}
            className="bg-red-600 hover:bg-red-700 text-black font-mono font-black text-xs px-5 py-2.5 rounded hover:scale-105 active:scale-95 transition-all shadow-lg shadow-red-600/20 cursor-pointer"
          >
            JOIN NOW
          </button>
        </div>
      </nav>

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
        onCtaClick={onJoinNow}
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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
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
            <div key={i} className="bg-gradient-to-b from-neutral-900/40 to-neutral-950 border border-neutral-900 rounded-lg overflow-hidden group hover:border-red-900/60 transition-all duration-300">
              <div className="relative h-48 overflow-hidden bg-neutral-900">
                <img
                  src={f.img}
                  alt={f.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 opacity-80"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent"></div>
                <div className="absolute top-4 left-4 bg-red-600 text-black p-2 rounded">
                  <f.icon className="w-5 h-5 stroke-[2.5]" />
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-lg font-mono font-bold text-white mb-2">{f.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{f.description}</p>
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
                className="w-full bg-red-6/90 hover:bg-red-600 text-black py-3 rounded font-mono font-bold text-xs tracking-widest transition-all cursor-pointer"
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

              <button
                onClick={onJoinNow}
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
      </section>

      {/* Trainers Showcase */}
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

      {/* Contact & Map Section */}
      <section className="py-24 px-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          <div>
            <span className="text-red-500 font-mono text-xs tracking-widest uppercase block mb-2">VISIT THE KINGDOM</span>
            <h2 className="text-3xl font-sans font-black text-white uppercase tracking-tight mb-6">
              LOCATION & OPERATING DETAILS
            </h2>
            <p className="text-gray-400 text-sm md:text-base leading-relaxed mb-8">
              We stand prepared for your visit at our premiere Aurangabad branch. Drop in for a high-fidelity physical facility tour, experience our cold spa chambers, and enjoy an pre-workout beverage inside our supplements cafe.
            </p>

            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <MapPin className="w-5 h-5 text-red-500 mt-1 shrink-0" />
                <div>
                  <h4 className="text-white text-sm font-mono font-bold uppercase mb-1">HQ BRANCH ADDRESS:</h4>
                  <p className="text-xs text-gray-400">
                    First Floor, Plot 22, Near Cannought Plaza, Town Center, CIDCO, Aurangabad, PIN 431003
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <Phone className="w-5 h-5 text-red-500 mt-1 shrink-0" />
                <div>
                  <h4 className="text-white text-sm font-mono font-bold uppercase mb-1">DIRECT INQUIRIES:</h4>
                  <p className="text-xs text-gray-400">
                    Direct Ph: +91 99999 88888 | Email: ritwik014017@gmail.com
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <Calendar className="w-5 h-5 text-red-500 mt-1 shrink-0" />
                <div>
                  <h4 className="text-white text-sm font-mono font-bold uppercase mb-1">WARRIORS DOCTRINE TIMINGS:</h4>
                  <p className="text-xs text-gray-400 font-mono leading-relaxed">
                    Monday - Saturday: 05:30 AM to 10:30 PM <br />
                    Sunday Scheduled Steam Baths: 06:00 AM to 12:00 PM Only
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
                  A front desk assistant from Vikings CIDCO Aurangabad will get back to you via call or WhatsApp on {contactPhone} shortly. Prepare your shields!
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
            © 2026 Vikings Gym & Spa - CIDCO Aurangabad Franchise. All rights reserved. Built for Commercial Enterprise.
          </p>

          <div className="flex gap-4">
            <a href="#" className="p-2 bg-neutral-900 hover:bg-neutral-850 rounded text-gray-400 hover:text-white transition-all">
              <Instagram className="w-4 h-4" />
            </a>
            <a href="#" className="p-2 bg-neutral-900 hover:bg-neutral-850 rounded text-gray-400 hover:text-white transition-all">
              <Facebook className="w-4 h-4" />
            </a>
            <a href="#" className="p-2 bg-neutral-900 hover:bg-neutral-850 rounded text-gray-400 hover:text-white transition-all">
              <Globe className="w-4 h-4" />
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
