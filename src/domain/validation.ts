export type ValidationResult = {
  valid: boolean;
  errors: string[];
};

export function validateOfferingBody(body: string): ValidationResult {
  const errors: string[] = [];

  if (!body || body.trim().length === 0) {
    errors.push("An offering must contain something.");
    return { valid: false, errors };
  }

  if (body.length > 280) {
    errors.push("Offerings cannot be longer than 280 characters.");
    return { valid: false, errors };
  }

  const urlRegex = /https?:\/\/[^\s]+/gi;
  if (urlRegex.test(body)) {
    errors.push("Offerings cannot contain links.");
    return { valid: false, errors };
  }

  return { valid: true, errors };
}
