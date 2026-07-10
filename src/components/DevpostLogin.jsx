import React, { useState, useEffect } from "react";
import { Mail, Lock, Eye, EyeOff, CheckSquare, Square, Sparkles, MapPin, ArrowLeft } from "lucide-react";
import { sanitizeInput, validateLogin } from "../utils/helpers";
import { HOST_CITIES } from "../utils/constants";

export default function DevpostLogin({ onLoginSuccess, onNavigateBack }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [selectedRole, setSelectedRole] = useState("fan");
  const [errors, setErrors] = useState({});
  const [isValidated, setIsValidated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [isEmailFocused, setIsEmailFocused] = useState(false);
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);

  const [showOAuthModal, setShowOAuthModal] = useState(null); // null | 'google' | 'github'
  const [oauthEmail, setOauthEmail] = useState("");
  const [customOauthEmail, setCustomOauthEmail] = useState(false);

  const [oauthStep, setOauthStep] = useState(1); // 1 | 2
  const [oauthPassword, setOauthPassword] = useState("");
  const [showOauthPassword, setShowOauthPassword] = useState(false);
  const [oauthError, setOauthError] = useState("");

  const [particles, setParticles] = useState([]);
  useEffect(() => {
    const list = Array.from({ length: 12 }).map((_, i) => ({
      id: i,
      left: `${Math.random() * 85 + 5}%`,
      top: `${Math.random() * 85 + 5}%`,
      delay: `${Math.random() * 4}s`,
      scale: Math.random() * 0.8 + 0.4,
    }));
    setParticles(list);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors({});
    setIsValidated(false);

    const { isValid, errors: validationErrors } = validateLogin(email, password);

    if (!isValid) {
      setErrors(validationErrors);
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setIsValidated(true);
      onLoginSuccess({ email: sanitizeInput(email), role: selectedRole });
    }, 1200);
  };

  const handleOAuthLogin = (provider) => {
    setOauthEmail("");
    setOauthPassword("");
    setOauthError("");
    setOauthStep(1);
    setCustomOauthEmail(false);
    setShowOAuthModal(provider);
  };

  const nextOAuthStep = (finalEmail) => {
    const cleanEmail = sanitizeInput(finalEmail);
    if (!cleanEmail) return;
    setOauthEmail(cleanEmail);
    setOauthError("");
    setOauthStep(2);
  };

  const submitOAuthLogin = (e) => {
    if (e) e.preventDefault();
    setOauthError("");
    if (!oauthPassword) {
      setOauthError("Password is required.");
      return;
    }
    if (oauthPassword.length < 6) {
      setOauthError("Password must be at least 6 characters.");
      return;
    }
    
    setShowOAuthModal(null);
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setIsValidated(true);
      onLoginSuccess({ email: oauthEmail, role: selectedRole });
    }, 1200);
  };

  const roleStyles = {
    fan: "bg-emerald-600 text-white ring-2 ring-emerald-600 ring-offset-2 ring-offset-slate-900 border-emerald-500",
    organizer: "bg-purple-600 text-white ring-2 ring-purple-600 ring-offset-2 ring-offset-slate-900 border-purple-500",
    volunteer: "bg-amber-600 text-white ring-2 ring-amber-600 ring-offset-2 ring-offset-slate-900 border-amber-500",
    staff: "bg-yellow-500 text-slate-900 ring-2 ring-yellow-500 ring-offset-2 ring-offset-slate-900 border-yellow-400",
  };

  return (
    <div className="min-h-screen w-full flex flex-col md:flex-row bg-[#0A1524] text-[#F5F3EC] relative overflow-hidden" role="main">
      {/* Loading Overlay */}
      {isLoading && (
        <div className="absolute inset-0 bg-[#0A1524]/85 z-50 flex flex-col items-center justify-center backdrop-blur-md">
          <div className="relative w-16 h-16">
            <div className="absolute inset-0 border-4 border-yellow-500/20 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-t-yellow-500 border-r-emerald-500 rounded-full animate-spin"></div>
          </div>
          <p className="mt-4 text-sm font-semibold tracking-widest text-[#F2B84C] animate-pulse">
            LOADING STADIUMAI PROTOCOLS...
          </p>
        </div>
      )}

      {/* LEFT GRAPHIC PANEL */}
      <div className="w-full md:w-1/2 min-h-[280px] md:min-h-screen relative overflow-hidden flex flex-col justify-between p-6 md:p-12 bg-gradient-to-tr from-[#0F1E33] via-slate-900 to-emerald-950 shadow-2xl border-r border-slate-800">
        <div className="absolute inset-0 pointer-events-none opacity-40">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <line x1="0" y1="0" x2="300" y2="600" stroke="#FFF" strokeWidth="1" className="animate-pulse" opacity="0.1" />
            <circle cx="50%" cy="40%" r="220" fill="none" stroke="rgba(242, 184, 76, 0.08)" strokeWidth="6" />
            <circle cx="50%" cy="40%" r="140" fill="none" stroke="rgba(79, 169, 124, 0.05)" strokeWidth="4" />
          </svg>
        </div>

        {particles.map((p) => (
          <div
            key={p.id}
            className="absolute w-1.5 h-1.5 bg-[#F2B84C] rounded-full pointer-events-none"
            style={{
              left: p.left,
              top: p.top,
              opacity: 0.15,
              transform: `scale(${p.scale})`,
              animation: `pulse-slow 4s ease-in-out infinite`,
              animationDelay: p.delay
            }}
          />
        ))}

        <div className="z-10 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={onNavigateBack}>
            <div className="w-8 h-8 rounded-lg bg-[#F2B84C] flex items-center justify-center font-black text-sm text-[#0A1524] shadow-lg">
              SA
            </div>
            <span className="text-lg font-bold tracking-tight text-white">StadiumAI</span>
          </div>
          <button 
            onClick={onNavigateBack}
            className="flex items-center gap-1 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft size={14} /> Back to Portal
          </button>
        </div>

        <div className="my-auto z-10 space-y-4 max-w-md pt-8 md:pt-0">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-extrabold tracking-widest bg-slate-900 text-[#F2B84C] uppercase border border-slate-800">
            <Sparkles size={11} className="text-[#F2B84C]" /> GenAI Operations Core
          </span>
          <h2 className="text-3xl md:text-5xl font-black text-white leading-tight drop-shadow-lg font-heading">
            FIFA World Cup 2026™ Matchday Suite
          </h2>
          <p className="text-sm text-slate-400 leading-relaxed font-medium">
            Access AI-driven crowd diagnostics, multilingual assistants, step-free access routing, and instant volunteer dispatches in one unified control center.
          </p>
        </div>

        <div className="z-10 pt-4 border-t border-slate-800/80">
          <p className="text-[9px] uppercase font-bold tracking-widest text-[#4FA97C] mb-2 flex items-center gap-1">
            <MapPin size={10} /> Active Host City Grids Configured
          </p>
          <div className="flex flex-wrap gap-x-2 gap-y-1 text-[10px] text-slate-400">
            {HOST_CITIES.map((c, i) => (
              <span key={c} className="font-semibold">
                {c}{i < HOST_CITIES.length - 1 ? " ·" : ""}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* RIGHT FORM CONTAINER (Devpost-Style Layout) */}
      <div className="w-full md:w-1/2 flex flex-col justify-between p-6 md:p-12 bg-slate-950">
        <div className="mb-6 md:my-auto max-w-md w-full mx-auto space-y-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight font-heading">
              Log in to StadiumAI
            </h1>
            <p className="text-xs text-slate-400 mt-1.5">
              Select your matchday profile to dynamically route to your custom dashboard tools.
            </p>
          </div>

          {/* Access Level Selector */}
          <div className="space-y-2">
            <span className="block text-[10px] font-bold tracking-wider uppercase text-slate-500">
              Select Your Access Level
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2" role="radiogroup" aria-label="Access Role Selector">
              {[
                { id: "fan", label: "Fan", desc: "Wayfinding & chat" },
                { id: "organizer", label: "Organizer", desc: "Ops intelligence" },
                { id: "volunteer", label: "Volunteer", desc: "Assignments" },
                { id: "staff", label: "Staff", desc: "Venue alerts" },
              ].map((role) => {
                const isSelected = selectedRole === role.id;
                return (
                  <button
                    key={role.id}
                    type="button"
                    role="radio"
                    aria-checked={isSelected}
                    onClick={() => setSelectedRole(role.id)}
                    className={`flex flex-col items-center justify-center p-2 rounded-xl border text-center transition-all duration-200 focus:outline-none focus:ring-1 focus:ring-[#F2B84C] ${
                      isSelected 
                        ? roleStyles[role.id] 
                        : "border-slate-800 bg-[#0F1E33]/40 text-slate-400 hover:bg-[#0F1E33]/70 hover:text-slate-200"
                    }`}
                  >
                    <span className="font-bold text-xs">{role.label}</span>
                    <span className="text-[8px] mt-0.5 opacity-70 leading-none">{role.desc}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <div className="space-y-1">
              <label htmlFor="email-input" className="block text-[10px] font-bold uppercase tracking-wider text-slate-500">
                Email Address or Username
              </label>
              <div 
                className={`flex items-center gap-2 px-3 py-2.5 rounded-xl bg-slate-900 border transition-all duration-200 ${
                  errors.email 
                    ? "border-rose-500 ring-1 ring-rose-500" 
                    : isEmailFocused 
                      ? "border-[#F2B84C] ring-1 ring-[#F2B84C]" 
                      : "border-slate-800"
                }`}
              >
                <Mail size={16} className={errors.email ? "text-rose-500" : "text-slate-500"} />
                <input
                  id="email-input"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onFocus={() => setIsEmailFocused(true)}
                  onBlur={() => setIsEmailFocused(false)}
                  placeholder="e.g. fan@fifa2026.com"
                  className="w-full bg-transparent text-sm text-white focus:outline-none placeholder-slate-600"
                  aria-required="true"
                  aria-invalid={errors.email ? "true" : "false"}
                />
              </div>
              {errors.email && (
                <p className="text-xs font-semibold text-rose-400 flex items-center gap-1 mt-1 animate-pulse" role="alert">
                  {errors.email}
                </p>
              )}
            </div>

            <div className="space-y-1">
              <div className="flex justify-between items-center">
                <label htmlFor="password-input" className="block text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  Password
                </label>
                <a href="#forgot" className="text-[10px] font-bold text-[#F2B84C] hover:underline focus:outline-none">
                  Forgot Password?
                </a>
              </div>
              <div 
                className={`flex items-center gap-2 px-3 py-2.5 rounded-xl bg-slate-900 border transition-all duration-200 ${
                  errors.password 
                    ? "border-rose-500 ring-1 ring-rose-500" 
                    : isPasswordFocused 
                      ? "border-[#F2B84C] ring-1 ring-[#F2B84C]" 
                      : "border-slate-800"
                }`}
              >
                <Lock size={16} className={errors.password ? "text-rose-500" : "text-slate-500"} />
                <input
                  id="password-input"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => setIsPasswordFocused(true)}
                  onBlur={() => setIsPasswordFocused(false)}
                  placeholder="••••••••"
                  className="w-full bg-transparent text-sm text-white focus:outline-none placeholder-slate-600"
                  aria-required="true"
                  aria-invalid={errors.password ? "true" : "false"}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="text-slate-500 hover:text-white transition-colors focus:outline-none"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && (
                <p className="text-xs font-semibold text-rose-400 flex items-center gap-1 mt-1 animate-pulse" role="alert">
                  {errors.password}
                </p>
              )}
            </div>

            <div className="flex items-center justify-between pt-1">
              <button
                type="button"
                onClick={() => setRememberMe(!rememberMe)}
                className="flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-slate-200 transition-colors focus:outline-none"
                role="checkbox"
                aria-checked={rememberMe}
              >
                {rememberMe ? (
                  <CheckSquare size={16} className="text-[#F2B84C]" />
                ) : (
                  <Square size={16} className="text-slate-600" />
                )}
                Remember me
              </button>
            </div>

            {isValidated && (
              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold" role="status">
                Access granted! Routing security profiles to the World Cup grid...
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3.5 rounded-xl bg-[#F2B84C] text-[#0A1524] font-black text-xs uppercase tracking-widest hover:scale-[1.01] active:scale-95 transition-all focus:outline-none shadow-lg shadow-[#F2B84C]/10 cursor-pointer"
            >
              Authenticate Account
            </button>
          </form>

          {/* Devpost-style Oauth Block */}
          <div className="space-y-3 pt-6 border-t border-slate-900">
            <span className="block text-center text-[9px] font-bold uppercase tracking-widest text-slate-500">
              Or connect with your developer account
            </span>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => handleOAuthLogin("google")}
                className="py-2.5 flex items-center justify-center gap-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-xs font-bold text-slate-300 hover:text-white transition-all focus:outline-none cursor-pointer"
              >
                <svg className="w-3.5 h-3.5 text-slate-400" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12.24 10.285V14.4h6.887c-.648 2.41-2.519 4.114-5.136 4.114-3.478 0-6.3-2.823-6.3-6.3 0-3.478 2.822-6.3 6.3-6.3 1.63 0 3.11.618 4.242 1.62l3.056-3.056C19.117 2.428 15.892 1.5 12.24 1.5 6.42 1.5 1.7 6.22 1.7 12s4.72 10.5 10.54 10.5 c5.8 0 10.54-4.78 10.54-10.5 0-.715-.083-1.4-.24-2.015H12.24z"/>
                </svg>
                Google
              </button>
              <button
                onClick={() => handleOAuthLogin("github")}
                className="py-2.5 flex items-center justify-center gap-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-xs font-bold text-slate-300 hover:text-white transition-all focus:outline-none cursor-pointer"
              >
                <svg className="w-3.5 h-3.5 text-slate-400" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
                </svg>
                GitHub
              </button>
            </div>
          </div>

          <div className="text-center pt-2">
            <p className="text-xs text-slate-500 font-medium">
              Need stadium credentials?{" "}
              <button onClick={() => alert("Sign up panel simulator.")} className="text-[#F2B84C] font-bold hover:underline focus:outline-none">
                Register a new profile
              </button>
            </p>
          </div>
        </div>

        {/* Footer info */}
        <div className="mt-8 border-t border-slate-900 pt-4 flex flex-col sm:flex-row justify-between items-center gap-2">
          <p className="text-[9px] text-slate-600 text-center sm:text-left font-medium">
            © 2026 FIFA World Cup Matchday Core. SSL Connections Enforced.
          </p>
          <div className="flex items-center gap-1 bg-gradient-to-r from-[#F2B84C]/10 to-emerald-500/10 px-2 py-0.5 rounded border border-slate-850 select-none">
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
            </span>
            <span className="text-[9px] font-black text-slate-300 uppercase tracking-wider">
              Secure
            </span>
          </div>
        </div>
      </div>

      {/* OAuth Mock Authenticator Popups */}
      {showOAuthModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
          {showOAuthModal === "google" ? (
            /* Google OAuth Popup Box */
            <div className="w-full max-w-[400px] bg-white text-slate-800 rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col p-8 space-y-6">
              <div className="flex flex-col items-center text-center space-y-2">
                <div className="flex text-2xl font-bold tracking-tight select-none">
                  <span className="text-[#4285F4]">G</span>
                  <span className="text-[#EA4335]">o</span>
                  <span className="text-[#FBBC05]">o</span>
                  <span className="text-[#4285F4]">g</span>
                  <span className="text-[#34A853]">l</span>
                  <span className="text-[#EA4335]">e</span>
                </div>
                {oauthStep === 1 ? (
                  <>
                    <h3 className="text-xl font-bold text-slate-900 font-heading">Sign in</h3>
                    <p className="text-xs text-slate-500">to continue to <span className="font-semibold text-slate-700 font-sans">StadiumAI</span></p>
                  </>
                ) : (
                  <>
                    <h3 className="text-xl font-bold text-slate-900 font-heading">Welcome</h3>
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-xs font-semibold text-slate-700 max-w-[280px] truncate">
                      <div className="w-2 h-2 rounded-full bg-blue-500 shrink-0" />
                      <span>{oauthEmail}</span>
                    </div>
                  </>
                )}
              </div>

              {oauthStep === 1 ? (
                /* Google Step 1: Choose Account */
                <>
                  {!customOauthEmail ? (
                    <div className="space-y-2.5">
                      <button 
                        type="button"
                        onClick={() => nextOAuthStep("safakali@gmail.com")}
                        className="w-full p-3 flex items-center gap-3 rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors text-left text-sm font-semibold text-slate-700 cursor-pointer"
                      >
                        <div className="w-8 h-8 rounded-full bg-[#4285F4]/10 text-[#4285F4] flex items-center justify-center font-bold text-xs shrink-0">
                          SA
                        </div>
                        <div>
                          <p className="leading-tight">safakali@gmail.com</p>
                          <span className="text-[10px] text-slate-400 font-medium">Safak Ali</span>
                        </div>
                      </button>
                      <button 
                        type="button"
                        onClick={() => nextOAuthStep("kjaid0341@gmail.com")}
                        className="w-full p-3 flex items-center gap-3 rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors text-left text-sm font-semibold text-slate-700 cursor-pointer"
                      >
                        <div className="w-8 h-8 rounded-full bg-emerald-600/10 text-emerald-600 flex items-center justify-center font-bold text-xs shrink-0">
                          KJ
                        </div>
                        <div>
                          <p className="leading-tight">kjaid0341@gmail.com</p>
                          <span className="text-[10px] text-slate-400 font-medium">kjaid0341-creator</span>
                        </div>
                      </button>
                      <button 
                        type="button"
                        onClick={() => setCustomOauthEmail(true)}
                        className="w-full py-2.5 flex items-center justify-center gap-2 rounded-xl border border-dashed border-slate-300 hover:bg-slate-50 transition-colors text-xs font-bold text-slate-500 cursor-pointer"
                      >
                        Use another Google account
                      </button>
                    </div>
                  ) : (
                    <form 
                      onSubmit={(e) => { e.preventDefault(); nextOAuthStep(oauthEmail); }}
                      className="space-y-4"
                    >
                      <div className="space-y-1">
                        <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500">
                          Enter Your Gmail Address
                        </label>
                        <input
                          type="email"
                          required
                          value={oauthEmail}
                          onChange={(e) => setOauthEmail(e.target.value)}
                          placeholder="e.g. your-email@gmail.com"
                          className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-900 focus:outline-none focus:border-[#4285F4] focus:ring-1 focus:ring-[#4285F4] placeholder-slate-400"
                        />
                      </div>
                      <div className="flex gap-3 pt-1">
                        <button
                          type="button"
                          onClick={() => setCustomOauthEmail(false)}
                          className="flex-1 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-bold text-slate-500 cursor-pointer"
                        >
                          Back
                        </button>
                        <button
                          type="submit"
                          className="flex-1 py-2.5 rounded-xl bg-[#4285F4] hover:bg-[#357ae8] text-white text-xs font-bold shadow cursor-pointer"
                        >
                          Next
                        </button>
                      </div>
                    </form>
                  )}
                </>
              ) : (
                /* Google Step 2: Enter Password */
                <form onSubmit={submitOAuthLogin} className="space-y-4">
                  <div className="space-y-1">
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500">
                      Enter your password
                    </label>
                    <div className="relative flex items-center">
                      <input
                        type={showOauthPassword ? "text" : "password"}
                        required
                        value={oauthPassword}
                        onChange={(e) => setOauthPassword(e.target.value)}
                        placeholder="Password"
                        className="w-full pl-3 pr-10 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-900 focus:outline-none focus:border-[#4285F4] focus:ring-1 focus:ring-[#4285F4] placeholder-slate-400"
                      />
                      <button
                        type="button"
                        onClick={() => setShowOauthPassword(!showOauthPassword)}
                        className="absolute right-3 text-slate-500 hover:text-slate-700 cursor-pointer"
                      >
                        {showOauthPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                    {oauthError && (
                      <p className="text-xs font-semibold text-rose-600 mt-1 animate-pulse">{oauthError}</p>
                    )}
                  </div>
                  <div className="flex gap-3 pt-1">
                    <button
                      type="button"
                      onClick={() => setOauthStep(1)}
                      className="flex-1 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-bold text-slate-500 cursor-pointer"
                    >
                      Back
                    </button>
                    <button
                      type="submit"
                      className="flex-1 py-2.5 rounded-xl bg-[#4285F4] hover:bg-[#357ae8] text-white text-xs font-bold shadow cursor-pointer"
                    >
                      Sign In
                    </button>
                  </div>
                </form>
              )}

              <div className="text-[9px] text-slate-400 text-center leading-normal max-w-[280px] mx-auto select-none">
                To continue, Google will share your name, email address, language preference, and profile picture with StadiumAI.
              </div>
              
              <button 
                type="button"
                onClick={() => setShowOAuthModal(null)}
                className="text-center text-xs font-bold text-rose-500 hover:underline cursor-pointer"
              >
                Cancel Sign In
              </button>
            </div>
          ) : (
            /* GitHub OAuth Popup Box */
            <div className="w-full max-w-[400px] bg-[#0d1117] text-slate-200 rounded-2xl shadow-2xl border border-slate-800 overflow-hidden flex flex-col p-8 space-y-6">
              <div className="flex flex-col items-center text-center space-y-2">
                <svg className="w-10 h-10 text-slate-100" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
                </svg>
                {oauthStep === 1 ? (
                  <>
                    <h3 className="text-lg font-bold text-white mt-2 font-heading">Authorize StadiumAI</h3>
                    <p className="text-xs text-slate-400">wants to authorize access to your GitHub account</p>
                  </>
                ) : (
                  <>
                    <h3 className="text-lg font-bold text-white mt-2 font-heading">Verify Credentials</h3>
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-xs font-semibold text-slate-300 max-w-[280px] truncate">
                      <div className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                      <span>{oauthEmail}</span>
                    </div>
                  </>
                )}
              </div>

              {oauthStep === 1 ? (
                /* GitHub Step 1: Username/Email */
                <form 
                  onSubmit={(e) => { e.preventDefault(); nextOAuthStep(oauthEmail); }}
                  className="space-y-4"
                >
                  <div className="space-y-1">
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      GitHub Username or Email
                    </label>
                    <input
                      type="text"
                      required
                      value={oauthEmail}
                      onChange={(e) => setOauthEmail(e.target.value)}
                      placeholder="e.g. kjaid0341-creator"
                      className="w-full px-3 py-2.5 rounded-xl bg-[#0d1117] border border-slate-800 text-sm text-white focus:outline-none focus:border-slate-500 focus:ring-1 focus:ring-slate-500 placeholder-slate-700"
                    />
                  </div>
                  
                  <div className="flex flex-col gap-2 pt-2">
                    <button
                      type="submit"
                      className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-widest cursor-pointer shadow-md"
                    >
                      Authorize StadiumAI
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowOAuthModal(null)}
                      className="w-full py-3 rounded-xl bg-slate-900 hover:bg-slate-850 border border-slate-800 text-xs font-bold text-slate-400 cursor-pointer"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                /* GitHub Step 2: Password */
                <form onSubmit={submitOAuthLogin} className="space-y-4">
                  <div className="space-y-1">
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Enter GitHub Password
                    </label>
                    <div className="relative flex items-center">
                      <input
                        type={showOauthPassword ? "text" : "password"}
                        required
                        value={oauthPassword}
                        onChange={(e) => setOauthPassword(e.target.value)}
                        placeholder="GitHub Password"
                        className="w-full pl-3 pr-10 py-2.5 rounded-xl bg-[#0d1117] border border-slate-800 text-sm text-white focus:outline-none focus:border-slate-500 focus:ring-1 focus:ring-slate-500 placeholder-slate-750"
                      />
                      <button
                        type="button"
                        onClick={() => setShowOauthPassword(!showOauthPassword)}
                        className="absolute right-3 text-slate-500 hover:text-slate-300 cursor-pointer"
                      >
                        {showOauthPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                    {oauthError && (
                      <p className="text-xs font-semibold text-rose-400 mt-1 animate-pulse">{oauthError}</p>
                    )}
                  </div>
                  
                  <div className="flex gap-3 pt-1">
                    <button
                      type="button"
                      onClick={() => setOauthStep(1)}
                      className="flex-1 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-850 border border-slate-800 text-xs font-bold text-slate-400 cursor-pointer"
                    >
                      Back
                    </button>
                    <button
                      type="submit"
                      className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold cursor-pointer"
                    >
                      Confirm
                    </button>
                  </div>
                </form>
              )}

              <div className="text-[10px] text-slate-500 text-center leading-relaxed select-none">
                By authorizing, you agree to grant StadiumAI read access to public user details.
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
