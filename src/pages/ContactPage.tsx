import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import {
  ArrowLeft,
  MapPin,
  Phone,
  Mail,
  Clock,
  Send,
  CheckCircle,
  MessageCircle,
  ExternalLink,
  ShieldCheck,
  Compass,
} from 'lucide-react';
import PublicNavbar from '../components/PublicNavbar';
import { receptionWide } from '../assets/gymImages';
import logoPremium from '../../assets/l.webp';
import { GYM_CONFIG } from '../config/gym';
import { usePageSEO } from '../lib/seo';

export default function ContactPage() {
  usePageSEO({
    title: "Contact Vikings Gym & Spa Aurangabad — Location, Phone, Hours & Free Trial",
    description: "Visit Vikings Gym & Spa on MG Road, Aurangabad, Bihar (Near Overbridge). Call or WhatsApp +91 77649 22023 for a free trial pass, directions & membership enquiries.",
    keywords: "vikings gym contact number, gym near me aurangabad, gym address mg road aurangabad bihar, gym near overbridge aurangabad, gym contact aurangabad",
    canonical: "https://www.vikingsgym.in/contact",
  });

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    interest: 'General Inquiry',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone) return;
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col font-sans selection:bg-red-600 selection:text-white">
      {/* Full Interactive Navigation Bar */}
      <PublicNavbar />

      {/* Hero Header with Landscaped Photo */}
      <section className="subpage-hero relative w-full h-[320px] sm:h-[400px] overflow-hidden border-b border-red-950/40 flex items-center justify-center" data-subpage-hero="true">
        <img
          src={receptionWide}
          alt="Vikings Gym Reception Desk"
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
            <Compass className="w-3.5 h-3.5" /> Direct Front Desk & Arena Location
          </div>
          <h1 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-white mb-3">
            Contact & <span className="text-red-600">Location</span>
          </h1>
          <p className="text-sm sm:text-base text-neutral-300 max-w-2xl mx-auto font-medium">
            सीधा संपर्क और अखाड़ा पता। Visit our facility at Old GT Road Aurangabad or book a personal walkthrough with our floor manager.
          </p>
          <div className="mt-4 w-20 h-0.5 bg-red-600 mx-auto" />
        </motion.div>
      </section>

      {/* Main Content */}
      <main className="flex-1 max-w-6xl mx-auto px-4 sm:px-6 py-12 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Direct Details */}
          <div className="lg:col-span-5 space-y-6">
            <div className="p-6 rounded-2xl bg-neutral-950/90 border border-neutral-900 shadow-xl">
              <h2 className="text-xs uppercase tracking-widest text-red-500 font-semibold mb-2">
                Physical Headquarters · मुख्य पता
              </h2>
              <div className="flex items-start gap-3 mt-4">
                <MapPin className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                <div>
                  <p className="text-white font-bold text-base">{GYM_CONFIG.name}</p>
                  <p className="text-neutral-400 text-sm mt-1 leading-relaxed">
                    {GYM_CONFIG.addressFull}
                  </p>
                  <p className="text-xs text-neutral-500 mt-2">
                    Landmark: {GYM_CONFIG.landmark}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 mt-6 pt-6 border-t border-neutral-900">
                <Clock className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                <div>
                  <p className="text-white font-bold text-sm">Operating Hours · संचालन समय</p>
                  <p className="text-neutral-400 text-xs mt-1">
                    Morning: {GYM_CONFIG.morningBatch}
                    <br />
                    Evening: {GYM_CONFIG.eveningBatch}
                  </p>
                  <p className="text-neutral-500 text-[11px] mt-1">{GYM_CONFIG.sundayHours}</p>
                </div>
              </div>

              <div className="flex items-start gap-3 mt-6 pt-6 border-t border-neutral-900">
                <Phone className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                <div>
                  <p className="text-white font-bold text-sm">Direct Phone & WhatsApp</p>
                  <p className="text-neutral-300 text-sm mt-1 font-mono">{GYM_CONFIG.phoneDisplay} / {GYM_CONFIG.phoneAlternateDisplay}</p>
                  <p className="text-neutral-500 text-xs mt-0.5">Floor Manager on duty during all floor hours</p>
                </div>
              </div>

              <div className="flex items-start gap-3 mt-6 pt-6 border-t border-neutral-900">
                <Mail className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                <div>
                  <p className="text-white font-bold text-sm">Official Email</p>
                  <p className="text-neutral-300 text-sm mt-1 font-mono">{GYM_CONFIG.email}</p>
                </div>
              </div>

              <div className="mt-8 flex gap-3">
                <a
                  href={`https://wa.me/${GYM_CONFIG.whatsapp}?text=Hi%20Vikings%20Gym%20Team%2C%20I%20would%20like%20to%20visit%20the%20gym%20and%20spa.`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider transition-colors shadow-lg shadow-emerald-950/40"
                >
                  <MessageCircle className="w-4 h-4" />
                  WhatsApp Desk
                </a>
                <a
                  href={GYM_CONFIG.facebook}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center gap-1.5 px-4 py-3 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-white font-bold text-xs uppercase tracking-wider transition-colors"
                >
                  <span>Facebook</span>
                  <ExternalLink className="w-3.5 h-3.5 text-neutral-400" />
                </a>
              </div>
            </div>

            <div className="p-5 rounded-xl border border-red-950/30 bg-red-950/10 text-xs text-neutral-400 leading-relaxed flex items-start gap-3">
              <ShieldCheck className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
              <span>
                Safety & Security: Fully air-conditioned floors with continuous RO chilled water, sanitized steam chambers, biometric access turnstiles, and 24/7 CCTV surveillance across all lifting zones.
              </span>
            </div>
          </div>

          {/* Right Column: Contact Form & Map */}
          <div className="lg:col-span-7 space-y-6">
            <div className="p-6 sm:p-8 rounded-2xl bg-neutral-950/90 border border-neutral-900 shadow-xl">
              <h2 className="text-xl font-bold uppercase tracking-tight text-white mb-1">
                Drop an Inquiry · संदेश भेजें
              </h2>
              <p className="text-neutral-400 text-xs mb-6">
                Fill in your details below and our membership coordinator will call or WhatsApp you within 2 business hours.
              </p>

              {submitted ? (
                <div className="p-8 rounded-xl bg-red-950/30 border border-red-600/40 text-center">
                  <CheckCircle className="w-12 h-12 text-emerald-400 mx-auto mb-3" />
                  <h3 className="text-lg font-bold text-white uppercase tracking-wider">
                    Message Received · आपका संदेश प्राप्त हुआ
                  </h3>
                  <p className="text-xs text-neutral-300 mt-2 max-w-md mx-auto">
                    Thank you {formData.name}. Our front desk team has received your query and will reach out to{' '}
                    <span className="text-white font-mono">{formData.phone}</span> shortly.
                  </p>
                  <button
                    onClick={() => {
                      setSubmitted(false);
                      setFormData({ name: '', phone: '', email: '', interest: 'General Inquiry', message: '' });
                    }}
                    className="mt-5 px-5 py-2 text-xs uppercase tracking-wider bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 text-white rounded-lg transition-colors cursor-pointer"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] uppercase tracking-wider text-neutral-400 mb-1.5 font-semibold">
                        Your Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="e.g. Rahul Sharma"
                        className="w-full px-4 py-2.5 rounded-lg bg-neutral-900 border border-neutral-800 text-white placeholder-neutral-600 text-sm focus:outline-none focus:border-red-600 transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] uppercase tracking-wider text-neutral-400 mb-1.5 font-semibold">
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="+91 98765 43210"
                        className="w-full px-4 py-2.5 rounded-lg bg-neutral-900 border border-neutral-800 text-white placeholder-neutral-600 text-sm focus:outline-none focus:border-red-600 transition-colors"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] uppercase tracking-wider text-neutral-400 mb-1.5 font-semibold">
                        Email Address (Optional)
                      </label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="you@domain.com"
                        className="w-full px-4 py-2.5 rounded-lg bg-neutral-900 border border-neutral-800 text-white placeholder-neutral-600 text-sm focus:outline-none focus:border-red-600 transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] uppercase tracking-wider text-neutral-400 mb-1.5 font-semibold">
                        Primary Interest
                      </label>
                      <select
                        value={formData.interest}
                        onChange={(e) => setFormData({ ...formData, interest: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-lg bg-neutral-900 border border-neutral-800 text-white text-sm focus:outline-none focus:border-red-600 transition-colors"
                      >
                        <option value="General Inquiry">General Gym Membership</option>
                        <option value="Personal Training">1-on-1 Personal Training</option>
                        <option value="Spa & Steam Recovery">Spa & Steam Hydrotherapy</option>
                        <option value="Student Pass">Student Concession Plan</option>
                        <option value="Franchise">Franchise / Partnership</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-neutral-400 mb-1.5 font-semibold">
                      Your Query or Message
                    </label>
                    <textarea
                      rows={4}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Ask about floor trial, trainer availability, timings, or corporate batches..."
                      className="w-full px-4 py-2.5 rounded-lg bg-neutral-900 border border-neutral-800 text-white placeholder-neutral-600 text-sm focus:outline-none focus:border-red-600 transition-colors resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3.5 px-6 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs uppercase tracking-wider transition-colors flex items-center justify-center gap-2 shadow-lg shadow-red-950/50 cursor-pointer"
                  >
                    <Send className="w-4 h-4" />
                    Submit Request · अनुरोध भेजें
                  </button>
                </form>
              )}
            </div>

            {/* Embedded Location Map Preview */}
            <div className="p-6 rounded-2xl bg-neutral-950/90 border border-neutral-900 overflow-hidden">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs uppercase tracking-wider text-white font-semibold flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-red-500" /> Aurangabad Location Route
                </span>
                <a
                  href="https://maps.google.com/?q=Vikings+Gym+Aurangabad+Bihar"
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs text-red-400 hover:text-red-300 inline-flex items-center gap-1 font-semibold"
                >
                  Open in Google Maps <ExternalLink className="w-3 h-3" />
                </a>
              </div>
              <div className="w-full h-56 rounded-xl overflow-hidden border border-neutral-800 relative bg-neutral-900">
                <iframe
                  title="Vikings Gym Location"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d115865.05608332152!2d84.30064719602327!3d24.751682703816776!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x398cdb2c79eb46d3%3A0xb5bfaaa1d11ff31f!2sAurangabad%2C%20Bihar!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
                  width="100%"
                  height="100%"
                  style={{ border: 0, filter: 'invert(90%) hue-rotate(180deg) contrast(1.1)' }}
                  loading="lazy"
                />
              </div>
            </div>
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
