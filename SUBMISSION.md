# CrisisOps Agent — Hackathon Submission

## Which Tracks to Submit To

- **New Slack Agent** ✅
- **Slack Agent for Good** ✅

> Only add "Slack Agent for Organizations" if you publish to the Slack Marketplace before the deadline. The two tracks above are the strongest fit for what this project does.

---

## Why It Qualifies for "Agent for Good"

A lot of urgent, important work happens in Slack — at nonprofits, clinics, schools, local government, and disaster-response teams. During a crisis, people post critical updates across many channels, but there is no structure. Things get missed, ownership is unclear, and help arrives too late.

CrisisOps fixes that. In the demo scenario alone:

- **3 hospital clinics** affected with patient portal failures
- **180 support tickets** spiked in 22 minutes — with no named owner
- **1 backup generator** matched and dispatched with a **42-minute ETA** before vaccine refrigeration failed
- **0 missed decisions** — every key call recorded with owner, rationale, and review time
- **$0 additional software cost** — it all runs inside Slack they already pay for

---

## Market Size & Real-World Impact

### Who needs this

| Segment | Slack users (est.) | Current tool | Gap |
|---|---|---|---|
| Enterprise IT teams | 35M+ | PagerDuty ($21K+/yr) | Cost + context-switch |
| Nonprofits | 500K orgs | Nothing / spreadsheets | No budget |
| Hospitals & clinics | 6,500 US hospitals | Phone trees + email | Slow, no audit trail |
| Emergency response NGOs | 100K+ globally | WhatsApp groups | No structure |
| Schools (safety teams) | 130K US schools | Radio / PA | No coordination layer |

**TAM:** $12B global incident management software market (IDC 2024)
**SAM:** $1.4B — Slack-using orgs needing incident coordination
**SOM (Year 1):** $14M — 1,400 enterprise workspaces at $10K/yr + nonprofit freemium

### The cost of doing nothing

> *Industry assumption: average IT outage costs $5,600 per minute (Gartner). A 30-minute delay in incident response = $168,000 in damage.*

> *For a nonprofit: a missed generator dispatch during a storm = spoiled vaccines, displaced families, and reputational damage that takes years to repair.*

CrisisOps targets the gap between the first chaotic Slack message and the moment someone is actually in command. In the demo scenario, that gap is **22 minutes**. At enterprise rates, that's **$123,200 in avoided damage per incident**.

### Staff time saved

| Task | Without CrisisOps | With CrisisOps | Saved |
|---|---|---|---|
| Detect incident from Slack noise | 15–30 min | <60 sec (Chaos Radar) | 29 min |
| Write situation brief | 20–45 min | <10 sec (Groq AI) | 40 min |
| Find available resources | 10–20 min (phone calls) | <5 sec (MCP search) | 18 min |
| Write postmortem | 2–4 hours | <30 sec (AI draft) | 3.5 hrs |

*Assumptions: 5-person incident team at $80/hr fully-loaded cost.*
**Per incident savings: ~$300–$500 in staff time + avoided escalation damage.**

### Validation roadmap

We have not yet run a formal user study — but here is the validation plan for post-hackathon:

1. **Week 1–2:** Pilot with 3 volunteer teams (one tech startup, one nonprofit, one clinic IT team) — 30-minute structured walkthrough, collect SUS usability scores
2. **Week 3:** Expert review from an incident commander (target: SRE lead or emergency management professional via LinkedIn outreach)
3. **Month 2:** Measure actual MTTD (Mean Time to Detect) and MTTR (Mean Time to Resolve) before vs. after CrisisOps in a live team

*We believe CrisisOps can reduce MTTD by 85% and MTTR by 40% based on the workflow compression demonstrated in the demo.*

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

The solution was clean swap points: the simulated MCP tools can be replaced with real Jira, PagerDuty, and Salesforce connections; and the in-memory store can be replaced with Postgres. The Slack Real-Time Search API is already connected via a live `xoxp` user token.

**Why not just use PagerDuty or OpsGenie?**

Those tools require every team member to have an account, learn a new interface, and context-switch away from Slack. They cost hundreds of dollars per month. A nonprofit coordinating storm relief, a school managing a lockdown, or a clinic protecting vaccine cold-chain during a power outage cannot afford that — and their staff are already in Slack. CrisisOps meets them where they are.

### What We're Proud Of

CrisisOps feels like a real operational tool, not just a chatbot. It proactively detects problems. It cites evidence instead of making things up. It requires human approval before sending anything external. It creates a clean audit trail from the first alert to the final postmortem.

The whole workflow — detection, response, resources, decisions, and learning — completes in under three minutes.

### What We Learned

The best Slack agents are not general assistants. They solve one clear problem and know exactly where in the workflow a human needs to stay in control.

Also: social good and business value are not opposites. The same tool that helps a company manage a server outage can help a nonprofit coordinate storm relief.

### What's Next

- Add real connectors: Google Sheets, Airtable, Jira, PagerDuty, Salesforce, Zendesk, Google Maps, Statuspage
- Add admin controls for data retention, permissions, and connector allowlists
- Add incident simulation library for team training
- Publish to the Slack Marketplace



## Built With

TypeScript, Node.js, Express, Slack Bolt v4, Slack Socket Mode, Slack Block Kit, Slack App Home, **Slack Assistant Thread API**, **Slack Real-Time Search API**, Groq LLaMA-3.3-70b, MCP stdio server, Zod, Vitest

---

## Assets

| Asset | Where |
|-------|-------|
| Architecture diagram | `assets/architecture-diagram.png` |
| Thumbnail | `assets/crisisops-thumbnail.png` |
| Web preview (while running) | `http://localhost:3000` |
| MCP server examples | `MCP.md` |

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
