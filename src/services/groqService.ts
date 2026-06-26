import Groq from "groq-sdk";

let _client: Groq | null = null;

function getClient(): Groq | null {
  if (!process.env.GROQ_API_KEY) return null;
  if (!_client) _client = new Groq({ apiKey: process.env.GROQ_API_KEY });
  return _client;
}

export const MODEL = "llama-3.3-70b-versatile";

/**
 * Send a single prompt to Groq. Returns null if no API key is configured,
 * so callers can fall back to rule-based output gracefully.
 */
export async function groqComplete(
  systemPrompt: string,
  userPrompt: string,
  maxTokens = 800
): Promise<string | null> {
  const client = getClient();
  if (!client) return null;

  try {
    const completion = await client.chat.completions.create({
      model: MODEL,
      max_tokens: maxTokens,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user",   content: userPrompt }
      ]
    });
    return completion.choices[0]?.message?.content ?? null;
  } catch (err) {
    console.error("[groq] API error:", err);
    return null;
  }
}
