import { Briefing, ChaosSignal, Decision, Incident, ResourceMatch } from "../types.js";

/** Simulation context banner shown at the top of every demo card */
function simulationBanner() {
  return {
    type: "context",
    elements: [
      {
        type: "mrkdwn",
        text: "🎯 *Demo mode* — seeded scenario: hospital network outage + storm field ops. Run `/crisisops simulate` to reset."
      }
    ]
  };
}

/** "What's next" guide button appended to each step card */
function nextStepContext(nextLabel: string, nextCommand: string) {
  return {
    type: "context",
    elements: [
      {
        type: "mrkdwn",
        text: `➡️  *Next step:* ${nextLabel} — type \`${nextCommand}\``
      }
    ]
  };
}

export function chaosRadarBlocks(signal: ChaosSignal) {
  const bar = "█".repeat(Math.round(signal.confidence / 10)) + "░".repeat(10 - Math.round(signal.confidence / 10));
  return [
    simulationBanner(),
    { type: "header", text: { type: "plain_text", text: "📡  Chaos Radar — Emerging Incident Detected" } },
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text: `*${signal.title}*\n${signal.summary}`
      },
      accessory: {
        type: "button",
        text: { type: "plain_text", text: `${signal.severity}` },
        style: "danger",
        action_id: "noop_sev_badge",
        value: signal.severity
      }
    },
    {
      type: "section",
      fields: [
        { type: "mrkdwn", text: `*Confidence*\n\`${bar}\` ${signal.confidence}%` },
        { type: "mrkdwn", text: `*Recommended action*\n${signal.recommendedAction === "open_incident" ? "🔴 Open incident now" : "👁️ Watch"}` }
      ]
    },
    { type: "section", text: { type: "mrkdwn", text: signal.signals.map((s) => `• ${s}`).join("\n") } },
    { type: "divider" },
    {
      type: "actions",
      elements: [
        { type: "button", text: { type: "plain_text", text: "🔴  Open Incident" }, style: "primary", action_id: "open_incident_from_radar", value: signal.title },
        { type: "button", text: { type: "plain_text", text: "👁  Watch" }, action_id: "watch_signal", value: "watch" },
        { type: "button", text: { type: "plain_text", text: "Dismiss" }, action_id: "ignore_signal", value: "ignore" }
      ]
    },
    nextStepContext("Open Incident", "/crisisops open incident")
  ];
}

export function incidentOpenedBlocks(incident: Incident) {
  const elapsed = Math.round((Date.now() - Date.parse(incident.createdAt)) / 60000);
  return [
    simulationBanner(),
    { type: "header", text: { type: "plain_text", text: "🔴  CrisisOps Command Center — Incident Open" } },
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text: `*${incident.title}*`
      }
    },
    {
      type: "section",
      fields: [
        { type: "mrkdwn", text: `*Status*\n${incident.status.toUpperCase()}` },
        { type: "mrkdwn", text: `*Severity*\n${incident.severity}` },
        { type: "mrkdwn", text: `*Commander*\n<@${incident.commanderUserId}>` },
        { type: "mrkdwn", text: `*Elapsed*\n${elapsed < 1 ? "<1" : elapsed} min` }
      ]
    },
    { type: "divider" },
    {
      type: "actions",
      elements: [
        { type: "button", text: { type: "plain_text", text: "📋  Generate Brief" }, style: "primary", action_id: "generate_brief", value: incident.id },
        { type: "button", text: { type: "plain_text", text: "🔧  Match Resources" }, action_id: "match_resources", value: incident.id },
        { type: "button", text: { type: "plain_text", text: "📝  Record Decision" }, action_id: "record_decision", value: incident.id }
      ]
    },
    nextStepContext("Generate Brief", "/crisisops brief")
  ];
}

export function briefingBlocks(briefing: Briefing) {
  const lines = briefing.content.split("\n");
  const statusLine = lines[0] ?? "";
  const body = lines.slice(1).join("\n").slice(0, 2600);
  return [
    simulationBanner(),
    { type: "header", text: { type: "plain_text", text: "📋  Situation Brief" } },
    { type: "section", text: { type: "mrkdwn", text: `*${statusLine}*` } },
    { type: "section", text: { type: "mrkdwn", text: `\`\`\`${body}\`\`\`` } },
    {
      type: "context",
      elements: [
        {
          type: "mrkdwn",
          text: `📎  Evidence cited from ${briefing.evidenceUrls.length} messages. Audience: *${briefing.audience}*`
        }
      ]
    },
    { type: "divider" },
    {
      type: "actions",
      elements: [
        { type: "button", text: { type: "plain_text", text: "🔧  Match Resources" }, style: "primary", action_id: "match_resources", value: briefing.incidentId },
        { type: "button", text: { type: "plain_text", text: "📝  Record Decision" }, action_id: "record_decision", value: briefing.incidentId }
      ]
    },
    nextStepContext("Match Resources", "/crisisops match resources")
  ];
}

export function matchBlocks(matches: ResourceMatch[]) {
  const top = matches.slice(0, 3);
  const resourceLines = top.length
    ? top.map((m, i) => `${i === 0 ? "🥇" : i === 1 ? "🥈" : "🥉"}  *Score ${m.score}/100* — ${m.rationale}`).join("\n\n")
    : "No resource matches found in current inventory.";

  return [
    simulationBanner(),
    { type: "header", text: { type: "plain_text", text: "🔧  Resource Matches" } },
    {
      type: "section",
      text: { type: "mrkdwn", text: resourceLines }
    },
    {
      type: "context",
      elements: [
        {
          type: "mrkdwn",
          text: `🛠  Called MCP tools: \`search_inventory\` → \`get_location_eta\` → \`reserve_resource\`  |  ${top.length} match${top.length !== 1 ? "es" : ""} ranked`
        }
      ]
    },
    { type: "divider" },
    {
      type: "actions",
      elements: [
        {
          type: "button",
          text: { type: "plain_text", text: "✅  Approve & Reserve Best Match" },
          style: "primary",
          action_id: "approve_best_match",
          value: top[0]?.resourceId ?? ""
        },
        { type: "button", text: { type: "plain_text", text: "📝  Record Decision" }, action_id: "record_decision", value: top[0]?.incidentId ?? "" }
      ]
    },
    nextStepContext("Record Decision", "/crisisops record decision")
  ];
}

export function decisionBlocks(decision: Decision) {
  return [
    simulationBanner(),
    { type: "header", text: { type: "plain_text", text: "📝  Decision Ledger Entry" } },
    {
      type: "section",
      text: { type: "mrkdwn", text: `*${decision.text}*` }
    },
    {
      type: "section",
      fields: [
        { type: "mrkdwn", text: `*Owner*\n${decision.owner}` },
        { type: "mrkdwn", text: `*Status*\n${decision.approvalStatus}` },
        { type: "mrkdwn", text: `*Risk*\n${decision.risk}` },
        { type: "mrkdwn", text: `*Review at*\n${new Date(decision.reviewAt).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}` }
      ]
    },
    {
      type: "context",
      elements: [
        { type: "mrkdwn", text: `📎  Evidence: ${decision.evidenceUrls.join(", ")}` }
      ]
    },
    { type: "divider" },
    {
      type: "actions",
      elements: [
        { type: "button", text: { type: "plain_text", text: "✅  Approve Update" }, style: "primary", action_id: "approve_status_update", value: decision.incidentId },
        { type: "button", text: { type: "plain_text", text: "📊  Generate Postmortem" }, action_id: "generate_postmortem", value: decision.incidentId }
      ]
    },
    nextStepContext("Approve External Update", "/crisisops approve update")
  ];
}

export function resourceReservedBlocks(resourceName: string, incidentTitle: string, eta?: number) {
  return [
    { type: "header", text: { type: "plain_text", text: "✅  Resource Reserved" } },
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text: `*${resourceName}* has been reserved and dispatched for *${incidentTitle}*.${eta ? `\n\n⏱  Estimated arrival: *${eta} minutes*` : ""}`
      }
    },
    {
      type: "context",
      elements: [{ type: "mrkdwn", text: "🛠  MCP tool call logged: `reserve_resource` • Audit trail updated" }]
    },
    nextStepContext("Record Decision", "/crisisops record decision")
  ];
}
