import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import {
  ArrowLeft,
  Building2,
  TrendingUp,
  Cpu,
  ShieldCheck,
  CheckCircle,
  Send,
  PhoneCall,
  Briefcase,
  Users,
} from 'lucide-react';
import PublicNavbar from '../components/PublicNavbar';
import { mainArenaPanoramic } from '../assets/gymImages';
import logoPremium from '../../assets/l.webp';
import { GYM_CONFIG } from '../config/gym';
import { usePageSEO } from '../lib/seo';

export default function FranchisePage() {
  usePageSEO({
    title: "Gym Franchise Opportunities in Bihar & Jharkhand | Vikings Gym & Spa",
    description: "Partner with Vikings Gym & Spa. High-ROI fitness franchise model with turnkey equipment supply, ERP software, architectural design, and trainer hiring support.",
    keywords: "gym franchise bihar, fitness franchise jharkhand, open gym aurangabad, gym franchise cost india, vikings gym franchise",
    canonical: "https://www.vikingsgym.in/franchise",
  });

  const [formData, setFormData] = useState({
    name: '',
    city: '',
    phone: '',
    spaceSize: '3,000 - 5,000 sq.ft.',
    budget: '₹40L - ₹60L',
    notes: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone || !formData.city) return;
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col font-sans selection:bg-red-600 selection:text-white">
      {/* Full Interactive Navigation Bar */}
      <PublicNavbar />

      {/* Hero Header with Landscaped Photo */}
      <section className="subpage-hero relative w-full h-[320px] sm:h-[400px] overflow-hidden border-b border-red-950/40 flex items-center justify-center" data-subpage-hero="true">
        <img
          src={mainArenaPanoramic}
          alt="Vikings Gym Main Floor Arena"
          width="1920"
          height="400"
          decoding="async"
          className="absolute inset-0 w-full h-full object-cover object-[center_35%]"
        />
        {/* Cinematic Vignette Overlay with Side Fades */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-black/45" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-transparent to-black/85" />
        <motion.div
          initial={{ opacity: 0, y: -60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="relative z-10 max-w-4xl mx-auto px-4 text-center"
        >
          <div className="inline-flex items-center gap-2 text-red-500 text-xs uppercase tracking-widest font-semibold mb-3">
            <Building2 className="w-3.5 h-3.5" /> Tier 2 & Tier 3 Business Model
          </div>
          <h1 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-white mb-3">
            Franchise & <span className="text-red-600">Expansion</span>
          </h1>
          <p className="text-sm sm:text-base text-neutral-300 max-w-2xl mx-auto font-medium">
            वाइकिंग्स फ्रैंचाइज़ी साझेदारी। Bring Bihar and Eastern India's most modern fitness arena to your city with proven operating margins and in-house cloud ERP.
          </p>
          <div className="mt-4 w-20 h-0.5 bg-red-600 mx-auto" />
        </motion.div>
      </section>

      {/* Main Content */}
      <main className="flex-1 max-w-6xl mx-auto px-4 sm:px-6 py-12 w-full space-y-12">
        {/* Pillars of the Model */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-neutral-950/80 border border-neutral-900">
            <div className="w-10 h-10 rounded-xl bg-red-600/10 border border-red-500/30 text-red-500 flex items-center justify-center mb-4">
              <TrendingUp className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white uppercase tracking-wide mb-2">
              Capital Efficiency
            </h3>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Direct tie-ups with Viva Fitness and Syndicate Gym equipment vendors, saving 25-30% on initial floor fit-out costs compared to retail distributors.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-neutral-950/80 border border-neutral-900">
            <div className="w-10 h-10 rounded-xl bg-red-600/10 border border-red-500/30 text-red-500 flex items-center justify-center mb-4">
              <Cpu className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white uppercase tracking-wide mb-2">
              Proprietary Cloud ERP
            </h3>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Turnkey access to our in-house Vikings ERP suite: live biometric check-ins, automated WhatsApp renewal reminders, staff attendance, and daily revenue ledgers.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-neutral-950/80 border border-neutral-900">
            <div className="w-10 h-10 rounded-xl bg-red-600/10 border border-red-500/30 text-red-500 flex items-center justify-center mb-4">
              <Users className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white uppercase tracking-wide mb-2">
              Trainer Academy & SOPs
            </h3>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Standardized training protocols led by Amit Singh, with rigorous background vetting, floor decorum guidelines, and structured personal training commissions.
            </p>
          </div>
        </div>

        {/* Investment Format Comparison */}
        <div className="p-8 rounded-2xl bg-neutral-950/90 border border-neutral-900">
          <div className="max-w-2xl mb-8">
            <span className="text-xs uppercase tracking-widest text-red-500 font-semibold">
              Franchise Formats · विस्तार प्रारूप
            </span>
            <h2 className="text-2xl font-black uppercase text-white mt-1">
              Select Your Target Floor Footprint
            </h2>
            <p className="text-xs text-neutral-400 mt-2">
              We offer two operating models tuned for high footfall commercial zones in regional commercial hubs.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="p-6 rounded-xl border border-neutral-800 bg-black/60 relative flex flex-col justify-between">
              <div>
                <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-widest">
                  Model A · Studio Core
                </span>
                <h3 className="text-xl font-bold text-white mt-1">Vikings Iron Club</h3>
                <div className="text-2xl font-black text-red-500 mt-3 font-mono">
                  ₹35L - ₹45L <span className="text-xs text-neutral-400 font-sans font-normal">est. total setup</span>
                </div>
                <ul className="space-y-2.5 mt-6 text-xs text-neutral-300">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-3.5 h-3.5 text-red-500 shrink-0" />
                    Recommended carpet: 2,500 – 4,000 sq.ft.
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-3.5 h-3.5 text-red-500 shrink-0" />
                    Strength floor, free weights & dedicated cardio line
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-3.5 h-3.5 text-red-500 shrink-0" />
                    Vikings ERP cloud license & biometric gate
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-3.5 h-3.5 text-red-500 shrink-0" />
                    Target break-even: 10 - 14 months
                  </li>
                </ul>
              </div>
              <p className="text-[11px] text-neutral-500 mt-6 pt-4 border-t border-neutral-900">
                Ideal for sub-divisional towns and commercial markets.
              </p>
            </div>

            <div className="p-6 rounded-xl border border-red-600/40 bg-red-950/10 relative flex flex-col justify-between shadow-xl shadow-red-950/20">
              <div>
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[11px] font-bold text-red-400 uppercase tracking-widest">
                    Model B · Full Experience
                  </span>
                  <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-red-600 text-white tracking-widest shrink-0">
                    Flagship
                  </span>
                </div>
                <h3 className="text-xl font-bold text-white mt-1">Vikings Gym & Spa Arena</h3>
                <div className="text-2xl font-black text-red-500 mt-3 font-mono">
                  ₹60L - ₹85L <span className="text-xs text-neutral-400 font-sans font-normal">est. total setup</span>
                </div>
                <ul className="space-y-2.5 mt-6 text-xs text-neutral-300">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-3.5 h-3.5 text-red-500 shrink-0" />
                    Recommended carpet: 5,000 – 8,000 sq.ft.
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-3.5 h-3.5 text-red-500 shrink-0" />
                    Dedicated Olympic power racks, turf track & boxing area
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-3.5 h-3.5 text-red-500 shrink-0" />
                    Moroccan Steam Bath + hydrotherapy spa wing
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-3.5 h-3.5 text-red-500 shrink-0" />
                    Café shake bar + premium VIP changing lounges
                  </li>
                </ul>
              </div>
              <p className="text-[11px] text-neutral-400 mt-6 pt-4 border-t border-red-950/50">
                Our Aurangabad blueprint. High ARPU with personal training & recovery packages.
              </p>
            </div>
          </div>
        </div>

        {/* Application Form & Direct Connect */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-5 p-6 rounded-2xl bg-neutral-950/80 border border-neutral-900 space-y-5">
            <span className="text-xs uppercase tracking-widest text-red-500 font-semibold">
              Leadership Connect
            </span>
            <h3 className="text-xl font-bold uppercase text-white">Speak to the Founders</h3>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Franchise applications are directly reviewed by gym owner Amit Singh and our operating lead. We value partners who are passionate about athletics and long-term hospitality.
            </p>
            <div className="pt-4 border-t border-neutral-900 space-y-3">
              <div className="flex items-center gap-3 text-xs text-neutral-300">
                <Briefcase className="w-4 h-4 text-red-500 shrink-0" />
                <span>Franchise Desk: {GYM_CONFIG.franchiseEmail}</span>
              </div>
              <div className="flex items-center gap-3 text-xs text-neutral-300">
                <PhoneCall className="w-4 h-4 text-red-500 shrink-0" />
                <span>Executive Line: {GYM_CONFIG.phoneDisplay} (10 AM - 6 PM)</span>
              </div>
              <div className="flex items-center gap-3 text-xs text-neutral-300">
                <ShieldCheck className="w-4 h-4 text-red-500 shrink-0" />
                <span>Exclusive territorial rights per 4km radius</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7 p-6 sm:p-8 rounded-2xl bg-neutral-950/90 border border-neutral-900 shadow-xl">
            <h3 className="text-lg font-bold uppercase tracking-tight text-white mb-1">
              Submit Franchise Expression of Interest
            </h3>
            <p className="text-xs text-neutral-400 mb-6">
              प्रस्ताव फॉर्म भरें। Our team will send the detailed business pitch deck and financial projection sheet.
            </p>

            {submitted ? (
              <div className="p-8 rounded-xl bg-red-950/30 border border-red-600/40 text-center">
                <CheckCircle className="w-12 h-12 text-emerald-400 mx-auto mb-3" />
                <h4 className="text-lg font-bold text-white uppercase tracking-wider">
                  Expression Registered
                </h4>
                <p className="text-xs text-neutral-300 mt-2 max-w-md mx-auto">
                  Thank you {formData.name}. We have logged your interest for {formData.city}. The project kit will be shared with your contact number within 24 hours.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-neutral-400 mb-1.5 font-semibold">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. Vikramaditya Singh"
                      className="w-full px-4 py-2.5 rounded-lg bg-neutral-900 border border-neutral-800 text-white placeholder-neutral-600 text-sm focus:outline-none focus:border-red-600 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-neutral-400 mb-1.5 font-semibold">
                      Proposed City & State *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      placeholder="e.g. Gaya, Patna, Dehri"
                      className="w-full px-4 py-2.5 rounded-lg bg-neutral-900 border border-neutral-800 text-white placeholder-neutral-600 text-sm focus:outline-none focus:border-red-600 transition-colors"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-neutral-400 mb-1.5 font-semibold">
                      Mobile / WhatsApp *
                    </label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+91 98000 00000"
                      className="w-full px-4 py-2.5 rounded-lg bg-neutral-900 border border-neutral-800 text-white placeholder-neutral-600 text-sm focus:outline-none focus:border-red-600 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-neutral-400 mb-1.5 font-semibold">
                      Available Space
                    </label>
                    <select
                      value={formData.spaceSize}
                      onChange={(e) => setFormData({ ...formData, spaceSize: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-lg bg-neutral-900 border border-neutral-800 text-white text-sm focus:outline-none focus:border-red-600 transition-colors"
                    >
                      <option value="Under 3,000 sq.ft.">Under 3,000 sq.ft.</option>
                      <option value="3,000 - 5,000 sq.ft.">3,000 - 5,000 sq.ft.</option>
                      <option value="5,000 - 8,000 sq.ft.">5,000 - 8,000 sq.ft.</option>
                      <option value="8,000+ sq.ft.">8,000+ sq.ft.</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-neutral-400 mb-1.5 font-semibold">
                      Investment Budget
                    </label>
                    <select
                      value={formData.budget}
                      onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-lg bg-neutral-900 border border-neutral-800 text-white text-sm focus:outline-none focus:border-red-600 transition-colors"
                    >
                      <option value="₹30L - ₹45L">₹30L - ₹45L</option>
                      <option value="₹45L - ₹65L">₹45L - ₹65L</option>
                      <option value="₹65L - ₹1Cr">₹65L - ₹1 Crore</option>
                      <option value="Above ₹1Cr">Above ₹1 Crore</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-neutral-400 mb-1.5 font-semibold">
                    Commercial Property Location / Notes
                  </label>
                  <textarea
                    rows={3}
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    placeholder="Tell us about the property ownership status, nearest landmark, and your background..."
                    className="w-full px-4 py-2.5 rounded-lg bg-neutral-900 border border-neutral-800 text-white placeholder-neutral-600 text-sm focus:outline-none focus:border-red-600 transition-colors resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 px-6 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs uppercase tracking-wider transition-colors flex items-center justify-center gap-2 shadow-lg shadow-red-950/50 cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  Request Franchise Kit · विवरण प्राप्त करें
                </button>
              </form>
            )}
          </div>
        </div>
      </main>

      {/* Consistent Footer */}
      <footer className="border-t border-neutral-900 py-12 px-4 sm:px-8 text-center text-xs text-gray-500 font-mono bg-black">
        <div className="flex items-center justify-center gap-2 mb-3">
          <img src={logoPremium} alt="Vikings Gym" width="20" height="20" className="h-5 w-auto" />
          <span className="font-bold text-white tracking-widest uppercase">VIKINGS GYM & SPA</span>
        </div>
        <p className="max-w-md mx-auto mb-4 text-gray-400">
          {GYM_CONFIG.address} · {GYM_CONFIG.operatingHoursShort}
        </p>
        <div className="flex items-center justify-center gap-4 text-[11px] text-gray-400">
          <Link to="/" className="text-red-500 hover:underline">
            Return to Arena
          </Link>
          <span>•</span>
          <Link to="/facilities" className="hover:text-white">
            Facilities
          </Link>
          <span>•</span>
          <Link to="/memberships" className="hover:text-white">
            Memberships
          </Link>
          <span>•</span>
          <Link to="/contact" className="hover:text-white">
            Contact
          </Link>
        </div>
      </footer>
    </div>
  );
}
