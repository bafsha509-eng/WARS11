import React, { useState, lazy, Suspense } from "react";

// Lazy load components to optimize bundle size, initial load speed, and overall performance efficiency.
const HackathonLanding = lazy(() => import("./components/HackathonLanding"));
const DevpostLogin = lazy(() => import("./components/DevpostLogin"));
const StadiumAI = lazy(() => import("./components/StadiumAI"));

export default function App() {
  const [view, setView] = useState("landing"); // 'landing' | 'login' | 'dashboard'
  const [session, setSession] = useState(null);

  const handleLoginSuccess = (userSession) => {
    setSession(userSession);
    setView("dashboard");
  };

  const handleLogout = () => {
    setSession(null);
    setView("landing");
  };

  // Direct launch for demo shortcut (triggers default login with Fan role)
  const handleDirectLaunch = () => {
    setSession({ email: "guest@fifa.com", role: "fan" });
    setView("dashboard");
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100">
      <Suspense fallback={
        <div className="min-h-screen flex flex-col items-center justify-center bg-slate-950">
          <div className="relative w-12 h-12">
            <div className="absolute inset-0 border-4 border-yellow-500/20 rounded-full" />
            <div className="absolute inset-0 border-4 border-t-yellow-500 rounded-full animate-spin" />
          </div>
          <p className="mt-3 text-xs font-bold tracking-widest text-[#F2B84C]">LOADING PLATFORM...</p>
        </div>
      }>
        {view === "landing" && (
          <HackathonLanding 
            onNavigateToLogin={() => setView("login")} 
            onNavigateToDashboardDirectly={handleDirectLaunch} 
          />
        )}
        
        {view === "login" && (
          <DevpostLogin 
            onLoginSuccess={handleLoginSuccess} 
            onNavigateBack={() => setView("landing")} 
          />
        )}
        
        {view === "dashboard" && (
          <StadiumAI 
            session={session} 
            onLogout={handleLogout} 
          />
        )}
      </Suspense>
    </div>
  );
}
