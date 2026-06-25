import { Briefing, Decision, Incident, ResourceMatch, SimulatedMessage, Task } from "../types.js";

export function generateBriefing(input: {
  incident: Incident;
  messages: SimulatedMessage[];
  tasks: Task[];
  matches: ResourceMatch[];
  decisions: Decision[];
}): Omit<Briefing, "id" | "createdAt"> {
  const blockers = input.messages.filter((message) => message.tags.includes("blocked") || /blocked|no owner|need/i.test(message.text));
  const timeline = input.messages
    .slice()
    .sort((a, b) => Date.parse(a.ts) - Date.parse(b.ts))
    .slice(-5)
    .map((message) => `- ${new Date(message.ts).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })} ${message.channel}: ${message.text}`);

  const content = [
    `Status: ${input.incident.status.toUpperCase()} ${input.incident.severity}`,
    `Incident: ${input.incident.title}`,
    `Impact: hospital clinic operations, patient portal confirmations, and field resource dispatch are affected based on sourced Slack evidence.`,
    "",
    "Recent timeline:",
    ...timeline,
    "",
    "Open blockers:",
    ...(blockers.length ? blockers.slice(0, 4).map((m) => `- ${m.text} (${m.permalink})`) : ["- No blockers found in current evidence."]),
    "",
    "Owners and actions:",
    ...(input.tasks.length ? input.tasks.map((task) => `- ${task.priority.toUpperCase()}: ${task.title} [${task.status}]`) : ["- Assign incident commander and customer comms owner."]),
    "",
    "Resource matches:",
    ...(input.matches.length ? input.matches.slice(0, 3).map((match) => `- Match ${match.resourceId}: ${match.score}/100, ${match.rationale}`) : ["- No approved resource match yet."]),
    "",
    "Decision ledger:",
    ...(input.decisions.length ? input.decisions.map((decision) => `- ${decision.text} (${decision.approvalStatus})`) : ["- No decisions recorded yet."]),
    "",
    "Recommended next action: approve customer/status update after commander confirms mitigation and dispatch approval."
  ].join("\n");

  return {
    incidentId: input.incident.id,
    audience: "incident",
    content,
    evidenceUrls: input.messages.slice(0, 8).map((message) => message.permalink)
  };
}
