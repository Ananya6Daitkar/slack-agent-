# CrisisOps MCP Server

CrisisOps includes an MCP-compatible stdio server to make the MCP integration explicit for judges.

Run it locally:

```bash
npm run mcp:server
```

The server supports:

- `initialize`
- `tools/list`
- `tools/call`

Exposed tools:

- `search_inventory`
- `get_location_eta`
- `create_status_update`

Example:

```bash
printf '%s\n' \
'{"jsonrpc":"2.0","id":1,"method":"initialize","params":{}}' \
'{"jsonrpc":"2.0","id":2,"method":"tools/list","params":{}}' \
'{"jsonrpc":"2.0","id":3,"method":"tools/call","params":{"name":"search_inventory","arguments":{"needText":"Clinic B needs a backup generator"}}}' \
| npm run mcp:server
```

In the Slack demo, `/crisisops match resources` uses the same MCP tool concept through `src/services/mcpGatewayClient.ts`: it searches inventory, ranks resources, and logs the tool call. This standalone server is the explicit MCP artifact for judging and future connector integration.
