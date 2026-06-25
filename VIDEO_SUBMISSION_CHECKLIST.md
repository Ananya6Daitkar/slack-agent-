# Video Submission Checklist

## Must Be Under 3 Minutes

Target length: **2:40-2:55**.

Do not show slides for more than 10 seconds. The video should mostly show the Slack app working.

## Must Show The App Actually Working

Record the real Slack workspace and run:

```text
/crisisops simulate
/crisisops open incident
/crisisops brief
/crisisops match resources
/crisisops record decision
/crisisops postmortem
```

Also briefly show the web preview:

```text
http://localhost:3000
```

## Must Explain Slack + MCP + RTS

Use this exact narration:

> CrisisOps is built as a Slack Agent using Slack slash commands, Socket Mode, and Block Kit. It uses a Real-Time Search abstraction to retrieve urgent Slack context like blockers, owners, decisions, and affected locations. It also includes an MCP-compatible server and MCP gateway tools for inventory search, location ETA, and approved status updates.

## 2:50 Video Script

### 0:00-0:15 Problem

> During incidents, disaster response, and nonprofit operations, urgent information gets scattered across Slack channels. Teams lose time finding blockers, owners, resources, and decisions.

### 0:15-0:35 Slack Agent Working

Run:

```text
/crisisops simulate
```

> CrisisOps detects an emerging incident from Slack conversation signals and recommends opening a SEV2 response.

### 0:35-0:55 Command Center

Run:

```text
/crisisops open incident
```

> The agent opens a Slack-native command center with severity, commander, and critical response tasks.

### 0:55-1:25 Real-Time Search

Run:

```text
/crisisops brief
```

> The brief is built from real-time searchable Slack context: urgent needs, blockers, owners, customer impact, and evidence links.

### 1:25-1:55 MCP Integration

Run:

```text
/crisisops match resources
```

> CrisisOps calls MCP tools to search inventory and match the Clinic B need to an available mobile generator and field resources.

### 1:55-2:20 Decision + Approval

Run:

```text
/crisisops record decision
```

> The Decision Ledger captures owner, reason, risk, review time, and evidence. External updates are approval-gated and audited.

### 2:20-2:40 Postmortem

Run:

```text
/crisisops postmortem
```

> The same evidence trail becomes a postmortem with impact, hypothesis, follow-up actions, and decisions.

### 2:40-2:55 Close

> Slack is where urgent work already happens. CrisisOps turns chaos into command for enterprises, nonprofits, clinics, schools, and disaster-response teams.

## Final Self-Check

- Under 3 minutes
- Shows real Slack commands
- Shows the agent responding
- Mentions Slack Agent Builder/Slack agent surfaces
- Mentions Real-Time Search abstraction
- Mentions MCP-compatible server and MCP tools
- Explains problem, solution, and impact
