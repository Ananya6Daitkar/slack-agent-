import { Resource } from "../types.js";
import { MemoryStore } from "../store/memoryStore.js";

export class McpGatewayClient {
  constructor(private readonly store: MemoryStore) {}

  async searchInventory(input: { type?: string; location?: string; needText?: string; incidentId?: string }) {
    const text = `${input.type ?? ""} ${input.location ?? ""} ${input.needText ?? ""}`.toLowerCase();
    const resources = this.store.resources.filter((resource) => {
      if (resource.status !== "available") return false;
      return (
        !text ||
        text.includes(resource.type) ||
        text.includes(resource.location.toLowerCase()) ||
        text.includes(resource.name.toLowerCase().split(" ")[0])
      );
    });
    this.log("search_inventory", input, { count: resources.length, resources });
    return resources;
  }

  async reserveResource(input: { resourceId: string; incidentId: string; actorUserId: string }) {
    const resource = this.store.resources.find((item) => item.id === input.resourceId);
    if (!resource) throw new Error(`Resource not found: ${input.resourceId}`);
    resource.status = "reserved";
    resource.updatedAt = new Date().toISOString();
    const output = { resourceId: resource.id, status: resource.status, reservedBy: input.actorUserId };
    this.log("reserve_resource", input, output);
    return output;
  }

  async createTicket(input: { incidentId: string; title: string; description: string }) {
    const output = { ticketId: `JIRA-${Math.floor(Math.random() * 9000) + 1000}`, url: "https://jira.example/demo" };
    this.log("create_ticket", input, output);
    return output;
  }

  async createStatusUpdate(input: { incidentId: string; audience: string; content: string; approvedBy: string }) {
    const output = { statusId: `STATUS-${Date.now()}`, posted: true, audience: input.audience };
    this.log("create_status_update", input, output);
    return output;
  }

  async getOnCallOwner(input: { service: string; incidentId?: string }) {
    const output = { service: input.service, owner: "Priya", escalation: "API Platform Primary" };
    this.log("get_on_call_owner", input, output);
    return output;
  }

  async getCustomerImpact(input: { incidentId: string }) {
    const output = { affectedCustomers: 3, ticketSpike: 180, segments: ["hospital clinics", "patient portal users"] };
    this.log("get_customer_impact", input, output);
    return output;
  }

  async getLocationEta(input: { from: string; to: string }) {
    const output = { etaMinutes: input.to.toLowerCase().includes("clinic b") ? 42 : 60, routeRisk: "storm traffic" };
    this.log("get_location_eta", input, output);
    return output;
  }

  private log(toolName: string, input: Record<string, unknown>, output: Record<string, unknown>) {
    this.store.addToolCall({ toolName, incidentId: String(input.incidentId ?? ""), input, output });
  }
}
