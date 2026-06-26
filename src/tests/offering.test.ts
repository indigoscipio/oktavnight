import { describe, it, expect } from "vitest";
import { createOffering } from "../domain/offering";

describe("createOffering", () => {
  it("creates an offering with correct fields", () => {
    const offering = createOffering({
      body: "This is a test thought.",
      mood: "grief",
    });

    expect(offering.id).toBeTruthy();
    expect(offering.body).toBe("This is a test thought.");
    expect(offering.mood).toBe("grief");
    expect(offering.generatedName).toBeTruthy();
    expect(offering.status).toBe("active");
    expect(offering.witnessCount).toBe(0);
    expect(offering.candleCount).toBe(0);
    expect(offering.reportCount).toBe(0);
    expect(offering.createdAt).toBeTruthy();
    expect(offering.expiresAt).toBeTruthy();
    expect(offering.position.x).toBeGreaterThanOrEqual(8);
    expect(offering.position.x).toBeLessThanOrEqual(88);
    expect(offering.position.y).toBeGreaterThanOrEqual(12);
    expect(offering.position.y).toBeLessThanOrEqual(82);
  });

  it("sets expiresAt 24 hours after createdAt", () => {
    const before = Date.now();
    const offering = createOffering({ body: "test", mood: "rage" });
    const after = Date.now();

    const created = new Date(offering.createdAt).getTime();
    const expires = new Date(offering.expiresAt).getTime();

    expect(created).toBeGreaterThanOrEqual(before - 100);
    expect(created).toBeLessThanOrEqual(after + 100);
    expect(expires - created).toBe(24 * 60 * 60 * 1000);
  });

  it("accepts existingOfferings for position generation", () => {
    const existing = createOffering({ body: "first", mood: "grief" });
    const second = createOffering({
      body: "second",
      mood: "rage",
      existingOfferings: [existing],
    });

    expect(second.id).not.toBe(existing.id);
    expect(second.position.x).toBeGreaterThanOrEqual(8);
    expect(second.position.x).toBeLessThanOrEqual(88);
  });
});
