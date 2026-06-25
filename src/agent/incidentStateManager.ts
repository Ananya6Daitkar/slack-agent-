import { nanoid } from "nanoid";
import { MemoryStore } from "../store/memoryStore.js";
import { Incident } from "../types.js";

export class IncidentStateManager {
  constructor(private readonly store: MemoryStore) {}

  openDemoIncident(actorUserId: string, title = "Regional hospital network outage during storm response"): Incident {
    const incident = this.store.openIncident({
      title,
      commanderUserId: actorUserId,
      severity: "SEV2",
      type: "disaster"
    });

    this.store.addTask({
      incidentId: incident.id,
      title: "Confirm customer communications owner",
      description: "Executive and customer updates need a named approver before external posting.",
      priority: "high",
      status: "open"
    });
    this.store.addTask({
      incidentId: incident.id,
      title: "Dispatch backup generator to Clinic B",
      description: "Clinic B needs backup power to protect vaccine refrigeration.",
      priority: "critical",
      status: "open"
    });
    this.store.events.push({
      id: nanoid(),
      incidentId: incident.id,
      eventType: "signal",
      summary: "Incident opened from Chaos Radar detection.",
      confidence: 0.92,
      createdAt: new Date().toISOString()
    });
    return incident;
  }
}
