import { NextResponse } from 'next/server';

export async function GET() {
  const stats = {
    totalTickets: 2,
    resolvedTickets: 1,
    pendingTickets: 1,
    aiSuccessRatio: "85%"
  };

  return NextResponse.json(stats);
}