import React from "react";
import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { ArrowLeft, Award, Users, Instagram, CheckCircle, Flame, Heart, Sparkles } from "lucide-react";
import PublicNavbar from "../components/PublicNavbar";
import logoPremium from "../../assets/l.webp";
import { GYM_CONFIG } from "../config/gym";
import { freeWeightsBenches } from "../assets/gymImages";
import photoAmitSingh from "../../assets/trainers/amit-singh.webp";
import photoBittuVerma from "../../assets/trainers/bittu-verma.webp";
import photoAnkitKumar from "../../assets/trainers/ankit-kumar.webp";
import photoAli from "../../assets/trainers/ali.webp";
import photoNeha from "../../assets/trainers/neha-singh.webp";
import photoDeepsikha from "../../assets/trainers/deepsikha.webp";
import { usePageSEO } from "../lib/seo";

export default function TrainersPage() {
  usePageSEO({
    title: "Certified Personal Trainers & Coaches in Aurangabad, Bihar | Vikings Gym",
    description: "Train with Aurangabad's top certified personal trainers and coaches: Amit Singh, Bittu Verma, Ankit Kumar, Ali, Neha Singh, and Deepsikha. Expert guidance for muscle gain, fat loss & powerlifting.",
    keywords: "gym trainer aurangabad, personal trainer aurangabad bihar, female gym trainer aurangabad, best fitness coach aurangabad, weight loss trainer aurangabad",
    canonical: "https://www.vikingsgym.in/trainers",
  });

  const openWhatsApp = (msg: string) => {
    window.open(`https://wa.me/${GYM_CONFIG.whatsapp}?text=${encodeURIComponent(msg)}`, "_blank", "noopener,noreferrer");
  };

  const TRAINERS = [
    {
      name: "Amit Singh",
      hindiRole: "हेड कोच एवं संस्थापक",
      role: "OWNER & HEAD COACH",
      isOwner: true,
      years: "Founder & Master Coach · Vikings Gym & Spa",
      desc: "Gym Owner and passionate Head Coach at Vikings Gym & Spa. Committed to Olympic strength standards, hands-on member mentorship, and building Aurangabad's ultimate fitness arena with uncompromising coaching form.",
      cert: ["Gym Owner", "Head Coach", "Biomechanics & Form", "Olympic Powerlifting"],
      instagram: "https://www.instagram.com/amysinghca2018/",
      instagramHandle: "@amysinghca2018",
      photoUrl: photoAmitSingh,
    },
    {
      name: "Bittu Verma",
      hindiRole: "सीनियर फिटनेस कोच",
      role: "FITNESS & WEIGHT LOSS COACH",
      years: "Turning goals into daily habits",
      desc: "Dedicated fitness coach specializing in fat loss, metabolic conditioning, and structured cardio intervals that keep every member accountable and injury-free.",
      cert: ["Fitness Coaching", "Fat Loss Conditioning", "Metabolic Circuit Training"],
      instagram: "https://www.instagram.com/get_fit_with_bittu/",
      instagramHandle: "@get_fit_with_bittu",
      photoUrl: photoBittuVerma,
    },
    {
      name: "Ankit Kumar",
      hindiRole: "स्ट्रेंथ एंड कंडीशनिंग कोच",
      role: "STRENGTH & CONDITIONING COACH",
      years: "Systematic progressive overload",
      desc: "Full-time strength coach at Vikings Gym & Spa. Coaches members from foundation compound mechanics to competition lifts with disciplined, measurable tracking.",
      cert: ["Strength & Conditioning", "Barbell Mechanics", "Hypertrophy Programming"],
      instagram: "https://www.instagram.com/ankitxn_/",
      instagramHandle: "@ankitxn_",
      photoUrl: photoAnkitKumar,
    },
    {
      name: "Ali",
      hindiRole: "पर्सनल ट्रांसफॉर्मेशन कोच",
      role: "1-ON-1 TRANSFORMATION COACH",
      years: "Targeted body recomposition",
      desc: "Vikings personal coach programming tailored progressive overload, weekly physique audits, and personalized macronutrient targets for serious body transformations.",
      cert: ["Personal Training", "Body Recomposition", "Dietary Planning"],
      instagram: "https://www.instagram.com/ali_trainer/",
      instagramHandle: "@ali_trainer",
      photoUrl: photoAli,
    },
    {
      name: "Neha Singh",
      hindiRole: "महिला फिटनेस ट्रेनर",
      role: "FEMALE FITNESS & STRENGTH COACH",
      years: "Empowering confidence through strength",
      desc: "Female fitness coach at Vikings Gym & Spa who mentors women of all ages in weight training, core stability, and athletic posture in a comfortable, respectful setting.",
      cert: ["Female Strength Training", "Postural Rehabilitation", "Core Conditioning"],
      instagram: "https://www.instagram.com/smiley_lily02/",
      instagramHandle: "@smiley_lily02",
      photoUrl: photoNeha,
    },
    {
      name: "Deepsikha",
      hindiRole: "डांस व एरोबिक्स कोरियोग्राफर",
      role: "DANCE COACH & CHOREOGRAPHER",
      years: "Rhythmic cardiovascular fitness",
      desc: "Energetic dance and aerobics instructor leading dynamic Zumba and choreography sessions that make cardiovascular conditioning fun, social, and exhilarating.",
      cert: ["Dance Choreography", "Group Cardio Aerobics", "Rhythm Conditioning"],
      instagram: "https://www.instagram.com/wanderbiharan/",
      instagramHandle: "@wanderbiharan",
      photoUrl: photoDeepsikha,
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
            src={freeWeightsBenches}
            alt="Vikings Arena Training Floor"
            className="w-full h-full object-cover object-[center_30%]"
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
          <p className="text-red-500 font-sans font-extrabold text-xs tracking-[0.2em] uppercase mb-2">
            प्रमाणित कोच • CHAMPIONSHIP MENTORSHIP
          </p>
          <h1 className="text-3xl sm:text-5xl font-sans font-black text-white uppercase tracking-tight mb-4 drop-shadow-[0_4px_24px_rgba(0,0,0,0.95)]">
            MASTER COACHES &amp; TRAINERS
          </h1>
          <p className="text-gray-200 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed drop-shadow-[0_2px_10px_rgba(0,0,0,0.95)] font-medium">
            हेड कोच अमित सिंह और प्रमाणित फिटनेस ट्रेनर्स के मार्गदर्शन में सुरक्षित, वैज्ञानिक और परिणाम-उन्मुख वर्कआउट। हर सदस्य को सही फॉर्म और सम्मान के साथ गाइड किया जाता है।
          </p>
          <div className="w-16 h-1 bg-red-600 mx-auto mt-6 rounded shadow-[0_0_12px_rgba(239,68,68,0.7)]"></div>
        </motion.div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-16 w-full">
        {/* Coaching Pillars */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-14">
          <div className="p-5 rounded-2xl bg-neutral-950/70 border border-white/5 flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-red-600/15 border border-red-600/30 text-red-500 flex items-center justify-center shrink-0">
              <Flame className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-sans text-sm font-black text-white uppercase">Biomechanic Form Audit</h4>
              <p className="text-xs text-gray-400 mt-1 leading-relaxed">Continuous posture and spinal alignment tracking to prevent common gym injuries.</p>
            </div>
          </div>
          <div className="p-5 rounded-2xl bg-neutral-950/70 border border-white/5 flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-red-600/15 border border-red-600/30 text-red-500 flex items-center justify-center shrink-0">
              <CheckCircle className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-sans text-sm font-black text-white uppercase">Progressive Overload</h4>
              <p className="text-xs text-gray-400 mt-1 leading-relaxed">Weekly volume and resistance milestones tailored to individual member goals.</p>
            </div>
          </div>
          <div className="p-5 rounded-2xl bg-neutral-950/70 border border-white/5 flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-red-600/15 border border-red-600/30 text-red-500 flex items-center justify-center shrink-0">
              <Heart className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-sans text-sm font-black text-white uppercase">Dietary Architecture</h4>
              <p className="text-xs text-gray-400 mt-1 leading-relaxed">Grounded Indian meal planning aligned with authentic caloric and protein requirements.</p>
            </div>
          </div>
        </div>

        {/* Trainers Roster Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 mb-16">
          {TRAINERS.map((t, idx) => (
            <div
              key={idx}
              className={`bg-neutral-950/80 border rounded-2xl overflow-hidden flex flex-col sm:flex-row group transition-all duration-300 ${
                t.isOwner ? "border-red-600/60 shadow-xl shadow-red-950/30" : "border-neutral-850 hover:border-red-600/40"
              }`}
            >
              {/* Photo */}
              <div className="sm:w-2/5 aspect-square sm:aspect-auto sm:h-full bg-neutral-900 overflow-hidden relative min-h-[260px]">
                <img
                  src={t.photoUrl}
                  alt={`${t.name} — coach at Vikings Gym Aurangabad`}
                  loading="lazy"
                  className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent sm:hidden" />
              </div>

              {/* Bio & Details */}
              <div className="sm:w-3/5 p-6 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span className="text-[11px] font-sans font-bold text-red-500 uppercase">
                      {t.role}
                    </span>
                    {t.isOwner && (
                      <span className="px-2 py-0.5 rounded bg-red-600 text-black text-[9px] font-sans font-black tracking-widest uppercase shadow-sm shadow-red-600/40">
                        OWNER
                      </span>
                    )}
                  </div>

                  <h3 className="text-xl font-sans font-black text-white uppercase tracking-tight mb-1 flex items-center justify-between">
                    <span>{t.name}</span>
                    {t.instagram && (
                      <a
                        href={t.instagram}
                        target="_blank"
                        rel="noreferrer"
                        className="text-gray-400 hover:text-white p-1"
                        title={t.instagramHandle}
                      >
                        <Instagram className="w-4 h-4" />
                      </a>
                    )}
                  </h3>

                  <div className="text-[11px] font-sans text-red-400 font-bold mb-3">
                    {t.hindiRole}
                  </div>

                  <p className="text-xs text-gray-300 font-sans leading-relaxed mb-4">
                    {t.desc}
                  </p>
                </div>

                <div>
                  <div className="flex flex-wrap gap-1.5 pt-3 border-t border-white/5 mb-4">
                    {t.cert.map((c, i) => (
                      <span key={i} className="text-[9px] font-mono bg-white/[0.04] text-gray-400 px-2 py-0.5 rounded border border-white/5">
                        {c}
                      </span>
                    ))}
                  </div>

                  <button
                    onClick={() => openWhatsApp(`Hi Vikings Gym & Spa! I'd like to book a 1-on-1 personal training consultation with ${t.name}.`)}
                    className="w-full py-2 px-3 rounded-lg bg-neutral-900 hover:bg-red-600 hover:text-black text-gray-200 font-sans font-bold text-xs uppercase tracking-wider transition-all cursor-pointer text-center"
                  >
                    BOOK 1-ON-1 WITH {t.name.split(" ")[0]} →
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* 1-on-1 Coaching Pricing Banner */}
        <div className="bg-neutral-950 border border-red-950/60 rounded-3xl p-8 sm:p-10 text-center max-w-3xl mx-auto">
          <span className="text-xs font-mono font-bold text-red-500 uppercase tracking-widest mb-2 block">
            DEDICATED 1-ON-1 PERSONAL COACHING
          </span>
          <h2 className="text-2xl sm:text-3xl font-sans font-black text-white uppercase tracking-tight mb-6">
            PERSONAL TRAINING PACKAGES
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-8">
            <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5">
              <span className="block text-xs font-mono text-gray-400 uppercase">1 MONTH</span>
              <span className="block text-2xl font-black text-white my-1">₹7,000</span>
              <span className="text-[10px] text-gray-500">Technique &amp; Base Building</span>
            </div>
            <div className="p-4 rounded-xl bg-red-600/10 border border-red-500/30">
              <span className="block text-xs font-mono text-red-400 uppercase font-bold">2 MONTHS (POPULAR)</span>
              <span className="block text-2xl font-black text-white my-1">₹12,000</span>
              <span className="text-[10px] text-gray-400">Targeted Transformation</span>
            </div>
            <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5">
              <span className="block text-xs font-mono text-gray-400 uppercase">3 MONTHS</span>
              <span className="block text-2xl font-black text-white my-1">₹21,000</span>
              <span className="text-[10px] text-gray-500">Complete Recomposition</span>
            </div>
          </div>

          <button
            onClick={() => openWhatsApp("Hi Vikings Gym & Spa! I want to enroll in Personal Training. Please guide me on coach availability.")}
            className="py-3 px-8 bg-red-600 hover:bg-red-700 text-black font-sans font-black text-xs uppercase tracking-wider rounded-xl transition-all shadow-lg shadow-red-600/30 cursor-pointer"
          >
            ENROLL IN PERSONAL TRAINING
          </button>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-neutral-900 bg-neutral-950 py-8 px-4 sm:px-6 text-center text-xs text-gray-500 font-sans">
        <p>© {new Date().getFullYear()} {GYM_CONFIG.name} — {GYM_CONFIG.address}. All rights reserved.</p>
      </footer>
    </div>
  );
}
