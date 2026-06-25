import type { Offering, LocalOfferingState } from "./types";

export function isOfferingExpired(offering: Offering, now: Date): boolean {
  return new Date(offering.expiresAt) <= now;
}

export function getVisibleOfferings(
  offerings: Offering[],
  localState: LocalOfferingState,
  now: Date
): Offering[] {
  return offerings.filter((o) => {
    if (isOfferingExpired(o, now)) return false;
    if (localState.releasedOfferingIds.includes(o.id)) return false;
    return true;
  });
}
