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

export function getTimeUntilFadeLabel(offering: Offering, now: Date): string {
  const msLeft = new Date(offering.expiresAt).getTime() - now.getTime();
  if (msLeft <= 0) return "fading now";
  const hoursLeft = msLeft / (1000 * 60 * 60);
  if (hoursLeft < 1) return "fades soon";
  if (hoursLeft < 6) return "fades tonight";
  if (hoursLeft < 12) return `fades in ${Math.ceil(hoursLeft)}h`;
  return "";
}
