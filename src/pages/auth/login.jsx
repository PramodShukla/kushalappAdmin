import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Phone, Lock, Eye, EyeOff } from "lucide-react";

import { adminLogin } from "../../services/authApi";
import { setAuth } from "../../utils/auth";
export default function Login() {
  const navigate = useNavigate();

  /* ================= STATES ================= */
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  /* ================= LOGIN ================= */
  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError("");

      const res = await adminLogin({
        phone,
        password,
      });

      setAuth(res);

      navigate("/dashboard");
    } catch (err) {
      setError(err.message || "Invalid phone or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen w-screen flex overflow-hidden">
      {/* ================= LEFT SIDE (IMAGE / BRANDING) ================= */}
      <div
        className="
        hidden md:flex
        w-1/2
        items-center justify-center
        bg-cover bg-center
        relative
      "
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1724185894466-11500ac8999b?q=80&w=1600&auto=format&fit=crop')",
        }}
      >
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/40" />

        {/* Text */}
        <div className="relative z-10 text-white text-center px-10">
          <h1 className="text-4xl font-bold mb-4">Admin Panel</h1>
          <p className="text-lg opacity-90">
            Manage categories, users & services easily
          </p>
        </div>
      </div>

      {/* ================= RIGHT SIDE (FORM) ================= */}
      <div
        className="
      w-full md:w-1/2
      flex items-center justify-center
      bg-gray-50 dark:bg-slate-900
      p-8
    "
      >
        {/* FORM CARD */}
        <div
          className="
        w-full
        max-w-xl
        bg-white dark:bg-slate-800
        rounded-2xl
        shadow-2xl
        p-12
        space-y-8
      "
        >
          <div className="text-center">
            <h2 className="text-3xl font-bold dark:text-white">
              Welcome Back 👋
            </h2>
            <p className="text-gray-500 text-sm mt-2">Sign in to continue</p>
          </div>

          {/* ERROR */}
          {error && (
            <div className="text-sm text-red-600 bg-red-100 p-3 rounded-lg text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-6">
            {/* PHONE */}
            <div className="relative">
              <Phone className="absolute top-3 left-3 w-5 h-5 text-gray-400" />
              <input
                type="tel"
                placeholder="Mobile Number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-lg border focus:ring-2 focus:ring-blue-500 outline-none dark:bg-slate-700 dark:text-white"
                required
              />
            </div>

            {/* PASSWORD */}
            <div className="relative">
              <Lock className="absolute top-3 left-3 w-5 h-5 text-gray-400" />

              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-10 py-3 rounded-lg border focus:ring-2 focus:ring-blue-500 outline-none dark:bg-slate-700 dark:text-white"
                required
              />

              <button
                type="button"
                className="absolute right-3 top-3"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {/* BUTTON */}
            <button
              disabled={loading}
              className="w-full py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold transition"
            >
              {loading ? "Signing in..." : "Login"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
