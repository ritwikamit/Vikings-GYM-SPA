import { useState, type FormEvent } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { Lock, ArrowLeft, CheckCircle } from "lucide-react";
import { authAPI } from "../api";

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const email = searchParams.get("email") || "";

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    if (!email) {
      setErrorMessage("Missing email. Please use the link from the reset email.");
      return;
    }
    if (newPassword.length < 6) {
      setErrorMessage("Password must be at least 6 characters.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setErrorMessage("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      const res = await authAPI.resetPassword(email, newPassword);
      setSuccessMessage(res.data?.message || "Password reset successfully.");
      setTimeout(() => navigate("/login"), 2000);
    } catch (err: any) {
      setErrorMessage(err.response?.data?.message || "Failed to reset password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-black min-h-screen text-gray-200 flex flex-col justify-center items-center px-4 py-8 relative selection:bg-red-600 selection:text-white">
      <div className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_center,rgba(225,29,72,0.06),transparent_60%)]"></div>

      <Link to="/" className="absolute top-6 left-6 flex items-center gap-2 font-mono text-xs text-gray-400 hover:text-white transition-all cursor-pointer bg-neutral-900/60 border border-neutral-800 px-4 py-2 rounded">
        <ArrowLeft className="w-3.5 h-3.5" /> BACK TO WEBSITE
      </Link>

      <div className="w-full max-w-md bg-neutral-900 border border-red-950/40 relative z-10 rounded-xl shadow-2xl p-8 backdrop-blur-md">
        <div className="text-center mb-6">
          <div className="inline-flex bg-red-600 p-2.5 rounded-md mb-3">
            <Lock className="w-5 h-5 text-black stroke-[3]" />
          </div>
          <h2 className="text-xl font-mono font-black text-white uppercase tracking-tight">
            RESET PASSWORD
          </h2>
          <p className="text-[11px] font-mono text-gray-500 mt-1 uppercase">
            VIKINGS CUSTOMER PORTAL
          </p>
        </div>

        {errorMessage && (
          <div className="bg-rose-600/10 border border-rose-900/40 text-rose-400 text-xs font-mono p-3 rounded mb-4">
            {errorMessage}
          </div>
        )}

        {successMessage ? (
          <div className="bg-emerald-600/10 border border-emerald-900/40 p-6 rounded-lg text-center">
            <CheckCircle className="w-12 h-12 text-emerald-500 mx-auto mb-3" />
            <h4 className="text-white font-mono font-bold text-sm uppercase mb-1">PASSWORD RESET</h4>
            <p className="text-xs text-gray-400">{successMessage}</p>
            <p className="text-[10px] text-gray-500 mt-3">Redirecting to login...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-[10px] font-mono text-gray-400 mb-1.5 uppercase">Account Email</label>
              <input
                type="email"
                value={email}
                readOnly
                className="w-full bg-black/40 border border-neutral-800 px-4 py-2.5 rounded text-xs text-white focus:border-red-600 focus:outline-none opacity-70 cursor-not-allowed"
                placeholder="your@email.com"
              />
            </div>

            <div>
              <label className="block text-[10px] font-mono text-gray-400 mb-1.5 uppercase">New Password</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full bg-black/40 border border-neutral-800 px-4 py-2.5 rounded text-xs text-white focus:border-red-600 focus:outline-none"
                placeholder="Enter your new password"
                required
              />
            </div>

            <div>
              <label className="block text-[10px] font-mono text-gray-400 mb-1.5 uppercase">Confirm New Password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full bg-black/40 border border-neutral-800 px-4 py-2.5 rounded text-xs text-white focus:border-red-600 focus:outline-none"
                placeholder="Re-enter your new password"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-red-600 hover:bg-red-700 text-black py-2.5 rounded font-mono font-bold text-xs tracking-widest transition-all uppercase flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {loading ? "RESETTING..." : "RESET PASSWORD"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}