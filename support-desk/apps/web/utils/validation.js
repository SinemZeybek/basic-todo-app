export function isValidEmail(email) {
  if (!email || typeof email !== 'string') return false;
  // Standard email validation: local@domain.tld
  // - Local part: letters, numbers, and common special chars
  // - Domain: at least two labels separated by dots, TLD at least 2 chars
  return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email);
}
