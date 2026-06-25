import type { Mood } from "./types";

const names: Record<Mood, string[]> = {
  grief: [
    "Hollow Candle",
    "Pale Bell",
    "Wilted Bloom",
    "Ashen Prayer",
    "Silent Keepsake",
    "Dust of Evening",
  ],
  rage: [
    "Cracked Glass",
    "Red Ember",
    "Rusted Blade",
    "Burning Crown",
    "Iron Howl",
    "Scorched Earth",
  ],
  fear: [
    "Ashen Thorn",
    "Pale Moth",
    "Black Halo",
    "Distant Eye",
    "Thin Veil",
    "Echo of Nothing",
  ],
  shame: [
    "Faded Veil",
    "Buried Mask",
    "Silent Cloth",
    "Hidden Mirror",
    "Withered Vine",
    "Bent Nail",
  ],
  loneliness: [
    "Cold Lantern",
    "Moonless Well",
    "Distant Bell",
    "Empty Chair",
    "Frost on Glass",
    "Unlit Room",
  ],
};

export function generateOfferingName(mood: Mood): string {
  const pool = names[mood];
  const index = Math.floor(Math.random() * pool.length);
  return pool[index];
}
