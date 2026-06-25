import type { LocalOfferingState } from "../domain/types";

const VIEWER_KEY = "nocturne_viewer_state";

export function loadViewerState(): LocalOfferingState {
  const defaults: LocalOfferingState = {
    createdOfferingIds: [],
    witnessedOfferingIds: [],
    candleOfferingIds: [],
    releasedOfferingIds: [],
    reportedOfferingIds: [],
  };

  try {
    const raw = localStorage.getItem(VIEWER_KEY);
    if (raw) {
      const loaded = JSON.parse(raw) as Partial<LocalOfferingState>;
      return { ...defaults, ...loaded };
    }
  } catch {
    // corrupted data, fall through to default
  }

  saveViewerState(defaults);
  return defaults;
}

export function saveViewerState(state: LocalOfferingState): void {
  localStorage.setItem(VIEWER_KEY, JSON.stringify(state));
}

export function clearViewerState(): void {
  localStorage.removeItem(VIEWER_KEY);
}
