export function isValidEmail(email) {
    if (!email) return false;
    return /\S+@\S+\.\S+/.test(email);
  }
  