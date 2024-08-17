import { NextResponse } from "next/server";

const allowedOrigins = new Set([
  "https://www.90minutes.xyz",
  "https://90minutes.xyz",
  "https://90min-delta.vercel.app",
]);

export function middleware(request) {
  const response = NextResponse.next();
  const origin = request.headers.get("origin");

  if (origin && allowedOrigins.has(origin)) {
    response.headers.set("Access-Control-Allow-Origin", origin);
  }

  response.headers.set(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS"
  );
  response.headers.set(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization"
  );

  return response;
}

export const config = {
  matcher: "/api/:path*",
};
