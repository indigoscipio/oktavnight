import type { Offering, LocalOfferingState, InteractionResult } from "./types";

export function witnessOffering(
  offering: Offering,
  localState: LocalOfferingState
): { offering: Offering; localState: LocalOfferingState; result: InteractionResult } {
  if (localState.witnessedOfferingIds.includes(offering.id)) {
    return {
      offering,
      localState,
      result: { success: false, message: "Thou hast already borne witness here." },
    };
  }

  return {
    offering: { ...offering, witnessCount: offering.witnessCount + 1 },
    localState: {
      ...localState,
      witnessedOfferingIds: [...localState.witnessedOfferingIds, offering.id],
    },
    result: { success: true, message: "Another soul hath borne witness." },
  };
}

export function lightCandle(
  offering: Offering,
  localState: LocalOfferingState
): { offering: Offering; localState: LocalOfferingState; result: InteractionResult } {
  if (localState.candleOfferingIds.includes(offering.id)) {
    return {
      offering,
      localState,
      result: { success: false, message: "A flame already burns here." },
    };
  }

  return {
    offering: { ...offering, candleCount: offering.candleCount + 1 },
    localState: {
      ...localState,
      candleOfferingIds: [...localState.candleOfferingIds, offering.id],
    },
    result: { success: true, message: "A flame flickers in the dark." },
  };
}

export function releaseOfferingLocally(
  offeringId: string,
  localState: LocalOfferingState
): LocalOfferingState {
  if (localState.releasedOfferingIds.includes(offeringId)) {
    return localState;
  }
  return {
    ...localState,
    releasedOfferingIds: [...localState.releasedOfferingIds, offeringId],
  };
}

export function reportOffering(
  offering: Offering,
  localState: LocalOfferingState
): { offering: Offering; localState: LocalOfferingState; result: InteractionResult } {
  if (localState.reportedOfferingIds.includes(offering.id)) {
    return {
      offering,
      localState,
      result: { success: false, message: "Thou hast already spoken." },
    };
  }

  return {
    offering: { ...offering, reportCount: offering.reportCount + 1 },
    localState: {
      ...localState,
      reportedOfferingIds: [...localState.reportedOfferingIds, offering.id],
    },
    result: { success: true, message: "The matter hath been noted." },
  };
}
