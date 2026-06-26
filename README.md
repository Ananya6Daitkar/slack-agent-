# CrisisOps Agent

A Slack-native AI command center for high-stakes incidents. When something goes wrong — a system outage, a natural disaster, a clinic losing power — CrisisOps detects it from Slack messages, opens a structured response, matches resources, records decisions, and generates a postmortem. All without leaving Slack.

Built for the **Slack Agent Builder Challenge** using the Slack Assistant thread API, MCP server integration, and Real-Time Search API.

---

## What It Does

| Step | Feature | Technology |
|------|---------|-----------|
| 1 | **Chaos Radar** — detects emerging incidents from cross-channel Slack signals | Groq LLaMA-3.3-70b + RTS |
| 2 | **Open Incident** — structured command center with severity, commander, task list | Slack Block Kit + Modal |
| 3 | **Situation Brief** — AI-generated briefing citing real Slack evidence | Groq LLaMA-3.3-70b |
| 4 | **Resource Matching** — searches inventory and ranks matches | MCP tool calls |
| 5 | **Decision Ledger** — records decisions with owner, risk, and evidence | Slack Block Kit |
| 6 | **Approval Gate** — drafts external updates requiring human approval | Audit logger |
| 7 | **Postmortem** — structured Block Kit report from the incident trail | Groq LLaMA-3.3-70b |

---

## Technologies Used

- **Slack Assistant thread API** — natural DM conversations with suggested prompts, thread titles, and typing status
- **MCP stdio server** — 7 tool calls: `search_inventory`, `reserve_resource`, `create_ticket`, `create_status_update`, `get_on_call_owner`, `get_customer_impact`, `get_location_eta`
- **Slack Real-Time Search API** — live `search.messages` with `xoxp` user token (falls back to demo data if not configured)
- **Groq LLaMA-3.3-70b** — AI-generated briefings, postmortems, and Chaos Radar summaries, all evidence-grounded
- **Slack Block Kit** — rich cards, modals, App Home dashboard, interactive buttons
- **Slack Socket Mode** — real-time event handling without a public server

---

## Quick Start

```bash
npm install
cp .env.example .env
# Fill in your tokens (see .env.example)
npm run demo
```

Open: **http://localhost:3000**

The demo runs fully offline with seeded data — no Slack credentials needed for the web preview.

---

## Slack Commands

```
/crisisops simulate        — seed the demo scenario
/crisisops open incident   — open an incident command center
/crisisops brief           — generate an AI situation briefing
/crisisops match resources — find and rank available resources
/crisisops record decision — log a key decision with evidence
/crisisops postmortem      — generate a postmortem report
```

Or mention the bot in any channel:
```
@CrisisOps what changed in the last 15 minutes?
@CrisisOps match resources to open needs
@CrisisOps generate postmortem
```

Or DM the bot directly — the Slack Assistant thread interface opens with suggested prompts.

---

## Environment Variables

```env
# Slack
SLACK_BOT_TOKEN=xoxb-...
SLACK_SIGNING_SECRET=...
SLACK_APP_TOKEN=xapp-...
SLACK_SOCKET_MODE=true

# Slack Real-Time Search (xoxp user token with search:read scope)
SLACK_USER_TOKEN=xoxp-...

# Groq LLM
GROQ_API_KEY=...
```

---

## MCP Server

Run the standalone MCP-compatible stdio server:

```bash
npm run mcp:server
```

Test it:

```bash
printf '%s\n' \
'{"jsonrpc":"2.0","id":1,"method":"initialize","params":{}}' \
'{"jsonrpc":"2.0","id":2,"method":"tools/list","params":{}}' \
'{"jsonrpc":"2.0","id":3,"method":"tools/call","params":{"name":"search_inventory","arguments":{"needText":"Clinic B needs a backup generator"}}}' \
| npm run mcp:server
```

See `MCP.md` for full examples.

---

## Architecture

```
Slack (slash commands, mentions, DMs, App Home)
  └── Slack Bolt App (Socket Mode)
        ├── Assistant thread API  ← Slack AI capability
        ├── Intent Router
        └── CrisisOps Agent
              ├── Chaos Radar          (Groq AI + RTS)
              ├── Context Retriever    (Slack RTS API)
              ├── Briefing Generator   (Groq AI)
              ├── Resource Matcher     (MCP tools)
              ├── Decision Ledger
              ├── Approval Manager     (human-gated)
              ├── Postmortem Generator (Groq AI)
              └── Audit Logger
                    └── Memory Store (swap → Postgres via docs/schema.sql)
```

---

## Run Tests

```bash
npm test
npm run build
```

---

## Built With

TypeScript · Node.js · Express · Slack Bolt v4 · Slack Assistant API · Slack Block Kit · Slack App Home · Groq LLaMA-3.3-70b · MCP stdio server · Zod · Vitest
