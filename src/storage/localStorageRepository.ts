import type { Offering, LocalOfferingState } from "../domain/types";
import { seedOfferings } from "../data/seedOfferings";

const OFFERINGS_KEY = "nocturne_offerings";
const VIEWER_KEY = "nocturne_viewer_state";

export function loadOfferings(): Offering[] {
  try {
    const raw = localStorage.getItem(OFFERINGS_KEY);
    if (raw) {
      return JSON.parse(raw) as Offering[];
    }
  } catch {
    // corrupted data, fall through to seed
  }
  saveOfferings(seedOfferings);
  return seedOfferings;
}

export function saveOfferings(offerings: Offering[]): void {
  localStorage.setItem(OFFERINGS_KEY, JSON.stringify(offerings));
}

export function loadViewerState(): LocalOfferingState {
  try {
    const raw = localStorage.getItem(VIEWER_KEY);
    if (raw) {
      return JSON.parse(raw) as LocalOfferingState;
    }
  } catch {
    // corrupted data, fall through to default
  }
  const defaultState: LocalOfferingState = {
    witnessedOfferingIds: [],
    candleOfferingIds: [],
    releasedOfferingIds: [],
    reportedOfferingIds: [],
  };
  saveViewerState(defaultState);
  return defaultState;
}

export function saveViewerState(state: LocalOfferingState): void {
  localStorage.setItem(VIEWER_KEY, JSON.stringify(state));
}

export function clearAllLocalData(): void {
  localStorage.removeItem(OFFERINGS_KEY);
  localStorage.removeItem(VIEWER_KEY);
}
