import type { Mood, Offering } from "./types";
import { generateOfferingName } from "./nameGenerator";
import { generatePosition } from "./position";

export function createOffering(input: {
  body: string;
  mood: Mood;
}): Offering {
  const now = new Date();
  const expiresAt = new Date(now.getTime() + 24 * 60 * 60 * 1000);

  return {
    id: crypto.randomUUID(),
    body: input.body,
    mood: input.mood,
    generatedName: generateOfferingName(input.mood),
    status: "active",
    witnessCount: 0,
    candleCount: 0,
    releaseCount: 0,
    reportCount: 0,
    createdAt: now.toISOString(),
    expiresAt: expiresAt.toISOString(),
    position: generatePosition(),
  };
}
