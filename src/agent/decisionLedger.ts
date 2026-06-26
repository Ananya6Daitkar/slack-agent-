import { Decision, SimulatedMessage } from "../types.js";

export function suggestDecision(incidentId: string, messages: SimulatedMessage[]): Omit<Decision, "id" | "createdAt"> | undefined {
  const proposal = messages.find((message) => /decision proposal|disable|pause|route/i.test(message.text));
  if (!proposal) return undefined;
  return {
    incidentId,
    text: proposal.text.replace(/^Decision proposal:\s*/i, ""),
    owner: proposal.user,
    reason: "Mitigate immediate operational risk while the incident team confirms the durable fix.",
    evidenceUrls: [`${proposal.id} in ${proposal.channel}`],
    risk: "Temporary mitigation may reduce functionality or create follow-up reconciliation work.",
    reviewAt: new Date(Date.now() + 30 * 60_000).toISOString(),
    approvalStatus: "draft"
  };
}

export function formatDecision(decision: Decision): string {
  return [
    `Decision: ${decision.text}`,
    `Owner: ${decision.owner}`,
    `Reason: ${decision.reason}`,
    `Risk: ${decision.risk}`,
    `Review: ${decision.reviewAt}`,
    `Status: ${decision.approvalStatus}`,
    `Evidence: ${decision.evidenceUrls.join(", ")}`
  ].join("\n");
}
