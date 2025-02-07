import { NextRequest, NextResponse } from 'next/server';

export function middleware(NextRequest) {

    const token = NextRequest.cookies.get('authToken'); 

    const responce = NextResponse.next();

    responce.headers.set('X-Custom-Header', 'My custom header value')

    // if (!token) {
     
    //     return NextResponse.redirect(new URL('/login', NextRequest.url)); 
    // }

  

   
    return NextResponse.next();
}

export const config = {
    matcher: ['/'], 
};

// export const config = {
//     matcher: ['/((?!login|_next).*)'], 
// };