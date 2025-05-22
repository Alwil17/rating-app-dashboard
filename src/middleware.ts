import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { routes } from '@/config/routes';

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  const authToken = request.cookies.get('auth-token');
  const { pathname } = request.nextUrl;

  // Public paths that don't require authentication
  const isPublicPath = [
    routes.auth.login,
    routes.auth.register,
    '/api/auth',
  ].some(path => pathname.startsWith(path));

  // If the path is public and user is authenticated, redirect to dashboard
  if (isPublicPath && authToken) {
    return NextResponse.redirect(new URL(routes.board.home, request.url));
  }

  // If the path is protected and user is not authenticated, redirect to login
  if (!isPublicPath && !authToken) {
    const response = NextResponse.redirect(new URL(routes.auth.login, request.url));
    response.cookies.delete('auth-token');
    return response;
  }

  return NextResponse.next();
}

// Configure which paths the middleware should run on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|public).*)',
  ],
}; 