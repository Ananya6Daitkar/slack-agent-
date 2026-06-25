# CrisisOps Tool Server (MCP)

CrisisOps includes a tool server that external systems can connect to. This shows judges that the integration layer is real and not just simulated inside the app.

## Start the Tool Server

```bash
npm run mcp:server
```

## What It Supports

- `initialize` — starts the server
- `tools/list` — returns a list of available tools
- `tools/call` — calls a specific tool with arguments

## Available Tools

- `search_inventory` — finds available resources matching a need
- `get_location_eta` — estimates arrival time for a field resource
- `create_status_update` — drafts an external status update

## Try It Out

Run all three steps in sequence:

```bash
printf '%s\n' \
'{"jsonrpc":"2.0","id":1,"method":"initialize","params":{}}' \
'{"jsonrpc":"2.0","id":2,"method":"tools/list","params":{}}' \
'{"jsonrpc":"2.0","id":3,"method":"tools/call","params":{"name":"search_inventory","arguments":{"needText":"Clinic B needs a backup generator"}}}' \
| npm run mcp:server
```

This will:
1. Start the server
2. List all available tools
3. Search inventory for a generator to match the need at Clinic B

## How It Connects to the Demo

When you run `/crisisops match resources` in Slack, the app uses the same tool concept through `src/services/mcpGatewayClient.ts`. It searches inventory, ranks the best matches, and logs the tool call to the audit trail.

The standalone server here is the explicit, inspectable version of that integration — useful for judges and for connecting real external systems later.
