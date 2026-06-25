import { detectChaos } from "./chaosRadar.js";
import { ContextRetriever } from "./contextRetriever.js";
import { suggestDecision } from "./decisionLedger.js";
import { generateBriefing } from "./briefingGenerator.js";
import { IncidentStateManager } from "./incidentStateManager.js";
import { generatePostmortem } from "./postmortemGenerator.js";
import { extractNeedsFromText, rankResourceMatches } from "./resourceMatcher.js";
import { McpGatewayClient } from "../services/mcpGatewayClient.js";
import { MemoryStore } from "../store/memoryStore.js";

export class CrisisOpsAgent {
  constructor(
    private readonly store: MemoryStore,
    private readonly context: ContextRetriever,
    private readonly incidents: IncidentStateManager,
    private readonly mcp: McpGatewayClient
  ) {}

  async runChaosRadar() {
    const messages = await this.context.incidentSignals();
    return detectChaos(messages);
  }

  openIncident(actorUserId: string) {
    return this.incidents.openDemoIncident(actorUserId);
  }

  async generateBrief() {
    const incident = this.store.latestIncident() ?? this.openIncident("demo-user");
    const messages = await this.context.incidentSignals();
    const briefing = generateBriefing({
      incident,
      messages,
      tasks: this.store.tasks.filter((task) => task.incidentId === incident.id),
      matches: this.store.matches.filter((match) => match.incidentId === incident.id),
      decisions: this.store.decisions.filter((decision) => decision.incidentId === incident.id)
    });
    return this.store.addBriefing(briefing);
  }

  async matchResources() {
    const incident = this.store.latestIncident() ?? this.openIncident("demo-user");
    const messages = await this.context.resourceNeeds();
    const needText = messages.map((message) => message.text).join(" ");
    const needs = extractNeedsFromText(needText);
    const task =
      this.store.tasks.find((candidate) => candidate.incidentId === incident.id && /generator|resource|dispatch/i.test(candidate.title + candidate.description)) ??
      this.store.addTask({
        incidentId: incident.id,
        title: needs[0] ?? "Match resource to urgent operational need",
        description: needText,
        priority: "critical",
        status: "open"
      });
    const resources = await this.mcp.searchInventory({ needText, incidentId: incident.id });
    const ranked = rankResourceMatches({ incidentId: incident.id, task, resources });
    ranked.slice(0, 3).forEach((match) => {
      const { id: _id, ...unsaved } = match;
      this.store.addMatch(unsaved);
    });
    return ranked;
  }

  async recordSuggestedDecision() {
    const incident = this.store.latestIncident() ?? this.openIncident("demo-user");
    const messages = await this.context.decisionSignals();
    const decision = suggestDecision(incident.id, messages);
    return decision ? this.store.addDecision(decision) : undefined;
  }

  async draftApprovedUpdate(actorUserId: string) {
    const incident = this.store.latestIncident() ?? this.openIncident(actorUserId);
    return {
      incident,
      content:
        "We are responding to a service disruption affecting patient portal confirmations and some clinic operations. Mitigation is underway, field resources are being dispatched to Clinic B, and the next update will follow in 30 minutes."
    };
  }

  async postmortem() {
    const incident = this.store.latestIncident() ?? this.openIncident("demo-user");
    const messages = await this.context.incidentSignals();
    return generatePostmortem({
      incident,
      messages,
      tasks: this.store.tasks.filter((task) => task.incidentId === incident.id),
      decisions: this.store.decisions.filter((decision) => decision.incidentId === incident.id)
    });
  }
}
