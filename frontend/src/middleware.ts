import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/request';

export function middleware(request: NextRequest) {
  // Check for the token in cookies (preferred for middleware) or just bypass for now
  // Since we use localStorage, middleware can't strictly see it.
  // Instead, we use client-side protection in the layouts.
  
  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*'],
};
