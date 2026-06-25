# CrisisOps Agent Submission

## Recommended Track Selection

Submit to:

- **New Slack Agent**
- **Slack Agent for Good**

Only choose **Slack Agent for Organizations** if you submit or resubmit the app to the Slack Marketplace before the deadline. The current build is strongest for New Slack Agent + Agent for Good.

## Slack Agents for Good Track: Impact

CrisisOps Agent helps under-resourced teams coordinate urgent response work directly inside Slack. Nonprofits, clinics, schools, public-sector teams, and disaster-response groups often manage crises through scattered messages across channels. During an emergency, missed requests and unclear ownership can delay support.

CrisisOps turns that chaos into accountable action. It detects emerging incidents, identifies urgent needs and unresolved blockers, matches resources like generators or volunteers through MCP tools, records decisions with evidence, and drafts approved updates. The impact is faster coordination, fewer missed needs, better auditability, and a lightweight command center for teams that may not have access to expensive emergency-management software.

## About The Project

### Inspiration

Urgent work already happens in Slack. During outages, disaster response, public health coordination, nonprofit logistics, and customer escalations, people post critical information across many channels. The problem is not lack of information. The problem is that the information is fragmented, unowned, and hard to turn into action quickly.

CrisisOps Agent was inspired by the idea that Slack can become more than a communication layer. With agents, Real-Time Search, and MCP integrations, Slack can become the command surface for high-stakes work.

### What it does

CrisisOps Agent is a Slack-native command center for moments when work becomes urgent. It:

- Detects weak signals with **Chaos Radar**
- Opens an incident command workflow in Slack
- Searches Slack-like real-time context for urgent needs, blockers, owners, and evidence
- Generates sourced situation briefings
- Matches resource needs to inventory and volunteers through MCP-compatible tools
- Records key decisions with owner, risk, review time, and evidence
- Drafts external updates that require human approval
- Generates postmortem drafts from the incident evidence trail

### How we built it

We built CrisisOps as a TypeScript/Node.js Slack app using Slack Bolt-style app surfaces and Socket Mode. The app exposes slash commands and interactive Slack flows while also providing a local web preview for judging.

The architecture has three core layers:

- **Slack interface:** `/crisisops`, app mentions, Block Kit cards, and interactive buttons.
- **Agent layer:** intent routing, Chaos Radar, context retrieval, briefing generation, resource matching, decision ledger, approval manager, and postmortem generation.
- **Integration layer:** a Real-Time Search abstraction and MCP-compatible tools that simulate inventory, ticketing, customer impact, on-call, location ETA, and status update systems.

The demo mode uses seeded Slack-like messages so judges can reliably see a full crisis workflow without needing real incident data.

### Challenges we ran into

The biggest challenge was balancing a reliable hackathon demo with a realistic enterprise architecture. Real incident systems depend on many external tools, but a winning demo must be fast, repeatable, and easy to understand.

We solved this by creating clean abstractions:

- A demo Real-Time Search provider that can later be replaced with Slack RTS
- An MCP-compatible stdio server and gateway that can later connect to real MCP servers
- A memory store that can later be replaced with Postgres
- Human approval and audit logs from the start, so the product feels enterprise-ready

### Accomplishments that we're proud of

We are proud that CrisisOps feels like a real Slack-native product, not just a chatbot. It proactively detects incidents, creates structured response workflows, cites evidence, calls tools, records decisions, and generates postmortems.

The demo tells a complete story in three minutes: chaos across Slack channels becomes command, action, approval, and learning.

### What we learned

We learned that the most powerful Slack agents are not generic assistants. They are operational systems that understand where work happens, respect human approval, and coordinate across tools.

We also learned that social impact and enterprise value can reinforce each other. The same command-center agent that helps a company manage an outage can help a nonprofit coordinate disaster relief or a clinic protect critical operations during a storm.

### What's next for CrisisOps Agent

Next, we would:

- Replace the demo search provider with Slack Real-Time Search API
- Extend the included MCP-compatible server into production MCP servers
- Add real connectors for Google Sheets, Airtable, Jira, PagerDuty, Salesforce, Zendesk, Maps, and Statuspage
- Add a polished Slack App Home dashboard
- Add admin controls for retention, permissions, and connector allowlists
- Submit the app to the Slack Marketplace for incident response, nonprofit operations, and public-sector teams

## Built With

- TypeScript
- Node.js
- Express
- Slack Bolt
- Slack Socket Mode
- Slack slash commands
- Slack Block Kit
- Slack app mentions
- Real-Time Search abstraction
- MCP-compatible stdio server
- MCP gateway tools
- Zod
- Vitest
- Postgres-ready schema
- Mermaid/SVG architecture assets
- GitHub

## Upload Assets

- Architecture diagram: `assets/architecture-diagram.png`
- Thumbnail: `assets/crisisops-thumbnail.png`
- Web preview while app is running: `http://localhost:3000`
- MCP server instructions: `MCP.md`
- Video checklist and script: `VIDEO_SUBMISSION_CHECKLIST.md`

## Elevator Pitch

CrisisOps turns chaotic Slack incidents into command: it detects signals, opens response workflows, matches resources, records decisions, and drafts approved updates.

## Demo Video Script

### 0:00-0:15

Show the Slack workspace and say:

> Urgent work already happens in Slack, but during incidents the facts are scattered across channels, owners are unclear, and decisions get lost.

### 0:15-0:40

Run:

```text
/crisisops simulate
```

Say:

> CrisisOps uses real-time conversational context to detect a possible emerging incident before the team has manually assembled the picture.

### 0:40-1:05

Run:

```text
/crisisops open incident
```

Say:

> One command opens a Slack-native command center with severity, commander, and critical response tasks.

### 1:05-1:35

Run:

```text
/crisisops brief
```

Say:

> The agent creates a sourced situation brief: impact, timeline, blockers, owners, risks, and recommended next action. It does not invent facts; it cites evidence.

### 1:35-2:05

Run:

```text
/crisisops match resources
```

Say:

> CrisisOps calls MCP tools to search inventory and match the urgent need at Clinic B to an available mobile generator and field resources.

### 2:05-2:30

Run:

```text
/crisisops record decision
```

Say:

> Key decisions are captured with owner, rationale, risk, review time, and evidence so the team has an audit trail.

### 2:30-2:50

Run:

```text
/crisisops postmortem
```

Say:

> The same evidence trail becomes the postmortem, including impact, hypothesis, what went well, what went wrong, and follow-up actions.

### 2:50-3:00

Close with:

> Slack is where urgent work already happens. CrisisOps turns the chaos into command.
