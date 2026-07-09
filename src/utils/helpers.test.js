import { describe, it, expect } from "vitest";
import { sanitizeInput, validateLogin, matchReply } from "./helpers";

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
});

describe("validateLogin credentials scheme", () => {
  it("should return valid status for correct inputs", () => {
    const result = validateLogin("fan@fifa2026.com", "secure123");
    expect(result.isValid).toBe(true);
    expect(result.errors).toEqual({});
  });

  it("should flag empty email/username errors", () => {
    const result = validateLogin("", "secure123");
    expect(result.isValid).toBe(false);
    expect(result.errors.email).toBeDefined();
  });

  it("should flag invalid email formats", () => {
    const result = validateLogin("invalid@email", "secure123");
    expect(result.isValid).toBe(false);
    expect(result.errors.email).toBeDefined();
  });

  it("should flag empty password check errors", () => {
    const result = validateLogin("fan@fifa2026.com", "");
    expect(result.isValid).toBe(false);
    expect(result.errors.password).toBeDefined();
  });

  it("should flag short password checks (under 6 chars)", () => {
    const result = validateLogin("fan@fifa2026.com", "12345");
    expect(result.isValid).toBe(false);
    expect(result.errors.password).toBe("Password must be at least 6 characters.");
  });
});

describe("matchReply multilingual chatbot routing", () => {
  it("should resolve restroom keywords in English", () => {
    const reply = matchReply("Where is the restroom?", "en");
    expect(reply).toContain("occupancy sensors");
    expect(reply).toContain("Section 112");
  });

  it("should resolve gate wait times in English", () => {
    const reply = matchReply("How long is the gate wait time?", "en");
    expect(reply).toContain("Gate C");
    expect(reply).toContain("Gate D");
  });

  it("should resolve Spanish queries correctly", () => {
    const reply = matchReply("¿Dónde está el baño más cercano?", "es");
    expect(reply).toContain("Recomendación de baño");
    expect(reply).toContain("Sección 112");
  });

  it("should resolve French queries correctly", () => {
    const reply = matchReply("Où sont les toilettes?", "fr");
    expect(reply).toContain("Recommandation toilettes");
  });

  it("should resolve Hindi queries correctly", () => {
    const reply = matchReply("शौचालय कहाँ है?", "hi");
    expect(reply).toContain("शौचालय मार्ग");
  });

  it("should fallback to a default prompt response", () => {
    const reply = matchReply("unknown query details", "en");
    expect(reply).toContain("StadiumAI Concierge");
  });
});
