import { describe, it, expect } from "vitest";
import { validateOfferingBody } from "../domain/validation";

describe("validateOfferingBody", () => {
  it("accepts valid input", () => {
    const result = validateOfferingBody("This is a valid thought.");
    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it("rejects empty input", () => {
    const result = validateOfferingBody("");
    expect(result.valid).toBe(false);
    expect(result.errors.length).toBeGreaterThan(0);
  });

  it("rejects whitespace-only input", () => {
    const result = validateOfferingBody("   ");
    expect(result.valid).toBe(false);
  });

  it("rejects input over 280 characters", () => {
    const result = validateOfferingBody("a".repeat(281));
    expect(result.valid).toBe(false);
  });

  it("accepts input at exactly 280 characters", () => {
    const result = validateOfferingBody("a".repeat(280));
    expect(result.valid).toBe(true);
  });

  it("rejects input containing links", () => {
    const result = validateOfferingBody("Check this out https://example.com");
    expect(result.valid).toBe(false);
  });
});
