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
  server.get("/health", (_req, res) => res.json({ ok: true, service: "crisisops-agent", version: "0.1.0" }));

  server.post("/demo/reset", (_req, res) => {
    store.resetDemo();
    res.json({ ok: true, messages: store.messages.length, resources: store.resources.length });
  });

  server.get("/demo/messages", (_req, res) => res.json(store.messages));

  server.get("/demo/chaos-radar", async (_req, res) => {
    try { res.json(await agent.runChaosRadar()); }
    catch (err) { res.status(500).json({ error: String(err) }); }
  });

  server.post("/demo/open-incident", (req, res) => {
    try {
      const incident = agent.openIncident(req.body.actorUserId ?? "demo-user");
      res.json({ incident, tasks: store.tasks.filter((task) => task.incidentId === incident.id) });
    } catch (err) { res.status(500).json({ error: String(err) }); }
  });

  server.get("/demo/brief", async (_req, res) => {
    try { res.json(await agent.generateBrief()); }
    catch (err) { res.status(500).json({ error: String(err) }); }
  });

  server.get("/demo/match-resources", async (_req, res) => {
    try { res.json(await agent.matchResources()); }
    catch (err) { res.status(500).json({ error: String(err) }); }
  });

  server.post("/demo/decision", async (_req, res) => {
    try {
      const decision = await agent.recordSuggestedDecision();
      res.json({ decision: decision ?? null });
    } catch (err) { res.status(500).json({ error: String(err) }); }
  });

  server.post("/demo/approve-update", async (req, res) => {
    try {
      const actorUserId = req.body.actorUserId ?? "demo-user";
      const draft = await agent.draftApprovedUpdate(actorUserId);
      const result = await approvalManager.approveStatusUpdate({
        incident: draft.incident,
        actorUserId,
        content: draft.content,
        audience: req.body.audience ?? "customer"
      });
      res.json({ draft, result });
    } catch (err) { res.status(500).json({ error: String(err) }); }
  });

  server.get("/demo/postmortem", async (_req, res) => {
    try { res.type("text/plain").send(await agent.postmortem()); }
    catch (err) { res.status(500).json({ error: String(err) }); }
  });

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
