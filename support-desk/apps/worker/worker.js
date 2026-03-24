import { Worker } from 'bullmq';
import Redis from 'ioredis';
import { OpenAI } from 'openai';

const connection = new Redis(process.env.REDIS_URL || 'redis://chat-redis:6379', {
  maxRetriesPerRequest: null 
});
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const worker = new Worker('ticket-queue', async (job) => {
  const { ticketId, subject, message } = job.data;
  console.log(`Processing AI Response for Ticket ID: ${ticketId}`);

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { 
          role: "system", 
          content: "You are an AI Support Agent. Provide a helpful response to the user's ticket." 
        },
        { 
          role: "user", 
          content: `Subject: ${subject}\n\nMessage: ${message}` 
        }
      ],
    });

    const aiResponse = completion.choices[0].message.content;

    await job.updateData({ ...job.data, aiSuggestion: aiResponse });
    
    return aiResponse;
  } catch (error) {
    console.error("Worker Error:", error);
    throw error;
  }
}, { connection });

worker.on('completed', (job) => {
  console.log(`Ticket Job ${job.id} completed.`);
});

worker.on('failed', (job, err) => {
  console.error(`Ticket Job ${job.id} failed: ${err.message}`);
});