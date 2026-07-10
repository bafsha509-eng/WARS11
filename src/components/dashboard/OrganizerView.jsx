import React, { useState, useMemo, useCallback } from "react";
import { COLORS, ENTRY_DATA, GATE_BAR } from "../../utils/constants";
import { getBusiestGate, getQuietestGate } from "../../utils/helpers";
import {
  Users, TrendingUp, AlertTriangle, Clock, Trophy, Shield, Sparkles, ShieldAlert
} from "lucide-react";
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis, Tooltip,
  ResponsiveContainer, CartesianGrid
} from "recharts";

/**
 * OrganizerView Component
 * Renders operational intelligence dashboard with dynamic GenAI decision support recommendations.
 */
const OrganizerView = React.memo(function OrganizerView({ incidents, densities, ticker }) {
  const [dispatchedIds, setDispatchedIds] = useState([2]);

  const handleDispatch = useCallback((id) => {
    setDispatchedIds(prev => [...prev, id]);
  }, []);

  const busiest = useMemo(() => getBusiestGate(densities) || ["C", 88], [densities]);
  const quietest = useMemo(() => getQuietestGate(densities) || ["D", 35], [densities]);

  const avgDensity = useMemo(() => {
    const vals = Object.values(densities || {});
    if (vals.length === 0) return 71;
    return Math.round(vals.reduce((acc, v) => acc + v, 0) / vals.length);
  }, [densities]);

  const stats = useMemo(() => {
    return [
      { label: "Fans in venue", value: (ticker || 38900).toLocaleString(), icon: Users, color: "text-[#F2B84C]" },
      { label: "Capacity used", value: `${avgDensity}%`, icon: TrendingUp, color: "text-[#4FA97C]" },
      { label: "Open incidents", value: (incidents || []).length.toString(), icon: AlertTriangle, color: "text-[#E2583E]" },
      { label: "Avg. gate wait", value: `${(avgDensity * 0.08 + 1).toFixed(1)} min`, icon: Clock, color: "text-purple-400" },
    ];
  }, [ticker, avgDensity, incidents]);

  // Dynamically compile GenAI suggestions based on active live sensors and incidents list
  const decisions = useMemo(() => {
    const list = [];
    
    // 1. Crowd control card (dynamic depending on whether Gate C is overflowing)
    const hasGateSurge = busiest[1] > 80;
    list.push({
      id: 1,
      title: hasGateSurge ? `🚨 [Critical Surge] Redirect Gate ${busiest[0]} Stream` : "Redirect North Concourse Overflow",
      details: hasGateSurge
        ? `GenAI engine detects Gate ${busiest[0]} congestion is at ${Math.round(busiest[1])}%. Trigger SMS and PA alerts redirecting spectator flows to Gate ${quietest[0]} (${Math.round(quietest[1])}% busy). Expected queue reduction: 16 minutes.`
        : `GenAI analysis recommends routing incoming Gate ${busiest[0]} (${Math.round(busiest[1])}% busy) traffic to Gate ${quietest[0]} (${Math.round(quietest[1])}% busy). Expected queue time decrease: 12 minutes.`,
      status: dispatchedIds.includes(1) ? "Dispatched" : "Ready",
      type: "Crowd Control",
      color: dispatchedIds.includes(1) ? "text-[#4FA97C] bg-emerald-500/10 border-emerald-500/20" : "text-amber-400 bg-amber-500/10 border-amber-500/20"
    });

    // 2. Transport card (pre-empt shuttle frequencies based on density)
    list.push({
      id: 2,
      title: "Pre-empt Post-Match Shuttle Frequencies",
      details: `Average venue capacity is at ${avgDensity}%. Exit surges predicted to trigger 12 min early. Increase Lot 4 transit line shuttle frequencies to 4-minute intervals.`,
      status: dispatchedIds.includes(2) ? "Dispatched" : "Ready",
      type: "Transport",
      color: dispatchedIds.includes(2) ? "text-[#4FA97C] bg-emerald-500/10 border-emerald-500/20" : "text-amber-400 bg-amber-500/10 border-amber-500/20"
    });

    // 3. Medical Emergency / Accessibility (dynamic if a high-severity incident is in progress)
    const medicalIncident = (incidents || []).find(inc => inc.type === "Medical" && inc.sev === "high");
    
    if (medicalIncident) {
      list.push({
        id: 3,
        title: `🏥 [Emergency Medical] Dispatch Responder Unit`,
        details: `GenAI Medical dispatch recommendation: Send responder team 4 to Section 102 concourse immediately. Assigned volunteer task: "Deliver AED & support to Section 102". ETA: 2.1 minutes.`,
        status: dispatchedIds.includes(3) ? "Dispatched" : "Ready",
        type: "Emergency Response",
        color: dispatchedIds.includes(3) ? "text-[#4FA97C] bg-emerald-500/10 border-emerald-500/20" : "text-amber-400 bg-amber-500/10 border-amber-500/20"
      });
    } else {
      list.push({
        id: 3,
        title: "Shift Accessibility Marshals to Gate B",
        details: `Gate B wheelchair entries have increased. Dispatch 3 accessibility marshals to assist at Gate ${quietest[0]} to balance assistance capacity.`,
        status: dispatchedIds.includes(3) ? "Dispatched" : "Ready",
        type: "Accessibility",
        color: dispatchedIds.includes(3) ? "text-[#4FA97C] bg-emerald-500/10 border-emerald-500/20" : "text-amber-400 bg-amber-500/10 border-amber-500/20"
      });
    }

    return list;
  }, [busiest, quietest, avgDensity, incidents, dispatchedIds]);

  return (
    <div className="space-y-6">
      {/* Overview stats grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((s) => (
          <div key={s.label} className="rounded-2xl p-5 border border-slate-800 bg-slate-900/60 shadow-sm hover:border-slate-700 transition-colors">
            <s.icon size={18} className={s.color} />
            <p className="text-2xl font-black mt-2 text-white font-heading">{s.value}</p>
            <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-12 gap-6 items-start">
        {/* Charts & Log Section */}
        <div className="lg:col-span-8 space-y-6">
          {/* Analytics Charts Grid */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="rounded-2xl p-5 border border-slate-800 bg-slate-900/60 shadow-md">
              <h4 className="font-bold text-white mb-4 flex items-center gap-2 font-heading">
                <Trophy size={16} className="text-[#F2B84C]" /> Entry rate over time
              </h4>
              <div className="w-full h-[220px]">
                <ResponsiveContainer>
                  <LineChart data={ENTRY_DATA}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                    <XAxis dataKey="t" tick={{ fontSize: 11, fill: '#64748B' }} stroke="#334155" />
                    <YAxis tick={{ fontSize: 11, fill: '#64748B' }} stroke="#334155" />
                    <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', color: '#fff' }} />
                    <Line type="monotone" dataKey="fans" stroke="#2E7D5B" strokeWidth={3} dot={{ r: 3, fill: '#4FA97C' }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="rounded-2xl p-5 border border-slate-800 bg-slate-900/60 shadow-md">
              <h4 className="font-bold text-white mb-4 flex items-center gap-2 font-heading">
                <Shield size={16} className="text-emerald-400" /> Gate-wise capacity
              </h4>
              <div className="w-full h-[220px]">
                <ResponsiveContainer>
                  <BarChart data={GATE_BAR}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                    <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#64748B' }} stroke="#334155" />
                    <YAxis tick={{ fontSize: 11, fill: '#64748B' }} stroke="#334155" />
                    <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', color: '#fff' }} />
                    <Bar dataKey="capacity" fill={COLORS.gold} radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* AI Incident Log */}
          <div className="rounded-2xl p-5 border border-slate-800 bg-slate-900/60 shadow-md">
            <h4 className="font-bold text-white mb-3.5 flex items-center gap-2 font-heading">
              <ShieldAlert size={18} className="text-[#E2583E]" /> AI-flagged Grid Incidents
            </h4>
            <div className="space-y-3">
              {incidents.map((inc) => (
                <div key={inc.id} className="flex items-start gap-3.5 p-4 rounded-xl bg-slate-950/60 border border-slate-850/50 hover:border-slate-800 transition-colors">
                  <span
                    className={`text-[9px] font-bold px-2 py-1 rounded-full shrink-0 mt-0.5 ${
                      inc.sev === "high"
                        ? "bg-[#E2583E] text-white"
                        : inc.sev === "med"
                          ? "bg-[#F2B84C] text-[#0A1524]"
                          : "bg-[#2E7D5B] text-white"
                    }`}
                  >
                    {inc.type.toUpperCase()}
                  </span>
                  <div>
                    <p className="text-xs font-bold text-white">{inc.loc}</p>
                    <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed font-medium">{inc.ai}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* GenAI Predictive Decision Support Sidebar */}
        <div className="lg:col-span-4 space-y-6">
          <div className="rounded-2xl p-5 border border-slate-800 bg-slate-900/60 space-y-4 shadow-xl">
            <div className="flex items-center gap-2 border-b border-slate-800/80 pb-3">
              <Sparkles size={18} className="text-[#F2B84C] animate-pulse" />
              <div>
                <h4 className="font-bold text-white text-sm font-heading">GenAI Decision Support</h4>
                <p className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">Predictive Venue Controls</p>
              </div>
            </div>

            <div className="space-y-4">
              {decisions.map((d) => (
                <div key={d.id} className="p-4 rounded-xl bg-slate-950/50 border border-slate-850 space-y-3 flex flex-col justify-between hover:border-slate-800 transition-colors">
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center">
                      <span className="text-[9px] font-extrabold uppercase px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-400">
                        {d.type}
                      </span>
                      <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full border ${d.color}`}>
                        {d.status}
                      </span>
                    </div>
                    <h5 className="text-xs font-bold text-white">{d.title}</h5>
                    <p className="text-[10.5px] leading-relaxed text-slate-400 font-medium">
                      {d.details}
                    </p>
                  </div>

                  {d.status === "Ready" ? (
                    <button
                      onClick={() => handleDispatch(d.id)}
                      className="w-full py-2 bg-[#F2B84C] hover:bg-[#C99328] text-slate-950 font-extrabold text-[10px] uppercase tracking-wider rounded-lg transition-all cursor-pointer shadow-md shadow-[#F2B84C]/5 hover:scale-[1.01] active:scale-95 border-0"
                    >
                      Approve &amp; Dispatch
                    </button>
                  ) : (
                    <div className="w-full py-2 bg-emerald-600/10 border border-emerald-500/20 text-[#4FA97C] font-extrabold text-[10px] uppercase tracking-wider rounded-lg text-center select-none font-semibold">
                      Dispatched ✓
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

export default OrganizerView;
