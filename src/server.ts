import express from "express";
import { CrisisOpsAgent } from "./agent/crisisOpsAgent.js";
import { ApprovalManager } from "./agent/approvalManager.js";
import { store } from "./store/memoryStore.js";
import { detectChaos } from "./agent/chaosRadar.js";
import { previewPage } from "./web/previewPage.js";

export function createDemoServer(agent: CrisisOpsAgent, approvalManager: ApprovalManager) {
  const server = express();
  server.use(express.json());
  server.use("/assets", express.static("assets"));

  server.get("/", (_req, res) => res.type("html").send(previewPage()));
  server.get("/health", (_req, res) => res.json({ ok: true, service: "crisisops-agent" }));

  server.post("/demo/reset", (_req, res) => {
    store.resetDemo();
    res.json({ ok: true, messages: store.messages.length, resources: store.resources.length });
  });

  server.get("/demo/messages", (_req, res) => res.json(store.messages));

  server.get("/demo/chaos-radar", async (_req, res) => res.json(await agent.runChaosRadar()));

  server.post("/demo/open-incident", (req, res) => {
    const incident = agent.openIncident(req.body.actorUserId ?? "demo-user");
    res.json({ incident, tasks: store.tasks.filter((task) => task.incidentId === incident.id) });
  });

  server.get("/demo/brief", async (_req, res) => res.json(await agent.generateBrief()));

  server.get("/demo/match-resources", async (_req, res) => res.json(await agent.matchResources()));

  server.post("/demo/decision", async (_req, res) => {
    const decision = await agent.recordSuggestedDecision();
    res.json({ decision: decision ?? null });
  });

  server.post("/demo/approve-update", async (req, res) => {
    const actorUserId = req.body.actorUserId ?? "demo-user";
    const draft = await agent.draftApprovedUpdate(actorUserId);
    const result = await approvalManager.approveStatusUpdate({
      incident: draft.incident,
      actorUserId,
      content: draft.content,
      audience: req.body.audience ?? "customer"
    });
    res.json({ draft, result });
  });

  server.get("/demo/postmortem", async (_req, res) => res.type("text/plain").send(await agent.postmortem()));

  server.get("/demo/state", (_req, res) => {
    res.json({
      incidents: store.incidents,
      tasks: store.tasks,
      decisions: store.decisions,
      matches: store.matches,
      briefings: store.briefings,
      toolCalls: store.toolCalls,
      auditLogs: store.auditLogs,
      currentChaosScore: detectChaos(store.messages)
    });
  });

  return server;
}
