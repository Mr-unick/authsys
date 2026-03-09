import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';
import { hasroutepermission } from './utils/authroization';

/**
 * Next.js Middleware — runs before every request.
 * Handles authentication and basic route-level authorization.
 */
export async function middleware(request) {
  const token = request.cookies.get('token');
  const { pathname } = request.nextUrl;

  // Allow API routes to handle their own auth/responses
  if (pathname.startsWith('/api')) {
    return NextResponse.next();
  }

  // Redirect old login path to new signin path
  if (pathname === '/login') {
    return NextResponse.redirect(new URL('/signin', request.url));
  }

  // Redirect unauthenticated users to signin (except for public landing page)
  if (!token && pathname !== '/signin' && pathname !== '/') {
    return NextResponse.redirect(new URL('/signin', request.url));
  }

  // Redirect authenticated users away from signin page to CRM dashboard
  if (token && pathname === '/signin') {
    return NextResponse.redirect(new URL('/crm', request.url));
  }

  // Verify token for authenticated routes
  if (token) {
    try {
      const secretKey = new TextEncoder().encode(
        process.env.JWT_SECRET || 'change-this-to-a-strong-secret-key-in-production'
      );
      const { payload } = await jwtVerify(token.value, secretKey);

      // Route-level permission check
      const lastSegment = pathname.split('/').pop();
      if (lastSegment && !hasroutepermission(payload, lastSegment)) {
        // User doesn't have permission
      }
    } catch (error) {
      // Token invalid or expired — clear cookie and redirect to signin
      if (pathname === '/signin') {
        const response = NextResponse.next();
        response.cookies.set('token', '', { expires: new Date(0) });
        return response;
      }
      const response = NextResponse.redirect(new URL('/signin', request.url));
      response.cookies.set('token', '', { expires: new Date(0) });
      return response;
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};