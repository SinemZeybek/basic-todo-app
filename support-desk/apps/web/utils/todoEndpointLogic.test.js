import { validateTodoPayload } from './todoEndpointLogic';

test('accepts valid todo payload', () => {
  const result = validateTodoPayload({ title: 'My task' });
  expect(result.ok).toBe(true);
});

test('rejects empty title', () => {
  const result = validateTodoPayload({ title: '   ' });
  expect(result.ok).toBe(false);
  expect(result.error).toBe('Title is required');
});

test('rejects missing body', () => {
  const result = validateTodoPayload(null);
  expect(result.ok).toBe(false);
});

test('rejects missing title field', () => {
  const result = validateTodoPayload({});
  expect(result.ok).toBe(false);
});
