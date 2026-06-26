import { ChaosSignal, SimulatedMessage } from "../types.js";
import { groqComplete } from "../services/groqService.js";

const urgentTerms = ["urgent", "failing", "blocked", "down", "risk", "needed", "needs", "offline", "eta"];
const ownerTerms = ["own", "owner", "assigned", "commander"];
const customerTerms = ["customer", "clinic", "hospital", "patient", "tickets", "board"];

export function detectChaos(messages: SimulatedMessage[]): ChaosSignal {
  const channels = new Set(messages.map((message) => message.channel));
  const urgentHits = messages.filter((message) => urgentTerms.some((term) => message.text.toLowerCase().includes(term)));
  const ownerHits = messages.filter((message) => ownerTerms.some((term) => message.text.toLowerCase().includes(term)));
  const customerHits = messages.filter((message) => customerTerms.some((term) => message.text.toLowerCase().includes(term)));
  const unresolvedHits = messages.filter((message) => message.text.includes("?") || message.tags.includes("blocked") || message.tags.includes("unowned"));

  let score = 15;
  score += Math.min(25, channels.size * 6);
  score += Math.min(25, urgentHits.length * 5);
  score += Math.min(15, customerHits.length * 4);
  score += Math.min(15, unresolvedHits.length * 5);
  if (ownerHits.length === 0 || messages.some((message) => message.text.toLowerCase().includes("no owner"))) score += 10;

  const confidence = Math.min(98, score);
  const severity = confidence >= 82 ? "SEV2" : confidence >= 65 ? "SEV3" : "WATCH";

  const fallbackSummary = `${urgentHits.length} urgent signals across ${channels.size} channels with ${unresolvedHits.length} unresolved blockers/questions.`;

  return {
    confidence,
    severity,
    title: "Regional hospital network outage and field resource risk",
    summary: fallbackSummary,
    signals: [
      `${channels.size} channels mention related operational impact`,
      `${urgentHits.length} messages contain urgent/failure language`,
      `${customerHits.length} messages reference patients, clinics, customers, or executives`,
      `${unresolvedHits.length} blockers or unresolved questions found`,
      "No confirmed single incident commander found in the evidence"
    ],
    recommendedAction: confidence >= 70 ? "open_incident" : "watch",
    evidence: messages.slice(0, 6)
  };
}

/** Async version — enriches the summary with a Groq-generated one-liner if key is present */
export async function detectChaosWithAI(messages: SimulatedMessage[]): Promise<ChaosSignal> {
  const base = detectChaos(messages);

  const evidenceBlock = messages
    .slice(0, 8)
    .map((m) => `[${m.channel}] ${m.user}: ${m.text}`)
    .join("\n");

  const aiSummary = await groqComplete(
    `You are a crisis detection AI. Given a set of Slack messages, write ONE concise sentence (max 30 words) 
describing the emerging incident. Be specific — name affected systems, locations, and impact. No filler words.`,
    `Slack messages:\n${evidenceBlock}\n\nConfidence: ${base.confidence}% | Severity: ${base.severity}\n\nWrite the one-sentence incident summary now.`,
    80
  );

  return {
    ...base,
    summary: aiSummary?.trim() ?? base.summary
  };
}
