/**
 * Lightweight, robust input validation and sanitization for TheLetterInk.
 */

const EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;

export function isValidEmail(email: unknown): email is string {
  if (typeof email !== "string") return false;
  const trimmed = email.trim();
  if (trimmed.length === 0 || trimmed.length > 254) return false;
  return EMAIL_REGEX.test(trimmed);
}

export function sanitizeText(val: unknown, maxLength = 2000): string {
  if (typeof val !== "string") return "";
  // Strip control characters while keeping whitespace/newlines, trim, and cap length
  return val
    .replace(/[\u0000-\u0008\u000B-\u001F\u007F-\u009F]/g, "")
    .trim()
    .slice(0, maxLength);
}

export function isValidRating(rating: unknown): rating is number {
  const num = typeof rating === "number" ? rating : Number(rating);
  return Number.isInteger(num) && num >= 1 && num <= 5;
}

export function isValidId(id: unknown): id is string {
  if (typeof id !== "string") return false;
  const trimmed = id.trim();
  return trimmed.length > 0 && trimmed.length <= 128 && /^[a-zA-Z0-9_\-:]+$/.test(trimmed);
}

export function isValidQuantity(qty: unknown, min = 1, max = 99): qty is number {
  const num = typeof qty === "number" ? qty : Number(qty);
  return Number.isInteger(num) && num >= min && num <= max;
}
