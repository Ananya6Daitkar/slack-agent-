# CrisisOps Agent

CrisisOps Agent is a Slack-native command center for urgent work: outages, cyber incidents, disaster response, school safety, public health coordination, nonprofit logistics, and enterprise escalations.

It uses Slack as the operating surface. The agent detects weak signals, opens incidents, generates sourced briefings, matches needs to resources through MCP-compatible tools, records decisions, drafts approved updates, and creates postmortems.

## Hackathon Differentiators

- **Chaos Radar:** proactively detects emerging incidents before someone writes a perfect command.
- **Decision Ledger:** records key decisions with owner, evidence, risk, and review time.
- **Simulation Twin:** creates a repeatable crisis scenario for a polished 3-minute demo.
- **RTS abstraction:** demo provider searches seeded Slack-like messages; production can swap in Slack Real-Time Search.
- **MCP integration:** MCP-compatible stdio server plus local MCP gateway tools simulate inventory, ticketing, on-call, customer impact, location ETA, and status updates.
- **Human approval:** external updates and resource reservations are approval-gated and audited.

## Quick Start

```bash
npm install
cp .env.example .env
npm run demo
```

Open:

```text
http://localhost:3000/health
```

Web preview:

```text
http://localhost:3000
```

Submission assets:

- `assets/architecture-diagram.png`
- `assets/architecture-diagram.svg`
- `assets/crisisops-thumbnail.png`
- `SUBMISSION.md`
- `STUDY_GUIDE.md`
- `MCP.md`
- `VIDEO_SUBMISSION_CHECKLIST.md`

Demo endpoints:

```bash
curl -X POST http://localhost:3000/demo/reset
curl http://localhost:3000/demo/chaos-radar
curl -X POST http://localhost:3000/demo/open-incident
curl http://localhost:3000/demo/brief
curl http://localhost:3000/demo/match-resources
curl -X POST http://localhost:3000/demo/decision
curl -X POST http://localhost:3000/demo/approve-update
curl http://localhost:3000/demo/postmortem
curl http://localhost:3000/demo/state
```

## Slack Setup

Create a Slack app with bot token scopes appropriate for your workspace:

- `app_mentions:read`
- `commands`
- `chat:write`
- `channels:history`
- `channels:read`
- `groups:history` if private incident channels are used
- `im:history` if DM interaction is used

Add slash command:

```text
/crisisops
```

Configure interactivity and events, then set:

```env
SLACK_BOT_TOKEN=
SLACK_SIGNING_SECRET=
SLACK_APP_TOKEN=
SLACK_SOCKET_MODE=true
```

Commands to demo in Slack:

```text
/crisisops simulate
/crisisops open incident
/crisisops brief
/crisisops match resources
/crisisops postmortem
```

App mentions also work:

```text
@CrisisOps run simulation
@CrisisOps what changed in the last 15 minutes?
@CrisisOps match resources to open needs
@CrisisOps record decision
@CrisisOps generate postmortem
```

## Tests

```bash
npm test
npm run build
```

## MCP Server

Run the MCP-compatible stdio server:

```bash
npm run mcp:server
```

See `MCP.md` for tool-call examples.

## Production Replacements

The demo is intentionally reliable without external credentials. For production:

- Replace `DemoRealTimeSearchService` with Slack Real-Time Search API calls.
- Replace or extend the included MCP-compatible server with production MCP servers for Jira, PagerDuty, Salesforce, Zendesk, Sheets/Airtable, Maps, and Statuspage.
- Replace `MemoryStore` with Postgres using `docs/schema.sql`.
