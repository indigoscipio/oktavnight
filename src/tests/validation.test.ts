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

  it("rejects https links", () => {
    const result = validateOfferingBody("Check this out https://example.com");
    expect(result.valid).toBe(false);
  });

  it("rejects www links", () => {
    const result = validateOfferingBody("Visit www.example.com for more");
    expect(result.valid).toBe(false);
  });

  it("rejects email addresses", () => {
    const result = validateOfferingBody("Contact me at hello@example.com");
    expect(result.valid).toBe(false);
  });

  it("rejects phone-number-like strings", () => {
    const result = validateOfferingBody("Call me at 555-123-4567");
    expect(result.valid).toBe(false);
  });
});
