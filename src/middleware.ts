import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

// Page routes
const protectedRoutes = ['/dashboard', '/orgs'];
const authRoutes = ['/login', '/signup'];

// API routes
const publicApiRoutes = ['/api/auth'];
const privateApiRoutes = ['/api/org', '/api/invite'];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
  const isApiRoute = pathname.startsWith('/api');

  // Handle API routes
  if (isApiRoute) {
    const isPublicApiRoute = publicApiRoutes.some((route) => pathname.startsWith(route));
    const isPrivateApiRoute = privateApiRoutes.some((route) => pathname.startsWith(route));

    // Allow public API routes (auth endpoints)
    if (isPublicApiRoute) {
      return NextResponse.next();
    }

    // Protect private API routes
    if (isPrivateApiRoute && !token) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // For other API routes (like /api/trpc), let them handle their own auth
    return NextResponse.next();
  }

  // Handle page routes (existing logic)
  const isProtectedRoute = protectedRoutes.some((route) => pathname.startsWith(route));
  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route));

  // Redirect to login if accessing protected route without auth
  if (isProtectedRoute && !token) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Redirect to dashboard if accessing auth routes while authenticated
  if (isAuthRoute && token) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\..*|onboarding).*)',
  ],
};
