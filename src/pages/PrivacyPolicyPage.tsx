import React from "react";
import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { ArrowLeft, ShieldCheck, Lock, EyeOff, Database, Mail } from "lucide-react";
import PublicNavbar from "../components/PublicNavbar";
import logoPremium from "../../assets/l.webp";
import { GYM_CONFIG } from "../config/gym";
import { receptionWide } from "../assets/gymImages";

export default function PrivacyPolicyPage() {
  return (
    <div className="bg-black text-gray-200 min-h-screen font-sans selection:bg-red-600 selection:text-white flex flex-col">
      {/* Full Interactive Navigation Bar */}
      <PublicNavbar />

      {/* Hero Header with Landscaped Photo Background & Dark Overlay */}
      <header className="subpage-hero relative py-14 sm:py-20 px-4 sm:px-6 border-b border-red-950/40 overflow-hidden" data-subpage-hero="true">
        {/* Landscaped Background Image (No Zoom) */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          <img
            src={receptionWide}
            alt="Vikings Reception Lounge"
            className="w-full h-full object-cover"
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
          <div className="inline-flex items-center gap-2 text-red-500 font-sans text-xs font-bold uppercase tracking-widest mb-3">
            <ShieldCheck className="w-4 h-4 text-red-500" />
            OFFICIAL DATA GOVERNANCE
          </div>
          <h1 className="text-3xl sm:text-5xl font-sans font-black text-white uppercase tracking-tight mb-4 drop-shadow-[0_4px_24px_rgba(0,0,0,0.95)]">
            PRIVACY POLICY
          </h1>
          <p className="text-gray-200 text-sm sm:text-base max-w-xl mx-auto leading-relaxed drop-shadow-[0_2px_10px_rgba(0,0,0,0.95)] font-medium">
            Your personal privacy, biometric integrity, and digital security are fundamental at Vikings Gym & Spa. Here is our straightforward policy.
          </p>
          <div className="w-16 h-1 bg-red-600 mx-auto mt-6 rounded shadow-[0_0_12px_rgba(239,68,68,0.7)]"></div>
        </motion.div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 py-10 sm:py-14 w-full">

        <div className="space-y-8 bg-neutral-950/60 border border-neutral-850 p-6 sm:p-10 rounded-2xl shadow-xl">
          {/* Section 1 */}
          <section className="space-y-3">
            <div className="flex items-center gap-3 text-red-500 font-sans text-base font-bold uppercase">
              <Database className="w-5 h-5 shrink-0" />
              <h2>1. Information We Collect</h2>
            </div>
            <p className="text-gray-300 text-sm leading-relaxed pl-8">
              When you enroll in membership or submit an inquiry at Vikings Gym & Spa, we collect only essential records: your full legal name, phone number, email address, emergency contact, date of birth, and timestamped attendance access logs. This data is strictly utilized to operate gym access, manage billing plans, and ensure emergency medical safety.
            </p>
          </section>

          {/* Section 2 */}
          <section className="space-y-3">
            <div className="flex items-center gap-3 text-red-500 font-sans text-base font-bold uppercase">
              <EyeOff className="w-5 h-5 shrink-0" />
              <h2>2. Zero Third-Party Data Selling Pledge</h2>
            </div>
            <p className="text-gray-300 text-sm leading-relaxed pl-8">
              We uphold a strict zero-compromise policy: we never sell, lease, monetize, or trade your contact details or workout information to third-party telemarketers, insurance brokers, or external advertising syndicates. Any communications from Vikings Gym & Spa are strictly related to your membership renewal, class schedules, or facility operational announcements.
            </p>
          </section>

          {/* Section 3 */}
          <section className="space-y-3">
            <div className="flex items-center gap-3 text-red-500 font-sans text-base font-bold uppercase">
              <Lock className="w-5 h-5 shrink-0" />
              <h2>3. Facility CCTV & Biometric Security Standards</h2>
            </div>
            <p className="text-gray-300 text-sm leading-relaxed pl-8">
              High-definition Closed-Circuit Television (CCTV) cameras operate 24/7 across primary training arenas, free-weight floors, reception lobbies, and entrance corridors solely for asset security, theft deterrence, and member physical safety. Changing suites, restrooms, shower rooms, and private Moroccan steam spa cabins have strictly zero surveillance equipment.
            </p>
          </section>

          {/* Section 4 */}
          <section className="space-y-3">
            <div className="flex items-center gap-3 text-red-500 font-sans text-base font-bold uppercase">
              <ShieldCheck className="w-5 h-5 shrink-0" />
              <h2>4. Data Retention, Correction & Erasure Rights</h2>
            </div>
            <p className="text-gray-300 text-sm leading-relaxed pl-8">
              You maintain full authority over your data. You may inspect, modify, or permanently request the erasure of your personal records from our member registry upon membership expiry by contacting our front desk administration or messaging us via WhatsApp.
            </p>
          </section>

          {/* Section 5 */}
          <section className="space-y-3">
            <div className="flex items-center gap-3 text-red-500 font-sans text-base font-bold uppercase">
              <Mail className="w-5 h-5 shrink-0" />
              <h2>5. Contacting Our Data Privacy Desk</h2>
            </div>
            <p className="text-gray-300 text-sm leading-relaxed pl-8">
              If you have inquiries regarding our data handling or wish to update your records, please contact our administration at:
            </p>
            <div className="ml-8 p-4 rounded-xl bg-neutral-900 border border-neutral-800 text-xs text-gray-300 space-y-1">
              <p><strong className="text-white">Facility:</strong> {GYM_CONFIG.name}</p>
              <p><strong className="text-white">Address:</strong> {GYM_CONFIG.address}</p>
              <p><strong className="text-white">Direct Line:</strong> {GYM_CONFIG.phoneDisplay}</p>
              <p><strong className="text-white">Governance:</strong> Digital Personal Data Protection (DPDP) Act Aligned</p>
            </div>
          </section>

          <div className="pt-6 border-t border-neutral-850 flex items-center justify-between text-xs text-gray-500">
            <span>Effective Date: October 2026</span>
            <span>Document Revision: 2.1</span>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-neutral-900 bg-neutral-950 py-8 px-6 text-center text-xs text-gray-500">
        <div className="flex flex-wrap items-center justify-center gap-6 mb-4 font-sans font-bold text-gray-400">
          <Link to="/" className="hover:text-red-500 transition-colors">Home</Link>
          <span>·</span>
          <Link to="/privacy" className="text-red-500">Privacy Policy</Link>
          <span>·</span>
          <Link to="/terms" className="hover:text-red-500 transition-colors">Terms & Conditions</Link>
          <span>·</span>
          <Link to="/cookies" className="hover:text-red-500 transition-colors">Cookies Policy</Link>
        </div>
        <p>© {new Date().getFullYear()} Vikings Gym & Spa. All rights reserved.</p>
      </footer>
    </div>
  );
}
