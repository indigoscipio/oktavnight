import { describe, it, expect } from "vitest";
import { isOfferingExpired, getVisibleOfferings, getTimeUntilFadeLabel } from "../domain/expiration";
import type { Offering } from "../domain/types";

function makeOffering(overrides: Partial<Offering> = {}): Offering {
  return {
    id: "test-1",
    body: "test",
    mood: "grief",
    generatedName: "Hollow Candle",
    status: "active",
    witnessCount: 0,
    candleCount: 0,
    reportCount: 0,
    createdAt: new Date().toISOString(),
    expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    position: { x: 50, y: 50 },
    ...overrides,
  };
}

describe("isOfferingExpired", () => {
  it("returns false for an offering that expires in the future", () => {
    const offering = makeOffering();
    expect(isOfferingExpired(offering, new Date())).toBe(false);
  });

  it("returns true for an offering that expires in the past", () => {
    const offering = makeOffering({
      expiresAt: new Date(Date.now() - 1000).toISOString(),
    });
    expect(isOfferingExpired(offering, new Date())).toBe(true);
  });

  it("returns true for an offering expiring exactly now", () => {
    const now = new Date();
    const offering = makeOffering({ expiresAt: now.toISOString() });
    expect(isOfferingExpired(offering, now)).toBe(true);
  });
});

describe("getVisibleOfferings", () => {
  const activeOffering = makeOffering({ id: "active-1" });
  const expiredOffering = makeOffering({
    id: "expired-1",
    expiresAt: new Date(Date.now() - 1000).toISOString(),
  });

  it("filters out expired offerings", () => {
    const visible = getVisibleOfferings(
      [activeOffering, expiredOffering],
      new Date()
    );
    expect(visible).toHaveLength(1);
    expect(visible[0].id).toBe("active-1");
  });
});

describe("getTimeUntilFadeLabel", () => {
  it("returns fading now for expired offering", () => {
    const offering = makeOffering({
      expiresAt: new Date(Date.now() - 1000).toISOString(),
    });
    expect(getTimeUntilFadeLabel(offering, new Date())).toBe("fading to ash");
  });

  it("returns fades soon for offering expiring within 1 hour", () => {
    const offering = makeOffering({
      expiresAt: new Date(Date.now() + 30 * 60 * 1000).toISOString(),
    });
    expect(getTimeUntilFadeLabel(offering, new Date())).toBe("fading soon");
  });

  it("returns fades tonight for offering expiring within 6 hours", () => {
    const offering = makeOffering({
      expiresAt: new Date(Date.now() + 3 * 60 * 60 * 1000).toISOString(),
    });
    expect(getTimeUntilFadeLabel(offering, new Date())).toBe("fading by nightfall");
  });

  it("returns fades in Xh for offering expiring within 12 hours", () => {
    const offering = makeOffering({
      expiresAt: new Date(Date.now() + 10 * 60 * 60 * 1000).toISOString(),
    });
    expect(getTimeUntilFadeLabel(offering, new Date())).toBe("fading in 10h");
  });

  it("returns empty string for offering with more than 12 hours left", () => {
    const offering = makeOffering({
      expiresAt: new Date(Date.now() + 20 * 60 * 60 * 1000).toISOString(),
    });
    expect(getTimeUntilFadeLabel(offering, new Date())).toBe("");
  });
});
