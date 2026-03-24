import { isValidEmail } from './validation';

test('accepts valid emails', () => {
  expect(isValidEmail('test@example.com')).toBe(true);
});

test('rejects invalid emails', () => {
  expect(isValidEmail('invalid-email')).toBe(false);
  expect(isValidEmail('test@')).toBe(false);
  expect(isValidEmail('')).toBe(false);
});
