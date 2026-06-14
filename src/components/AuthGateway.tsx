import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { 
  Lock, 
  Mail, 
  ArrowLeft,
  LogIn,
  UserPlus
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { authAPI } from "../api";

interface AuthGatewayProps {
  onLoginSuccess: (role: string) => void;
  onBackToWebsite: () => void;
}

export default function AuthGateway({ onLoginSuccess, onBackToWebsite }: AuthGatewayProps) {
  const { login } = useAuth();
  const [isLoginView, setIsLoginView] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // Register fields
  const [regName, setRegName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPhone, setRegPhone] = useState("");
  const [regPassword, setRegPassword] = useState("");

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setLoading(true);

    try {
      const loggedInUser = await login(email, password);
      onLoginSuccess(loggedInUser.role);
    } catch (err: any) {
      setErrorMessage(err.response?.data?.message || "Invalid credentials provided.");
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setLoading(true);

    try {
      // Register the member using the backend API
      const res = await authAPI.register({ 
        email: regEmail, 
        password: regPassword, 
        name: regName, 
        phone: regPhone,
        role: "MEMBER" // Explicitly request member role
      });
      
      // Auto-login upon successful registration
      const loggedInUser = await login(regEmail, regPassword);
      onLoginSuccess(loggedInUser.role);
    } catch (err: any) {
      if (!err.response) {
        setErrorMessage("Network error: Cannot reach the server. Please ensure the backend is running and the API URL is correct.");
      } else {
        setErrorMessage(err.response?.data?.message || "Registration failed. Email may already exist.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-black min-h-screen text-gray-200 flex flex-col justify-center items-center px-4 py-8 relative selection:bg-red-650 selection:text-white">
      <div className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_center,rgba(225,29,72,0.06),transparent_60%)]"></div>
      <div className="absolute inset-0 opacity-[0.03] bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:24px_24px]"></div>

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
                      className="text-[10px] text-gray-500 hover:text-red-500 font-mono transition-all cursor-pointer"
                    >
                      FORGOT PASSWORD?
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-red-600 hover:bg-red-700 text-black py-2.5 rounded font-mono font-bold text-xs tracking-widest transition-all uppercase flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {loading ? "VERIFYING..." : <>VERIFY & LOG IN <LogIn className="w-3.5 h-3.5" /></>}
                </button>
              </form>

              <div className="text-center mt-6">
                <span className="text-xs text-gray-500 font-sans">New to Vikings? </span>
                <button
                  onClick={() => setIsLoginView(false)}
                  className="text-xs text-red-500 hover:text-red-400 font-bold hover:underline transition-all cursor-pointer"
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

                <div>
                  <label className="block text-[10px] font-mono text-gray-400 mb-1 uppercase">Password</label>
                  <input
                    type="password"
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    className="w-full bg-black/40 border border-neutral-850 px-3 py-2 rounded text-xs text-white focus:border-red-650 focus:outline-none"
                    placeholder="••••••••••••"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-red-600 hover:bg-red-700 text-black py-2.5 rounded font-mono font-bold text-xs tracking-widest transition-all uppercase flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {loading ? "PROCESSING..." : <>CREATE ACCOUNT <UserPlus className="w-3.5 h-3.5" /></>}
                </button>
              </form>

              <div className="text-center mt-4">
                <span className="text-xs text-gray-500 font-sans">Already signed up? </span>
                <button
                  onClick={() => setIsLoginView(true)}
                  className="text-xs text-red-500 hover:text-red-400 font-bold hover:underline transition-all cursor-pointer"
                >
                  Back to Log In
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
