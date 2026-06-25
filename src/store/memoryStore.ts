import { nanoid } from "nanoid";
import {
  AuditLog,
  Briefing,
  Decision,
  ExternalToolCall,
  Incident,
  IncidentEvent,
  Resource,
  ResourceMatch,
  SimulatedMessage,
  Task
} from "../types.js";
import { demoIncidentChannel, demoTeamId, resources, simulatedMessages } from "../data/seed.js";

export class MemoryStore {
  messages: SimulatedMessage[] = [...simulatedMessages];
  resources: Resource[] = [...resources];
  incidents: Incident[] = [];
  events: IncidentEvent[] = [];
  tasks: Task[] = [];
  matches: ResourceMatch[] = [];
  decisions: Decision[] = [];
  briefings: Briefing[] = [];
  auditLogs: AuditLog[] = [];
  toolCalls: ExternalToolCall[] = [];

  resetDemo(): void {
    this.messages = [...simulatedMessages];
    this.resources = [...resources];
    this.incidents = [];
    this.events = [];
    this.tasks = [];
    this.matches = [];
    this.decisions = [];
    this.briefings = [];
    this.auditLogs = [];
    this.toolCalls = [];
  }

  openIncident(input: Partial<Incident> & { title: string; commanderUserId: string }): Incident {
    const incident: Incident = {
      id: nanoid(),
      teamId: input.teamId ?? demoTeamId,
      channelId: input.channelId ?? demoIncidentChannel,
      title: input.title,
      type: input.type ?? "disaster",
      severity: input.severity ?? "SEV2",
      status: "open",
      commanderUserId: input.commanderUserId,
      createdAt: new Date().toISOString()
    };
    this.incidents.push(incident);
    return incident;
  }

  latestIncident(): Incident | undefined {
    return this.incidents.at(-1);
  }

  addTask(task: Omit<Task, "id">): Task {
    const saved = { ...task, id: nanoid() };
    this.tasks.push(saved);
    return saved;
  }

  addDecision(decision: Omit<Decision, "id" | "createdAt">): Decision {
    const saved = { ...decision, id: nanoid(), createdAt: new Date().toISOString() };
    this.decisions.push(saved);
    return saved;
  }

  addBriefing(briefing: Omit<Briefing, "id" | "createdAt">): Briefing {
    const saved = { ...briefing, id: nanoid(), createdAt: new Date().toISOString() };
    this.briefings.push(saved);
    return saved;
  }

  addAudit(log: Omit<AuditLog, "id" | "createdAt">): AuditLog {
    const saved = { ...log, id: nanoid(), createdAt: new Date().toISOString() };
    this.auditLogs.push(saved);
    return saved;
  }

  addToolCall(call: Omit<ExternalToolCall, "id" | "createdAt">): ExternalToolCall {
    const saved = { ...call, id: nanoid(), createdAt: new Date().toISOString() };
    this.toolCalls.push(saved);
    return saved;
  }

  addMatch(match: Omit<ResourceMatch, "id">): ResourceMatch {
    const saved = { ...match, id: nanoid() };
    this.matches.push(saved);
    return saved;
  }
}

export const store = new MemoryStore();
