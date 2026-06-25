import { RealTimeSearchService } from "../services/realTimeSearchService.js";

export class ContextRetriever {
  constructor(private readonly rts: RealTimeSearchService) {}

  async incidentSignals() {
    return this.rts.search("urgent failing blocked risk customer clinic hospital owner eta generator", { limit: 12 });
  }

  async blockers() {
    return this.rts.search("blocked no owner unresolved need risk eta", { limit: 8 });
  }

  async resourceNeeds() {
    return this.rts.search("need needs generator blankets vehicle staff available resource approval", { limit: 8 });
  }

  async decisionSignals() {
    return this.rts.search("decision proposal disable mitigation pause route approve risk", { limit: 8 });
  }
}
