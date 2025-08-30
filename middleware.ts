import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Only apply middleware to collection routes
  if (pathname.startsWith("/collection/")) {
    const slug = pathname.replace("/collection/", "");

    // Exclude common file extensions and dev tools files
    const excludePatterns = [
      /\.(js|css|map|ico|png|jpg|jpeg|gif|svg|woff|woff2|ttf|eot)$/i,
      /^installHook/,
      /^_next/,
      /^api/,
      /^favicon/,
    ];

    // Check if slug matches any exclude pattern
    const shouldExclude = excludePatterns.some((pattern) => pattern.test(slug));

    if (shouldExclude) {
      // Return 404 for these requests
      return new NextResponse(null, { status: 404 });
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/collection/:path*"],
};
