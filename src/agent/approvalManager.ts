import { McpGatewayClient } from "../services/mcpGatewayClient.js";
import { AuditLogger } from "../services/auditLogger.js";
import { Incident } from "../types.js";

export class ApprovalManager {
  constructor(
    private readonly mcp: McpGatewayClient,
    private readonly audit: AuditLogger
  ) {}

  async approveStatusUpdate(input: { incident: Incident; actorUserId: string; content: string; audience: string }) {
    const result = await this.mcp.createStatusUpdate({
      incidentId: input.incident.id,
      audience: input.audience,
      content: input.content,
      approvedBy: input.actorUserId
    });
    this.audit.record({
      teamId: input.incident.teamId,
      actorUserId: input.actorUserId,
      action: "approve_status_update",
      targetType: "incident",
      targetId: input.incident.id,
      metadata: { audience: input.audience, statusId: result.statusId }
    });
    return result;
  }
}
