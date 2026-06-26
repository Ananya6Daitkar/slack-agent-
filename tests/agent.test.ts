import { describe, expect, it } from "vitest";
import { detectChaos } from "../src/agent/chaosRadar.js";
import { generateBriefing } from "../src/agent/briefingGenerator.js";
import { formatDecision, suggestDecision } from "../src/agent/decisionLedger.js";
import { extractNeedsFromText, rankResourceMatches } from "../src/agent/resourceMatcher.js";
import { resources, simulatedMessages } from "../src/data/seed.js";
import { Incident, Task } from "../src/types.js";

const incident: Incident = {
  id: "inc-1",
  teamId: "T1",
  channelId: "C1",
  title: "Demo incident",
  type: "disaster",
  severity: "SEV2",
  status: "open",
  commanderUserId: "U1",
  createdAt: new Date().toISOString()
};

const task: Task = {
  id: "task-1",
  incidentId: incident.id,
  title: "Dispatch backup generator to Clinic B",
  description: "Clinic B needs backup power for vaccine refrigeration.",
  priority: "critical",
  status: "open"
};

describe("CrisisOps agent logic", () => {
  it("scores chaotic cross-channel incidents above open threshold", () => {
    const signal = detectChaos(simulatedMessages);
    expect(signal.confidence).toBeGreaterThanOrEqual(70);
    expect(signal.recommendedAction).toBe("open_incident");
    expect(signal.signals.length).toBeGreaterThan(3);
  });

  it("extracts needs from operational text", () => {
    const needs = extractNeedsFromText("Clinic B needs a backup generator. This is informational.");
    expect(needs).toEqual(["Clinic B needs a backup generator."]);
  });

  it("ranks available generator as a strong match", () => {
    const matches = rankResourceMatches({ incidentId: incident.id, task, resources });
    expect(matches[0].resourceId).toBe("r1");
    expect(matches[0].score).toBeGreaterThanOrEqual(90);
  });

  it("suggests and formats a decision ledger entry from evidence", () => {
    const decision = suggestDecision(incident.id, simulatedMessages);
    expect(decision).toBeDefined();
    const formatted = formatDecision({ ...decision!, id: "d1", createdAt: new Date().toISOString() });
    expect(formatted).toContain("Decision:");
    expect(formatted).toContain("Evidence:");
  });

  it("generates briefings with evidence links and next action", async () => {
    const briefing = await generateBriefing({
      incident,
      messages: simulatedMessages,
      tasks: [task],
      matches: [],
      decisions: []
    });
    expect(briefing.content.length).toBeGreaterThan(0);
    expect(briefing.evidenceUrls.length).toBeGreaterThan(0);
  });
});
