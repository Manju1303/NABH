import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * HIGH-07 FIX: Route guard middleware
 * Protects /dashboard/* routes — redirects to /login if no token.
 */
export function middleware(request: NextRequest) {
  const token = request.cookies.get('nabh_token')?.value
    || request.headers.get('authorization')?.replace('Bearer ', '');

  const isProtected = request.nextUrl.pathname.startsWith('/dashboard');
  const isLoginPage = request.nextUrl.pathname === '/login';

  // Check localStorage via a custom header set by the client (see layout.tsx)
  const hasClientToken = request.headers.get('x-has-token') === 'true';

  if (isProtected && !token && !hasClientToken) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', request.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*'],
};
