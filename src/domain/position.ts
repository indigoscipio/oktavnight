import type { Offering } from "./types";

export function generatePosition(existingOfferings?: Offering[]): { x: number; y: number } {
  for (let attempt = 0; attempt < 10; attempt++) {
    const x = Math.floor(Math.random() * 81) + 8;
    const y = Math.floor(Math.random() * 71) + 12;

    if (!existingOfferings || existingOfferings.length === 0) {
      return { x, y };
    }

    const tooClose = existingOfferings.some(
      (o) => Math.abs(o.position.x - x) < 10 && Math.abs(o.position.y - y) < 10
    );

    if (!tooClose) {
      return { x, y };
    }
  }

  return {
    x: Math.floor(Math.random() * 81) + 8,
    y: Math.floor(Math.random() * 71) + 12,
  };
}
