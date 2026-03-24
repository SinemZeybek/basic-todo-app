import { Worker } from "bullmq";
import OpenAI from "openai";
import { connection } from "../../../lib/bullmq.js"; 

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const KNOWLEDGE_TEXTS = [
  "This is an internal assistant for a Next.js app that includes auth, todos, and admin features.",
  "The queue worker processes messages asynchronously using BullMQ + Redis.",
];

const worker = new Worker(
  "chat-queue",
  async (job) => {
    const { message } = job.data; 

    try {
      const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          { 
            role: "system", 
            content: "You are a concise assistant." 
          },
          { 
            role: "system", 
            content: `Knowledge:\n${KNOWLEDGE_TEXTS.join("\n")}` 
          },
          { 
            role: "user", 
            content: String(message) 
          },
        ],
      });

      return {
        reply: completion.choices[0]?.message?.content ?? "",
      };
    } catch (err) {
      console.error(`[Worker] OpenAI error jobId=${job.id}:`, err);

      if (err?.status === 429 || err?.code === "insufficient_quota") {
        return {
          reply: "Simulated response (OpenAI quota exceeded).",
        };
      }
      throw err;
    }
  },
  {
    connection,
  }
);

worker.on("completed", (job) => {
  console.log(`[Worker] completed jobId=${job.id}`);
});

worker.on("failed", (job, err) => {
  console.error(`[Worker] failed jobId=${job?.id}:`, err);
});