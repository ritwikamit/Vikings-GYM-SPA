import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
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

declare global {
  interface Window {
    google?: any;
    FB?: any;
  }
}

interface AuthGatewayProps {
  onLoginSuccess: (role: string) => void;
  onBackToWebsite: () => void;
}

export default function AuthGateway({ onLoginSuccess, onBackToWebsite }: AuthGatewayProps) {
  const { login, loginWithTokens } = useAuth();
  const location = useLocation();
  const [isLoginView, setIsLoginView] = useState(() => {
    return new URLSearchParams(location.search).get("view") !== "register";
  });

  useEffect(() => {
    setIsLoginView(new URLSearchParams(location.search).get("view") !== "register");
  }, [location.search]);
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [resetLink, setResetLink] = useState("");
  const [loading, setLoading] = useState(false);
  const [socialLoading, setSocialLoading] = useState<"" | "google" | "facebook">("");

  // Register fields
  const [regName, setRegName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPhone, setRegPhone] = useState("");
  const [regPassword, setRegPassword] = useState("");

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");
    setLoading(true);

    try {
      const loggedInUser = await login(email, password);
      onLoginSuccess(loggedInUser.role);
    } catch (err: any) {
      if (!err.response) {
        setErrorMessage("Network error: Cannot reach the server. Please ensure the backend is running and the API URL is correct.");
      } else {
        setErrorMessage(err.response?.data?.message || "Invalid credentials provided.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");
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

  const handleForgotPassword = async () => {
    setErrorMessage("");
    setSuccessMessage("");
    setResetLink("");
    
    if (!email) {
      setErrorMessage("Please enter your registered email address first.");
      return;
    }

    setLoading(true);
    try {
      const res = await authAPI.forgotPassword(email);
      const link = res.data?.data?.reset_link;
      if (link) {
        setResetLink(link);
        setSuccessMessage("Email delivery isn't configured yet. Use this reset link:");
      } else {
        setSuccessMessage("If your email is registered, you will receive a reset link shortly.");
      }
    } catch (err: any) {
      if (!err.response) {
        setErrorMessage("Network error: Cannot reach the server.");
      } else {
        setErrorMessage(err.response?.data?.message || "Failed to process request.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLogin = async (provider: "google" | "facebook", token: string) => {
    setErrorMessage("");
    setSuccessMessage("");
    setSocialLoading(provider);
    try {
      const res = provider === "google"
        ? await authAPI.googleLogin(token)
        : await authAPI.facebookLogin(token);
      const user = loginWithTokens(res.data.data);
      onLoginSuccess(user.role);
    } catch (err: any) {
      setErrorMessage(err.response?.data?.message || "Social login failed. Please try again.");
    } finally {
      setSocialLoading("");
    }
  };

  const handleGoogleLogin = () => {
    if (!window.google) {
      setErrorMessage("Google sign-in is not configured yet (add VITE_GOOGLE_CLIENT_ID).");
      return;
    }
    window.google.accounts.id.initialize({
      client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
      callback: (payload: any) => handleSocialLogin("google", payload.credential),
    });
    window.google.accounts.id.prompt();
  };

  const handleFacebookLogin = () => {
    if (!window.FB) {
      setErrorMessage("Facebook login is not configured yet (add VITE_FACEBOOK_APP_ID).");
      return;
    }
    window.FB.login((response: any) => {
      if (response.authResponse) {
        handleSocialLogin("facebook", response.authResponse.accessToken);
      } else {
        setErrorMessage("Facebook login was cancelled.");
      }
    }, { scope: "public_profile,email" });
  };

  // Load social SDKs once on mount
  useEffect(() => {
    const goog = document.createElement("script");
    goog.src = "https://accounts.google.com/gsi/client";
    goog.async = true;
    document.body.appendChild(goog);

    const fbRoot = document.createElement("div");
    fbRoot.id = "fb-root";
    document.body.appendChild(fbRoot);
    const fbScript = document.createElement("script");
    fbScript.src = "https://connect.facebook.net/en_US/sdk.js";
    fbScript.async = true;
    fbScript.defer = true;
    fbScript.setAttribute("crossorigin", "anonymous");
    fbScript.onload = () => {
      window.FB.init({
        appId: import.meta.env.VITE_FACEBOOK_APP_ID || "",
        cookie: true,
        xfbml: true,
        version: "v18.0",
      });
    };
    document.body.appendChild(fbScript);
  }, []);

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
        {successMessage && (
          <div className="p-3 bg-green-500/10 border border-green-500/30 rounded text-xs text-green-400 mb-5 leading-normal">
            <p>{successMessage}</p>
            {resetLink && (
              <a href={resetLink} className="block mt-2 font-mono font-bold text-green-300 underline break-all hover:text-white">
                {resetLink}
              </a>
            )}
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
                      placeholder="Enter your email"
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
                      placeholder="Enter your password"
                      required
                    />
                  </div>
                  <div className="text-right mt-1.5">
                    <button
                      type="button"
                      onClick={handleForgotPassword}
                      disabled={loading}
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

                <div className="flex items-center gap-3 my-4">
                  <div className="flex-1 h-px bg-neutral-800" />
                  <span className="text-[10px] font-mono text-gray-500 uppercase">Or continue with</span>
                  <div className="flex-1 h-px bg-neutral-800" />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={handleGoogleLogin}
                    disabled={socialLoading !== ""}
                    className="flex items-center justify-center gap-2 bg-neutral-950 hover:bg-neutral-900 border border-neutral-800 text-gray-300 py-2.5 rounded text-[11px] font-mono font-bold uppercase transition-all cursor-pointer disabled:opacity-50"
                  >
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
                      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.27-4.74 3.27-8.1z" fill="#4285F4"/>
                      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                      <path d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.06H2.18A10.96 10.96 0 0 0 1 12c0 1.77.43 3.45 1.18 4.94l3.66-2.84z" fill="#FBBC05"/>
                      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
                    </svg>
                    {socialLoading === "google" ? "..." : "Google"}
                  </button>

                  <button
                    type="button"
                    onClick={handleFacebookLogin}
                    disabled={socialLoading !== ""}
                    className="flex items-center justify-center gap-2 bg-[#1877F2] hover:bg-[#166fe5] text-white py-2.5 rounded text-[11px] font-mono font-bold uppercase transition-all cursor-pointer disabled:opacity-50"
                  >
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="#fff">
                      <path d="M22 12.06C22 6.5 17.52 2 12 2S2 6.5 2 12.06c0 5.02 3.66 9.18 8.44 9.94v-7.03H7.9v-2.9h2.54V9.85c0-2.52 1.49-3.91 3.77-3.91 1.09 0 2.23.2 2.23.2v2.47H15.2c-1.24 0-1.63.78-1.63 1.57v1.88h2.78l-.45 2.9h-2.33V22c4.78-.76 8.43-4.92 8.43-9.94z"/>
                    </svg>
                    {socialLoading === "facebook" ? "..." : "Facebook"}
                  </button>
                </div>
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
                      placeholder="Enter your name"
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
                      placeholder="+91 1234567890"
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
                    placeholder="Enter your email"
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
                    placeholder="Enter your password"
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
