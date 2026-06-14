import React, { useState } from "react";
import { StorageManager } from "../data/store";
import { UserRole, User } from "../types";
import { 
  ShieldCheck, 
  ArrowLeft, 
  UserPlus, 
  LogIn, 
  Lock, 
  Mail, 
  Smartphone, 
  ChevronRight, 
  Sparkles,
  RefreshCw
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface AuthGatewayProps {
  onLoginSuccess: (user: User) => void;
  onBackToWebsite: () => void;
}

export default function AuthGateway({ onLoginSuccess, onBackToWebsite }: AuthGatewayProps) {
  const [isLoginView, setIsLoginView] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("password123");
  const [errorMessage, setErrorMessage] = useState("");
  const [infoMessage, setInfoMessage] = useState("");

  // Register state variables
  const [regName, setRegName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPhone, setRegPhone] = useState("");
  const [regGender, setRegGender] = useState("Male");
  const [regHeight, setRegHeight] = useState("175");
  const [regWeight, setRegWeight] = useState("72");
  const [regGoal, setRegGoal] = useState("Muscle Gain");
  const [regReferral, setRegReferral] = useState("");

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    const users = StorageManager.getUsers();
    const match = users.find(u => u.email.toLowerCase() === email.trim().toLowerCase());

    if (match) {
      // In this playground ecosystem, let password pass for demo purposes
      StorageManager.setCurrentUser(match);
      onLoginSuccess(match);
    } else {
      setErrorMessage("No account with that email was registered in database. Try the Quick Demo logins below!");
    }
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setInfoMessage("");

    if (!regName || !regEmail || !regPhone) {
      setErrorMessage("Please complete all required fields (Name, Email, Phone).");
      return;
    }

    const emailCheck = StorageManager.getUsers().some(u => u.email.toLowerCase() === regEmail.toLowerCase());
    if (emailCheck) {
      setErrorMessage("This email is already registered on client ledger.");
      return;
    }

    // 1. Create member in member list
    const newMember = StorageManager.addMember({
      name: regName,
      phone: regPhone,
      email: regEmail,
      dob: "1997-03-15",
      gender: regGender,
      address: "Self-Registered Portal Customer",
      bloodGroup: "B+",
      medicalConditions: "None declared in online form",
      emergencyContactName: "Self Referral",
      emergencyContactPhone: regPhone,
      photoUrl: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&q=80&w=400",
      fitnessGoal: regGoal,
      height: parseFloat(regHeight) || 175,
      weight: parseFloat(regWeight) || 72,
      referralCode: regName.substring(0, 4).toUpperCase() + Math.floor(Math.random() * 89 + 10),
      referredBy: regReferral.trim() || undefined,
      walletCredits: 0
    });

    // 2. Create User account credentials
    const newUser: User = {
      id: "u-usr-" + Date.now(),
      email: regEmail,
      name: regName,
      role: UserRole.MEMBER,
      gym_id: "vikings-gyms",
      branch_id: "b-aurangabad",
      phone: regPhone
    };

    const registered = StorageManager.registerUser(newUser);
    if (registered) {
      // Auto-login the recently registered member!
      StorageManager.setCurrentUser(newUser);

      // Create a default welcoming message
      StorageManager.addNotification(
        newUser.id,
        "Welcome to Vikings Gym!",
        "Your trainee self-service member dashboard is now ready. Visit our Cidco office to scan and activate a membership plan!",
        "Announcement"
      );

      onLoginSuccess(newUser);
    }
  };

  // Demo bypass logins
  const handleFastLogin = (role: UserRole) => {
    const list = StorageManager.getUsers();
    let sample = list.find(u => u.role === role);
    
    // In case no matching user exists, create on the fly (failsafe)
    if (!sample) {
      if (role === UserRole.GYM_OWNER) {
        sample = { id: "u-admin", email: "ritwik014017@gmail.com", name: "Ritwik Singh (Owner)", role: UserRole.GYM_OWNER, gym_id: "vikings-gyms", branch_id: "b-aurangabad" };
        StorageManager.registerUser(sample);
      } else if (role === UserRole.RECEPTIONIST) {
        sample = { id: "u-receptionist", email: "reception@vikings.com", name: "Pooja Sharma (Staff)", role: UserRole.RECEPTIONIST, gym_id: "vikings-gyms", branch_id: "b-aurangabad" };
        StorageManager.registerUser(sample);
      } else if (role === UserRole.TRAINER) {
        sample = { id: "u-trainer-1", email: "thor@vikings.com", name: "Thor Odinson (Trainer)", role: UserRole.TRAINER, gym_id: "vikings-gyms", branch_id: "b-aurangabad" };
        StorageManager.registerUser(sample);
      } else {
        sample = { id: "u-member-1", email: "ragnar@gmail.com", name: "Ragnar Lothbrok (Member)", role: UserRole.MEMBER, gym_id: "vikings-gyms", branch_id: "b-aurangabad" };
        StorageManager.registerUser(sample);
      }
    }

    StorageManager.setCurrentUser(sample);
    onLoginSuccess(sample);
  };

  return (
    <div className="bg-black min-h-screen text-gray-200 flex flex-col justify-center items-center px-4 py-8 relative selection:bg-red-650 selection:text-white">
      {/* Absolute ambient backgrounds */}
      <div className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_center,rgba(225,29,72,0.06),transparent_60%)]"></div>
      <div className="absolute inset-0 opacity-[0.03] bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:24px_24px]"></div>

      {/* Back button */}
      <button 
        onClick={onBackToWebsite}
        className="absolute top-6 left-6 flex items-center gap-2 font-mono text-xs text-gray-400 hover:text-white transition-all cursor-pointer bg-neutral-900/60 border border-neutral-850 px-4 py-2 rounded"
      >
        <ArrowLeft className="w-3.5 h-3.5" /> BACK TO WEBSITE
      </button>

      <div className="w-full max-w-md bg-neutral-900 border border-red-950/40 relative z-10 rounded-xl shadow-2xl p-8 backdrop-blur-md">
        <div className="text-center mb-6">
          <div className="inline-flex bg-red-600 p-2.5 rounded-md mb-3">
            <Lock className="w-5 h-5 text-black stroke-[3]" />
          </div>
          <h2 className="text-xl font-mono font-black text-white uppercase tracking-tight">
            VIKINGS CUSTOMER PORTAL
          </h2>
          <p className="text-[11px] font-mono text-gray-500 mt-1 uppercase">
            ENTERPRISE IDENTITY VERIFICATION
          </p>
        </div>

        {errorMessage && (
          <div className="p-3 bg-red-500/10 border border-red-500/30 rounded text-xs text-red-400 mb-5 leading-normal">
            {errorMessage}
          </div>
        )}

        <AnimatePresence mode="wait">
          {isLoginView ? (
            <motion.div 
              key="login"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
            >
              <form onSubmit={handleLoginSubmit} className="space-y-4">
                <div>
                  <label className="block text-[10px] font-mono text-gray-400 mb-1.5 uppercase">Registered Email</label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-3 w-4 h-4 text-gray-500" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-black/40 border border-neutral-850 pl-11 pr-4 py-2.5 rounded text-xs text-white focus:border-red-650 focus:outline-none"
                      placeholder="e.g. ritwik014017@gmail.com"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-mono text-gray-400 mb-1.5 uppercase">Secure Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-3 w-4 h-4 text-gray-500" />
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full bg-black/40 border border-neutral-850 pl-11 pr-4 py-2.5 rounded text-xs text-white focus:border-red-650 focus:outline-none"
                      placeholder="••••••••••••"
                      required
                    />
                  </div>
                  <div className="text-right mt-1.5">
                    <button
                      type="button"
                      onClick={() => alert("Demo Password Reset: Any registered seed email will bypass verification. Just type the email and press Login!")}
                      className="text-[10px] text-gray-500 hover:text-red-500 font-mono transition-all"
                    >
                      FORGOT PASSWORD?
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-red-600 hover:bg-red-700 text-black py-2.5 rounded font-mono font-bold text-xs tracking-widest transition-all uppercase flex items-center justify-center gap-2 cursor-pointer"
                >
                  VERIFY & LOG IN <LogIn className="w-3.5 h-3.5" />
                </button>
              </form>

              <div className="text-center mt-6">
                <span className="text-xs text-gray-500 font-sans">New to Vikings? </span>
                <button
                  onClick={() => setIsLoginView(false)}
                  className="text-xs text-red-500 hover:text-red-400 font-bold hover:underline transition-all"
                >
                  Create Member Account
                </button>
              </div>
            </motion.div>
          ) : (
            <motion.div 
              key="register"
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
            >
              <form onSubmit={handleRegisterSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-mono text-gray-400 mb-1 uppercase">Full Name</label>
                    <input
                      type="text"
                      value={regName}
                      onChange={(e) => setRegName(e.target.value)}
                      className="w-full bg-black/40 border border-neutral-850 px-3 py-2 rounded text-xs text-white focus:border-red-650 focus:outline-none"
                      placeholder="e.g. Ritwik Singh"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-mono text-gray-400 mb-1 uppercase">Direct Phone</label>
                    <input
                      type="tel"
                      value={regPhone}
                      onChange={(e) => setRegPhone(e.target.value)}
                      className="w-full bg-black/40 border border-neutral-850 px-3 py-2 rounded text-xs text-white focus:border-red-650 focus:outline-none"
                      placeholder="+91..."
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-mono text-gray-400 mb-1 uppercase">Secure Email</label>
                  <input
                    type="email"
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    className="w-full bg-black/40 border border-neutral-850 px-3 py-2 rounded text-xs text-white focus:border-red-650 focus:outline-none"
                    placeholder="name@gmail.com"
                    required
                  />
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="block text-[10px] font-mono text-gray-400 mb-1 uppercase">Gender</label>
                    <select
                      value={regGender}
                      onChange={(e) => setRegGender(e.target.value)}
                      className="w-full bg-black/40 border border-neutral-850 px-2 py-2 rounded text-xs text-white focus:border-red-650 focus:outline-none"
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-mono text-gray-400 mb-1 uppercase">Height (CM)</label>
                    <input
                      type="number"
                      value={regHeight}
                      onChange={(e) => setRegHeight(e.target.value)}
                      className="w-full bg-black/40 border border-neutral-850 px-2 py-2 rounded text-xs text-white focus:border-red-650 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-mono text-gray-400 mb-1 uppercase">Weight (KG)</label>
                    <input
                      type="number"
                      value={regWeight}
                      onChange={(e) => setRegWeight(e.target.value)}
                      className="w-full bg-black/40 border border-neutral-850 px-2 py-2 rounded text-xs text-white focus:border-red-650 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-mono text-gray-400 mb-1 uppercase">Fitness Goal</label>
                    <select
                      value={regGoal}
                      onChange={(e) => setRegGoal(e.target.value)}
                      className="w-full bg-black/40 border border-neutral-850 px-3 py-2 rounded text-xs text-white focus:border-red-650 focus:outline-none"
                    >
                      <option value="Muscle Gain">Muscle Gain</option>
                      <option value="Fat Loss">Fat Loss</option>
                      <option value="Weight Loss">Weight Loss</option>
                      <option value="Strength Training">Strength</option>
                      <option value="General Fitness">General Fitness</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-mono text-gray-400 mb-1 uppercase">Promo/Referral Code</label>
                    <input
                      type="text"
                      value={regReferral}
                      onChange={(e) => setRegReferral(e.target.value)}
                      className="w-full bg-black/40 border border-neutral-850 px-3 py-2 rounded text-xs text-white focus:border-red-650 focus:outline-none"
                      placeholder="e.g. RAGNAR77"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-red-600 hover:bg-red-700 text-black py-2.5 rounded font-mono font-bold text-xs tracking-widest transition-all uppercase flex items-center justify-center gap-2 cursor-pointer"
                >
                  CREATE ACCOUNT <UserPlus className="w-3.5 h-3.5" />
                </button>
              </form>

              <div className="text-center mt-4">
                <span className="text-xs text-gray-500 font-sans">Already signed up? </span>
                <button
                  onClick={() => setIsLoginView(true)}
                  className="text-xs text-red-500 hover:text-red-400 font-bold hover:underline transition-all"
                >
                  Back to Log In
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Demo Fast Login Box */}
        <div className="mt-8 pt-6 border-t border-neutral-850/60">
          <div className="flex items-center gap-1.5 mb-3 text-[10px] font-mono text-gray-500 tracking-wider uppercase justify-center">
            <Sparkles className="w-3 text-red-500" /> INSTANT TESTING DEMO LOGINS:
          </div>
          
          <div className="grid grid-cols-2 gap-2 text-[10px] font-mono">
            <button
              onClick={() => handleFastLogin(UserRole.GYM_OWNER)}
              className="bg-neutral-950 hover:bg-neutral-850 border border-neutral-850 py-2 px-2.5 rounded text-red-400 font-bold text-left hover:border-red-900 transition-all flex items-center justify-between cursor-pointer"
            >
              Owner (Ritwik) <ChevronRight className="w-3 h-3 text-gray-600" />
            </button>

            <button
              onClick={() => handleFastLogin(UserRole.RECEPTIONIST)}
              className="bg-neutral-950 hover:bg-neutral-850 border border-neutral-850 py-2 px-2.5 rounded text-rose-300 font-bold text-left hover:border-red-900 transition-all flex items-center justify-between cursor-pointer"
            >
              Reception (Pooja) <ChevronRight className="w-3 h-3 text-gray-600" />
            </button>

            <button
              onClick={() => handleFastLogin(UserRole.TRAINER)}
              className="bg-neutral-950 hover:bg-neutral-850 border border-neutral-850 py-2 px-2.5 rounded text-amber-500 font-bold text-left hover:border-red-900 transition-all flex items-center justify-between cursor-pointer"
            >
              Trainer (Thor) <ChevronRight className="w-3 h-3 text-gray-600" />
            </button>

            <button
              onClick={() => handleFastLogin(UserRole.MEMBER)}
              className="bg-neutral-950 hover:bg-neutral-850 border border-neutral-850 py-2 px-2.5 rounded text-teal-400 font-bold text-left hover:border-red-900 transition-all flex items-center justify-between cursor-pointer"
            >
              Member (Ragnar) <ChevronRight className="w-3 h-3 text-gray-600" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
