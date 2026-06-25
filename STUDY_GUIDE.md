# CrisisOps Agent Study Guide

Use this file to explain the project confidently in internship interviews, resume screens, hackathon judging, and technical deep dives.

## 30-Second Resume Pitch

CrisisOps Agent is a Slack-native incident command agent built with TypeScript, Node.js, Slack Bolt, Socket Mode, a Real-Time Search abstraction, and an MCP-compatible tool server/gateway. It detects emerging incidents from Slack conversations, opens response workflows, generates sourced situation briefs, matches resources, records decisions, requires human approval for external updates, and generates postmortems.

## Resume Bullet Options

- Built **CrisisOps Agent**, a Slack-native incident command system using TypeScript, Node.js, Slack Bolt, Socket Mode, Block Kit, and MCP-compatible tool integrations.
- Implemented **Chaos Radar**, a proactive signal detector that scores cross-channel Slack incident signals using urgency, blockers, affected users, missing owners, and channel spread.
- Designed a **Real-Time Search abstraction** to retrieve Slack incident context with source citations, enabling evidence-backed briefings and postmortems.
- Built an **MCP-compatible server and gateway** for inventory, status updates, customer impact, and location ETA tools.
- Added **human approval and audit logging** for external status updates to improve enterprise trust and safety.
- Created a repeatable hackathon demo with Slack slash commands, seeded incident data, web preview, architecture diagram, tests, and DevPost-ready documentation.

## Problem Statement

During outages, disaster response, nonprofit operations, public health coordination, and customer escalations, teams often coordinate in Slack. Critical information gets scattered across many channels. People ask for updates, report blockers, volunteer resources, and make decisions, but there is no single command view.

CrisisOps solves this by turning Slack into an agentic command center.

## Target Users

- Nonprofits coordinating disaster response
- Schools and public-sector teams managing urgent operations
- Clinics and healthcare operations teams
- SRE, IT, and security incident response teams
- Customer support and executive escalation teams

## Core Features

### 1. Chaos Radar

Detects emerging incidents before someone manually opens one.

Signals used:

- urgent/failure language
- cross-channel spread
- unresolved questions
- blocked work
- customer/patient/clinic impact
- missing owner or incident commander

Why it matters:

> It makes the agent proactive, not just reactive.

### 2. Incident Command

Creates an incident record and initializes response tasks.

Example tasks:

- confirm customer communications owner
- dispatch backup generator to Clinic B
- assign commander

### 3. Real-Time Search Abstraction

The project uses a demo provider that searches seeded Slack-like messages. In production, the same interface can be replaced by Slack Real-Time Search API.

Interview explanation:

> I separated retrieval from reasoning. The agent does not depend on one search provider. It only needs a `search(query, options)` contract that returns messages with evidence links.

### 4. MCP-Compatible Server And Gateway

The gateway simulates external tools:

- `search_inventory`
- `reserve_resource`
- `create_ticket`
- `create_status_update`
- `get_on_call_owner`
- `get_customer_impact`
- `get_location_eta`

Interview explanation:

> MCP lets the agent use external systems as tools. I implemented a local MCP-compatible server and gateway so the demo is reliable, while keeping the structure ready for real MCP servers.

### 5. Decision Ledger

Captures:

- decision text
- owner
- reason
- evidence
- risk
- review time
- approval status

Why it matters:

> During incidents, decisions are often buried in chat. The ledger makes them auditable and reusable for postmortems.

### 6. Approval-Gated Updates

External updates are not sent automatically. The agent drafts them and requires human approval.

Why it matters:

> This reduces risk and makes the system enterprise-ready.

### 7. Postmortem Generator

Creates a postmortem from:

- timeline
- messages
- tasks
- decisions
- blockers
- tool outputs
- evidence links

## Architecture Summary

```text
Slack Workspace
  -> Slack Bolt / Socket Mode
  -> Intent Router
  -> CrisisOps Agent Orchestrator
  -> Real-Time Search Service
  -> Agent Modules
     - Chaos Radar
     - Briefing Generator
     - Resource Matcher
     - Decision Ledger
     - Postmortem Generator
  -> MCP Gateway
     - Inventory
     - Tickets
     - Status updates
     - On-call
     - ETA
  -> State + Audit Layer
```

## Tech Stack

- TypeScript
- Node.js
- Express
- Slack Bolt
- Slack Socket Mode
- Slack slash commands
- Slack Block Kit
- Real-Time Search abstraction
- MCP-compatible stdio server
- MCP gateway tools
- Vitest
- SVG architecture assets
- Postgres-ready schema

## Important Files

- `src/index.ts`: app entry point
- `src/server.ts`: local preview and demo API
- `src/slack/slackApp.ts`: Slack command and event handlers
- `src/agent/crisisOpsAgent.ts`: main orchestrator
- `src/agent/chaosRadar.ts`: incident signal scoring
- `src/agent/briefingGenerator.ts`: situation brief generation
- `src/agent/resourceMatcher.ts`: resource matching logic
- `src/agent/decisionLedger.ts`: decision extraction and formatting
- `src/services/mcpGatewayClient.ts`: MCP gateway tools used by the Slack demo
- `src/mcp/server.ts`: standalone MCP-compatible stdio server
- `src/services/realTimeSearchService.ts`: search abstraction
- `tests/agent.test.ts`: core logic tests

## How To Explain Technical Decisions

### Why TypeScript?

TypeScript gives type safety for incident objects, tasks, decisions, resources, and tool calls. This matters because agent systems can become messy if data contracts are unclear.

### Why Slack Socket Mode?

Socket Mode lets the local app receive Slack events without exposing a public server through ngrok. This is useful for hackathon demos and local development.

### Why a mock RTS provider?

Real incident data is hard to demo safely. The mock provider makes the demo deterministic while preserving the interface needed to swap in Slack Real-Time Search.

### Why human approval?

Incident agents should not automatically send external communications or mutate critical systems without a human in the loop. Approval improves trust, safety, and enterprise adoption.

### Why MCP?

MCP is a clean way to expose external systems as tools. CrisisOps can use the same agent logic while connecting to many systems: inventory, ticketing, status pages, calendars, and CRMs.

## Interview Questions And Answers

### Q: What problem does this solve?

A: It solves the coordination gap during urgent Slack-based operations. Information is scattered across channels, so CrisisOps detects signals, creates a command view, assigns actions, matches resources, records decisions, and generates postmortems.

### Q: What makes it different from a chatbot?

A: It is not only answering questions. It maintains incident state, retrieves evidence, calls tools, creates workflows, requires approvals, records audit logs, and produces operational artifacts.

### Q: What was the hardest part?

A: Designing a demo that is both reliable and realistic. Real integrations are unpredictable in a hackathon, so I created abstractions for Real-Time Search and MCP tools while preserving production-ready boundaries.

### Q: How would you scale it?

A: Replace the memory store with Postgres, add Redis queues for background summaries, enforce workspace-level tenancy, add Slack permission checks in retrieval, and deploy as separate services for Slack events, agent orchestration, MCP tools, and audit logging.

### Q: How do you prevent hallucinations?

A: Briefings and postmortems are generated from retrieved evidence and tool outputs. The prompts require source citations and uncertainty flags. The deterministic demo logic also avoids relying on generative output for critical facts.

### Q: How do you handle security?

A: Workspace isolation, least-privilege Slack scopes, audit logs, approval-gated external actions, no cross-channel leakage, and prompt-injection awareness. Production would filter search results by Slack permissions.

### Q: What would you improve next?

A: Add real Slack RTS, production MCP servers, a polished Slack App Home dashboard, connector configuration, admin retention policies, and Marketplace packaging.

## System Design Talking Points

- Separate Slack UI from agent orchestration.
- Keep retrieval behind an interface.
- Keep external actions behind an MCP gateway.
- Log every tool call and approval.
- Make source evidence first-class.
- Use deterministic logic for demo-critical flows.
- Require human approval for risky actions.

## Demo Commands

```text
/crisisops simulate
/crisisops open incident
/crisisops brief
/crisisops match resources
/crisisops record decision
/crisisops postmortem
```

## One-Minute Technical Explanation

CrisisOps is a Slack app built in TypeScript with Slack Bolt and Socket Mode. The slash command routes user intent into an agent orchestrator. The orchestrator retrieves Slack-like context through a Real-Time Search abstraction, then calls modules like Chaos Radar, resource matching, decision ledger, briefing generation, and postmortem generation. External actions go through MCP-compatible tools, which log every tool call. Risky actions such as status updates require human approval and create audit records. The demo uses an in-memory store and seeded messages, but the schema is Postgres-ready.

## What To Say In Resume Interviews

Use this structure:

1. Problem: urgent work in Slack is fragmented.
2. Solution: agentic command center inside Slack.
3. Technical depth: Slack Bolt, Socket Mode, RTS abstraction, MCP tools, approval/audit layer.
4. Impact: helps enterprises and nonprofits respond faster.
5. Tradeoff: mocked external systems for demo reliability, clean interfaces for production replacement.

## Possible Resume Project Title

**CrisisOps Agent: Slack-Native Incident Command Agent**

## Best Resume Description

Built a Slack-native incident command agent that detects emerging incidents, generates evidence-backed briefings, matches resources through MCP-compatible tools, records decisions, requires human approval for external updates, and creates postmortems. Implemented with TypeScript, Node.js, Slack Bolt, Socket Mode, Express, Vitest, and a Postgres-ready schema.
