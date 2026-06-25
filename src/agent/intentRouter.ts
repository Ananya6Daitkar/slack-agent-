export type Intent =
  | "BRIEF"
  | "OPEN_INCIDENT"
  | "FIND_BLOCKERS"
  | "MATCH_RESOURCES"
  | "CREATE_UPDATE"
  | "CREATE_TASK"
  | "POSTMORTEM"
  | "SIMULATION"
  | "DECISION"
  | "UNKNOWN";

export function routeIntent(text: string): Intent {
  const value = text.toLowerCase();
  if (value.includes("simulate") || value.includes("simulation")) return "SIMULATION";
  if (value.includes("open incident") || value.includes("start incident")) return "OPEN_INCIDENT";
  if (value.includes("brief") || value.includes("what changed")) return "BRIEF";
  if (value.includes("blocker")) return "FIND_BLOCKERS";
  if (value.includes("match") || value.includes("resource")) return "MATCH_RESOURCES";
  if (value.includes("update") || value.includes("status")) return "CREATE_UPDATE";
  if (value.includes("decision") || value.includes("record")) return "DECISION";
  if (value.includes("postmortem") || value.includes("retro")) return "POSTMORTEM";
  if (value.includes("task") || value.includes("assign")) return "CREATE_TASK";
  return "UNKNOWN";
}
