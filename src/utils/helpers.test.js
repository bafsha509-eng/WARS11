import { describe, it, expect } from "vitest";
import { 
  sanitizeInput, 
  validateLogin, 
  matchReply, 
  getGateTrafficLevel, 
  calculateCo2Savings,
  getBusiestGate,
  getQuietestGate,
  resolveUserRole,
  calculateGateCoordinates,
  addNewIncident,
  addNewTask,
  moveTaskState
} from "./helpers";

describe("sanitizeInput utility", () => {
  it("should strip HTML angle brackets", () => {
    expect(sanitizeInput("<div>test</div>")).toBe("divtest/div");
    expect(sanitizeInput("<script>alert(1)</script>")).toBe("scriptalert(1)/script");
  });

  it("should trim surrounding whitespace", () => {
    expect(sanitizeInput("  valid text   ")).toBe("valid text");
  });

  it("should handle non-string arguments gracefully", () => {
    expect(sanitizeInput(null)).toBe("");
    expect(sanitizeInput(undefined)).toBe("");
    expect(sanitizeInput(123)).toBe("");
  });

  it("should strip SQL and XSS injection characters", () => {
    expect(sanitizeInput("admin' OR 1=1--")).toBe("admin OR 11");
  });
});

describe("validateLogin credentials scheme", () => {
  it("should return valid status for correct email inputs", () => {
    const result = validateLogin("fan@fifa2026.com", "secure123");
    expect(result.isValid).toBe(true);
    expect(result.errors).toEqual({});
  });

  it("should return valid status for correct username inputs (no @, >= 3 chars)", () => {
    const result = validateLogin("admin", "secure123");
    expect(result.isValid).toBe(true);
    expect(result.errors).toEqual({});
  });

  it("should flag empty email/username errors", () => {
    const result = validateLogin("", "secure123");
    expect(result.isValid).toBe(false);
    expect(result.errors.email).toBe("Email/Username is required.");
  });

  it("should flag short username check errors (under 3 chars)", () => {
    const result = validateLogin("ad", "secure123");
    expect(result.isValid).toBe(false);
    expect(result.errors.email).toBe("Username must be at least 3 characters.");
  });

  it("should flag invalid email formats", () => {
    const result = validateLogin("invalid@email", "secure123");
    expect(result.isValid).toBe(false);
    expect(result.errors.email).toBe("Please enter a valid email address.");
  });

  it("should flag empty password check errors", () => {
    const result = validateLogin("fan@fifa2026.com", "");
    expect(result.isValid).toBe(false);
    expect(result.errors.password).toBe("Password is required.");
  });

  it("should flag short password checks (under 6 chars)", () => {
    const result = validateLogin("fan@fifa2026.com", "12345");
    expect(result.isValid).toBe(false);
    expect(result.errors.password).toBe("Password must be at least 6 characters.");
  });
});

describe("matchReply multilingual chatbot routing", () => {
  // English (en) Tests
  it("should resolve English queries correctly", () => {
    expect(matchReply("Where is the restroom?", "en")).toContain("occupancy sensors");
    expect(matchReply("What is the gate status?", "en")).toContain("Predictive Crowd Routing");
    expect(matchReply("When is the next shuttle?", "en")).toContain("Transport Estimate");
    expect(matchReply("Where is the wheelchair route?", "en")).toContain("Accessibility Route");
    expect(matchReply("hello there", "en")).toContain("StadiumAI Concierge");
  });

  // Spanish (es) Tests
  it("should resolve Spanish queries correctly", () => {
    expect(matchReply("¿Dónde está el baño?", "es")).toContain("Recomendación de baño");
    expect(matchReply("¿Cómo está la puerta?", "es")).toContain("Tránsito de puertas");
    expect(matchReply("¿Cuándo pasa el autobús?", "es")).toContain("Transporte");
    expect(matchReply("¿Tiene acceso accesible?", "es")).toContain("Accesibilidad");
    expect(matchReply("hola", "es")).toContain("Asistente StadiumAI");
  });

  // French (fr) Tests
  it("should resolve French queries correctly", () => {
    expect(matchReply("Où sont les toilettes?", "fr")).toContain("Recommandation toilettes");
    expect(matchReply("Quel est l'état de la porte?", "fr")).toContain("Analyse des portes");
    expect(matchReply("Où est la navette?", "fr")).toContain("Navettes");
    expect(matchReply("Est-ce accessible handicap?", "fr")).toContain("Itinéraire PMR");
    expect(matchReply("salut", "fr")).toContain("Concierge StadiumAI");
  });

  // Hindi (hi) Tests
  it("should resolve Hindi queries correctly", () => {
    expect(matchReply("शौचालय कहाँ है?", "hi")).toContain("शौचालय मार्ग");
    expect(matchReply("गेट पर कितनी भीड़ है?", "hi")).toContain("गेट क्षमता");
    expect(matchReply("शटल कब आएगी?", "hi")).toContain("शटल सेवा");
    expect(matchReply("व्हीलचेयर मार्ग कौन सा है?", "hi")).toContain("व्हीलचेयर मार्ग");
    expect(matchReply("नमस्ते", "hi")).toContain("StadiumAI सहायक");
  });

  // Portuguese (pt) Tests
  it("should resolve Portuguese queries correctly", () => {
    expect(matchReply("Onde fica o banheiro?", "pt")).toContain("Recomendação de Banheiro");
    expect(matchReply("Como está a fila do portão?", "pt")).toContain("Roteamento Preditivo de Multidões");
    expect(matchReply("Quando sai o próximo ônibus?", "pt")).toContain("Estimativa de Transporte");
    expect(matchReply("Qual a rota acessível para cadeirantes?", "pt")).toContain("Rota de Acessibilidade");
    expect(matchReply("Qual a rota acessivel?", "pt")).toContain("Rota de Acessibilidade");
    expect(matchReply("olá", "pt")).toContain("StadiumAI Concierge");
  });

  // Fallback / Unknown Language Tests
  it("should fallback to English for unknown languages or default queries", () => {
    expect(matchReply("unknown query details", "en")).toContain("StadiumAI Concierge");
    expect(matchReply("Where is the restroom?", "de")).toContain("occupancy sensors");
    expect(matchReply("unknown query details", "de")).toContain("StadiumAI Concierge");
  });

  it("should resolve gate queries dynamically when densities is provided", () => {
    const densities = { A: 10, B: 90, C: 40 };
    const reply = matchReply("How long is the gate wait?", "en", densities);
    expect(reply).toContain("Gate B is running at 90%");
    expect(reply).toContain("Gate A (10%");
  });
});

describe("getGateTrafficLevel helper classification", () => {
  it("should return clear for capacity under or equal to 45", () => {
    expect(getGateTrafficLevel(30)).toBe("clear");
    expect(getGateTrafficLevel(45)).toBe("clear");
  });

  it("should return moderate for capacity between 45 and 70", () => {
    expect(getGateTrafficLevel(46)).toBe("moderate");
    expect(getGateTrafficLevel(50)).toBe("moderate");
    expect(getGateTrafficLevel(70)).toBe("moderate");
  });

  it("should return busy for capacity over 70", () => {
    expect(getGateTrafficLevel(71)).toBe("busy");
    expect(getGateTrafficLevel(75)).toBe("busy");
    expect(getGateTrafficLevel(95)).toBe("busy");
  });

  it("should handle invalid inputs gracefully by returning clear", () => {
    expect(getGateTrafficLevel(null)).toBe("clear");
    expect(getGateTrafficLevel("invalid")).toBe("clear");
  });
});

describe("calculateCo2Savings environmental calculator", () => {
  it("should calculate correct savings for metro", () => {
    expect(calculateCo2Savings("metro", 10)).toBe(1.4);
  });

  it("should calculate correct savings for shuttle", () => {
    expect(calculateCo2Savings("shuttle", 10)).toBe(0.8);
  });

  it("should calculate correct savings for default multi-modal", () => {
    expect(calculateCo2Savings("other", 10)).toBe(1.1);
    expect(calculateCo2Savings("taxi", 5)).toBe(0.6);
  });

  it("should handle invalid distances gracefully", () => {
    expect(calculateCo2Savings("metro", -5)).toBe(0);
    expect(calculateCo2Savings("metro", null)).toBe(0);
    expect(calculateCo2Savings("metro", "invalid")).toBe(0);
  });
});

describe("getBusiestGate helper", () => {
  it("should find the busiest gate correctly", () => {
    const densities = { A: 45, B: 88, C: 20 };
    expect(getBusiestGate(densities)).toEqual(["B", 88]);
  });

  it("should return undefined for empty or invalid densities", () => {
    expect(getBusiestGate({})).toBeUndefined();
    expect(getBusiestGate(null)).toBeUndefined();
    expect(getBusiestGate(undefined)).toBeUndefined();
  });
});

describe("getQuietestGate helper", () => {
  it("should find the quietest gate correctly", () => {
    const densities = { A: 45, B: 88, C: 20 };
    expect(getQuietestGate(densities)).toEqual(["C", 20]);
  });

  it("should return undefined for empty or invalid densities", () => {
    expect(getQuietestGate({})).toBeUndefined();
    expect(getQuietestGate(null)).toBeUndefined();
    expect(getQuietestGate(undefined)).toBeUndefined();
  });
});

describe("resolveUserRole helper", () => {
  it("should resolve role correctly based on session data", () => {
    expect(resolveUserRole(null)).toBe("fan");
    expect(resolveUserRole({ role: "fan" })).toBe("fan");
    expect(resolveUserRole({ role: "organizer" })).toBe("organizer");
    expect(resolveUserRole({ role: "staff" })).toBe("volunteer");
    expect(resolveUserRole({ role: "volunteer" })).toBe("volunteer");
    expect(resolveUserRole({})).toBe("fan");
  });
});

describe("calculateGateCoordinates helper", () => {
  it("should calculate correct SVG coordinates for typical polar projections", () => {
    const coords1 = calculateGateCoordinates(0, 100, 200, 200);
    expect(coords1.x).toBe(300);
    expect(coords1.y).toBe(200);

    const coords2 = calculateGateCoordinates(180, 100, 200, 200);
    expect(coords2.x).toBe(100);
    expect(coords2.y).toBe(200);
  });

  it("should fallback to center for invalid inputs", () => {
    expect(calculateGateCoordinates(null, 100)).toEqual({ x: 200, y: 200 });
    expect(calculateGateCoordinates(90, null)).toEqual({ x: 200, y: 200 });
  });
});

describe("addNewIncident helper", () => {
  it("should append a new incident and increment id", () => {
    const list = [{ id: 1, type: "Medical", loc: "Section 214", ai: "ETA 2 min", sev: "high" }];
    const nextList = addNewIncident(list, "Lost item", "Gate C", "low", "Found key log");
    expect(nextList).toHaveLength(2);
    expect(nextList[1]).toEqual({
      id: 2,
      type: "Lost item",
      loc: "Gate C",
      sev: "low",
      ai: "Found key log"
    });
  });

  it("should handle empty or invalid lists", () => {
    expect(addNewIncident(null, "Medical", "Gate A", "high", "alert")).toEqual([]);
    expect(addNewIncident([], "Medical", "Gate A", "high", "alert")).toEqual([
      { id: 1, type: "Medical", loc: "Gate A", ai: "alert", sev: "high" }
    ]);
  });
});

describe("addNewTask helper", () => {
  it("should append a new task to the correct column and increment ID", () => {
    const tasks = {
      urgent: [{ id: 1, title: "task 1", tag: "Ops" }],
      inProgress: [],
      done: []
    };
    const nextTasks = addNewTask(tasks, "urgent", "task 2", "Safety");
    expect(nextTasks.urgent).toHaveLength(2);
    expect(nextTasks.urgent[1]).toEqual({ id: 2, title: "task 2", tag: "Safety" });
  });

  it("should handle empty or invalid tasks states", () => {
    expect(addNewTask(null, "urgent", "task", "tag")).toEqual({});
  });
});

describe("moveTaskState helper", () => {
  it("should move task from urgent to inProgress column", () => {
    const tasks = {
      urgent: [{ id: 1, title: "task 1", tag: "Ops" }],
      inProgress: [],
      done: []
    };
    const next = moveTaskState(tasks, 1, "inProgress");
    expect(next.urgent).toHaveLength(0);
    expect(next.inProgress).toHaveLength(1);
    expect(next.inProgress[0]).toEqual({ id: 1, title: "task 1", tag: "Ops" });
  });

  it("should return empty columns if task is not found", () => {
    const tasks = {
      urgent: [{ id: 1, title: "task 1", tag: "Ops" }],
      inProgress: [],
      done: []
    };
    const next = moveTaskState(tasks, 999, "inProgress");
    expect(next.urgent).toHaveLength(1);
    expect(next.inProgress).toHaveLength(0);
  });

  it("should handle invalid task state", () => {
    expect(moveTaskState(null, 1, "done")).toEqual({});
  });
});
