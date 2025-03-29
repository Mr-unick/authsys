import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';
import { hasroutepermission } from './utils/authroization';

export async function middleware(request) {

    const token = request.cookies.get('token');

    const response = NextResponse.next();

    response.headers.set('X-Custom-Header', 'My custom header value');


    if (request.url == '/api/auth/login') {
        return response;
    }

    if (!token) {
        return NextResponse.redirect(new URL('/login', request.url));
    }


    if (token && request.url == '/login') {

        return NextResponse.redirect(new URL('/', request.url));

    }



    return response;
}

export const config = {
    matcher: ['/((?!login|_next|api/auth/login).*)'],
};