import { detectChaos, detectChaosWithAI } from "./chaosRadar.js";
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
    readonly incidents: IncidentStateManager,
    readonly mcp: McpGatewayClient
  ) {}

  async runChaosRadar() {
    const messages = await this.context.incidentSignals();
    return detectChaosWithAI(messages);
  }

  openIncident(actorUserId: string) {
    return this.incidents.openDemoIncident(actorUserId);
  }

  async generateBrief() {
    const incident = this.store.latestIncident() ?? this.openIncident("demo-user");
    const messages = await this.context.incidentSignals();
    const briefing = await generateBriefing({
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
    const matches = this.store.matches.filter((m) => m.incidentId === incident.id);
    const decisions = this.store.decisions.filter((d) => d.incidentId === incident.id);
    const resourceAction = matches.length > 0
      ? `Field resources have been dispatched (${matches.length} match${matches.length > 1 ? "es" : ""} approved).`
      : "Resource dispatch is being coordinated.";
    const decisionNote = decisions.length > 0
      ? `Key mitigation decision recorded: ${decisions[0].text}`
      : "Mitigation is underway.";
    const content = [
      `We are responding to a service disruption affecting ${incident.title.toLowerCase()}.`,
      decisionNote,
      resourceAction,
      "The next update will follow in 30 minutes. We apologize for the impact on your operations."
    ].join(" ");
    return { incident, content };
  }

  async postmortem() {
    const incident = this.store.latestIncident() ?? this.openIncident("demo-user");
    const messages = await this.context.incidentSignals();
    return await generatePostmortem({
      incident,
      messages,
      tasks: this.store.tasks.filter((task) => task.incidentId === incident.id),
      decisions: this.store.decisions.filter((decision) => decision.incidentId === incident.id)
    });
  }
}
