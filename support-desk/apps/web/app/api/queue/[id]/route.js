import { NextResponse } from "next/server";
import { chatQueue } from "@/lib/queueClient";

export async function GET(_request, { params }) {
  try {
    const jobId = params.id;
    const job = await chatQueue.getJob(jobId);

    if (!job) {
      return NextResponse.json({ error: "Job not found" }, { status: 404 });
    }

    const state = await job.getState(); // waiting, active, completed, failed, delayed

    const response = {
      jobId: job.id,
      state,
      progress: job.progress,
      result: job.returnvalue ?? null,
      failedReason: job.failedReason ?? null,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Error in GET /api/queue/[id]:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
