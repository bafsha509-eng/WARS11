import React, { useState, useEffect, useRef, useMemo } from "react";
import {
  MessageCircle, X, Send, Globe2, MapPin, Users, Bus, Leaf,
  AlertTriangle, CheckCircle2, Clock, ShieldAlert, Accessibility,
  Navigation, TrendingUp, Radio, ChevronRight, Sparkles, Menu
} from "lucide-react";
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis, Tooltip,
  ResponsiveContainer, CartesianGrid
} from "recharts";

/* ---------------------------------------------------------
   DESIGN TOKENS
   Palette: Pitch navy (bg), Floodlight gold (accent/primary),
   Turf green (secondary/success), Coral (alerts), Chalk (surface)
--------------------------------------------------------- */
const COLORS = {
  navy: "#0F1E33",
  navyDeep: "#0A1524",
  gold: "#F2B84C",
  goldDeep: "#C99328",
  green: "#2E7D5B",
  greenLight: "#4FA97C",
  coral: "#E2583E",
  chalk: "#F5F3EC",
  ink: "#12202F",
  slate: "#5B6B7C",
};

const GATES = [
  { id: "A", label: "Gate A · North", angle: -90, base: 62 },
  { id: "B", label: "Gate B · Northeast", angle: -30, base: 41 },
  { id: "C", label: "Gate C · Southeast", angle: 30, base: 88 },
  { id: "D", label: "Gate D · South", angle: 90, base: 35 },
  { id: "E", label: "Gate E · Southwest", angle: 150, base: 55 },
  { id: "F", label: "Gate F · Northwest", angle: -150, base: 70 },
];

const ENTRY_DATA = [
  { t: "16:00", fans: 4200 },
  { t: "16:30", fans: 9800 },
  { t: "17:00", fans: 18500 },
  { t: "17:30", fans: 27200 },
  { t: "18:00", fans: 34100 },
  { t: "18:30", fans: 38900 },
];

const GATE_BAR = GATES.map((g) => ({ name: g.id, capacity: g.base }));

const INCIDENTS = [
  { id: 1, type: "Medical", loc: "Section 214", ai: "Nearest medical team (Bay 3) dispatched — ETA 2 min.", sev: "high" },
  { id: 2, type: "Lost item", loc: "Gate C concourse", ai: "Matched to lost-and-found log at Kiosk 2.", sev: "low" },
  { id: 3, type: "Congestion", loc: "Gate C", ai: "Suggest redirecting overflow to Gate D, 45% under capacity.", sev: "med" },
];

const TASKS = {
  urgent: [
    { id: 1, title: "Restock water — Section 108", tag: "Facilities" },
    { id: 2, title: "Assist wheelchair guest, Gate B", tag: "Accessibility" },
  ],
  inProgress: [
    { id: 3, title: "Translate announcement — Gate F", tag: "Language" },
    { id: 4, title: "Escort lost child to family point", tag: "Safety" },
  ],
  done: [
    { id: 5, title: "Crowd count, North concourse", tag: "Ops" },
  ],
};

const LANGUAGES = [
  { code: "en", label: "English" },
  { code: "es", label: "Español" },
  { code: "fr", label: "Français" },
  { code: "hi", label: "हिंदी" },
];

const QUICK_REPLIES = {
  en: ["Nearest restroom", "Gate wait time", "Next shuttle", "Wheelchair route"],
  es: ["Baño más cercano", "Espera en la puerta", "Próximo autobús", "Ruta accesible"],
  fr: ["Toilettes proches", "Attente à la porte", "Prochaine navette", "Accès handicapé"],
  hi: ["नज़दीकी शौचालय", "गेट पर प्रतीक्षा", "अगली शटल", "व्हीलचेयर मार्ग"],
};

const GREETING = {
  en: "Hi! I'm your StadiumAI concierge. Ask me about gates, restrooms, transport, or accessibility.",
  es: "¡Hola! Soy tu asistente StadiumAI. Pregúntame sobre puertas, baños, transporte o accesibilidad.",
  fr: "Bonjour ! Je suis votre assistant StadiumAI. Posez-moi des questions sur les portes, toilettes, transport.",
  hi: "नमस्ते! मैं आपका StadiumAI सहायक हूं। गेट, शौचालय, परिवहन या सुगम्यता के बारे में पूछें।",
};

function matchReply(msg, lang) {
  const m = msg.toLowerCase();
  const R = {
    en: {
      restroom: "Nearest restroom is 40m from your seat, behind Section 112 — wait time: under 3 min.",
      gate: "Gate C is at 88% capacity right now. Gate D is quieter (35%) if you're flexible on entry point.",
      shuttle: "Next shuttle to Downtown Transit Hub departs in 12 minutes from Lot 4.",
      wheelchair: "Accessible route enabled: ramp access via Gate B, elevator to your section, no stairs.",
      default: "Here's what I found — for anything more specific, tap a quick-reply below or ask again.",
    },
    es: {
      restroom: "El baño más cercano está a 40m de tu asiento, detrás de la Sección 112 — espera: menos de 3 min.",
      gate: "La Puerta C está al 88% de capacidad. La Puerta D está más tranquila (35%).",
      shuttle: "El próximo autobús al centro sale en 12 minutos desde el Lote 4.",
      wheelchair: "Ruta accesible activada: rampa en la Puerta B, ascensor hasta tu sección, sin escaleras.",
      default: "Esto es lo que encontré — para algo más específico, toca una respuesta rápida.",
    },
    fr: {
      restroom: "Les toilettes les plus proches sont à 40m, derrière la Section 112 — attente: moins de 3 min.",
      gate: "La Porte C est à 88% de capacité. La Porte D est plus calme (35%).",
      shuttle: "La prochaine navette part dans 12 minutes du Parking 4.",
      wheelchair: "Itinéraire accessible activé : rampe à la Porte B, ascenseur jusqu'à votre section.",
      default: "Voici ce que j'ai trouvé — pour plus de précision, touchez une réponse rapide.",
    },
    hi: {
      restroom: "नज़दीकी शौचालय आपकी सीट से 40 मीटर दूर, सेक्शन 112 के पीछे है — प्रतीक्षा 3 मिनट से कम।",
      gate: "गेट C अभी 88% क्षमता पर है। गेट D शांत है (35%)।",
      shuttle: "अगली शटल 12 मिनट में लॉट 4 से रवाना होगी।",
      wheelchair: "सुगम्य मार्ग सक्रिय: गेट B पर रैंप, आपके सेक्शन तक लिफ्ट, कोई सीढ़ियां नहीं।",
      default: "मुझे यह मिला — अधिक विशिष्ट जानकारी के लिए नीचे टैप करें।",
    },
  };
  const dict = R[lang] || R.en;
  if (m.includes("restroom") || m.includes("baño") || m.includes("toilette") || m.includes("शौचालय")) return dict.restroom;
  if (m.includes("gate") || m.includes("puerta") || m.includes("porte") || m.includes("गेट")) return dict.gate;
  if (m.includes("shuttle") || m.includes("autobús") || m.includes("navette") || m.includes("शटल")) return dict.shuttle;
  if (m.includes("wheelchair") || m.includes("accesible") || m.includes("handicap") || m.includes("व्हीलचेयर")) return dict.wheelchair;
  return dict.default;
}

/* =========================================================
   CHAT WIDGET
========================================================= */
function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [lang, setLang] = useState("en");
  const [messages, setMessages] = useState([{ from: "bot", text: GREETING.en }]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    setMessages([{ from: "bot", text: GREETING[lang] }]);
  }, [lang]);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, typing, open]);

  function sanitize(str) {
    return str.replace(/[<>]/g, "").trim();
  }

  function send(text) {
    const clean = sanitize(text);
    if (!clean) return;
    setMessages((prev) => [...prev, { from: "user", text: clean }]);
    setInput("");
    setTyping(true);
    setTimeout(() => {
      const reply = matchReply(clean, lang);
      setMessages((prev) => [...prev, { from: "bot", text: reply }]);
      setTyping(false);
    }, 700 + Math.random() * 500);
  }

  return (
    <>
      {!open && (
        <button
          onClick={() => setOpen(true)}
          aria-label="Open StadiumAI assistant"
          className="fixed bottom-5 right-5 z-50 flex items-center gap-2 rounded-full px-5 py-3.5 shadow-lg transition-transform hover:scale-105 active:scale-95 cursor-pointer"
          style={{ background: COLORS.gold, color: COLORS.navyDeep }}
        >
          <MessageCircle size={20} strokeWidth={2.5} />
          <span className="font-semibold text-sm tracking-wide hidden sm:inline">Ask StadiumAI</span>
        </button>
      )}

      {open && (
        <div
          role="dialog"
          aria-label="StadiumAI chat assistant"
          className="fixed z-50 bottom-0 right-0 sm:bottom-5 sm:right-5 w-full sm:w-[380px] h-[85vh] sm:h-[520px] flex flex-col rounded-t-2xl sm:rounded-2xl overflow-hidden shadow-2xl border"
          style={{ background: COLORS.chalk, borderColor: "rgba(0,0,0,0.08)" }}
        >
          <div
            className="flex items-center justify-between px-4 py-3"
            style={{ background: COLORS.navy }}
          >
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: COLORS.gold }}>
                <Sparkles size={16} color={COLORS.navyDeep} />
              </div>
              <div>
                <p className="text-white font-semibold text-sm leading-tight">StadiumAI Concierge</p>
                <span
                  className="text-[10px] font-medium tracking-wide px-1.5 py-0.5 rounded"
                  style={{ background: COLORS.green, color: "white" }}
                >
                  Powered by GenAI
                </span>
              </div>
            </div>
            <button onClick={() => setOpen(false)} aria-label="Close chat" className="text-white/70 hover:text-white cursor-pointer">
              <X size={20} />
            </button>
          </div>

          <div className="flex items-center gap-2 px-4 py-2 border-b" style={{ borderColor: "rgba(0,0,0,0.06)" }}>
            <Globe2 size={14} color={COLORS.slate} />
            <select
              value={lang}
              onChange={(e) => setLang(e.target.value)}
              aria-label="Select chat language"
              className="text-xs bg-transparent outline-none font-medium text-slate-800"
            >
              {LANGUAGES.map((l) => (
                <option key={l.code} value={l.code}>{l.label}</option>
              ))}
            </select>
          </div>

          <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-3 space-y-3" aria-live="polite">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.from === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[80%] px-3.5 py-2 rounded-2xl text-sm leading-snug ${m.from === "user" ? "rounded-br-sm" : "rounded-bl-sm"}`}
                  style={{
                    background: m.from === "user" ? COLORS.gold : "white",
                    color: m.from === "user" ? COLORS.navyDeep : COLORS.ink,
                    border: m.from === "bot" ? "1px solid rgba(0,0,0,0.06)" : "none",
                  }}
                >
                  {m.text}
                </div>
              </div>
            ))}
            {typing && (
              <div className="flex justify-start">
                <div className="px-3.5 py-2 rounded-2xl rounded-bl-sm text-xs italic" style={{ background: "white", color: COLORS.slate, border: "1px solid rgba(0,0,0,0.06)" }}>
                  StadiumAI is typing…
                </div>
              </div>
            )}
          </div>

          <div className="flex flex-wrap gap-1.5 px-4 pb-2">
            {QUICK_REPLIES[lang].map((q) => (
              <button
                key={q}
                onClick={() => send(q)}
                className="text-xs px-2.5 py-1 rounded-full border font-semibold transition-colors cursor-pointer"
                style={{ borderColor: COLORS.green, color: COLORS.green }}
              >
                {q}
              </button>
            ))}
          </div>

          <form
            onSubmit={(e) => { e.preventDefault(); send(input); }}
            className="flex items-center gap-2 px-3 py-2.5 border-t"
            style={{ borderColor: "rgba(0,0,0,0.06)" }}
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your question…"
              aria-label="Chat message input"
              maxLength={300}
              className="flex-1 text-sm px-3 py-2 rounded-full outline-none border text-slate-800"
              style={{ borderColor: "rgba(0,0,0,0.1)" }}
            />
            <button
              type="submit"
              aria-label="Send message"
              className="w-9 h-9 rounded-full flex items-center justify-center shrink-0 cursor-pointer"
              style={{ background: COLORS.navy }}
            >
              <Send size={16} color="white" />
            </button>
          </form>
        </div>
      )}
    </>
  );
}

/* =========================================================
   STADIUM BOWL — simulated live crowd heatmap
========================================================= */
function StadiumBowl({ densities, highContrast }) {
  const cx = 200, cy = 200, r = 140;
  const levelColor = (v) => (v > 70 ? COLORS.coral : v > 45 ? COLORS.gold : COLORS.green);

  return (
    <svg viewBox="0 0 400 400" className="w-full h-auto max-w-sm mx-auto" role="img" aria-label="Live stadium crowd map showing gate congestion levels">
      <title>Stadium crowd heatmap</title>
      <circle cx={cx} cy={cy} r={r + 35} fill={highContrast ? "#000" : COLORS.navyDeep} opacity={highContrast ? 1 : 0.9} />
      <circle cx={cx} cy={cy} r={r} fill={highContrast ? "#1a1a1a" : "#173556"} />
      <circle cx={cx} cy={cy} r={70} fill={COLORS.green} opacity={highContrast ? 0.5 : 0.35} />
      <text x={cx} y={cy - 4} textAnchor="middle" fill="white" fontSize="12" fontWeight="600" letterSpacing="1">PITCH</text>
      <text x={cx} y={cy + 12} textAnchor="middle" fill="white" fontSize="9" opacity="0.7">FIFA World Cup 2026</text>

      {GATES.map((g) => {
        const v = densities[g.id] ?? g.base;
        const rad = (g.angle * Math.PI) / 180;
        const gx = cx + (r + 35) * Math.cos(rad);
        const gy = cy + (r + 35) * Math.sin(rad);
        const color = levelColor(v);
        return (
          <g key={g.id}>
            <circle cx={gx} cy={gy} r={16} fill={color} opacity={0.25}>
              <animate attributeName="r" values="16;22;16" dur="2.2s" repeatCount="indefinite" />
            </circle>
            <circle cx={gx} cy={gy} r={11} fill={color} stroke="white" strokeWidth="1.5" />
            <text x={gx} y={gy + 4} textAnchor="middle" fontSize="10" fontWeight="700" fill={highContrast ? "#fff" : COLORS.navyDeep}>{g.id}</text>
            <text x={gx} y={gy + 26} textAnchor="middle" fontSize="9" fill={highContrast ? "#fff" : "#cfd8e3"} fontWeight="600">{Math.round(v)}%</text>
          </g>
        );
      })}
    </svg>
  );
}

/* =========================================================
   FAN VIEW
========================================================= */
function FanView({ densities, highContrast, setHighContrast }) {
  const busiest = useMemo(() => {
    const entries = Object.entries(densities);
    return entries.sort((a, b) => b[1] - a[1])[0];
  }, [densities]);
  const quietest = useMemo(() => {
    const entries = Object.entries(densities);
    return entries.sort((a, b) => a[1] - b[1])[0];
  }, [densities]);

  return (
    <div className="grid md:grid-cols-2 gap-6 items-start">
      <div className="rounded-2xl p-6" style={{ background: COLORS.navy }}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-white font-semibold text-lg flex items-center gap-2">
            <Radio size={18} color={COLORS.gold} /> Live crowd map
          </h3>
          <span className="text-[10px] px-2 py-1 rounded-full font-semibold" style={{ background: COLORS.gold, color: COLORS.navyDeep }}>SIMULATED LIVE</span>
        </div>
        <StadiumBowl densities={densities} highContrast={highContrast} />
        <div className="flex justify-center gap-4 mt-3 text-xs text-white/70">
          <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full" style={{ background: COLORS.green }} /> Clear</span>
          <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full" style={{ background: COLORS.gold }} /> Moderate</span>
          <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full" style={{ background: COLORS.coral }} /> Busy</span>
        </div>
      </div>

      <div className="space-y-4">
        <div className="rounded-2xl p-5 border text-slate-800" style={{ borderColor: "rgba(0,0,0,0.08)", background: "white" }}>
          <h4 className="font-semibold flex items-center gap-2 mb-1 text-slate-900">
            <Navigation size={17} color={COLORS.green} /> AI wayfinding suggestion
          </h4>
          <p className="text-sm text-slate-600">
            Gate {busiest?.[0]} is your entry point but running at {Math.round(busiest?.[1])}% capacity. StadiumAI recommends Gate {quietest?.[0]} instead — only {Math.round(quietest?.[1])}% full, 4 min walk, step-free access available.
          </p>
        </div>

        <div className="rounded-2xl p-5 border flex items-start gap-3 text-slate-850" style={{ borderColor: "rgba(0,0,0,0.08)", background: "white" }}>
          <Bus size={19} color={COLORS.green} className="mt-0.5 shrink-0" />
          <div>
            <h4 className="font-semibold text-slate-900">Transportation assistant</h4>
            <p className="text-sm text-slate-600">Next shuttle to Downtown Transit Hub in 12 min from Lot 4. Post-match shuttle frequency increases to every 6 min based on predicted exit surge.</p>
          </div>
        </div>

        <div className="rounded-2xl p-5 border flex items-start gap-3 text-slate-850" style={{ borderColor: "rgba(0,0,0,0.08)", background: "white" }}>
          <Leaf size={19} color={COLORS.green} className="mt-0.5 shrink-0" />
          <div>
            <h4 className="font-semibold text-slate-900">Your sustainability footprint</h4>
            <p className="text-sm text-slate-600">Shuttle + metro to today's match: 2.1 kg CO₂ saved vs. driving alone. Refill stations near Gate D and Gate F.</p>
          </div>
        </div>

        <div className="rounded-2xl p-5 border flex items-start gap-3 text-slate-850" style={{ borderColor: "rgba(0,0,0,0.08)", background: "white" }}>
          <Accessibility size={19} color={COLORS.green} className="mt-0.5 shrink-0" />
          <div className="flex-1">
            <h4 className="font-semibold text-slate-900">Accessibility mode</h4>
            <p className="text-sm mb-2 text-slate-600">High-contrast display, step-free routing, and sign-language avatar support.</p>
            <button
              onClick={() => setHighContrast((v) => !v)}
              className="text-xs font-semibold px-3 py-1.5 rounded-full border cursor-pointer"
              style={{ borderColor: COLORS.green, color: COLORS.green }}
            >
              {highContrast ? "Disable high-contrast mode" : "Enable high-contrast mode"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   ORGANIZER VIEW
========================================================= */
function OrganizerView() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Fans in venue", value: "38,900", icon: Users },
          { label: "Capacity used", value: "71%", icon: TrendingUp },
          { label: "Open incidents", value: "3", icon: AlertTriangle },
          { label: "Avg. gate wait", value: "4.2 min", icon: Clock },
        ].map((s) => (
          <div key={s.label} className="rounded-2xl p-4 border text-slate-800" style={{ borderColor: "rgba(0,0,0,0.08)", background: "white" }}>
            <s.icon size={18} color={COLORS.green} />
            <p className="text-2xl font-bold mt-2 text-slate-900">{s.value}</p>
            <p className="text-xs text-slate-500">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="rounded-2xl p-5 border bg-white" style={{ borderColor: "rgba(0,0,0,0.08)" }}>
          <h4 className="font-bold text-slate-900 mb-3">Entry rate over time</h4>
          <div style={{ width: "100%", height: 220 }}>
            <ResponsiveContainer>
              <LineChart data={ENTRY_DATA}>
                <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                <XAxis dataKey="t" tick={{ fontSize: 11, fill: '#64748B' }} />
                <YAxis tick={{ fontSize: 11, fill: '#64748B' }} />
                <Tooltip />
                <Line type="monotone" dataKey="fans" stroke={COLORS.green} strokeWidth={2.5} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-2xl p-5 border bg-white" style={{ borderColor: "rgba(0,0,0,0.08)" }}>
          <h4 className="font-bold text-slate-900 mb-3">Gate-wise capacity</h4>
          <div style={{ width: "100%", height: 220 }}>
            <ResponsiveContainer>
              <BarChart data={GATE_BAR}>
                <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#64748B' }} />
                <YAxis tick={{ fontSize: 11, fill: '#64748B' }} />
                <Tooltip />
                <Bar dataKey="capacity" fill={COLORS.gold} radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="rounded-2xl p-5 border bg-white" style={{ borderColor: "rgba(0,0,0,0.08)" }}>
        <h4 className="font-bold text-slate-900 mb-3 flex items-center gap-2">
          <ShieldAlert size={18} color={COLORS.coral} /> AI-flagged incidents
        </h4>
        <div className="space-y-2">
          {INCIDENTS.map((inc) => (
            <div key={inc.id} className="flex items-start gap-3 p-3 rounded-xl" style={{ background: COLORS.chalk }}>
              <span
                className="text-[10px] font-bold px-2 py-1 rounded-full shrink-0 mt-0.5"
                style={{
                  background: inc.sev === "high" ? COLORS.coral : inc.sev === "med" ? COLORS.gold : COLORS.green,
                  color: inc.sev === "med" ? COLORS.navyDeep : "white",
                }}
              >
                {inc.type.toUpperCase()}
              </span>
              <div>
                <p className="text-sm font-semibold text-slate-900">{inc.loc}</p>
                <p className="text-xs text-slate-600">{inc.ai}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   VOLUNTEER VIEW
========================================================= */
function VolunteerView() {
  const cols = [
    { key: "urgent", label: "Urgent", color: COLORS.coral, items: TASKS.urgent },
    { key: "inProgress", label: "In progress", color: COLORS.gold, items: TASKS.inProgress },
    { key: "done", label: "Done", color: COLORS.green, items: TASKS.done },
  ];
  return (
    <div className="grid md:grid-cols-3 gap-4">
      {cols.map((c) => (
        <div key={c.key} className="rounded-2xl p-4 border bg-white" style={{ borderColor: "rgba(0,0,0,0.08)" }}>
          <div className="flex items-center gap-2 mb-3">
            <span className="w-2.5 h-2.5 rounded-full" style={{ background: c.color }} />
            <h4 className="font-bold text-sm text-slate-900">{c.label}</h4>
            <span className="text-xs ml-auto text-slate-500 font-semibold">{c.items.length}</span>
          </div>
          <div className="space-y-2">
            {c.items.map((t) => (
              <div key={t.id} className="p-3 rounded-xl" style={{ background: COLORS.chalk }}>
                <p className="text-sm font-semibold text-slate-900">{t.title}</p>
                <span className="text-[10px] font-bold uppercase mt-1 inline-block" style={{ color: COLORS.green }}>{t.tag}</span>
              </div>
            ))}
            {c.items.length === 0 && (
              <p className="text-xs italic text-slate-400">No tasks here right now.</p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

/* =========================================================
   ROOT APP
========================================================= */
export default function StadiumAI({ session, onLogout }) {
  const [role, setRole] = useState(() => {
    if (session && session.role === "staff") return "volunteer";
    return session ? session.role : "fan";
  });
  const [highContrast, setHighContrast] = useState(false);
  const [densities, setDensities] = useState(() =>
    Object.fromEntries(GATES.map((g) => [g.id, g.base]))
  );
  const [ticker, setTicker] = useState(38900);
  const [navOpen, setNavOpen] = useState(false);

  // Simulate real-time crowd fluctuation
  useEffect(() => {
    const id = setInterval(() => {
      setDensities((prev) => {
        const next = { ...prev };
        GATES.forEach((g) => {
          const delta = (Math.random() - 0.5) * 8;
          next[g.id] = Math.min(96, Math.max(10, prev[g.id] + delta));
        });
        return next;
      });
      setTicker((v) => v + Math.floor(Math.random() * 40));
    }, 2500);
    return () => clearInterval(id);
  }, []);

  const roles = [
    { key: "fan", label: "Fan" },
    { key: "organizer", label: "Organizer" },
    { key: "volunteer", label: "Volunteer / staff" },
  ];

  return (
    <div className={`min-h-screen w-full flex flex-col ${highContrast ? "contrast-125" : ""}`} style={{ background: COLORS.chalk }}>
      {/* Top nav */}
      <header className="sticky top-0 z-40 bg-slate-900 border-b border-slate-800" style={{ background: COLORS.navy }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center font-black text-sm" style={{ background: COLORS.gold, color: COLORS.navyDeep }}>SA</div>
            <span className="text-white font-black text-lg tracking-tight">StadiumAI</span>
            <span className="hidden sm:inline-flex text-[9px] font-bold uppercase tracking-wider bg-emerald-600 text-white px-2 py-0.5 rounded border border-emerald-500/30">
              Live matchday grid
            </span>
          </div>
          
          <nav className="hidden md:flex items-center gap-1 rounded-full p-1 bg-slate-950/40 border border-slate-800/80">
            {roles.map((r) => (
              <button
                key={r.key}
                onClick={() => setRole(r.key)}
                className="px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer"
                style={{
                  background: role === r.key ? COLORS.gold : "transparent",
                  color: role === r.key ? COLORS.navyDeep : "rgba(255,255,255,0.75)",
                }}
              >
                {r.label}
              </button>
            ))}
          </nav>
          
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex flex-col text-right">
              <span className="text-[10px] text-slate-400 font-semibold">Authenticated Session</span>
              <span className="text-xs text-white font-bold max-w-[120px] truncate">{session?.email || "user@fifa.com"}</span>
            </div>
            <button
              onClick={onLogout}
              className="text-xs font-bold px-3 py-1.5 rounded-lg border border-white/20 text-white hover:bg-white/5 transition-all cursor-pointer"
              aria-label="Log out user session"
            >
              Log Out
            </button>
            <button className="md:hidden text-white cursor-pointer" onClick={() => setNavOpen((v) => !v)} aria-label="Toggle navigation">
              <Menu size={22} />
            </button>
          </div>
        </div>

        {navOpen && (
          <div className="md:hidden flex flex-col gap-1 px-4 pb-3 border-t border-slate-800 pt-2 bg-slate-900">
            {roles.map((r) => (
              <button
                key={r.key}
                onClick={() => { setRole(r.key); setNavOpen(false); }}
                className="px-4 py-2 rounded-lg text-sm font-semibold text-left transition-colors"
                style={{ background: role === r.key ? COLORS.gold : "rgba(255,255,255,0.06)", color: role === r.key ? COLORS.navyDeep : "white" }}
              >
                {r.label}
              </button>
            ))}
          </div>
        )}

        {/* Scoreboard ticker */}
        <div className="border-t overflow-hidden border-slate-800/80" style={{ background: COLORS.navyDeep }}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-1.5 flex items-center gap-6 text-[10px] font-mono font-semibold overflow-x-auto whitespace-nowrap" style={{ color: COLORS.gold }}>
            <span>FANS IN STADIUM: {ticker.toLocaleString()}</span>
            <span className="opacity-30">·</span>
            <span>GATE D STATUS: CLEAR (35%)</span>
            <span className="opacity-30">·</span>
            <span>GATE C CONGESTION WARNING: HIGH (88%)</span>
            <span className="opacity-30">·</span>
            <span>SHUTTLES TO TRANSIT HUB: ACTIVE (EVERY 6 MIN)</span>
            <span className="opacity-30">·</span>
            <span>SUSTAINABILITY SAVINGS TODAY: 2,480 kg CO₂</span>
          </div>
        </div>
      </header>

      {/* Hero Header */}
      <section className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200 pb-6">
          <div>
            <p className="text-xs font-bold tracking-widest mb-1.5 uppercase" style={{ color: COLORS.green }}>
              FIFA World Cup 2026 · Matchday Operations Center
            </p>
            <h1 className="text-3xl md:text-4xl font-extrabold leading-tight text-slate-900 tracking-tight font-heading">
              Every fan finds their gate. <br className="hidden sm:inline" />
              Every crowd, understood in real time.
            </h1>
          </div>
          <div className="bg-slate-200 border border-slate-300 rounded-xl px-4 py-2 flex items-center gap-2.5 shrink-0 self-start md:self-auto shadow-sm">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#2E7D5B] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#2E7D5B]"></span>
            </span>
            <div className="text-[10px] uppercase font-bold tracking-wider text-slate-700">
              Active Profile: <span className="font-black text-slate-900">{role === "volunteer" ? "Volunteer / Staff" : role}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Main View Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        {role === "fan" && <FanView densities={densities} highContrast={highContrast} setHighContrast={setHighContrast} />}
        {role === "organizer" && <OrganizerView />}
        {role === "volunteer" && <VolunteerView />}
      </main>

      <ChatWidget />
    </div>
  );
}
