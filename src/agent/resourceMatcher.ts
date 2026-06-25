import { nanoid } from "nanoid";
import { Resource, ResourceMatch, Task } from "../types.js";

export function extractNeedsFromText(text: string): string[] {
  const sentences = text.split(/(?<=[.!?])\s+/);
  return sentences.filter((sentence) => /\b(needs?|need|blocked|requires?|shortage|risk)\b/i.test(sentence));
}

export function rankResourceMatches(input: { incidentId: string; task: Task; resources: Resource[] }): ResourceMatch[] {
  const taskText = `${input.task.title} ${input.task.description}`.toLowerCase();
  return input.resources
    .map((resource) => {
      let score = 40;
      if (taskText.includes(resource.type)) score += 35;
      if (taskText.includes("clinic b") && resource.location.toLowerCase().includes("warehouse a")) score += 15;
      if (resource.status === "available") score += 10;
      if (resource.quantity > 0) score += 5;
      return {
        id: nanoid(),
        incidentId: input.incidentId,
        taskId: input.task.id,
        resourceId: resource.id,
        score: Math.min(100, score),
        rationale: `${resource.name} is ${resource.status} at ${resource.location} with quantity ${resource.quantity}.`,
        status: "draft" as const
      };
    })
    .sort((a, b) => b.score - a.score);
}
