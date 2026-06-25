import type { Offering, LocalOfferingState, InteractionResult } from "./types";

export function witnessOffering(
  offering: Offering,
  localState: LocalOfferingState
): { offering: Offering; localState: LocalOfferingState; result: InteractionResult } {
  if (localState.witnessedOfferingIds.includes(offering.id)) {
    return {
      offering,
      localState,
      result: { success: false, message: "You have already witnessed this offering." },
    };
  }

  return {
    offering: { ...offering, witnessCount: offering.witnessCount + 1 },
    localState: {
      ...localState,
      witnessedOfferingIds: [...localState.witnessedOfferingIds, offering.id],
    },
    result: { success: true, message: "This offering has been witnessed." },
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
      result: { success: false, message: "A candle has already been lit here." },
    };
  }

  return {
    offering: { ...offering, candleCount: offering.candleCount + 1 },
    localState: {
      ...localState,
      candleOfferingIds: [...localState.candleOfferingIds, offering.id],
    },
    result: { success: true, message: "A candle was lit here." },
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
      result: { success: false, message: "You have already reported this offering." },
    };
  }

  return {
    offering: { ...offering, reportCount: offering.reportCount + 1 },
    localState: {
      ...localState,
      reportedOfferingIds: [...localState.reportedOfferingIds, offering.id],
    },
    result: { success: true, message: "This offering has been reported." },
  };
}
