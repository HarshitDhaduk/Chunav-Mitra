import { describe, it, expect } from "vitest";
import { isBiasedQuery } from "./chatbot-config";

describe("chatbot-config: isBiasedQuery", () => {
  it("should flag direct party support requests", () => {
    expect(isBiasedQuery("Who should I vote for? BJP or Congress?")).toBe(true);
    expect(isBiasedQuery("I support AAP, what do you think?")).toBe(true);
    expect(isBiasedQuery("Is TMC the best party?")).toBe(true);
  });

  it("should flag winning predictions", () => {
    expect(isBiasedQuery("Who will win the next election?")).toBe(true);
    expect(isBiasedQuery("Who would win in Delhi?")).toBe(true);
  });

  it("should allow neutral, educational queries", () => {
    expect(isBiasedQuery("How do I register to vote?")).toBe(false);
    expect(isBiasedQuery("What is the EVM machine?")).toBe(false);
    expect(isBiasedQuery("Tell me about the Election Commission of India")).toBe(false);
    expect(isBiasedQuery("Where is my polling booth?")).toBe(false);
  });
});
