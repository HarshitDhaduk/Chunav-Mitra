import { describe, it, expect } from "vitest";
import { isBiasedQuery, NEUTRAL_RESPONSE } from "./chatbot-config";

describe("isBiasedQuery", () => {
  describe("should flag party support requests", () => {
    it("flags BJP/Congress comparison", () => {
      expect(isBiasedQuery("Who should I vote for? BJP or Congress?")).toBe(true);
    });
    it("flags AAP support", () => {
      expect(isBiasedQuery("I support AAP, what do you think?")).toBe(true);
    });
    it("flags TMC best party", () => {
      expect(isBiasedQuery("Is TMC the best party?")).toBe(true);
    });
    it("flags NDA best party", () => {
      expect(isBiasedQuery("Is NDA the best party?")).toBe(true);
    });
    it("flags which party should I vote", () => {
      expect(isBiasedQuery("Which party should I vote for?")).toBe(true);
    });
  });

  describe("should flag winning predictions", () => {
    it("flags who will win", () => {
      expect(isBiasedQuery("Who will win the next election?")).toBe(true);
    });
    it("flags who would win in Delhi", () => {
      expect(isBiasedQuery("Who would win in Delhi?")).toBe(true);
    });
    it("flags who should win", () => {
      expect(isBiasedQuery("Who should win the election?")).toBe(true);
    });
  });

  describe("should allow neutral educational queries", () => {
    it("allows voter registration query", () => {
      expect(isBiasedQuery("How do I register to vote?")).toBe(false);
    });
    it("allows EVM question", () => {
      expect(isBiasedQuery("What is the EVM machine?")).toBe(false);
    });
    it("allows ECI question", () => {
      expect(isBiasedQuery("Tell me about the Election Commission of India")).toBe(false);
    });
    it("allows polling booth query", () => {
      expect(isBiasedQuery("Where is my polling booth?")).toBe(false);
    });
    it("allows NOTA question", () => {
      expect(isBiasedQuery("What is NOTA?")).toBe(false);
    });
    it("allows EPIC verification question", () => {
      expect(isBiasedQuery("How do I verify my EPIC number?")).toBe(false);
    });
    it("allows Model Code of Conduct question", () => {
      expect(isBiasedQuery("What is the Model Code of Conduct?")).toBe(false);
    });
  });
});

describe("NEUTRAL_RESPONSE", () => {
  it("should be a non-empty string", () => {
    expect(typeof NEUTRAL_RESPONSE).toBe("string");
    expect(NEUTRAL_RESPONSE.length).toBeGreaterThan(0);
  });

  it("should mention Election Commission of India", () => {
    expect(NEUTRAL_RESPONSE).toContain("Election Commission of India");
  });

  it("should mention neutrality", () => {
    expect(NEUTRAL_RESPONSE.toLowerCase()).toContain("neutral");
  });
});
