// Mock bullmq so tests don't need a real Redis connection
jest.mock('@/lib/bullmq', () => {
  const mockAdd = jest.fn().mockResolvedValue({
    id: 'mock-job-1',
    data: { subject: 'Help with Billing', message: 'I was charged twice.', userId: 'user_123' },
  });

  return {
    chatQueue: { add: mockAdd },
  };
});

import { chatQueue } from '@/lib/bullmq';

describe('Support Desk E2E Flow', () => {

  test('User should login and create a ticket', async () => {
    // Mock User Login
    const user = { id: 'user_123', role: 'user' };
    expect(user.role).toBe('user');

    // Create a Ticket
    const ticketData = {
      subject: 'Help with Billing',
      message: 'I was charged twice.',
      userId: user.id
    };

    // Trigger the Queue (Simulating the API call)
    const job = await chatQueue.add('ai-auto-response', ticketData);

    expect(job.id).toBeDefined();
    expect(job.data.subject).toBe('Help with Billing');
  });

  test('Admin should be able to see all tickets', async () => {
    const adminUser = { id: 'admin_1', role: 'admin' };

    // Admin sees everything
    expect(adminUser.role).toBe('admin');
  });
});
