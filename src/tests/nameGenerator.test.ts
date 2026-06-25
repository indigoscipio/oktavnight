import { describe, it, expect } from "vitest";
import { generateOfferingName } from "../domain/nameGenerator";

const moods = ["grief", "rage", "fear", "shame", "loneliness"] as const;

describe("generateOfferingName", () => {
  for (const mood of moods) {
    it(`returns a name for ${mood}`, () => {
      const name = generateOfferingName(mood);
      expect(typeof name).toBe("string");
      expect(name.length).toBeGreaterThan(0);
    });
  }

  it("returns different names on multiple calls (pseudo-random)", () => {
    const names = new Set(Array.from({ length: 20 }, () => generateOfferingName("grief")));
    expect(names.size).toBeGreaterThan(1);
  });

  it("returns names from the correct mood pool", () => {
    const griefNames = [
      "Hollow Candle",
      "Pale Bell",
      "Wilted Bloom",
      "Ashen Prayer",
      "Silent Keepsake",
      "Dust of Evening",
    ];
    for (let i = 0; i < 50; i++) {
      const name = generateOfferingName("grief");
      expect(griefNames).toContain(name);
    }
  });
});
