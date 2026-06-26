# CrisisOps Agent — Hackathon Submission

## Which Tracks to Submit To

- **New Slack Agent** ✅
- **Slack Agent for Good** ✅

> Only add "Slack Agent for Organizations" if you publish to the Slack Marketplace before the deadline. The two tracks above are the strongest fit for what this project does.

---

## Why It Qualifies for "Agent for Good"

A lot of urgent, important work happens in Slack — at nonprofits, clinics, schools, local government, and disaster-response teams. During a crisis, people post critical updates across many channels, but there is no structure. Things get missed, ownership is unclear, and help arrives too late.

CrisisOps fixes that. In the demo scenario alone:

- **3 hospital clinics** were affected with patient portal failures
- **180 support tickets** spiked in under 22 minutes — with no owner
- **1 backup generator** was matched and dispatched with a **42-minute ETA** before vaccine refrigeration failed
- **0 missed decisions** — every key call was recorded with owner, rationale, and review time
- **$0 additional software cost** for the team — it all happens inside Slack they already use

The result: faster help, fewer missed needs, and a transparent audit trail — for teams that cannot afford PagerDuty, OpsGenie, or enterprise incident management software. CrisisOps works for any Slack workspace, regardless of budget.

---

## About the Project

### The Problem

When something goes wrong, people flood Slack with messages. The facts are scattered, nobody knows who owns what, and critical decisions never get written down. It is hard to know what is happening, what is needed, or what has already been decided.

### What CrisisOps Does

CrisisOps is a Slack bot that turns those chaotic messages into structured action. Here is what happens when you use it:

1. **Chaos Radar** scans Slack messages and flags a possible emerging incident before anyone has to manually piece things together
2. **Open Incident** creates a response workflow right in Slack — severity, who is in charge, what needs to happen
3. **Situation Brief** pulls together what is known: what happened, who is affected, what is blocked, what to do next — with evidence, not guesses
4. **Resource Matching** checks what is available (inventory, volunteers, staff) and matches them to open needs using connected tools
5. **Decision Ledger** records every key decision with who made it, why, what the risk was, and when to review it
6. **Approval Gate** writes draft external updates that a human must approve before they go out
7. **Postmortem** turns the whole incident log into a structured after-action report

### How It Was Built

CrisisOps is a TypeScript/Node.js app. It connects to Slack using Slack Bolt and Socket Mode, which means it runs in real time without needing a public server to be always on.

The app is built in three layers:

- **Slack layer** — slash commands, mentions, interactive buttons, Block Kit cards, App Home dashboard, and the **Slack Assistant thread API** for natural-language DM conversations
- **Agent layer** — intent routing, Chaos Radar (AI-powered), briefing generation (Groq LLaMA-3.3-70b, evidence-grounded), resource matching, decision logging, approvals, and postmortem generation
- **Tools layer** — MCP-compatible stdio server and gateway simulating inventory, ticketing, on-call, customer impact, maps, and status updates

**AI stack:**
- **Groq LLaMA-3.3-70b** generates situation briefs, postmortems, and Chaos Radar summaries — all grounded in real Slack evidence, never hallucinated
- **Slack Assistant thread API** enables natural DM conversations with full suggested prompts, thread titles, and typing status — using Slack's native agent framework
- All AI outputs are evidence-cited and human-approval-gated before anything external is sent

The demo runs fully offline with pre-loaded example data, so judges can see the whole workflow without any real incident or external account.

### The Hardest Part

Making something that is both reliable for a demo and realistic for production. Real incident tools have many dependencies and edge cases.

The solution was clean swap points: the demo search can be replaced with Slack's real-time search; the simulated tools can be replaced with real Jira, PagerDuty, and Salesforce connections; and the in-memory store can be replaced with Postgres.

**Why not just use PagerDuty or OpsGenie?**

Those tools require every team member to have an account, learn a new interface, and context-switch away from Slack. They cost hundreds of dollars per month. A nonprofit coordinating storm relief, a school managing a lockdown, or a clinic protecting vaccine cold-chain during a power outage cannot afford that — and their staff are already in Slack. CrisisOps meets them where they are.

### What We're Proud Of

CrisisOps feels like a real operational tool, not just a chatbot. It proactively detects problems. It cites evidence instead of making things up. It requires human approval before sending anything external. It creates a clean audit trail from the first alert to the final postmortem.

The whole workflow — detection, response, resources, decisions, and learning — completes in under three minutes.

### What We Learned

The best Slack agents are not general assistants. They solve one clear problem and know exactly where in the workflow a human needs to stay in control.

Also: social good and business value are not opposites. The same tool that helps a company manage a server outage can help a nonprofit coordinate storm relief.

### What's Next

- Connect to Slack's real-time search API
- Add real connectors: Google Sheets, Airtable, Jira, PagerDuty, Salesforce, Zendesk, Google Maps, Statuspage
- Add a Slack App Home dashboard with incident history
- Add admin controls for data retention, permissions, and connector allowlists
- Publish to the Slack Marketplace

---

## Built With

TypeScript, Node.js, Express, Slack Bolt v4, Slack Socket Mode, Slack Block Kit, Slack App Home, **Slack Assistant Thread API**, Groq LLaMA-3.3-70b, MCP stdio server, Zod, Vitest

---

## Assets

| Asset | Where |
|-------|-------|
| Architecture diagram | `assets/architecture-diagram.png` |
| Thumbnail | `assets/crisisops-thumbnail.png` |
| Web preview (while running) | `http://localhost:3000` |
| Tool server examples | `MCP.md` |
| Video script | `VIDEO_SUBMISSION_CHECKLIST.md` |

---

## One-Line Pitch

CrisisOps turns chaotic Slack messages into structured emergency response — detection, briefing, resources, decisions, and postmortem, all inside Slack.

---

## Demo Video Script

### 0:00 – 0:15 · Set the scene

Show a Slack workspace and say:

> When something goes wrong, people flood Slack — but the facts are scattered, ownership is unclear, and decisions get lost. CrisisOps fixes that.

### 0:15 – 0:40 · Chaos Radar

Run `/crisisops simulate`, then say:

> CrisisOps reads the recent Slack context and detects a possible incident before anyone has manually assembled the picture.

### 0:40 – 1:05 · Open Incident

Run `/crisisops open incident`, then say:

> One command opens a structured command center in Slack: severity, who is in charge, and what needs to happen right now.

### 1:05 – 1:35 · Situation Brief

Run `/crisisops brief`, then say:

> The agent generates a sourced briefing — impact, timeline, blockers, owners, and the recommended next action. It only includes facts it can find in Slack. No hallucinations.

### 1:35 – 2:05 · Resource Matching

Run `/crisisops match resources`, then say:

> CrisisOps calls its inventory tool, finds a mobile generator, and matches it to the open need at Clinic B.

### 2:05 – 2:30 · Decision Log

Run `/crisisops record decision`, then say:

> Every key decision is logged with who made it, the rationale, the risk, and when to review it.

### 2:30 – 2:50 · Postmortem

Run `/crisisops postmortem`, then say:

> The incident log becomes a postmortem automatically: what happened, what went well, what went wrong, and what to do differently next time.

### 2:50 – 3:00 · Close

> Slack is already where urgent work happens. CrisisOps turns that chaos into command.
