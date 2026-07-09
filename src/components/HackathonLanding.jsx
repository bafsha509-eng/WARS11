import React from "react";
import { Sparkles, Search, ArrowRight, Award, Trophy, Users, Shield, Compass, ChevronRight } from "lucide-react";

export default function HackathonLanding({ onNavigateToLogin, onNavigateToDashboardDirectly }) {
  const sponsors = [
    { name: "FIFA", logo: "🏆" },
    { name: "Google Cloud", logo: "☁️" },
    { name: "Microsoft", logo: "💻" },
    { name: "AWS", logo: "🍊" },
    { name: "Okta", logo: "🔑" },
    { name: "Atlassian", logo: "💙" }
  ];

  const categories = [
    { name: "Stadium Navigation", count: 12, icon: Compass },
    { name: "Crowd Safety", count: 8, icon: Shield },
    { name: "Accessibility", count: 15, icon: Users },
    { name: "Operational Intelligence", count: 19, icon: Award }
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col relative overflow-hidden bg-grid-pattern">
      {/* Background Glows */}
      <div className="absolute top-20 left-10 w-96 h-96 bg-[#F2B84C]/5 rounded-full blur-3xl pointer-events-none animate-pulse-slow" />
      <div className="absolute top-1/3 right-10 w-96 h-96 bg-[#2E7D5B]/5 rounded-full blur-3xl pointer-events-none animate-pulse-slow" style={{ animationDelay: "2s" }} />

      {/* Devpost-style Header */}
      <header className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-8 flex-1">
            {/* Logo */}
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => onNavigateToDashboardDirectly && onNavigateToDashboardDirectly()}>
              <div className="h-8 w-8 rounded-lg bg-gradient-to-tr from-[#F2B84C] to-[#2E7D5B] flex items-center justify-center font-black text-slate-950 text-base shadow-md">
                SA
              </div>
              <span className="font-extrabold text-xl tracking-tight text-white font-heading">
                Stadium<span className="text-[#F2B84C]">AI</span>
              </span>
              <span className="text-[10px] uppercase font-bold tracking-widest bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded border border-slate-700/50">
                Hackathon Portal
              </span>
            </div>

            {/* Navigation Links */}
            <nav className="hidden lg:flex items-center gap-6 text-sm font-semibold text-slate-300">
              <a href="#about" className="hover:text-white transition-colors">About Solution</a>
              <a href="#features" className="hover:text-white transition-colors">Features</a>
              <a href="#faq" className="hover:text-white transition-colors">FAQ</a>
              <span className="text-slate-700">|</span>
              <span className="text-slate-400 font-medium">FIFA World Cup 2026™ Track</span>
            </nav>
          </div>

          <div className="flex items-center gap-4">
            <button 
              onClick={onNavigateToLogin}
              className="text-sm font-semibold text-slate-300 hover:text-white transition-colors"
            >
              Log in
            </button>
            <button 
              onClick={onNavigateToLogin}
              className="px-4 py-2 text-sm font-bold bg-[#F2B84C] hover:bg-[#C99328] text-slate-950 rounded-lg shadow-md hover:scale-[1.02] active:scale-95 transition-all"
            >
              Sign up
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-20 relative z-10">
        
        {/* Devpost Hero Banner */}
        <section className="text-center py-8 max-w-4xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-gradient-to-r from-[#F2B84C]/10 to-[#2E7D5B]/10 border border-[#F2B84C]/20 rounded-full">
            <Sparkles size={14} className="text-[#F2B84C] animate-pulse" />
            <span className="text-xs font-bold text-[#F2B84C] uppercase tracking-wider">
              Featured FIFA World Cup 2026 Submission
            </span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight leading-[1.1] font-heading">
            Where GenAI meets the <br/>
            <span className="bg-gradient-to-r from-[#F2B84C] via-[#4FA97C] to-emerald-400 bg-clip-text text-transparent drop-shadow-sm">
              World's Biggest Pitch
            </span>
          </h1>

          <p className="text-slate-400 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            StadiumAI is a comprehensive Generative AI assistant built to optimize crowds, guide fans, assist in multiple languages, and manage emergency venue tasks.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <button
              onClick={onNavigateToLogin}
              className="px-6 py-3.5 bg-gradient-to-r from-[#F2B84C] to-[#C99328] text-slate-950 font-extrabold text-sm tracking-wider uppercase rounded-xl shadow-lg shadow-[#F2B84C]/20 hover:scale-[1.01] active:scale-98 transition-all flex items-center justify-center gap-2 group cursor-pointer"
            >
              Launch Dashboard Demo
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </button>
            <a
              href="#featured-solution"
              className="px-6 py-3.5 bg-slate-900 hover:bg-slate-850 text-slate-200 border border-slate-800 font-bold text-sm tracking-wider uppercase rounded-xl transition-all flex items-center justify-center"
            >
              Explore Project Details
            </a>
          </div>
        </section>

        {/* Sponsor Banner */}
        <section className="border-y border-slate-800 py-6">
          <p className="text-center text-[10px] uppercase font-bold tracking-widest text-slate-500 mb-4">
            Trusted Sandbox Partners & Technologies
          </p>
          <div className="flex flex-wrap gap-8 justify-center items-center opacity-65">
            {sponsors.map((s) => (
              <div key={s.name} className="flex items-center gap-1.5 text-sm font-extrabold text-slate-300">
                <span className="text-lg">{s.logo}</span>
                <span>{s.name}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Featured Project Showcase (devpost style) */}
        <section id="featured-solution" className="space-y-6">
          <div className="flex justify-between items-end border-b border-slate-800 pb-4">
            <div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                Featured Project Submission
              </h2>
              <p className="text-sm text-slate-400 mt-1">
                The ultimate companion for stadium volunteers, fans, and operators.
              </p>
            </div>
            <span className="hidden sm:inline-flex items-center gap-1.5 text-xs font-bold text-[#F2B84C] bg-[#F2B84C]/10 border border-[#F2B84C]/20 px-2.5 py-1 rounded-full">
              <Trophy size={12} /> Grand Prize Winner
            </span>
          </div>

          <div className="grid lg:grid-cols-12 gap-8 items-stretch">
            {/* Project Image Panel */}
            <div className="lg:col-span-7 rounded-2xl overflow-hidden bg-slate-900 border border-slate-800 flex flex-col justify-between group shadow-xl">
              <div className="p-8 space-y-4">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-[#2E7D5B]/20 text-[#4FA97C] border border-[#2E7D5B]/30 uppercase">
                    GenAI Core
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-[#F2B84C]/10 text-[#F2B84C] border border-[#F2B84C]/20 uppercase">
                    FIFA World Cup 2026
                  </span>
                </div>
                <h3 className="text-2xl font-bold text-white group-hover:text-[#F2B84C] transition-colors font-heading">
                  StadiumAI — Multi-Role Venue Suite
                </h3>
                <p className="text-slate-400 text-sm leading-relaxed">
                  StadiumAI elevates matchday experiences for fans while empowering venue staff with real-time analytics. Powered by Generative AI, it addresses gate wait times, step-free access routing, multilingual help, and crisis dispatch controls in a single unified dashboard interface.
                </p>
                <div className="flex flex-wrap gap-2 pt-2">
                  {["Vite", "React 19", "TailwindCSS v4", "Recharts", "Lucide Icons"].map((tech) => (
                    <span key={tech} className="text-[10px] font-semibold bg-slate-800 text-slate-300 px-2.5 py-1 rounded-md border border-slate-750">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {/* Mockup preview */}
              <div className="relative border-t border-slate-800/80 bg-slate-950 p-4">
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent z-10 pointer-events-none" />
                <div className="rounded-xl overflow-hidden border border-slate-800/60 shadow-lg relative bg-slate-900 max-h-[220px]">
                  <img
                    src="https://stadium-wars-client.vercel.app/stadium.png"
                    alt="StadiumAI smart map and analytics preview"
                    className="w-full h-auto object-cover opacity-80"
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <button 
                      onClick={onNavigateToLogin}
                      className="px-4 py-2 bg-slate-900/90 text-white font-extrabold text-xs uppercase tracking-widest rounded-lg border border-slate-700 backdrop-blur shadow-2xl hover:scale-105 active:scale-95 transition-all"
                    >
                      Enter Interactive App
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Project Details Columns */}
            <div className="lg:col-span-5 flex flex-col justify-between gap-6">
              {/* Feature 1 */}
              <div className="bg-slate-900/60 border border-slate-800 p-6 rounded-2xl flex gap-4">
                <div className="h-10 w-10 rounded-xl bg-[#2E7D5B]/20 flex items-center justify-center shrink-0 text-[#4FA97C]">
                  <Trophy size={20} />
                </div>
                <div>
                  <h4 className="font-bold text-white text-base">Crowd Congestion Prevention</h4>
                  <p className="text-slate-400 text-xs mt-1 leading-relaxed">
                    Visualizes real-time gate capacities via a live SVG Stadium Bowl heatmap. Automatically suggests alternative entries.
                  </p>
                </div>
              </div>

              {/* Feature 2 */}
              <div className="bg-slate-900/60 border border-slate-800 p-6 rounded-2xl flex gap-4">
                <div className="h-10 w-10 rounded-xl bg-[#F2B84C]/20 flex items-center justify-center shrink-0 text-[#F2B84C]">
                  <Sparkles size={20} />
                </div>
                <div>
                  <h4 className="font-bold text-white text-base">Multilingual GenAI Assistant</h4>
                  <p className="text-slate-400 text-xs mt-1 leading-relaxed">
                    Concierge answering restroom waits, accessible routes, and logistics queries in English, Spanish, French, and Hindi.
                  </p>
                </div>
              </div>

              {/* Feature 3 */}
              <div className="bg-slate-900/60 border border-slate-800 p-6 rounded-2xl flex gap-4">
                <div className="h-10 w-10 rounded-xl bg-purple-500/20 flex items-center justify-center shrink-0 text-purple-400">
                  <Users size={20} />
                </div>
                <div>
                  <h4 className="font-bold text-white text-base">3 Role-Based Portals</h4>
                  <p className="text-slate-400 text-xs mt-1 leading-relaxed">
                    Custom interfaces designed for Fans (Wayfinding), Organizers (Analytics), and Volunteers (Incident Dispatch logs).
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Project Categories */}
        <section className="space-y-6">
          <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
            Explore Solutions by Hackathon Category
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {categories.map((c) => {
              const Icon = c.icon;
              return (
                <div 
                  key={c.name}
                  onClick={onNavigateToLogin}
                  className="bg-slate-900 border border-slate-800 p-5 rounded-xl hover:border-slate-700 hover:bg-slate-850 cursor-pointer transition-all duration-200 group flex items-start gap-4"
                >
                  <div className="h-8 w-8 rounded-lg bg-slate-850 flex items-center justify-center group-hover:bg-[#F2B84C]/10 text-slate-400 group-hover:text-[#F2B84C] transition-colors shrink-0">
                    <Icon size={16} />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-slate-200 group-hover:text-white">{c.name}</h4>
                    <span className="text-[10px] text-slate-500 font-semibold uppercase mt-1 block">
                      {c.count} active prototypes
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* About StadiumAI */}
        <section id="about" className="grid md:grid-cols-2 gap-10 items-center">
          <div className="space-y-4">
            <span className="text-xs font-bold text-[#4FA97C] tracking-widest uppercase">The Challenge</span>
            <h2 className="text-3xl font-extrabold text-white tracking-tight font-heading">
              Managing FIFA World Cup 2026 Grid Operations
            </h2>
            <p className="text-slate-400 text-sm leading-relaxed">
              With 104 matches across 16 host cities in Canada, Mexico, and the United States, managing crowd flow and security in giant stadiums is a monumental challenge. Language barriers, accessibility needs, and bottleneck entries often delay fans. 
            </p>
            <p className="text-slate-400 text-sm leading-relaxed">
              Our GenAI-enabled system acts as an operational middleware, transforming sensory data (turnstiles, CCTV estimations, and schedules) into instant suggestions. It offers actionable assistance directly to the fans' phones and organizes volunteers to dispatch water, assistance, and translation support instantly.
            </p>
          </div>
          <div className="bg-slate-900 border border-slate-800 p-8 rounded-2xl space-y-6">
            <h3 className="font-bold text-white text-lg">Solution Objectives & Alignment</h3>
            <div className="space-y-4">
              <div className="flex gap-3">
                <span className="text-emerald-400 text-sm font-black">✓</span>
                <div>
                  <h4 className="font-bold text-slate-200 text-xs">Accessibility First</h4>
                  <p className="text-slate-500 text-[11px] mt-0.5">High-contrast views, voice/sign-language hooks, and step-free navigation mapping.</p>
                </div>
              </div>
              <div className="flex gap-3">
                <span className="text-emerald-400 text-sm font-black">✓</span>
                <div>
                  <h4 className="font-bold text-slate-200 text-xs">Sustainability Tracking</h4>
                  <p className="text-slate-500 text-[11px] mt-0.5">Shuttle frequency adjustments based on predictions and individual CO₂ savings reporting.</p>
                </div>
              </div>
              <div className="flex gap-3">
                <span className="text-emerald-400 text-sm font-black">✓</span>
                <div>
                  <h4 className="font-bold text-slate-200 text-xs">Dynamic Crowds routing</h4>
                  <p className="text-slate-500 text-[11px] mt-0.5">Directing overflow fans from 88% congested Gate C towards the underused 35% Gate D entry.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

      </main>

      {/* Footer */}
      <footer className="bg-slate-900 border-t border-slate-800 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-500">
          <p>© 2026 Devpost FIFA World Cup Hackathon. StadiumAI Submission.</p>
          <div className="flex gap-6">
            <a href="#about" className="hover:text-slate-300">Hackathon Rules</a>
            <a href="#featured-solution" className="hover:text-slate-300">Project Terms</a>
            <a href="#featured-solution" className="hover:text-slate-300">Privacy Policy</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
