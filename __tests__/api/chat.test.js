/**
 * Chat endpoint unit test (mocked OpenAI + mocked Redis + mocked NextResponse)
 *
 * We mock:
 * - next/server (NextResponse.json)
 * - Redis client
 * - OpenAI SDK
 *
 * This way, the test does not depend on real network, Redis,
 * or the real Next.js server runtime.
 */

// Mock NextResponse from next/server
const jsonMock = jest.fn((body, init = {}) => ({
    json: async () => body,
    status: init.status ?? 200,
  }));
  
  jest.mock("next/server", () => {
    return {
      NextResponse: {
        json: jsonMock,
      },
    };
  });
  
  // Mock Redis client
  jest.mock("@/lib/redisClient", () => ({
    getRedisClient: () => ({
      lRange: jest.fn().mockResolvedValue([]), // no previous messages
      rPush: jest.fn().mockResolvedValue(true),
      lTrim: jest.fn().mockResolvedValue(true),
    }),
  }));
  
  // Mock OpenAI SDK
  jest.mock("openai", () => {
    return jest.fn().mockImplementation(() => ({
      chat: {
        completions: {
          create: jest.fn().mockResolvedValue({
            choices: [{ message: { content: "Mock AI reply" } }],
          }),
        },
      },
    }));
  });
  
  // Import the handler AFTER all mocks are defined
  const { POST } = require("@/app/api/chat/route");
  
  // Minimal request mock: only json() is required by the handler
  function mockRequest(body) {
    return {
      json: async () => body,
    };
  }
  
  describe("POST /api/chat", () => {
    beforeEach(() => {
      jsonMock.mockClear();
    });
  
    it("returns assistant reply when a valid message is sent", async () => {
      const req = mockRequest({ message: "Hello" });
      const res = await POST(req);
      const json = await res.json();
  
      expect(json.reply).toBe("Mock AI reply");
      // Optionally verify NextResponse.json was called
      expect(jsonMock).toHaveBeenCalled();
    });
  
    it("returns 400 error when message is missing", async () => {
      const req = mockRequest({});
      const res = await POST(req);
  
      expect(res.status).toBe(400);
  
      const json = await res.json();
      expect(json.error).toBe("Message is required");
    });
  });
  