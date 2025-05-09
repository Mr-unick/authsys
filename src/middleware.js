import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';
import { hasroutepermission } from './utils/authroization';

export async function middleware(request) {

    const token = request.cookies.get('token');

    const response = NextResponse.next();

   

    const { pathname } = request.nextUrl

    // Allow login API route through
    if (pathname === '/api/auth/login') {
      return NextResponse.next()
    }
  
    // Redirect to login if token is missing
    if (!token && pathname !== '/login') {
      return NextResponse.redirect(new URL('/login', request.url))
    }
  
    // Redirect to homepage if user is logged in and tries to access login
    if (token && pathname === '/login') {
      return NextResponse.redirect(new URL('/', request.url))
    }



    return response;
}

export const config = {
    matcher: ['/((?!_next|api/).*)'], // only skips static and API routes
  };
  