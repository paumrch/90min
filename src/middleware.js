import { NextResponse } from "next/server";

export function middleware(request) {
  const response = NextResponse.next();
  const origin = request.headers.get("origin");
  const allowedOrigins = [
    "https://www.90minutes.xyz",
    "https://90minutes.xyz",
    "https://90min-delta.vercel.app/",
  ];

  if (origin && allowedOrigins.includes(origin)) {
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
