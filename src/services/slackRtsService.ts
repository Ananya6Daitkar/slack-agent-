import { SimulatedMessage } from "../types.js";
import { RealTimeSearchService } from "./realTimeSearchService.js";

/**
 * Production Real-Time Search service using Slack's search.messages API.
 * Activated when SLACK_USER_TOKEN is set in the environment.
 * Falls back to DemoRealTimeSearchService if not configured.
 */
export class SlackRtsService implements RealTimeSearchService {
  private readonly token: string;

  constructor(token: string) {
    this.token = token;
  }

  async search(
    query: string,
    options: { sinceIso?: string; channels?: string[]; limit?: number } = {}
  ): Promise<SimulatedMessage[]> {
    const limit = Math.min(options.limit ?? 10, 20);

    // Build query — append channel filters if provided
    let fullQuery = query;
    if (options.channels && options.channels.length > 0) {
      const channelFilters = options.channels
        .map((c) => `in:${c}`)
        .join(" OR ");
      fullQuery = `${query} (${channelFilters})`;
    }

    const params = new URLSearchParams({
      query: fullQuery,
      count: String(limit),
      sort: "timestamp",
      sort_dir: "desc"
    });

    const res = await fetch(
      `https://slack.com/api/search.messages?${params.toString()}`,
      { headers: { Authorization: `Bearer ${this.token}` } }
    );

    if (!res.ok) {
      throw new Error(`Slack RTS HTTP error: ${res.status}`);
    }

    const data = (await res.json()) as {
      ok: boolean;
      error?: string;
      messages?: {
        matches?: Array<{
          iid: string;
          channel: { id: string; name: string };
          username: string;
          text: string;
          ts: string;
          permalink: string;
        }>;
      };
    };

    if (!data.ok) {
      throw new Error(`Slack RTS API error: ${data.error}`);
    }

    const matches = data.messages?.matches ?? [];

    // Filter by sinceIso if provided
    const since = options.sinceIso ? Date.parse(options.sinceIso) : 0;

    return matches
      .filter((m) => Date.parse(m.ts) * 1000 >= since)
      .map((m) => ({
        id: m.iid,
        channel: `#${m.channel.name}`,
        user: m.username,
        text: m.text,
        ts: new Date(parseFloat(m.ts) * 1000).toISOString(),
        permalink: m.permalink,
        tags: inferTags(m.text)
      }));
  }
}

/** Infer tags from message text so the agent modules work the same way */
function inferTags(text: string): string[] {
  const t = text.toLowerCase();
  const tags: string[] = [];
  if (/urgent|critical|emergency/.test(t)) tags.push("urgent");
  if (/blocked|blocker/.test(t)) tags.push("blocked");
  if (/generator|power|backup/.test(t)) tags.push("generator");
  if (/risk|at risk/.test(t)) tags.push("risk");
  if (/need|needs|needed/.test(t)) tags.push("need");
  if (/decision|decided|approve/.test(t)) tags.push("decision");
  if (/owner|owns|assigned/.test(t)) tags.push("owner");
  if (/no owner|unowned/.test(t)) tags.push("unowned");
  if (/customer|patient|clinic|hospital/.test(t)) tags.push("customer-impact");
  return tags;
}
