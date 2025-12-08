import { createClient } from 'redis';

let client;

export function getRedisClient() {
  if (!client) {
    client = createClient({
      socket: {
        host: process.env.REDIS_HOST || 'localhost',
        port: Number(process.env.REDIS_PORT) || 6379,
      },
    });

    client.on('error', (err) => {
      console.error('Redis error:', err);
    });

    client.connect();
  }

  return client;
}
