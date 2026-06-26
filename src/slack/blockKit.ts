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
      text: { type: "mrkdwn", text: `*${signal.title}*\n${signal.summary}` },
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
        { type: "button", text: { type: "plain_text", text: "🛠  Open with Options" }, action_id: "open_incident_modal", value: signal.severity },
        { type: "button", text: { type: "plain_text", text: "👁  Watch" }, action_id: "watch_signal", value: "watch" },
        { type: "button", text: { type: "plain_text", text: "Dismiss" }, action_id: "ignore_signal", value: "ignore" }
      ]
    },
    nextStepContext("Open Incident", "/crisisops open incident")
  ];
}

export function incidentOpenedBlocks(incident: Incident) {
  const elapsed = Math.round((Date.now() - Date.parse(incident.createdAt)) / 60000);
  const sevColor = incident.severity === "SEV1" ? "🔴" : incident.severity === "SEV2" ? "🟠" : "🟡";
  return [
    simulationBanner(),
    { type: "header", text: { type: "plain_text", text: "🚨  CrisisOps Command Center — Incident Open" } },
    { type: "section", text: { type: "mrkdwn", text: `*${incident.title}*` } },
    {
      type: "section",
      fields: [
        { type: "mrkdwn", text: `*Status*\n🔴 ${incident.status.toUpperCase()}` },
        { type: "mrkdwn", text: `*Severity*\n${sevColor} ${incident.severity}` },
        { type: "mrkdwn", text: `*Commander*\n<@${incident.commanderUserId}>` },
        { type: "mrkdwn", text: `*Elapsed*\n⏱ ${elapsed < 1 ? "<1" : elapsed} min` }
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
      elements: [{ type: "mrkdwn", text: `📎  Evidence cited from ${briefing.evidenceUrls.length} messages. Audience: *${briefing.audience}*  ·  ⚡ Groq LLaMA-3.3-70b` }]
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
    { type: "section", text: { type: "mrkdwn", text: resourceLines } },
    {
      type: "context",
      elements: [{ type: "mrkdwn", text: `🛠  Called MCP tools: \`search_inventory\` → \`get_location_eta\` → \`reserve_resource\`  |  ${top.length} match${top.length !== 1 ? "es" : ""} ranked` }]
    },
    { type: "divider" },
    {
      type: "actions",
      elements: [
        { type: "button", text: { type: "plain_text", text: "✅  Approve & Reserve Best Match" }, style: "primary", action_id: "approve_best_match", value: top[0]?.resourceId ?? "" },
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
    { type: "section", text: { type: "mrkdwn", text: `*${decision.text}*` } },
    {
      type: "section",
      fields: [
        { type: "mrkdwn", text: `*Owner*\n${decision.owner}` },
        { type: "mrkdwn", text: `*Status*\n${decision.approvalStatus}` },
        { type: "mrkdwn", text: `*Risk*\n${decision.risk}` },
        { type: "mrkdwn", text: `*Review at*\n${new Date(decision.reviewAt).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}` }
      ]
    },
    { type: "context", elements: [{ type: "mrkdwn", text: `📎  Evidence: ${decision.evidenceUrls.join(", ")}` }] },
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
    { type: "header", text: { type: "plain_text", text: "✅  Resource Reserved & Dispatched" } },
    {
      type: "section",
      text: { type: "mrkdwn", text: `*${resourceName}* has been reserved and dispatched for *${incidentTitle}*.${eta ? `\n\n⏱  Estimated arrival: *${eta} minutes*` : ""}` }
    },
    { type: "context", elements: [{ type: "mrkdwn", text: "🛠  MCP tool call logged: `reserve_resource` · `get_location_eta` • Audit trail updated" }] },
    nextStepContext("Record Decision", "/crisisops record decision")
  ];
}

/** ── NEW: Rich Block Kit postmortem report ──────────────────────────────── */
export function postmortemBlocks(raw: string, incidentTitle: string) {
  // Parse sections from the markdown postmortem text
  const section = (heading: string): string => {
    const re = new RegExp(`##\\s+${heading}\\s*\\n([\\s\\S]*?)(?=\\n##|⚡|─|$)`, "i");
    return raw.match(re)?.[1]?.trim() ?? "";
  };

  const summary      = section("Summary");
  const impact       = section("Impact");
  const timeline     = section("Timeline");
  const rootCause    = section("Root Cause Hypothesis");
  const wentWell     = section("What Went Well");
  const wentWrong    = section("What Went Wrong");
  const followUp     = section("Follow-Up Actions");
  const decisions    = section("Decision Ledger");
  const isAI         = raw.includes("⚡ Generated by Groq");

  const blocks: any[] = [
    { type: "header", text: { type: "plain_text", text: "📊  Post-Incident Report" } },
    {
      type: "section",
      text: { type: "mrkdwn", text: `*${incidentTitle}*` },
      accessory: {
        type: "button",
        text: { type: "plain_text", text: isAI ? "⚡ AI-Generated" : "📋 Rule-Based" },
        action_id: "noop_pm_badge",
        value: "badge"
      }
    },
    { type: "divider" }
  ];

  if (summary) {
    blocks.push({ type: "section", text: { type: "mrkdwn", text: `*📌 Summary*\n${summary}` } });
    blocks.push({ type: "divider" });
  }

  if (impact) {
    blocks.push({ type: "section", text: { type: "mrkdwn", text: `*💥 Impact*\n${impact}` } });
  }

  if (rootCause) {
    blocks.push({ type: "section", text: { type: "mrkdwn", text: `*🔍 Root Cause Hypothesis*\n${rootCause}` } });
  }

  if (timeline) {
    blocks.push({ type: "section", text: { type: "mrkdwn", text: `*⏱ Timeline*\n${timeline}` } });
    blocks.push({ type: "divider" });
  }

  if (wentWell || wentWrong) {
    blocks.push({
      type: "section",
      fields: [
        { type: "mrkdwn", text: `*✅ What Went Well*\n${wentWell || "—"}` },
        { type: "mrkdwn", text: `*❌ What Went Wrong*\n${wentWrong || "—"}` }
      ]
    });
    blocks.push({ type: "divider" });
  }

  if (followUp) {
    blocks.push({ type: "section", text: { type: "mrkdwn", text: `*🔨 Follow-Up Actions*\n${followUp}` } });
  }

  if (decisions) {
    blocks.push({ type: "section", text: { type: "mrkdwn", text: `*📝 Decision Ledger*\n${decisions}` } });
  }

  blocks.push({
    type: "context",
    elements: [{ type: "mrkdwn", text: isAI ? "⚡ Generated by Groq LLaMA-3.3-70b · Evidence-grounded · No hallucinations" : "📋 Generated from Slack evidence" }]
  });

  return blocks;
}

/** ── NEW: Open Incident modal payload ──────────────────────────────────── */
export function openIncidentModalView(triggerId?: string) {
  return {
    type: "modal" as const,
    callback_id: "open_incident_modal_submit",
    title: { type: "plain_text" as const, text: "🚨  Open Incident" },
    submit: { type: "plain_text" as const, text: "Open Incident" },
    close: { type: "plain_text" as const, text: "Cancel" },
    blocks: [
      {
        type: "input",
        block_id: "incident_title",
        label: { type: "plain_text", text: "Incident Title" },
        element: {
          type: "plain_text_input",
          action_id: "title_input",
          placeholder: { type: "plain_text", text: "e.g. Regional hospital network outage during storm response" },
          initial_value: "Regional hospital network outage during storm response"
        }
      },
      {
        type: "input",
        block_id: "incident_severity",
        label: { type: "plain_text", text: "Severity" },
        element: {
          type: "static_select",
          action_id: "severity_select",
          placeholder: { type: "plain_text", text: "Select severity" },
          initial_option: { text: { type: "plain_text", text: "SEV2 — Major Impact" }, value: "SEV2" },
          options: [
            { text: { type: "plain_text", text: "SEV1 — Critical / All Hands" }, value: "SEV1" },
            { text: { type: "plain_text", text: "SEV2 — Major Impact" }, value: "SEV2" },
            { text: { type: "plain_text", text: "SEV3 — Degraded Service" }, value: "SEV3" },
            { text: { type: "plain_text", text: "WATCH — Monitoring" }, value: "WATCH" }
          ]
        }
      },
      {
        type: "input",
        block_id: "incident_type",
        label: { type: "plain_text", text: "Incident Type" },
        element: {
          type: "static_select",
          action_id: "type_select",
          placeholder: { type: "plain_text", text: "Select type" },
          initial_option: { text: { type: "plain_text", text: "🌪  Disaster Response" }, value: "disaster" },
          options: [
            { text: { type: "plain_text", text: "⚡  Outage" }, value: "outage" },
            { text: { type: "plain_text", text: "🔐  Security" }, value: "security" },
            { text: { type: "plain_text", text: "🌪  Disaster Response" }, value: "disaster" },
            { text: { type: "plain_text", text: "🤝  Nonprofit Operations" }, value: "nonprofit" },
            { text: { type: "plain_text", text: "👤  Customer Escalation" }, value: "customer" }
          ]
        }
      },
      {
        type: "input",
        block_id: "incident_notes",
        optional: true,
        label: { type: "plain_text", text: "Initial Notes" },
        element: {
          type: "plain_text_input",
          action_id: "notes_input",
          multiline: true,
          placeholder: { type: "plain_text", text: "Describe what you know so far..." }
        }
      },
      {
        type: "context",
        elements: [{ type: "mrkdwn", text: "CrisisOps will auto-generate response tasks and notify the channel." }]
      }
    ]
  };
}
