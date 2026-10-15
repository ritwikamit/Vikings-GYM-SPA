import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import {
  ArrowLeft,
  Award,
  Instagram,
  Heart,
  UtensilsCrossed,
  Sparkles,
  Dumbbell,
} from 'lucide-react';
import PublicNavbar from '../components/PublicNavbar';
import photoVaishnavi from '../../assets/trainers/vaishnavi-singh.webp';
import logoPremium from '../../assets/l.webp';
import { GYM_CONFIG } from '../config/gym';
import { usePageSEO } from '../lib/seo';

export default function AmbassadorPage() {
  usePageSEO({
    title: "Brand Ambassador — Vaishnavi Singh | Vikings Gym & Spa Aurangabad",
    description: "Meet Vaishnavi Singh, official Brand Ambassador of Vikings Gym & Spa Aurangabad. Championing strength, nutrition, and discipline for fitness athletes in Bihar.",
    keywords: "vaishnavi singh vikings gym, brand ambassador vikings gym aurangabad, female fitness bihar",
    canonical: "https://www.vikingsgym.in/ambassador",
  });

  return (
    <div className="min-h-screen bg-black text-white flex flex-col font-sans selection:bg-red-600 selection:text-white">
      {/* Full Interactive Navigation Bar */}
      <PublicNavbar />

      {/* Hero Header with Landscaped Photo */}
      <section className="subpage-hero relative w-full h-[320px] sm:h-[420px] overflow-hidden border-b border-red-950/40 flex items-center justify-center" data-subpage-hero="true">
        <img
          src={photoVaishnavi}
          alt="Vaishnavi Singh - Vikings Brand Ambassador"
          className="absolute inset-0 w-full h-full object-cover object-[center_20%]"
        />
        {/* Dark Vignette Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/85 to-black/60" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/95 via-black/40 to-black/95" />
        <motion.div
          initial={{ opacity: 0, y: -60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="relative z-10 max-w-4xl mx-auto px-4 text-center"
        >
          <p className="text-red-500 font-sans font-extrabold text-xs uppercase tracking-[0.2em] mb-2 flex items-center justify-center gap-2">
            <Award className="w-3.5 h-3.5" /> OFFICIAL BRAND AMBASSADOR
          </p>
          <h1 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-white mb-3">
            Vaishnavi <span className="text-red-600">Singh</span>
          </h1>
          <p className="text-sm sm:text-base text-neutral-300 max-w-2xl mx-auto font-medium">
            ब्रांड एंबेसडर · Athlete, Strength Advocate &amp; Founder of @chawal.to.choorma. Inspiring thousands across Bihar to lift heavy, eat real Indian food, and shatter stereotypes.
          </p>
          <div className="mt-4 w-20 h-0.5 bg-red-600 mx-auto" />
        </motion.div>
      </section>

      {/* Main Content */}
      <main className="flex-1 max-w-5xl mx-auto px-4 sm:px-6 py-12 w-full space-y-12">
        {/* Profile Card & Bio */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center p-6 sm:p-8 rounded-2xl bg-neutral-950/90 border border-neutral-900 shadow-2xl">
          <div className="md:col-span-5 relative">
            <div className="w-full aspect-[4/5] rounded-xl overflow-hidden border border-red-950/60 shadow-xl relative group">
              <img
                src={photoVaishnavi}
                alt="Vaishnavi Singh"
                className="w-full h-full object-cover object-[center_15%] group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80" />
              <div className="absolute bottom-4 left-4 right-4">
                <span className="text-[11px] uppercase tracking-widest font-mono text-red-400 font-bold">
                  @chawal.to.choorma
                </span>
                <p className="text-white font-bold text-sm">Athletic Role Model</p>
              </div>
            </div>
          </div>

          <div className="md:col-span-7 space-y-4">
            <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-red-500">
              <Sparkles className="w-4 h-4" /> The Vikings Philosophy
            </div>
            <h2 className="text-2xl sm:text-3xl font-black uppercase text-white tracking-tight">
              Real Nutrition, Relentless Discipline
            </h2>
            <p className="text-neutral-300 text-sm leading-relaxed">
              Fitness shouldn't demand exotic imported supplements or starving yourself on salads. Vaishnavi represents the authentic spirit of Vikings Gym: building lean strength on home-cooked dal, rice, seasonal greens, and disciplined barbell progression.
            </p>
            <p className="text-neutral-400 text-xs leading-relaxed">
              As the face of Vikings Gym & Spa, she advocates for women stepping onto the heavy lifting platform, embracing strength training, and debunking outdated myths about female hypertrophy.
            </p>

            <div className="pt-4 flex flex-wrap gap-4">
              <a
                href={GYM_CONFIG.instagramAmbassador}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 hover:opacity-90 text-white font-bold text-xs uppercase tracking-wider transition-opacity shadow-lg"
              >
                <Instagram className="w-4 h-4" />
                Follow on Instagram
              </a>
              <Link
                to="/memberships"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-white font-bold text-xs uppercase tracking-wider transition-colors"
              >
                Join Her Training Cohort
              </Link>
            </div>
          </div>
        </div>

        {/* Pillars / Values Promoted by Ambassador */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-neutral-950/80 border border-neutral-900">
            <div className="w-10 h-10 rounded-xl bg-red-600/10 border border-red-500/30 text-red-500 flex items-center justify-center mb-4">
              <UtensilsCrossed className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white uppercase tracking-wide mb-2">
              Indian Kitchen Fuel
            </h3>
            <p className="text-xs text-neutral-400 leading-relaxed">
              From sattu shakes and paneer parathas to wholesome choorma: demonstrating how everyday Bihari diets provide complete protein and energy for high-volume lifting.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-neutral-950/80 border border-neutral-900">
            <div className="w-10 h-10 rounded-xl bg-red-600/10 border border-red-500/30 text-red-500 flex items-center justify-center mb-4">
              <Dumbbell className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white uppercase tracking-wide mb-2">
              Women on the Barbell
            </h3>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Pioneering dedicated morning and evening barbell orientation clinics for female members, making deadlifts and squats a natural part of everyday fitness.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-neutral-950/80 border border-neutral-900">
            <div className="w-10 h-10 rounded-xl bg-red-600/10 border border-red-500/30 text-red-500 flex items-center justify-center mb-4">
              <Heart className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white uppercase tracking-wide mb-2">
              Holistic Recovery
            </h3>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Championing our Moroccan steam spa, hydro-recovery showers, and proper sleep cycles as foundational components of mental resilience and hormonal balance.
            </p>
          </div>
        </div>

        {/* Community Impact Quote */}
        <div className="p-8 rounded-2xl bg-gradient-to-br from-neutral-950 via-red-950/20 to-neutral-950 border border-red-950/40 relative overflow-hidden">
          <div className="relative z-10 max-w-3xl">
            <span className="text-3xl font-serif text-red-500 leading-none">“</span>
            <blockquote className="text-base sm:text-lg text-neutral-200 font-medium italic mt-2 leading-relaxed">
              ताकत किसी शहर या जेंडर की मोहताज नहीं होती। जब आप बारबेल उठाते हैं, तो सिर्फ वजन नहीं उठता—आपका आत्म-सम्मान और आत्मविश्वास बढ़ता है। Vikings Gym Aurangabad is where we turn that belief into daily iron reality.
            </blockquote>
            <div className="mt-4 flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-red-600 text-white font-black text-xs flex items-center justify-center">
                VS
              </div>
              <div>
                <p className="text-xs font-bold uppercase text-white tracking-wider">Vaishnavi Singh</p>
                <p className="text-[11px] text-red-400">Vikings Gym Brand Ambassador</p>
              </div>
            </div>
          </div>
        </div>

        {/* Membership CTA */}
        <div className="text-center p-8 rounded-2xl bg-neutral-950 border border-neutral-900">
          <h3 className="text-xl font-black uppercase text-white tracking-tight">
            Ready to Begin Your Transformation?
          </h3>
          <p className="text-xs text-neutral-400 mt-2 max-w-md mx-auto">
            Join the community of driven athletes at Vikings Gym & Spa today.
          </p>
          <div className="mt-5 flex justify-center gap-4">
            <Link
              to="/memberships"
              className="px-6 py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs uppercase tracking-wider transition-colors shadow-lg shadow-red-950/50"
            >
              Explore Membership Tiers
            </Link>
            <Link
              to="/contact"
              className="px-6 py-3 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-white font-bold text-xs uppercase tracking-wider transition-colors"
            >
              Book a Tour
            </Link>
          </div>
        </div>
      </main>

      {/* Consistent Footer */}
      <footer className="border-t border-neutral-900 py-12 px-4 sm:px-8 text-center text-xs text-gray-500 font-mono bg-black">
        <div className="flex items-center justify-center gap-2 mb-3">
          <img src={logoPremium} alt="Vikings Gym" className="h-5 w-auto" />
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
          <Link to="/trainers" className="hover:text-white">
            Trainers
          </Link>
          <span>•</span>
          <Link to="/memberships" className="hover:text-white">
            Memberships
          </Link>
        </div>
      </footer>
    </div>
  );
}
