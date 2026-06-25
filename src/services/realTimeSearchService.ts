import { SimulatedMessage } from "../types.js";
import { MemoryStore } from "../store/memoryStore.js";

export interface RealTimeSearchService {
  search(query: string, options?: { sinceIso?: string; channels?: string[]; limit?: number }): Promise<SimulatedMessage[]>;
}

const normalize = (value: string) => value.toLowerCase();

export class DemoRealTimeSearchService implements RealTimeSearchService {
  constructor(private readonly store: MemoryStore) {}

  async search(query: string, options: { sinceIso?: string; channels?: string[]; limit?: number } = {}): Promise<SimulatedMessage[]> {
    const terms = normalize(query)
      .split(/[^a-z0-9#-]+/)
      .filter((term) => term.length > 2 && !["and", "the", "for", "with"].includes(term));
    const since = options.sinceIso ? Date.parse(options.sinceIso) : 0;

    return this.store.messages
      .filter((message) => !options.channels || options.channels.includes(message.channel))
      .filter((message) => Date.parse(message.ts) >= since)
      .map((message) => {
        const haystack = normalize(`${message.channel} ${message.user} ${message.text} ${message.tags.join(" ")}`);
        const score = terms.reduce((total, term) => total + (haystack.includes(term) ? 1 : 0), 0);
        return { message, score };
      })
      .filter(({ score }) => score > 0 || terms.length === 0)
      .sort((a, b) => b.score - a.score || Date.parse(b.message.ts) - Date.parse(a.message.ts))
      .slice(0, options.limit ?? 12)
      .map(({ message }) => message);
  }
}
