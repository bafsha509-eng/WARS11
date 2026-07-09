export const GATES = [
  { id: "A", label: "Gate A · North", angle: -90, base: 62 },
  { id: "B", label: "Gate B · Northeast", angle: -30, base: 41 },
  { id: "C", label: "Gate C · Southeast", angle: 30, base: 88 },
  { id: "D", label: "Gate D · South", angle: 90, base: 35 },
  { id: "E", label: "Gate E · Southwest", angle: 150, base: 55 },
  { id: "F", label: "Gate F · Northwest", angle: -150, base: 70 },
];

export const ENTRY_DATA = [
  { t: "16:00", fans: 4200 },
  { t: "16:30", legacyFans: 9800, fans: 9800 },
  { t: "17:00", legacyFans: 18500, fans: 18500 },
  { t: "17:30", legacyFans: 27200, fans: 27200 },
  { t: "18:00", legacyFans: 34100, fans: 34100 },
  { t: "18:30", legacyFans: 38900, fans: 38900 },
];

export const GATE_BAR = GATES.map((g) => ({ name: g.id, capacity: g.base }));

export const INCIDENTS = [
  { id: 1, type: "Medical", loc: "Section 214", ai: "Nearest medical team (Bay 3) dispatched — ETA 2 min.", sev: "high" },
  { id: 2, type: "Lost item", loc: "Gate C concourse", ai: "Matched to lost-and-found log at Kiosk 2.", sev: "low" },
  { id: 3, type: "Congestion", loc: "Gate C", ai: "Suggest redirecting overflow to Gate D, 45% under capacity.", sev: "med" },
];

export const TASKS = {
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

export const LANGUAGES = [
  { code: "en", label: "English" },
  { code: "es", label: "Español" },
  { code: "fr", label: "Français" },
  { code: "hi", label: "हिंदी" },
  { code: "pt", label: "Português" },
];

export const QUICK_REPLIES = {
  en: ["Nearest restroom", "Gate wait time", "Next shuttle", "Wheelchair route"],
  es: ["Baño más cercano", "Espera en la puerta", "Próximo autobús", "Ruta accesible"],
  fr: ["Toilettes proches", "Attente à la porte", "Prochaine navette", "Accès handicapé"],
  hi: ["नज़दीकी शौचालय", "गेट पर प्रतीक्षा", "अगली शटल", "व्हीलचेयर मार्ग"],
  pt: ["Banheiro mais próximo", "Espera no portão", "Próximo ônibus", "Rota acessível"],
};

export const GREETING = {
  en: "Hi! I'm your StadiumAI concierge. Ask me about gates, restrooms, transport, or accessibility.",
  es: "¡Hola! Soy tu asistente StadiumAI. Pregúntame sobre puertas, baños, transporte o accesibilidad.",
  fr: "Bonjour ! Je suis votre assistant StadiumAI. Posez-moi des questions sur les portes, toilettes, transport.",
  hi: "नमस्ते! मैं आपका StadiumAI सहायक हूं। गेट, शौचालय, परिवहन या सुगम्यता के बारे में पूछें।",
  pt: "Olá! Sou o seu assistente StadiumAI. Pergunte-me sobre portões, banheiros, transporte ou acessibilidade.",
};

export const HOST_CITIES = [
  "Los Angeles", "Mexico City", "New York/New Jersey", "Toronto", 
  "Miami", "Dallas", "Vancouver", "Guadalajara", "Atlanta"
];
