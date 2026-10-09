import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { checkRateLimit } from './lib/rateLimit';

// Staff roles authorized to access the Admin Panel
const ALLOWED_ADMIN_ROLES = ['SUPER_ADMIN', 'STORE_MANAGER', 'INVENTORY_CLERK'];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const clientIp = request.headers.get('x-forwarded-for')?.split(',')[0].trim() || '127.0.0.1';

  // ------------------------------------------------------------------
  // 1. RATE LIMITING FOR ADMIN GATEWAY & LOGIN ATTEMPTS
  // ------------------------------------------------------------------
  if (
    pathname.startsWith('/portal-admin-login') ||
    pathname.startsWith('/api/auth/callback/admin-portal') ||
    pathname.startsWith('/api/admin')
  ) {
    const rateCheck = checkRateLimit(clientIp, 5, 60);

    if (!rateCheck.allowed) {
      console.warn(`[Security Alert] IP ${clientIp} exceeded 5 attempts per minute. Lockout active.`);

      if (pathname.startsWith('/api/')) {
        return new NextResponse(
          JSON.stringify({
            error: 'Too many login attempts. IP temporarily blocked for 60 seconds.',
            retryAfterSeconds: rateCheck.resetInSeconds,
          }),
          {
            status: 429,
            headers: {
              'Content-Type': 'application/json',
              'Retry-After': String(rateCheck.resetInSeconds),
            },
          }
        );
      }

      // Redirect browser attempts with query param trigger
      const lockoutUrl = new URL('/portal-admin-login', request.url);
      lockoutUrl.searchParams.set('error', 'RateLimitExceeded');
      lockoutUrl.searchParams.set('retryIn', String(rateCheck.resetInSeconds));
      return NextResponse.redirect(lockoutUrl);
    }
  }

  // ------------------------------------------------------------------
  // 2. ROLE-BASED ACCESS CONTROL (RBAC) FOR /admin/* AND /api/admin/*
  // ------------------------------------------------------------------
  if (pathname.startsWith('/admin') || pathname.startsWith('/api/admin')) {
    // In production NextAuth: read token via getToken({ req: request, secret: process.env.NEXTAUTH_SECRET })
    // Inspect session cookie
    const sessionCookie =
      request.cookies.get('__Secure-telex.session-token') ||
      request.cookies.get('telex.session-token');

    // Simulate token payload verification
    const roleHeader = request.headers.get('x-user-role');
    const userRole = roleHeader || 'SUPER_ADMIN'; // Fallback for local demo

    const isAuthorized = ALLOWED_ADMIN_ROLES.includes(userRole);

    if (!sessionCookie && !roleHeader && process.env.NODE_ENV === 'production') {
      const loginUrl = new URL('/portal-admin-login', request.url);
      loginUrl.searchParams.set('callbackUrl', encodeURIComponent(pathname));
      return NextResponse.redirect(loginUrl);
    }

    if (!isAuthorized) {
      if (pathname.startsWith('/api/')) {
        return new NextResponse(
          JSON.stringify({ error: 'Access Denied: Insufficient administrative privileges' }),
          { status: 403, headers: { 'Content-Type': 'application/json' } }
        );
      }
      return NextResponse.redirect(new URL('/unauthorized', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*', '/portal-admin-login', '/api/auth/callback/admin-portal'],
};
