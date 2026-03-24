const jsonMock = jest.fn((body, init = {}) => ({
  json: async () => body,
  status: init.status ?? 200,
}));

jest.mock('next/server', () => ({
  NextResponse: { json: jsonMock },
}));

const mockAdd = jest.fn().mockResolvedValue({
  id: 'job-123',
});

jest.mock('@/lib/bullmq', () => ({
  ticketQueue: { add: mockAdd },
}));

const { POST } = require('@/app/api/tickets/route');

function mockRequest(body) {
  return {
    json: async () => body,
  };
}

describe('POST /api/tickets', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('creates a ticket and returns job id', async () => {
    const ticketData = {
      subject: 'Login Issue',
      message: 'Cannot log in',
      userId: 'user-1',
    };

    await POST(mockRequest(ticketData));

    expect(mockAdd).toHaveBeenCalledWith(
      'ai-auto-response',
      expect.objectContaining({
        subject: 'Login Issue',
        message: 'Cannot log in',
        userId: 'user-1',
      })
    );
    expect(jsonMock).toHaveBeenCalledWith(
      expect.objectContaining({
        success: true,
        jobId: 'job-123',
      })
    );
  });

  it('returns 500 when queue fails', async () => {
    mockAdd.mockRejectedValueOnce(new Error('Redis down'));

    await POST(mockRequest({ subject: 'Test', message: 'Test', userId: '1' }));

    expect(jsonMock).toHaveBeenCalledWith(
      { error: 'Failed to create ticket' },
      { status: 500 }
    );
  });
});
