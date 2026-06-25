import { Decision, Incident, SimulatedMessage, Task } from "../types.js";

export function generatePostmortem(input: { incident: Incident; messages: SimulatedMessage[]; tasks: Task[]; decisions: Decision[] }): string {
  const first = input.messages.slice().sort((a, b) => Date.parse(a.ts) - Date.parse(b.ts))[0];
  const resolvedTasks = input.tasks.filter((task) => task.status === "resolved").length;
  const openTasks = input.tasks.length - resolvedTasks;
  return [
    `# Postmortem Draft: ${input.incident.title}`,
    "",
    "## Summary",
    `A ${input.incident.severity} incident affected hospital clinic operations during storm response. First sourced signal: ${first?.text ?? "not available"}`,
    "",
    "## Impact",
    "- Patient portal confirmations and support operations were disrupted.",
    "- Clinic B field operations required backup power/resource dispatch.",
    "",
    "## Root Cause Hypothesis",
    "API gateway/DNS instability during failover is the current hypothesis. This remains unconfirmed until vendor and platform owners provide final evidence.",
    "",
    "## What Went Well",
    "- CrisisOps consolidated signals across channels.",
    "- Resource matching identified available field assets.",
    "- Decisions and approvals were captured for auditability.",
    "",
    "## What Went Wrong",
    "- Incident commander and customer comms owner were not clear in early messages.",
    "- External vendor confirmation was a blocker.",
    "",
    "## Follow-Up Actions",
    `- ${openTasks} open tasks remain; ${resolvedTasks} tasks resolved.`,
    "- Add explicit owner assignment to incident launch checklist.",
    "- Pre-approve field dispatch thresholds for clinic continuity incidents.",
    "",
    "## Decision Ledger",
    ...(input.decisions.length ? input.decisions.map((d) => `- ${d.text} | owner: ${d.owner} | status: ${d.approvalStatus}`) : ["- No decisions recorded."]),
    "",
    "## Evidence",
    ...input.messages.slice(0, 8).map((message) => `- ${message.permalink}: ${message.text}`)
  ].join("\n");
}
