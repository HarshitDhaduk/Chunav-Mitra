import { createGenAIClient, isBiasedQuery, NEUTRAL_RESPONSE, SYSTEM_PROMPT } from "@/lib/chatbot-config";

export const runtime = "edge";

export async function POST(req: Request) {
  try {
    const { message } = await req.json();

    if (!message || typeof message !== "string") {
      return new Response("Invalid message", { status: 400 });
    }

    // Layer 1: bias pre-filter — never hits the model
    if (isBiasedQuery(message)) {
      return new Response(NEUTRAL_RESPONSE, {
        headers: { "Content-Type": "text/plain" },
      });
    }

    const apiKey = process.env.GOOGLE_GENAI_API_KEY;
    if (!apiKey || apiKey === "your_google_genai_api_key_here") {
      return new Response(
        "Chunav Mitra is not configured yet. Please add a valid GOOGLE_GENAI_API_KEY to .env.local to enable the chatbot.",
        { headers: { "Content-Type": "text/plain" } }
      );
    }

    const ai = createGenAIClient();

    const stream = await ai.models.generateContentStream({
      model: "gemini-1.5-flash",
      contents: [{ role: "user", parts: [{ text: message }] }],
      config: { systemInstruction: SYSTEM_PROMPT },
    });

    const encoder = new TextEncoder();
    const readable = new ReadableStream({
      async start(controller) {
        for await (const chunk of stream) {
          const text = chunk.candidates?.[0]?.content?.parts?.[0]?.text ?? "";
          if (text) controller.enqueue(encoder.encode(text));
        }
        controller.close();
      },
    });

    return new Response(readable, {
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  } catch (err) {
    // Parse the error to give a human-readable message
    let userMessage = "Sorry, I'm unable to respond right now. Please try again later.";
    if (err instanceof Error) {
      if (err.message.includes("429") || err.message.includes("RESOURCE_EXHAUSTED")) {
        userMessage = "I'm receiving too many requests right now. Please wait a moment and try again.";
      } else if (err.message.includes("API_KEY_INVALID") || err.message.includes("400")) {
        userMessage = "The chatbot is not configured correctly. Please check the API key in .env.local.";
      }
    }
    return new Response(userMessage, {
      status: 200,
      headers: { "Content-Type": "text/plain" },
    });
  }
}
