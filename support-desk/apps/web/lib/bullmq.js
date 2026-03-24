import { Queue } from 'bullmq';
import Redis from 'ioredis';

const connection = new Redis(process.env.REDIS_URL || 'redis://chat-redis:6379', {
  maxRetriesPerRequest: null,
});

export const chatQueue = new Queue('chat-queue', { connection });
export { connection };