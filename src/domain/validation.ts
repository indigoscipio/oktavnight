export type ValidationResult = {
  valid: boolean;
  errors: string[];
};

export function validateOfferingBody(body: string): ValidationResult {
  const errors: string[] = [];

  if (!body || body.trim().length === 0) {
    errors.push("An offering must carry meaning.");
    return { valid: false, errors };
  }

  if (body.length > 280) {
    errors.push("Offerings may not exceed 280 marks.");
    return { valid: false, errors };
  }

  const urlRegex = /https?:\/\/[^\s]+|www\.[^\s]+/gi;
  if (urlRegex.test(body)) {
    errors.push("Offerings must bear no links, nor names, nor marks of the worldly.");
    return { valid: false, errors };
  }

  const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/;
  if (emailRegex.test(body)) {
    errors.push("Offerings must bear no links, nor names, nor marks of the worldly.");
    return { valid: false, errors };
  }

  const phoneRegex = /(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/;
  if (phoneRegex.test(body)) {
    errors.push("Offerings must bear no links, nor names, nor marks of the worldly.");
    return { valid: false, errors };
  }

  return { valid: true, errors };
}
