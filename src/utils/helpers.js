import { CHAT_RESPONSES } from "./constants";

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

  const dict = CHAT_RESPONSES[lang] || CHAT_RESPONSES.en;

  if (m.includes("restroom") || m.includes("baño") || m.includes("toilette") || m.includes("शौचालय") || m.includes("banheiro")) return dict.restroom;
  
  if (m.includes("gate") || m.includes("puerta") || m.includes("porte") || m.includes("गेट") || m.includes("portão")) {
    return typeof dict.gate === "function" ? dict.gate(busiest, quietest) : dict.gate;
  }
  
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
