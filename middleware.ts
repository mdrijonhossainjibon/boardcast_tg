import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Simplified middleware without NextAuth edge runtime
export function middleware(request: NextRequest) {
  // Allow login page and API routes
  if (
    request.nextUrl.pathname.startsWith("/login") ||
    request.nextUrl.pathname.startsWith("/api")
  ) {
    return NextResponse.next();
  }

  // For now, allow all requests - auth will be handled by SessionProvider
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
