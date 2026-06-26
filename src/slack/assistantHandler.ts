import { Assistant } from "@slack/bolt";
import { CrisisOpsAgent } from "../agent/crisisOpsAgent.js";
import { routeIntent } from "../agent/intentRouter.js";
import { store } from "../store/memoryStore.js";
import { groqComplete } from "../services/groqService.js";

/** Suggested prompts shown when a user opens a new CrisisOps thread */
const SUGGESTED_PROMPTS = [
  { title: "📡 Detect emerging incident", message: "Run chaos radar and tell me what's happening" },
  { title: "📋 Get a situation brief", message: "Give me a full situation brief for the current incident" },
  { title: "🔧 Match resources to needs", message: "Match resources to open needs right now" },
  { title: "📊 Generate postmortem", message: "Generate a postmortem for the current incident" }
];

export function createAssistant(agent: CrisisOpsAgent): Assistant {
  return new Assistant({

    /** Called when a user opens a new DM thread with the bot */
    threadStarted: async ({ say, setSuggestedPrompts, setTitle }) => {
      await setTitle("CrisisOps Command Thread");
      await say({
        text: "👋 I'm CrisisOps — your Slack-native incident command assistant.\n\nI can detect emerging incidents, generate AI-powered situation briefs, match resources, record decisions, and create postmortems — all grounded in your Slack evidence.\n\nWhat do you need?"
      });
      await setSuggestedPrompts({
        title: "What can CrisisOps do?",
        prompts: SUGGESTED_PROMPTS
      });
    },

    /** Called when the user sends a message in the Assistant thread */
    userMessage: async ({ message, say, setTitle, setStatus }) => {
      const text = "text" in message && message.text ? message.text : "";

      // Show a typing indicator
      await setStatus("Analyzing...");

      const intent = routeIntent(text);

      try {
        // ── Chaos Radar ────────────────────────────────────────────────────
        if (intent === "SIMULATION" || text.toLowerCase().includes("chaos") || text.toLowerCase().includes("detect")) {
          await setStatus("Scanning Slack signals...");
          await setTitle("Chaos Radar Analysis");
          if (intent === "SIMULATION") store.resetDemo();
          const signal = await agent.runChaosRadar();
          const bar = "█".repeat(Math.round(signal.confidence / 10)) + "░".repeat(10 - Math.round(signal.confidence / 10));
          await say({
            text: [
              `📡 *Chaos Radar — ${signal.severity}*`,
              `Confidence: \`${bar}\` *${signal.confidence}%*`,
              ``,
              `*${signal.title}*`,
              signal.summary,
              ``,
              `*Signals detected:*`,
              signal.signals.map(s => `• ${s}`).join("\n"),
              ``,
              `*Recommended action:* ${signal.recommendedAction === "open_incident" ? "🔴 Open incident now" : "👁️ Watch"}`,
              ``,
              `⚡ AI-powered detection · Evidence-grounded`
            ].join("\n")
          });
          return;
        }

        // ── Open Incident ──────────────────────────────────────────────────
        if (intent === "OPEN_INCIDENT") {
          await setStatus("Opening incident...");
          await setTitle("Incident Command");
          const userId = "user" in message && message.user ? message.user : "demo-user";
          const incident = agent.openIncident(userId);
          const tasks = store.tasks.filter(t => t.incidentId === incident.id);
          await say({
            text: [
              `🔴 *Incident Opened — ${incident.severity}*`,
              `*${incident.title}*`,
              `Status: ${incident.status.toUpperCase()} · Commander: <@${incident.commanderUserId}>`,
              ``,
              `*Response tasks:*`,
              tasks.map(t => `• [${t.priority.toUpperCase()}] ${t.title}`).join("\n"),
              ``,
              `Type "brief" for a situation briefing, or "match resources" to find available assets.`
            ].join("\n")
          });
          return;
        }

        // ── Situation Brief ────────────────────────────────────────────────
        if (intent === "BRIEF" || text.toLowerCase().includes("brief") || text.toLowerCase().includes("what changed")) {
          await setStatus("Generating AI briefing...");
          await setTitle("Situation Brief");
          const briefing = await agent.generateBrief();
          await say({ text: `📋 *Situation Brief*\n\n${briefing.content}` });
          return;
        }

        // ── Resource Matching ──────────────────────────────────────────────
        if (intent === "MATCH_RESOURCES") {
          await setStatus("Searching inventory via MCP...");
          await setTitle("Resource Matching");
          const matches = await agent.matchResources();
          const top = matches.slice(0, 3);
          const medals = ["🥇", "🥈", "🥉"];
          await say({
            text: [
              `🔧 *Resource Matches — ${matches.length} ranked*`,
              `_MCP tools called: \`search_inventory\` → \`get_location_eta\`_`,
              ``,
              ...top.map((m, i) => `${medals[i]}  *Score ${m.score}/100* — ${m.rationale}`),
              ``,
              `Type "approve best match" to reserve the top resource.`
            ].join("\n")
          });
          return;
        }

        // ── Record Decision ────────────────────────────────────────────────
        if (intent === "DECISION") {
          await setStatus("Extracting decision from evidence...");
          await setTitle("Decision Ledger");
          const decision = await agent.recordSuggestedDecision();
          if (decision) {
            await say({
              text: [
                `📝 *Decision Recorded*`,
                `*${decision.text}*`,
                ``,
                `Owner: ${decision.owner}`,
                `Risk: ${decision.risk}`,
                `Review at: ${new Date(decision.reviewAt).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}`,
                `Status: ${decision.approvalStatus}`,
                `Evidence: ${decision.evidenceUrls.join(", ")}`
              ].join("\n")
            });
          } else {
            await say({ text: "📝 No decision proposal found in current evidence. Try running `/crisisops simulate` first to seed the scenario." });
          }
          return;
        }

        // ── Postmortem ─────────────────────────────────────────────────────
        if (intent === "POSTMORTEM") {
          await setStatus("Generating AI postmortem...");
          await setTitle("Postmortem Report");
          const postmortem = await agent.postmortem();
          await say({ text: postmortem.slice(0, 3000) });
          return;
        }

        // ── Approve Update ─────────────────────────────────────────────────
        if (text.toLowerCase().includes("approve") && text.toLowerCase().includes("update")) {
          await setStatus("Drafting approved update...");
          const userId = "user" in message && message.user ? message.user : "demo-user";
          const draft = await agent.draftApprovedUpdate(userId);
          await say({
            text: [
              `✅ *Approved Status Update*`,
              ``,
              draft.content,
              ``,
              `_This update has been logged in the audit trail._`
            ].join("\n")
          });
          return;
        }

        // ── Free-form Groq fallback ────────────────────────────────────────
        await setStatus("Thinking...");
        const incident = store.latestIncident();
        const context = incident
          ? `Active incident: ${incident.title} (${incident.severity}, ${incident.status}). Tasks: ${store.tasks.filter(t => t.incidentId === incident.id).length}. Decisions: ${store.decisions.filter(d => d.incidentId === incident.id).length}.`
          : "No active incident. Demo scenario available via 'simulate'.";

        const reply = await groqComplete(
          `You are CrisisOps, a Slack-native incident command assistant. Be concise and actionable.
Current context: ${context}
Available commands: "chaos radar", "open incident", "brief", "match resources", "record decision", "postmortem", "approve update", "simulate".
If the user asks something outside your scope, suggest the most relevant command.`,
          text,
          300
        );

        await say({
          text: reply ?? "I'm not sure what you need. Try: *chaos radar*, *open incident*, *brief*, *match resources*, or *postmortem*."
        });

      } catch (err) {
        await say({ text: `❌ Something went wrong: ${String(err)}. Try resetting with "simulate".` });
      }
    }
  });
}
