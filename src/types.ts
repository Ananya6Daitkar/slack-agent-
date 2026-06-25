export type Severity = "SEV1" | "SEV2" | "SEV3" | "WATCH";
export type IncidentStatus = "watching" | "open" | "contained" | "resolved";
export type TaskStatus = "open" | "assigned" | "blocked" | "resolved";
export type ApprovalStatus = "draft" | "approved" | "rejected";

export interface SimulatedMessage {
  id: string;
  channel: string;
  user: string;
  text: string;
  ts: string;
  permalink: string;
  tags: string[];
}

export interface Incident {
  id: string;
  teamId: string;
  channelId: string;
  title: string;
  type: "outage" | "security" | "disaster" | "nonprofit" | "customer";
  severity: Severity;
  status: IncidentStatus;
  commanderUserId: string;
  createdAt: string;
  closedAt?: string;
}

export interface IncidentEvent {
  id: string;
  incidentId: string;
  messageId?: string;
  eventType: "signal" | "blocker" | "need" | "owner" | "update" | "decision";
  summary: string;
  sourceUrl?: string;
  confidence: number;
  createdAt: string;
}

export interface Task {
  id: string;
  incidentId: string;
  title: string;
  description: string;
  ownerUserId?: string;
  priority: "low" | "medium" | "high" | "critical";
  status: TaskStatus;
  dueAt?: string;
  sourceEventId?: string;
  externalTicketId?: string;
}

export interface Resource {
  id: string;
  teamId: string;
  type: "generator" | "vehicle" | "staff" | "medical" | "laptop" | "comms";
  name: string;
  quantity: number;
  location: string;
  status: "available" | "reserved" | "offline";
  externalRef: string;
  updatedAt: string;
}

export interface ResourceMatch {
  id: string;
  incidentId: string;
  taskId: string;
  resourceId: string;
  score: number;
  rationale: string;
  status: ApprovalStatus | "reserved";
}

export interface Decision {
  id: string;
  incidentId: string;
  text: string;
  owner: string;
  reason: string;
  evidenceUrls: string[];
  risk: string;
  reviewAt: string;
  approvalStatus: ApprovalStatus;
  createdAt: string;
}

export interface Briefing {
  id: string;
  incidentId: string;
  audience: "incident" | "executive" | "customer" | "donor";
  content: string;
  evidenceUrls: string[];
  approvedBy?: string;
  createdAt: string;
}

export interface AuditLog {
  id: string;
  teamId: string;
  actorUserId: string;
  action: string;
  targetType: string;
  targetId: string;
  metadata: Record<string, unknown>;
  createdAt: string;
}

export interface ExternalToolCall {
  id: string;
  incidentId?: string;
  toolName: string;
  input: Record<string, unknown>;
  output: Record<string, unknown>;
  createdAt: string;
}

export interface ChaosSignal {
  confidence: number;
  severity: Severity;
  title: string;
  summary: string;
  signals: string[];
  recommendedAction: "open_incident" | "watch" | "ignore";
  evidence: SimulatedMessage[];
}
