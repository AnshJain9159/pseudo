import {NextRequest , NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'
 export { default } from "next-auth/middleware"

 export const config = {
    matcher: ['/sign-in',
              '/sign-up',
              '/',
              '/features',
              '/pseudobot',
  ],
  };
  
// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {
    const token = await getToken({req:request});
    const url= request.nextUrl;

    if( token && 
        ( url.pathname.startsWith('/sign-in') ||
        url.pathname.startsWith('/sign-up') ||
        url.pathname==='/pseudobot' )
    ) {
        return NextResponse.redirect(new URL('/', request.url));
    }
    if (!token && (url.pathname.startsWith('/pseudobot') || url.pathname==='/features')) {
        return NextResponse.redirect(new URL('/sign-in', request.url));
      }
    
    return NextResponse.next();
}
 
// See "Matching Paths" below to learn more