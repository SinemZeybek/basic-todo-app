import { createClient } from 'redis';

let client;
let connectPromise;

export async function getRedisClient() {
  if (!client) {
    client = createClient({
      socket: {
        host: process.env.REDIS_HOST || 'localhost',
        port: Number(process.env.REDIS_PORT) || 6379,
      },
      password: process.env.REDIS_PASSWORD || undefined,
    });

    client.on('error', (err) => {
      console.error('Redis error:', err);
    });

    connectPromise = client.connect();
  }

  await connectPromise;
  return client;
}
