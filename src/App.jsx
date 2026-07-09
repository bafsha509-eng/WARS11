import React, { useState } from "react";
import HackathonLanding from "./components/HackathonLanding";
import DevpostLogin from "./components/DevpostLogin";
import StadiumAI from "./components/StadiumAI";

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
    </div>
  );
}
