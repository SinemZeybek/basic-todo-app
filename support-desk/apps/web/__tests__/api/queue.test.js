// Mock bullmq so tests don't need a real Redis connection
jest.mock('@/lib/bullmq', () => {
  const mockAdd = jest.fn().mockResolvedValue({
    id: 'mock-job-1',
    data: { message: 'Hello AI', userId: '123' },
  });

  return {
    chatQueue: { add: mockAdd },
  };
});

import { chatQueue } from '@/lib/bullmq';

describe('Queue Integration Test', () => {
  it('should add a job to the queue successfully', async () => {
    const jobData = { message: 'Hello AI', userId: '123' };
    const job = await chatQueue.add('test-job', jobData);

    expect(job.id).toBeDefined();
    expect(job.data.message).toBe(jobData.message);
  });
});
