import type { Mood } from "../domain/types";

export const moodIconPaths: Record<Mood, string> = {
  grief: "/icons/mood-grief.svg",
  rage: "/icons/mood-wrath.svg",
  fear: "/icons/mood-dread.svg",
  shame: "/icons/mood-shame.svg",
  loneliness: "/icons/mood-loneliness.svg",
};

export const ritualIconPaths = {
  lit: "/icons/ritual-lit.svg",
  witnessed: "/icons/ritual-witnessed.svg",
} as const;
