import { chatQueue } from '@/lib/bullmq';
import { NextResponse } from 'next/server';

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const jobId = searchParams.get('id');

  if (!jobId) {
    return NextResponse.json({ error: 'Job ID is required' }, { status: 400 });
  }

  const job = await chatQueue.getJob(jobId);

  if (!job) {
    return NextResponse.json({ error: 'Job not found' }, { status: 404 });
  }

  const state = await job.getState(); // pending, completed, failed, active 
  const result = job.returnvalue;

  return NextResponse.json({ 
    id: job.id, 
    status: state, 
    data: state === 'completed' ? result : null 
  });
}