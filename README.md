# CrisisOps Agent

CrisisOps is a Slack bot that helps teams handle emergencies. When things go wrong — a system outage, a natural disaster, a clinic losing power — people start posting urgent messages across many Slack channels. CrisisOps watches those messages, spots the problem early, and gives your team a clear command center to respond from, all without leaving Slack.

It works for companies, nonprofits, schools, clinics, and any team that manages urgent situations in Slack.

## What It Does

- **Detects problems early** — scans Slack messages to catch an emerging incident before it becomes obvious
- **Opens an incident** — creates a structured response in Slack with a severity level, a commander, and a to-do list
- **Generates a briefing** — summarizes what happened, who is affected, what is blocked, and what to do next
- **Finds resources** — searches your inventory (generators, volunteers, staff) and matches them to open needs
- **Records decisions** — logs who decided what, why, and what the risk was, so nothing gets lost
- **Drafts updates** — prepares external status updates that a human must approve before they are sent
- **Writes a postmortem** — turns the incident log into a structured report when it is all over

## Quick Start

```bash
npm install
cp .env.example .env
npm run demo
```

Then open your browser to:

```
http://localhost:3000
```

Check the health endpoint:

```
http://localhost:3000/health
```

## Try the Demo Endpoints

These commands let you walk through a full crisis scenario:

```bash
# Reset the demo to a clean state
curl -X POST http://localhost:3000/demo/reset

# Check for emerging incidents
curl http://localhost:3000/demo/chaos-radar

# Open an incident
curl -X POST http://localhost:3000/demo/open-incident

# Generate a situation briefing
curl http://localhost:3000/demo/brief

# Find and match available resources
curl http://localhost:3000/demo/match-resources

# Record a decision
curl -X POST http://localhost:3000/demo/decision

# Approve and send an external update
curl -X POST http://localhost:3000/demo/approve-update

# Generate the postmortem
curl http://localhost:3000/demo/postmortem

# See the full incident state
curl http://localhost:3000/demo/state
```

## Slack Setup

1. Create a Slack app at [api.slack.com](https://api.slack.com)
2. Add these bot token scopes:
   - `app_mentions:read`
   - `commands`
   - `chat:write`
   - `channels:history`
   - `channels:read`
   - `groups:history` (for private channels)
   - `im:history` (for direct messages)
3. Add a slash command: `/crisisops`
4. Turn on interactivity and events
5. Fill in your `.env` file:

```env
SLACK_BOT_TOKEN=
SLACK_SIGNING_SECRET=
SLACK_APP_TOKEN=
SLACK_SOCKET_MODE=true
```

## Slack Commands

Type these in any Slack channel:

```
/crisisops simulate
/crisisops open incident
/crisisops brief
/crisisops match resources
/crisisops postmortem
```

Or mention the bot directly:

```
@CrisisOps run simulation
@CrisisOps what changed in the last 15 minutes?
@CrisisOps match resources to open needs
@CrisisOps record decision
@CrisisOps generate postmortem
```

## Run Tests and Build

```bash
npm test
npm run build
```

## MCP Server

CrisisOps includes a tool server that integrates with inventory, ticketing, and on-call systems:

```bash
npm run mcp:server
```

See `MCP.md` for examples.

## Swapping Demo for Production

The demo works out of the box with no external accounts needed. When you are ready for real use:

- Replace the demo search with Slack's Real-Time Search API
- Connect real tools: Jira, PagerDuty, Salesforce, Zendesk, Google Maps, Statuspage
- Replace the in-memory store with Postgres (schema is in `docs/schema.sql`)

## Project Files

| File | What it is |
|------|-----------|
| `SUBMISSION.md` | Hackathon submission details |
| `STUDY_GUIDE.md` | How the code is organized |
| `MCP.md` | Tool server examples |
| `VIDEO_SUBMISSION_CHECKLIST.md` | Demo video script |
| `assets/` | Architecture diagram and thumbnail |
