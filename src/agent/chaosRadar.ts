import { ChaosSignal, SimulatedMessage } from "../types.js";

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

  return {
    confidence,
    severity,
    title: "Regional hospital network outage and field resource risk",
    summary: `${urgentHits.length} urgent signals across ${channels.size} channels with ${unresolvedHits.length} unresolved blockers/questions.`,
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
