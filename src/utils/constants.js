export const COLORS = {
  navy: "#0F1E33",
  navyDeep: "#0A1524",
  gold: "#F2B84C",
  goldDeep: "#C99328",
  green: "#2E7D5B",
  greenLight: "#4FA97C",
  coral: "#E2583E",
  chalk: "#F5F3EC",
  ink: "#12202F",
  slate: "#94A3B8",
};

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

export const CHAT_RESPONSES = {
  en: {
    restroom: "🤖 **GenAI Live Route Recommendation**: Based on live occupancy sensors, restrooms behind Section 112 have a 3-minute wait. However, Section 114 restrooms are currently vacant (0 min wait). Accessible paths are clear.",
    gate: (busiest, quietest) => busiest && quietest
      ? `🤖 **GenAI Predictive Crowd Routing**: Gate ${busiest[0]} is running at ${Math.round(busiest[1])}% capacity (heavy congestion). I recommend shifting to Gate ${quietest[0]} (${Math.round(quietest[1])}% capacity, under 2 min wait).`
      : "🤖 **GenAI Predictive Crowd Routing**: Gate C is running at 88% capacity (15 min wait). I recommend shifting to Gate D (35% capacity, under 2 min wait). Lot 4 shuttle departs in 6 min to assist.",
    shuttle: "🤖 **GenAI Transport Estimate**: Next shuttle to Downtown Transit Hub departs in 12 min from Lot 4. Exit shuttle frequency will pre-route to every 6 min to manage exit surges.",
    wheelchair: "🤖 **GenAI Accessibility Route**: Accessible path active. Direct ramp access at Gate B, elevator to upper tier. Refill stations are 15m from the elevator exit.",
    sustainability: "🤖 **GenAI Sustainability Advisor**: Reusable bottle refill stations are active near Gates D and F. Using these stations reduces single-use plastic waste and saves approximately 0.15kg of CO₂ per refill. Public transport options today have already saved 2,480 kg of CO₂!",
    food: "🤖 **GenAI Sustainable Dining**: Section 110 offers premium plant-based food options, reducing carbon footprint emissions by 84% compared to beef choices. Reusable stadium cups can be returned to any recycling hub.",
    lost: "🤖 **GenAI Lost & Found Tracker**: Report lost items directly here. Our current log shows a match for item keys/wallets at Kiosk 2 near the Gate C concourse. Let us know if you need a volunteer escort.",
    medical: "🤖 **GenAI Medical Support**: First aid units are stationed at Section 102 and Section 214. If you have an emergency, please notify venue staff or tap 'Medical Incident' on your dashboard to dispatch help.",
    default: "🤖 **StadiumAI Concierge**: I can guide you through live gate capacities, transport schedules, accessible routes, and sustainability. Tap a quick-reply or ask a new question.",
  },
  es: {
    restroom: "🤖 **GenAI - Recomendación de baño**: El baño detrás de la Sección 112 tiene una espera de 3 min. El de la Sección 114 está vacío (0 min de espera). Ruta accesible habilitada.",
    gate: (busiest, quietest) => busiest && quietest
      ? `🤖 **GenAI - Tránsito de puertas**: La Puerta ${busiest[0]} está al ${Math.round(busiest[1])}% de capacidad. Recomiendo cambiar a la Puerta ${quietest[0]} (${Math.round(quietest[1])}% de capacidad, menos de 2 min de espera).`
      : "🤖 **GenAI - Tránsito de puertas**: La Puerta C está al 88% de capacidad (15 min espera). La Puerta D está más despejada (35% de capacidad, 2 min espera).",
    shuttle: "🤖 **GenAI - Transporte**: El próximo shuttle al centro sale en 12 min del Lote 4. La frecuencia se incrementará a cada 6 min tras el partido.",
    wheelchair: "🤖 **GenAI - Accesibilidad**: Ruta sin barreras activada. Rampa de acceso en la Puerta B, ascensor a tu sección sin escaleras.",
    sustainability: "🤖 **GenAI - Asesor de Sostenibilidad**: Estaciones de recarga cerca de Puertas D y F. Cada recarga ahorra 0.15kg de CO₂. ¡El transporte público ha ahorrado 2,480 kg de CO₂ hoy!",
    food: "🤖 **GenAI - Comida Sostenible**: La Sección 110 ofrece opciones vegetarianas que reducen las emisiones de carbono en un 84%. Devuelve los vasos reutilizables.",
    lost: "🤖 **GenAI - Objetos Perdidos**: Registro activo. Hay una coincidencia de llaves/carteras en el Quiosco 2 cerca de la Puerta C. ¿Deseas asistencia de un voluntario?",
    medical: "🤖 **GenAI - Soporte Médico**: Puntos de primeros auxilios en Sección 102 y Sección 214. Para emergencias urgentes, avisa al personal o activa la alerta médica.",
    default: "🤖 **Asistente StadiumAI**: Puedo ayudarte con capacidad de puertas, transportes y accesibilidad. Elige una opción rápida abajo.",
  },
  fr: {
    restroom: "🤖 **GenAI - Recommandation toilettes**: Toilettes Section 112 attente 3 min. Section 114 actuellement libre (0 min attente). Itinéraire accessible libre.",
    gate: (busiest, quietest) => busiest && quietest
      ? `🤖 **GenAI - Analyse des portes**: La Porte ${busiest[0]} est encombrée à ${Math.round(busiest[1])}%. Choisissez la Porte ${quietest[0]} (${Math.round(quietest[1])}%, moins de 2 min d'attente).`
      : "🤖 **GenAI - Analyse des portes**: La Porte C est encombrée à 88% (15 min attente). Choisissez la Porte D (35%, moins de 2 min d'attente).",
    shuttle: "🤖 **GenAI - Navettes**: Départ dans 12 min du Parking 4. Fréquence augmentée à 6 min après le match.",
    wheelchair: "🤖 **GenAI - Itinéraire PMR**: Accès rampe par la Porte B, ascenseur direct sans marches.",
    sustainability: "🤖 **GenAI - Conseil Éco**: Points d'eau près des Portes D et F. Remplir votre gourde économise 0.15kg de CO₂. 2 480 kg de CO₂ économisés aujourd'hui !",
    food: "🤖 **GenAI - Restauration Durable**: Section 110 propose des repas végétariens (84% d'émissions de carbone en moins). Gobelets consignés recyclables.",
    lost: "🤖 **GenAI - Objets Trouvés**: Suivi actif. Clés/portefeuilles correspondants trouvés au Kiosque 2 près de la Porte C. Besoin d'aide d'un bénévole ?",
    medical: "🤖 **GenAI - Assistance Médicale**: Postes de secours en Section 102 et Section 214. En cas d'urgence, prévenez le personnel ou signalez l'incident.",
    default: "🤖 **Concierge StadiumAI**: Posez-moi des questions sur les portes, les navettes, ou l'accessibilité.",
  },
  hi: {
    restroom: "🤖 **GenAI - शौचालय मार्ग**: सेक्शन 112 के पीछे शौचालय में 3 मिनट की प्रतीक्षा है। हालांकि, सेक्शन 114 का शौचालय खाली है (0 मिनट प्रतीक्षा)। सुगम मार्ग सक्रिय है।",
    gate: (busiest, quietest) => busiest && quietest
      ? `🤖 **GenAI - गेट क्षमता**: गेट ${busiest[0]} पर ${Math.round(busiest[1])}% भीड़ है। शांत प्रवेश के लिए गेट ${quietest[0]} (${Math.round(quietest[1])}% क्षमता, 2 मिनट प्रतीक्षा) का उपयोग करें।`
      : "🤖 **GenAI - गेट क्षमता**: गेट C पर 88% भीड़ है (15 मिनट प्रतीक्षा)। शांत प्रवेश के लिए गेट D (35% क्षमता, 2 मिनट प्रतीक्षा) का उपयोग करें।",
    shuttle: "🤖 **GenAI - शटल सेवा**: अगली शटल लॉट 4 से 12 मिनट में प्रस्थान करेगी। मैच के बाद फ्रीक्वेंसी बढ़ाकर हर 6 मिनट की जाएगी।",
    wheelchair: "🤖 **GenAI - व्हीलचेयर मार्ग**: सुगम्य मार्ग सक्रिय: गेट B पर रैंप, आपके सेक्शन तक लिफ्ट उपलब्ध है, कोई सीढ़ियां नहीं।",
    sustainability: "🤖 **GenAI - पर्यावरण सलाहकार**: गेट D और F के पास रिफिल स्टेशन हैं। पानी रिफिल करने से प्रति बोतल 0.15kg CO₂ की बचत होती है। आज 2,480 kg CO₂ बचाया गया!",
    food: "🤖 **GenAI - पर्यावरण अनुकूल भोजन**: सेक्शन 110 में शाकाहारी भोजन उपलब्ध है जो कार्बन उत्सर्जन को 84% तक कम करता है। कपों को रीसाइक्लिंग हब में लौटाएं।",
    lost: "🤖 **GenAI - खोया-पाया ट्रैकर**: गेट C कॉनकोर्स के पास कियोस्क 2 पर चाबियों/बटुए का मिलान हुआ है। क्या आपको स्वयंसेवक सहायता की आवश्यकता है?",
    medical: "🤖 **GenAI - चिकित्सा सहायता**: सेक्शन 102 और सेक्शन 214 में प्राथमिक चिकित्सा इकाइयां हैं। आपातकालीन स्थिति में तुरंत स्टाफ को सूचित करें।",
    default: "🤖 **StadiumAI सहायक**: मैं गेट वेटिंग, शटल समय और सुगम्य मार्ग की जानकारी दे सकता हूं। नीचे दिए गए विकल्प चुनें।",
  },
  pt: {
    restroom: "🤖 **GenAI - Recomendação de Banheiro**: Com base nos sensores de ocupação ao vivo, os banheiros atrás da Seção 112 têm uma espera de 3 minutos. No entanto, os banheiros da Seção 114 estão vazios (0 min de espera). Rota acessível desobstruída.",
    gate: (busiest, quietest) => busiest && quietest
      ? `🤖 **GenAI - Roteamento Preditivo de Multidões**: O Portão ${busiest[0]} está operando com ${Math.round(busiest[1])}% de capacidade. Recomendo ir para o Portão ${quietest[0]} (${Math.round(quietest[1])}% de capacidade, menos de 2 min de espera).`
      : "🤖 **GenAI - Roteamento Preditivo de Multidões**: O Portão C está operando com 88% de capacidade (15 min de espera). Recomendo ir para o Portão D (35% de capacidade, menos de 2 min de espera). O ônibus do Estacionamento 4 parte em 6 min para ajudar.",
    shuttle: "🤖 **GenAI - Estimativa de Transporte**: O próximo ônibus para o Centro de Transporte sai em 12 min do Estacionamento 4. A frequência dos ônibus será ajustada para cada 6 min para gerenciar o fluxo de saída.",
    wheelchair: "🤖 **GenAI - Rota de Acessibilidade**: Rota acessível ativa. Acesso direto por rampa no Portão B, elevador para o nível superior. Estações de recarga de água ficam a 15m da saída do elevador.",
    sustainability: "🤖 **GenAI - Assessor de Sustentabilidade**: Estações de recarga perto dos Portões D e F. Cada uso economiza 0.15kg de CO₂. Economia hoje de 2.480 kg de CO₂!",
    food: "🤖 **GenAI - Alimentação Sustentável**: A Seção 110 oferece refeições plant-based (redução de 84% de carbono). Copos reutilizáveis podem ser reciclados.",
    lost: "🤖 **GenAI - Achados e Perdidos**: Registro ativo. Chaves/carteiras correspondentes encontradas no Quiosque 2 perto do Portão C. Deseja ajuda de um voluntário?",
    medical: "🤖 **GenAI - Suporte Médico**: Postos de primeiros socorros nas Seções 102 e 214. Em caso de emergência, avise a equipe ou acione o alerta.",
    default: "🤖 **StadiumAI Concierge**: Posso orientá-lo sobre a capacidade dos portões, horários de transporte, rotas acessíveis e sustentabilidade. Toque em uma resposta rápida ou faça uma nova pergunta.",
  },
};
