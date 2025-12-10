import { NextResponse } from "next/server";
import { randomUUID } from "crypto";

/**
 * Simple logging middleware for API routes.
 *
 * - Adds an `x-request-id` header to each request
 * - Logs the incoming method + URL with the request id
 */
export function middleware(request) {
  const { method } = request;
  const { pathname } = request.nextUrl;

  const requestId =
    randomUUID?.() ?? Math.random().toString(36).substring(2, 10);

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-request-id", requestId);

  console.log(`[Request] id=${requestId} ${method} ${pathname}`);

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}

/**
 * Apply middleware only to API routes.
 * You can narrow this down to `/api/chat` if you want.
 */
export const config = {
  matcher: ["/api/:path*"],
};
