import { describe, it, expect } from "vitest";
import {
  witnessOffering,
  lightCandle,
  releaseOfferingLocally,
  reportOffering,
} from "../domain/localViewerState";
import type { Offering, LocalOfferingState } from "../domain/types";

function makeOffering(id = "off-1"): Offering {
  return {
    id,
    body: "test",
    mood: "fear",
    generatedName: "Ashen Thorn",
    status: "active",
    witnessCount: 0,
    candleCount: 0,
    releaseCount: 0,
    reportCount: 0,
    createdAt: new Date().toISOString(),
    expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    position: { x: 50, y: 50 },
  };
}

function emptyState(): LocalOfferingState {
  return {
    createdOfferingIds: [],
    witnessedOfferingIds: [],
    candleOfferingIds: [],
    releasedOfferingIds: [],
    reportedOfferingIds: [],
  };
}

describe("witnessOffering", () => {
  it("allows witnessing an offering once", () => {
    const offering = makeOffering();
    const state = emptyState();
    const result = witnessOffering(offering, state);

    expect(result.result.success).toBe(true);
    expect(result.result.message).toBe("Another soul hath borne witness.");
    expect(result.offering.witnessCount).toBe(1);
    expect(result.localState.witnessedOfferingIds).toContain("off-1");
  });

  it("prevents witnessing the same offering twice", () => {
    const offering = makeOffering();
    const state: LocalOfferingState = {
      ...emptyState(),
      witnessedOfferingIds: ["off-1"],
    };
    const result = witnessOffering(offering, state);

    expect(result.result.success).toBe(false);
    expect(result.offering.witnessCount).toBe(0);
  });
});

describe("lightCandle", () => {
  it("allows lighting a candle once", () => {
    const offering = makeOffering();
    const state = emptyState();
    const result = lightCandle(offering, state);

    expect(result.result.success).toBe(true);
    expect(result.result.message).toBe("A flame flickers in the dark.");
    expect(result.offering.candleCount).toBe(1);
    expect(result.localState.candleOfferingIds).toContain("off-1");
  });

  it("prevents lighting a second candle", () => {
    const offering = makeOffering();
    const state: LocalOfferingState = {
      ...emptyState(),
      candleOfferingIds: ["off-1"],
    };
    const result = lightCandle(offering, state);

    expect(result.result.success).toBe(false);
    expect(result.offering.candleCount).toBe(0);
  });
});

describe("releaseOfferingLocally", () => {
  it("adds the offering id to released list", () => {
    const state = emptyState();
    const result = releaseOfferingLocally("off-1", state);
    expect(result.releasedOfferingIds).toContain("off-1");
  });

  it("is idempotent", () => {
    const state: LocalOfferingState = {
      ...emptyState(),
      releasedOfferingIds: ["off-1"],
    };
    const result = releaseOfferingLocally("off-1", state);
    expect(result.releasedOfferingIds).toEqual(["off-1"]);
  });
});

describe("reportOffering", () => {
  it("allows reporting once", () => {
    const offering = makeOffering();
    const state = emptyState();
    const result = reportOffering(offering, state);

    expect(result.result.success).toBe(true);
    expect(result.offering.reportCount).toBe(1);
    expect(result.localState.reportedOfferingIds).toContain("off-1");
  });

  it("prevents reporting twice", () => {
    const offering = makeOffering();
    const state: LocalOfferingState = {
      ...emptyState(),
      reportedOfferingIds: ["off-1"],
    };
    const result = reportOffering(offering, state);

    expect(result.result.success).toBe(false);
    expect(result.offering.reportCount).toBe(0);
  });
});
