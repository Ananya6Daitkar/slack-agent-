import { createInterface } from "node:readline";
import { resources } from "../data/seed.js";

type JsonRpcRequest = {
  jsonrpc?: "2.0";
  id?: string | number | null;
  method?: string;
  params?: Record<string, unknown>;
};

type JsonRpcResponse = {
  jsonrpc: "2.0";
  id: string | number | null;
  result?: unknown;
  error?: { code: number; message: string };
};

const tools = [
  {
    name: "search_inventory",
    description: "Search available emergency resources such as generators, communications kits, staff, and medical supplies.",
    inputSchema: {
      type: "object",
      properties: {
        needText: { type: "string", description: "Incident need text from Slack context." },
        type: { type: "string", description: "Optional resource type filter." }
      }
    }
  },
  {
    name: "get_location_eta",
    description: "Estimate travel time between a resource location and an affected site.",
    inputSchema: {
      type: "object",
      properties: {
        from: { type: "string" },
        to: { type: "string" }
      },
      required: ["from", "to"]
    }
  },
  {
    name: "create_status_update",
    description: "Create an approved external status update record.",
    inputSchema: {
      type: "object",
      properties: {
        incidentId: { type: "string" },
        audience: { type: "string" },
        content: { type: "string" },
        approvedBy: { type: "string" }
      },
      required: ["incidentId", "audience", "content", "approvedBy"]
    }
  }
];

function callTool(name: string, args: Record<string, unknown>) {
  if (name === "search_inventory") {
    const needText = String(args.needText ?? args.type ?? "").toLowerCase();
    const matches = resources.filter((resource) => {
      if (resource.status !== "available") return false;
      return !needText || needText.includes(resource.type) || needText.includes(resource.location.toLowerCase());
    });
    return {
      content: [{ type: "text", text: JSON.stringify({ count: matches.length, resources: matches }, null, 2) }]
    };
  }

  if (name === "get_location_eta") {
    const to = String(args.to ?? "");
    return {
      content: [{ type: "text", text: JSON.stringify({ etaMinutes: to.toLowerCase().includes("clinic b") ? 42 : 60, routeRisk: "storm traffic" }, null, 2) }]
    };
  }

  if (name === "create_status_update") {
    return {
      content: [{ type: "text", text: JSON.stringify({ statusId: `STATUS-${Date.now()}`, posted: true, audience: args.audience }, null, 2) }]
    };
  }

  throw new Error(`Unknown MCP tool: ${name}`);
}

function respond(response: JsonRpcResponse) {
  process.stdout.write(`${JSON.stringify(response)}\n`);
}

function handle(request: JsonRpcRequest) {
  const id = request.id ?? null;
  try {
    if (request.method === "initialize") {
      respond({
        jsonrpc: "2.0",
        id,
        result: {
          protocolVersion: "2024-11-05",
          capabilities: { tools: {} },
          serverInfo: { name: "crisisops-mcp", version: "0.1.0" }
        }
      });
      return;
    }

    if (request.method === "tools/list") {
      respond({ jsonrpc: "2.0", id, result: { tools } });
      return;
    }

    if (request.method === "tools/call") {
      const name = String(request.params?.name ?? "");
      const args = (request.params?.arguments ?? {}) as Record<string, unknown>;
      respond({ jsonrpc: "2.0", id, result: callTool(name, args) });
      return;
    }

    if (request.method === "notifications/initialized") return;

    respond({ jsonrpc: "2.0", id, error: { code: -32601, message: `Method not found: ${request.method ?? "undefined"}` } });
  } catch (error) {
    respond({ jsonrpc: "2.0", id, error: { code: -32000, message: error instanceof Error ? error.message : "Unknown error" } });
  }
}

const rl = createInterface({ input: process.stdin, crlfDelay: Number.POSITIVE_INFINITY });
rl.on("line", (line) => {
  if (!line.trim()) return;
  handle(JSON.parse(line) as JsonRpcRequest);
});
