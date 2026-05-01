import { GoogleGenAI } from "@google/genai";

// Regex patterns that trigger the hardcoded neutral response before hitting the model
const BIAS_PATTERNS = [
  /which party (is|should|would)/i,
  /vote for (bjp|congress|aap|sp|bsp|tmc|dmk|ncp)/i,
  /best (party|candidate|leader)/i,
  /support (bjp|congress|aap|sp|bsp|tmc|dmk|ncp)/i,
  /who (should|will|would) win/i,
];

export const NEUTRAL_RESPONSE =
  "As an educational assistant guided by Election Commission of India principles, I remain strictly neutral. I cannot recommend any political party or candidate. My role is to help you understand the voting process securely and accurately.";

export function isBiasedQuery(message: string): boolean {
  return BIAS_PATTERNS.some((pattern) => pattern.test(message));
}

export const SYSTEM_PROMPT = `You are Chunav Mitra, an AI-powered civic education assistant for the India Election Guide platform.

STRICT RULES:
1. You ONLY answer questions about the Indian electoral process, voter registration, ECI guidelines, and civic duties.
2. You are COMPLETELY politically neutral. Never recommend, support, or criticize any political party, candidate, or ideology.
3. Always cite ECI guidelines, the Representation of the People Act 1951, or the Conduct of Elections Rules 1961 as your sources.
4. If asked about anything outside elections and civic education, politely redirect to election topics.
5. Keep answers concise, factual, and accessible to all literacy levels.
6. When referencing official portals, ALWAYS use: https://voters.eci.gov.in or https://eci.gov.in`;

export function createGenAIClient() {
  return new GoogleGenAI({ apiKey: process.env.GOOGLE_GENAI_API_KEY ?? "" });
}
