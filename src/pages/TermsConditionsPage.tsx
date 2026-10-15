import React from "react";
import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { ArrowLeft, FileText, Dumbbell, ShieldAlert, HeartPulse, Scale, CheckCircle2 } from "lucide-react";
import PublicNavbar from "../components/PublicNavbar";
import logoPremium from "../../assets/l.webp";
import { GYM_CONFIG } from "../config/gym";
import { deadliftPlatform } from "../assets/gymImages";

export default function TermsConditionsPage() {
  return (
    <div className="bg-black text-gray-200 min-h-screen font-sans selection:bg-red-600 selection:text-white flex flex-col">
      {/* Full Interactive Navigation Bar */}
      <PublicNavbar />

      {/* Hero Header with Landscaped Photo Background & Dark Overlay */}
      <header className="subpage-hero relative py-14 sm:py-20 px-4 sm:px-6 border-b border-red-950/40 overflow-hidden" data-subpage-hero="true">
        {/* Landscaped Background Image (No Zoom) */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          <img
            src={deadliftPlatform}
            alt="Olympic Deadlift Platform"
            width="1920"
            height="500"
            decoding="async"
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
            <FileText className="w-4 h-4 text-red-500" />
            WARRIORS CODE & ARENA RULES
          </div>
          <h1 className="text-3xl sm:text-5xl font-sans font-black text-white uppercase tracking-tight mb-4 drop-shadow-[0_4px_24px_rgba(0,0,0,0.95)]">
            TERMS & CONDITIONS
          </h1>
          <p className="text-gray-200 text-sm sm:text-base max-w-xl mx-auto leading-relaxed drop-shadow-[0_2px_10px_rgba(0,0,0,0.95)] font-medium">
            By accessing Vikings Gym & Spa facilities or securing a membership subscription, members agree to adhere to these community protocols and training standards.
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
              <CheckCircle2 className="w-5 h-5 shrink-0" />
              <h2>1. Membership Enrollment & Access Passes</h2>
            </div>
            <p className="text-gray-300 text-sm leading-relaxed pl-8">
              All memberships at Vikings Gym & Spa are strictly personal, non-transferable, and non-refundable once activated. Members must verify check-in at reception or scan their digital access pass before entering the workout floors or Moroccan steam spa suites. Access is limited to active membership hours (Monday through Saturday, 5:00 AM to 10:00 PM IST).
            </p>
          </section>

          {/* Section 2 */}
          <section className="space-y-3">
            <div className="flex items-center gap-3 text-red-500 font-sans text-base font-bold uppercase">
              <Dumbbell className="w-5 h-5 shrink-0" />
              <h2>2. Training Floor Etiquette, Footwear & Safety</h2>
            </div>
            <p className="text-gray-300 text-sm leading-relaxed pl-8">
              Appropriate athletic attire and clean, closed-toe indoor athletic shoes are mandatory across all training zones. Barefoot lifting is permitted exclusively on deadlift platforms with socks. Members are required to re-rack all dumbbells, barbells, and weight plates to their designated storage stations immediately after each exercise. Barbell safety collars are required for all heavy compound lifts.
            </p>
          </section>

          {/* Section 3 */}
          <section className="space-y-3">
            <div className="flex items-center gap-3 text-red-500 font-sans text-base font-bold uppercase">
              <HeartPulse className="w-5 h-5 shrink-0" />
              <h2>3. Moroccan Steam Spa Protocols & Health Advisories</h2>
            </div>
            <p className="text-gray-300 text-sm leading-relaxed pl-8">
              A preliminary cleansing shower is mandatory before entering the steam room. Due to high thermal intensity, individual steam sessions must not exceed 15–20 minutes. Individuals with acute cardiovascular disorders, uncontrolled hypertension, or pregnancy must consult a physician prior to using steam spa facilities. Ample hydration is advised.
            </p>
          </section>

          {/* Section 4 */}
          <section className="space-y-3">
            <div className="flex items-center gap-3 text-red-500 font-sans text-base font-bold uppercase">
              <ShieldAlert className="w-5 h-5 shrink-0" />
              <h2>4. Membership Freeze, Medical Hold & Transfers</h2>
            </div>
            <p className="text-gray-300 text-sm leading-relaxed pl-8">
              Members with quarterly, half-yearly, or annual plans may request temporary membership holds for documented medical emergencies or official corporate relocation. Written notification must be submitted to the front desk at least 5 business days prior to the desired freeze commencement date.
            </p>
          </section>

          {/* Section 5 */}
          <section className="space-y-3">
            <div className="flex items-center gap-3 text-red-500 font-sans text-base font-bold uppercase">
              <Scale className="w-5 h-5 shrink-0" />
              <h2>5. Conduct, Mutual Respect & Zero-Intimidation Policy</h2>
            </div>
            <p className="text-gray-300 text-sm leading-relaxed pl-8">
              Vikings Gym & Spa enforces a strict zero-ego and zero-intimidation community standard. Harassment, aggressive behavior, unauthorized photography of other members, or malicious damage to calibrated machinery will lead to immediate, irrevocable membership termination without financial reimbursement.
            </p>
          </section>

          <div className="pt-6 border-t border-neutral-850 flex items-center justify-between text-xs text-gray-500">
            <span>Operated by: Vikings Gym & Spa, MG Road, Aurangabad</span>
            <span>Last Updated: October 2026</span>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-neutral-900 bg-neutral-950 py-8 px-6 text-center text-xs text-gray-500">
        <div className="flex flex-wrap items-center justify-center gap-6 mb-4 font-sans font-bold text-gray-400">
          <Link to="/" className="hover:text-red-500 transition-colors">Home</Link>
          <span>·</span>
          <Link to="/privacy" className="hover:text-red-500 transition-colors">Privacy Policy</Link>
          <span>·</span>
          <Link to="/terms" className="text-red-500">Terms & Conditions</Link>
          <span>·</span>
          <Link to="/cookies" className="hover:text-red-500 transition-colors">Cookies Policy</Link>
        </div>
        <p>© {new Date().getFullYear()} Vikings Gym & Spa. All rights reserved.</p>
      </footer>
    </div>
  );
}
