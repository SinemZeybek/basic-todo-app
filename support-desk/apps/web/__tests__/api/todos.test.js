const jsonMock = jest.fn((body, init = {}) => ({
  json: async () => body,
  status: init.status ?? 200,
}));

jest.mock('next/server', () => ({
  NextResponse: { json: jsonMock },
}));

const mockUser = { id: 'test-user-123' };

const mockSupabase = {
  auth: {
    getUser: jest.fn().mockResolvedValue({
      data: { user: mockUser },
      error: null,
    }),
  },
  from: jest.fn(),
};

jest.mock('@/lib/supabaseClient', () => ({
  supabase: mockSupabase,
}));

const { GET, POST, PATCH, DELETE } = require('@/app/api/todos/route');

function mockRequest(body, url = 'http://localhost/api/todos') {
  return {
    json: async () => body,
    url,
  };
}

describe('GET /api/todos', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockSupabase.auth.getUser.mockResolvedValue({
      data: { user: mockUser },
      error: null,
    });
  });

  it('returns todos for authenticated user', async () => {
    const todos = [{ id: '1', title: 'Test todo', is_complete: false }];
    const selectMock = jest.fn().mockReturnValue({
      eq: jest.fn().mockReturnValue({
        order: jest.fn().mockResolvedValue({ data: todos, error: null }),
      }),
    });
    mockSupabase.from.mockReturnValue({ select: selectMock });

    await GET(mockRequest({}));

    expect(jsonMock).toHaveBeenCalledWith(todos);
  });

  it('returns 401 when user is not authenticated', async () => {
    mockSupabase.auth.getUser.mockResolvedValue({
      data: { user: null },
      error: { message: 'Not authenticated' },
    });

    await GET(mockRequest({}));

    expect(jsonMock).toHaveBeenCalledWith(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  });
});

describe('POST /api/todos', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockSupabase.auth.getUser.mockResolvedValue({
      data: { user: mockUser },
      error: null,
    });
  });

  it('creates a todo with valid title', async () => {
    const newTodo = { id: '1', title: 'New todo', is_complete: false };
    mockSupabase.from.mockReturnValue({
      insert: jest.fn().mockReturnValue({
        select: jest.fn().mockResolvedValue({ data: [newTodo], error: null }),
      }),
    });

    await POST(mockRequest({ title: 'New todo' }));

    expect(jsonMock).toHaveBeenCalledWith(newTodo);
  });

  it('returns 400 when title is missing', async () => {
    await POST(mockRequest({}));

    expect(jsonMock).toHaveBeenCalledWith(
      { error: 'Invalid payload' },
      { status: 400 }
    );
  });

  it('returns 400 when title is empty', async () => {
    await POST(mockRequest({ title: '   ' }));

    expect(jsonMock).toHaveBeenCalledWith(
      { error: 'Title is required' },
      { status: 400 }
    );
  });
});

describe('PATCH /api/todos', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockSupabase.auth.getUser.mockResolvedValue({
      data: { user: mockUser },
      error: null,
    });
  });

  it('updates todo completion status', async () => {
    const updated = { id: '1', title: 'Test', is_complete: true };
    mockSupabase.from.mockReturnValue({
      update: jest.fn().mockReturnValue({
        eq: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            select: jest.fn().mockResolvedValue({ data: [updated], error: null }),
          }),
        }),
      }),
    });

    await PATCH(mockRequest({ id: '1', is_complete: true }));

    expect(jsonMock).toHaveBeenCalledWith(updated);
  });

  it('returns 400 when id is missing', async () => {
    await PATCH(mockRequest({ is_complete: true }));

    expect(jsonMock).toHaveBeenCalledWith(
      { error: 'Invalid payload: id and is_complete (boolean) are required' },
      { status: 400 }
    );
  });

  it('returns 400 when is_complete is not boolean', async () => {
    await PATCH(mockRequest({ id: '1', is_complete: 'yes' }));

    expect(jsonMock).toHaveBeenCalledWith(
      { error: 'Invalid payload: id and is_complete (boolean) are required' },
      { status: 400 }
    );
  });
});

describe('DELETE /api/todos', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockSupabase.auth.getUser.mockResolvedValue({
      data: { user: mockUser },
      error: null,
    });
  });

  it('deletes a todo by id', async () => {
    mockSupabase.from.mockReturnValue({
      delete: jest.fn().mockReturnValue({
        eq: jest.fn().mockReturnValue({
          eq: jest.fn().mockResolvedValue({ error: null }),
        }),
      }),
    });

    await DELETE(mockRequest({}, 'http://localhost/api/todos?id=1'));

    expect(jsonMock).toHaveBeenCalledWith({ success: true });
  });

  it('returns 400 when id is missing', async () => {
    await DELETE(mockRequest({}, 'http://localhost/api/todos'));

    expect(jsonMock).toHaveBeenCalledWith(
      { error: 'Missing required parameter: id' },
      { status: 400 }
    );
  });
});
