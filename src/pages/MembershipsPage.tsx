import React from "react";
import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { ArrowLeft, CheckCircle, Award, Star, ShieldCheck, Sparkles, HelpCircle } from "lucide-react";
import PublicNavbar from "../components/PublicNavbar";
import logoPremium from "../../assets/l.webp";
import { GYM_CONFIG } from "../config/gym";
import { deadliftPlatform } from "../assets/gymImages";
import { usePageSEO } from "../lib/seo";

export default function MembershipsPage() {
  usePageSEO({
    title: "Gym Membership Fees & Plans in Aurangabad, Bihar | Vikings Gym & Spa",
    description: "Explore transparent gym membership fees in Aurangabad, Bihar at Vikings Gym & Spa. 1-Month (₹2,000), 3-Month (₹4,900), 6-Month (₹9,000) & Annual VIP (₹18,000) with Moroccan steam spa & 0% EMI.",
    keywords: "gym fees aurangabad bihar, vikings gym price list, gym membership aurangabad, gym charges aurangabad, best gym packages aurangabad",
    canonical: "https://www.vikingsgym.in/memberships",
  });

  const openWhatsApp = (msg: string) => {
    window.open(`https://wa.me/${GYM_CONFIG.whatsapp}?text=${encodeURIComponent(msg)}`, "_blank", "noopener,noreferrer");
  };

  const PLANS = [
    {
      name: "1 Month Trial Plan",
      hindiName: "1 माह प्लान",
      price: "₹2,000",
      period: "per month",
      desc: "Flexible, zero-commitment strength and conditioning access for beginners starting their journey.",
      features: [
        "Full access to Viva Fitness strength arsenal",
        "Olympic powerlifting platforms & deadlift zone",
        "Cardio rowers, treadmills & sprint turf track",
        "Moroccan steam spa access",
        "Locker and shower suite usage",
      ],
      popular: false,
    },
    {
      name: "3 Months Shield-Wall",
      hindiName: "3 माह लोकप्रिय प्लान",
      price: "₹5,000",
      period: "quarterly (Save ₹1,000)",
      desc: "Our most popular membership for consistent progressive overload and visible physique adaptation.",
      features: [
        "All 1-Month Plan inclusions",
        "Complimentary fitness assessment",
        "Personalized progressive overload targets",
        "Priority Moroccan steam spa recovery access",
        "Locker and changing suite privileges",
      ],
      popular: true,
    },
    {
      name: "6 Months Warrior Plan",
      hindiName: "6 माह हाफ-ईयरली प्लान",
      price: "₹9,000",
      period: "half-yearly (Save ₹3,000)",
      desc: "Comprehensive semi-annual plan designed for serious strength progress and significant body recomposition.",
      features: [
        "All 3-Month Plan inclusions",
        "Quarterly body composition audits",
        "Custom nutritional guidance guidelines",
        "Unlimited Moroccan steam spa recovery",
        "Priority trial session for personal training",
      ],
      popular: false,
    },
    {
      name: "1 Year Valhalla Champion",
      hindiName: "1 वर्ष वार्षिक प्लान",
      price: "₹16,000",
      period: "annual (Best Value · Save ₹8,000)",
      desc: "Unrestricted annual commitment for athletes dedicated to lifetime discipline and peak performance.",
      features: [
        "All 6-Month Plan inclusions",
        "Lowest per-month effective cost (₹1,333/mo)",
        "Complimentary 1-on-1 coach technique audit",
        "Free membership freeze for up to 30 days",
        "Exclusive Vikings warrior merchandise discount",
      ],
      popular: false,
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
            src={deadliftPlatform}
            alt="Vikings Deadlift Platform"
            className="w-full h-full object-cover object-[center_35%]"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/90 via-black/80 to-black" />
          <div className="absolute inset-y-0 left-0 w-24 sm:w-48 bg-gradient-to-r from-black to-transparent" />
          <div className="absolute inset-y-0 right-0 w-24 sm:w-48 bg-gradient-to-l from-black to-transparent" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: -60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="relative z-10 max-w-4xl mx-auto text-center"
        >
          <p className="text-red-500 font-sans font-extrabold text-xs tracking-[0.2em] uppercase mb-2">
            पारदर्शी शुल्क • TRANSPARENT PRICING
          </p>
          <h1 className="text-3xl sm:text-5xl font-sans font-black text-white uppercase tracking-tight mb-4 drop-shadow-[0_4px_24px_rgba(0,0,0,0.95)]">
            MEMBERSHIP TIERS &amp; PACKAGES
          </h1>
          <p className="text-gray-200 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed drop-shadow-[0_2px_10px_rgba(0,0,0,0.95)] font-medium">
            कोई छुपा हुआ शुल्क नहीं — 1 माह, 3 माह, 6 माह और 1 वर्ष के पारदर्शी फिटनेस प्लान्स। हर पैकेज में संपूर्ण जिम उपकरण और मोरक्कन स्टीम स्पा की सुविधा शामिल है।
          </p>
          <div className="w-16 h-1 bg-red-600 mx-auto mt-6 rounded shadow-[0_0_12px_rgba(239,68,68,0.7)]"></div>
        </motion.div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-16 w-full">
        {/* Plans Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {PLANS.map((plan, idx) => (
            <div
              key={idx}
              className={`rounded-2xl transition-all duration-300 flex flex-col justify-between ${
                plan.popular
                  ? "moving-border-red lg:-translate-y-2 shadow-2xl shadow-red-950/50"
                  : "bg-neutral-950/80 border border-neutral-850 p-6 sm:p-7 shadow-lg"
              }`}
            >
              <div className={plan.popular ? "moving-border-red-inner p-6 sm:p-7 bg-[#0a0a0a] rounded-2xl flex flex-col justify-between h-full" : "h-full flex flex-col justify-between"}>
                <div>
                  {plan.popular && (
                    <span className="inline-block px-2.5 py-0.5 rounded-md bg-red-600 text-black text-[10px] font-sans font-black tracking-widest uppercase mb-3 shadow-sm">
                      MOST POPULAR • सबसे लोकप्रिय
                    </span>
                  )}
                  <span className="text-[11px] font-sans text-red-500 font-bold block uppercase mb-1">
                    {plan.hindiName}
                  </span>
                  <h3 className="text-xl font-sans font-black text-white uppercase tracking-tight mb-2">
                    {plan.name}
                  </h3>
                  <div className="mb-4">
                    <span className="text-3xl sm:text-4xl font-sans font-black text-white">{plan.price}</span>
                    <span className="text-xs font-mono text-gray-400 block mt-0.5">{plan.period}</span>
                  </div>
                  <p className="text-xs text-gray-300 font-sans leading-relaxed mb-6">
                    {plan.desc}
                  </p>

                  <div className="pt-4 border-t border-white/5 space-y-2.5 mb-6">
                    {plan.features.map((feat, fIdx) => (
                      <div key={fIdx} className="flex items-start gap-2.5 text-xs text-gray-300 font-sans">
                        <CheckCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => openWhatsApp(`Hi Vikings Gym & Spa! I'd like to enroll in the ${plan.name} (${plan.price}). Please guide me with enrollment.`)}
                  className={`w-full py-3 rounded-xl font-sans font-black text-xs uppercase tracking-wider transition-all cursor-pointer text-center ${
                    plan.popular
                      ? "bg-red-600 hover:bg-red-700 text-black shadow-lg shadow-red-600/30"
                      : "bg-neutral-900 hover:bg-neutral-800 text-white border border-neutral-700"
                  }`}
                >
                  ENROLL IN THIS PLAN
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* What's Included in Every Membership */}
        <div className="bg-neutral-950 border border-neutral-850 rounded-3xl p-8 sm:p-12 mb-16">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs font-mono font-bold text-red-500 uppercase tracking-widest block mb-1">
              ALL-INCLUSIVE MEMBERSHIP PRIVILEGES
            </span>
            <h2 className="text-2xl sm:text-3xl font-sans font-black text-white uppercase tracking-tight">
              EVERY MEMBERSHIP INCLUDES
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 text-left">
            <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/5 flex items-start gap-3.5">
              <CheckCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-sans font-bold text-white uppercase">Complete Machine Arsenal</h4>
                <p className="text-xs text-gray-400 mt-1">Viva Fitness plate-loaded machines, cable crossovers, and dumbbell racks up to 60kg.</p>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/5 flex items-start gap-3.5">
              <CheckCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-sans font-bold text-white uppercase">Moroccan Steam Spa</h4>
                <p className="text-xs text-gray-400 mt-1">Thermal steam bath sessions for muscle relaxation and accelerated recovery.</p>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/5 flex items-start gap-3.5">
              <CheckCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-sans font-bold text-white uppercase">Cardio &amp; Turf Agility Track</h4>
                <p className="text-xs text-gray-400 mt-1">High-end treadmills, air rowers, spin bikes, and athletic sprint turf.</p>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/5 flex items-start gap-3.5">
              <CheckCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-sans font-bold text-white uppercase">Lockers &amp; Changing Suites</h4>
                <p className="text-xs text-gray-400 mt-1">Clean, secure locker storage and modern shower suites.</p>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/5 flex items-start gap-3.5">
              <CheckCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-sans font-bold text-white uppercase">On-Floor Trainer Guidance</h4>
                <p className="text-xs text-gray-400 mt-1">Certified instructors always on floor to ensure safe exercise form.</p>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/5 flex items-start gap-3.5">
              <CheckCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-sans font-bold text-white uppercase">Zero Admission Surcharges</h4>
                <p className="text-xs text-gray-400 mt-1">100% transparent rates. No surprise administrative or processing fees.</p>
              </div>
            </div>
          </div>
        </div>

        {/* FAQs Section */}
        <div className="max-w-3xl mx-auto space-y-4">
          <h3 className="text-xl sm:text-2xl font-sans font-black text-white uppercase tracking-tight text-center mb-6">
            FREQUENTLY ASKED QUESTIONS
          </h3>

          <div className="p-5 rounded-2xl bg-neutral-950/80 border border-white/5 space-y-2">
            <h4 className="text-sm font-sans font-bold text-white uppercase">How do I pay for my membership?</h4>
            <p className="text-xs text-gray-300 leading-relaxed">
              We accept all standard digital payments (UPI via Google Pay, PhonePe, Paytm, BHIM), debit/credit cards, and cash at our reception desk on MG Road.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-neutral-950/80 border border-white/5 space-y-2">
            <h4 className="text-sm font-sans font-bold text-white uppercase">Can I freeze my membership if I travel?</h4>
            <p className="text-xs text-gray-300 leading-relaxed">
              Yes, our 6-Month and 1-Year plans allow you to temporarily pause or freeze your membership for up to 30 days due to medical reasons, exams, or travel.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-neutral-950/80 border border-white/5 space-y-2">
            <h4 className="text-sm font-sans font-bold text-white uppercase">Can I take a trial workout before enrolling?</h4>
            <p className="text-xs text-gray-300 leading-relaxed">
              Drop by during operational hours (5 AM – 10 PM) or message our WhatsApp team to schedule a walkthrough and introductory training trial.
            </p>
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
