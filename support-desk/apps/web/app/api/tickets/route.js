import { NextResponse } from 'next/server';
import { ticketQueue } from '@/lib/bullmq'; // Ensure this points to your BullMQ config

export async function POST(req) {
  try {
    const { subject, message, userId } = await req.json();

    // 1. Add the ticket job to the queue [cite: 141, 184]
    const job = await ticketQueue.add('ai-auto-response', {
      subject,
      message,
      userId,
      ticketId: Date.now().toString(), // Temporary ID for testing
    });

    return NextResponse.json({ 
      success: true, 
      jobId: job.id, 
      message: "Ticket submitted. AI assistant is analyzing..." 
    });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create ticket" }, { status: 500 });
  }
}