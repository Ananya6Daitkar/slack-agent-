import { Briefing, ChaosSignal, Decision, Incident, ResourceMatch } from "../types.js";

export function chaosRadarBlocks(signal: ChaosSignal) {
  return [
    { type: "header", text: { type: "plain_text", text: "Possible emerging incident detected" } },
    { type: "section", text: { type: "mrkdwn", text: `*${signal.title}*\n${signal.summary}\n*Confidence:* ${signal.confidence}% | *Suggested severity:* ${signal.severity}` } },
    { type: "section", text: { type: "mrkdwn", text: signal.signals.map((s) => `- ${s}`).join("\n") } },
    {
      type: "actions",
      elements: [
        { type: "button", text: { type: "plain_text", text: "Open Incident" }, style: "primary", action_id: "open_incident_from_radar", value: signal.title },
        { type: "button", text: { type: "plain_text", text: "Watch" }, action_id: "watch_signal", value: "watch" },
        { type: "button", text: { type: "plain_text", text: "Ignore" }, action_id: "ignore_signal", value: "ignore" }
      ]
    }
  ];
}

export function incidentOpenedBlocks(incident: Incident) {
  return [
    { type: "header", text: { type: "plain_text", text: "CrisisOps Command Center" } },
    { type: "section", text: { type: "mrkdwn", text: `*${incident.title}*\nStatus: *${incident.status}* | Severity: *${incident.severity}* | Commander: <@${incident.commanderUserId}>` } },
    {
      type: "actions",
      elements: [
        { type: "button", text: { type: "plain_text", text: "Generate Brief" }, action_id: "generate_brief", value: incident.id },
        { type: "button", text: { type: "plain_text", text: "Match Resources" }, action_id: "match_resources", value: incident.id },
        { type: "button", text: { type: "plain_text", text: "Record Decision" }, action_id: "record_decision", value: incident.id }
      ]
    }
  ];
}

export function briefingBlocks(briefing: Briefing) {
  return [
    { type: "header", text: { type: "plain_text", text: "Situation Brief" } },
    { type: "section", text: { type: "mrkdwn", text: `\`\`\`${briefing.content.slice(0, 2800)}\`\`\`` } }
  ];
}

export function matchBlocks(matches: ResourceMatch[]) {
  return [
    { type: "header", text: { type: "plain_text", text: "Resource Matches" } },
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text: matches.length
          ? matches.slice(0, 5).map((m) => `*${m.score}/100* resource ${m.resourceId}: ${m.rationale}`).join("\n")
          : "No resource matches found."
      }
    },
    {
      type: "actions",
      elements: [{ type: "button", text: { type: "plain_text", text: "Approve Best Match" }, style: "primary", action_id: "approve_best_match", value: matches[0]?.id ?? "" }]
    }
  ];
}

export function decisionBlocks(decision: Decision) {
  return [
    { type: "header", text: { type: "plain_text", text: "Decision Ledger Entry" } },
    { type: "section", text: { type: "mrkdwn", text: `*Decision:* ${decision.text}\n*Owner:* ${decision.owner}\n*Risk:* ${decision.risk}\n*Status:* ${decision.approvalStatus}` } }
  ];
}
