import type { Offering } from "../domain/types";
import * as api from "../api/client";

export async function fetchOfferings(): Promise<Offering[]> {
  return api.getOfferings();
}
