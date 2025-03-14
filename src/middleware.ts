import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
    const sessionCookie = request.cookies.get('authjs.session-token')?.value

    
    if (request.nextUrl.pathname === '/') {
        
        if (!sessionCookie) {
            return NextResponse.redirect(new URL('/login', request.url))
        }
    }

   
    if (request.nextUrl.pathname.startsWith('/login')) {
        
        if (sessionCookie) {
            return NextResponse.redirect(new URL('/', request.url))
        }
    }

    
    return NextResponse.next()
}