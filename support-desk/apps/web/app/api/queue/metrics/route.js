import { NextResponse } from 'next/server';
import { chatQueue } from '@/lib/bullmq';

export async function GET() {
  const counts = await chatQueue.getJobCounts('wait', 'completed', 'failed');
  return NextResponse.json(counts);
}
