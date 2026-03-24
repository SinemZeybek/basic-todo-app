import { Queue } from "bullmq";

export const connection = {
  host: process.env.REDIS_HOST || "localhost",
  port: Number(process.env.REDIS_PORT) || 6379,
};

export const chatQueue = new Queue("chat-queue", { connection });
