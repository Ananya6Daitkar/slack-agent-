import { Resource, SimulatedMessage } from "../types.js";

const now = new Date("2026-06-25T09:30:00.000Z");
const minutesAgo = (minutes: number) => new Date(now.getTime() - minutes * 60_000).toISOString();

export const demoTeamId = "T_DEMO";
export const demoIncidentChannel = "C_CRISIS_DEMO";

export const simulatedMessages: SimulatedMessage[] = [
  {
    id: "m1",
    channel: "#support-escalations",
    user: "Maya",
    text: "Urgent: three hospital clinics report patient portal checkout and appointment confirmation failing after the storm failover.",
    ts: minutesAgo(22),
    permalink: "slack://demo/support-escalations/m1",
    tags: ["urgent", "customer-impact", "portal"]
  },
  {
    id: "m2",
    channel: "#field-ops",
    user: "Arun",
    text: "Clinic B needs a backup generator by 11am. Current unit is offline and vaccine refrigeration is at risk.",
    ts: minutesAgo(18),
    permalink: "slack://demo/field-ops/m2",
    tags: ["need", "generator", "risk", "clinic-b"]
  },
  {
    id: "m3",
    channel: "#it-incident",
    user: "Priya",
    text: "API gateway error rate is 42 percent in EU and US-East. I can own mitigation if someone confirms customer comms owner.",
    ts: minutesAgo(16),
    permalink: "slack://demo/it-incident/m3",
    tags: ["owner", "api", "blocked"]
  },
  {
    id: "m4",
    channel: "#exec-questions",
    user: "Nora",
    text: "Do we have a single incident commander and an ETA? Board update needed in 20 minutes.",
    ts: minutesAgo(14),
    permalink: "slack://demo/exec-questions/m4",
    tags: ["unresolved-question", "exec"]
  },
  {
    id: "m5",
    channel: "#support-escalations",
    user: "Diego",
    text: "Zendesk queue jumped by 180 tickets. Customers are asking whether appointments are still valid.",
    ts: minutesAgo(12),
    permalink: "slack://demo/support-escalations/m5",
    tags: ["customer-impact", "support"]
  },
  {
    id: "m6",
    channel: "#field-ops",
    user: "Leah",
    text: "Warehouse A has one mobile generator and two satcom kits. Driver Sam is available but needs approval to dispatch.",
    ts: minutesAgo(10),
    permalink: "slack://demo/field-ops/m6",
    tags: ["available-resource", "generator", "approval"]
  },
  {
    id: "m7",
    channel: "#it-incident",
    user: "Jun",
    text: "Blocked on vendor DNS confirmation. No owner named from NetEdge yet.",
    ts: minutesAgo(8),
    permalink: "slack://demo/it-incident/m7",
    tags: ["blocked", "vendor", "unowned"]
  },
  {
    id: "m8",
    channel: "#comms",
    user: "Fatima",
    text: "I can draft external status copy, but need confirmed impact and mitigation decision before posting.",
    ts: minutesAgo(6),
    permalink: "slack://demo/comms/m8",
    tags: ["owner", "comms", "approval"]
  },
  {
    id: "m9",
    channel: "#nonprofit-relief",
    user: "Ravi",
    text: "Relief desk says Clinic B also needs 20 blankets for families waiting outside due to lobby power issue.",
    ts: minutesAgo(5),
    permalink: "slack://demo/nonprofit-relief/m9",
    tags: ["need", "social-impact", "clinic-b"]
  },
  {
    id: "m10",
    channel: "#it-incident",
    user: "Priya",
    text: "Decision proposal: disable appointment confirmation retries for 30 minutes to protect core scheduling.",
    ts: minutesAgo(3),
    permalink: "slack://demo/it-incident/m10",
    tags: ["decision", "mitigation"]
  }
];

export const resources: Resource[] = [
  {
    id: "r1",
    teamId: demoTeamId,
    type: "generator",
    name: "Mobile generator G-14",
    quantity: 1,
    location: "Warehouse A",
    status: "available",
    externalRef: "sheet:inventory!A2",
    updatedAt: minutesAgo(10)
  },
  {
    id: "r2",
    teamId: demoTeamId,
    type: "comms",
    name: "Satellite comms kit",
    quantity: 2,
    location: "Warehouse A",
    status: "available",
    externalRef: "sheet:inventory!A3",
    updatedAt: minutesAgo(10)
  },
  {
    id: "r3",
    teamId: demoTeamId,
    type: "staff",
    name: "Driver Sam",
    quantity: 1,
    location: "North depot",
    status: "available",
    externalRef: "airtable:volunteers/sam",
    updatedAt: minutesAgo(9)
  },
  {
    id: "r4",
    teamId: demoTeamId,
    type: "medical",
    name: "Vaccine cold-chain kit",
    quantity: 3,
    location: "Clinic A",
    status: "available",
    externalRef: "sheet:inventory!A9",
    updatedAt: minutesAgo(20)
  }
];
