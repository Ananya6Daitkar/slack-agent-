import { App } from "@slack/bolt";
import { CrisisOpsAgent } from "../agent/crisisOpsAgent.js";
import { routeIntent } from "../agent/intentRouter.js";
import { ApprovalManager } from "../agent/approvalManager.js";
import { store } from "../store/memoryStore.js";
import { briefingBlocks, chaosRadarBlocks, decisionBlocks, incidentOpenedBlocks, matchBlocks, resourceReservedBlocks } from "./blockKit.js";

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

  return app;
}
