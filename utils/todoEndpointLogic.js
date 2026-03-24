export function validateTodoPayload(body) {
    if (!body || typeof body.title !== 'string') {
      return { ok: false, error: 'Invalid payload' };
    }
    if (body.title.trim().length === 0) {
      return { ok: false, error: 'Title is required' };
    }
    return { ok: true };
  }
  