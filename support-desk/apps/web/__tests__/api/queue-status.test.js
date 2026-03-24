const jsonMock = jest.fn((body, init = {}) => ({
  json: async () => body,
  status: init.status ?? 200,
}));

jest.mock('next/server', () => ({
  NextResponse: { json: jsonMock },
}));

const mockGetJob = jest.fn();

jest.mock('@/lib/bullmq', () => ({
  chatQueue: { getJob: mockGetJob },
}));

const { GET } = require('@/app/api/queue/status/route');

function mockRequest(url) {
  return { url };
}

describe('GET /api/queue/status', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns job status when job exists', async () => {
    mockGetJob.mockResolvedValue({
      id: 'job-1',
      getState: jest.fn().mockResolvedValue('completed'),
      returnvalue: { reply: 'AI response' },
    });

    await GET(mockRequest('http://localhost/api/queue/status?id=job-1'));

    expect(jsonMock).toHaveBeenCalledWith({
      id: 'job-1',
      status: 'completed',
      data: { reply: 'AI response' },
    });
  });

  it('returns null data when job is not completed', async () => {
    mockGetJob.mockResolvedValue({
      id: 'job-2',
      getState: jest.fn().mockResolvedValue('active'),
      returnvalue: null,
    });

    await GET(mockRequest('http://localhost/api/queue/status?id=job-2'));

    expect(jsonMock).toHaveBeenCalledWith({
      id: 'job-2',
      status: 'active',
      data: null,
    });
  });

  it('returns 400 when job id is missing', async () => {
    await GET(mockRequest('http://localhost/api/queue/status'));

    expect(jsonMock).toHaveBeenCalledWith(
      { error: 'Job ID is required' },
      { status: 400 }
    );
  });

  it('returns 404 when job is not found', async () => {
    mockGetJob.mockResolvedValue(null);

    await GET(mockRequest('http://localhost/api/queue/status?id=nonexistent'));

    expect(jsonMock).toHaveBeenCalledWith(
      { error: 'Job not found' },
      { status: 404 }
    );
  });
});
