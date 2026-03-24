import { NextResponse } from "next/server";

export function middleware(request) {
  const { method } = request;
  const { pathname } = request.nextUrl;

  const requestId = crypto.randomUUID();

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-request-id", requestId);

  console.log(`[Request] id=${requestId} ${method} ${pathname}`);

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}

export const config = {
  matcher: ["/api/:path*"],
};


export function logTicketActivity(action, ticketId) {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ACTION: ${action} | TICKET_ID: ${ticketId}`);
}