import { App } from "@slack/bolt";
import { CrisisOpsAgent } from "../agent/crisisOpsAgent.js";
import { routeIntent } from "../agent/intentRouter.js";
import { ApprovalManager } from "../agent/approvalManager.js";
import { store } from "../store/memoryStore.js";
import { briefingBlocks, chaosRadarBlocks, decisionBlocks, incidentOpenedBlocks, matchBlocks, resourceReservedBlocks } from "./blockKit.js";

function appHomeBlocks() {
  const incident = store.latestIncident();
  const tasks = incident ? store.tasks.filter((t) => t.incidentId === incident.id) : [];
  const decisions = incident ? store.decisions.filter((d) => d.incidentId === incident.id) : [];
  const matches = incident ? store.matches.filter((m) => m.incidentId === incident.id) : [];
  const auditCount = store.auditLogs.length;
  const toolCallCount = store.toolCalls.length;

  const statusEmoji = !incident ? "🟢" : incident.status === "open" ? "🔴" : incident.status === "contained" ? "🟡" : "🟢";

  const blocks: any[] = [
    { type: "header", text: { type: "plain_text", text: "🚨  CrisisOps Command Center" } },
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text: incident
          ? `${statusEmoji}  *Active Incident:* ${incident.title}\n*Severity:* ${incident.severity}  |  *Status:* ${incident.status.toUpperCase()}  |  *Commander:* <@${incident.commanderUserId}>`
          : "🟢  *No active incident.* Run `/crisisops simulate` to start a demo."
      }
    },
    { type: "divider" },
    {
      type: "section",
      fields: [
        { type: "mrkdwn", text: `*📋 Tasks*\n${tasks.length} open` },
        { type: "mrkdwn", text: `*📝 Decisions*\n${decisions.length} recorded` },
        { type: "mrkdwn", text: `*🔧 Resources Matched*\n${matches.length} matches` },
        { type: "mrkdwn", text: `*🛠 MCP Tool Calls*\n${toolCallCount} logged` },
        { type: "mrkdwn", text: `*📜 Audit Events*\n${auditCount} entries` },
        { type: "mrkdwn", text: `*🤖 AI Engine*\nGroq LLaMA-3.3-70b` }
      ]
    },
    { type: "divider" }
  ];

  if (tasks.length) {
    blocks.push({
      type: "section",
      text: {
        type: "mrkdwn",
        text: `*Open Tasks*\n${tasks.map((t) => `• [${t.priority.toUpperCase()}] ${t.title} — \`${t.status}\``).join("\n")}`
      }
    });
    blocks.push({ type: "divider" });
  }

  if (decisions.length) {
    blocks.push({
      type: "section",
      text: {
        type: "mrkdwn",
        text: `*Decision Ledger*\n${decisions.map((d) => `• ${d.text} _(${d.approvalStatus}, owner: ${d.owner})_`).join("\n")}`
      }
    });
    blocks.push({ type: "divider" });
  }

  blocks.push({
    type: "actions",
    elements: [
      { type: "button", text: { type: "plain_text", text: "📡  Run Chaos Radar" }, style: "primary", action_id: "home_chaos_radar", value: "run" },
      { type: "button", text: { type: "plain_text", text: "🔴  Open Incident" }, action_id: "home_open_incident", value: "run" },
      { type: "button", text: { type: "plain_text", text: "↺  Reset Demo" }, action_id: "home_reset_demo", value: "run" }
    ]
  });

  blocks.push({
    type: "context",
    elements: [{
      type: "mrkdwn",
      text: `Last updated: ${new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}  ·  Use \`/crisisops\` commands or buttons in any channel`
    }]
  });

  return blocks;
}

export function createSlackApp(agent: CrisisOpsAgent, approvalManager: ApprovalManager) {
  const token = process.env.SLACK_BOT_TOKEN;
  const signingSecret = process.env.SLACK_SIGNING_SECRET;
  const appToken = process.env.SLACK_APP_TOKEN;
  const socketMode = process.env.SLACK_SOCKET_MODE === "true";

  if (!token || !signingSecret) return undefined;

  const app = new App({
    token,
    signingSecret,
    socketMode,
    appToken: socketMode ? appToken : undefined
  });

  app.command("/crisisops", async ({ command, ack, respond }) => {
    await ack();
    const intent = routeIntent(command.text);
    if (intent === "SIMULATION") {
      store.resetDemo();
      const signal = await agent.runChaosRadar();
      await respond({ text: "Simulation seeded.", blocks: chaosRadarBlocks(signal) });
      return;
    }
    if (intent === "OPEN_INCIDENT") {
      const incident = agent.openIncident(command.user_id);
      await respond({ text: "Incident opened.", blocks: incidentOpenedBlocks(incident) });
      return;
    }
    if (intent === "MATCH_RESOURCES") {
      const matches = await agent.matchResources();
      await respond({ text: "Resource matches ready.", blocks: matchBlocks(matches) });
      return;
    }
    if (intent === "POSTMORTEM") {
      await respond(`\`\`\`${(await agent.postmortem()).slice(0, 2800)}\`\`\``);
      return;
    }
    const briefing = await agent.generateBrief();
    await respond({ text: "Situation brief ready.", blocks: briefingBlocks(briefing) });
  });

  app.event("app_mention", async ({ event, client }) => {
    const text = "text" in event ? event.text : "";
    const channel = "channel" in event && event.channel ? event.channel : "";
    const user = "user" in event && event.user ? event.user : "unknown";
    const intent = routeIntent(text);

    if (intent === "SIMULATION") {
      store.resetDemo();
      const signal = await agent.runChaosRadar();
      await client.chat.postMessage({ channel, text: "Simulation seeded.", blocks: chaosRadarBlocks(signal) });
    } else if (intent === "OPEN_INCIDENT") {
      const incident = agent.openIncident(user);
      await client.chat.postMessage({ channel, text: "Incident opened.", blocks: incidentOpenedBlocks(incident) });
    } else if (intent === "MATCH_RESOURCES") {
      const matches = await agent.matchResources();
      await client.chat.postMessage({ channel, text: "Resource matches ready.", blocks: matchBlocks(matches) });
    } else if (intent === "DECISION") {
      const decision = await agent.recordSuggestedDecision();
      await client.chat.postMessage({
        channel,
        text: decision ? "Decision recorded." : "No decision proposal found in current evidence.",
        blocks: decision ? decisionBlocks(decision) : undefined
      });
    } else if (intent === "POSTMORTEM") {
      await client.chat.postMessage({ channel, text: `\`\`\`${(await agent.postmortem()).slice(0, 2800)}\`\`\`` });
    } else {
      const briefing = await agent.generateBrief();
      await client.chat.postMessage({ channel, text: "Situation brief ready.", blocks: briefingBlocks(briefing) });
    }
  });

  app.action("open_incident_from_radar", async ({ ack, body, client }) => {
    await ack();
    const userId = "user" in body ? body.user.id : "demo-user";
    const channelId = "channel" in body && body.channel ? body.channel.id : undefined;
    const incident = agent.openIncident(userId);
    if (channelId) await client.chat.postMessage({ channel: channelId, text: "Incident opened.", blocks: incidentOpenedBlocks(incident) });
  });

  app.action("generate_brief", async ({ ack, body, client }) => {
    await ack();
    const channelId = "channel" in body && body.channel ? body.channel.id : undefined;
    const briefing = await agent.generateBrief();
    if (channelId) await client.chat.postMessage({ channel: channelId, text: "Situation brief ready.", blocks: briefingBlocks(briefing) });
  });

  app.action("match_resources", async ({ ack, body, client }) => {
    await ack();
    const channelId = "channel" in body && body.channel ? body.channel.id : undefined;
    const matches = await agent.matchResources();
    if (channelId) await client.chat.postMessage({ channel: channelId, text: "Resource matches ready.", blocks: matchBlocks(matches) });
  });

  app.action("record_decision", async ({ ack, body, client }) => {
    await ack();
    const channelId = "channel" in body && body.channel ? body.channel.id : undefined;
    const decision = await agent.recordSuggestedDecision();
    if (channelId && decision) await client.chat.postMessage({ channel: channelId, text: "Decision recorded.", blocks: decisionBlocks(decision) });
  });

  app.action("approve_best_match", async ({ ack, body, client }) => {
    await ack();
    const action = "actions" in body ? (body.actions?.[0] as { value?: string } | undefined) : undefined;
    const resourceId = action?.value;
    const channelId = "channel" in body && body.channel ? body.channel.id : undefined;
    const actorUserId = "user" in body ? body.user.id : "demo-user";
    const latest = store.latestIncident();
    if (!latest || !resourceId || !channelId) return;
    const reservation = await agent["mcp"].reserveResource({ resourceId, incidentId: latest.id, actorUserId });
    // find ETA for the reserved resource
    const eta = await agent["mcp"].getLocationEta({ from: "Warehouse A", to: "Clinic B" });
    const resource = store.resources.find((r) => r.id === resourceId);
    await client.chat.postMessage({
      channel: channelId,
      text: `✅ Resource reserved: ${resource?.name ?? resourceId}`,
      blocks: resourceReservedBlocks(resource?.name ?? resourceId, latest.title, eta.etaMinutes)
    });
    void reservation;
  });

  app.action("generate_postmortem", async ({ ack, body, client }) => {
    await ack();
    const channelId = "channel" in body && body.channel ? body.channel.id : undefined;
    if (!channelId) return;
    const postmortem = await agent.postmortem();
    await client.chat.postMessage({ channel: channelId, text: `\`\`\`${postmortem.slice(0, 2800)}\`\`\`` });
  });

  app.action("approve_status_update", async ({ ack, body }) => {
    await ack();
    const actorUserId = "user" in body ? body.user.id : "demo-user";
    const latest = store.latestIncident();
    if (!latest) return;
    const draft = await agent.draftApprovedUpdate(actorUserId);
    await approvalManager.approveStatusUpdate({ incident: latest, actorUserId, content: draft.content, audience: "customer" });
  });

  // ── App Home ────────────────────────────────────────────────────────────────
  app.event("app_home_opened", async ({ event, client }) => {
    await client.views.publish({
      user_id: event.user,
      view: {
        type: "home",
        blocks: appHomeBlocks()
      }
    });
  });

  app.action("home_chaos_radar", async ({ ack, body, client }) => {
    await ack();
    const signal = await agent.runChaosRadar();
    await client.views.publish({
      user_id: body.user.id,
      view: { type: "home", blocks: [...chaosRadarBlocks(signal), { type: "divider" }, ...appHomeBlocks().slice(-2)] }
    });
  });

  app.action("home_open_incident", async ({ ack, body, client }) => {
    await ack();
    agent.openIncident(body.user.id);
    await client.views.publish({
      user_id: body.user.id,
      view: { type: "home", blocks: appHomeBlocks() }
    });
  });

  app.action("home_reset_demo", async ({ ack, body, client }) => {
    await ack();
    store.resetDemo();
    await client.views.publish({
      user_id: body.user.id,
      view: { type: "home", blocks: appHomeBlocks() }
    });
  });

  return app;
}
