import React, { useMemo, useState } from "react";
import { getBusiestGate, getQuietestGate, calculateCo2Savings } from "../../utils/helpers";
import { COLORS } from "../../utils/constants";
import { Radio, Navigation, Bus, Leaf, Accessibility, Ticket, ArrowRight } from "lucide-react";
import StadiumBowl from "./StadiumBowl";

/**
 * FanView Component
 * Renders the spectator-facing dashboard, including live heatmap and wayfinding.
 * Includes a simulated GenAI Ticket Guide wayfinding route planner.
 */
const FanView = React.memo(function FanView({ densities, highContrast, setHighContrast }) {
  const busiest = useMemo(() => getBusiestGate(densities), [densities]);
  const quietest = useMemo(() => getQuietestGate(densities), [densities]);

  const co2SavedValue = useMemo(() => {
    return calculateCo2Savings('metro', 10) + calculateCo2Savings('shuttle', 8);
  }, []);

  // GenAI Ticket Wayfinding State
  const [section, setSection] = useState("");
  const [seat, setSeat] = useState("");
  const [aiRoute, setAiRoute] = useState(null);
  const [isPlanning, setIsPlanning] = useState(false);

  const handlePlanRoute = (e) => {
    e.preventDefault();
    if (!section) return;
    setIsPlanning(true);
    
    setTimeout(() => {
      setIsPlanning(false);
      // Determine recommendation dynamically based on active busy gates
      const activeBusiest = busiest ? busiest[0] : "C";
      const activeQuietest = quietest ? quietest[0] : "D";
      const busiestVal = busiest ? Math.round(busiest[1]) : 88;
      const quietestVal = quietest ? Math.round(quietest[1]) : 35;
      
      setAiRoute({
        targetSection: section,
        targetSeat: seat || "General Admission",
        suggestedGate: activeQuietest,
        avoidGate: activeBusiest,
        avoidGateLoad: busiestVal,
        suggestedGateLoad: quietestVal,
        estWalk: 4 + Math.floor(Math.random() * 4),
        carbonSavings: 0.15
      });
    }, 800);
  };

  return (
    <div className="grid md:grid-cols-12 gap-6 items-start">
      {/* Live Crowd Map Panel */}
      <div className="md:col-span-6 rounded-2xl p-6 bg-slate-900 border border-slate-800 shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-white font-semibold text-lg flex items-center gap-2">
            <Radio size={18} color={COLORS.gold} className="animate-pulse" /> Live crowd map
          </h3>
          <span className="text-[10px] px-2.5 py-1 rounded-full font-bold bg-[#F2B84C] text-[#0A1524]">
            SIMULATED LIVE
          </span>
        </div>
        <StadiumBowl densities={densities} highContrast={highContrast} />
        <div className="flex justify-center gap-4 mt-3 text-xs text-white/75">
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-[#2E7D5B]" /> Clear
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-[#F2B84C]" /> Moderate
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-[#E2583E]" /> Busy
          </span>
        </div>
      </div>

      {/* Suggestion Cards & Ticket Guide */}
      <div className="md:col-span-6 space-y-4">
        {/* GenAI Ticket Guide & Wayfinding Route Planner */}
        <div className="rounded-2xl p-5 border border-slate-800 bg-[#0F1E33]/70 backdrop-blur-md text-slate-200 shadow-lg relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-[#F2B84C]/10 to-transparent rounded-bl-full pointer-events-none" />
          <h4 className="font-bold flex items-center gap-2 mb-2 text-white font-heading">
            <Ticket size={18} className="text-[#F2B84C]" /> GenAI Ticket Wayfinder
          </h4>
          <p className="text-xs text-slate-400 mb-4 leading-normal">
            Enter your stadium ticket details to generate a customized, congestion-aware accessibility path to your seat.
          </p>

          <form onSubmit={handlePlanRoute} className="grid grid-cols-2 gap-3 mb-4">
            <div>
              <label htmlFor="ticket-section" className="block text-[9px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                Section Number
              </label>
              <input
                id="ticket-section"
                type="text"
                required
                value={section}
                onChange={(e) => setSection(e.target.value)}
                placeholder="e.g. 104"
                className="w-full text-xs px-3 py-2 rounded-lg bg-slate-950 border border-slate-850 text-white outline-none focus:border-[#F2B84C] placeholder-slate-700 font-semibold"
              />
            </div>
            <div>
              <label htmlFor="ticket-seat" className="block text-[9px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                Seat / Row (Optional)
              </label>
              <input
                id="ticket-seat"
                type="text"
                value={seat}
                onChange={(e) => setSeat(e.target.value)}
                placeholder="e.g. Row G, Seat 12"
                className="w-full text-xs px-3 py-2 rounded-lg bg-slate-950 border border-slate-850 text-white outline-none focus:border-[#F2B84C] placeholder-slate-700 font-semibold"
              />
            </div>
            <button
              type="submit"
              disabled={isPlanning}
              className="col-span-2 py-2 bg-gradient-to-tr from-[#F2B84C] to-[#C99328] text-slate-950 font-extrabold text-[10px] uppercase tracking-wider rounded-lg transition-transform active:scale-95 cursor-pointer shadow-md flex items-center justify-center gap-1.5"
            >
              {isPlanning ? "Calculating Routes..." : "Generate GenAI Wayfinding"}
              <ArrowRight size={12} />
            </button>
          </form>

          {aiRoute && (
            <div className="p-4 rounded-xl bg-slate-950/70 border border-emerald-500/20 text-xs text-slate-300 space-y-2 animate-pulse-slow">
              <div className="flex justify-between items-center border-b border-slate-900 pb-1.5 mb-1.5">
                <span className="font-extrabold text-white text-[10px] uppercase tracking-wider">AI Calculated Route Plan</span>
                <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  Step-free active
                </span>
              </div>
              <p className="leading-relaxed">
                Your ticket points to Section <strong className="text-white">{aiRoute.targetSection}</strong> (Seat {aiRoute.targetSeat}). 
                Your ticketed entrance at Gate <strong className="text-rose-400">{aiRoute.avoidGate}</strong> is experiencing heavy loads (<strong className="text-rose-400">{aiRoute.avoidGateLoad}%</strong>).
              </p>
              <p className="leading-relaxed border-l-2 border-[#F2B84C] pl-2.5 py-0.5 text-slate-400 italic">
                Recommendation: Enter via <strong className="text-[#F2B84C]">Gate {aiRoute.suggestedGate}</strong> ({aiRoute.suggestedGateLoad}% busy). 
                From Gate {aiRoute.suggestedGate}, take the south elevator directly to upper level. Walking time is <strong className="text-white">{aiRoute.estWalk} mins</strong>, saving you approx. 14 minutes.
              </p>
            </div>
          )}
        </div>

        {/* Suggestion Card */}
        <div className="rounded-2xl p-5 border border-slate-800 bg-slate-900/60 text-slate-200 shadow-md">
          <h4 className="font-bold flex items-center gap-2 mb-1.5 text-white font-heading">
            <Navigation size={17} className="text-emerald-400" /> AI Wayfinding Suggestion
          </h4>
          <p className="text-sm text-slate-400 leading-relaxed font-medium">
            Gate {busiest?.[0]} is your entry point but running at {Math.round(busiest?.[1])}% capacity. StadiumAI recommends Gate {quietest?.[0]} instead — only {Math.round(quietest?.[1])}% full, 4 min walk, step-free access available.
          </p>
        </div>

        {/* Transportation Card */}
        <div className="rounded-2xl p-5 border border-slate-800 bg-slate-900/60 flex items-start gap-3 text-slate-200 shadow-md">
          <Bus size={19} className="text-emerald-400 mt-0.5 shrink-0" />
          <div>
            <h4 className="font-bold text-white font-heading">Transportation Assistant</h4>
            <p className="text-sm text-slate-400 leading-relaxed font-medium">
              Next shuttle to Downtown Transit Hub in 12 min from Lot 4. Post-match shuttle frequency increases to every 6 min based on predicted exit surge.
            </p>
          </div>
        </div>

        {/* Sustainability Card */}
        <div className="rounded-2xl p-5 border border-slate-800 bg-[#0A1524]/40 flex items-start gap-3 text-slate-200 shadow-md">
          <Leaf size={19} className="text-[#F2B84C] mt-0.5 shrink-0" />
          <div>
            <h4 className="font-bold text-white font-heading">Your Sustainability Footprint</h4>
            <p className="text-sm text-slate-400 leading-relaxed font-medium">
              Shuttle + metro to today's match: {co2SavedValue} kg CO₂ saved vs. driving alone. Refill stations near Gate D and Gate F.
            </p>
          </div>
        </div>

        {/* Accessibility Toggle Card */}
        <div className="rounded-2xl p-5 border border-slate-800 bg-slate-900/60 flex items-start gap-3 text-slate-200 shadow-md">
          <Accessibility size={19} className="text-purple-400 mt-0.5 shrink-0" />
          <div className="flex-1">
            <h4 className="font-bold text-white font-heading">Accessibility Mode</h4>
            <p className="text-sm mb-3 text-slate-400 leading-relaxed font-medium">
              High-contrast display, step-free routing, and sign-language avatar support.
            </p>
            <button
              onClick={() => setHighContrast((v) => !v)}
              className="text-xs font-bold px-4 py-2 rounded-full border border-purple-500/30 hover:border-purple-400 bg-purple-500/10 hover:bg-purple-500/15 text-purple-400 transition-colors cursor-pointer"
            >
              {highContrast ? "Disable High Contrast" : "Enable High Contrast"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
});

export default FanView;
