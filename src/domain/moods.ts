import type { Mood } from "./types";

export const moodLabels: Record<Mood, string> = {
  grief: "Grief",
  rage: "Rage",
  fear: "Fear",
  shame: "Shame",
  loneliness: "Loneliness",
};

export const moodColors: Record<Mood, string> = {
  grief: "stone",
  rage: "red",
  fear: "violet",
  shame: "amber",
  loneliness: "blue",
};
