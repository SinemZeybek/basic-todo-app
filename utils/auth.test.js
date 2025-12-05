import { canAccessAdmin, canAccessTodos } from './auth';

test('super_admin can access admin panel', () => {
  expect(canAccessAdmin('super_admin')).toBe(true);
});

test('normal user cannot access admin panel', () => {
  expect(canAccessAdmin('user')).toBe(false);
});

test('authenticated user can access todos', () => {
  expect(canAccessTodos(true)).toBe(true);
});

test('unauthenticated user cannot access todos', () => {
  expect(canAccessTodos(false)).toBe(false);
});
