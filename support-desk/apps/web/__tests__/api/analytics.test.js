const jsonMock = jest.fn((body, init = {}) => ({
  json: async () => body,
  status: init.status ?? 200,
}));

jest.mock('next/server', () => ({
  NextResponse: { json: jsonMock },
}));

const { GET } = require('@/app/api/analytics/route');

describe('GET /api/analytics', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns analytics stats', async () => {
    await GET();

    expect(jsonMock).toHaveBeenCalledWith(
      expect.objectContaining({
        totalTickets: expect.any(Number),
        resolvedTickets: expect.any(Number),
        pendingTickets: expect.any(Number),
        aiSuccessRatio: expect.any(String),
      })
    );
  });
});
