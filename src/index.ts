import "dotenv/config";
import { ContextRetriever } from "./agent/contextRetriever.js";
import { CrisisOpsAgent } from "./agent/crisisOpsAgent.js";
import { IncidentStateManager } from "./agent/incidentStateManager.js";
import { ApprovalManager } from "./agent/approvalManager.js";
import { AuditLogger } from "./services/auditLogger.js";
import { McpGatewayClient } from "./services/mcpGatewayClient.js";
import { DemoRealTimeSearchService } from "./services/realTimeSearchService.js";
import { store } from "./store/memoryStore.js";
import { createDemoServer } from "./server.js";
import { createSlackApp } from "./slack/slackApp.js";

const rts = new DemoRealTimeSearchService(store);
const context = new ContextRetriever(rts);
const mcp = new McpGatewayClient(store);
const audit = new AuditLogger(store);
const incidents = new IncidentStateManager(store);
const agent = new CrisisOpsAgent(store, context, incidents, mcp);
const approvalManager = new ApprovalManager(mcp, audit);

const port = Number(process.env.PORT ?? 3000);
const demoServer = createDemoServer(agent, approvalManager);
demoServer.listen(port, () => {
  console.log(`CrisisOps demo server listening on http://localhost:${port}`);
});

const slackApp = createSlackApp(agent, approvalManager);
if (slackApp) {
  await slackApp.start();
  console.log("CrisisOps Slack app started.");
} else {
  console.log("Slack credentials not configured; running in local demo mode.");
}
