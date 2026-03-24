import { NextResponse } from "next/server";
import { chatQueue } from '@/lib/bullmq';

export async function POST(request) {
  try {
    const body = await request.json();
    const { message, userId } = body;

    // Validation
    if (!message || typeof message !== "string") {
      return NextResponse.json({ error: "Message is required" }, { status: 400 });
    }

    // Add job to queue
    const job = await chatQueue.add(
      "process-ai-response",
      { message, userId },
      {
        attempts: 3, // Retry mechanism
        backoff: { type: "exponential", delay: 1000 },
        removeOnComplete: false,
        removeOnFail: false,
      }
    );

    return NextResponse.json({
      jobId: job.id,
      status: "queued",
    });
  } catch (error) {
    console.error("Error in /api/queue:", error);
    return NextResponse.json({ error: "Could not add job to queue" }, { status: 500 });
  }
}