import { MemoryStore } from "../store/memoryStore.js";

export class AuditLogger {
  constructor(private readonly store: MemoryStore) {}

  record(input: {
    teamId: string;
    actorUserId: string;
    action: string;
    targetType: string;
    targetId: string;
    metadata?: Record<string, unknown>;
  }) {
    return this.store.addAudit({
      teamId: input.teamId,
      actorUserId: input.actorUserId,
      action: input.action,
      targetType: input.targetType,
      targetId: input.targetId,
      metadata: input.metadata ?? {}
    });
  }
}
