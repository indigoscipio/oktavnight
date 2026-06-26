import type { Offering } from "../domain/types";

const BASE = import.meta.env.VITE_API_BASE || "/api";

export async function getOfferings(): Promise<Offering[]> {
  const res = await fetch(`${BASE}/offerings`);
  if (!res.ok) throw new Error("Failed to fetch offerings");
  return res.json();
}

export async function postOffering(offering: Offering): Promise<Offering> {
  const res = await fetch(`${BASE}/offerings`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(offering),
  });
  if (!res.ok) throw new Error("Failed to create offering");
  return res.json();
}

export async function postAction(
  offeringId: string,
  action: "witness" | "candle" | "report"
): Promise<Offering> {
  const res = await fetch(`${BASE}/offerings/${offeringId}/${action}`, {
    method: "POST",
  });
  if (!res.ok) throw new Error(`Failed to ${action} offering`);
  return res.json();
}
