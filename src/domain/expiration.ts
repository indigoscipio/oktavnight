import type { Offering } from "./types";

export function isOfferingExpired(offering: Offering, now: Date): boolean {
  return new Date(offering.expiresAt) <= now;
}

export function getVisibleOfferings(
  offerings: Offering[],
  now: Date
): Offering[] {
  return offerings.filter((o) => {
    if (isOfferingExpired(o, now)) return false;
    return true;
  });
}

export function getTimeUntilFadeLabel(offering: Offering, now: Date): string {
  const msLeft = new Date(offering.expiresAt).getTime() - now.getTime();
  if (msLeft <= 0) return "fading to ash";
  const hoursLeft = msLeft / (1000 * 60 * 60);
  if (hoursLeft < 1) return "fading soon";
  if (hoursLeft < 6) return "fading by nightfall";
  if (hoursLeft < 12) return `fading in ${Math.ceil(hoursLeft)}h`;
  return "";
}
