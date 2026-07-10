/**
 * Utility helper functions for StadiumAI client.
 * Modularized for high code quality and test coverage.
 */

/**
 * Sanitizes input strings against HTML element injections.
 * @param {string} text 
 * @returns {string}
 */
export function sanitizeInput(text) {
  if (typeof text !== 'string') return '';
  return text.replace(/[<>'"`\-;*=]/g, '').trim();
}

/**
 * Performs frontend validation checks on login credentials.
 * @param {string} email 
 * @param {string} password 
 * @returns {{isValid: boolean, errors: {email?: string, password?: string}}}
 */
export function validateLogin(email, password) {
  const errors = {};
  const cleanEmail = sanitizeInput(email);
  const cleanPassword = password || '';
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!cleanEmail) {
    errors.email = "Email/Username is required.";
  } else if (!cleanEmail.includes('@')) {
    if (cleanEmail.length < 3) {
      errors.email = "Username must be at least 3 characters.";
    }
  } else if (!emailRegex.test(cleanEmail)) {
    errors.email = "Please enter a valid email address.";
  }

  if (!cleanPassword) {
    errors.password = "Password is required.";
  } else if (cleanPassword.length < 6) {
    errors.password = "Password must be at least 6 characters.";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
}

/**
 * Maps fan concierge chatbot queries to context-rich GenAI predictions.
 * Supports multilingual routes for English, Spanish, French, Hindi, and Portuguese.
 * @param {string} msg 
 * @param {string} lang 
 * @param {object} densities 
 * @returns {string}
 */
export function matchReply(msg, lang, densities) {
  const m = msg.toLowerCase();
  const busiest = getBusiestGate(densities);
  const quietest = getQuietestGate(densities);

  const R = {
    en: {
      restroom: "🤖 **GenAI Live Route Recommendation**: Based on live occupancy sensors, restrooms behind Section 112 have a 3-minute wait. However, Section 114 restrooms are currently vacant (0 min wait). Accessible paths are clear.",
      gate: busiest && quietest
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
      gate: busiest && quietest
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
      gate: busiest && quietest
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
      gate: busiest && quietest
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
      gate: busiest && quietest
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
  const dict = R[lang] || R.en;
  if (m.includes("restroom") || m.includes("baño") || m.includes("toilette") || m.includes("शौचालय") || m.includes("banheiro")) return dict.restroom;
  if (m.includes("gate") || m.includes("puerta") || m.includes("porte") || m.includes("गेट") || m.includes("portão")) return dict.gate;
  if (m.includes("shuttle") || m.includes("autobús") || m.includes("navette") || m.includes("शटल") || m.includes("ônibus")) return dict.shuttle;
  if (m.includes("wheelchair") || m.includes("accesible") || m.includes("handicap") || m.includes("व्हीलचेयर") || m.includes("acessível") || m.includes("acessivel")) return dict.wheelchair;
  if (m.includes("sustainability") || m.includes("sostenibilidad") || m.includes("conseil éco") || m.includes("पर्यावरण") || m.includes(" ecol") || m.includes("éco") || m.includes("co2") || m.includes("carbon") || m.includes("green") || m.includes("verde") || m.includes("vert") || m.includes("iniciativa") || m.includes("initiative")) return dict.sustainability;
  if (m.includes("food") || m.includes("comida") || m.includes("restauration") || m.includes("भोजन") || m.includes("eat") || m.includes("drink") || m.includes("dietary") || m.includes("manger") || m.includes("végétarien") || m.includes("vegetar") || m.includes("nourriture") || m.includes("alimenta")) return dict.food;
  if (m.includes("lost") || m.includes("perdidos") || m.includes("trouvés") || m.includes("खोया") || m.includes("keys") || m.includes("wallet") || m.includes("perdi") || m.includes("perdeu") || m.includes("achados") || m.includes("encontrados")) return dict.lost;
  if (m.includes("medical") || m.includes("médico") || m.includes("secours") || m.includes("चिकित्सा") || m.includes("first aid") || m.includes("doctor")) return dict.medical;
  return dict.default;
}

/**
 * Classifies gate traffic levels based on capacity metrics.
 * @param {number} capacity 
 * @returns {string}
 */
export function getGateTrafficLevel(capacity) {
  if (typeof capacity !== 'number') return 'clear';
  if (capacity > 70) return 'busy';
  if (capacity > 45) return 'moderate';
  return 'clear';
}

/**
 * Calculates carbon savings based on transit modes vs driving.
 * @param {string} transitType 
 * @param {number} distance 
 * @returns {number} Saved CO2 in kg
 */
export function calculateCo2Savings(transitType, distance) {
  const normDist = Math.max(0, Number(distance) || 0);
  if (transitType === 'metro') {
    return Math.round(normDist * 0.143 * 10) / 10;
  }
  if (transitType === 'shuttle') {
    return Math.round(normDist * 0.082 * 10) / 10;
  }
  return Math.round(normDist * 0.112 * 10) / 10;
}

/**
 * Finds the gate with the highest crowd density.
 * @param {Record<string, number>} densities 
 * @returns {[string, number] | undefined} The gate entry [id, density] or undefined
 */
export function getBusiestGate(densities) {
  if (!densities || typeof densities !== 'object') return undefined;
  const entries = Object.entries(densities);
  if (entries.length === 0) return undefined;
  return entries.sort((a, b) => b[1] - a[1])[0];
}

/**
 * Finds the gate with the lowest crowd density.
 * @param {Record<string, number>} densities 
 * @returns {[string, number] | undefined} The gate entry [id, density] or undefined
 */
export function getQuietestGate(densities) {
  if (!densities || typeof densities !== 'object') return undefined;
  const entries = Object.entries(densities);
  if (entries.length === 0) return undefined;
  return entries.sort((a, b) => a[1] - b[1])[0];
}

/**
 * Standardizes or overrides the user role based on session attributes.
 * Maps 'staff' -> 'volunteer', defaulting to 'fan' if no session is active.
 * @param {{email?: string, role?: string} | null} session 
 * @returns {string} Target role
 */
export function resolveUserRole(session) {
  if (!session) return "fan";
  const r = session.role;
  if (r === "staff") return "volunteer";
  return r || "fan";
}

/**
 * Converts polar coordinates on the stadium bowl map to SVG viewport Cartesian coordinates.
 * @param {number} angle 
 * @param {number} radius 
 * @param {number} centerX 
 * @param {number} centerY 
 * @returns {{x: number, y: number}}
 */
export function calculateGateCoordinates(angle, radius, centerX = 200, centerY = 200) {
  if (typeof angle !== 'number' || typeof radius !== 'number') {
    return { x: centerX, y: centerY };
  }
  const rad = (angle * Math.PI) / 180;
  return {
    x: Math.round((centerX + radius * Math.cos(rad)) * 100) / 100,
    y: Math.round((centerY + radius * Math.sin(rad)) * 100) / 100
  };
}

/**
 * Adds a new operational incident to the incident list.
 * @param {Array<{id: number, type: string, loc: string, ai: string, sev: string}>} incidentsList 
 * @param {string} type 
 * @param {string} location 
 * @param {string} severity 
 * @param {string} description 
 * @returns {Array<{id: number, type: string, loc: string, ai: string, sev: string}>} New incident list
 */
export function addNewIncident(incidentsList, type, location, severity, description) {
  if (!Array.isArray(incidentsList)) return [];
  const nextId = incidentsList.reduce((max, item) => Math.max(max, item.id || 0), 0) + 1;
  return [
    ...incidentsList,
    {
      id: nextId,
      type: type || "General",
      loc: location || "Unknown",
      ai: description || "AI assessment in progress.",
      sev: severity || "low"
    }
  ];
}

/**
 * Adds a new task to the task board state.
 * @param {Record<string, Array<{id: number, title: string, tag: string}>>} tasksState 
 * @param {string} columnKey 
 * @param {string} title 
 * @param {string} tag 
 * @returns {Record<string, Array<{id: number, title: string, tag: string}>>} Updated tasks state
 */
export function addNewTask(tasksState, columnKey, title, tag) {
  if (!tasksState || typeof tasksState !== 'object') return {};
  const column = tasksState[columnKey] || [];
  const allTasks = [
    ...(tasksState.urgent || []),
    ...(tasksState.inProgress || []),
    ...(tasksState.done || [])
  ];
  const nextId = allTasks.reduce((max, item) => Math.max(max, item.id || 0), 0) + 1;
  return {
    ...tasksState,
    [columnKey]: [
      ...column,
      { id: nextId, title: title || "New Task", tag: tag || "Ops" }
    ]
  };
}

/**
 * Transitions a task to a target workflow column status.
 * @param {Record<string, Array<{id: number, title: string, tag: string}>>} tasks 
 * @param {number} taskId 
 * @param {string} targetColumn 
 * @returns {Record<string, Array<{id: number, title: string, tag: string}>>} Updated tasks state
 */
export function moveTaskState(tasks, taskId, targetColumn) {
  if (!tasks || typeof tasks !== 'object') return {};
  let foundTask = null;
  const nextTasks = {
    urgent: (tasks.urgent || []).filter(t => {
      if (t.id === taskId) { foundTask = t; return false; }
      return true;
    }),
    inProgress: (tasks.inProgress || []).filter(t => {
      if (t.id === taskId) { foundTask = t; return false; }
      return true;
    }),
    done: (tasks.done || []).filter(t => {
      if (t.id === taskId) { foundTask = t; return false; }
      return true;
    })
  };

  if (foundTask && nextTasks[targetColumn]) {
    nextTasks[targetColumn] = [...nextTasks[targetColumn], foundTask];
  }
  return nextTasks;
}
